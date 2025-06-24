import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "../storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

export function registerStatusRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get subscription status for a user with enhanced Pro detection
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find user by Firebase UID first, then by ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({
          tier: "free",
          status: "none",
          currentPeriodEnd: null
        });
      }

      // Check trial status
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      // Enhanced Pro detection for paid users with proper validation
      let finalTier = user.subscriptionTier || 'free';
      let finalStatus = user.subscriptionStatus || 'none';
      let autoUpgraded = false;

      // Verify Stripe subscription status before auto-upgrade
      if (user.stripeSubscriptionId && finalTier === 'free') {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          // Only auto-upgrade if Stripe confirms active subscription
          if (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing') {
            console.log(`VALIDATED FIX: User ${userId} has verified active Stripe subscription ${user.stripeSubscriptionId}. Auto-upgrading to Pro.`);
            
            finalTier = stripeSubscription.status === 'trialing' ? 'trial' : 'pro_monthly';
            finalStatus = stripeSubscription.status;
            autoUpgraded = true;
            
            // Update in database with verified Stripe data
            await storage.updateUserSubscription(user.id, {
              subscriptionTier: finalTier,
              subscriptionStatus: finalStatus,
              subscriptionCurrentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000)
            });
          } else {
            console.log(`SECURITY: User ${userId} has inactive Stripe subscription ${stripeSubscription.status}. Not upgrading.`);
          }
        } catch (stripeError) {
          console.error(`SECURITY: Failed to verify Stripe subscription for user ${userId}:`, stripeError);
          // Don't auto-upgrade if we can't verify with Stripe
        }
      }

      res.json({
        tier: finalTier,
        status: finalStatus,
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripeCustomerId: user.stripeCustomerId,
        autoUpgraded: autoUpgraded,
        trial: {
          isActive: trialStatus.isTrialActive,
          daysRemaining: trialStatus.daysRemaining,
          startDate: user.trialStartDate,
          endDate: user.trialEndDate
        }
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ error: "Failed to get subscription status" });
    }
  });

  // Trial system API routes
  app.get("/api/trial-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // FORCE NO CACHE - prevent 304 responses
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}"` // Always different ETag
      });
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const trialStatus = await storage.checkTrialStatus(user.id);
      res.json(trialStatus);
    } catch (error) {
      console.error('Error checking trial status:', error);
      res.status(500).json({ error: 'Failed to check trial status' });
    }
  });

  // SECURITY: Check trial eligibility endpoint
  app.get("/api/trial-eligibility/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const eligibility = await storage.isTrialEligible(user.id);
      res.json(eligibility);
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      res.status(500).json({ error: 'Failed to check trial eligibility' });
    }
  });

  // Start trial endpoint
  app.post("/api/start-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.startTrial(user.id);
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      res.json({ 
        success: true, 
        user: updatedUser,
        trialStatus: trialStatus
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      res.status(500).json({ error: 'Failed to start trial' });
    }
  });

  // Expire trial endpoint
  app.post("/api/expire-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.expireTrial(user.id);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error expiring trial:', error);
      res.status(500).json({ error: 'Failed to expire trial' });
    }
  });

  // Get subscription details for frontend
  app.get("/api/subscription/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // FORCE NO CACHE - prevent 304 responses
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}"` // Always different ETag
      });
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get trial status
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      // Check for active subscription
      let subscriptionData = {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'free',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd || null
      };

      // If user has Stripe subscription, get latest info
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionData = {
            tier: subscription.status === 'active' ? 'pro' : subscription.status === 'trialing' ? 'trial' : 'free',
            status: subscription.status,
            currentPeriodEnd: (subscription as any).current_period_end ? 
              new Date((subscription as any).current_period_end * 1000) : null
          };
        } catch (error) {
          console.error('Error fetching Stripe subscription:', error);
        }
      }

      // Determine if user has Pro access (paid subscription OR active trial)
      const isPaidPro = subscriptionData.tier !== 'free' && 
                       (subscriptionData.tier === 'pro_monthly' || 
                        subscriptionData.tier === 'pro_yearly' ||
                        subscriptionData.tier === 'pro') &&
                       subscriptionData.status === 'active';
      
      const hasProAccess = isPaidPro || trialStatus.isTrialActive;

      res.json({
        ...subscriptionData,
        trial: trialStatus,
        hasProAccess: hasProAccess,
        isProUser: hasProAccess
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  });

  // User session management
  app.get("/api/user-sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getUserSessionsThisMonth(userId);
      res.json({ sessions, count: sessions.length });
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  // Test endpoint to simulate user creation and webhook events for development
  app.post("/api/test-webhook", async (req, res) => {
    try {
      const { eventType, userId, sessionId } = req.body;
      
      if (eventType === 'create_free_user') {
        // Create a free user (no trial)
        const user = await storage.createUser({
          username: `freeuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        console.log(`Created new free user: ${user.id}`);
        res.json({ 
          success: true, 
          message: `Free user created: ${userId}`,
          userId: user.id,
          userType: 'free'
        });
      } else if (eventType === 'checkout.session.completed') {
        // Simulate successful checkout completion
        const mockSession = {
          metadata: {
            userId: userId,
            signupType: 'trial',
            feature: 'test'
          },
          customer: 'cus_test_123',
          subscription: 'sub_test_456'
        };

        // Find or create user (simulating Firebase auth integration)
        let user = await storage.getUserByFirebaseUid(userId);
        if (!user && !isNaN(parseInt(userId))) {
          user = await storage.getUser(parseInt(userId));
        }

        // If user doesn't exist, create them (simulating new signup)
        if (!user) {
          user = await storage.createUser({
            username: `testuser_${userId.substring(0, 8)}`,
            email: `${userId}@firebase.temp`,
            role: "user"
          });
          console.log(`Created new user for trial: ${user.id}`);
        }

        // Start trial access
        await storage.startTrial(user.id);
        
        // Update with mock Stripe info
        await storage.updateUserSubscription(user.id, {
          stripeCustomerId: mockSession.customer,
          stripeSubscriptionId: mockSession.subscription,
          subscriptionStatus: 'trialing',
          subscriptionTier: 'trial'
        });
        
        console.log(`Test trial access granted for user ${userId} (DB ID: ${user.id})`);
        res.json({ 
          success: true, 
          message: `Trial activated for user ${userId}`,
          userId: user.id,
          trialStatus: 'active'
        });
      } else {
        res.status(400).json({ error: 'Unsupported event type' });
      }
    } catch (error) {
      console.error('Test webhook error:', error);
      res.status(500).json({ error: 'Test webhook failed' });
    }
  });

  // Complete testing endpoint for all signup scenarios
  app.post("/api/test-complete-signup", async (req, res) => {
    try {
      const { testType, userId } = req.body;
      
      if (testType === 'free_user') {
        // Create a free user (no trial, no pro)
        const user = await storage.createUser({
          username: `freeuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        console.log(`✓ Created free user: ${user.id}`);
        res.json({ 
          success: true, 
          message: `Free user created: ${userId}`,
          userId: user.id,
          userType: 'free',
          hasTrialAccess: false,
          hasProAccess: false
        });
        
      } else if (testType === 'trial_user') {
        // Create user and activate trial (simulating successful Stripe checkout)
        const user = await storage.createUser({
          username: `trialuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        // Activate trial
        const updatedUser = await storage.startTrial(user.id);
        
        console.log(`✓ Created trial user: ${user.id} with 3-day trial`);
        res.json({ 
          success: true, 
          message: `Trial user created and activated: ${userId}`,
          userId: user.id,
          userType: 'trial',
          hasTrialAccess: true,
          hasProAccess: true,
          trialEndDate: updatedUser.trialEndDate
        });
        
      } else if (testType === 'pro_user') {
        // Create user with Pro subscription
        const user = await storage.createUser({
          username: `prouser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        // Set Pro subscription
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        
        const updatedUser = await storage.updateUserSubscription(user.id, {
          stripeCustomerId: `cus_test_${userId}`,
          stripeSubscriptionId: `sub_test_${userId}`,
          subscriptionStatus: 'active',
          subscriptionTier: 'pro',
          subscriptionCurrentPeriodEnd: endDate
        });
        
        console.log(`✓ Created Pro user: ${user.id} with active subscription`);
        res.json({ 
          success: true, 
          message: `Pro user created: ${userId}`,
          userId: user.id,
          userType: 'pro',
          hasTrialAccess: false,
          hasProAccess: true,
          subscriptionEndDate: endDate
        });
        
      } else {
        res.status(400).json({ error: 'Invalid test type. Use: free_user, trial_user, or pro_user' });
      }
    } catch (error: any) {
      console.error('Test signup error:', error);
      res.status(500).json({ error: 'Test signup failed: ' + error.message });
    }
  });
}