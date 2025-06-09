import React, { useState } from 'react';
import { ArrowLeft, Target, Brain, Zap, Code2, Database, Globe, CheckCircle, Download, AlertTriangle, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface RoadmapCreatorStyledProps {
  onBack: () => void;
}

// Styled version of RoadmapCreatorV3 with CodeBreaker branding
export function RoadmapCreatorStyled({ onBack }: RoadmapCreatorStyledProps) {
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'recipe' | 'roadmap'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectAnalysis, setProjectAnalysis] = useState<any>(null);
  const [projectRecipe, setProjectRecipe] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const { toast } = useToast();
  
  const [projectInput, setProjectInput] = useState({
    name: '',
    description: '',
    goals: [''],
    constraints: [''],
    timeline: '',
    experience: 'beginner'
  });

  const handleInputChange = (field: keyof typeof projectInput, value: string | string[]) => {
    setProjectInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addGoal = () => {
    setProjectInput(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setProjectInput(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeGoal = (index: number) => {
    setProjectInput(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addConstraint = () => {
    setProjectInput(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const updateConstraint = (index: number, value: string) => {
    setProjectInput(prev => ({
      ...prev,
      constraints: prev.constraints.map((constraint, i) => i === index ? value : constraint)
    }));
  };

  const removeConstraint = (index: number) => {
    setProjectInput(prev => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index)
    }));
  };

  const canProceed = projectInput.name && projectInput.description && 
                   projectInput.goals.some(g => g.trim()) && projectInput.timeline;

  const generateAnalysis = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectInput.name,
          description: projectInput.description,
          goals: projectInput.goals.filter(g => g.trim()),
          constraints: projectInput.constraints.filter(c => c.trim()),
          timeline: projectInput.timeline,
          experience: projectInput.experience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }

      const analysis = await response.json();
      console.log('Analysis received:', analysis);
      setProjectAnalysis(analysis);
      setCurrentPhase('analysis');
      console.log('Phase changed to analysis');
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRecipe = async () => {
    if (!projectAnalysis) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectInput,
          analysis: projectAnalysis
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const recipe = await response.json();
      setProjectRecipe(recipe);
      setCurrentPhase('recipe');
    } catch (error) {
      toast({
        title: "Recipe Generation Failed",
        description: "Failed to generate project recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRoadmap = async () => {
    if (!projectRecipe) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectInput,
          analysis: projectAnalysis,
          recipe: projectRecipe
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const roadmap = await response.json();
      setRoadmapData(roadmap);
      setCurrentPhase('roadmap');
    } catch (error) {
      toast({
        title: "Roadmap Generation Failed",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Debug current state
  console.log('Rendering phase:', currentPhase, 'hasAnalysis:', !!projectAnalysis);

  // Analysis Phase
  if (currentPhase === 'analysis' && projectAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('input')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Input
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Analysis
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI analysis of "{projectInput.name}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Project Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Classification</h2>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Type: {projectAnalysis.projectType}</span>
              <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                {Math.round(projectAnalysis.projectTypeConfidence * 100)}% confidence
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{projectAnalysis.projectTypeReasoning}</p>
          </div>

          {/* Detected Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detected Features</h2>
            </div>
            <div className="space-y-3">
              {projectAnalysis.detectedFeatures?.map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        feature.complexity === 'low' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        feature.complexity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {feature.complexity} complexity
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        ~{feature.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={generateRecipe}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Code2 className="w-5 h-5" />
                  Generate Technical Recipe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recipe Phase
  if (currentPhase === 'recipe' && projectRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('analysis')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Analysis
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Technical Recipe
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed specifications for "{projectRecipe.projectName}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">{projectRecipe.overview}</p>
          </div>

          {/* Technical Specs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technical Specifications</h2>
            <div className="space-y-4">
              {Object.entries(projectRecipe.technicalSpecs || {}).map(([key, value]) => (
                <div key={key} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">{key}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Generate Development Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Roadmap Phase
  if (currentPhase === 'roadmap' && roadmapData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('recipe')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Recipe
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI-Optimized Roadmap
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {roadmapData.totalSteps} steps • {roadmapData.estimatedHours} hours estimated
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(roadmapData, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${roadmapData.projectName}-roadmap.json`;
                  link.click();
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Roadmap
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {roadmapData.phases?.map((phase: any, phaseIndex: number) => (
              <div key={phaseIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{phase.phaseName}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{phase.description}</p>
                
                <div className="space-y-4">
                  {phase.steps?.map((step: any, stepIndex: number) => (
                    <div key={stepIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{step.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{step.estimatedTime}</span>
                            <span className="capitalize">{step.difficulty}</span>
                          </div>
                          
                          {step.aiPrompt && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Prompt</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{step.aiPrompt.task}</p>
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Expected: {step.aiPrompt.expectedOutput}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Input Phase (default)
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
                  CodeBreaker Roadmap Creator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate AI-optimized development roadmaps
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {['Project Input', 'Analysis', 'Recipe', 'Roadmap'].map((step, index) => {
                const stepPhases = ['input', 'analysis', 'recipe', 'roadmap'];
                const currentStepIndex = stepPhases.indexOf(currentPhase);
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive ? 'bg-purple-600 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-purple-600 dark:text-purple-400' : 
                      isCompleted ? 'text-green-600 dark:text-green-400' :
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step}
                    </span>
                    {index < 3 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Project Details</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Provide your project details to generate a customized AI-optimized roadmap
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={projectInput.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., TaskFlow Pro, ECommerce Platform, Portfolio Website"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Description *
              </label>
              <textarea
                value={projectInput.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your project in detail. What does it do? Who is it for? What problems does it solve?"
              />
            </div>

            {/* Project Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Goals *
              </label>
              <div className="space-y-2">
                {projectInput.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Create user authentication system"
                    />
                    {projectInput.goals.length > 1 && (
                      <button
                        onClick={() => removeGoal(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addGoal}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                >
                  + Add Goal
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline *
              </label>
              <select
                value={projectInput.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select timeline</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2-3 months">2-3 months</option>
                <option value="6+ months">6+ months</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={projectInput.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            disabled={!canProceed || isGenerating}
            onClick={generateAnalysis}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Analyzing Project...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analyze Project & Generate Roadmap
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will generate a comprehensive development roadmap with AI-optimized prompts
          </p>
        </div>
      </div>
    </div>
  );

  // Analysis Phase
  if (currentPhase === 'analysis' && projectAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('input')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Input
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Analysis
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI analysis of "{projectInput.name}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Project Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Classification</h2>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Type: {projectAnalysis.projectType}</span>
              <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                {Math.round(projectAnalysis.projectTypeConfidence * 100)}% confidence
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{projectAnalysis.projectTypeReasoning}</p>
          </div>

          {/* Detected Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detected Features</h2>
            </div>
            <div className="space-y-3">
              {projectAnalysis.detectedFeatures?.map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        feature.complexity === 'low' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        feature.complexity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {feature.complexity} complexity
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        ~{feature.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={generateRecipe}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Code2 className="w-5 h-5" />
                  Generate Technical Recipe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recipe Phase
  if (currentPhase === 'recipe' && projectRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('analysis')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Analysis
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Technical Recipe
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed specifications for "{projectRecipe.projectName}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">{projectRecipe.overview}</p>
          </div>

          {/* Technical Specs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technical Specifications</h2>
            <div className="space-y-4">
              {Object.entries(projectRecipe.technicalSpecs || {}).map(([key, value]) => (
                <div key={key} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">{key}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Generate Development Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Roadmap Phase
  if (currentPhase === 'roadmap' && roadmapData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPhase('recipe')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Recipe
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI-Optimized Roadmap
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {roadmapData.totalSteps} steps • {roadmapData.estimatedHours} hours estimated
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(roadmapData, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${roadmapData.projectName}-roadmap.json`;
                  link.click();
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Roadmap
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {roadmapData.phases?.map((phase: any, phaseIndex: number) => (
              <div key={phaseIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{phase.phaseName}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{phase.description}</p>
                
                <div className="space-y-4">
                  {phase.steps?.map((step: any, stepIndex: number) => (
                    <div key={stepIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{step.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{step.estimatedTime}</span>
                            <span className="capitalize">{step.difficulty}</span>
                          </div>
                          
                          {step.aiPrompt && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Prompt</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{step.aiPrompt.task}</p>
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Expected: {step.aiPrompt.expectedOutput}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}