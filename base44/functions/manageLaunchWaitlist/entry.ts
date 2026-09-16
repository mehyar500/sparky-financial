import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// The unguessable email-link token authorizes only confirmation or unsubscribe, never record reads.
export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const { token, action } = await req.json();
    if (!/^[a-f0-9]{64}$/.test(token || '') || !['confirm', 'unsubscribe'].includes(action)) return Response.json({ error: 'Invalid link.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const store = base44.asServiceRole.entities.LaunchSubscriber;
    const rows = await store.filter({ token }, '-created_date', 1);
    const record = rows[0];
    if (!record) return Response.json({ error: 'Invalid link.' }, { status: 400 });
    if (action === 'unsubscribe') {
      await store.update(record.id, { status: 'unsubscribed', unsubscribed_at: new Date().toISOString() });
      return Response.json({ status: 'unsubscribed' });
    }
    if (record.status === 'unsubscribed') return Response.json({ status: 'unsubscribed' });
    await store.update(record.id, { status: 'confirmed', confirmed_at: record.confirmed_at || new Date().toISOString(), next_email_at: new Date().toISOString() });
    return Response.json({ status: 'confirmed' });
  } catch (error) {
    console.error('Waitlist preferences failed', error.message);
    return Response.json({ error: 'Could not save your preference. Please try again.' }, { status: 500 });
  }
}