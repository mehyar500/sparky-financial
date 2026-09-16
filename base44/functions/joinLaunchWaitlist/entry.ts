import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { CONSENT, LAUNCH_AT, isEmail, makeToken } from '../../shared/sparkyLaunch.js';

// Deliberately public, narrowly scoped opt-in endpoint. It never returns subscriber data or sends email.
export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const raw = await req.text();
    if (raw.length > 4096) return Response.json({ error: 'Request too large' }, { status: 413 });
    const body = JSON.parse(raw);
    if (body.website) return Response.json({ ok: true });
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!isEmail(email) || body.consent !== true) return Response.json({ error: 'A valid email and consent are required.' }, { status: 400 });
    if (Date.now() >= Date.parse(LAUNCH_AT)) return Response.json({ error: 'SparkyDollar has launched. Open the app to get started.' }, { status: 409 });
    const base44 = createClientFromRequest(req);
    const store = base44.asServiceRole.entities.LaunchSubscriber;
    const existing = await store.filter({ email }, '-created_date', 1);
    if (!existing.length) await store.create({
      email, status: 'pending', token: makeToken(), consent_at: new Date().toISOString(), consent_text: CONSENT,
      confirmation_sent: false, launch_sent: false, next_email_at: new Date().toISOString()
    });
    // No existence/status disclosure and no automatic reactivation of unsubscribed addresses.
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Waitlist signup failed', error.message);
    return Response.json({ error: 'Unable to save your request. Please try again.' }, { status: 500 });
  }
}