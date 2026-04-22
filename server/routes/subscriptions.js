import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price IDs — create these in Stripe dashboard
const PRICES = {
  monthly: 'price_1TOsakB2QYAuyINO9edaTi8H',
  yearly: 'price_1TOsbOB2QYAuyINOanBujU4i',
};

// POST /api/subscriptions/create-checkout
router.post('/create-checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['monthly', 'yearly'].includes(plan))
      return res.status(400).json({ message: 'Invalid plan' });

    let customerId = req.user.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.stripeCustomerId': customerId
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe?cancelled=true`,
      metadata: { userId: req.user._id.toString(), plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/subscriptions/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ message: 'Webhook signature failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;

    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    await User.findByIdAndUpdate(userId, {
      'subscription.status': 'active',
      'subscription.plan': plan,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await User.findOneAndUpdate(
      { 'subscription.stripeSubscriptionId': sub.id },
      { 'subscription.status': 'cancelled' }
    );
  }

  res.json({ received: true });
});

// POST /api/subscriptions/cancel
router.post('/cancel', protect, async (req, res) => {
  try {
    const { stripeSubscriptionId } = req.user.subscription;
    if (!stripeSubscriptionId)
      return res.status(400).json({ message: 'No active subscription found' });

    await stripe.subscriptions.cancel(stripeSubscriptionId);
    await User.findByIdAndUpdate(req.user._id, { 'subscription.status': 'cancelled' });

    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/subscriptions/status
router.get('/status', protect, async (req, res) => {
  res.json({ subscription: req.user.subscription });
});

export default router;