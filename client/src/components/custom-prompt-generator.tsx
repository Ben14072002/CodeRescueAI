import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Crown, Copy, CheckCircle, Brain, Zap, Star, Target, Code, Database, Bug, Server, Gauge, Shield, TestTube, Building } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
  }
];

export function CustomPromptGenerator({ onBack }: CustomPromptGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState("");
  const [codeContext, setCodeContext] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<CustomPrompt[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if user has Pro subscription
  const [userTier, setUserTier] = useState<string>('free');
  
  useEffect(() => {
    if (user) {
      // Fetch user subscription status
      fetch(`/api/subscription-status/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setUserTier(data.tier || 'free');
        })
        .catch(() => setUserTier('free'));
    }
  }, [user]);
  
  const isProUser = userTier === 'pro' || userTier === 'pro_monthly' || userTier === 'pro_yearly';

  const generateCustomPrompts = async () => {
    if (!selectedCategory) {
      toast({
        title: "Missing Category",
        description: "Please select a problem category first.",
        variant: "destructive"
      });
      return;
    }

    if (!problemDescription.trim()) {
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
        problemDescription,
        codeContext,
        errorMessages
      });

      if (!response.ok) {
        const error = await response.json();
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
              Pro Feature - $9.99/month
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
    <div className="max-w-6xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-slate-400 hover:text-slate-200"
      >
        ← Back to Problems
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
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
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Problem...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Custom Prompts
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
                    
                    <div className="bg-slate-900/50 rounded p-3 mb-3">
                      <p className="text-slate-200 text-sm whitespace-pre-wrap">{prompt.prompt}</p>
                    </div>
                    
                    <p className="text-slate-400 text-xs">{prompt.explanation}</p>
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