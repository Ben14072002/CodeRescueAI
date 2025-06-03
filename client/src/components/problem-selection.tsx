import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Layers, Unlink, Compass, HelpCircle, RotateCcw, Edit, Crown, Sparkles } from "lucide-react";
import { problemData } from "@/lib/problem-data";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface ProblemSelectionProps {
  onAnalyze: () => void;
  onBack: () => void;
  onCustomPrompts?: () => void;
}

export function ProblemSelection({ onAnalyze, onBack, onCustomPrompts }: ProblemSelectionProps) {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [customProblem, setCustomProblem] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [sessionCount, setSessionCount] = useState({ monthlyCount: 0, remainingFree: 3, canCreateSession: true });
  const [loadingCard, setLoadingCard] = useState<string | null>(null);
  const [successCard, setSuccessCard] = useState<string | null>(null);
  const { createSession } = useSession();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessionCount = async () => {
      if (user) {
        try {
          const response = await apiRequest("GET", "/api/user/sessions/count");
          const data = await response.json();
          setSessionCount(data);
        } catch (error) {
          console.error("Failed to fetch session count:", error);
          // For unauthenticated users, fall back to local storage count
          setSessionCount({ monthlyCount: 0, remainingFree: 3, canCreateSession: true });
        }
      } else {
        // For unauthenticated users, use local storage
        setSessionCount({ monthlyCount: 0, remainingFree: 3, canCreateSession: true });
      }
    };

    fetchSessionCount();
  }, [user]);
  
  // For now, allow all authenticated users to test the feature
  // TODO: Integrate with actual user subscription data from database
  const userTier = 'free';
  const isProUser = !!user;
  const canStartSession = sessionCount.canCreateSession;
  const remainingSessions = sessionCount.remainingFree;

  const problemIcons = {
    complexity_overwhelm: Layers,
    integration_issues: Unlink,
    lost_direction: Compass,
    no_planning: HelpCircle,
    repeated_failures: RotateCcw,
    custom: Edit,
  };

  const problemColors = {
    complexity_overwhelm: "text-amber-500",
    integration_issues: "text-red-500",
    lost_direction: "text-purple-500",
    no_planning: "text-orange-500",
    repeated_failures: "text-cyan-500",
    custom: "text-slate-500",
  };

  const handleProblemSelect = async (problemType: string) => {
    // Show loading state
    setLoadingCard(problemType);
    
    // Simulate selection processing (in real app, this might validate or prepare data)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSelectedProblem(problemType);
    setLoadingCard(null);
    setSuccessCard(problemType);
    
    // Clear success state after animation
    setTimeout(() => setSuccessCard(null), 600);
  };

  const handleAnalyze = () => {
    if (!selectedProblem) return;

    // Check if user has reached their session limit
    if (!canStartSession) {
      return; // This will be handled by the disabled button state
    }

    createSession({
      problemType: selectedProblem,
      projectDescription,
      customProblem: selectedProblem === "custom" ? customProblem : undefined,
      selectedStrategy: selectedProblem === "custom" ? "custom" : problemData[selectedProblem]?.strategy || "",
      startTime: new Date(),
      actionSteps: problemData[selectedProblem]?.steps.map((step, index) => ({
        id: index,
        title: step.title,
        completed: false,
        timeSpent: 0,
      })) || [],
      prompts: problemData[selectedProblem]?.prompts.map((prompt, index) => ({
        id: index,
        text: prompt.text,
        used: false,
      })) || [],
      notes: "",
      success: false,
      progress: 0,
      stepsCompleted: 0,
      totalTimeSpent: 0,
    });

    onAnalyze();
  };

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">What's happening with your AI assistant?</h2>
          <p className="text-slate-400">Select the problem that best describes your current situation</p>
          
          {/* Usage tracking display */}
          {userTier === 'free' && (
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
                {remainingSessions} rescues remaining this month
                {remainingSessions === 0 && (
                  <Crown className="w-4 h-4 ml-2 text-amber-500" />
                )}
              </Badge>
            </div>
          )}
        </div>

        <div className="problem-cards-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(problemData).map(([key, problem], index) => {
            const Icon = problemIcons[key as keyof typeof problemIcons];
            const colorClass = problemColors[key as keyof typeof problemColors];
            const isSelected = selectedProblem === key;

            return (
              <Card
                key={key}
                className={`problem-card cursor-pointer transition-all duration-300 surface-800 border-slate-700 hover:border-primary transform hover:scale-105 hover:shadow-xl ${
                  isSelected ? "border-primary surface-700 selected-card scale-105" : ""
                } ${loadingCard === key ? "card-loading" : ""} ${successCard === key ? "card-success" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleProblemSelect(key)}
              >
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="card-background-gradient absolute inset-0 opacity-0 transition-opacity duration-500"></div>
                  <div className="text-center mb-4 relative z-10">
                    <div className="icon-container mb-3">
                      <Icon className={`problem-icon w-8 h-8 ${colorClass} mx-auto transition-all duration-300 ${loadingCard === key ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 transition-colors duration-300">{problem.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{problem.description}</p>
                  <div className="text-xs text-slate-500">
                    <span className={`bg-${colorClass.split('-')[1]}-500/20 ${colorClass.replace('text-', 'text-')} px-2 py-1 rounded`}>
                      {problem.strategy} Strategy
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Custom Problem Card */}
          <Card
            className={`cursor-pointer transition-all surface-800 border-slate-700 hover:border-primary ${
              selectedProblem === "custom" ? "border-primary surface-700" : ""
            }`}
            onClick={() => handleProblemSelect("custom")}
          >
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Edit className="w-8 h-8 text-slate-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Something Else</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">Describe your specific situation for custom guidance</p>
              <div className="text-xs text-slate-500">
                <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded">Custom Strategy</span>
              </div>
            </CardContent>
          </Card>

          {/* Custom Prompt Generator - Pro Feature */}
          <Card
            className={`cursor-pointer transition-all bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/50 hover:border-purple-400 ${
              !isProUser ? 'opacity-75' : ''
            }`}
            onClick={() => {
              if (isProUser && onCustomPrompts) {
                onCustomPrompts();
              } else {
                window.location.href = '/?section=pricing';
              }
            }}
          >
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                  {userTier !== 'pro' && (
                    <Crown className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-200">
                  AI Prompt Generator
                </h3>
              </div>
              <p className="text-purple-300 text-sm mb-4">
                Get custom prompts tailored to your specific problem using AI analysis
              </p>
              <div className="text-xs">
                {isProUser ? (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro Feature
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Problem Description */}
        {selectedProblem === "custom" && (
          <Card className="surface-800 border-slate-700 mb-6 animate-slide-up">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Describe Your Situation</h3>
              <div className="space-y-4">
                <div>
                  <Textarea
                    value={customProblem}
                    onChange={(e) => setCustomProblem(e.target.value)}
                    placeholder="Describe what's happening with your AI assistant and what you're trying to build..."
                    className="bg-slate-700 border-slate-600"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Project Description (Optional)</Label>
                  <Input
                    id="projectDescription"
                    type="text"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="e.g., Building a todo app with user authentication"
                    className="bg-slate-700 border-slate-600 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          {!canStartSession && userTier === 'free' ? (
            <div className="space-y-4">
              <p className="text-slate-400">You've used all 3 free rescues this month</p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Rescue Pro - $9.99/month
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAnalyze}
              disabled={!selectedProblem}
              size="lg"
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Search className="w-5 h-5 mr-2" />
              Get Solution Strategy
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
