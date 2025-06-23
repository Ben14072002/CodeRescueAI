import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageCircle, Send, Bot, User, RefreshCw, CheckCircle, Clock, Star, TrendingUp, Lightbulb, Target, ArrowRight, Crown, Lock, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useTrial } from '@/hooks/use-trial';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AIWizardProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'wizard' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ProblemClassification {
  category: string;
  severity: number;
  complexity: 'simple' | 'medium' | 'complex';
  urgency: 'low' | 'medium' | 'high';
  aiTool: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  emotionalState: 'frustrated' | 'confused' | 'calm' | 'urgent';
}

interface WizardSolution {
  diagnosis: string;
  solutionSteps: Array<{
    step: number;
    title: string;
    description: string;
    code?: string;
    expectedTime: string;
    aiPrompt?: string;
    successCriteria?: string;
  }>;
  expectedTime: string;
  alternativeApproaches: string[];
  preventionTips: string[];
  learningResources: string[];
  troubleshootingTips?: string[];
}

interface WizardSession {
  sessionId: string;
  stage: 'welcome' | 'intake' | 'questioning' | 'analysis' | 'solution' | 'feedback';
  classification?: ProblemClassification;
  solution?: WizardSolution;
  currentQuestionIndex: number;
  userResponses: string[];
}

export function AIDevelopmentWizard({ onBack }: AIWizardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isProUser, checkPremiumAccess } = useSubscription();
  const { isTrialActive } = useTrial();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  const [session, setSession] = useState<WizardSession>({
    sessionId: Date.now().toString(),
    stage: 'welcome',
    currentQuestionIndex: 0,
    userResponses: []
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isWizardTyping, setIsWizardTyping] = useState(false);
  const [feedback, setFeedback] = useState<{
    helpfulness: number;
    timeToSolve: number;
    successRate: boolean;
  } | null>(null);
  const [copiedPrompts, setCopiedPrompts] = useState<Set<number>>(new Set());

  const copyPromptToClipboard = async (prompt: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompts(prev => new Set(prev).add(stepNumber));
      setTimeout(() => {
        setCopiedPrompts(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepNumber);
          return newSet;
        });
      }, 2000);
      
      toast({
        title: "Prompt Copied!",
        description: "AI prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize wizard conversation
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'wizard',
      content: "👋 Hi! I'm your AI Development Wizard. I'm here to help you get unstuck on any coding problem you're facing with AI tools like Cursor, Replit, Claude, or any other development challenge.\n\nI'm designed to provide deep analysis and create copy-paste ready prompts that use advanced prompting strategies. I'll analyze your problem thoroughly, ask targeted questions, and generate intelligent solutions with specific, actionable AI prompts.\n\nWhat coding challenge has you stuck today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Check if user has premium access (Pro subscription or active trial)
  const hasAccess = checkPremiumAccess() || isTrialActive;

  // Show access denied screen for users without premium access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="relative inline-block">
                  <Brain className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <Lock className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 bg-slate-900 rounded-full p-1" />
                </div>
                <h1 className="text-3xl font-bold text-slate-100 mb-4">
                  AI Development Wizard
                </h1>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Feature
                </Badge>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">
                  Your Personal Senior Developer Mentor
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Get unstuck in minutes with AI-powered step-by-step guidance. The wizard analyzes your problem, 
                  asks smart questions, and provides precise prompts to fix any coding issue.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-medium text-slate-100">Smart Problem Analysis</div>
                    <div className="text-slate-400">Instantly identifies what's wrong</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Target className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-medium text-slate-100">Custom Action Plans</div>
                    <div className="text-slate-400">Step-by-step solutions for your stack</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="font-medium text-slate-100">Precise AI Prompts</div>
                    <div className="text-slate-400">Copy-paste prompts that actually work</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-medium text-slate-100">8 Minute Average</div>
                    <div className="text-slate-400">From stuck to shipping fast</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {user ? (
                  <>
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                      onClick={async () => {
                        try {
                          // SECURITY: Check trial eligibility first
                          const eligibilityResponse = await fetch(`/api/trial-eligibility/${user?.uid}`);
                          const eligibility = await eligibilityResponse.json();
                          
                          if (!eligibility.eligible) {
                            alert(`Trial not available: ${eligibility.reason}`);
                            return;
                          }

                          const response = await fetch('/api/create-trial-checkout-session', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              userId: user?.uid,
                              email: user?.email,
                              feature: 'wizard'
                            })
                          });
                          const { url } = await response.json();
                          window.location.href = url;
                        } catch (error) {
                          console.error('Trial checkout error:', error);
                        }
                      }}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Start 3-Day Free Trial
                    </Button>
                    <p className="text-slate-400 text-sm">
                      Get full access to AI Development Wizard + all Pro features
                    </p>
                    <p className="text-slate-400 text-xs">
                      Credit card required • Cancel anytime • Then $4.99/month
                    </p>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                      onClick={() => window.location.href = '/?signup=wizard'}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Sign Up & Start Free Trial
                    </Button>
                    <p className="text-slate-400 text-sm">
                      Create account and get 3 days free access to all Pro features
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sendWizardMessage = async (content: string, delay: number = 1000) => {
    setIsWizardTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const wizardMessage: Message = {
      id: Date.now().toString(),
      type: 'wizard',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, wizardMessage]);
    setIsWizardTyping(false);
  };

  const classifyProblem = async (userInput: string): Promise<ProblemClassification> => {
    try {
      const response = await fetch('/api/wizard/classify-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, sessionId: session.sessionId })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Problem classification failed:', error);
    }
    
    // Fallback classification
    return {
      category: 'general',
      severity: 5,
      complexity: 'medium',
      urgency: 'medium',
      aiTool: 'unknown',
      experience: 'intermediate',
      emotionalState: 'confused'
    };
  };

  const generateFollowUpQuestions = async (classification: ProblemClassification): Promise<string[]> => {
    try {
      const response = await fetch('/api/wizard/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classification, sessionId: session.sessionId })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Question generation failed:', error);
    }
    
    // Fallback questions
    return [
      "What specific error message or behavior are you seeing?",
      "What did you expect to happen instead?",
      "What was the last thing you tried before getting stuck?"
    ];
  };

  const generateSolution = async (classification: ProblemClassification, responses: string[]): Promise<WizardSolution> => {
    try {
      const response = await fetch('/api/wizard/generate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          classification, 
          responses, 
          sessionId: session.sessionId 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Generated solution:', result);
        return result;
      } else {
        console.error('Solution generation failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Solution generation failed:', error);
    }
    
    // This should never be reached if OpenAI is working properly
    console.error("OpenAI solution generation completely failed");
    throw new Error("Failed to generate intelligent solution");
  };

  const handleUserInput = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const input = currentInput;
    setCurrentInput('');

    // Handle different conversation stages
    switch (session.stage) {
      case 'welcome':
        // Initial problem intake
        setSession(prev => ({ 
          ...prev, 
          stage: 'intake',
          userResponses: [input]
        }));

        await sendWizardMessage(
          "I understand you're dealing with a coding challenge. Let me analyze this deeply and ask targeted questions to create a comprehensive solution.\n\nPerforming technical analysis..."
        );

        const classification = await classifyProblem(input);
        console.log('Problem classification:', classification);
        
        const questions = await generateFollowUpQuestions(classification);
        console.log('Generated questions:', questions);

        setSession(prev => ({ 
          ...prev, 
          classification,
          stage: 'questioning'
        }));

        const analysisMessage = classification.technicalIndicators?.length ? 
          `Technical Analysis Complete! I've identified this as a **${classification.complexity}** ${classification.category} issue with these indicators: ${classification.technicalIndicators.join(', ')}.\n\nTo create the most effective solution, I need additional context:\n\n**Question 1:** ${questions[0]}` :
          `Got it! I can see this is a **${classification.complexity}** ${classification.category} issue. Let me ask targeted questions to create a comprehensive solution:\n\n**Question 1:** ${questions[0]}`;

        await sendWizardMessage(analysisMessage);
        break;

      case 'questioning':
        // Collect responses to follow-up questions
        const updatedResponses = [...session.userResponses, input];
        setSession(prev => ({ 
          ...prev, 
          userResponses: updatedResponses,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));

        if (session.currentQuestionIndex < 2) {
          // Ask next question
          const nextQuestionIndex = session.currentQuestionIndex + 1;
          const nextQuestion = await generateFollowUpQuestions(session.classification!);
          
          await sendWizardMessage(
            `Perfect! **Question ${nextQuestionIndex + 1}:** ${nextQuestion[nextQuestionIndex] || "What have you already tried to solve this?"}`
          );
        } else {
          // Generate solution
          setSession(prev => ({ ...prev, stage: 'analysis' }));
          
          await sendWizardMessage(
            "Excellent! I have all the context needed. Analyzing the root cause and generating custom AI prompts for your specific situation...\n\n*Using advanced prompting frameworks to create targeted solutions*"
          );

          try {
            const solution = await generateSolution(session.classification!, updatedResponses);
            console.log('Solution generated successfully:', solution);
            
            setSession(prev => ({ 
              ...prev, 
              solution,
              stage: 'solution'
            }));

            // Present diagnosis first
            await sendWizardMessage(`## 🎯 **Deep Analysis & Diagnosis**
${solution.diagnosis}

## 📋 **Implementation Plan** (${solution.expectedTime})
I'll walk you through each step with advanced AI prompts designed for your specific situation.`);

            // Send each step as a separate message with a delay
            for (let i = 0; i < solution.solutionSteps.length; i++) {
              const step = solution.solutionSteps[i];
              
              await new Promise(resolve => setTimeout(resolve, 1500)); // Delay between steps
              
              const stepMessage = `### **Step ${step.step}: ${step.title}** (${step.expectedTime})

${step.description}

${step.code ? `**Implementation Code:**
\`\`\`
${step.code}
\`\`\`

` : ''}${step.aiPrompt ? `🤖 **Advanced AI Prompt:**
\`\`\`
${step.aiPrompt}
\`\`\`

` : ''}${step.successCriteria ? `✅ **Success Criteria:** ${step.successCriteria}` : ''}`;

              await sendWizardMessage(stepMessage);
            }

            // Send summary and resources
            await new Promise(resolve => setTimeout(resolve, 1000));
            const summaryMessage = `## 🔄 **Alternative Approaches**
${solution.alternativeApproaches.map(approach => `• ${approach}`).join('\n')}

## 🛡️ **Prevention Strategies**
${solution.preventionTips.map(tip => `• ${tip}`).join('\n')}

${solution.troubleshootingTips ? `## 🔧 **Troubleshooting Tips**
${solution.troubleshootingTips.map(tip => `• ${tip}`).join('\n')}

` : ''}## 📚 **Technical Resources**
${solution.learningResources.map(resource => `• ${resource}`).join('\n')}

---

Ready to implement? Which step would you like me to elaborate on?`;

            await sendWizardMessage(summaryMessage);
          } catch (error) {
            console.error('Solution generation error:', error);
            await sendWizardMessage(
              "I encountered a technical issue with the advanced analysis system. However, I can still provide targeted guidance for your problem:\n\n**Immediate Debug Steps:**\n1. Check the specific error messages in your logs\n2. Verify your configuration settings\n3. Test individual components systematically\n\nWould you like me to guide you through systematic debugging?"
            );
            return;
          }
        }
        break;

      case 'solution':
        // Handle follow-up questions and provide additional analysis
        await sendWizardMessage(
          "I'm here to help you implement this solution! What specific step would you like me to elaborate on, or do you have questions about the approach? I can also provide additional deep-dive analysis if needed."
        );
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-slate-100">AI Development Wizard</h1>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <p className="text-slate-400">Your personal senior developer mentor</p>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}>
                  <div className={`flex items-start gap-3 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-purple-100 dark:bg-purple-900'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isWizardTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Wizard is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-3">
                <Textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleUserInput();
                    }
                  }}
                  placeholder={
                    session.stage === 'welcome' 
                      ? "Describe the coding problem you're stuck on..."
                      : "Type your response..."
                  }
                  className="flex-1 min-h-[80px] resize-none"
                  disabled={isWizardTyping}
                />
                <Button
                  onClick={handleUserInput}
                  disabled={!currentInput.trim() || isWizardTyping}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}