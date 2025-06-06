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
import { useSubscription } from "@/hooks/use-subscription";
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
  const { createSession } = useSession();
  const { user } = useAuth();
  const { isProUser, tier, trialData } = useSubscription();

  useEffect(() => {
    const fetchSessionCount = async () => {
      if (user) {
        try {
          const response = await apiRequest("GET", `/api/user/sessions/count/${user.uid}`);
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
  
  // Use subscription hook to determine Pro access (includes trial users)
  const userTier = tier || 'free';
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

  const handleProblemSelect = (problemType: string) => {
    setSelectedProblem(problemType);
    
    // Auto-advance to solution for non-custom problems
    if (problemType !== "custom") {
      setTimeout(() => {
        handleAnalyze();
      }, 500); // Small delay for better UX
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 px-4">
          {Object.entries(problemData).map(([key, problem]) => {
            const Icon = problemIcons[key as keyof typeof problemIcons];
            const colorClass = problemColors[key as keyof typeof problemColors];
            const isSelected = selectedProblem === key;

            return (
              <Card
                key={key}
                className={`cursor-pointer transition-all surface-800 border-slate-700 hover:border-primary min-h-[140px] active:scale-95 ${
                  isSelected ? "border-primary surface-700 ring-2 ring-primary/20" : ""
                }`}
                onClick={() => handleProblemSelect(key)}
              >
                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                  <div className="text-center mb-3 md:mb-4">
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorClass} mb-2 md:mb-3 mx-auto`} />
                    <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{problem.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm mb-3 md:mb-4 flex-grow">{problem.description}</p>
                  <div className="text-xs text-slate-500">
                    <span className={`bg-${colorClass.split('-')[1]}-500/20 ${colorClass.replace('text-', 'text-')} px-2 py-1 rounded text-xs`}>
                      {problem.strategy} Strategy
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}



          {/* Custom Prompt Generator - Pro Feature */}
          <Card
            className={`cursor-pointer transition-all bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/50 hover:border-purple-400 min-h-[140px] active:scale-95 ${
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
            <CardContent className="p-4 md:p-6 h-full flex flex-col">
              <div className="text-center mb-3 md:mb-4">
                <div className="relative">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-2 md:mb-3 mx-auto" />
                  {!isProUser && (
                    <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-400 absolute -top-1 -right-1" />
                  )}
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-purple-200">
                  AI Prompt Generator
                </h3>
              </div>
              <p className="text-purple-300 text-xs md:text-sm mb-3 md:mb-4 flex-grow">
                Get custom prompts tailored to your specific problem using advanced AI analysis
              </p>
              <div className="text-xs">
                {isProUser ? (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {trialData?.isTrialActive ? "Available in Trial" : "Pro Feature"}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
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

        {/* Only show button for custom problems or when session limit reached */}
        <div className="text-center">
          {!canStartSession && userTier === 'free' ? (
            <div className="space-y-4">
              <p className="text-slate-400">You've used all 3 free rescues this month</p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 min-h-[48px] px-6"
                onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Rescue Pro - $9.99/month
              </Button>
            </div>
          ) : selectedProblem === "custom" ? (
            <Button
              onClick={handleAnalyze}
              disabled={!customProblem.trim()}
              size="lg"
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 min-h-[48px] px-6"
            >
              <Search className="w-5 h-5 mr-2" />
              Get Custom Solution
            </Button>
          ) : selectedProblem && selectedProblem !== "custom" ? (
            <div className="text-slate-400 text-sm">
              Loading your solution strategy...
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
