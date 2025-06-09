import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle, Clock, Code2, Lightbulb, Target, AlertTriangle, Copy, ExternalLink, ChevronDown, ArrowRight, MapPin, Users, Zap, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep, RoadmapRecommendations } from '@shared/schema';

interface RoadmapCreatorProps {
  onBack: () => void;
  onOpenRescue?: (context: string) => void;
}

type Phase = 'input' | 'recommendations' | 'customization' | 'roadmap';

interface ProjectInput {
  // Basic Info
  name: string;
  description: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  
  // Project Scope
  targetAudience: 'B2B' | 'B2C' | 'Internal tool' | 'Personal project';
  platform: 'Web app' | 'Mobile responsive' | 'Native mobile' | 'Desktop app';
  expectedUsers: '1-100' | '100-1000' | '1000+' | 'Enterprise scale';
  projectTimeline: 'Weekend project' | '1-2 weeks' | '1-2 months' | 'Long-term';
  
  // Technical Requirements
  authenticationNeeds: 'None' | 'Simple login' | 'OAuth' | 'Enterprise SSO' | 'Custom auth';
  dataComplexity: 'Static content' | 'Simple forms' | 'Database driven' | 'Real-time data' | 'Complex analytics';
  integrations: string[];
  performanceNeeds: 'Basic' | 'Medium traffic' | 'High performance' | 'Enterprise scale';
  
  // Design Requirements
  designComplexity: 'Minimal/functional' | 'Standard UI' | 'Custom branded' | 'Complex animations';
  responsiveness: 'Desktop only' | 'Mobile friendly' | 'Mobile first';
  accessibility: 'Basic' | 'WCAG compliant' | 'Enterprise accessibility';
  
  // Deployment Preferences
  hostingType: 'Shared hosting' | 'Cloud platform' | 'Self-hosted' | 'Don\'t know';
  budget: 'Free/minimal' | 'Low budget' | 'Medium budget' | 'Enterprise budget';
  maintenance: 'Set and forget' | 'Occasional updates' | 'Active maintenance';
}

interface Recommendations {
  recommendedTechStack: string[];
  suggestedComplexity: 'simple' | 'medium' | 'complex';
  estimatedTimeline: string;
  coreFeatures: string[];
  optionalFeatures: string[];
  potentialChallenges: string[];
  reasoning: {
    techStackReason: string;
    complexityReason: string;
    timelineReason: string;
  };
}

export function RoadmapCreator({ onBack, onOpenRescue }: RoadmapCreatorProps) {
  const [phase, setPhase] = useState<Phase>('input');
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    // Basic Info
    name: '',
    description: '',
    experienceLevel: 'intermediate',
    
    // Project Scope
    targetAudience: 'B2C',
    platform: 'Web app',
    expectedUsers: '100-1000',
    projectTimeline: '1-2 months',
    
    // Technical Requirements
    authenticationNeeds: 'Simple login',
    dataComplexity: 'Database driven',
    integrations: [],
    performanceNeeds: 'Medium traffic',
    
    // Design Requirements
    designComplexity: 'Standard UI',
    responsiveness: 'Mobile friendly',
    accessibility: 'Basic',
    
    // Deployment Preferences
    hostingType: 'Cloud platform',
    budget: 'Medium budget',
    maintenance: 'Occasional updates'
  });

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [customizedProject, setCustomizedProject] = useState<any>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Enhanced custom analysis engine
  const generateCustomAnalysis = (input: ProjectInput): Recommendations => {
    // Tech stack reasoning based on specific requirements
    let techStack = [];
    let reasoning = {
      techStackReason: '',
      complexityReason: '',
      timelineReason: ''
    };

    // Frontend selection based on platform and complexity
    if (input.platform.includes('Native mobile')) {
      techStack.push('React Native');
      reasoning.techStackReason += `React Native chosen because you specified ${input.platform}. `;
    } else if (input.platform === 'Desktop app') {
      techStack.push('Electron', 'React');
      reasoning.techStackReason += `Electron + React chosen because you need ${input.platform} with ${input.designComplexity}. `;
    } else {
      techStack.push('React', 'Vite');
      reasoning.techStackReason += `React chosen because you mentioned ${input.responsiveness} with ${input.designComplexity}. `;
    }

    // Backend selection based on data complexity and auth needs
    if (input.dataComplexity === 'Real-time data') {
      techStack.push('Node.js', 'Socket.io', 'Redis');
      reasoning.techStackReason += `Node.js + Socket.io for real-time features you specified. `;
    } else if (input.dataComplexity === 'Complex analytics') {
      techStack.push('Node.js', 'PostgreSQL', 'ClickHouse');
      reasoning.techStackReason += `PostgreSQL + ClickHouse because you need ${input.dataComplexity}. `;
    } else if (input.dataComplexity !== 'Static content') {
      techStack.push('Node.js', 'PostgreSQL');
      reasoning.techStackReason += `Node.js + PostgreSQL for ${input.dataComplexity} you described. `;
    }

    // Authentication stack based on needs
    if (input.authenticationNeeds === 'OAuth') {
      techStack.push('Firebase Auth');
      reasoning.techStackReason += `Firebase Auth for ${input.authenticationNeeds} integration. `;
    } else if (input.authenticationNeeds === 'Enterprise SSO') {
      techStack.push('Auth0', 'SAML');
      reasoning.techStackReason += `Auth0 + SAML for ${input.authenticationNeeds} requirements. `;
    } else if (input.authenticationNeeds !== 'None') {
      techStack.push('Passport.js');
      reasoning.techStackReason += `Passport.js for ${input.authenticationNeeds} system. `;
    }

    // Styling based on design complexity
    if (input.designComplexity === 'Complex animations') {
      techStack.push('Framer Motion', 'Tailwind CSS');
    } else if (input.designComplexity === 'Custom branded') {
      techStack.push('Styled Components', 'Tailwind CSS');
    } else {
      techStack.push('Tailwind CSS');
    }

    // Performance and deployment considerations
    if (input.performanceNeeds === 'High performance' || input.expectedUsers === 'Enterprise scale') {
      techStack.push('Redis', 'CDN', 'Docker');
      reasoning.techStackReason += `Performance stack for ${input.expectedUsers} and ${input.performanceNeeds}. `;
    }

    // Cloud services based on hosting and integrations
    if (input.hostingType === 'Cloud platform') {
      if (input.integrations.includes('Payment processing')) {
        techStack.push('Stripe');
      }
      if (input.integrations.includes('Email services')) {
        techStack.push('SendGrid');
      }
      if (input.integrations.includes('File storage')) {
        techStack.push('AWS S3');
      }
    }

    // Determine complexity based on requirements
    let complexity: 'simple' | 'medium' | 'complex' = 'medium';
    let complexityFactors = [];

    if (input.dataComplexity === 'Real-time data' || input.dataComplexity === 'Complex analytics') {
      complexity = 'complex';
      complexityFactors.push('real-time data processing');
    }
    if (input.integrations.length > 3) {
      complexity = 'complex';
      complexityFactors.push('multiple integrations');
    }
    if (input.authenticationNeeds === 'Enterprise SSO') {
      complexity = 'complex';
      complexityFactors.push('enterprise authentication');
    }
    if (input.performanceNeeds === 'Enterprise scale') {
      complexity = 'complex';
      complexityFactors.push('enterprise scalability');
    }
    if (input.designComplexity === 'Complex animations') {
      if (complexity !== 'complex') complexity = 'complex';
      complexityFactors.push('complex UI animations');
    }

    reasoning.complexityReason = `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} complexity because you mentioned ${complexityFactors.length > 0 ? complexityFactors.join(', ') : 'standard requirements with ' + input.targetAudience + ' focus'}.`;

    // Calculate timeline based on complexity and experience
    let baseWeeks = complexity === 'simple' ? 2 : complexity === 'medium' ? 6 : 12;
    if (input.experienceLevel === 'beginner') baseWeeks *= 1.5;
    if (input.experienceLevel === 'advanced') baseWeeks *= 0.7;
    
    if (input.projectTimeline === 'Weekend project') baseWeeks = Math.min(baseWeeks, 0.5);
    else if (input.projectTimeline === '1-2 weeks') baseWeeks = Math.min(baseWeeks, 2);
    else if (input.projectTimeline === '1-2 months') baseWeeks = Math.min(baseWeeks, 8);

    const timelineText = baseWeeks < 1 ? 'Weekend project' : baseWeeks <= 2 ? '1-2 weeks' : baseWeeks <= 8 ? `${Math.ceil(baseWeeks)} weeks` : `${Math.ceil(baseWeeks/4)} months`;
    reasoning.timelineReason = `${timelineText} estimated because you're ${input.experienceLevel} level working on ${complexity} project with ${input.projectTimeline} timeline preference.`;

    // Generate features based on requirements
    const coreFeatures: string[] = [];
    const optionalFeatures: string[] = [];
    const challenges: string[] = [];

    if (input.authenticationNeeds !== 'None') {
      coreFeatures.push(`${input.authenticationNeeds} authentication system`);
    }
    
    if (input.dataComplexity !== 'Static content') {
      coreFeatures.push(`${input.dataComplexity} management`);
    }

    if (input.integrations.includes('Payment processing')) {
      coreFeatures.push('Payment processing integration');
    }

    if (input.platform === 'Mobile responsive' || input.responsiveness === 'Mobile first') {
      coreFeatures.push('Mobile-responsive design');
    }

    // Add optional features based on integrations
    input.integrations.forEach(integration => {
      if (!coreFeatures.some(f => f.includes(integration))) {
        optionalFeatures.push(`${integration} integration`);
      }
    });

    // Identify challenges based on requirements
    if (input.dataComplexity === 'Real-time data') {
      challenges.push('Real-time data synchronization and WebSocket management');
    }
    if (input.performanceNeeds === 'High performance' || input.expectedUsers === 'Enterprise scale') {
      challenges.push('Performance optimization and scalability architecture');
    }
    if (input.authenticationNeeds === 'Enterprise SSO') {
      challenges.push('Enterprise SSO integration and security compliance');
    }
    if (input.platform === 'Native mobile') {
      challenges.push('Cross-platform mobile development and app store deployment');
    }

    return {
      recommendedTechStack: Array.from(new Set(techStack)), // Remove duplicates
      suggestedComplexity: complexity,
      estimatedTimeline: timelineText,
      coreFeatures,
      optionalFeatures,
      potentialChallenges: challenges,
      reasoning
    };
  };

  const analyzeProject = async () => {
    if (!projectInput.name.trim() || !projectInput.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both project name and description.",
        variant: "destructive",
      });
      return;
    }

    if (projectInput.description.length < 300) {
      toast({
        title: "Description Too Short",
        description: "Please provide a more detailed description (at least 300 characters) for better recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Generate custom analysis based on user input
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const customRecommendations = generateCustomAnalysis(projectInput);
      setRecommendations(customRecommendations);
      setPhase('recommendations');
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRoadmap = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate roadmap generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSteps: RoadmapStep[] = [
        {
          stepNumber: 1,
          title: 'Project Setup & Environment',
          description: 'Initialize project structure, install dependencies, and configure development environment',
          estimatedTime: '45 minutes',
          startPrompt: 'CONTEXT: You are setting up a new React + Node.js project from scratch.\n\nCREATE PROJECT STRUCTURE:\n1. Frontend: Create React app with TypeScript\n2. Backend: Initialize Node.js with Express\n3. Database: Set up MongoDB connection\n4. Environment: Configure development scripts\n\nFILE STRUCTURE:\n```\nproject/\n├── client/ (React app)\n├── server/ (Node.js API)\n├── shared/ (Common types)\n└── package.json (root scripts)\n```\n\nIMPLEMENTATION ORDER:\n1. Create root package.json with workspace configuration\n2. Set up client with Create React App + TypeScript\n3. Initialize server with Express + TypeScript\n4. Configure MongoDB connection\n5. Add development scripts for concurrent running\n\nStart with the root package.json and work through each step sequentially.',
          rescuePrompts: [
            'I\'m having trouble with the project structure setup',
            'Dependencies are not installing correctly',
            'MongoDB connection is not working'
          ],
          validationChecklist: [
            'Both client and server start without errors',
            'MongoDB connects successfully',
            'TypeScript compiles without errors',
            'Hot reload works for both frontend and backend'
          ],
          isCompleted: false,
          dependencies: []
        },
        {
          stepNumber: 2,
          title: 'Authentication System',
          description: 'Build complete user authentication with registration, login, and JWT tokens',
          estimatedTime: '2 hours',
          startPrompt: 'CONTEXT: Build a production-ready authentication system for a React + Node.js application.\n\nREQUIREMENTS:\n- User registration with email validation\n- Secure login with JWT tokens\n- Password hashing with bcrypt\n- Protected routes on both frontend and backend\n- Token refresh mechanism\n\nBACKEND IMPLEMENTATION:\n1. User model with proper validation\n2. Registration endpoint with duplicate email checking\n3. Login endpoint with credential verification\n4. JWT middleware for protected routes\n5. Password reset functionality\n\nFRONTEND IMPLEMENTATION:\n1. Registration form with validation\n2. Login form with error handling\n3. Protected route wrapper component\n4. Authentication context for state management\n5. Token storage and automatic refresh\n\nSTART with the backend user model and registration endpoint. Test each component before proceeding.',
          rescuePrompts: [
            'JWT token validation is not working',
            'Password hashing implementation is failing',
            'Frontend auth context is not updating properly'
          ],
          validationChecklist: [
            'User can register with valid email and password',
            'Login returns valid JWT token',
            'Protected routes reject unauthorized requests',
            'Frontend shows correct authentication state'
          ],
          isCompleted: false,
          dependencies: [1]
        },
        {
          stepNumber: 3,
          title: 'Database Models & API',
          description: 'Create data models and RESTful API endpoints for core functionality',
          estimatedTime: '1.5 hours',
          startPrompt: 'CONTEXT: Design and implement the core database models and API endpoints.\n\nDATABASE MODELS:\n1. User model (already created in auth step)\n2. Main entity models based on your project requirements\n3. Relationship definitions between models\n4. Validation schemas for all models\n\nAPI ENDPOINTS:\n1. CRUD operations for each main entity\n2. Proper HTTP status codes and error handling\n3. Request validation middleware\n4. Authentication middleware for protected routes\n5. Pagination for list endpoints\n\nIMPLEMENTATION PATTERN:\n```\nGET /api/entities - List all (with pagination)\nPOST /api/entities - Create new\nGET /api/entities/:id - Get specific\nPUT /api/entities/:id - Update specific\nDELETE /api/entities/:id - Delete specific\n```\n\nStart with defining your main data models, then implement one complete CRUD set before moving to the next.',
          rescuePrompts: [
            'Database schema design is not optimal',
            'API endpoints are returning errors',
            'Validation middleware is not working'
          ],
          validationChecklist: [
            'All models are properly defined with validation',
            'CRUD operations work for all entities',
            'API returns proper error messages',
            'Authentication is enforced on protected endpoints'
          ],
          isCompleted: false,
          dependencies: [2]
        }
      ];
      
      setRoadmapSteps(mockSteps);
      setPhase('roadmap');
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    });
  };

  const markStepComplete = (stepNumber: number) => {
    setRoadmapSteps(prev => 
      prev.map(step => 
        step.stepNumber === stepNumber 
          ? { ...step, isCompleted: true }
          : step
      )
    );
    
    if (stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  if (phase === 'input') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Enhanced Roadmap Creator</h1>
            <p className="text-muted-foreground">Generate a custom development roadmap with AI prompts tailored to your specific requirements</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Pro Feature
          </Badge>
        </div>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Enhanced Project Analysis
            </CardTitle>
            <CardDescription>
              Provide detailed information about your project for personalized recommendations and custom AI prompts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Task Management Dashboard"
                    value={projectInput.name}
                    onChange={(e) => setProjectInput(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Your Experience Level</Label>
                  <Select value={projectInput.experienceLevel} onValueChange={(value) => setProjectInput(prev => ({ ...prev, experienceLevel: value as any }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (New to coding)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                      <SelectItem value="advanced">Advanced (Experienced developer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="projectDescription">Project Description <span className="text-orange-500">(Min 300 characters for best results)</span></Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project in detail. What will it do? Who is it for? What problems does it solve? What features do you envision? Include specific requirements, target users, and any technical preferences."
                  rows={4}
                  value={projectInput.description}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {projectInput.description.length}/300 characters
                </p>
              </div>
            </div>

            {/* Project Scope */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                Project Scope
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Target Audience</Label>
                  <Select value={projectInput.targetAudience} onValueChange={(value) => setProjectInput(prev => ({ ...prev, targetAudience: value as any }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B">B2B (Business customers)</SelectItem>
                      <SelectItem value="B2C">B2C (General consumers)</SelectItem>
                      <SelectItem value="Internal tool">Internal tool</SelectItem>
                      <SelectItem value="Personal project">Personal project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Platform</Label>
                  <Select value={projectInput.platform} onValueChange={(value) => setProjectInput(prev => ({ ...prev, platform: value as any }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web app">Web app</SelectItem>
                      <SelectItem value="Mobile responsive">Mobile responsive</SelectItem>
                      <SelectItem value="Native mobile">Native mobile</SelectItem>
                      <SelectItem value="Desktop app">Desktop app</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Expected Users</Label>
                  <Select value={projectInput.expectedUsers} onValueChange={(value) => setProjectInput(prev => ({ ...prev, expectedUsers: value as any }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-100">1-100 users</SelectItem>
                      <SelectItem value="100-1000">100-1000 users</SelectItem>
                      <SelectItem value="1000+">1000+ users</SelectItem>
                      <SelectItem value="Enterprise scale">Enterprise scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Timeline</Label>
                  <Select value={projectInput.projectTimeline} onValueChange={(value) => setProjectInput(prev => ({ ...prev, projectTimeline: value as any }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekend project">Weekend project</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-2 months">1-2 months</SelectItem>
                      <SelectItem value="Long-term">Long-term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="font-medium">Advanced Configuration Options</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Technical Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Technical Requirements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Authentication</Label>
                      <Select value={projectInput.authenticationNeeds} onValueChange={(value) => setProjectInput(prev => ({ ...prev, authenticationNeeds: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">No authentication</SelectItem>
                          <SelectItem value="Simple login">Simple login</SelectItem>
                          <SelectItem value="OAuth">OAuth (Google, GitHub)</SelectItem>
                          <SelectItem value="Enterprise SSO">Enterprise SSO</SelectItem>
                          <SelectItem value="Custom auth">Custom authentication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data Complexity</Label>
                      <Select value={projectInput.dataComplexity} onValueChange={(value) => setProjectInput(prev => ({ ...prev, dataComplexity: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Static content">Static content</SelectItem>
                          <SelectItem value="Simple forms">Simple forms</SelectItem>
                          <SelectItem value="Database driven">Database driven</SelectItem>
                          <SelectItem value="Real-time data">Real-time data</SelectItem>
                          <SelectItem value="Complex analytics">Complex analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Performance</Label>
                      <Select value={projectInput.performanceNeeds} onValueChange={(value) => setProjectInput(prev => ({ ...prev, performanceNeeds: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic performance</SelectItem>
                          <SelectItem value="Medium traffic">Medium traffic</SelectItem>
                          <SelectItem value="High performance">High performance</SelectItem>
                          <SelectItem value="Enterprise scale">Enterprise scale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Required Integrations</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Payment processing', 'Email services', 'Social media', 'Analytics', 'Third-party APIs', 'File storage', 'Push notifications', 'SMS/messaging'].map((integration) => (
                        <div key={integration} className="flex items-center space-x-2">
                          <Checkbox
                            id={integration}
                            checked={projectInput.integrations.includes(integration)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProjectInput(prev => ({ ...prev, integrations: [...prev.integrations, integration] }));
                              } else {
                                setProjectInput(prev => ({ ...prev, integrations: prev.integrations.filter(i => i !== integration) }));
                              }
                            }}
                          />
                          <Label htmlFor={integration} className="text-xs">{integration}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Design & UX */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Design & User Experience
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Design Complexity</Label>
                      <Select value={projectInput.designComplexity} onValueChange={(value) => setProjectInput(prev => ({ ...prev, designComplexity: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Minimal/functional">Minimal/functional</SelectItem>
                          <SelectItem value="Standard UI">Standard UI</SelectItem>
                          <SelectItem value="Custom branded">Custom branded</SelectItem>
                          <SelectItem value="Complex animations">Complex animations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Responsiveness</Label>
                      <Select value={projectInput.responsiveness} onValueChange={(value) => setProjectInput(prev => ({ ...prev, responsiveness: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Desktop only">Desktop only</SelectItem>
                          <SelectItem value="Mobile friendly">Mobile friendly</SelectItem>
                          <SelectItem value="Mobile first">Mobile first</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Accessibility</Label>
                      <Select value={projectInput.accessibility} onValueChange={(value) => setProjectInput(prev => ({ ...prev, accessibility: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="WCAG compliant">WCAG compliant</SelectItem>
                          <SelectItem value="Enterprise accessibility">Enterprise accessibility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Deployment & Budget */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Deployment & Budget
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Hosting Type</Label>
                      <Select value={projectInput.hostingType} onValueChange={(value) => setProjectInput(prev => ({ ...prev, hostingType: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shared hosting">Shared hosting</SelectItem>
                          <SelectItem value="Cloud platform">Cloud platform</SelectItem>
                          <SelectItem value="Self-hosted">Self-hosted</SelectItem>
                          <SelectItem value="Don't know">Don't know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Budget Range</Label>
                      <Select value={projectInput.budget} onValueChange={(value) => setProjectInput(prev => ({ ...prev, budget: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free/minimal">Free/minimal</SelectItem>
                          <SelectItem value="Low budget">Low budget ($50-200)</SelectItem>
                          <SelectItem value="Medium budget">Medium budget ($200-1000)</SelectItem>
                          <SelectItem value="Enterprise budget">Enterprise budget ($1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Maintenance</Label>
                      <Select value={projectInput.maintenance} onValueChange={(value) => setProjectInput(prev => ({ ...prev, maintenance: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Set and forget">Set and forget</SelectItem>
                          <SelectItem value="Occasional updates">Occasional updates</SelectItem>
                          <SelectItem value="Active maintenance">Active maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={analyzeProject} 
                disabled={isAnalyzing || !projectInput.name || !projectInput.description || projectInput.description.length < 300}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing Project...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Analyze & Get Smart Recommendations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'recommendations' && recommendations) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('input')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Smart Recommendations</h1>
            <p className="text-muted-foreground">AI analysis of your project requirements</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Suggested Tech Stack
              </CardTitle>
              <CardDescription>{recommendations.reasoning.techStackReason}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedTechStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={recommendations.suggestedComplexity === 'simple' ? 'default' : 
                             recommendations.suggestedComplexity === 'medium' ? 'secondary' : 'destructive'}>
                  {recommendations.suggestedComplexity.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {recommendations.reasoning.complexityReason}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Estimated Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{recommendations.estimatedTimeline}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {recommendations.reasoning.timelineReason}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Core Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.coreFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Optional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.optionalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Potential Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.potentialChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => setPhase('customization')} className="flex-1">
              Review & Customize Plan
            </Button>
            <Button onClick={generateRoadmap} variant="outline">
              Generate Roadmap Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'roadmap') {
    const completedSteps = roadmapSteps.filter(step => step.isCompleted).length;
    const progressPercentage = (completedSteps / roadmapSteps.length) * 100;
    const activeStep = roadmapSteps.find(step => step.stepNumber === currentStep + 1) || roadmapSteps[0];

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('recommendations')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{projectInput.name}</h1>
            <p className="text-muted-foreground">Development Roadmap</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold">{completedSteps}/{roadmapSteps.length} steps</p>
          </div>
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel - Step List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Steps</CardTitle>
                <CardDescription>
                  Estimated Total: {recommendations?.estimatedTimeline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {roadmapSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          step.stepNumber === activeStep.stepNumber
                            ? 'border-blue-200 bg-blue-50'
                            : step.isCompleted
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentStep(step.stepNumber - 1)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            step.isCompleted
                              ? 'text-green-500'
                              : step.stepNumber === activeStep.stepNumber
                              ? 'text-blue-500'
                              : 'text-gray-400'
                          }`}>
                            {step.isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-current" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              Step {step.stepNumber}: {step.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {step.estimatedTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Active Step Details */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Step {activeStep.stepNumber}: {activeStep.title}</CardTitle>
                    <CardDescription>{activeStep.estimatedTime}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!activeStep.isCompleted && (
                      <Button
                        size="sm"
                        onClick={() => markStepComplete(activeStep.stepNumber)}
                        variant="outline"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">What to Build:</h4>
                  <p className="text-muted-foreground">{activeStep.description}</p>
                </div>

                <Separator />

                {/* Enhanced AI Prompt Display with High Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      AI Assistant Prompt:
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPrompt(activeStep.startPrompt)}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                  
                  {/* High Contrast Prompt Box */}
                  <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-slate-100 leading-relaxed">
                      {activeStep.startPrompt}
                    </pre>
                  </div>
                  
                  {/* Prompt Explanation */}
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm">Why This Prompt Works:</h5>
                        <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                          This prompt provides specific context about your {projectInput.targetAudience} project, 
                          includes your tech stack ({recommendations?.recommendedTechStack.slice(0, 3).join(', ')}), 
                          and guides the AI with step-by-step instructions for {activeStep.title.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Integrated Rescue System */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Need Rescue?
                    </h4>
                    <Button
                      size="sm"
                      onClick={() => onOpenRescue && onOpenRescue(`
Project Context: ${projectInput.name}
Current Step: ${activeStep.title}
Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
Experience Level: ${projectInput.experienceLevel}
Target Audience: ${projectInput.targetAudience}
Platform: ${projectInput.platform}

Problem with: ${activeStep.title}
                      `)}
                      className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Open Rescue Generator
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stuck on this step? Use the rescue generator to get specific help with your issue.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Validation Checklist:</h4>
                  <div className="space-y-2">
                    {activeStep.validationChecklist.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`validation-${index}`} />
                        <Label htmlFor={`validation-${index}`} className="text-sm">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}