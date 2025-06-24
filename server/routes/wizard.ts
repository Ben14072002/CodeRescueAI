import type { Express } from "express";
import OpenAI from "openai";
import { storage } from "../storage";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function registerWizardRoutes(app: Express) {
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

  // AI Development Wizard - Intelligent Question Generation
  app.post("/api/wizard/generate-questions", async (req, res) => {
    try {
      const { classification, sessionId } = req.body;

      const systemPrompt = `You are an expert AI development consultant who generates targeted diagnostic questions to fully understand coding problems.

QUESTION GENERATION STRATEGY:
- Apply diagnostic frameworks (5 Whys, Fault Tree Analysis)
- Focus on technical specifics rather than generic questions
- Adapt complexity to user experience level
- Target the most likely root causes based on classification

Return JSON array of exactly 3 specific, targeted questions:
["question1", "question2", "question3"]

Questions should:
- Be specific to the problem category
- Elicit technical details needed for diagnosis
- Progress from symptoms to root causes
- Avoid generic questions like "what did you try?"`;

      const userPrompt = `Generate 3 targeted diagnostic questions for this problem:

Classification:
- Category: ${classification.category}
- Complexity: ${classification.complexity}
- Technical Indicators: ${JSON.stringify(classification.technicalIndicators || [])}
- User Experience: ${classification.experience}
- Likely Root Cause: ${classification.rootCauseLikely}

Generate questions that will help identify the specific root cause and gather technical details needed for a precise solution.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result.questions || ["What specific error message or behavior are you seeing?", "What did you expect to happen instead?", "What was the last thing you tried before getting stuck?"]);
    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  });

  // AI Development Wizard - Deep Problem Classification
  app.post("/api/wizard/classify-problem", async (req, res) => {
    try {
      const { userInput, sessionId } = req.body;

      const systemPrompt = `You are an expert AI development consultant with deep expertise in debugging AI assistant failures. Analyze problems using systematic classification frameworks.

CLASSIFICATION METHODOLOGY:
- Apply pattern recognition to identify common AI failure modes
- Assess technical complexity and user experience factors
- Determine optimal intervention strategies
- Classify emotional state to adjust communication approach

Return valid JSON with this structure:
{
  "category": "specific problem category",
  "severity": number (1-10),
  "complexity": "simple|medium|complex", 
  "urgency": "low|medium|high",
  "aiTool": "identified tool or 'unknown'",
  "experience": "beginner|intermediate|advanced",
  "emotionalState": "frustrated|confused|calm|urgent",
  "technicalIndicators": ["specific technical issues identified"],
  "rootCauseLikely": "initial assessment of root cause"
}`;

      const userPrompt = `Analyze this AI development problem with technical depth:

User Input: "${userInput}"

ANALYSIS REQUIREMENTS:
1. Identify the specific problem category (QR codes, API integration, database, UI, deployment, etc.)
2. Assess technical complexity based on described symptoms
3. Determine urgency based on language patterns and business impact
4. Identify likely AI tool based on context clues
5. Assess user experience level from problem description
6. Gauge emotional state from language patterns
7. Identify technical indicators that suggest root causes

Provide intelligent classification for targeted solution generation.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      res.json(analysis);
    } catch (error) {
      console.error('Error classifying problem:', error);
      res.status(500).json({ error: 'Failed to classify problem' });
    }
  });

  // AI Development Wizard - Enhanced Deep Analysis System
  app.post("/api/wizard/generate-solution", async (req, res) => {
    try {
      const { classification, responses, sessionId } = req.body;

      const systemPrompt = `You are a world-class senior software engineer and AI prompting expert with 15+ years of experience. Generate advanced solutions using cutting-edge prompting strategies and proven debugging frameworks.

ADVANCED PROMPTING STRATEGY IMPLEMENTATION:
Your task is to create sophisticated AI prompts that implement multiple advanced techniques:

1. **Chain-of-Thought Reasoning**: Break complex problems into logical reasoning chains
2. **Role-Based Prompting**: Assign specific expert personas with years of experience 
3. **Few-Shot Learning**: Include concrete real-world examples and patterns
4. **Constraint-Based Instructions**: Set clear boundaries and technical requirements
5. **Meta-Prompting**: Include self-reflection and verification frameworks
6. **Structured Output**: Force specific formatting and deliverable specifications

ADVANCED PROMPT FRAMEWORK (MANDATORY FOR EACH STEP):
Each aiPrompt MUST be 200-400 words and follow this sophisticated structure:

**Role Assignment**: "Act as a [specific expert role] with [X]+ years of experience in [specific domain] and expertise in [relevant technologies]."

**Context Setting**: "Given [specific technical context, constraints, and environmental factors]..."

**Chain-of-Thought**: "First [detailed analytical step with reasoning], then [systematic implementation step with technical specifics], finally [validation step with measurable outcomes]..."

**Few-Shot Examples**: "For example: [concrete real-world scenario with specific technical details and expected outcomes]..."

**Constraints**: "Ensure [specific technical requirements, validation criteria, and environmental constraints]..."

**Verification**: "Validate by [specific measurable checks with expected outputs and decision trees for different scenarios]..."

**Output Format**: "Provide output as [structured format with exact specifications and deliverable requirements]..."

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY valid JSON content
- Do NOT wrap in markdown code blocks (no backticks)
- Do NOT include any explanatory text before or after the JSON
- Start directly with { and end with }

Return valid JSON with this structure:
{
  "diagnosis": "Deep technical analysis with root cause identification using proven debugging frameworks",
  "solutionSteps": [
    {
      "step": number,
      "title": "Action-oriented specific title",
      "description": "Detailed implementation description with technical specifics", 
      "code": "Production-ready code with comments and error handling",
      "expectedTime": "Realistic time estimate",
      "aiPrompt": "ADVANCED 200-400 word prompt implementing multiple sophisticated strategies",
      "successCriteria": "Specific, measurable success indicators"
    }
  ],
  "expectedTime": "Total realistic timeline",
  "alternativeApproaches": ["Advanced alternative solutions with specific use cases"],
  "preventionTips": ["Proactive strategies with implementation details"],
  "learningResources": ["Specific technical resources and documentation"],
  "troubleshootingTips": ["Advanced debugging techniques and tools"]
}`;

      const userPrompt = `Analyze this development problem with deep technical expertise:

PROBLEM CLASSIFICATION:
- Category: ${classification.category}
- Complexity: ${classification.complexity}
- AI Tool: ${classification.aiTool}
- User Experience Level: ${classification.experience}
- Urgency: ${classification.urgency}

USER RESPONSES:
1. Initial Problem: ${responses[0] || 'Not provided'}
2. Error/Behavior: ${responses[1] || 'Not provided'}
3. Expected Outcome: ${responses[2] || 'Not provided'}
4. Previous Attempts: ${responses[3] || 'Not provided'}

ANALYSIS REQUIREMENTS:
1. Identify the root cause using systematic debugging
2. Create step-by-step solution with proven methodologies
3. Generate copy-paste ready AI prompts for each step
4. Include specific debugging commands and validation steps
5. Provide alternative approaches for different scenarios

Focus on creating actionable, specific solutions with intelligent prompts that leverage advanced prompting techniques.

CONTEXT-SPECIFIC ADVANCED REQUIREMENTS:

For QR code problems: Generate prompts using systematic debugging chains with expert DevOps personas, environmental constraint analysis, and multi-step validation frameworks
For database issues: Create prompts with connection troubleshooting decision trees, expert DBA role assignments, step-by-step diagnostic workflows, and environment-specific solutions
For API problems: Build prompts with request/response analysis chains, authentication debugging flows, expert backend engineer personas, and endpoint validation procedures
For UI/Frontend issues: Design prompts with expert frontend engineer roles, systematic component debugging, browser-specific troubleshooting, and performance optimization chains
For deployment problems: Construct prompts with expert DevOps engineer personas, infrastructure debugging decision trees, and systematic deployment validation workflows

MANDATORY ADVANCED TECHNIQUES FOR EACH PROMPT:
- Multi-step reasoning chains with technical depth
- Expert persona assignments with specific years of experience
- Environmental constraint handling and platform-specific considerations
- Decision tree troubleshooting with branching logic
- Validation checkpoint systems with measurable outcomes
- Few-shot examples with concrete technical scenarios
- Structured output specifications with exact deliverables
- Meta-prompting with self-reflection and error correction protocols`;

      console.log('Generating solution with OpenAI...');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 3000
      });

      console.log('OpenAI response received');
      const rawContent = response.choices[0].message.content || '';
      console.log('Raw OpenAI content length:', rawContent.length);
      
      let solutionData;
      try {
        // Clean the content by removing markdown code blocks if present
        let cleanContent = rawContent.trim();
        
        // Handle markdown code blocks more robustly
        if (cleanContent.includes('```')) {
          // Extract JSON content from markdown code blocks
          const jsonStart = cleanContent.indexOf('{');
          const jsonEnd = cleanContent.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
          }
        }
        
        console.log('Cleaned content preview:', cleanContent.substring(0, 200));
        solutionData = JSON.parse(cleanContent);
        console.log('Successfully parsed OpenAI solution');
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw content:', rawContent.substring(0, 500));
        
        // Fallback solution with sophisticated prompting strategies
        solutionData = {
          diagnosis: "Deep technical analysis with root cause identification using proven debugging frameworks",
          solutionSteps: [
            {
              step: 1,
              title: "Initial Problem Analysis",
              description: "Systematic analysis of the reported issue to identify root cause and technical indicators",
              code: "// Diagnostic code placeholder",
              expectedTime: "15 minutes",
              aiPrompt: "Act as a senior software engineer with 10+ years of experience debugging complex technical issues. First, analyze the specific error patterns and symptoms described. Then, create a systematic debugging approach. Finally, implement validation steps to confirm the root cause. Provide structured output with specific technical recommendations.",
              successCriteria: "Root cause identified and confirmed"
            }
          ],
          expectedTime: "30-60 minutes",
          alternativeApproaches: ["Alternative debugging methodology", "Secondary troubleshooting approach"],
          preventionTips: ["Best practices to prevent similar issues"],
          learningResources: ["Relevant technical documentation"],
          troubleshootingTips: ["Advanced debugging techniques"]
        };
      }

      // Save conversation to database if user is authenticated
      if (sessionId) {
        try {
          const conversationData = {
            sessionId,
            classification,
            userResponses: responses,
            generatedSolution: solutionData,
            timestamp: new Date()
          };
          
          // Create or update wizard conversation
          await storage.createWizardConversation({
            sessionId,
            userId: null, // Will be updated when user authenticates
            classification: JSON.stringify(classification),
            responses: JSON.stringify(responses),
            solution: JSON.stringify(solutionData),
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log('Wizard conversation saved to database');
        } catch (dbError) {
          console.error('Error saving wizard conversation:', dbError);
          // Don't fail the request if database save fails
        }
      }

      console.log('Solution generated successfully:', {
        steps: solutionData.solutionSteps?.length || 0,
        diagnosis: solutionData.diagnosis?.substring(0, 100) || 'No diagnosis'
      });

      res.json(solutionData);
    } catch (error) {
      console.error('Error generating solution:', error);
      res.status(500).json({ error: 'Failed to generate solution' });
    }
  });

  // Save wizard conversation for authenticated users
  app.post("/api/wizard/save-conversation", async (req, res) => {
    try {
      const { sessionId, userId, classification, responses, solution } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      // Check if conversation already exists
      let existingConversation = await storage.getWizardConversation(sessionId);
      
      if (existingConversation) {
        // Update existing conversation with user ID
        const updatedConversation = await storage.updateWizardConversation(sessionId, {
          userId: userId ? parseInt(userId) : null,
          classification: classification ? JSON.stringify(classification) : existingConversation.classification,
          responses: responses ? JSON.stringify(responses) : existingConversation.responses,
          solution: solution ? JSON.stringify(solution) : existingConversation.solution,
          updatedAt: new Date()
        });
        
        res.json({ success: true, conversation: updatedConversation });
      } else {
        // Create new conversation
        const newConversation = await storage.createWizardConversation({
          sessionId,
          userId: userId ? parseInt(userId) : null,
          classification: classification ? JSON.stringify(classification) : '{}',
          responses: responses ? JSON.stringify(responses) : '[]',
          solution: solution ? JSON.stringify(solution) : '{}',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        res.json({ success: true, conversation: newConversation });
      }
    } catch (error) {
      console.error('Error saving wizard conversation:', error);
      res.status(500).json({ error: 'Failed to save conversation' });
    }
  });

  // Get user's wizard conversations
  app.get("/api/wizard/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const conversations = await storage.getUserWizardConversations(userId);
      
      // Parse JSON fields for response
      const formattedConversations = conversations.map(conv => ({
        ...conv,
        classification: JSON.parse(conv.classification || '{}'),
        responses: JSON.parse(conv.responses || '[]'),
        solution: JSON.parse(conv.solution || '{}')
      }));
      
      res.json({ success: true, conversations: formattedConversations });
    } catch (error) {
      console.error('Error fetching wizard conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });

  // Delete wizard conversation
  app.delete("/api/wizard/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      await storage.deleteWizardConversation(sessionId);
      
      res.json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
      console.error('Error deleting wizard conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  });
}