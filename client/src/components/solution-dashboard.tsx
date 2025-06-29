import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Plus, 
  MessageSquare, 
  ListChecks, 
  TrendingUp, 
  Copy, 
  Wand2,
  Play,
  Pause,
  Trophy,
  Lightbulb,
  Clock,
  CheckCircle,
  Circle,
  Star,
  Crown,
  Zap,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { problemData } from "@/lib/problem-data";
import { useSession } from "@/hooks/use-session";
import { useTimer } from "@/hooks/use-timer";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Recent Sessions Widget Component
function RecentSessionsWidget({ userId }: { userId?: string }) {
  const { data: recentSessions, isLoading } = useQuery({
    queryKey: ['recent-sessions', userId],
    queryFn: async () => {
      if (!userId) return { sessions: [] };
      const response = await apiRequest('GET', `/api/user/recent-sessions/${userId}?limit=3`);
      return await response.json();
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card className="surface-800 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center text-slate-400">Loading recent sessions...</div>
        </CardContent>
      </Card>
    );
  }

  const sessions = recentSessions?.sessions || [];

  if (sessions.length === 0) {
    return (
      <Card className="surface-800 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <p className="text-sm">No recent rescue sessions yet</p>
            <p className="text-xs text-slate-500">Your rescue history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="surface-800 border-slate-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          {sessions.map((session: any, index: number) => {
            const problemInfo = problemData[session.problemType] || { title: 'Custom Problem', color: 'slate' };
            return (
              <div key={session.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full bg-${problemInfo.color}-500`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{problemInfo.title}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {session.progress}% complete
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface SolutionDashboardProps {
  onBack: () => void;
  onNewSession: () => void;
  onSuccess: () => void;
  onCopy: () => void;
  onCustomPrompts?: () => void;
}

export function SolutionDashboard({ onBack, onNewSession, onSuccess, onCopy, onCustomPrompts }: SolutionDashboardProps) {
  const { currentSession, updateSession } = useSession();
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("prompts");
  const [projectGoal, setProjectGoal] = useState("");
  const [promptStyle, setPromptStyle] = useState("direct");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showGeneratedPrompt, setShowGeneratedPrompt] = useState(false);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [userTier, setUserTier] = useState<string>('free');
  const [promptRatings, setPromptRatings] = useState<{ [key: number]: 'positive' | 'negative' | null }>({});
  const { timers, startTimer, stopTimer, getElapsedTime } = useTimer();

  if (!currentSession) return null;

  const problemInfo = problemData[currentSession.problemType] || {
    title: "Custom Problem",
    icon: "fas fa-edit",
    color: "slate",
    description: "Custom problem description",
    strategy: "Custom Strategy",
    prompts: [],
    steps: []
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePromptRating = async (promptIndex: number, rating: 'positive' | 'negative') => {
    if (!user?.uid || !currentSession?.id) return;
    
    try {
      const promptText = problemInfo.prompts[promptIndex]?.text || '';
      
      await apiRequest('POST', '/api/rate-prompt', {
        userId: user.uid,
        sessionId: currentSession.id,
        promptIndex,
        rating,
        promptText,
        problemType: currentSession.problemType
      });

      setPromptRatings(prev => ({
        ...prev,
        [promptIndex]: rating
      }));

      toast({
        title: "Feedback Recorded",
        description: `Thanks for rating this prompt ${rating === 'positive' ? 'helpful' : 'not helpful'}!`,
      });
    } catch (error) {
      console.error('Error rating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to record your feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStepComplete = (stepId: number, completed: boolean) => {
    const updatedSteps = currentSession.actionSteps.map(step => 
      step.id === stepId ? { ...step, completed } : step
    );
    
    const stepsCompleted = updatedSteps.filter(step => step.completed).length;
    const progress = Math.round((stepsCompleted / updatedSteps.length) * 100);

    updateSession({
      ...currentSession,
      actionSteps: updatedSteps,
      stepsCompleted,
      progress
    });
  };

  const handleTimerToggle = (stepId: number) => {
    const isRunning = timers[stepId]?.isRunning;
    
    if (isRunning) {
      const elapsed = stopTimer(stepId);
      const updatedSteps = currentSession.actionSteps.map(step => 
        step.id === stepId ? { ...step, timeSpent: step.timeSpent + elapsed } : step
      );
      updateSession({ ...currentSession, actionSteps: updatedSteps });
    } else {
      startTimer(stepId);
    }
  };

  const handleCustomPromptClick = () => {
    // Check if user has Pro subscription
    if (isPro) {
      // Navigate to custom prompt generator if callback is provided
      if (onCustomPrompts) {
        onCustomPrompts();
      }
    } else {
      setShowProUpgrade(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getIconComponent = (iconClass: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      "fas fa-layer-group": ({ className }) => <div className={className}>📚</div>,
      "fas fa-unlink": ({ className }) => <div className={className}>🔗</div>,
      "fas fa-compass": ({ className }) => <div className={className}>🧭</div>,
      "fas fa-question-circle": ({ className }) => <div className={className}>❓</div>,
      "fas fa-redo": ({ className }) => <div className={className}>🔄</div>,
      "fas fa-edit": ({ className }) => <div className={className}>✏️</div>,
    };
    
    const IconComponent = iconMap[iconClass];
    return IconComponent || (() => <div>🔧</div>);
  };

  const IconComponent = getIconComponent(problemInfo.icon);

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>
          <Button
            variant="outline"
            onClick={onNewSession}
            className="surface-700 border-slate-600 hover:surface-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        {/* Solution Header */}
        <Card className="surface-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <IconComponent className={`text-2xl text-${problemInfo.color}-500 mr-3`} />
                  <h2 className="text-2xl font-bold">{problemInfo.title}</h2>
                </div>
                <p className="text-slate-400 mb-4">{problemInfo.description}</p>
                <Badge variant="secondary" className={`bg-${problemInfo.color}-500/20 text-${problemInfo.color}-400`}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Strategy: {problemInfo.strategy}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Session Started</div>
                <div className="font-mono text-primary">
                  {new Date(currentSession.startTime).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 surface-800">
            <TabsTrigger value="prompts" className="data-[state=active]:bg-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Smart Prompts
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-primary">
              <ListChecks className="w-4 h-4 mr-2" />
              Action Steps
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ready-to-Use Prompts</h3>
                
                {problemInfo.prompts.map((prompt, index) => (
                  <Card key={index} className="surface-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-primary text-white">
                            PROMPT {index + 1}
                          </Badge>
                          <span className="text-sm text-slate-400">{prompt.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToClipboard(prompt.text)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4 font-mono text-sm mb-3">
                        <p className="text-slate-200">{prompt.text}</p>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mb-3">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {prompt.explanation}
                      </div>
                      
                      {/* Success Tracking - Thumbs Up/Down Rating */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                        <span className="text-xs text-slate-500">Was this prompt helpful?</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePromptRating(index, 'positive')}
                            className={`p-2 h-8 w-8 ${
                              promptRatings[index] === 'positive' 
                                ? 'bg-green-600 text-white' 
                                : 'text-slate-400 hover:text-green-400 hover:bg-green-600/20'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePromptRating(index, 'negative')}
                            className={`p-2 h-8 w-8 ${
                              promptRatings[index] === 'negative' 
                                ? 'bg-red-600 text-white' 
                                : 'text-slate-400 hover:text-red-400 hover:bg-red-600/20'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Prompt Generator - Pro Feature */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  Custom Prompt Generator
                  <Badge className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </h3>
                <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30">
                  <CardContent className="p-6 text-center">
                    <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-100 mb-2">
                      AI-Powered Custom Prompts
                    </h4>
                    <p className="text-slate-300 mb-4 text-sm">
                      Generate category-specific prompts tailored to your exact situation using advanced AI analysis.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-400">
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-blue-400" />
                        OpenAI Integration
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-amber-400" />
                        3 Prompt Variations
                      </div>
                      <div className="flex items-center">
                        <Crown className="w-3 h-3 mr-1 text-amber-400" />
                        Expert Techniques
                      </div>
                      <div className="flex items-center">
                        <Lightbulb className="w-3 h-3 mr-1 text-green-400" />
                        Context Analysis
                      </div>
                    </div>
                    <Button
                      onClick={handleCustomPromptClick}
                      className={`w-full ${
                        isPro 
                          ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" 
                          : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
                      } text-white`}
                    >
                      {isPro ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Custom Prompts
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Unlock Custom Prompts
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Sessions - Prompt History */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  Recent Rescues
                  <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    History
                  </Badge>
                </h3>
                <RecentSessionsWidget userId={user?.uid} />
              </div>
            </div>
          </TabsContent>

          {/* Action Steps Tab */}
          <TabsContent value="steps" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-6">Step-by-Step Action Plan</h3>
              
              <div className="space-y-4">
                {currentSession.actionSteps.map((step, index) => {
                  const stepData = problemInfo.steps[index];
                  const isTimerRunning = timers[step.id]?.isRunning;
                  const currentElapsed = isTimerRunning ? getElapsedTime(step.id) : 0;
                  const totalTime = step.timeSpent + currentElapsed;

                  return (
                    <Card key={step.id} className="surface-800 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            <Checkbox
                              checked={step.completed}
                              onCheckedChange={(checked) => handleStepComplete(step.id, checked as boolean)}
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-lg">{step.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTimerToggle(step.id)}
                                  className={`${
                                    isTimerRunning 
                                      ? "text-red-400 hover:text-red-300" 
                                      : "text-slate-400 hover:text-primary"
                                  }`}
                                >
                                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                                <span className="text-sm font-mono text-slate-400 min-w-[4rem]">
                                  {formatTime(totalTime)}
                                </span>
                              </div>
                            </div>
                            {stepData && (
                              <>
                                <p className="text-slate-400 mb-4">{stepData.description}</p>
                                <div className="bg-slate-700 rounded-lg p-4">
                                  <h5 className="font-medium mb-2 text-emerald-400">Success Criteria:</h5>
                                  <ul className="text-sm text-slate-300 space-y-1">
                                    {stepData.criteria.map((criterion, idx) => (
                                      <li key={idx}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Notes Section */}
              <Card className="surface-800 border-slate-700 mt-8">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Session Notes</h4>
                  <Textarea
                    value={currentSession.notes}
                    onChange={(e) => updateSession({ ...currentSession, notes: e.target.value })}
                    placeholder="Track what's working, what isn't, and any insights..."
                    className="bg-slate-700 border-slate-600"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-6">Session Progress</h3>
                  
                  <Card className="surface-800 border-slate-700 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Overall Progress</h4>
                        <span className="text-2xl font-bold text-primary">{currentSession.progress}%</span>
                      </div>
                      <Progress value={currentSession.progress} className="mb-4" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">Steps Completed</div>
                          <div className="font-semibold">
                            {currentSession.stepsCompleted} of {currentSession.actionSteps.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Time Spent</div>
                          <div className="font-semibold font-mono">
                            {formatTime(currentSession.totalTimeSpent)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="surface-800 border-slate-700">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Step Breakdown</h4>
                      <div className="space-y-3">
                        {currentSession.actionSteps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              step.completed
                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                : "bg-slate-700"
                            }`}
                          >
                            <div className="flex items-center">
                              {step.completed ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 mr-3" />
                              )}
                              <span className={`text-sm ${step.completed ? "" : "text-slate-400"}`}>
                                {step.title}
                              </span>
                            </div>
                            <span className={`text-xs font-mono ${
                              step.completed ? "text-emerald-400" : "text-slate-500"
                            }`}>
                              {step.timeSpent > 0 ? formatTime(step.timeSpent) : "--:--"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-6">Success Metrics</h3>
                  
                  <Card className="surface-800 border-slate-700 mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Prompt Effectiveness</h4>
                      </div>
                      <div className="space-y-3">
                        {problemInfo.prompts.map((prompt, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Prompt {index + 1}: {prompt.name}</span>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button key={rating} className="text-slate-500 hover:text-amber-500">
                                    <Star className="w-4 h-4" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-emerald-500/20">
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <h4 className="font-semibold text-emerald-400 mb-2">Ready to Celebrate?</h4>
                      <p className="text-sm text-slate-300 mb-4">
                        Mark this session as successful when you've gotten unstuck!
                      </p>
                      <Button
                        onClick={onSuccess}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Mark as Successful
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pro Upgrade Modal */}
      <Dialog open={showProUpgrade} onOpenChange={setShowProUpgrade}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-slate-100">
              <Crown className="w-5 h-5 mr-2 text-amber-400" />
              Unlock Custom Prompt Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Premium AI-Powered Prompts
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Generate category-specific prompts with OpenAI analysis and expert techniques tailored to your exact coding situation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-slate-300">
                <Zap className="w-4 h-4 mr-2 text-blue-400" />
                OpenAI Integration
              </div>
              <div className="flex items-center text-slate-300">
                <Star className="w-4 h-4 mr-2 text-amber-400" />
                3 Prompt Variations
              </div>
              <div className="flex items-center text-slate-300">
                <Crown className="w-4 h-4 mr-2 text-amber-400" />
                Expert Techniques
              </div>
              <div className="flex items-center text-slate-300">
                <Lightbulb className="w-4 h-4 mr-2 text-green-400" />
                Context Analysis
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
              <div className="text-amber-300 font-semibold mb-1">Pro Plan - $4.99/month</div>
              <div className="text-xs text-slate-400">
                Unlimited rescues + Custom prompt generation + Priority support
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowProUpgrade(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
