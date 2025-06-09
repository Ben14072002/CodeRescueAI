import React, { useState } from 'react';
import { X, ArrowLeft, Download, Clock, CheckCircle, AlertTriangle, Zap, Brain, Code2, Database, Globe } from 'lucide-react';

interface ProjectInput {
  name: string;
  description: string;
  goals: string[];
  constraints: string[];
  timeline: string;
  experience: string;
}

interface FeatureAnalysis {
  feature: string;
  confidence: number;
  reasoning: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedHours: number;
}

interface TechStackRecommendation {
  technology: string;
  category: 'frontend' | 'backend' | 'database' | 'hosting' | 'tools';
  reasoning: string;
  alternatives: string[];
  priority: 'required' | 'recommended' | 'optional';
}

interface ProjectAnalysis {
  projectType: string;
  projectTypeConfidence: number;
  projectTypeReasoning: string;
  
  detectedFeatures: FeatureAnalysis[];
  
  complexityRating: {
    overall: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    frontend: number;
    backend: number;
    database: number;
    reasoning: string;
  };
  
  techStackRecommendations: TechStackRecommendation[];
  
  timeline: {
    estimated: string;
    phases: string[];
    reasoning: string;
  };
  
  risks: {
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
}

interface RoadmapCreatorV3Props {
  onBack: () => void;
}

export function RoadmapCreatorV3({ onBack }: RoadmapCreatorV3Props) {
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'recipe' | 'roadmap'>('input');
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    name: '',
    description: '',
    goals: [''],
    constraints: [''],
    timeline: '',
    experience: 'beginner'
  });
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // PHASE 1: ENHANCED PROJECT ANALYSIS ENGINE
  const analyzeProject = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis - in real implementation, this would use AI
      const analysis = await generateIntelligentProjectAnalysis(projectInput);
      setProjectAnalysis(analysis);
      setCurrentPhase('analysis');
    } catch (error) {
      console.error('Project analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateIntelligentProjectAnalysis = async (input: ProjectInput): Promise<ProjectAnalysis> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // INTELLIGENT PROJECT TYPE DETECTION
    const projectTypeResult = detectProjectType(input.description);
    
    // FEATURE EXTRACTION FROM DESCRIPTION
    const detectedFeatures = extractFeatures(input.description);
    
    // COMPLEXITY ANALYSIS
    const complexityRating = analyzeComplexity(input, detectedFeatures);
    
    // TECH STACK RECOMMENDATIONS WITH REASONING
    const techStackRecommendations = generateTechStackRecommendations(projectTypeResult.type, detectedFeatures, input.experience);
    
    // TIMELINE ESTIMATION
    const timeline = estimateTimeline(detectedFeatures, complexityRating, input.experience);
    
    // RISK ANALYSIS
    const risks = identifyRisks(input, detectedFeatures, complexityRating);

    return {
      projectType: projectTypeResult.type,
      projectTypeConfidence: projectTypeResult.confidence,
      projectTypeReasoning: projectTypeResult.reasoning,
      detectedFeatures,
      complexityRating,
      techStackRecommendations,
      timeline,
      risks
    };
  };

  const detectProjectType = (description: string) => {
    const desc = description.toLowerCase();
    
    // E-commerce indicators
    if (desc.includes('shop') || desc.includes('store') || desc.includes('product') || 
        desc.includes('cart') || desc.includes('payment') || desc.includes('inventory')) {
      return {
        type: 'E-commerce Platform',
        confidence: 0.9,
        reasoning: `Based on keywords like "shop", "product", "cart", or "payment" in your description, this appears to be an e-commerce platform. This will require product management, shopping cart functionality, payment processing, and inventory tracking.`
      };
    }
    
    // Task management indicators
    if (desc.includes('task') || desc.includes('todo') || desc.includes('project management') || 
        desc.includes('kanban') || desc.includes('team') || desc.includes('collaboration')) {
      return {
        type: 'Task Management System',
        confidence: 0.85,
        reasoning: `Your description mentions task management, team collaboration, or project organization features. This suggests a productivity application that will need user management, task tracking, team features, and possibly real-time collaboration.`
      };
    }
    
    // Content management indicators
    if (desc.includes('blog') || desc.includes('cms') || desc.includes('content') || 
        desc.includes('article') || desc.includes('post') || desc.includes('publish')) {
      return {
        type: 'Content Management System',
        confidence: 0.8,
        reasoning: `Based on content-related keywords, this appears to be a content management system or blogging platform. This will require content creation tools, publishing workflows, and possibly multi-user content management.`
      };
    }
    
    // Dashboard/Analytics indicators
    if (desc.includes('dashboard') || desc.includes('analytics') || desc.includes('chart') || 
        desc.includes('report') || desc.includes('metrics') || desc.includes('data visualization')) {
      return {
        type: 'Analytics Dashboard',
        confidence: 0.85,
        reasoning: `Your project description suggests a data-driven application with dashboards and analytics. This will require data visualization components, real-time updates, and potentially complex data processing.`
      };
    }
    
    // Social/Community indicators
    if (desc.includes('social') || desc.includes('community') || desc.includes('chat') || 
        desc.includes('message') || desc.includes('forum') || desc.includes('user profile')) {
      return {
        type: 'Social Platform',
        confidence: 0.8,
        reasoning: `Based on social features mentioned in your description, this appears to be a community or social platform. This will require user profiles, messaging systems, and real-time communication features.`
      };
    }
    
    // Learning/Education indicators
    if (desc.includes('learn') || desc.includes('course') || desc.includes('education') || 
        desc.includes('tutorial') || desc.includes('quiz') || desc.includes('student')) {
      return {
        type: 'Learning Management System',
        confidence: 0.8,
        reasoning: `Your description indicates an educational platform or learning management system. This will require course management, progress tracking, and possibly assessment tools.`
      };
    }
    
    // Default classification
    return {
      type: 'Custom Web Application',
      confidence: 0.6,
      reasoning: `Based on your description, this appears to be a custom web application. I'll analyze the specific features you mentioned to provide tailored recommendations.`
    };
  };

  const extractFeatures = (description: string): FeatureAnalysis[] => {
    const features: FeatureAnalysis[] = [];
    const desc = description.toLowerCase();

    // Authentication features
    if (desc.includes('login') || desc.includes('signup') || desc.includes('user') || desc.includes('account')) {
      features.push({
        feature: 'User Authentication',
        confidence: 0.9,
        reasoning: 'Mentions of users, login, or accounts indicate need for authentication system',
        complexity: 'medium',
        estimatedHours: 8
      });
    }

    // Real-time features
    if (desc.includes('real-time') || desc.includes('live') || desc.includes('instant') || 
        desc.includes('notification') || desc.includes('chat') || desc.includes('websocket')) {
      features.push({
        feature: 'Real-time Updates',
        confidence: 0.85,
        reasoning: 'Real-time functionality requires WebSocket connections and live data synchronization',
        complexity: 'high',
        estimatedHours: 12
      });
    }

    // Payment processing
    if (desc.includes('payment') || desc.includes('stripe') || desc.includes('checkout') || 
        desc.includes('purchase') || desc.includes('subscription')) {
      features.push({
        feature: 'Payment Processing',
        confidence: 0.9,
        reasoning: 'Payment functionality requires secure integration with payment providers like Stripe',
        complexity: 'high',
        estimatedHours: 16
      });
    }

    // File upload
    if (desc.includes('upload') || desc.includes('image') || desc.includes('file') || desc.includes('photo')) {
      features.push({
        feature: 'File Upload',
        confidence: 0.8,
        reasoning: 'File upload functionality requires storage solution and file management',
        complexity: 'medium',
        estimatedHours: 6
      });
    }

    // API integration
    if (desc.includes('api') || desc.includes('integration') || desc.includes('third-party') || desc.includes('external')) {
      features.push({
        feature: 'API Integration',
        confidence: 0.75,
        reasoning: 'External API integration requires data synchronization and error handling',
        complexity: 'medium',
        estimatedHours: 10
      });
    }

    // Search functionality
    if (desc.includes('search') || desc.includes('filter') || desc.includes('find')) {
      features.push({
        feature: 'Search & Filtering',
        confidence: 0.8,
        reasoning: 'Search functionality requires indexing and query optimization',
        complexity: 'medium',
        estimatedHours: 8
      });
    }

    // Admin panel
    if (desc.includes('admin') || desc.includes('manage') || desc.includes('control panel')) {
      features.push({
        feature: 'Admin Panel',
        confidence: 0.85,
        reasoning: 'Administrative features require role-based access and management interfaces',
        complexity: 'medium',
        estimatedHours: 12
      });
    }

    // Mobile responsiveness
    if (desc.includes('mobile') || desc.includes('responsive') || desc.includes('phone') || desc.includes('tablet')) {
      features.push({
        feature: 'Mobile Responsive Design',
        confidence: 0.9,
        reasoning: 'Mobile support requires responsive design and touch-friendly interfaces',
        complexity: 'low',
        estimatedHours: 6
      });
    }

    return features;
  };

  const analyzeComplexity = (input: ProjectInput, features: FeatureAnalysis[]) => {
    const totalFeatures = features.length;
    const highComplexityFeatures = features.filter(f => f.complexity === 'high').length;
    const mediumComplexityFeatures = features.filter(f => f.complexity === 'medium').length;
    
    let overall: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
    let reasoning = '';

    if (totalFeatures <= 3 && highComplexityFeatures === 0) {
      overall = 'beginner';
      reasoning = 'Simple project with basic features suitable for beginners';
    } else if (totalFeatures <= 6 && highComplexityFeatures <= 1) {
      overall = 'intermediate';
      reasoning = 'Moderate complexity with several features requiring intermediate skills';
    } else if (totalFeatures <= 10 && highComplexityFeatures <= 3) {
      overall = 'advanced';
      reasoning = 'Complex project with multiple advanced features requiring significant experience';
    } else {
      overall = 'expert';
      reasoning = 'Highly complex project requiring expert-level development skills';
    }

    return {
      overall,
      frontend: Math.min(10, totalFeatures * 1.2 + highComplexityFeatures * 2),
      backend: Math.min(10, totalFeatures * 1.5 + highComplexityFeatures * 2.5),
      database: Math.min(10, features.filter(f => 
        f.feature.includes('User') || f.feature.includes('Payment') || f.feature.includes('Search')
      ).length * 2),
      reasoning
    };
  };

  const generateTechStackRecommendations = (
    projectType: string, 
    features: FeatureAnalysis[], 
    experience: string
  ): TechStackRecommendation[] => {
    const recommendations: TechStackRecommendation[] = [];

    // Frontend recommendations
    if (experience === 'beginner') {
      recommendations.push({
        technology: 'React with Vite',
        category: 'frontend',
        reasoning: 'React is beginner-friendly with excellent documentation and community support. Vite provides fast development experience.',
        alternatives: ['Vue.js', 'Plain HTML/CSS/JS'],
        priority: 'required'
      });
    } else {
      recommendations.push({
        technology: 'Next.js',
        category: 'frontend',
        reasoning: 'Next.js provides full-stack capabilities, built-in optimization, and excellent developer experience for complex applications.',
        alternatives: ['React + Express', 'SvelteKit'],
        priority: 'required'
      });
    }

    // Backend recommendations
    const hasRealTime = features.some(f => f.feature.includes('Real-time'));
    const hasPayments = features.some(f => f.feature.includes('Payment'));
    
    if (hasRealTime || hasPayments) {
      recommendations.push({
        technology: 'Node.js with Express',
        category: 'backend',
        reasoning: 'Node.js excels at real-time applications and has excellent payment processing libraries',
        alternatives: ['Python with FastAPI', 'Go with Gin'],
        priority: 'required'
      });
    } else {
      recommendations.push({
        technology: 'Node.js with Express',
        category: 'backend',
        reasoning: 'Lightweight and efficient for standard web applications with good JavaScript ecosystem',
        alternatives: ['Python with Flask', 'Ruby on Rails'],
        priority: 'recommended'
      });
    }

    // Database recommendations
    const hasComplexData = features.some(f => 
      f.feature.includes('User') || f.feature.includes('Payment') || f.feature.includes('Search')
    );
    
    if (hasComplexData) {
      recommendations.push({
        technology: 'PostgreSQL',
        category: 'database',
        reasoning: 'PostgreSQL provides ACID compliance, complex queries, and excellent reliability for user data and transactions',
        alternatives: ['MongoDB', 'MySQL'],
        priority: 'required'
      });
    } else {
      recommendations.push({
        technology: 'SQLite or MongoDB',
        category: 'database',
        reasoning: 'Simple database solution suitable for straightforward data storage needs',
        alternatives: ['PostgreSQL', 'Firebase'],
        priority: 'recommended'
      });
    }

    // Additional tools based on features
    if (hasPayments) {
      recommendations.push({
        technology: 'Stripe',
        category: 'tools',
        reasoning: 'Industry-standard payment processing with excellent documentation and security',
        alternatives: ['PayPal', 'Square'],
        priority: 'required'
      });
    }

    if (hasRealTime) {
      recommendations.push({
        technology: 'Socket.io or WebSockets',
        category: 'tools',
        reasoning: 'Essential for real-time communication and live updates',
        alternatives: ['Server-Sent Events', 'WebRTC'],
        priority: 'required'
      });
    }

    return recommendations;
  };

  const estimateTimeline = (features: FeatureAnalysis[], complexity: any, experience: string) => {
    const totalHours = features.reduce((sum, feature) => sum + feature.estimatedHours, 0);
    const experienceMultiplier = experience === 'beginner' ? 2 : experience === 'intermediate' ? 1.5 : 1;
    const adjustedHours = totalHours * experienceMultiplier;
    
    const days = Math.ceil(adjustedHours / 6); // 6 hours per day
    const weeks = Math.ceil(days / 5); // 5 working days per week

    return {
      estimated: `${weeks} weeks (${days} working days)`,
      phases: [
        'Phase 1: Project Setup & Basic Structure (1-2 days)',
        'Phase 2: Core Features Development (60% of time)',
        'Phase 3: Integration & Testing (20% of time)', 
        'Phase 4: Polish & Deployment (20% of time)'
      ],
      reasoning: `Based on ${features.length} features requiring ${totalHours} base hours, adjusted for ${experience} experience level`
    };
  };

  const identifyRisks = (input: ProjectInput, features: FeatureAnalysis[], complexity: any) => {
    const risks = [];

    // Complexity risks
    if (complexity.overall === 'expert') {
      risks.push({
        risk: 'Project Scope Too Large',
        severity: 'high' as const,
        mitigation: 'Consider breaking into smaller phases or reducing initial feature set'
      });
    }

    // Technical risks
    const highComplexityFeatures = features.filter(f => f.complexity === 'high');
    if (highComplexityFeatures.length > 2) {
      risks.push({
        risk: 'Multiple Complex Features',
        severity: 'medium' as const,
        mitigation: 'Implement complex features one at a time and thoroughly test each'
      });
    }

    // Experience risks
    if (input.experience === 'beginner' && complexity.overall !== 'beginner') {
      risks.push({
        risk: 'Skill Gap',
        severity: 'medium' as const,
        mitigation: 'Start with simpler version and gradually add features as skills develop'
      });
    }

    // Timeline risks
    if (input.timeline && features.length > 5) {
      risks.push({
        risk: 'Ambitious Timeline',
        severity: 'medium' as const,
        mitigation: 'Focus on MVP first, then iterate with additional features'
      });
    }

    return risks;
  };

  const handleInputChange = (field: keyof ProjectInput, value: string | string[]) => {
    setProjectInput(prev => ({ ...prev, [field]: value }));
  };

  const addGoal = () => {
    setProjectInput(prev => ({ ...prev, goals: [...prev.goals, ''] }));
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
    setProjectInput(prev => ({ ...prev, constraints: [...prev.constraints, ''] }));
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

  if (currentPhase === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Analysis & Roadmap Creator</h1>
                <p className="text-gray-600">Tell us about your project and get a detailed development roadmap</p>
              </div>
            </div>
          </div>

          {/* Project Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectInput.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your project name..."
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={projectInput.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your project in detail. What does it do? Who is it for? What features do you want? Be as specific as possible..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  The more detailed your description, the better our analysis will be.
                </p>
              </div>

              {/* Project Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Goals
                </label>
                {projectInput.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="What do you want to achieve with this project?"
                    />
                    {projectInput.goals.length > 1 && (
                      <button
                        onClick={() => removeGoal(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addGoal}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Goal
                </button>
              </div>

              {/* Constraints */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Constraints & Requirements
                </label>
                {projectInput.constraints.map((constraint, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={constraint}
                      onChange={(e) => updateConstraint(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Any specific technologies, budget, or timeline constraints?"
                    />
                    {projectInput.constraints.length > 1 && (
                      <button
                        onClick={() => removeConstraint(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addConstraint}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Constraint
                </button>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Timeline
                </label>
                <input
                  type="text"
                  value={projectInput.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="When do you want to complete this project? (e.g., 2 weeks, 1 month, 3 months)"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Development Experience
                </label>
                <select
                  value={projectInput.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner (New to web development)</option>
                  <option value="intermediate">Intermediate (Some experience with web technologies)</option>
                  <option value="advanced">Advanced (Experienced developer)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={analyzeProject}
                disabled={!projectInput.name || !projectInput.description || isAnalyzing}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing Project...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 'analysis' && projectAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPhase('input')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Input
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Analysis Results</h1>
                <p className="text-gray-600">Detailed analysis of "{projectInput.name}"</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Type & Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Type Detection */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Project Type Analysis</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Detected Type: {projectAnalysis.projectType}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {Math.round(projectAnalysis.projectTypeConfidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{projectAnalysis.projectTypeReasoning}</p>
                  </div>
                </div>
              </div>

              {/* Detected Features */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Detected Features</h2>
                </div>
                
                <div className="space-y-3">
                  {projectAnalysis.detectedFeatures.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{feature.feature}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            feature.complexity === 'low' ? 'bg-green-100 text-green-800' :
                            feature.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {feature.complexity} complexity
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            ~{feature.estimatedHours}h
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{feature.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Recommendations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Code2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Recommended Tech Stack</h2>
                </div>
                
                <div className="space-y-4">
                  {projectAnalysis.techStackRecommendations.map((tech, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tech.technology}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tech.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tech.priority === 'required' ? 'bg-red-100 text-red-800' :
                            tech.priority === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {tech.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tech.reasoning}</p>
                      {tech.alternatives.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Alternatives: {tech.alternatives.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Complexity Rating */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Complexity Analysis</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Overall</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        projectAnalysis.complexityRating.overall === 'beginner' ? 'bg-green-100 text-green-800' :
                        projectAnalysis.complexityRating.overall === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        projectAnalysis.complexityRating.overall === 'advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {projectAnalysis.complexityRating.overall}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Frontend</span>
                      <span className="text-sm">{projectAnalysis.complexityRating.frontend}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${projectAnalysis.complexityRating.frontend * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Backend</span>
                      <span className="text-sm">{projectAnalysis.complexityRating.backend}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${projectAnalysis.complexityRating.backend * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Database</span>
                      <span className="text-sm">{projectAnalysis.complexityRating.database}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${projectAnalysis.complexityRating.database * 10}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3">
                    {projectAnalysis.complexityRating.reasoning}
                  </p>
                </div>
              </div>

              {/* Timeline Estimate */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Timeline Estimate</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {projectAnalysis.timeline.estimated}
                  </div>
                  
                  <div className="space-y-2">
                    {projectAnalysis.timeline.phases.map((phase, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {phase}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    {projectAnalysis.timeline.reasoning}
                  </p>
                </div>
              </div>

              {/* Identified Risks */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Project Risks</h3>
                </div>
                
                <div className="space-y-3">
                  {projectAnalysis.risks.map((risk, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{risk.risk}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          risk.severity === 'low' ? 'bg-green-100 text-green-800' :
                          risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPhase('recipe')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate Detailed Recipe
              </button>
              <button
                onClick={() => setCurrentPhase('roadmap')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Create Development Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for recipe and roadmap phases
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto text-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Phase {currentPhase === 'recipe' ? '2' : '3'} Coming Soon</h2>
        <p className="text-gray-600 mb-8">
          {currentPhase === 'recipe' 
            ? 'Detailed recipe generation will be implemented in Phase 2' 
            : 'Granular roadmap creation will be implemented in Phase 3'
          }
        </p>
        <button
          onClick={() => setCurrentPhase('analysis')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Back to Analysis
        </button>
      </div>
    </div>
  );
}