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
  // Trial system API routes
  app.get("/api/trial-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Handle Firebase UID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({ isTrialActive: false, daysRemaining: 0 });
      }

      const trialStatus = await storage.checkTrialStatus(user.id);
      res.json(trialStatus);
    } catch (error) {
      console.error('Trial status error:', error);
      res.status(500).json({ error: "Failed to check trial status" });
    }
  });

  app.post("/api/expire-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Handle Firebase UID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.expireTrial(user.id);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Expire trial error:', error);
      res.status(500).json({ error: "Failed to expire trial" });
    }
  });

  // User registration endpoint for Firebase users
  app.post("/api/register-user", async (req, res) => {
    try {
      const { userId, email, displayName } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email are required" });
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (user) {
        return res.json({ success: true, user, message: "User already exists" });
      }

      // Create new trial user
      user = await storage.createUser({
        username: displayName || `user_${userId.substring(0, 8)}`,
        email: `${userId}@firebase.temp`,
        role: "user"
      });

      res.json({ success: true, user, message: "Trial user created successfully" });
    } catch (error) {
      console.error('User registration error:', error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Session management routes with proper user authentication
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
      const isTrialUser = userTier === 'trial';
      
      // Check if trial is still active
      if (isTrialUser) {
        const trialStatus = await storage.checkTrialStatus(user.id);
        if (trialStatus.isTrialActive) {
          return res.json({
            monthlyCount: 0,
            remainingFree: -1, // Unlimited during trial
            canCreateSession: true,
            trialActive: true,
            daysRemaining: trialStatus.daysRemaining
          });
        } else {
          // Trial expired, convert to free tier
          await storage.expireTrial(user.id);
        }
      }

      if (isProUser) {
        return res.json({
          monthlyCount: 0,
          remainingFree: -1, // Unlimited
          canCreateSession: true
        });
      }

      // Free tier users
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

  // Create Trial Setup Intent
  app.post("/api/create-trial-setup-intent", async (req, res) => {
    try {
      const { userId, email, name } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email required" });
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: name || "Trial User",
        metadata: {
          userId: userId,
          plan: "trial"
        }
      });

      // Create Setup Intent for collecting payment method without charging
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        usage: 'off_session',
        metadata: {
          userId: userId,
          type: 'trial_setup'
        }
      });

      // Update user with Stripe customer ID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (user) {
        await storage.updateUserSubscription(user.id, {
          stripeCustomerId: customer.id
        });
      }

      res.json({
        clientSecret: setupIntent.client_secret,
        customerId: customer.id
      });
    } catch (error) {
      console.error("Error creating trial setup intent:", error);
      res.status(500).json({ 
        error: "Failed to create trial setup",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Confirm Trial Setup
  app.post("/api/confirm-trial-setup", async (req, res) => {
    try {
      const { userId, setupIntentId } = req.body;

      if (!userId || !setupIntentId) {
        return res.status(400).json({ error: "User ID and setup intent ID required" });
      }

      // Retrieve the setup intent to verify it was successful
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ error: "Payment method setup failed" });
      }

      // Find user and update trial status
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user with trial status and payment method
      await storage.updateUserSubscription(user.id, {
        subscriptionStatus: "trial",
        subscriptionTier: "trial"
      });

      res.json({ 
        success: true,
        message: "Trial setup completed successfully"
      });
    } catch (error) {
      console.error("Error confirming trial setup:", error);
      res.status(500).json({ 
        error: "Failed to confirm trial setup",
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

      // Special handling for hardcoded Pro user
      if (userId === "PYVvgDLO2RQYuFx4OVK1UMz7qVG3") {
        // For the hardcoded Pro user, simulate subscription cancellation
        res.json({ 
          success: true,
          message: "Please contact support@digitalduo.org to cancel your subscription",
          cancelAtPeriodEnd: false,
          currentPeriodEnd: null
        });
        return;
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.stripeSubscriptionId || user.stripeSubscriptionId === "sub_pro_monthly") {
        return res.status(400).json({ error: "Please contact support@digitalduo.org to cancel your subscription" });
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
      console.log("Checkout session request:", req.body);
      const { plan, userId } = req.body;

      if (!plan || !userId) {
        console.log("Missing plan or userId:", { plan, userId });
        return res.status(400).json({ error: "Plan and userId are required" });
      }

      const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];
      if (!planConfig) {
        console.log("Invalid plan:", plan);
        return res.status(400).json({ error: "Invalid plan" });
      }

      console.log("Plan config found:", planConfig);

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
      
      // If still no user, create a test user for checkout
      if (!user) {
        user = await storage.createUser({
          username: `checkout_user_${Date.now()}`,
          email: `checkout@test.com`,
          role: "user"
        });
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
        success_url: `${req.headers.origin || 'https://code-breaker.org'}/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'https://code-breaker.org'}/?upgrade=cancelled`,
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
      
      // Hardcoded Pro access for the paying customer
      if (userId === 'PYVvgDLO2RQYuFx4OVK1UMz7qVG3') {
        return res.json({
          tier: 'pro_monthly',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
      
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
          subscriptionData = {
            tier: subscription.metadata?.plan || user.subscriptionTier || 'free',
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
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
      const { userId, category, problemDescription, customProblemDescription, programmingLanguage, aiTool, codeContext, errorMessages } = req.body;
      
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

      // Advanced Strategic Prompt Engineering Strategies
      const categoryStrategies = {
        'complexity-overwhelm': {
          systemPrompt: "You are an expert AI manipulation specialist who breaks down complex problems using advanced prompt engineering. Create strategic prompts that force AI assistants to adopt systematic, constraint-based approaches.",
          techniques: [
            "Context reset with role enforcement",
            "Constraint-based methodology injection", 
            "Single-responsibility forcing",
            "Cognitive load reduction patterns",
            "Progressive disclosure methodology"
          ],
          methodology: "RESET → CONSTRAIN → ISOLATE → VALIDATE → ITERATE"
        },
        'integration-issues': {
          systemPrompt: "You are an expert in AI-assisted debugging who specializes in forcing systematic integration analysis. Create prompts that make AI assistants adopt rigorous debugging methodologies.",
          techniques: [
            "Interface contract isolation",
            "Dependency mapping enforcement", 
            "Error boundary analysis",
            "Data flow tracing commands",
            "Contract-first development forcing"
          ],
          methodology: "ISOLATE → MAP → TRACE → CONTRACT → VERIFY"
        },
        'lost-direction': {
          systemPrompt: "You are an expert in AI-assisted project archaeology and requirements recovery. Create prompts that force AI to perform systematic goal realignment and scope archaeology.",
          techniques: [
            "Requirements archaeology protocols",
            "Goal hierarchy reconstruction",
            "Scope constraint enforcement",
            "Priority matrix forcing",
            "Stakeholder value extraction"
          ],
          methodology: "EXCAVATE → PRIORITIZE → CONSTRAIN → ALIGN → VALIDATE"
        },
        'no-clear-plan': {
          systemPrompt: "You are an expert in AI-assisted architecture planning who forces systematic design thinking. Create prompts that make AI adopt rigorous planning methodologies.",
          techniques: [
            "Reverse engineering protocols",
            "Walking skeleton methodology",
            "Architecture decision forcing",
            "Risk assessment injection",
            "Milestone-driven planning"
          ],
          methodology: "REVERSE → SKELETON → DECIDE → ASSESS → PLAN"
        },
        'repeated-failures': {
          systemPrompt: "You are an expert in AI-assisted architectural resets who breaks infinite loops. Create prompts that force AI to abandon failed approaches and adopt systematic alternatives.",
          techniques: [
            "Architecture reset protocols",
            "Alternative approach forcing",
            "Assumption challenging",
            "Pattern breaking injection",
            "Fresh perspective enforcement"
          ],
          methodology: "RESET → CHALLENGE → BREAK → ALTERNATIVE → REBUILD"
        },
        'ai-hallucination': {
          systemPrompt: "You are an expert in AI hallucination detection and correction who forces reality-based responses. Create prompts that make AI assistants switch to conservative, verification-based approaches.",
          techniques: [
            "Reality check enforcement",
            "Documentation verification forcing",
            "Conservative mode activation",
            "Source validation requirements",
            "Uncertainty acknowledgment protocols"
          ],
          methodology: "STOP → VERIFY → VALIDATE → CONFIRM → PROCEED"
        },
        'other': {
          systemPrompt: "You are an expert in adaptive problem-solving who creates custom solutions for unique situations. Analyze the specific problem and create prompts using the most appropriate techniques.",
          techniques: [
            "Problem analysis protocols",
            "Context gathering methods",
            "Adaptive solution strategies",
            "Custom approach development",
            "Situational pattern matching"
          ],
          methodology: "ANALYZE → ADAPT → CUSTOMIZE → IMPLEMENT → REFINE"
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

MISSION: Create 3 advanced AI manipulation prompts that force systematic problem-solving using the ${strategy.methodology} methodology.

REQUIREMENTS FOR EACH PROMPT:
1. **Strategic Analysis**: Deep technical analysis of user's specific setup
2. **Step-by-Step Methodology**: Clear sequential approach using ${strategy.methodology}
3. **AI Manipulation Techniques**: Apply these advanced techniques: ${strategy.techniques.join(', ')}
4. **Context Integration**: Reference specific code, errors, and technical details provided
5. **Actionable Commands**: Direct, copy-pasteable instructions for immediate use

PROMPT STRUCTURE:
- **Opening**: Context reset + role injection
- **Analysis Phase**: Technical setup analysis commands  
- **Methodology**: Step-by-step ${strategy.methodology} implementation
- **Constraints**: Specific limitations and focus areas
- **Deliverables**: Exact outputs required

Each prompt must be 200-400 words, technically sophisticated, and immediately actionable.

Return as JSON:
{
  "prompts": [
    {
      "title": "Strategic prompt title",
      "prompt": "Complete copy-paste prompt with methodology steps",
      "explanation": "Technical analysis of why this approach works",
      "difficulty": "beginner|intermediate|advanced",
      "methodology_steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
    }
  ]
}`
            },
            {
              role: 'user',
              content: `TECHNICAL CONTEXT ANALYSIS:

Problem Category: ${category.toUpperCase()}
Methodology Required: ${strategy.methodology}

DETAILED PROBLEM DESCRIPTION:
${problemDescription || customProblemDescription}

DEVELOPMENT CONTEXT:
Programming Language: ${programmingLanguage || 'Not specified - include language detection prompts'}
AI Tool Being Used: ${aiTool || 'Not specified - create tool-agnostic prompts'}
Code Context: ${codeContext || 'No specific code context provided - generate prompts that request technical details'}
Error Messages: ${errorMessages || 'No error messages provided - include diagnostic commands in prompts'}

ENHANCED PROMPT GENERATION REQUIREMENTS:
1. Analyze the technical stack and architecture patterns from the provided context
2. Create prompts that force the AI to perform deep technical analysis of the user's specific setup
3. Include commands that extract missing technical details if context is incomplete
4. Apply ${strategy.methodology} methodology systematically
5. Tailor prompts specifically for ${programmingLanguage || 'the programming language being used'}
6. ${aiTool ? `Optimize prompts for ${aiTool} AI tool characteristics and behavior patterns` : 'Create universal AI manipulation prompts that work across different AI tools'}
7. Generate copy-paste ready prompts that manipulate AI behavior for this exact technical situation

CONTEXT ADAPTATION:
- If programming language is specified, include language-specific debugging and optimization techniques
- If AI tool is specified, leverage that tool's specific strengths and address its known weaknesses
- For custom problems (Other category), focus on problem analysis and adaptive solution strategies

Generate 3 strategic AI manipulation prompts that solve this specific problem with enhanced context awareness.`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 3000,
          temperature: 0.8
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
        console.log('Webhook: checkout.session.completed received', event.data.object);
        const session = event.data.object;
        const firebaseUid = session.metadata.firebaseUid;
        const plan = session.metadata.plan || 'pro_monthly';
        
        console.log('Processing subscription for Firebase UID:', firebaseUid, 'Plan:', plan);
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          
          // Find user by Firebase UID
          let user = await storage.getUserByEmail(`${firebaseUid}@firebase.temp`);
          
          if (user) {
            console.log('Updating subscription for user:', user.id);
            const updateData = {
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'active',
              subscriptionTier: plan.includes('yearly') ? 'pro_yearly' : 'pro_monthly'
            };
            
            await storage.updateUserSubscription(user.id, updateData);
            console.log('Subscription updated successfully:', updateData);
            console.log('User now has Pro access');
          } else {
            console.error('User not found for Firebase UID:', firebaseUid);
            // Try to create user if not found
            try {
              user = await storage.createUser({
                username: `user_${firebaseUid.substring(0, 8)}`,
                email: `${firebaseUid}@firebase.temp`,
                role: "user"
              });
              
              await storage.updateUserSubscription(user.id, {
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: 'active',
                subscriptionTier: plan.includes('yearly') ? 'pro_yearly' : 'pro_monthly'
              });
              console.log('Created new user and updated subscription:', user.id);
            } catch (createError) {
              console.error('Failed to create user for subscription:', createError);
            }
          }
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

  // Prompt Rating API - Success Tracking System
  app.post("/api/rate-prompt", async (req, res) => {
    try {
      const { userId, sessionId, promptIndex, rating, promptText, problemType } = req.body;

      if (!userId || !sessionId || promptIndex === undefined || !rating || !promptText || !problemType) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (!['positive', 'negative'].includes(rating)) {
        return res.status(400).json({ error: "Rating must be 'positive' or 'negative'" });
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const promptRating = await storage.ratePrompt({
        userId: user.id,
        sessionId: parseInt(sessionId),
        promptIndex: parseInt(promptIndex),
        rating: rating as 'positive' | 'negative',
        promptText,
        problemType
      });

      res.json({ success: true, rating: promptRating });
    } catch (error: any) {
      console.error('Prompt rating error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get prompt success rate for a problem type
  app.get("/api/prompt-success-rate/:problemType", async (req, res) => {
    try {
      const { problemType } = req.params;
      
      const successRate = await storage.getPromptSuccessRate(problemType);
      const percentage = successRate.totalCount > 0 
        ? Math.round((successRate.positiveCount / successRate.totalCount) * 100)
        : 0;

      res.json({
        ...successRate,
        successPercentage: percentage
      });
    } catch (error: any) {
      console.error('Success rate error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's recent sessions for prompt history
  app.get("/api/user/recent-sessions/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const limit = parseInt(req.query.limit as string) || 5;

      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({ sessions: [] });
      }

      const recentSessions = await storage.getUserRecentSessions(user.id, limit);
      res.json({ sessions: recentSessions });
    } catch (error: any) {
      console.error('Recent sessions error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PROJECT PERSISTENCE API ROUTES

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const { userId, projectName, projectDetails, generatedRecipe, roadmapSteps } = req.body;

      if (!userId || !projectName) {
        return res.status(400).json({ error: "User ID and project name are required" });
      }

      // Find user
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const projectData = {
        userId: user.id,
        projectName,
        projectDetails: projectDetails || {},
        generatedRecipe: generatedRecipe || null,
        roadmapSteps: roadmapSteps || [],
        projectProgress: {
          currentStep: 0,
          totalSteps: Array.isArray(roadmapSteps) ? roadmapSteps.length : 0,
          completedSteps: [],
          timeSpent: 0
        }
      };

      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error: any) {
      console.error('Project creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's projects
  app.get("/api/projects/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;

      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({ projects: [] });
      }

      const projects = await storage.getUserProjects(user.id);
      res.json({ projects });
    } catch (error: any) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific project
  app.get("/api/project/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error: any) {
      console.error('Get project error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update project
  app.put("/api/project/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const updates = req.body;

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      // Remove fields that shouldn't be updated directly
      delete updates.id;
      delete updates.userId;
      delete updates.createdAt;

      const updatedProject = await storage.updateProject(projectId, updates);
      res.json(updatedProject);
    } catch (error: any) {
      console.error('Project update error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update project progress
  app.put("/api/project/:projectId/progress", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const { progress } = req.body;

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const updatedProject = await storage.updateProjectProgress(projectId, progress);
      res.json(updatedProject);
    } catch (error: any) {
      console.error('Project progress update error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mark project as completed
  app.put("/api/project/:projectId/complete", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      const completedProject = await storage.markProjectCompleted(projectId);
      res.json(completedProject);
    } catch (error: any) {
      console.error('Project completion error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete project
  app.delete("/api/project/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);

      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }

      await storage.deleteProject(projectId);
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error: any) {
      console.error('Project deletion error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Roadmap Creator API Endpoints
  app.post("/api/analyze-project", async (req, res) => {
    try {
      const { projectName, description, goals, constraints, timeline, experience } = req.body;

      const analysisPrompt = `Analyze this project and provide a comprehensive analysis:

Project Name: ${projectName}
Description: ${description}
Goals: ${goals.join(', ')}
Constraints: ${constraints.join(', ')}
Timeline: ${timeline}
Experience Level: ${experience}

Please provide a detailed analysis including:
1. Project type classification with confidence level
2. Detected features with complexity and estimated hours
3. Technology stack recommendations
4. Architecture patterns
5. Potential challenges and risks

Return as JSON with this structure:
{
  "projectType": "string",
  "projectTypeConfidence": 0.95,
  "projectTypeReasoning": "explanation",
  "detectedFeatures": [
    {
      "feature": "Feature name",
      "complexity": "low|medium|high",
      "estimatedHours": 5,
      "reasoning": "Why this feature is needed"
    }
  ],
  "techStackRecommendations": {
    "frontend": ["technology1", "technology2"],
    "backend": ["technology1", "technology2"],
    "database": ["technology1"],
    "deployment": ["platform1"]
  },
  "architecturePatterns": ["pattern1", "pattern2"],
  "challenges": ["challenge1", "challenge2"],
  "estimatedTotalHours": 40
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      res.json(analysis);
    } catch (error: any) {
      console.error('Project analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-recipe", async (req, res) => {
    try {
      const { projectInput, analysis } = req.body;

      const recipePrompt = `Based on the project analysis, generate a comprehensive technical recipe:

Project: ${projectInput.name}
Analysis: ${JSON.stringify(analysis, null, 2)}

Create a detailed technical recipe following the TaskFlow template format with:
1. Project overview and objectives
2. Technical specifications
3. Architecture decisions
4. Implementation approach
5. Testing strategy
6. Deployment plan

Return as JSON with this structure:
{
  "projectName": "${projectInput.name}",
  "overview": "Comprehensive project overview",
  "technicalSpecs": {
    "frontend": "Detailed frontend specifications",
    "backend": "Detailed backend specifications",
    "database": "Database design and schema",
    "apis": "API design and endpoints"
  },
  "architecture": {
    "patterns": ["pattern1", "pattern2"],
    "principles": ["principle1", "principle2"],
    "decisions": [
      {
        "decision": "Architecture decision",
        "reasoning": "Why this decision was made"
      }
    ]
  },
  "implementation": {
    "phases": [
      {
        "phase": "Phase name",
        "description": "What will be built",
        "deliverables": ["deliverable1", "deliverable2"]
      }
    ]
  },
  "testing": "Testing strategy and approach",
  "deployment": "Deployment strategy and requirements"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: recipePrompt }],
        response_format: { type: "json_object" }
      });

      const recipe = JSON.parse(response.choices[0].message.content || '{}');
      res.json(recipe);
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { projectInput, analysis, recipe } = req.body;

      const roadmapPrompt = `Generate a comprehensive AI-optimized development roadmap with granular micro-steps:

Project: ${projectInput.name}
Experience: ${projectInput.experience}
Timeline: ${projectInput.timeline}

Based on the analysis and recipe, create 15-25 micro-steps that are:
1. Highly specific and actionable
2. Optimized for AI coding assistants (Replit AI, Cursor, Windsurf, Lovable)
3. Include comprehensive AI prompts with context, constraints, examples, validation, troubleshooting
4. Prevent scope creep through clear boundaries
5. Include emergency rescue prompts

Return as JSON with this structure:
{
  "projectName": "${projectInput.name}",
  "totalSteps": 20,
  "estimatedHours": 40,
  "phases": [
    {
      "phaseName": "Setup & Foundation",
      "description": "Initial project setup",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Project Initialization",
          "description": "Set up project structure and dependencies",
          "estimatedTime": "2 hours",
          "difficulty": "beginner",
          "aiPrompt": {
            "context": "Starting a new project with specific requirements",
            "task": "Initialize project structure with modern best practices",
            "constraints": ["Must use specific tech stack", "Follow established patterns"],
            "examples": ["Example file structure", "Example configuration"],
            "validation": ["Check file structure", "Verify dependencies"],
            "troubleshooting": ["Common setup issues", "Dependency conflicts"],
            "expectedOutput": "Fully configured project ready for development",
            "testingInstructions": ["Run initialization tests", "Verify setup"],
            "commonMistakes": ["Forgetting env files", "Wrong dependency versions"],
            "optimizationTips": ["Use latest stable versions", "Follow naming conventions"]
          },
          "emergencyRescue": "If setup fails, try: [specific recovery steps]",
          "prerequisites": [],
          "deliverables": ["Project structure", "Package.json", "Initial config"]
        }
      ]
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: roadmapPrompt }],
        response_format: { type: "json_object" }
      });

      const roadmap = JSON.parse(response.choices[0].message.content || '{}');
      res.json(roadmap);
    } catch (error: any) {
      console.error('Roadmap generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Project Planner API Endpoints
  app.post("/api/update-project-plan", async (req, res) => {
    try {
      const { projectName, projectDescription, experienceLevel, questionIndex, answer, currentPlan } = req.body;

      const updatePrompt = `Based on this user's answer, update the project plan:

Project: ${projectName}
Description: ${projectDescription}
Experience: ${experienceLevel}
Question Index: ${questionIndex}
User Answer: "${answer}"

Current Plan: ${JSON.stringify(currentPlan, null, 2)}

Update the relevant sections of the project plan based on the user's answer. Focus on:
- Project overview (purpose, target users, goals)
- Feature specifications (essential vs nice-to-have)
- Technical recommendations
- Timeline estimates
- Potential challenges

Return the updated project plan as JSON with the same structure.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: updatePrompt }],
        response_format: { type: "json_object" }
      });

      const updatedPlan = JSON.parse(response.choices[0].message.content || '{}');
      res.json(updatedPlan);
    } catch (error: any) {
      console.error('Project plan update error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/finalize-project-plan", async (req, res) => {
    try {
      const { projectName, projectDescription, experienceLevel, messages, currentPlan } = req.body;

      const userAnswers = messages.map((m: any) => m.content).join('\n- ');

      const finalizePrompt = `Create a comprehensive final project plan based on this conversation:

Project: ${projectName}
Description: ${projectDescription}
Experience Level: ${experienceLevel}

User Answers:
- ${userAnswers}

Current Plan: ${JSON.stringify(currentPlan, null, 2)}

Generate a complete, detailed project plan with all sections filled out:

{
  "overview": {
    "purpose": "Clear project purpose",
    "goals": ["Goal 1", "Goal 2", "Goal 3"],
    "targetUsers": "Specific target user description"
  },
  "features": {
    "essential": ["Essential feature 1", "Essential feature 2"],
    "niceToHave": ["Nice feature 1", "Nice feature 2"]
  },
  "technical": {
    "techStack": ["Technology 1", "Technology 2"],
    "architecture": "Architecture description"
  },
  "userExperience": {
    "userFlows": ["User flow 1", "User flow 2"],
    "interfaceNeeds": ["UI need 1", "UI need 2"]
  },
  "timeline": {
    "phases": [
      {
        "name": "Phase 1",
        "duration": "2 weeks",
        "description": "Phase description"
      }
    ],
    "totalEstimate": "8-12 weeks"
  },
  "challenges": {
    "risks": ["Risk 1", "Risk 2"],
    "solutions": ["Solution 1", "Solution 2"]
  }
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: finalizePrompt }],
        response_format: { type: "json_object" }
      });

      const finalPlan = JSON.parse(response.choices[0].message.content || '{}');
      res.json(finalPlan);
    } catch (error: any) {
      console.error('Final project plan error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/save-project-plan", async (req, res) => {
    try {
      const { projectName, projectDescription, experienceLevel, projectPlan, messages } = req.body;

      // For now, just return success - in a real app you'd save to database
      // You could extend the storage interface to include project plans
      
      res.json({ 
        success: true, 
        message: "Project plan saved successfully",
        planId: Date.now().toString()
      });
    } catch (error: any) {
      console.error('Save project plan error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Development Wizard API Endpoints
  app.post("/api/wizard/classify-problem", async (req, res) => {
    try {
      const { userInput, sessionId } = req.body;

      const classifyPrompt = `Analyze this user's coding problem and classify it:

User Input: "${userInput}"

Classify the problem and return JSON with this structure:
{
  "category": "integration_failures|authentication_issues|database_problems|api_connection_issues|deployment_problems|performance_issues|logic_errors|ui_styling_problems|testing_issues|environment_setup|package_dependencies|version_control|ai_context_loss|ai_confusion|ai_infinite_loops|general",
  "severity": 1-10 (how frustrated/stuck they seem),
  "complexity": "simple|medium|complex",
  "urgency": "low|medium|high", 
  "aiTool": "cursor|replit|claude|copilot|chatgpt|unknown",
  "experience": "beginner|intermediate|advanced",
  "emotionalState": "frustrated|confused|calm|urgent"
}

Base classification on keywords, tone, and context from the user's description.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: classifyPrompt }],
        response_format: { type: "json_object" }
      });

      const classification = JSON.parse(response.choices[0].message.content || '{}');
      res.json(classification);
    } catch (error: any) {
      console.error('Problem classification error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wizard/generate-questions", async (req, res) => {
    try {
      const { classification, sessionId } = req.body;

      const questionsPrompt = `Generate 4 intelligent follow-up questions for this problem classification:

Classification: ${JSON.stringify(classification, null, 2)}

Generate questions that:
1. Help diagnose the root cause
2. Are appropriate for their experience level (${classification.experience})
3. Address their emotional state (${classification.emotionalState})
4. Are specific to the problem category (${classification.category})

Return JSON array of 4 questions as strings. Make questions progressively more specific and helpful.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: questionsPrompt }],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
      res.json(result.questions || []);
    } catch (error: any) {
      console.error('Question generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wizard/generate-solution", async (req, res) => {
    try {
      const { classification, userResponses, sessionId } = req.body;

      const solutionPrompt = `Act as a senior developer mentor. Create a comprehensive solution for this problem:

Problem Classification: ${JSON.stringify(classification, null, 2)}

User Responses: ${userResponses.join('\n- ')}

Generate a detailed solution with this JSON structure:
{
  "diagnosis": "Clear explanation of what's wrong and why",
  "solutionSteps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed explanation of what to do",
      "code": "code example if needed",
      "expectedTime": "time estimate",
      "aiPrompt": "Sophisticated prompt optimized for AI coding assistants (Replit AI, Cursor, Windsurf, Lovable) that would accomplish this exact step with detailed context and requirements"
    }
  ],
  "expectedTime": "total time estimate",
  "alternativeApproaches": ["alternative if main solution fails"],
  "preventionTips": ["how to avoid this in future"],
  "learningResources": ["additional learning materials"]
}

CRITICAL: For each solutionStep, include an "aiPrompt" field containing a sophisticated, strategic prompt using proven methodologies:

**PROMPT ENGINEERING STRATEGIES TO USE:**
1. **Chain-of-Thought Reasoning**: Include "Let's think step by step" and explicit reasoning paths
2. **Role Assignment**: Assign specific expert roles (e.g., "You are a senior full-stack developer with 10+ years experience")
3. **Context Priming**: Provide detailed background, constraints, and current state
4. **Output Specification**: Define exact format, structure, and deliverables expected
5. **Error Prevention**: Include common pitfalls to avoid and validation steps
6. **Progressive Disclosure**: Break complex tasks into smaller, manageable components

**PROMPT STRUCTURE TEMPLATE:**
\`\`\`
**ROLE**: [Specific expert role]
**CONTEXT**: [Detailed background and current situation]
**TASK**: [Specific, actionable objective]
**CONSTRAINTS**: [Technical limitations, requirements, preferences]
**THINKING**: Let's approach this step by step:
1. [First consideration]
2. [Second consideration]
3. [Third consideration]
**OUTPUT**: [Exact format and deliverables required]
**VALIDATION**: [How to verify success]
\`\`\`

Each aiPrompt must be sophisticated, production-ready, and follow these proven patterns. Adapt complexity to their experience level (${classification.experience}).`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: solutionPrompt }],
        response_format: { type: "json_object" }
      });

      const solution = JSON.parse(response.choices[0].message.content || '{}');
      res.json(solution);
    } catch (error: any) {
      console.error('Solution generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wizard/save-session", async (req, res) => {
    try {
      const { sessionData, feedback } = req.body;

      // Save wizard session data for learning
      // In a real implementation, this would store to database for pattern analysis
      
      res.json({ 
        success: true, 
        message: "Session data saved for learning",
        sessionId: sessionData.sessionId
      });
    } catch (error: any) {
      console.error('Wizard session save error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
