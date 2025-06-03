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
  Zap
} from "lucide-react";
import { problemData } from "@/lib/problem-data";
import { useSession } from "@/hooks/use-session";
import { useTimer } from "@/hooks/use-timer";
import { useAuth } from "@/hooks/use-auth";

interface SolutionDashboardProps {
  onBack: () => void;
  onNewSession: () => void;
  onSuccess: () => void;
  onCopy: () => void;
}

export function SolutionDashboard({ onBack, onNewSession, onSuccess, onCopy }: SolutionDashboardProps) {
  const { currentSession, updateSession } = useSession();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("prompts");
  const [projectGoal, setProjectGoal] = useState("");
  const [promptStyle, setPromptStyle] = useState("direct");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showGeneratedPrompt, setShowGeneratedPrompt] = useState(false);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [userTier, setUserTier] = useState<string>('free');
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
    // Always show Pro upgrade modal for the custom prompt generator
    setShowProUpgrade(true);
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
                      <div className="text-xs text-slate-500 flex items-center">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {prompt.explanation}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Prompt Generator - Pro Feature */}
              <div>
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
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Unlock Custom Prompts
                    </Button>
                  </CardContent>
                </Card>
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
    </section>
  );
}
