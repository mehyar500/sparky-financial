import Stripe from 'npm:stripe@18.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const profiles = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date');
    const profile = profiles.find(p => p.is_paid && p.stripe_subscription_id);
    if (!profile) return Response.json({ error: 'No active subscription found' }, { status: 404 });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    // Cancel at period end so the user keeps access they already paid for.
    const sub = await stripe.subscriptions.update(profile.stripe_subscription_id, { cancel_at_period_end: true });
    const periodEnd = sub.items?.data?.[0]?.current_period_end || sub.current_period_end;
    return Response.json({ canceled: true, active_until: periodEnd ? new Date(periodEnd * 1000).toISOString() : null });
  } catch (error) {
    console.error('cancelSubscription error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});