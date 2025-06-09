import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle, Clock, Code2, Lightbulb, Target, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep, RoadmapRecommendations } from '@shared/schema';

interface RoadmapCreatorProps {
  onBack: () => void;
  onOpenRescue?: (context: string) => void;
}

type Phase = 'input' | 'recommendations' | 'customization' | 'roadmap';

interface ProjectInput {
  name: string;
  description: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
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
    name: '',
    description: '',
    experienceLevel: 'intermediate'
  });
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [customizedProject, setCustomizedProject] = useState<any>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const analyzeProject = async () => {
    if (!projectInput.name.trim() || !projectInput.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both project name and description.",
        variant: "destructive",
      });
      return;
    }

    if (projectInput.description.length < 50) {
      toast({
        title: "Description Too Short",
        description: "Please provide a more detailed description (at least 50 characters) for better recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: Recommendations = {
        recommendedTechStack: ['React', 'Node.js', 'MongoDB', 'Express'],
        suggestedComplexity: 'medium',
        estimatedTimeline: '15-20 hours',
        coreFeatures: ['User authentication', 'CRUD operations', 'Dashboard'],
        optionalFeatures: ['Real-time notifications', 'File uploads', 'Email integration'],
        potentialChallenges: ['Authentication security', 'Database design', 'State management'],
        reasoning: {
          techStackReason: 'React provides excellent user interfaces, Node.js enables full-stack JavaScript development, and MongoDB offers flexible data storage.',
          complexityReason: 'Based on the features described, this project requires authentication and data management which suggests medium complexity.',
          timelineReason: 'Estimated based on typical development time for projects with similar scope and your experience level.'
        }
      };
      
      setRecommendations(mockRecommendations);
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
      <div className="max-w-4xl mx-auto p-6">
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
            <h1 className="text-2xl font-bold">Roadmap Prompt Creator</h1>
            <p className="text-muted-foreground">Generate a complete development roadmap with custom AI prompts</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pro Feature
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Tell us about your project and we'll create a personalized development roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Todo App with Authentication"
                value={projectInput.name}
                onChange={(e) => setProjectInput(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe your project in detail. What features do you want? Who will use it? What problems does it solve? (200+ characters recommended)"
                rows={6}
                value={projectInput.description}
                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {projectInput.description.length} characters
              </p>
            </div>

            <div>
              <Label>Your Experience Level</Label>
              <RadioGroup
                value={projectInput.experienceLevel}
                onValueChange={(value: any) => setProjectInput(prev => ({ ...prev, experienceLevel: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner - New to web development</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate - Some experience building projects</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced - Experienced developer</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={analyzeProject} 
              disabled={isAnalyzing}
              className="w-full"
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

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">AI Assistant Prompt:</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPrompt(activeStep.startPrompt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {activeStep.startPrompt}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Need Rescue?</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenRescue?.(activeStep.title)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
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