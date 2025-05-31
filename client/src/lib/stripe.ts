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
  pro: {
    name: 'Pro Developer',
    price: 19,
    priceId: 'price_test_pro', // Test price ID
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
  team: {
    name: 'Team',
    price: 49,
    priceId: 'price_test_team', // Test price ID  
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Shared session library',
      'Admin dashboard',
      'Custom integrations',
      'Dedicated support'
    ],
    limits: {
      sessionsPerMonth: -1, // Unlimited
      teamMembers: 10
    }
  }
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;