import { loadStripe } from '@stripe/stripe-js';

// Use test keys for development - replace with live keys in production
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdef'; // Test key placeholder

if (!stripePublishableKey) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

export const stripePromise = loadStripe(stripePublishableKey);

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    interval: 'month',
    features: [
      '5 rescue sessions per month',
      'All core strategies',
      'Progress tracking',
      'Community support'
    ],
    limits: {
      sessionsPerMonth: 5
    }
  },
  pro_monthly: {
    name: 'Pro Developer',
    price: 19,
    priceId: 'price_1RUpnDK0aFmFV51vSQKWq1Tg',
    interval: 'month',
    features: [
      'Unlimited rescue sessions',
      'Custom prompt generator',
      'Advanced analytics',
      'Priority support',
      'Export session data'
    ],
    limits: {
      sessionsPerMonth: -1 // Unlimited
    }
  },
  pro_yearly: {
    name: 'Pro Developer',
    price: 190,
    priceId: 'price_1RUpnDK0aFmFV51vqCD84vGa',
    interval: 'year',
    features: [
      'Unlimited rescue sessions',
      'Custom prompt generator',
      'Advanced analytics',
      'Priority support',
      'Export session data',
      '2 months free'
    ],
    limits: {
      sessionsPerMonth: -1 // Unlimited
    }
  }
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;