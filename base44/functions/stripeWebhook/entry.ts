import Stripe from 'npm:stripe@18.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    if (!signature) return Response.json({ error: 'Missing signature' }, { status: 400 });
    const event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET'));
    const base44 = createClientFromRequest(req);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const profileId = session.metadata?.profile_id;
      if (profileId) await base44.asServiceRole.entities.UserProfile.update(profileId, {
        is_paid: true,
        stripe_customer_id: String(session.customer || ''),
        stripe_subscription_id: String(session.subscription || '')
      });
    }
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const profiles = await base44.asServiceRole.entities.UserProfile.filter({ stripe_subscription_id: subscription.id });
      if (profiles[0]) await base44.asServiceRole.entities.UserProfile.update(profiles[0].id, { is_paid: false });
    }
    return Response.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});