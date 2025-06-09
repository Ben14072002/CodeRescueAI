import React, { useState } from 'react';
import { ArrowLeft, Target, Brain, Zap, Code2, Database, Globe, CheckCircle, Download, AlertTriangle } from 'lucide-react';
interface RoadmapCreatorStyledProps {
  onBack: () => void;
}

// Styled version of RoadmapCreatorV3 with CodeBreaker branding
export function RoadmapCreatorStyled({ onBack }: RoadmapCreatorStyledProps) {
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'recipe' | 'roadmap'>('input');
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
              {['Project Input', 'Analysis', 'Recipe', 'Roadmap'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index === 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
                  )}
                </div>
              ))}
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
            disabled={!canProceed}
            onClick={() => setCurrentPhase('analysis')}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Brain className="w-5 h-5" />
            Analyze Project & Generate Roadmap
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will generate a comprehensive development roadmap with AI-optimized prompts
          </p>
        </div>
      </div>
    </div>
  );
}