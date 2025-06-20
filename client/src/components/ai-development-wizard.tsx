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
  }>;
  expectedTime: string;
  alternativeApproaches: string[];
  preventionTips: string[];
  learningResources: string[];
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

  // Check if user has premium access (Pro subscription or active trial)
  const hasAccess = checkPremiumAccess() || isTrialActive;

  // Debug information for trial activation
  console.log('Debug - User UID:', user?.uid);
  console.log('Debug - Has Access:', hasAccess);
  console.log('Debug - Is Trial Active:', isTrialActive);
  console.log('Debug - Is Pro User:', isProUser);

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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize wizard conversation
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'wizard',
      content: "👋 Hi! I'm your AI Development Wizard. I'm here to help you get unstuck on any coding problem you're facing with AI tools like Cursor, Replit, Claude, or any other development challenge.\n\nThink of me as a senior developer who's seen every problem before and knows exactly how to guide you through it. What's got you stuck today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

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
      "Can you share the specific error message you're seeing?",
      "What were you trying to accomplish when this problem started?",
      "How long have you been working on this issue?",
      "Have you tried any solutions already?"
    ];
  };

  const generateSolution = async (classification: ProblemClassification, responses: string[]): Promise<WizardSolution> => {
    try {
      const response = await fetch('/api/wizard/generate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          classification, 
          userResponses: responses, 
          sessionId: session.sessionId 
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Solution generation failed:', error);
    }
    
    // Fallback solution
    return {
      diagnosis: "Based on your description, this appears to be a common development challenge.",
      solutionSteps: [
        {
          step: 1,
          title: "Identify the Root Cause",
          description: "Let's start by understanding exactly what's happening.",
          expectedTime: "5 minutes"
        },
        {
          step: 2,
          title: "Apply the Fix",
          description: "Here's the specific solution for your problem.",
          expectedTime: "10 minutes"
        }
      ],
      expectedTime: "15-20 minutes",
      alternativeApproaches: ["Alternative approach if the main solution doesn't work"],
      preventionTips: ["How to avoid this problem in the future"],
      learningResources: ["Additional resources for learning"]
    };
  };

  const handleUserInput = async () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = currentInput;
    setCurrentInput('');

    // Update session with user response
    const newResponses = [...session.userResponses, userInput];
    setSession(prev => ({ ...prev, userResponses: newResponses }));

    // Handle different conversation stages
    switch (session.stage) {
      case 'welcome':
        // Classify the initial problem
        const classification = await classifyProblem(userInput);
        setSession(prev => ({ 
          ...prev, 
          stage: 'questioning', 
          classification 
        }));
        
        await sendWizardMessage(
          `I can see you're dealing with ${classification.category.replace('_', ' ')} issues. ${
            classification.emotionalState === 'frustrated' 
              ? "I understand this can be really frustrating - I've helped solve this exact type of problem many times before." 
              : "Let me help you work through this systematically."
          }\n\nTo give you the most targeted help, I need to understand your situation better. Let me ask you a few specific questions.`
        );
        
        // Generate and ask first follow-up question
        const questions = await generateFollowUpQuestions(classification);
        setTimeout(async () => {
          await sendWizardMessage(questions[0]);
        }, 2000);
        
        break;

      case 'questioning':
        const questionIndex = session.currentQuestionIndex + 1;
        
        if (questionIndex < 3) { // Ask up to 3 follow-up questions
          setSession(prev => ({ 
            ...prev, 
            currentQuestionIndex: questionIndex 
          }));
          
          const questions = await generateFollowUpQuestions(session.classification!);
          if (questions[questionIndex]) {
            await sendWizardMessage(questions[questionIndex]);
          }
        } else {
          // Move to analysis stage
          setSession(prev => ({ ...prev, stage: 'analysis' }));
          await sendWizardMessage(
            "Perfect! I have all the information I need. Let me analyze your situation and create a step-by-step solution...",
            500
          );
          
          // Generate solution
          setTimeout(async () => {
            const solution = await generateSolution(session.classification!, newResponses);
            setSession(prev => ({ ...prev, stage: 'solution', solution }));
            
            await sendWizardMessage(
              `**Here's what's happening:**\n${solution.diagnosis}\n\n**Your step-by-step solution:**`,
              1500
            );
            
            // Present solution steps
            for (let i = 0; i < solution.solutionSteps.length; i++) {
              const step = solution.solutionSteps[i];
              setTimeout(async () => {
                await sendWizardMessage(
                  `**Step ${step.step}: ${step.title}**\n${step.description}${
                    step.code ? `\n\`\`\`\n${step.code}\n\`\`\`` : ''
                  }\n*Expected time: ${step.expectedTime}*${
                    step.aiPrompt ? `\n\n**🤖 AI Assistant Prompt:**\n\`\`\`\n${step.aiPrompt}\n\`\`\`\n*Copy this prompt to use with Replit AI, Cursor, Windsurf, or Lovable for this step*` : ''
                  }`,
                  800
                );
              }, (i + 1) * 2000);
            }
            
            // Ask for feedback after all steps
            setTimeout(async () => {
              await sendWizardMessage(
                `**Estimated total time:** ${solution.expectedTime}\n\nTry these steps and let me know how it goes! Did this solve your problem?`,
                1000
              );
              setSession(prev => ({ ...prev, stage: 'feedback' }));
            }, (solution.solutionSteps.length + 1) * 2000);
          }, 2000);
        }
        break;

      case 'solution':
        setSession(prev => ({ ...prev, stage: 'feedback' }));
        await sendWizardMessage(
          "Did the solution work for you? I'd love to know how it went so I can continue improving!"
        );
        break;

      case 'feedback':
        // Process feedback and offer next steps
        const wasSuccessful = userInput.toLowerCase().includes('yes') || 
                            userInput.toLowerCase().includes('worked') || 
                            userInput.toLowerCase().includes('fixed');
        
        if (wasSuccessful) {
          await sendWizardMessage(
            "Excellent! 🎉 I'm glad we got that sorted out.\n\n**Prevention tips for next time:**\n" +
            session.solution?.preventionTips.map(tip => `• ${tip}`).join('\n') +
            "\n\nFeel free to come back anytime you need help with another challenge!"
          );
        } else {
          await sendWizardMessage(
            "No worries - let's try a different approach.\n\n**Alternative solutions:**\n" +
            session.solution?.alternativeApproaches.map(alt => `• ${alt}`).join('\n') +
            "\n\nOr feel free to describe what happened when you tried the steps, and I'll adjust the solution."
          );
        }
        break;
    }
  };

  const getStageDisplay = () => {
    switch (session.stage) {
      case 'welcome': return 'Getting Started';
      case 'intake': return 'Understanding Your Problem';
      case 'questioning': return 'Diagnostic Questions';
      case 'analysis': return 'Analyzing Solution';
      case 'solution': return 'Step-by-Step Solution';
      case 'feedback': return 'Follow-up';
      default: return 'AI Development Wizard';
    }
  };

  const getProgressPercentage = () => {
    const stageValues = {
      welcome: 10,
      intake: 20,
      questioning: 50,
      analysis: 70,
      solution: 90,
      feedback: 100
    };
    return stageValues[session.stage] || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bot className="w-6 h-6 text-blue-600" />
                  AI Development Wizard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getStageDisplay()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Session Progress</p>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Pro Feature
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'wizard' 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {message.type === 'wizard' ? (
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`px-4 py-3 rounded-lg word-wrap break-words ${
                      message.type === 'wizard'
                        ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        : 'bg-blue-600 text-white'
                    }`}>
                      <div className={`text-sm whitespace-pre-wrap chat-message-content ${
                        message.type === 'wizard' 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-white'
                      }`}>
                        {message.content}
                      </div>
                      {/* Copy AI Prompt Button */}
                      {message.type === 'wizard' && message.content.includes('🤖 AI Assistant Prompt:') && (
                        <button
                          onClick={() => {
                            const promptMatch = message.content.match(/🤖 AI Assistant Prompt:\s*```\s*([\s\S]*?)\s*```/);
                            if (promptMatch) {
                              navigator.clipboard.writeText(promptMatch[1].trim());
                              toast({ title: "AI Prompt copied to clipboard!" });
                            }
                          }}
                          className="mt-2 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          📋 Copy AI Prompt
                        </button>
                      )}
                      <div className={`text-xs mt-2 ${
                        message.type === 'wizard' 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-blue-100'
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
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
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