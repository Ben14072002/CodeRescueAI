import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import OpenAI from "openai";
import { storage } from "./storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PRICING_PLANS = {
  pro_monthly: {
    priceId: 'price_1RVSwMK0aFmFV51v1PsSdU6r',
    name: 'Rescue Pro',
    price: 9.99,
    interval: 'month'
  },
  pro_yearly: {
    priceId: 'price_1RVSwMK0aFmFV51vTFAjTsQL',
    name: 'Rescue Pro',
    price: 95.88,
    interval: 'year'
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management routes - simplified to work without passport authentication
  app.get("/api/user/sessions/count", async (req, res) => {
    // For now, return default values for new users
    // TODO: Implement proper authentication
    res.json({
      monthlyCount: 0,
      remainingFree: 3,
      canCreateSession: true
    });
  });

  // Custom Prompt Generator - Pro feature using OpenAI
  app.post("/api/generate-custom-prompts", async (req, res) => {
    try {
      const { problemDescription, codeContext, errorMessages } = req.body;

      if (!problemDescription?.trim()) {
        return res.status(400).json({ 
          error: "Problem description is required" 
        });
      }

      // Build context for AI analysis
      let contextPrompt = `You are an expert AI coding assistant rescue specialist. A developer is stuck and needs custom prompts to get their AI assistant unstuck. 

Problem Description: ${problemDescription}`;

      if (codeContext?.trim()) {
        contextPrompt += `\n\nCode Context: ${codeContext}`;
      }

      if (errorMessages?.trim()) {
        contextPrompt += `\n\nError Messages: ${errorMessages}`;
      }

      contextPrompt += `\n\nGenerate 3 custom prompts that use advanced AI manipulation techniques to solve this specific problem. Each prompt should:
1. Use psychological triggers (role constraints, context reset, urgency)
2. Be tailored to the exact problem described
3. Include specific methodology enforcement
4. Have clear difficulty levels

Return a JSON object with this structure:
{
  "prompts": [
    {
      "title": "Brief descriptive title",
      "prompt": "The complete prompt text to copy-paste",
      "explanation": "Why this prompt works for this specific problem",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system", 
            content: "You are an expert at creating AI manipulation prompts that redirect stuck coding assistants. Respond only with valid JSON."
          },
          {
            role: "user",
            content: contextPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{"prompts": []}');
      
      res.json(result);
    } catch (error) {
      console.error("Error generating custom prompts:", error);
      res.status(500).json({ 
        error: "Failed to generate custom prompts",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Cancel Subscription
  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Cancel subscription at period end using Stripe
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update user record
      await storage.updateUserSubscription(user.id, {
        subscriptionStatus: 'cancel_at_period_end'
      });

      res.json({ 
        success: true,
        message: "Subscription will be cancelled at the end of the current period",
        cancelAtPeriodEnd: true,
        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ 
        error: "Failed to cancel subscription",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reactivate Subscription
  app.post("/api/reactivate-subscription", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No subscription found" });
      }

      // Reactivate subscription using Stripe
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });

      // Update user record
      await storage.updateUserSubscription(user.id, {
        subscriptionStatus: 'active'
      });

      res.json({ 
        success: true,
        message: "Subscription has been reactivated",
        cancelAtPeriodEnd: false
      });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      res.status(500).json({ 
        error: "Failed to reactivate subscription",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create Stripe Products - run this once to set up pricing
  app.post("/api/setup-stripe-products", async (req, res) => {
    try {
      // Create the main product
      const product = await stripe.products.create({
        name: 'Rescue Pro',
        description: 'Unlimited AI rescues with advanced features',
      });

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: 999, // $9.99 in cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        nickname: 'Rescue Pro Monthly',
      });

      // Create yearly price (20% discount)
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: 9588, // $95.88 in cents (20% discount)
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        nickname: 'Rescue Pro Yearly',
      });

      res.json({
        product: product.id,
        monthlyPrice: monthlyPrice.id,
        yearlyPrice: yearlyPrice.id,
        message: 'Products created successfully'
      });
    } catch (error: any) {
      console.error('Error creating Stripe products:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session Creation
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, userId } = req.body;

      if (!plan || !userId) {
        return res.status(400).json({ error: "Plan and userId are required" });
      }

      const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];
      if (!planConfig) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      // For Firebase users, create a temporary user record if needed
      let user;
      try {
        user = await storage.getUser(parseInt(userId));
      } catch (e) {
        // userId is not numeric (Firebase UID), create temp user
        user = await storage.getUserByEmail(`${userId}@firebase.temp`);
        if (!user) {
          try {
            user = await storage.createUser({
              username: `firebase_${userId.substring(0, 8)}_${Date.now()}`,
              email: `${userId}@firebase.temp`,
              role: "user"
            });
          } catch (createError) {
            // If username still conflicts, try with random suffix
            user = await storage.createUser({
              username: `user_${Math.random().toString(36).substring(7)}`,
              email: `${userId}@firebase.temp`,
              role: "user"
            });
          }
        }
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      
      // Create checkout session without pre-filled customer to allow email editing
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `http://localhost:5000/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5000/?upgrade=cancelled`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',

        metadata: {
          userId: user.id.toString(),
          firebaseUid: userId.toString(),
          plan: plan
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get subscription status
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // Firebase UID is string
      
      // Try to find user by Firebase UID (stored as temp email)
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      
      // If not found, try parsing as numeric ID for legacy users
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }
      
      if (!user) {
        // Return free tier for users not found in database
        return res.json({
          tier: 'free',
          status: 'free',
          currentPeriodEnd: null
        });
      }

      let subscriptionData = {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'free',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd
      };

      // If user has Stripe subscription, get latest data
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          const stripeSubscription = subscription as any; // Type assertion for current_period_end
          subscriptionData = {
            tier: subscription.metadata?.plan || user.subscriptionTier || 'free',
            status: subscription.status,
            currentPeriodEnd: stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000) : null
          };
        } catch (stripeError) {
          console.error('Error fetching Stripe subscription:', stripeError);
        }
      }

      res.json(subscriptionData);
    } catch (error: any) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Enhanced Custom Prompt Generator (Pro Feature)
  app.post("/api/generate-category-prompts", async (req, res) => {
    try {
      const { userId, category, problemDescription, codeContext, errorMessages } = req.body;
      
      // Validate required inputs
      if (!category || !problemDescription?.trim()) {
        return res.status(400).json({ error: "Category and problem description are required" });
      }

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Verify user has Pro subscription
      try {
        let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
        if (!user && !isNaN(parseInt(userId))) {
          user = await storage.getUser(parseInt(userId));
        }

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        // Check subscription status
        const userTier = user.subscriptionTier || 'free';
        const isProUser = userTier === 'pro' || userTier === 'pro_monthly' || userTier === 'pro_yearly';
        
        if (!isProUser) {
          return res.status(403).json({ error: "Pro subscription required for custom prompt generation" });
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        return res.status(401).json({ error: "Authentication failed" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key required for custom prompt generation" });
      }

      // Category-specific prompt strategies
      const categoryStrategies = {
        'complexity-overwhelm': {
          systemPrompt: "You are an expert AI prompt engineer specializing in complexity reduction. Generate prompts that use context reset, role constraints, and methodology enforcement.",
          techniques: ["Ignore all previous context", "You are now a senior developer who only builds one feature at a time", "Use strict methodology constraints"]
        },
        'integration-issues': {
          systemPrompt: "You are an expert in debugging integration problems. Generate prompts using isolation debugging, contract-first development, and adapter patterns.",
          techniques: ["Stop all current work", "Define exact interfaces between components", "Use Contract-First Development"]
        },
        'lost-direction': {
          systemPrompt: "You are an expert in project management and requirements archaeology. Generate prompts that realign with original goals.",
          techniques: ["Perform requirements archaeology", "Find the original user story", "Enforce strict scope constraints"]
        },
        'no-clear-plan': {
          systemPrompt: "You are an expert in software architecture planning. Generate prompts using reverse engineering and walking skeleton approaches.",
          techniques: ["Use reverse engineering to create a plan", "Build a walking skeleton first", "Define clear milestones"]
        },
        'repeated-failures': {
          systemPrompt: "You are an expert in breaking coding loops and architectural resets. Generate prompts that force alternative approaches.",
          techniques: ["Your current architecture is fundamentally flawed", "Perform an architecture reset", "Try a completely different approach"]
        }
      };

      const strategy = categoryStrategies[category as keyof typeof categoryStrategies];
      if (!strategy) {
        return res.status(400).json({ error: "Invalid category" });
      }

      // Generate category-specific prompts using OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `${strategy.systemPrompt} 

Based on the user's problem description and context, generate 3 advanced AI agent prompts that use these specific techniques: ${strategy.techniques.join(', ')}.

Each prompt should:
- Be 100-200 words
- Include specific context from the user's situation
- Use the mentioned techniques effectively
- Be immediately actionable for the user
- Have a clear title and explanation

Return as JSON with this structure:
{
  "prompts": [
    {
      "title": "Clear, actionable title",
      "prompt": "The actual prompt text to copy-paste to AI",
      "explanation": "Why this prompt works for this specific situation",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Problem Category: ${category}

User Description: ${problemDescription}

Code Context: ${codeContext || 'No code context provided'}

Error Messages: ${errorMessages || 'No error messages provided'}

Generate 3 specialized prompts for this exact situation.`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const aiResponse = await response.json();
      const generatedData = JSON.parse(aiResponse.choices[0].message.content);
      
      // Add category to each prompt
      const prompts = generatedData.prompts.map((prompt: any) => ({
        ...prompt,
        category: category
      }));

      res.json({ prompts });

    } catch (error: any) {
      console.error('Custom prompt generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook Handler
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      // For now, accept webhooks without signature verification for testing
      // In production, proper webhook secret verification should be implemented
      event = req.body;
    } catch (err: any) {
      console.error('Webhook processing failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = parseInt(session.metadata.userId);
        const plan = session.metadata.plan || 'pro';
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          
          await storage.updateUserSubscription(userId, {
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
            subscriptionTier: plan
          });
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata.userId) {
          const userId = parseInt(customer.metadata.userId);
          
          await storage.updateUserSubscription(userId, {
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Session creation with proper validation
  app.post("/api/sessions", async (req, res) => {
    try {
      const { userId, problemType, projectDescription, customProblem, selectedStrategy } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Check session limits for free users
      const userTier = user.subscriptionTier || 'free';
      const isProUser = userTier === 'pro' || userTier === 'pro_monthly' || userTier === 'pro_yearly';

      if (!isProUser) {
        const monthlySessionCount = await storage.getUserSessionsThisMonth(user.id);
        if (monthlySessionCount.length >= 3) {
          return res.status(403).json({ 
            error: "Monthly session limit reached. Upgrade to Pro for unlimited sessions.",
            code: "SESSION_LIMIT_REACHED"
          });
        }
      }

      // Create session using the InsertSession schema
      const sessionData = {
        problemType: problemType || "",
        projectDescription: projectDescription || "",
        customProblem: customProblem || null,
        selectedStrategy: selectedStrategy || "",
        startTime: new Date(),
        actionSteps: [] as any[],
        prompts: [] as any[],
        notes: "",
        progress: 0,
        stepsCompleted: 0,
        totalTimeSpent: 0,
        success: false
      };

      const session = await storage.createSession(sessionData);

      res.json(session);
    } catch (error: any) {
      console.error('Session creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user session count for current month
  app.get("/api/user/sessions/count/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;

      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({
          monthlyCount: 0,
          remainingFree: 3,
          canCreateSession: true
        });
      }

      const userTier = user.subscriptionTier || 'free';
      const isProUser = userTier === 'pro' || userTier === 'pro_monthly' || userTier === 'pro_yearly';
      
      if (isProUser) {
        return res.json({
          monthlyCount: 0,
          remainingFree: -1, // Unlimited
          canCreateSession: true
        });
      }

      const monthlySessionCount = await storage.getUserSessionsThisMonth(user.id);
      const remaining = Math.max(0, 3 - monthlySessionCount.length);

      res.json({
        monthlyCount: monthlySessionCount.length,
        remainingFree: remaining,
        canCreateSession: remaining > 0
      });
    } catch (error: any) {
      console.error('Session count error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
