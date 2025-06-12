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

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Stripe trial checkout session creation
  app.post("/api/create-trial-checkout-session", async (req, res) => {
    try {
      const { userId, email, feature } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email are required" });
      }

      // Create Stripe checkout session for trial signup
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [{
          price: PRICING_PLANS.pro_monthly.priceId,
          quantity: 1,
        }],
        subscription_data: {
          trial_period_days: 3,
          metadata: {
            userId: userId,
            feature: feature || 'trial',
            signupType: 'trial'
          }
        },
        metadata: {
          userId: userId,
          feature: feature || 'trial',
          signupType: 'trial'
        },
        success_url: `${req.headers.origin}/?trial=success`,
        cancel_url: `${req.headers.origin}/?trial=cancelled`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating trial checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Stripe webhook endpoint for trial signup completion
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        // For development, we'll skip signature verification if no webhook secret is provided
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
          console.log('No webhook secret provided, skipping signature verification (development mode)');
          event = req.body;
          console.log('Raw webhook body:', JSON.stringify(req.body, null, 2));
          console.log('Webhook event type:', event?.type);
          console.log('Webhook event data:', JSON.stringify(event?.data?.object?.metadata || {}, null, 2));
        } else {
          event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
        }
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          
          // Handle trial signup completion
          if (session.metadata?.signupType === 'trial') {
            const userId = session.metadata.userId;
            const feature = session.metadata.feature;
            
            try {
              // Find or create user by Firebase UID
              let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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

              // Start trial access immediately upon successful checkout
              await storage.startTrial(user.id);
              
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
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Handle subscription changes after trial
          const subscription = event.data.object;
          
          if (subscription.metadata?.userId) {
            const userId = subscription.metadata.userId;
            
            try {
              let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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
        let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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

  // Trial system API routes
  app.get("/api/trial-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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

  app.post("/api/start-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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

  app.post("/api/expire-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
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
      console.error('Error expiring trial:', error);
      res.status(500).json({ error: 'Failed to expire trial' });
    }
  });

  // Subscription management endpoints
  app.get("/api/subscription/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
      let user = await storage.getUserByEmail(`${userId}@firebase.temp`);
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

  // Custom prompt generation
  app.post("/api/generate-custom-prompt", async (req, res) => {
    try {
      const { problem, techStack, context, complexity, outputFormat } = req.body;

      if (!problem) {
        return res.status(400).json({ error: "Problem description is required" });
      }

      const systemPrompt = `You are an expert AI prompt engineer. Create a highly effective prompt for solving coding problems. Focus on clarity, specificity, and actionable guidance.

Guidelines:
- Be specific and technical
- Include relevant context and constraints  
- Provide clear step-by-step instructions
- Anticipate common pitfalls
- Request specific output format when helpful`;

      const userPrompt = `Create a custom prompt to solve this coding problem:

Problem: ${problem}
Tech Stack: ${techStack || 'Not specified'}
Context: ${context || 'General development'}
Complexity: ${complexity || 'Medium'}
Desired Output: ${outputFormat || 'Code solution with explanation'}

Generate a well-structured prompt that would help an AI assistant provide the most effective solution.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const generatedPrompt = response.choices[0].message.content;

      res.json({
        success: true,
        prompt: generatedPrompt,
        metadata: {
          problem,
          techStack,
          context,
          complexity,
          outputFormat,
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating custom prompt:', error);
      res.status(500).json({ error: 'Failed to generate prompt' });
    }
  });

  // AI Development Wizard
  app.post("/api/wizard/analyze-problem", async (req, res) => {
    try {
      const { problemDescription, context, aiTool, experience } = req.body;

      const systemPrompt = `You are an expert AI development consultant specializing in troubleshooting AI assistant failures. Analyze problems and provide structured solutions.

Your response must be valid JSON with this exact structure:
{
  "classification": {
    "category": "string",
    "severity": number (1-10),
    "complexity": "simple|medium|complex",
    "urgency": "low|medium|high",
    "aiTool": "string",
    "experience": "beginner|intermediate|advanced",
    "emotionalState": "frustrated|confused|calm|urgent"
  },
  "followUpQuestions": ["question1", "question2", "question3"]
}`;

      const userPrompt = `Analyze this AI development problem:

Problem: ${problemDescription}
Context: ${context}
AI Tool: ${aiTool}
Experience Level: ${experience}

Classify the problem and suggest 3 targeted follow-up questions to better understand the issue.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing problem:', error);
      res.status(500).json({ error: 'Failed to analyze problem' });
    }
  });

  app.post("/api/wizard/generate-solution", async (req, res) => {
    try {
      const { classification, responses, originalProblem } = req.body;

      const systemPrompt = `You are an expert AI development consultant. Generate comprehensive, actionable solutions for AI assistant problems.

Your response must be valid JSON with this structure:
{
  "diagnosis": "string",
  "solutionSteps": [
    {
      "step": number,
      "title": "string",
      "description": "string", 
      "code": "string (optional)",
      "expectedTime": "string",
      "aiPrompt": "string (optional)"
    }
  ],
  "expectedTime": "string",
  "alternativeApproaches": ["string"],
  "preventionTips": ["string"],
  "learningResources": ["string"]
}`;

      const contextualInfo = responses.join('\n');
      
      const userPrompt = `Generate a comprehensive solution for this AI development problem:

Original Problem: ${originalProblem}
Classification: ${JSON.stringify(classification)}
Additional Context: ${contextualInfo}

Provide a step-by-step solution with specific prompts, code examples, and actionable guidance.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const solution = JSON.parse(response.choices[0].message.content || '{}');
      res.json(solution);
    } catch (error) {
      console.error('Error generating solution:', error);
      res.status(500).json({ error: 'Failed to generate solution' });
    }
  });

  // Rate prompts
  app.post("/api/rate-prompt", async (req, res) => {
    try {
      const { userId, sessionId, promptIndex, rating, promptText, problemType } = req.body;

      const promptRating = await storage.ratePrompt({
        userId,
        sessionId,
        promptIndex,
        rating,
        promptText,
        problemType
      });

      res.json({ success: true, rating: promptRating });
    } catch (error) {
      console.error('Error rating prompt:', error);
      res.status(500).json({ error: 'Failed to rate prompt' });
    }
  });

  // Get prompt success rates
  app.get("/api/prompt-success/:problemType", async (req, res) => {
    try {
      const { problemType } = req.params;
      const successRate = await storage.getPromptSuccessRate(problemType);
      res.json(successRate);
    } catch (error) {
      console.error('Error fetching prompt success rate:', error);
      res.status(500).json({ error: 'Failed to fetch success rate' });
    }
  });

  // Create new rescue session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createSession(sessionData);
      res.json({ success: true, session });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Project persistence endpoints
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = req.body;
      const project = await storage.createProject(projectData);
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get("/api/projects/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const projects = await storage.getUserProjects(userId);
      res.json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.put("/api/projects/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const updates = req.body;
      const project = await storage.updateProject(projectId, updates);
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete("/api/projects/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      await storage.deleteProject(projectId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Wizard session saving
  app.post("/api/wizard/save-session", async (req, res) => {
    try {
      const { userId, sessionData } = req.body;
      
      // Create a session record for the wizard interaction
      const session = await storage.createSession({
        userId: parseInt(userId),
        problemType: sessionData.classification?.category || 'wizard_session',
        selectedStrategy: 'ai_wizard',
        progress: sessionData.stage === 'solution' ? 100 : 50,
        actionSteps: sessionData.solution?.solutionSteps || [],
        startTime: new Date(),
        completedAt: sessionData.stage === 'solution' ? new Date() : undefined
      });

      res.json({ success: true, sessionId: session.id });
    } catch (error: any) {
      console.error('Wizard session save error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}