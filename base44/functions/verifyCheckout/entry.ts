import Stripe from 'npm:stripe@18.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const base44 = createClientFromRequest(req);
    const { sessionId, profileId } = await req.json();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid' || session.client_reference_id !== profileId) {
      return Response.json({ paid: false });
    }
    await base44.asServiceRole.entities.UserProfile.update(profileId, {
      is_paid: true,
      stripe_customer_id: String(session.customer || ''),
      stripe_subscription_id: String(session.subscription || '')
    });
    return Response.json({ paid: true });
  } catch (error) {
    console.error('Verification error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});