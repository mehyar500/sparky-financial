import Stripe from 'npm:stripe@18.5.0';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const { origin, profileId } = await req.json();
    if (!origin || !profileId) return Response.json({ error: 'Missing checkout details' }, { status: 400 });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: 'price_1TtuQsApbu5IUz1d1PmAWfv1', quantity: 1 }],
      success_url: `${origin}/results?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/results?checkout=cancelled`,
      client_reference_id: profileId,
      metadata: { base44_app_id: Deno.env.get('BASE44_APP_ID'), profile_id: profileId }
    });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});