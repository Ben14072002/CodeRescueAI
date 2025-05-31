import { loadStripe } from '@stripe/stripe-js';

// Use test keys for development - replace with live keys in production
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdef'; // Test key placeholder

if (!stripePublishableKey) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

export const stripePromise = loadStripe(stripePublishableKey);

export const PRICING_PLANS = {
  free: {
    name: 'Rescue Starter',
    price: 0,
    priceId: null,
    interval: 'month',
    features: [
      '3 AI rescues per month',
      'Basic problem detection',
      'Standard solution library',
      'Community support'
    ],
    limits: {
      sessionsPerMonth: 3
    }
  },
  pro_monthly: {
    name: 'Rescue Pro',
    price: 9.99,
    priceId: 'price_1RUpnDK0aFmFV51vSQKWq1Tg',
    interval: 'month',
    features: [
      'Unlimited AI rescues',
      'Advanced problem analysis',
      'Premium solution templates',
      'Priority email support',
      'Session history & analytics',
      'Custom prompt generator'
    ],
    limits: {
      sessionsPerMonth: -1 // Unlimited
    }
  },
  pro_yearly: {
    name: 'Rescue Pro',
    price: 95.88,
    priceId: 'price_1RUpnDK0aFmFV51vqCD84vGa',
    interval: 'year',
    features: [
      'Unlimited AI rescues',
      'Advanced problem analysis',
      'Premium solution templates',
      'Priority email support',
      'Session history & analytics',
      'Custom prompt generator',
      '20% annual savings'
    ],
    limits: {
      sessionsPerMonth: -1 // Unlimited
    }
  }
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;