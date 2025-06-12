import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Crown, Copy, CheckCircle, Brain, Zap, Star, Target, Code, Database, Bug, Server, Gauge, Shield, TestTube, Building, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrial } from "@/hooks/use-trial";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CustomPrompt {
  title: string;
  prompt: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating?: number;
}

interface ProblemCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  strategies: string[];
}

interface CustomPromptGeneratorProps {
  onBack: () => void;
}

const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: 'complexity-overwhelm',
    name: 'Complexity Overwhelm',
    description: 'AI builds everything at once, creating chaos',
    icon: Brain,
    strategies: ['context reset', 'role constraints', 'methodology enforcement']
  },
  {
    id: 'integration-issues',
    name: 'Integration Issues',
    description: 'Cannot connect components or features together',
    icon: Zap,
    strategies: ['isolation debugging', 'contract-first development', 'adapter patterns']
  },
  {
    id: 'lost-direction',
    name: 'Lost Direction',
    description: 'Feature creep and scope expansion',
    icon: Target,
    strategies: ['requirements archaeology', 'user story constraints', 'goal realignment']
  },
  {
    id: 'no-clear-plan',
    name: 'No Clear Plan',
    description: 'Random coding without structure',
    icon: CheckCircle,
    strategies: ['reverse engineering', 'walking skeleton', 'milestone definition']
  },
  {
    id: 'repeated-failures',
    name: 'Repeated Failures',
    description: 'Stuck in endless debug loops',
    icon: Copy,
    strategies: ['architecture reset', 'constraint-driven development', 'alternative approaches']
  },
  {
    id: 'ai-hallucination',
    name: 'AI Hallucination',
    description: 'AI provides incorrect information or non-existent solutions',
    icon: Brain,
    strategies: ['reality check', 'documentation verification', 'conservative debugging']
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Custom problem not covered by standard categories',
    icon: Star,
    strategies: ['problem analysis', 'context gathering', 'adaptive solutions']
  }
];

const PROGRAMMING_LANGUAGES = [
  'JavaScript/TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'HTML/CSS',
  'SQL',
  'Shell/Bash',
  'Other'
];

const AI_TOOLS = [
  'Replit Agent',
  'ChatGPT',
  'Claude',
  'GitHub Copilot',
  'Cursor',
  'Windsurf',
  'Lovable',
  'V0.dev',
  'Bolt.new',
  'CodeWhisperer',
  'Codeium',
  'Tabnine',
  'Other'
];

export function CustomPromptGenerator({ onBack }: CustomPromptGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState("");
  const [customProblemDescription, setCustomProblemDescription] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState<string>("");
  const [aiTool, setAiTool] = useState<string>("");
  const [codeContext, setCodeContext] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<CustomPrompt[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const { user } = useAuth();
  const { isProUser, checkPremiumAccess } = useSubscription();
  const { isTrialActive } = useTrial();
  const { toast } = useToast();

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
                  <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <Lock className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 bg-slate-900 rounded-full p-1" />
                </div>
                <h1 className="text-3xl font-bold text-slate-100 mb-4">
                  Custom Prompt Generator
                </h1>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Feature
                </Badge>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">
                  AI-Powered Custom Prompts
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Generate category-specific prompts tailored to your exact situation using advanced AI analysis. 
                  Perfect for when you need precise control over your AI assistant interactions.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Target className="w-5 h-5 text-purple-400 mb-2" />
                    <div className="font-medium text-slate-100">Category-Specific</div>
                    <div className="text-slate-400">Prompts tailored to your problem type</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-medium text-slate-100">AI Analysis</div>
                    <div className="text-slate-400">Advanced OpenAI prompt generation</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-medium text-slate-100">Instant Results</div>
                    <div className="text-slate-400">Multiple variations to choose from</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <Star className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="font-medium text-slate-100">Copy & Paste</div>
                    <div className="text-slate-400">Ready-to-use prompts with explanations</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {user ? (
                  <>
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                      onClick={() => window.location.href = '/profile?upgrade=prompts'}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Start 3-Day Free Trial
                    </Button>
                    <p className="text-slate-400 text-sm">
                      Get full access to Custom Prompt Generator + all Pro features
                    </p>
                    <p className="text-slate-400 text-xs">
                      No credit card required • Cancel anytime • Then $4.99/month
                    </p>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                      onClick={() => window.location.href = '/?signup=prompts'}
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

  const generateCustomPrompts = async () => {
    if (!selectedCategory) {
      toast({
        title: "Missing Category",
        description: "Please select a problem category first.",
        variant: "destructive"
      });
      return;
    }

    // For "Other" category, require custom problem description
    if (selectedCategory === 'other' && !customProblemDescription.trim()) {
      toast({
        title: "Missing Custom Problem Description",
        description: "Please describe your specific problem when using 'Other' category.",
        variant: "destructive"
      });
      return;
    }

    // For standard categories, require general problem description
    if (selectedCategory !== 'other' && !problemDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please describe your specific problem.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-category-prompts", {
        userId: user?.uid,
        category: selectedCategory,
        problemDescription: selectedCategory === 'other' ? customProblemDescription : problemDescription,
        customProblemDescription: selectedCategory === 'other' ? customProblemDescription : undefined,
        programmingLanguage,
        aiTool,
        codeContext,
        errorMessages
      });

      if (!response.ok) {
        const error = await response.json();
        
        if (response.status === 403) {
          // User needs Pro subscription - show upgrade modal
          toast({
            title: "Pro Subscription Required",
            description: "Custom prompt generation requires a Pro subscription. Please upgrade to continue.",
            variant: "destructive"
          });
          return;
        }
        
        throw new Error(error.message || "Failed to generate prompts");
      }

      const data = await response.json();
      setGeneratedPrompts(data.prompts);
      
      toast({
        title: "Category-Specific Prompts Generated",
        description: `Generated ${data.prompts.length} specialized prompts for ${PROBLEM_CATEGORIES.find(c => c.id === selectedCategory)?.name}.`
      });
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate custom prompts.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "Prompt has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  if (!isProUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-slate-400 hover:text-slate-200"
        >
          ← Back to Problems
        </Button>

        <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              Category-Specific Prompt Generator
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Advanced AI-powered prompt generation with specialized strategies for each problem type. 
              Uses OpenAI to analyze your specific situation and generate tailored prompts with proven 
              techniques like context reset, contract-first development, and architecture reset.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-200 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-400" />
                  Premium Features
                </h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Category-specific strategies</li>
                  <li>• OpenAI-powered analysis</li>
                  <li>• 3 prompt variations per request</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-200 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-blue-400" />
                  Problem Categories
                </h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Complexity Overwhelm</li>
                  <li>• Integration Issues</li>
                  <li>• Lost Direction & More</li>
                </ul>
              </div>
            </div>

            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Pro Feature - $4.99/month
            </Badge>
            <div className="space-y-2">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
              >
                Upgrade to Pro
              </Button>
              <p className="text-sm text-slate-400">
                Unlimited rescues + Category-specific prompt generation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-slate-400 hover:text-slate-200 min-h-[44px]"
      >
        ← Back to Problems
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-100">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Problem Analysis
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Describe your specific situation for tailored prompt generation
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-slate-300 text-base mb-3 block flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-400" />
                  Problem Category *
                  <Badge className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                    <SelectValue placeholder="Select your problem category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {PROBLEM_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-slate-100 focus:bg-slate-700">
                        <div className="flex items-center">
                          <category.icon className="w-4 h-4 mr-2 text-blue-400" />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-slate-400">{category.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-blue-300">
                      <strong>Specialized Techniques:</strong> {PROBLEM_CATEGORIES.find(c => c.id === selectedCategory)?.strategies.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Show custom problem description field only for "Other" category */}
              {selectedCategory === 'other' && (
                <div>
                  <Label className="text-slate-300 text-base mb-3 block">
                    Custom Problem Description *
                  </Label>
                  <Textarea
                    value={customProblemDescription}
                    onChange={(e) => setCustomProblemDescription(e.target.value)}
                    placeholder="Describe your specific problem that doesn't fit the standard categories. Be as detailed as possible about the issue you're facing..."
                    className="min-h-32 bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>
              )}

              {/* Show standard problem description for all other categories */}
              {selectedCategory && selectedCategory !== 'other' && (
                <div>
                  <Label className="text-slate-300 text-base mb-3 block">
                    Problem Description *
                  </Label>
                  <Textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe what you're trying to build and where you're stuck. Be as specific as possible about the issue you're facing with your AI assistant..."
                    className="min-h-32 bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>
              )}

              {/* Programming Language Selection */}
              <div>
                <Label className="text-slate-300 text-base mb-3 block flex items-center">
                  <Code className="w-4 h-4 mr-2 text-green-400" />
                  Programming Language (Optional)
                </Label>
                <Select value={programmingLanguage} onValueChange={setProgrammingLanguage}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                    <SelectValue placeholder="Select your programming language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {PROGRAMMING_LANGUAGES.map((language) => (
                      <SelectItem key={language} value={language} className="text-slate-100 focus:bg-slate-700">
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AI Tool Selection */}
              <div>
                <Label className="text-slate-300 text-base mb-3 block flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-400" />
                  AI Tool (Optional)
                </Label>
                <Select value={aiTool} onValueChange={setAiTool}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                    <SelectValue placeholder="Select the AI tool you're using" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {AI_TOOLS.map((tool) => (
                      <SelectItem key={tool} value={tool} className="text-slate-100 focus:bg-slate-700">
                        {tool}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300 text-base mb-3 block">
                  Code Context (Optional)
                </Label>
                <Textarea
                  value={codeContext}
                  onChange={(e) => setCodeContext(e.target.value)}
                  placeholder="Paste relevant code snippets, file structure, or technology stack details..."
                  className="min-h-24 bg-slate-800/50 border-slate-600 text-slate-100 font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-slate-300 text-base mb-3 block">
                  Error Messages (Optional)
                </Label>
                <Textarea
                  value={errorMessages}
                  onChange={(e) => setErrorMessages(e.target.value)}
                  placeholder="Any error messages or unexpected behavior you're experiencing..."
                  className="min-h-20 bg-slate-800/50 border-slate-600 text-slate-100 font-mono text-sm"
                />
              </div>

              <Button 
                onClick={generateCustomPrompts}
                disabled={isGenerating || !problemDescription.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 min-h-[48px]"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="text-sm md:text-base">Analyzing Problem...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm md:text-base">Generate Custom Prompts</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {generatedPrompts.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Custom Generated Prompts
                </CardTitle>
                <p className="text-slate-400 text-sm">
                  AI-tailored prompts based on your specific problem
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompts.map((prompt, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-100">{prompt.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(prompt.difficulty)}>
                          {prompt.difficulty}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPrompt(prompt.prompt, index)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {prompt.methodology_steps && (
                      <div className="mb-3">
                        <h4 className="text-slate-300 text-sm font-medium mb-2">Strategic Methodology:</h4>
                        <div className="flex flex-wrap gap-1">
                          {prompt.methodology_steps.map((step, stepIndex) => (
                            <Badge key={stepIndex} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {step}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-slate-900/50 rounded p-4 mb-3 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs uppercase tracking-wide">Copy-Paste Prompt</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPrompt(prompt.prompt, index)}
                          className="text-slate-400 hover:text-slate-200 h-6 px-2"
                        >
                          {copiedIndex === index ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                              <span className="text-xs text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-slate-200 text-sm whitespace-pre-wrap font-mono leading-relaxed">{prompt.prompt}</p>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                      <h4 className="text-blue-300 text-sm font-medium mb-1">Why This Works:</h4>
                      <p className="text-slate-400 text-xs">{prompt.explanation}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {generatedPrompts.length === 0 && (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-slate-400 text-sm">
                  Describe your problem above and our AI will create custom prompts tailored to your specific situation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}