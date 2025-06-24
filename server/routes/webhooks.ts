import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "../storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

const PRICING_PLANS = {
  pro_monthly: {
    priceId: 'price_1RYjUZK0aFmFV51vgRokbSRm',
    name: 'Rescue Pro',
    price: 4.99,
    interval: 'month'
  },
  pro_yearly: {
    priceId: 'price_1RYjUZK0aFmFV51vqZP19L2k',
    name: 'Rescue Pro',
    price: 47.88,
    interval: 'year'
  }
};

export function registerWebhookRoutes(app: Express) {
  // Stripe webhook endpoint for trial signup completion
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
          console.log('WEBHOOK ERROR: Webhook secret not configured');
          return res.status(400).send('Webhook secret not configured');
        }
        
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('WEBHOOK: Signature verified for event:', event.type);
      } catch (err: any) {
        console.log(`WEBHOOK ERROR: Signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case 'setup_intent.succeeded':
          const setupIntent = event.data.object;
          
          if (setupIntent.metadata?.purpose === 'trial_signup') {
            const userId = setupIntent.metadata.userId;
            
            try {
              // Find user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              // If user doesn't exist, create them
              if (!user) {
                user = await storage.createUser({
                  username: `user_${userId.substring(0, 8)}`,
                  email: `${userId}@firebase.temp`,
                  role: "user"
                });
                console.log(`Created new user during trial setup: ${user.id}`);
              }

              // SECURITY: Check trial eligibility before activation
              const eligibility = await storage.isTrialEligible(user.id);
              if (!eligibility.eligible) {
                console.log(`🚨 TRIAL BLOCKED: ${eligibility.reason} for user ${user.id}`);
                throw new Error(`Trial activation blocked: ${eligibility.reason}`);
              }

              // Create subscription with trial for this customer
              const subscription = await stripe.subscriptions.create({
                customer: setupIntent.customer,
                items: [{
                  price: PRICING_PLANS.pro_monthly.priceId,
                }],
                trial_period_days: 3,
                default_payment_method: setupIntent.payment_method,
                metadata: {
                  userId: userId,
                  signupType: 'trial'
                }
              });

              // Start trial access after security validation
              await storage.startTrial(user.id);
              console.log(`✅ Trial activated for user ${user.id} after security validation`);
              
              // Update with Stripe customer and subscription info
              const customerIdForWebhook = typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id;
              await storage.updateUserSubscription(user.id, {
                stripeCustomerId: customerIdForWebhook || '',
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: 'trialing',
                subscriptionTier: 'trial'
              });
              
              console.log(`Trial subscription created for user ${userId}`);
            } catch (error) {
              console.error('Error processing trial setup:', error);
            }
          }
          break;

        case 'checkout.session.completed':
          const session = event.data.object;
          
          // Handle trial signup completion
          if (session.metadata?.signupType === 'trial') {
            const userId = session.metadata.userId;
            const feature = session.metadata.feature;
            
            try {
              // Find or create user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              // If user doesn't exist, create them (new signup flow)
              if (!user) {
                user = await storage.createUser({
                  username: `user_${userId.substring(0, 8)}`,
                  email: `${userId}@firebase.temp`,
                  role: "user"
                });
                console.log(`Created new user during trial signup: ${user.id}`);
              }

              // SECURITY: Check trial eligibility before activation
              const eligibility = await storage.isTrialEligible(user.id);
              if (!eligibility.eligible) {
                console.log(`🚨 TRIAL BLOCKED: ${eligibility.reason} for user ${user.id}`);
                throw new Error(`Trial activation blocked: ${eligibility.reason}`);
              }

              // Start trial access after security validation
              await storage.startTrial(user.id);
              console.log(`✅ Trial activated for user ${user.id} after security validation`);
              
              // Update with Stripe customer and subscription info if available
              if (session.customer && session.subscription) {
                await storage.updateUserSubscription(user.id, {
                  stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer.id,
                  stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription.id,
                  subscriptionStatus: 'trialing',
                  subscriptionTier: 'trial'
                });
              }
              
              console.log(`Trial access granted for user ${userId} (feature: ${feature})`);
            } catch (error) {
              console.error('Error processing trial signup:', error);
            }
          }
          
          // Handle regular subscription signup completion
          else if (session.metadata?.signupType === 'subscription') {
            const userId = session.metadata.userId;
            const plan = session.metadata.plan;
            
            try {
              // Find user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              if (!user) {
                console.error(`User not found for subscription signup: ${userId}`);
                throw new Error(`User not found: ${userId}`);
              }

              // Update with Stripe subscription info
              if (session.customer && session.subscription) {
                await storage.updateUserSubscription(user.id, {
                  stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer.id,
                  stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription.id,
                  subscriptionStatus: 'active',
                  subscriptionTier: plan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly'
                });
              }
              
              console.log(`Pro subscription activated for user ${userId} (plan: ${plan})`);
            } catch (error) {
              console.error('Error processing subscription signup:', error);
            }
          }
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Handle subscription changes after trial
          const subscription = event.data.object;
          
          if (subscription.metadata?.userId) {
            const userId = subscription.metadata.userId;
            
            try {
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              if (user) {
                const status = subscription.status;
                const tier = status === 'active' ? 'pro' : status === 'trialing' ? 'trial' : 'free';
                
                await storage.updateUserSubscription(user.id, {
                  stripeSubscriptionId: subscription.id,
                  subscriptionStatus: status,
                  subscriptionTier: tier,
                  subscriptionCurrentPeriodEnd: (subscription as any).current_period_end ? 
                    new Date((subscription as any).current_period_end * 1000) : undefined
                });
                
                console.log(`Subscription updated for user ${userId}: ${status}`);
              }
            } catch (error) {
              console.error('Error processing subscription update:', error);
            }
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
}