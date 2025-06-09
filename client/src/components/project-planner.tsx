import { useState } from 'react';
import { ArrowLeft, MessageCircle, FileText, Download, Save, RefreshCw, Users, Target, Zap, Clock, AlertTriangle, Edit3, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectPlannerProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ProjectPlan {
  overview: {
    purpose: string;
    goals: string[];
    targetUsers: string;
  };
  features: {
    essential: string[];
    niceToHave: string[];
  };
  technical: {
    techStack: string[];
    architecture: string;
  };
  userExperience: {
    userFlows: string[];
    interfaceNeeds: string[];
  };
  timeline: {
    phases: Array<{ name: string; duration: string; description: string }>;
    totalEstimate: string;
  };
  challenges: {
    risks: string[];
    solutions: string[];
  };
}

const INITIAL_QUESTIONS = [
  "Let's plan your project! You mentioned building {projectName}. Who is the main user of this application?",
  "What's the biggest problem this solves for them?",
  "What would make this project a huge success in your eyes?",
  "What are the 3 most important features users absolutely need?",
  "Do you need user accounts and authentication?",
  "Will this be web-only or do you need mobile apps too?",
  "Any third-party services or APIs you want to integrate?",
  "What's your target timeline for launching this?",
  "What's the trickiest part you're worried about building?"
];

export function ProjectPlanner({ onBack }: ProjectPlannerProps) {
  const { toast } = useToast();
  
  // Project input form state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Planning session state
  const [isPlanning, setIsPlanning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Project plan state
  const [projectPlan, setProjectPlan] = useState<ProjectPlan>({
    overview: { purpose: '', goals: [], targetUsers: '' },
    features: { essential: [], niceToHave: [] },
    technical: { techStack: [], architecture: '' },
    userExperience: { userFlows: [], interfaceNeeds: [] },
    timeline: { phases: [], totalEstimate: '' },
    challenges: { risks: [], solutions: [] }
  });
  
  // UI state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startPlanningSession = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both project name and description to start planning.",
        variant: "destructive"
      });
      return;
    }

    setIsPlanning(true);
    
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hi! I'm excited to help you plan "${projectName}". Let's turn your idea into a detailed project plan through our conversation. I'll ask you questions to understand exactly what you want to build.`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Ask first question after a brief delay
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const askNextQuestion = () => {
    if (currentQuestionIndex < INITIAL_QUESTIONS.length) {
      const question = INITIAL_QUESTIONS[currentQuestionIndex].replace('{projectName}', projectName);
      const questionMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: question,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Generate final plan
      generateFinalPlan();
    }
  };

  const sendUserMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsAiThinking(true);

    // Update project plan based on the answer
    await updateProjectPlan(userMessage.content, currentQuestionIndex - 1);

    // Simulate AI thinking time
    setTimeout(() => {
      setIsAiThinking(false);
      askNextQuestion();
    }, 1500);
  };

  const updateProjectPlan = async (answer: string, questionIndex: number) => {
    try {
      const response = await fetch('/api/update-project-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          experienceLevel,
          questionIndex,
          answer,
          currentPlan: projectPlan
        })
      });

      if (response.ok) {
        const updatedPlan = await response.json();
        setProjectPlan(updatedPlan);
      }
    } catch (error) {
      console.error('Failed to update project plan:', error);
    }
  };

  const generateFinalPlan = async () => {
    setIsAiThinking(true);
    
    try {
      const response = await fetch('/api/finalize-project-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          experienceLevel,
          messages: messages.filter(m => m.type === 'user'),
          currentPlan: projectPlan
        })
      });

      if (response.ok) {
        const finalPlan = await response.json();
        setProjectPlan(finalPlan);
        
        const completionMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `Perfect! I've created a comprehensive project plan for "${projectName}". Check out the detailed plan on the right. You can edit any section, ask follow-up questions, or export the plan when you're ready.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, completionMessage]);
      }
    } catch (error) {
      console.error('Failed to generate final plan:', error);
    } finally {
      setIsAiThinking(false);
    }
  };

  const downloadPlan = (format: 'pdf' | 'markdown') => {
    const planText = generatePlanText();
    const blob = new Blob([planText], { type: format === 'pdf' ? 'application/pdf' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}-project-plan.${format === 'pdf' ? 'pdf' : 'md'}`;
    link.click();
  };

  const generatePlanText = () => {
    return `# ${projectName} - Project Plan

## Project Overview
**Purpose:** ${projectPlan.overview?.purpose || 'Not specified'}

**Target Users:** ${projectPlan.overview?.targetUsers || 'Not specified'}

**Goals:**
${projectPlan.overview?.goals?.map(goal => `- ${goal}`).join('\n') || '- No goals specified'}

## Feature Specifications

### Essential Features
${projectPlan.features?.essential?.map(feature => `- ${feature}`).join('\n') || '- No essential features specified'}

### Nice-to-Have Features
${projectPlan.features?.niceToHave?.map(feature => `- ${feature}`).join('\n') || '- No nice-to-have features specified'}

## Technical Recommendations
**Architecture:** ${projectPlan.technical?.architecture || 'Not specified'}

**Tech Stack:**
${projectPlan.technical?.techStack?.map(tech => `- ${tech}`).join('\n') || '- No tech stack specified'}

## User Experience Design

### User Flows
${projectPlan.userExperience?.userFlows?.map(flow => `- ${flow}`).join('\n') || '- No user flows specified'}

### Interface Needs
${projectPlan.userExperience?.interfaceNeeds?.map(need => `- ${need}`).join('\n') || '- No interface needs specified'}

## Development Timeline
**Total Estimate:** ${projectPlan.timeline?.totalEstimate || 'Not specified'}

### Phases
${projectPlan.timeline?.phases?.map(phase => `**${phase.name}** (${phase.duration}): ${phase.description}`).join('\n\n') || 'No phases specified'}

## Potential Challenges

### Risks
${projectPlan.challenges?.risks?.map(risk => `- ${risk}`).join('\n') || '- No risks identified'}

### Solutions
${projectPlan.challenges?.solutions?.map(solution => `- ${solution}`).join('\n') || '- No solutions specified'}
`;
  };

  const savePlan = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-project-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          experienceLevel,
          projectPlan,
          messages
        })
      });

      if (response.ok) {
        toast({
          title: "Plan Saved",
          description: "Your project plan has been saved to your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save project plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isPlanning) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI Project Planner
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Interactive brainstorming to create detailed project plans
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Pro Feature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Let's Plan Your Project
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                I'll help you create a detailed project plan through an interactive conversation
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What's your project called?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Project Description *
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe what you want to build (at least 200 characters)..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {projectDescription.length}/200 characters minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button
                type="button"
                onClick={startPlanningSession}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Planning Session
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlanning(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Setup
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Planning: {projectName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Interactive AI brainstorming session
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={savePlan}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Plan
              </button>
              <button
                onClick={() => downloadPlan('markdown')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel: Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                AI Conversation
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendUserMessage()}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={sendUserMessage}
                  disabled={!currentMessage.trim() || isAiThinking}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Project Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Live Project Plan
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Overview */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Project Overview
                  </h3>
                  <button
                    onClick={() => setEditingSection(editingSection === 'overview' ? null : 'overview')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                {projectPlan.overview.purpose && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Purpose:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{projectPlan.overview.purpose}</p>
                  </div>
                )}
                
                {projectPlan.overview.targetUsers && (
                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Users:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{projectPlan.overview.targetUsers}</p>
                  </div>
                )}
                
                {projectPlan.overview.goals.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {projectPlan.overview.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    Feature Specifications
                  </h3>
                  <button
                    onClick={() => setEditingSection(editingSection === 'features' ? null : 'features')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                {projectPlan.features.essential.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Essential Features:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {projectPlan.features.essential.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {projectPlan.features.niceToHave.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nice-to-Have:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {projectPlan.features.niceToHave.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">○</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Technical Recommendations */}
              {(projectPlan.technical.architecture || projectPlan.technical.techStack.length > 0) && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Technical Recommendations
                    </h3>
                    <button
                      onClick={() => setEditingSection(editingSection === 'technical' ? null : 'technical')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {projectPlan.technical.architecture && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Architecture:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{projectPlan.technical.architecture}</p>
                    </div>
                  )}
                  
                  {projectPlan.technical.techStack.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {projectPlan.technical.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Development Timeline */}
              {(projectPlan.timeline.totalEstimate || projectPlan.timeline.phases.length > 0) && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Development Timeline
                    </h3>
                    <button
                      onClick={() => setEditingSection(editingSection === 'timeline' ? null : 'timeline')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {projectPlan.timeline.totalEstimate && (
                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Estimate:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{projectPlan.timeline.totalEstimate}</p>
                    </div>
                  )}
                  
                  {projectPlan.timeline.phases.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phases:</p>
                      <div className="space-y-2">
                        {projectPlan.timeline.phases.map((phase, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{phase.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{phase.duration}</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{phase.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Potential Challenges */}
              {(projectPlan.challenges.risks.length > 0 || projectPlan.challenges.solutions.length > 0) && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      Potential Challenges
                    </h3>
                    <button
                      onClick={() => setEditingSection(editingSection === 'challenges' ? null : 'challenges')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {projectPlan.challenges.risks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Risks:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {projectPlan.challenges.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {projectPlan.challenges.solutions.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Solutions:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {projectPlan.challenges.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-3 h-3 text-green-500 mt-0.5" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}