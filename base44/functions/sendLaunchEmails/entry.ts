import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { LAUNCH_AT, isEmail, launchEmail } from '../../shared/sparkyLaunch.js';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { dryRun = false } = await req.json();
    const svc = base44.asServiceRole, store = svc.entities.LaunchSubscriber;
    const now = new Date().toISOString(), launched = Date.now() >= Date.parse(LAUNCH_AT);
    const filters = [{ status: 'pending', confirmation_sent: false, next_email_at: { $lte: now } }];
    if (launched) filters.unshift({ status: 'confirmed', launch_sent: false, next_email_at: { $lte: now } });
    let sent = 0, eligible = 0;
    for (const filter of filters) {
      // Bounded batches. Remaining records are picked up by the next scheduled run.
      const rows = await store.filter(filter, 'created_date', 20);
      eligible += rows.length;
      if (dryRun) continue;
      for (const row of rows) {
        const fresh = await store.get(row.id);
        const launch = filter.status === 'confirmed';
        if (!isEmail(fresh.email) || !fresh.consent_at || fresh.status !== filter.status || (launch ? fresh.launch_sent : fresh.confirmation_sent)) continue;
        try {
          await svc.integrations.Core.SendEmail(launchEmail(fresh, launch));
          await store.update(fresh.id, launch
            ? { launch_sent: true, launch_sent_at: new Date().toISOString(), email_error: '' }
            : { confirmation_sent: true, email_error: '' });
          sent++;
        } catch (error) {
          // A domain/sending restriction must not lose the signup or claim delivery.
          await store.update(fresh.id, { email_error: String(error.message).slice(0, 500), next_email_at: new Date(Date.now() + 86400000).toISOString() });
          console.warn('Launch email delivery deferred:', error.message);
          return Response.json({ sent, deferred: true });
        }
      }
    }
    return Response.json({ dryRun, launched, eligible, sent });
  } catch (error) {
    console.error('Launch email run failed', error.message);
    return Response.json({ error: 'Launch email run failed.' }, { status: 500 });
  }
}