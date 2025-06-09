import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MapPin, 
  Target, 
  Code2, 
  Clock, 
  CheckCircle, 
  Lightbulb, 
  AlertTriangle,
  ChevronDown,
  Copy,
  Download,
  Sparkles,
  Zap,
  FolderOpen,
  Plus,
  Trash2,
  Play
} from "lucide-react";

interface RoadmapCreatorProps {
  onBack: () => void;
  onOpenRescue?: (context: string) => void;
}

type Phase = 'projects' | 'input' | 'recommendations' | 'customization' | 'roadmap';

interface ProjectInput {
  name: string;
  description: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: 'B2B' | 'B2C' | 'Internal tool' | 'Personal project';
  platform: 'Web app' | 'Mobile responsive' | 'Native mobile' | 'Desktop app';
  expectedUsers: '1-100' | '100-1000' | '1000+' | 'Enterprise scale';
  projectTimeline: 'Weekend project' | '1-2 weeks' | '1-2 months' | 'Long-term';
  authenticationNeeds: 'None' | 'Simple login' | 'OAuth' | 'Enterprise SSO' | 'Custom auth';
  dataComplexity: 'Static content' | 'Simple forms' | 'Database driven' | 'Real-time data' | 'Complex analytics';
  integrations: string[];
  performanceNeeds: 'Basic' | 'Medium traffic' | 'High performance' | 'Enterprise scale';
  designComplexity: 'Minimal/functional' | 'Standard UI' | 'Custom branded' | 'Complex animations';
  responsiveness: 'Desktop only' | 'Mobile friendly' | 'Mobile first';
  accessibility: 'Basic' | 'WCAG compliant' | 'Enterprise accessibility';
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

interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
  dependencies: number[];
  rescuePrompts: string[];
  startPrompt: string;
  validationChecklist: string[];
}

interface ProjectRecipe {
  architecture: {
    frontend: string;
    backend: string;
    database: string;
  };
  timeline: {
    setup: string;
    authentication: string;
    coreFeatures: string;
    total: string;
  };
  deploymentStrategy: {
    hosting: string;
    cicd: string;
    scaling: string;
  };
  fileStructure: string;
  databaseSchema: string;
  apiEndpoints: string;
  uiComponents: string;
  dependencies: string;
  detailedTimeline: string;
}

export function RoadmapCreator({ onBack, onOpenRescue }: RoadmapCreatorProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('projects');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [projectRecipe, setProjectRecipe] = useState<ProjectRecipe | null>(null);
  const [customProblem, setCustomProblem] = useState("");
  const [customSolution, setCustomSolution] = useState("");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Get user ID from localStorage (Firebase auth)
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.uid || user.id;
    }
    return null;
  };

  const userId = getUserId();

  // Fetch user's projects
  const { data: projectsData, isLoading: projectsLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['/api/projects', userId],
    queryFn: async () => {
      if (!userId) return { projects: [] };
      const response = await apiRequest('GET', `/api/projects/${userId}`);
      return response.json();
    },
    enabled: !!userId
  });

  const userProjects = projectsData?.projects || [];

  // Project management functions
  const saveProject = async (projectData: any) => {
    if (!userId) return;
    
    try {
      await apiRequest('POST', '/api/projects', {
        userId,
        projectName: projectData.name,
        projectDetails: projectInput,
        generatedRecipe: projectRecipe,
        roadmapSteps: roadmapSteps
      });
      
      toast({
        title: "Project Saved",
        description: "Your project has been saved successfully.",
      });
      
      refetchProjects();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadProject = (project: any) => {
    setSelectedProject(project);
    setProjectInput(project.projectDetails || projectInput);
    setProjectRecipe(project.generatedRecipe);
    setRoadmapSteps(project.roadmapSteps || []);
    setRecommendations(project.generatedRecipe ? generateCustomAnalysis(project.projectDetails) : null);
    
    if (project.roadmapSteps && project.roadmapSteps.length > 0) {
      setPhase('roadmap');
    } else if (project.generatedRecipe) {
      setPhase('recommendations');
    } else {
      setPhase('input');
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await apiRequest('DELETE', `/api/project/${projectId}`);
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
      refetchProjects();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [projectInput, setProjectInput] = useState<ProjectInput>({
    name: "",
    description: "",
    experienceLevel: 'intermediate',
    targetAudience: 'B2C',
    platform: 'Web app',
    expectedUsers: '100-1000',
    projectTimeline: '1-2 months',
    authenticationNeeds: 'Simple login',
    dataComplexity: 'Database driven',
    integrations: [],
    performanceNeeds: 'Medium traffic',
    designComplexity: 'Standard UI',
    responsiveness: 'Mobile friendly',
    accessibility: 'Basic',
    hostingType: 'Cloud platform',
    budget: 'Medium budget',
    maintenance: 'Occasional updates'
  });

  const generateRecommendations = async () => {
    if (!projectInput.name || !projectInput.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a project name and description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const recs = generateCustomAnalysis(projectInput);
      const recipe = generateProjectRecipe(projectInput, recs);
      
      setRecommendations(recs);
      setProjectRecipe(recipe);
      setPhase('recommendations');
      
      // Auto-save project after generating recommendations
      if (userId && projectInput.name) {
        saveProject(projectInput);
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCustomAnalysis = (input: ProjectInput): Recommendations => {
    const techStackMap: Record<string, string[]> = {
      'Web app': ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
      'Mobile responsive': ['React', 'TypeScript', 'Next.js', 'Supabase', 'Tailwind CSS'],
      'Native mobile': ['React Native', 'TypeScript', 'Expo', 'Firebase', 'NativeBase'],
      'Desktop app': ['Electron', 'React', 'TypeScript', 'SQLite', 'Chakra UI']
    };

    const baseStack = techStackMap[input.platform] || techStackMap['Web app'];
    
    if (input.authenticationNeeds === 'OAuth') {
      baseStack.push('Auth0', 'Passport.js');
    }
    if (input.dataComplexity === 'Real-time data') {
      baseStack.push('Socket.io', 'Redis');
    }
    if (input.integrations.length > 0) {
      baseStack.push('Axios', 'REST APIs');
    }

    const complexity = input.dataComplexity === 'Static content' || input.expectedUsers === '1-100' 
      ? 'simple' 
      : input.expectedUsers === 'Enterprise scale' || input.dataComplexity === 'Complex analytics'
      ? 'complex'
      : 'medium';

    const timeline = input.projectTimeline === 'Weekend project' ? '2-3 days' :
                    input.projectTimeline === '1-2 weeks' ? '1-2 weeks' :
                    input.projectTimeline === '1-2 months' ? '4-6 weeks' : '2-3 months';

    const features = extractCoreFeatures(input);
    const optionalFeatures = extractOptionalFeatures(input);
    const challenges = extractChallenges(input);

    return {
      recommendedTechStack: baseStack.slice(0, 6),
      suggestedComplexity: complexity,
      estimatedTimeline: timeline,
      coreFeatures: features,
      optionalFeatures: optionalFeatures,
      potentialChallenges: challenges,
      reasoning: {
        techStackReason: `Selected based on ${input.platform} requirements, ${input.dataComplexity} needs, and ${input.expectedUsers} scale.`,
        complexityReason: `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} complexity due to ${input.dataComplexity} and ${input.expectedUsers} user scale.`,
        timelineReason: `${timeline} timeline accounts for ${input.experienceLevel} developer experience and ${complexity} complexity.`
      }
    };
  };

  const extractCoreFeatures = (input: ProjectInput): string[] => {
    const features = [];
    features.push("Project setup and configuration");
    
    if (input.authenticationNeeds !== 'None') {
      features.push(`${input.authenticationNeeds} authentication system`);
    }
    
    if (input.dataComplexity !== 'Static content') {
      features.push("Database schema and CRUD operations");
    }
    
    features.push("Core user interface");
    features.push("Basic functionality implementation");
    
    if (input.responsiveness !== 'Desktop only') {
      features.push("Responsive design implementation");
    }
    
    return features;
  };

  const extractOptionalFeatures = (input: ProjectInput): string[] => {
    const features = [];
    
    if (input.designComplexity === 'Complex animations') {
      features.push("Advanced animations and interactions");
    }
    
    if (input.performanceNeeds === 'High performance') {
      features.push("Performance optimization");
    }
    
    if (input.accessibility !== 'Basic') {
      features.push("Advanced accessibility features");
    }
    
    if (input.integrations.length > 0) {
      features.push("Third-party integrations");
    }
    
    features.push("Advanced testing suite");
    features.push("CI/CD pipeline");
    
    return features;
  };

  const extractChallenges = (input: ProjectInput): string[] => {
    const challenges = [];
    
    if (input.expectedUsers === 'Enterprise scale') {
      challenges.push("Scaling for enterprise-level traffic");
    }
    
    if (input.dataComplexity === 'Complex analytics') {
      challenges.push("Complex data processing and analytics");
    }
    
    if (input.authenticationNeeds === 'Enterprise SSO') {
      challenges.push("Enterprise authentication integration");
    }
    
    if (input.integrations.length > 3) {
      challenges.push("Managing multiple API integrations");
    }
    
    return challenges;
  };

  const generateRoadmap = async () => {
    if (!recommendations) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const steps = generateIntelligentRoadmap(projectInput, recommendations);
      setRoadmapSteps(steps);
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

  const generateIntelligentRoadmap = (input: ProjectInput, recommendations: Recommendations): RoadmapStep[] => {
    const steps: RoadmapStep[] = [];
    let stepNumber = 1;

    // Always start with project setup
    steps.push({
      stepNumber: stepNumber++,
      title: "Project Setup & Environment",
      description: `Initialize ${input.platform} project with ${recommendations.recommendedTechStack.slice(0, 3).join(', ')}`,
      estimatedTime: "2-4 hours",
      isCompleted: false,
      dependencies: [],
      rescuePrompts: [
        "**AI CODING AGENT RESCUE - PROJECT SETUP**: My project setup is failing. Help me debug initialization errors, dependency conflicts, and build configuration issues.",
        "**AI CODING AGENT RESCUE - BUILD ERRORS**: Fix all build configuration errors in my project. I need complete working configuration files."
      ],
      startPrompt: generateSetupPrompt(input, recommendations),
      validationChecklist: [
        "Project builds without errors",
        "Development server starts successfully",
        "Basic routing is functional",
        "Git repository is initialized"
      ]
    });

    // Add authentication if needed
    if (input.authenticationNeeds !== 'None') {
      steps.push({
        stepNumber: stepNumber++,
        title: `${input.authenticationNeeds} Authentication`,
        description: `Implement ${input.authenticationNeeds.toLowerCase()} authentication system`,
        estimatedTime: input.authenticationNeeds === 'Simple login' ? "3-5 hours" : "6-10 hours",
        isCompleted: false,
        dependencies: [1],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - AUTH FLOW**: My authentication system is broken. Debug login/logout issues and session management.",
          "**AI CODING AGENT RESCUE - LOGIN ERRORS**: Fix all login/register functionality errors with complete working forms."
        ],
        startPrompt: generateAuthPrompt(input, recommendations),
        validationChecklist: [
          "User registration works",
          "User login/logout functional",
          "Protected routes working",
          "Session persistence implemented"
        ]
      });
    }

    // Add database layer if complex data
    if (input.dataComplexity !== 'Static content') {
      steps.push({
        stepNumber: stepNumber++,
        title: `${input.dataComplexity} Implementation`,
        description: `Build ${input.dataComplexity.toLowerCase()} system with database schema and operations`,
        estimatedTime: input.dataComplexity === 'Simple forms' ? "3-5 hours" : 
                      input.dataComplexity === 'Database driven' ? "6-10 hours" : "10-15 hours",
        isCompleted: false,
        dependencies: stepNumber === 3 ? [1, 2] : [1],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - DATABASE**: My database connections and schema are failing. Debug connection and ORM issues.",
          "**AI CODING AGENT RESCUE - CRUD OPERATIONS**: Fix all CRUD operation errors and API endpoint issues."
        ],
        startPrompt: generateDatabasePrompt(input, recommendations),
        validationChecklist: [
          "Database schema is properly designed",
          "CRUD operations work correctly",
          "Data validation is implemented",
          "API endpoints are functional"
        ]
      });
    }

    // Analyze project description for specific features
    const description = input.description.toLowerCase();
    const features = extractFeaturesFromDescription(description);
    
    // Add feature-specific steps
    features.forEach(feature => {
      steps.push({
        stepNumber: stepNumber++,
        title: feature.title,
        description: feature.description,
        estimatedTime: feature.estimatedTime,
        isCompleted: false,
        dependencies: feature.dependencies,
        rescuePrompts: feature.rescuePrompts,
        startPrompt: feature.startPrompt,
        validationChecklist: feature.validationChecklist
      });
    });

    // Add integrations if specified
    if (input.integrations.length > 0) {
      steps.push({
        stepNumber: stepNumber++,
        title: "Third-party Integrations",
        description: `Integrate ${input.integrations.join(', ')} services`,
        estimatedTime: `${input.integrations.length * 3}-${input.integrations.length * 5} hours`,
        isCompleted: false,
        dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - API INTEGRATIONS**: My third-party API integrations are failing. Debug connection and authentication issues.",
          "**AI CODING AGENT RESCUE - INTEGRATION AUTH**: Fix API authentication and authorization issues with working OAuth flows."
        ],
        startPrompt: generateIntegrationsPrompt(input, recommendations),
        validationChecklist: [
          "All integrations are connected",
          "API authentication working",
          "Error handling implemented",
          "Rate limiting configured"
        ]
      });
    }

    // Add testing phase
    steps.push({
      stepNumber: stepNumber++,
      title: "Testing & Quality Assurance",
      description: "Implement comprehensive testing suite and quality checks",
      estimatedTime: "4-8 hours",
      isCompleted: false,
      dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
      rescuePrompts: [
        "**AI CODING AGENT RESCUE - TESTING**: My test suite is failing. Debug test configuration and assertion problems.",
        "**AI CODING AGENT RESCUE - TEST COVERAGE**: Fix test coverage gaps with complete working test files."
      ],
      startPrompt: generateTestingPrompt(input, recommendations),
      validationChecklist: [
        "Unit tests are passing",
        "Integration tests working",
        "Test coverage adequate",
        "CI/CD pipeline functional"
      ]
    });

    // Always end with deployment
    steps.push({
      stepNumber: stepNumber++,
      title: "Production Deployment",
      description: `Deploy to ${input.hostingType} with full production configuration`,
      estimatedTime: "4-8 hours",
      isCompleted: false,
      dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
      rescuePrompts: [
        "**AI CODING AGENT RESCUE - DEPLOYMENT**: My deployment is failing. Debug hosting and environment configuration issues.",
        "**AI CODING AGENT RESCUE - PRODUCTION**: Fix production environment setup with complete deployment configuration."
      ],
      startPrompt: generateDeploymentPrompt(input, recommendations),
      validationChecklist: [
        "Application is accessible via public URL",
        "SSL certificates are configured",
        "Environment variables are properly set",
        "CI/CD pipeline is working",
        "Monitoring is in place"
      ]
    });

    return steps;
  };

  const extractFeaturesFromDescription = (description: string) => {
    const features: any[] = [];
    
    const featurePatterns = [
      {
        keywords: ['chat', 'messaging', 'real-time', 'socket'],
        title: 'Real-time Messaging System',
        description: 'Implement chat functionality with real-time messaging',
        estimatedTime: '8-12 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - REAL-TIME**: My WebSocket/real-time functionality is broken. Debug connection issues and message delivery.",
          "**AI CODING AGENT RESCUE - CHAT**: Fix chat interface and messaging system with complete working components."
        ],
        startPrompt: "Build a complete real-time messaging system with WebSocket connections, message persistence, and user presence indicators.",
        validationChecklist: [
          "Real-time messaging works",
          "Message persistence functional",
          "User presence indicators working",
          "WebSocket connections stable"
        ]
      },
      {
        keywords: ['dashboard', 'analytics', 'charts', 'graphs', 'metrics'],
        title: 'Analytics Dashboard',
        description: 'Create comprehensive analytics dashboard with charts and metrics',
        estimatedTime: '6-10 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - DASHBOARD**: My analytics dashboard is not displaying data correctly. Debug chart rendering and data aggregation.",
          "**AI CODING AGENT RESCUE - CHARTS**: Fix chart components and data visualization with complete working dashboard."
        ],
        startPrompt: "Build a comprehensive analytics dashboard with interactive charts, real-time data updates, and customizable metrics visualization.",
        validationChecklist: [
          "Charts render correctly",
          "Data aggregation working",
          "Real-time updates functional",
          "Responsive design implemented"
        ]
      },
      {
        keywords: ['payment', 'stripe', 'billing', 'subscription', 'checkout'],
        title: 'Payment Processing System',
        description: 'Implement secure payment processing and billing',
        estimatedTime: '8-12 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - PAYMENTS**: My payment system is failing. Debug Stripe integration and transaction processing.",
          "**AI CODING AGENT RESCUE - BILLING**: Fix billing and subscription management with complete working payment flows."
        ],
        startPrompt: "Implement a complete payment processing system with Stripe integration, subscription management, and secure checkout flows.",
        validationChecklist: [
          "Payment processing works",
          "Webhooks are functional",
          "Subscription management implemented",
          "Security measures in place"
        ]
      }
    ];

    featurePatterns.forEach(pattern => {
      if (pattern.keywords.some(keyword => description.includes(keyword))) {
        features.push(pattern);
      }
    });

    return features;
  };

  const generateSetupPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - PROJECT SETUP**

I need help setting up a new ${input.targetAudience} ${input.platform.toLowerCase()} project. Please act as an expert ${input.experienceLevel} developer and provide COMPLETE, EXECUTABLE code and commands.

**PROJECT SPECIFICATIONS:**
- Project Name: ${input.name}
- Target Users: ${input.targetAudience} with ${input.expectedUsers} expected users  
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Complexity Level: ${recommendations.suggestedComplexity}
- Design Requirements: ${input.responsiveness}

**SPECIFIC TASKS FOR AI AGENT:**
1. Generate complete project initialization commands
2. Create full directory structure with all necessary folders
3. Write complete configuration files (package.json, tsconfig.json, etc.)
4. Set up routing system with example routes
5. Create starter components with proper TypeScript types
6. Generate .gitignore file with all necessary exclusions

**OUTPUT FORMAT REQUIRED:**
- Provide exact terminal commands that I can copy-paste
- Include complete file contents, not just snippets
- Add comments explaining each step for ${input.experienceLevel} developers
- Structure response as: Commands → File Contents → Verification Steps`;
  };

  const generateAuthPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - AUTHENTICATION SYSTEM**

I need you to implement a complete ${input.authenticationNeeds} authentication system. Provide FULL, WORKING code that I can copy directly into my project.

**PROJECT CONTEXT:**
- App: ${input.name} (${input.targetAudience} application)
- Expected Users: ${input.expectedUsers}
- Platform: ${input.platform}
- Auth Type: ${input.authenticationNeeds}
- Design Style: ${input.designComplexity}

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE authentication system - no partial implementations
✅ FULL login/register forms with working validation
✅ COMPLETE protected route system with redirect logic
✅ WORKING session management and user persistence
✅ COMPLETE password security (hashing, salting, validation)
✅ FULL user profile management interface

**DELIVERABLE FORMAT:**
📁 Complete file structure with exact paths
🔧 Installation commands for dependencies
📄 Complete component files (no TODO comments)
⚙️ Configuration files with environment variables
🔒 Security middleware and route protection
📱 Responsive forms for ${input.responsiveness}
🧪 Testing commands to verify functionality`;
  };

  const generateDatabasePrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - DATABASE & DATA MANAGEMENT**

Build a complete ${input.dataComplexity} system for my application. I need COMPLETE, EXECUTABLE code that handles ${input.expectedUsers} users efficiently.

**PROJECT REQUIREMENTS:**
- Application: ${input.name} (${input.targetAudience})
- Data Complexity: ${input.dataComplexity}
- User Scale: ${input.expectedUsers}
- Performance Needs: ${input.performanceNeeds}

**COMPLETE IMPLEMENTATION NEEDED:**
1. Full database schema design with all tables/collections
2. Complete database setup and connection configuration
3. All CRUD operations with TypeScript interfaces
4. Data validation schemas and error handling
5. Database migrations and seeding scripts
6. API endpoints with full request/response handling

**CRITICAL:** Provide complete, copy-paste ready code files with proper file structure and integration instructions.`;
  };

  const generateIntegrationsPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - THIRD-PARTY INTEGRATIONS**

Implement complete integrations for ${input.integrations.join(', ')} in my ${input.targetAudience} application. Provide FULL, WORKING integration code.

**INTEGRATION SPECIFICATIONS:**
- App: ${input.name} (${input.platform})
- Services: ${input.integrations.join(', ')}
- Budget Tier: ${input.budget}
- User Scale: ${input.expectedUsers}
- Performance: ${input.performanceNeeds}

**AI AGENT REQUIREMENTS:**
- Complete API service classes with all methods
- Full authentication setup (API keys, OAuth, webhooks)
- Error handling with retry logic and fallbacks
- Rate limiting and quota management implementation
- Complete UI components for each integration
- TypeScript interfaces for all API responses
- Environment configuration and secrets management`;
  };

  const generateTestingPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - TESTING & QUALITY ASSURANCE**

Create a comprehensive testing suite for my ${input.name} application. Provide COMPLETE, EXECUTABLE test files and configuration.

**PROJECT CONTEXT:**
- Application: ${input.name} (${input.targetAudience})
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Complexity: ${recommendations.suggestedComplexity}
- User Scale: ${input.expectedUsers}

**COMPLETE TESTING IMPLEMENTATION:**
1. Unit tests for all components and functions
2. Integration tests for API endpoints
3. End-to-end tests for critical user flows
4. Performance tests for ${input.expectedUsers} load
5. Security tests for authentication and data protection
6. Complete test configuration and CI/CD setup

**CRITICAL:** All tests must be immediately runnable with provided commands.`;
  };

  const generateDeploymentPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - PRODUCTION DEPLOYMENT**

Deploy my ${input.targetAudience} application to production. I need COMPLETE deployment configuration and scripts that I can execute immediately.

**DEPLOYMENT SPECIFICATIONS:**
- Application: ${input.name} (${input.platform})
- Hosting Platform: ${input.hostingType}
- Expected Traffic: ${input.expectedUsers}
- Performance Tier: ${input.performanceNeeds}
- Budget Level: ${input.budget}

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE deployment configuration - no partial setups
✅ FULL CI/CD pipeline with working builds and tests
✅ COMPLETE environment and secrets management
✅ WORKING SSL/TLS and domain configuration
✅ COMPLETE database deployment with migrations
✅ FULL monitoring, logging, and alerting system

**EXECUTION FORMAT:**
1. **INFRASTRUCTURE**: Complete hosting platform setup
2. **CI/CD**: Full pipeline configuration with testing
3. **DEPLOYMENT**: Production deployment scripts
4. **MONITORING**: Complete observability stack
5. **SECURITY**: SSL, secrets, and hardening
6. **VERIFICATION**: Step-by-step deployment testing`;
  };

  const generateProjectRecipe = (input: ProjectInput, recommendations: Recommendations): ProjectRecipe => {
    return {
      architecture: {
        frontend: recommendations.recommendedTechStack.find(tech => tech.includes('React') || tech.includes('Vue') || tech.includes('Angular')) || 'React + TypeScript',
        backend: recommendations.recommendedTechStack.find(tech => tech.includes('Node') || tech.includes('Express') || tech.includes('Nest')) || 'Node.js + Express',
        database: recommendations.recommendedTechStack.find(tech => tech.includes('SQL') || tech.includes('MongoDB') || tech.includes('Firebase')) || 'PostgreSQL'
      },
      timeline: {
        setup: "2-4 hours",
        authentication: input.authenticationNeeds === 'None' ? "0 hours" : "4-8 hours",
        coreFeatures: recommendations.suggestedComplexity === 'simple' ? "8-16 hours" : 
                     recommendations.suggestedComplexity === 'medium' ? "20-40 hours" : "40-80 hours",
        total: recommendations.estimatedTimeline
      },
      deploymentStrategy: {
        hosting: input.hostingType === 'Cloud platform' ? 'Vercel/Netlify + Railway/Supabase' : input.hostingType,
        cicd: 'GitHub Actions with automated testing',
        scaling: input.expectedUsers === 'Enterprise scale' ? 'Load balancer + CDN + Auto-scaling' : 'Standard hosting'
      },
      fileStructure: generateComprehensiveFileStructure(input, recommendations),
      databaseSchema: generateComprehensiveDatabaseSchema(input),
      apiEndpoints: generateComprehensiveAPIEndpoints(input),
      uiComponents: generateComprehensiveUIComponents(input),
      dependencies: generateComprehensiveDependencies(recommendations),
      detailedTimeline: generateComprehensiveTimeline(input, recommendations)
    };
  };

  const generateComprehensiveFileStructure = (input: ProjectInput, recommendations: Recommendations) => {
    const frontend = recommendations.recommendedTechStack.find(tech => tech.includes('React')) ? 'React' : 'Vue';
    const backend = recommendations.recommendedTechStack.find(tech => tech.includes('Node')) ? 'Node.js' : 'Express';
    
    return `
project-root/
├── client/ (Frontend - ${frontend})
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Button, Input, Modal, etc.)
│   │   │   ├── auth/ (Login, Register, Profile)
│   │   │   ├── layout/ (Header, Footer, Sidebar)
│   │   │   ├── features/ (Core feature components)
│   │   │   └── shared/ (Reusable components)
│   │   ├── pages/
│   │   │   ├── auth/ (Login, Register pages)
│   │   │   ├── dashboard/ (Main dashboard)
│   │   │   └── settings/ (User settings)
│   │   ├── hooks/ (Custom React hooks)
│   │   ├── lib/ (API client, utilities)
│   │   ├── types/ (TypeScript definitions)
│   │   ├── context/ (React Context providers)
│   │   ├── utils/ (Helper functions)
│   │   └── assets/ (Images, icons, styles)
│   ├── public/
│   ├── tests/ (Component & integration tests)
│   └── docs/ (Component documentation)
├── server/ (Backend - ${backend})
│   ├── src/
│   │   ├── controllers/ (Route handlers)
│   │   ├── middleware/ (Auth, validation, etc.)
│   │   ├── models/ (Database models)
│   │   ├── routes/ (API routes)
│   │   ├── services/ (Business logic)
│   │   ├── utils/ (Helper functions)
│   │   ├── config/ (Database, environment)
│   │   └── types/ (TypeScript definitions)
│   ├── tests/ (API & unit tests)
│   └── migrations/ (Database migrations)
├── shared/ (Shared types & utilities)
├── docs/ (Project documentation)
├── deployment/
│   ├── docker/ (Containerization)
│   ├── ci-cd/ (GitHub Actions)
│   └── scripts/ (Build & deploy scripts)
└── tools/ (Development tools & configs)`;
  };

  const generateComprehensiveDatabaseSchema = (input: ProjectInput) => {
    if (input.dataComplexity === 'Static content') return 'No database required - Static hosting';
    
    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    const hasChat = features.some(f => f.title.includes('Messaging'));
    const hasPayments = features.some(f => f.title.includes('Payment'));
    const hasAnalytics = features.some(f => f.title.includes('Analytics'));
    
    let schema = `-- Core User Management
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Sessions
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW()
);`;

    if (input.dataComplexity === 'Database driven' || input.dataComplexity === 'Complex analytics') {
      schema += `

-- Core Data Entities
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Main Data Items
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasChat) {
      schema += `

-- Real-time Messaging
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'group',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  reply_to INTEGER REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasPayments) {
      schema += `

-- Payment System
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_name VARCHAR(100),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasAnalytics) {
      schema += `

-- Analytics & Tracking
CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  properties JSONB,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    schema += `

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_items_project ON items(project_id);
CREATE INDEX idx_items_assignee ON items(assignee_id);
CREATE INDEX idx_items_status ON items(status);`;

    if (hasChat) {
      schema += `
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);`;
    }

    if (hasAnalytics) {
      schema += `
CREATE INDEX idx_activities_user ON user_activities(user_id);
CREATE INDEX idx_activities_created ON user_activities(created_at);
CREATE INDEX idx_events_name ON analytics_events(event_name);`;
    }

    return schema;
  };

  const generateComprehensiveAPIEndpoints = (input: ProjectInput) => {
    let endpoints = `# Authentication Endpoints`;
    
    if (input.authenticationNeeds !== 'None') {
      endpoints += `
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Password reset confirmation
GET    /api/auth/verify-email   # Email verification
POST   /api/auth/resend-verification # Resend verification`;
    }

    endpoints += `

# User Management
GET    /api/users/profile       # Get current user profile
PUT    /api/users/profile       # Update user profile
POST   /api/users/avatar        # Upload avatar
GET    /api/users/preferences   # Get user preferences
PUT    /api/users/preferences   # Update preferences
DELETE /api/users/account       # Delete account`;

    if (input.dataComplexity !== 'Static content') {
      endpoints += `

# Core Resource Management
GET    /api/projects            # List user projects
POST   /api/projects            # Create new project
GET    /api/projects/:id        # Get project details
PUT    /api/projects/:id        # Update project
DELETE /api/projects/:id        # Delete project

# Project Members
GET    /api/projects/:id/members # List project members
POST   /api/projects/:id/members # Add member
PUT    /api/projects/:id/members/:userId # Update member role
DELETE /api/projects/:id/members/:userId # Remove member

# Items/Tasks Management
GET    /api/projects/:id/items  # List project items
POST   /api/projects/:id/items  # Create item
GET    /api/items/:id           # Get item details
PUT    /api/items/:id           # Update item
DELETE /api/items/:id           # Delete item
POST   /api/items/:id/assign    # Assign item to user`;
    }

    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    if (features.some(f => f.title.includes('Messaging'))) {
      endpoints += `

# Real-time Messaging
GET    /api/conversations       # List user conversations
POST   /api/conversations       # Create conversation
GET    /api/conversations/:id/messages # Get messages
POST   /api/conversations/:id/messages # Send message
PUT    /api/messages/:id        # Edit message
DELETE /api/messages/:id        # Delete message

# WebSocket Events
- user:online, user:offline
- message:new, message:updated
- typing:start, typing:stop`;
    }

    if (features.some(f => f.title.includes('Payment'))) {
      endpoints += `

# Payment System
GET    /api/billing/plans       # Available plans
POST   /api/billing/subscribe   # Create subscription
GET    /api/billing/subscription # Current subscription
PUT    /api/billing/subscription # Update subscription
DELETE /api/billing/subscription # Cancel subscription
GET    /api/billing/invoices    # Payment history
POST   /api/billing/portal      # Customer portal link`;
    }

    if (features.some(f => f.title.includes('Analytics'))) {
      endpoints += `

# Analytics & Reporting
GET    /api/analytics/dashboard # Dashboard metrics
GET    /api/analytics/users     # User analytics
GET    /api/analytics/projects  # Project analytics
POST   /api/analytics/events    # Track custom event
GET    /api/analytics/export    # Export data`;
    }

    if (input.integrations.length > 0) {
      endpoints += `

# Third-party Integrations`;
      input.integrations.forEach(integration => {
        endpoints += `
GET    /api/integrations/${integration.toLowerCase()} # ${integration} status
POST   /api/integrations/${integration.toLowerCase()}/connect # Connect ${integration}
DELETE /api/integrations/${integration.toLowerCase()}/disconnect # Disconnect ${integration}`;
      });
    }

    endpoints += `

# File Management
POST   /api/upload              # Upload file
GET    /api/files/:id           # Get file
DELETE /api/files/:id           # Delete file

# Search & Filtering
GET    /api/search              # Global search
GET    /api/search/users        # Search users
GET    /api/search/projects     # Search projects

# Admin (if applicable)
GET    /api/admin/stats         # System statistics
GET    /api/admin/users         # User management
POST   /api/admin/announcements # System announcements`;

    return endpoints;
  };

  const generateComprehensiveUIComponents = (input: ProjectInput) => {
    let components = `# Core UI Components

## Layout Components
- AppLayout: Main application wrapper
- Header: Navigation, user menu, notifications
- Sidebar: Main navigation, project switcher
- Footer: Links, version, status
- PageContainer: Consistent page wrapper

## Form Components
- Input: Text, email, password inputs
- Textarea: Multi-line text input
- Select: Dropdown selection
- Checkbox: Boolean input
- RadioGroup: Single selection from options
- DatePicker: Date/time selection
- FileUpload: File upload with preview
- FormField: Wrapper with label and validation

## UI Elements
- Button: Primary, secondary, danger variants
- Badge: Status indicators, counts
- Avatar: User profile pictures
- Card: Content containers
- Modal: Overlay dialogs
- Toast: Notification messages
- Loader: Loading states and skeletons
- Pagination: List navigation
- Tabs: Content organization
- Accordion: Collapsible content`;

    if (input.authenticationNeeds !== 'None') {
      components += `

## Authentication Components
- LoginForm: User login interface
- RegisterForm: User registration
- ForgotPasswordForm: Password reset request
- ResetPasswordForm: Password reset confirmation
- EmailVerification: Email verification prompt
- AuthGuard: Protected route wrapper
- UserProfile: Profile management
- PasswordChange: Password update form`;
    }

    if (input.dataComplexity !== 'Static content') {
      components += `

## Data Management Components
- ProjectCard: Project overview display
- ProjectList: Grid/list of projects
- ProjectForm: Create/edit projects
- ItemCard: Individual item display
- ItemList: List of items with filtering
- ItemForm: Create/edit items
- SearchBar: Global search interface
- FilterPanel: Advanced filtering options
- SortControls: Sorting options`;
    }

    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    if (features.some(f => f.title.includes('Messaging'))) {
      components += `

## Real-time Chat Components
- ChatWindow: Main chat interface
- MessageList: Message display area
- MessageInput: Message composition
- ConversationList: Chat list sidebar
- UserList: Online users display
- TypingIndicator: Typing status
- MessageBubble: Individual message
- EmojiPicker: Reaction selection`;
    }

    if (features.some(f => f.title.includes('Analytics'))) {
      components += `

## Analytics Components
- DashboardCard: Metric display cards
- ChartContainer: Chart wrapper
- LineChart: Time-series data
- BarChart: Comparison data
- PieChart: Proportion display
- MetricCard: Single statistic display
- DateRangePicker: Date filtering
- ExportButton: Data export controls`;
    }

    if (features.some(f => f.title.includes('Payment'))) {
      components += `

## Payment Components
- PricingCard: Plan display
- PaymentForm: Credit card input
- SubscriptionStatus: Current plan display
- BillingHistory: Payment history
- PlanUpgrade: Upgrade interface
- PaymentMethod: Saved payment display`;
    }

    components += `

## Responsive Design
- Mobile-first approach
- Tablet breakpoint adaptations
- Desktop optimizations
- Touch-friendly interactions
- Keyboard navigation support`;

    return components;
  };

  const generateComprehensiveDependencies = (recommendations: Recommendations) => {
    const frontend = recommendations.recommendedTechStack.find(tech => tech.includes('React')) ? 'React' : 'Vue';
    const backend = recommendations.recommendedTechStack.find(tech => tech.includes('Node')) ? 'Node.js' : 'Express';
    
    return `# Frontend Dependencies (${frontend})
## Core Framework
- ${frontend.toLowerCase()}: ^18.0.0
- typescript: ^5.0.0
- vite: ^4.0.0

## UI & Styling
- tailwindcss: ^3.3.0
- @headlessui/react: ^1.7.0
- lucide-react: ^0.263.0
- framer-motion: ^10.12.0

## State Management
- zustand: ^4.3.0 (or @reduxjs/toolkit if complex)
- react-query: ^3.39.0

## Forms & Validation
- react-hook-form: ^7.44.0
- zod: ^3.21.0
- @hookform/resolvers: ^3.1.0

## Routing & Navigation
- react-router-dom: ^6.11.0
- @reach/router: ^1.3.0

## HTTP & Real-time
- axios: ^1.4.0
- socket.io-client: ^4.6.0

# Backend Dependencies (${backend})
## Core Framework
- express: ^4.18.0
- typescript: ^5.0.0
- ts-node: ^10.9.0

## Database & ORM
- prisma: ^4.15.0 (or drizzle-orm)
- postgresql: ^14.0.0
- redis: ^4.6.0

## Authentication & Security
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.0
- helmet: ^7.0.0
- cors: ^2.8.0
- rate-limiter-flexible: ^2.4.0

## Real-time Communication
- socket.io: ^4.6.0

## File Handling
- multer: ^1.4.0
- sharp: ^0.32.0

## Email & Notifications
- nodemailer: ^6.9.0
- twilio: ^4.11.0

## Testing
- jest: ^29.5.0
- supertest: ^6.3.0
- @testing-library/react: ^13.4.0

## Development Tools
- eslint: ^8.42.0
- prettier: ^2.8.0
- husky: ^8.0.0
- lint-staged: ^13.2.0

## Deployment & Monitoring
- pm2: ^5.3.0
- winston: ^3.9.0
- sentry: ^7.54.0`;
  };

  const generateComprehensiveTimeline = (input: ProjectInput, recommendations: Recommendations) => {
    const complexity = recommendations.suggestedComplexity;
    const hasAuth = input.authenticationNeeds !== 'None';
    const hasRealtime = input.dataComplexity === 'Real-time data';
    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    let timeline = `# Development Timeline - ${recommendations.estimatedTimeline}

## Phase 1: Foundation & Setup (Week 1)
**Duration**: 5-7 days
**Goals**: Project infrastructure and basic architecture

### Tasks:
- [ ] Initialize project repositories (frontend/backend)
- [ ] Set up development environment and tools
- [ ] Configure TypeScript, linting, and formatting
- [ ] Set up database and basic schema
- [ ] Implement CI/CD pipeline basics
- [ ] Create project documentation structure

**Deliverables**:
- Working development environment
- Basic project structure
- Database connection established
- Initial deployment pipeline`;

    if (hasAuth) {
      timeline += `

## Phase 2: Authentication System (Week 2)
**Duration**: 5-7 days
**Goals**: Complete user management system

### Tasks:
- [ ] Design user database schema
- [ ] Implement registration/login API endpoints
- [ ] Create password reset functionality
- [ ] Build authentication middleware
- [ ] Design login/register UI components
- [ ] Implement protected routes
- [ ] Add email verification system
- [ ] Create user profile management

**Deliverables**:
- Fully functional auth system
- User registration and login flows
- Password reset capability
- Protected routes implementation`;
    }

    timeline += `

## Phase 3: Core Features Development (Weeks ${hasAuth ? '3-5' : '2-4'})
**Duration**: ${complexity === 'simple' ? '2 weeks' : complexity === 'medium' ? '3 weeks' : '4 weeks'}
**Goals**: Main application functionality

### Tasks:
- [ ] Implement core data models
- [ ] Build CRUD API endpoints
- [ ] Create main dashboard interface
- [ ] Develop core feature components
- [ ] Implement search and filtering
- [ ] Add data validation and error handling
- [ ] Create responsive layouts
- [ ] Implement basic user permissions`;

    features.forEach(feature => {
      timeline += `
- [ ] ${feature.title} implementation
- [ ] ${feature.title} UI components
- [ ] ${feature.title} testing`;
    });

    timeline += `

**Deliverables**:
- Core application functionality
- Main user interfaces
- Data management system
- Search and filtering features`;

    if (hasRealtime || features.some(f => f.title.includes('Messaging'))) {
      timeline += `

## Phase 4: Real-time Features (Week ${hasAuth ? '6' : '5'})
**Duration**: 5-7 days
**Goals**: Real-time communication and updates

### Tasks:
- [ ] Set up WebSocket infrastructure
- [ ] Implement real-time data synchronization
- [ ] Build chat/messaging system
- [ ] Add live notifications
- [ ] Create presence indicators
- [ ] Implement typing indicators
- [ ] Add real-time collaboration features

**Deliverables**:
- Real-time messaging system
- Live data updates
- Notification system
- Collaborative features`;
    }

    timeline += `

## Phase 5: Advanced Features & Polish (Weeks ${hasAuth ? '6-7' : '5-6'})
**Duration**: 1-2 weeks
**Goals**: Enhanced functionality and user experience

### Tasks:
- [ ] Implement advanced filtering and search
- [ ] Add file upload and management
- [ ] Create analytics and reporting
- [ ] Build admin interface (if needed)
- [ ] Implement data export features
- [ ] Add advanced user preferences
- [ ] Create onboarding flow
- [ ] Optimize performance and loading`;

    if (input.integrations.length > 0) {
      timeline += `
- [ ] Third-party integrations setup
- [ ] API integration testing
- [ ] Integration error handling`;
    }

    timeline += `

**Deliverables**:
- Advanced feature set
- Analytics and reporting
- File management system
- Optimized performance`;

    timeline += `

## Phase 6: Testing & Quality Assurance (Week ${hasAuth ? '8' : '7'})
**Duration**: 5-7 days
**Goals**: Comprehensive testing and bug fixes

### Tasks:
- [ ] Write comprehensive unit tests
- [ ] Implement integration testing
- [ ] Perform end-to-end testing
- [ ] Conduct security audit
- [ ] Performance testing and optimization
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Accessibility compliance check

**Deliverables**:
- Complete test suite (80%+ coverage)
- Security audit report
- Performance optimization
- Cross-platform compatibility

## Phase 7: Deployment & Launch (Week ${hasAuth ? '9-10' : '8-9'})
**Duration**: 1-2 weeks
**Goals**: Production deployment and monitoring

### Tasks:
- [ ] Set up production environment
- [ ] Configure monitoring and logging
- [ ] Implement backup strategies
- [ ] Set up SSL certificates
- [ ] Configure CDN and caching
- [ ] Implement error tracking
- [ ] Create deployment documentation
- [ ] Conduct final security review
- [ ] Perform load testing
- [ ] Launch monitoring dashboard

**Deliverables**:
- Production-ready application
- Monitoring and alerting system
- Deployment documentation
- Launch readiness certification

## Post-Launch: Maintenance & Iteration
**Ongoing**: After initial launch
**Goals**: Continuous improvement and feature expansion

### Monthly Tasks:
- [ ] Monitor system performance
- [ ] Gather user feedback
- [ ] Plan feature iterations
- [ ] Security updates and patches
- [ ] Performance optimizations
- [ ] User experience improvements

## Success Metrics:
- Application uptime: 99.9%+
- Average response time: <200ms
- Test coverage: 80%+
- Security vulnerabilities: 0 critical
- User satisfaction: 4.5+ stars`;

    return timeline;
  };

  const downloadProjectRecipe = () => {
    if (!projectRecipe || !recommendations) return;
    
    const features = extractFeaturesFromDescription(projectInput.description.toLowerCase());
    const hasAuth = projectInput.authenticationNeeds !== 'None';
    const hasRealtime = projectInput.dataComplexity === 'Real-time data' || features.some(f => f.title.includes('Messaging'));
    
    const content = `# AI-Ready Project Plan: ${projectInput.name}

## 1. PROJECT OVERVIEW

### Project Name: ${projectInput.name}

### Vision Statement
${projectInput.description}

### Core Value Proposition
- ${projectInput.targetAudience} focused ${projectInput.platform.toLowerCase()} application
- ${projectInput.designComplexity.toLowerCase()} design with ${projectInput.responsiveness.toLowerCase()} support
- Built for ${projectInput.expectedUsers} with ${projectInput.performanceNeeds.toLowerCase()} performance requirements
- ${projectInput.experienceLevel.charAt(0).toUpperCase() + projectInput.experienceLevel.slice(1)}-level development complexity

### Success Metrics
- User acquisition target: ${projectInput.expectedUsers}
- Performance target: ${projectInput.performanceNeeds === 'Enterprise scale' ? 'Sub-100ms response times' : 'Sub-200ms response times'}
- Availability target: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'} uptime
- User engagement: ${projectInput.expectedUsers === '1-100' ? '70%+' : '80%+'} active user retention

## 2. TECHNICAL SPECIFICATION

### Tech Stack
${recommendations.recommendedTechStack.map(tech => `- **${tech}**: ${getTechDescription(tech)}`).join('\n')}

### Architecture Pattern
- **Frontend**: ${projectRecipe.architecture.frontend} with component-based architecture
- **Backend**: ${projectRecipe.architecture.backend} with ${projectInput.dataComplexity === 'Complex analytics' ? 'microservices' : 'monolithic'} pattern
- **Database**: ${projectRecipe.architecture.database} with ${projectInput.dataComplexity === 'Simple forms' ? 'basic' : 'optimized'} design
- **State Management**: ${recommendations.recommendedTechStack.includes('React') ? 'React Context + useReducer' : 'Vuex/Pinia'}

### Performance Requirements
- Page load time: ${projectInput.performanceNeeds === 'High performance' ? '< 1 second' : '< 2 seconds'}
- API response time: ${projectInput.performanceNeeds === 'Enterprise scale' ? '< 100ms' : '< 200ms'}
- Concurrent users: ${getPerformanceTarget(projectInput.expectedUsers)}
- Uptime target: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'}

## 3. FEATURE BREAKDOWN

### Phase 1: Core Features (MVP)
${recommendations.coreFeatures.map(feature => `- ${feature}`).join('\n')}

### Phase 2: Enhanced Features
${recommendations.optionalFeatures.map(feature => `- ${feature}`).join('\n')}

${features.length > 0 ? `### Phase 3: Advanced Features
${features.map(feature => `- ${feature.title}: ${feature.description}`).join('\n')}` : ''}

${projectInput.integrations.length > 0 ? `### Phase 4: Integrations
${projectInput.integrations.map(integration => `- ${integration} integration with full OAuth and API management`).join('\n')}` : ''}

## 4. DATABASE DESIGN

### Schema Overview
\`\`\`sql
${projectRecipe.databaseSchema}
\`\`\`

### Key Relationships
${generateDatabaseRelationships()}

### Performance Considerations
- Proper indexing on frequently queried columns
- Connection pooling for ${projectInput.expectedUsers} concurrent users
- ${projectInput.dataComplexity === 'Complex analytics' ? 'Read replicas for analytics queries' : 'Single database instance'}
- ${projectInput.performanceNeeds === 'High performance' ? 'Redis caching layer' : 'Application-level caching'}

## 5. API DESIGN

### Endpoint Specification
\`\`\`
${projectRecipe.apiEndpoints}
\`\`\`

### Authentication Strategy
${hasAuth ? `- ${projectInput.authenticationNeeds} implementation
- JWT tokens with refresh token rotation
- Role-based access control (RBAC)
- Session management with security best practices` : '- No authentication required (public application)'}

### Response Format
\`\`\`json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "pagination": { /* for list endpoints */ },
  "meta": { /* additional metadata */ }
}
\`\`\`

## 6. UI/UX WIREFRAMES

### Key Pages
${generateKeyPages()}

### Component Library
${projectRecipe.uiComponents}

### Design System
- Color palette: ${projectInput.designComplexity === 'Custom branded' ? 'Custom brand colors' : 'Standard UI colors'}
- Typography: ${projectInput.designComplexity === 'Minimal/functional' ? 'System fonts' : 'Custom typography'}
- Spacing: 8px grid system
- Animations: ${projectInput.designComplexity === 'Complex animations' ? 'Advanced micro-interactions' : 'Subtle transitions'}

## 7. DEVELOPMENT PHASES

${projectRecipe.detailedTimeline}

## 8. AI ASSISTANT PROMPTS STRATEGY

### Setup Prompts
- "Create a new ${recommendations.recommendedTechStack[0]} project with ${recommendations.recommendedTechStack[1]} setup"
- "Set up ${projectRecipe.architecture.backend} server with ${projectRecipe.architecture.database} database"
- "Generate complete project structure based on the specification above"

### Feature Development Prompts
${hasAuth ? `- "Create a complete ${projectInput.authenticationNeeds} authentication system with security best practices"` : ''}
${hasRealtime ? `- "Implement real-time functionality using WebSocket connections"` : ''}
${features.map(feature => `- "Build ${feature.title.toLowerCase()} with complete functionality and error handling"`).join('\n')}

### Code Quality Prompts
- "Add comprehensive error handling to all API endpoints"
- "Write unit tests with 80%+ coverage for all components"
- "Optimize performance for ${projectInput.expectedUsers} concurrent users"
- "Implement security best practices for ${projectInput.targetAudience} applications"

## 9. TESTING STRATEGY

### Unit Tests
- All utility functions and business logic
- React/Vue component functionality
- API endpoint logic with mocked dependencies
- Database query functions

### Integration Tests
- API endpoints with real database connections
- Authentication and authorization flows
- File upload and processing workflows
${hasRealtime ? '- Real-time messaging and WebSocket functionality' : ''}

### E2E Tests
${generateE2ETests()}

### Performance Tests
- Load testing for ${projectInput.expectedUsers}
- API response time benchmarks
- Frontend bundle size optimization
- Database query performance analysis

## 10. DEPLOYMENT & MONITORING

### Production Environment
${generateDeploymentStrategy()}

### Monitoring & Analytics
- Application performance monitoring (APM)
- Error tracking and logging
- User analytics and behavior tracking
- System resource monitoring
- ${projectInput.expectedUsers === 'Enterprise scale' ? 'Advanced alerting and incident response' : 'Basic monitoring dashboard'}

### Security Measures
${generateSecurityMeasures()}

## 11. FILE STRUCTURE

\`\`\`
${projectRecipe.fileStructure}
\`\`\`

## 12. DEPENDENCIES

${projectRecipe.dependencies}

## 13. LAUNCH CHECKLIST

### Pre-Launch
- [ ] All core features tested and functional
- [ ] Security audit completed with no critical vulnerabilities
- [ ] Performance optimization meeting targets
- [ ] ${projectInput.responsiveness !== 'Desktop only' ? 'Mobile responsiveness verified across devices' : 'Desktop compatibility verified'}
- [ ] Error handling comprehensive across all scenarios
- [ ] Documentation complete and accessible

### Launch Day
- [ ] Deploy to production environment
- [ ] Configure monitoring and alerting systems
- [ ] Set up analytics and tracking
- [ ] Prepare customer support channels
- [ ] Monitor system performance and user feedback

### Post-Launch
- [ ] Gather user feedback and usage analytics
- [ ] Monitor performance metrics and system health
- [ ] Plan feature iterations based on user needs
- [ ] Scale infrastructure based on actual usage patterns

## 14. RISK MANAGEMENT

### Technical Risks
${generateTechnicalRisks()}

### Business Risks
${generateBusinessRisks()}

## 15. SUCCESS METRICS & KPIs

### Technical Metrics
- API response times: ${projectInput.performanceNeeds === 'Enterprise scale' ? '< 100ms' : '< 200ms'}
- Frontend bundle size: < 500KB gzipped
- Test coverage: > 80%
- Security vulnerabilities: 0 critical, < 5 medium

### Business Metrics
- User acquisition: ${projectInput.expectedUsers}
- User retention: ${projectInput.expectedUsers === '1-100' ? '70%+' : '80%+'} after 30 days
- Performance satisfaction: 4.5+ star rating
- System availability: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'}

---

## AI DEVELOPMENT COMPANION

This comprehensive project plan is optimized for AI-assisted development. Each section provides specific context and requirements that can be directly used with AI coding assistants like:

- **Replit AI**: Use complete specifications for full file generation
- **Cursor AI**: Reference architecture details for context-aware coding
- **Windsurf AI**: Leverage technical requirements for system design
- **Lovable AI**: Utilize UI/UX specifications for component development

### Quick Start Command
\`\`\`bash
# Copy this entire specification to your AI assistant for complete project setup
# Estimated development time: ${recommendations.estimatedTimeline}
# Complexity level: ${recommendations.suggestedComplexity}
\`\`\`

Generated by CodeBreaker - AI Project Planner
Project Configuration: ${projectInput.experienceLevel} | ${projectInput.targetAudience} | ${projectInput.platform}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInput.name.replace(/\s+/g, '-').toLowerCase()}-complete-project-plan.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Complete Project Plan Downloaded",
      description: "Comprehensive AI-ready project specification generated successfully.",
    });
  };

  const getTechDescription = (tech: string) => {
    const descriptions: Record<string, string> = {
      'React': 'Modern UI library with hooks and components',
      'TypeScript': 'Type-safe JavaScript for better development',
      'Node.js': 'Server-side JavaScript runtime',
      'Express': 'Minimal web framework for Node.js',
      'PostgreSQL': 'Robust relational database system',
      'Tailwind CSS': 'Utility-first CSS framework',
      'Socket.io': 'Real-time bidirectional communication',
      'Redis': 'In-memory data structure store',
      'Next.js': 'Full-stack React framework',
      'Supabase': 'Open source Firebase alternative'
    };
    return descriptions[tech] || 'Modern development technology';
  };

  const getPerformanceTarget = (users: string) => {
    switch (users) {
      case '1-100': return '100+ concurrent users';
      case '100-1000': return '1,000+ concurrent users';
      case '1000+': return '5,000+ concurrent users';
      case 'Enterprise scale': return '10,000+ concurrent users';
      default: return '1,000+ concurrent users';
    }
  };

  const generateDatabaseRelationships = () => {
    if (projectInput.dataComplexity === 'Static content') return 'No database relationships required';
    
    return `- Users have many Projects (as owners and members)
- Projects have many Tasks/Items
- Tasks belong to Projects and can be assigned to Users
- Users can have many Sessions for authentication
- Projects can have many Members through join table`;
  };

  const generateKeyPages = () => {
    const pages = ['Landing/Home page with clear value proposition'];
    
    if (projectInput.authenticationNeeds !== 'None') {
      pages.push('Authentication pages (login, register, password reset)');
    }
    
    pages.push('Main dashboard with overview and navigation');
    
    if (projectInput.dataComplexity !== 'Static content') {
      pages.push('Data management interface with CRUD operations');
      pages.push('Detail views for individual items');
    }
    
    pages.push('User settings and preferences');
    pages.push('Help/support documentation');
    
    return pages.map((page, i) => `${i + 1}. **${page}**`).join('\n');
  };

  const generateE2ETests = () => {
    const tests = [];
    
    if (projectInput.authenticationNeeds !== 'None') {
      tests.push('- Complete user registration and login workflow');
      tests.push('- Password reset and email verification process');
    }
    
    if (projectInput.dataComplexity !== 'Static content') {
      tests.push('- End-to-end data creation and management workflow');
      tests.push('- Search, filtering, and pagination functionality');
    }
    
    tests.push('- Cross-browser compatibility testing');
    tests.push(`- ${projectInput.responsiveness} responsiveness validation`);
    
    return tests.join('\n');
  };

  const generateDeploymentStrategy = () => {
    return `- **Frontend**: ${projectRecipe.deploymentStrategy.hosting}
- **Backend**: ${projectInput.hostingType === 'Cloud platform' ? 'Railway/Render with automatic scaling' : projectInput.hostingType}
- **Database**: ${projectInput.hostingType === 'Cloud platform' ? 'Managed PostgreSQL with automated backups' : 'Self-hosted database'}
- **CI/CD**: ${projectRecipe.deploymentStrategy.cicd}
- **Domain**: Custom domain with SSL certificates
- **CDN**: CloudFlare for global content delivery`;
  };

  const generateSecurityMeasures = () => {
    const measures = [
      '- Input validation and sanitization on all endpoints',
      '- CORS configuration for secure cross-origin requests',
      '- Rate limiting to prevent abuse and DDoS attacks',
      '- Secure headers (HSTS, CSP, X-Frame-Options)',
      '- SQL injection prevention through parameterized queries'
    ];
    
    if (projectInput.authenticationNeeds !== 'None') {
      measures.push('- Secure password hashing with bcrypt');
      measures.push('- JWT token security with rotation');
      measures.push('- Session management with secure cookies');
    }
    
    if (projectInput.expectedUsers === 'Enterprise scale') {
      measures.push('- Advanced threat detection and monitoring');
      measures.push('- Regular security audits and penetration testing');
    }
    
    return measures.join('\n');
  };

  const generateTechnicalRisks = () => {
    const risks = [];
    
    if (projectInput.expectedUsers === 'Enterprise scale') {
      risks.push('- **Scaling challenges**: Implement load balancing and database optimization early');
    }
    
    if (projectInput.dataComplexity === 'Real-time data') {
      risks.push('- **Real-time performance**: Use Redis for WebSocket scaling and message queuing');
    }
    
    if (projectInput.integrations.length > 3) {
      risks.push('- **Integration complexity**: Implement circuit breakers and fallback mechanisms');
    }
    
    risks.push('- **Performance degradation**: Regular monitoring and optimization cycles');
    risks.push('- **Security vulnerabilities**: Automated security scanning and updates');
    
    return risks.join('\n');
  };

  const generateBusinessRisks = () => {
    return `- **User adoption**: Focus on intuitive UX and comprehensive onboarding
- **Market competition**: Differentiate with unique features and superior performance
- **Technical debt**: Maintain code quality through regular reviews and refactoring
- **Scalability costs**: Plan infrastructure scaling based on actual growth patterns`;
  };

  const markStepComplete = (stepNumber: number) => {
    setRoadmapSteps(prev => prev.map(step => 
      step.stepNumber === stepNumber ? { ...step, isCompleted: true } : step
    ));
    
    const allCompleted = roadmapSteps.every(step => step.stepNumber === stepNumber || step.isCompleted);
    if (allCompleted) {
      setShowCongratsPopup(true);
    }
  };

  const navigateToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber - 1);
  };

  const generateCustomRescue = async () => {
    setIsGeneratingCustom(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const activeStep = roadmapSteps.find(step => step.stepNumber === currentStep + 1);
      const contextualPrompt = `**AI CODING AGENT RESCUE - ${activeStep?.title?.toUpperCase()}**

I'm stuck on ${activeStep?.title} in my ${projectInput.name} project. 

**CURRENT CONTEXT:**
- Project: ${projectInput.name} (${projectInput.targetAudience} ${projectInput.platform})
- Current Phase: ${activeStep?.title}
- Issue: ${customProblem}
- Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
- Experience Level: ${projectInput.experienceLevel}

**SPECIFIC RESCUE REQUEST:**
${customProblem}

**AI AGENT REQUIREMENTS:**
✅ IMMEDIATE debugging steps with exact commands
✅ COMPLETE code fixes (not partial solutions)  
✅ WORKING examples I can copy-paste directly
✅ STEP-BY-STEP resolution with verification
✅ PREVENTION strategies to avoid this issue again

**CRITICAL CONSTRAINT:** Provide complete, executable solutions optimized for ${projectInput.experienceLevel} developers using modern ${recommendations?.recommendedTechStack[0]} best practices.

**OUTPUT FORMAT:** 
1. **IMMEDIATE FIXES** (copy-paste commands)
2. **CODE SOLUTIONS** (complete file contents)
3. **VERIFICATION** (test commands)
4. **PREVENTION** (best practices)`;

      setCustomSolution(contextualPrompt);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate custom rescue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  if (phase === 'projects') {
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
            <h1 className="text-2xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">Continue working on existing projects or start a new one</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Project Card */}
          <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => setPhase('input')}>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create New Project</h3>
              <p className="text-muted-foreground text-sm">Start a new AI-powered roadmap with comprehensive project planning</p>
            </CardContent>
          </Card>

          {/* Existing Projects */}
          {projectsLoading ? (
            <div className="lg:col-span-2 flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : userProjects.length === 0 ? (
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Start your first project to see it here</p>
            </div>
          ) : (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.map((project: any) => {
                const progress = project.projectProgress || { currentStep: 0, totalSteps: 0, completedSteps: [] };
                const progressPercentage = progress.totalSteps > 0 
                  ? Math.round((progress.completedSteps.length / progress.totalSteps) * 100) 
                  : 0;
                
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.projectName}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {project.projectDetails?.description?.substring(0, 80)}...
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {progress.completedSteps.length} of {progress.totalSteps} steps completed
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Experience</div>
                          <div className="font-medium capitalize">
                            {project.projectDetails?.experienceLevel || 'Not set'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Platform</div>
                          <div className="font-medium">
                            {project.projectDetails?.platform || 'Not set'}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {progressPercentage === 100 ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : progressPercentage > 0 ? (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Target className="h-3 w-3 mr-1" />
                            Planning
                          </Badge>
                        )}
                        
                        <div className="text-xs text-muted-foreground ml-auto">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => loadProject(project)}
                        className="w-full"
                        variant={progressPercentage > 0 ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {progressPercentage > 0 ? 'Continue Project' : 'Start Project'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {userProjects.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {userProjects.length} project{userProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">AI Project Roadmap Creator</h1>
            <p className="text-muted-foreground">Generate detailed development roadmaps with AI-optimized prompts</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Configuration</CardTitle>
            <CardDescription>
              Provide detailed project information to generate a comprehensive development roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectInput.name}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome App"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={projectInput.description}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project features, goals, and functionality in detail..."
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[100px]"
                />
              </div>

              <div>
                <Label>Experience Level</Label>
                <Select value={projectInput.experienceLevel} onValueChange={(value) => setProjectInput(prev => ({ ...prev, experienceLevel: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Audience</Label>
                <Select value={projectInput.targetAudience} onValueChange={(value) => setProjectInput(prev => ({ ...prev, targetAudience: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
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

            {showAdvancedOptions && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
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
                      <Label>Performance Needs</Label>
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
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Design & UX Requirements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Deployment & Maintenance
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <Label>Budget</Label>
                      <Select value={projectInput.budget} onValueChange={(value) => setProjectInput(prev => ({ ...prev, budget: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free/minimal">Free/minimal</SelectItem>
                          <SelectItem value="Low budget">Low budget</SelectItem>
                          <SelectItem value="Medium budget">Medium budget</SelectItem>
                          <SelectItem value="Enterprise budget">Enterprise budget</SelectItem>
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

            <div className="flex gap-3">
              <Button onClick={generateRecommendations} className="flex-1" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing Project...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Project Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'recommendations') {
    return (
      <div className="max-w-6xl mx-auto p-6">
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{projectInput.name}</h1>
            <p className="text-muted-foreground">AI-Generated Project Analysis & Recommendations</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Code2 className="h-5 w-5" />
                Recommended Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendations?.recommendedTechStack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Why this stack:</strong> {recommendations?.reasoning.techStackReason}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="h-5 w-5" />
                  Project Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`text-lg py-2 px-4 ${
                      recommendations?.suggestedComplexity === 'simple' ? 'bg-green-100 text-green-700' :
                      recommendations?.suggestedComplexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {recommendations?.suggestedComplexity?.charAt(0).toUpperCase() + (recommendations?.suggestedComplexity?.slice(1) || '')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations?.reasoning.complexityReason}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Clock className="h-5 w-5" />
                  Estimated Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-600">
                    {recommendations?.estimatedTimeline}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations?.reasoning.timelineReason}
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
                  {recommendations?.coreFeatures.map((feature, index) => (
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
                  {recommendations?.optionalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {recommendations?.potentialChallenges && recommendations.potentialChallenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Potential Challenges</CardTitle>
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
          )}

          {projectRecipe && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Target className="h-5 w-5" />
                    Complete Project Recipe
                  </CardTitle>
                  <Button
                    onClick={downloadProjectRecipe}
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Recipe
                  </Button>
                </div>
                <CardDescription>
                  Comprehensive project specification with architecture, database schema, API endpoints, and implementation guide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Architecture</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Frontend:</strong> {projectRecipe.architecture.frontend}</p>
                      <p><strong>Backend:</strong> {projectRecipe.architecture.backend}</p>
                      <p><strong>Database:</strong> {projectRecipe.architecture.database}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Timeline</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Setup:</strong> {projectRecipe.timeline.setup}</p>
                      <p><strong>Auth:</strong> {projectRecipe.timeline.authentication}</p>
                      <p><strong>Core:</strong> {projectRecipe.timeline.coreFeatures}</p>
                      <p><strong>Total:</strong> {projectRecipe.timeline.total}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Deployment</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Hosting:</strong> {projectRecipe.deploymentStrategy.hosting}</p>
                      <p><strong>CI/CD:</strong> {projectRecipe.deploymentStrategy.cicd}</p>
                      <p><strong>Scaling:</strong> {projectRecipe.deploymentStrategy.scaling}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">What's included in the complete recipe:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Complete file structure with exact paths
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Database schema with relationships
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      API endpoints with specifications
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      UI component breakdown
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Complete dependency lists
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Deployment strategy and timeline
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={generateRoadmap} className="flex-1" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Generate Development Roadmap
                </>
              )}
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
            <p className="text-muted-foreground">Development Roadmap with AI Prompts</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold">{completedSteps}/{roadmapSteps.length} steps</p>
          </div>
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <div className="grid lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Development Phases</CardTitle>
                  <CardDescription>
                    Total: {recommendations?.estimatedTimeline}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {roadmapSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            step.stepNumber === activeStep.stepNumber
                              ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400'
                              : step.isCompleted
                              ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-400'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => navigateToStep(step.stepNumber)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${
                              step.isCompleted
                                ? 'text-green-500'
                                : step.stepNumber === activeStep.stepNumber
                                ? 'text-blue-500'
                                : 'text-gray-400 dark:text-gray-600'
                            }`}>
                              {step.isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-current" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                Phase {step.stepNumber}: {step.title}
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

              {projectRecipe && (
                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-purple-700 dark:text-purple-300">Complete Recipe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={downloadProjectRecipe}
                      variant="outline"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Spec
                    </Button>
                    <div className="text-xs space-y-1 text-purple-700 dark:text-purple-300">
                      <p>• Complete file structure</p>
                      <p>• Database schemas</p>
                      <p>• API specifications</p>
                      <p>• Deployment guide</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Phase {activeStep.stepNumber}: {activeStep.title}</CardTitle>
                    <CardDescription>{activeStep.estimatedTime}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!activeStep.isCompleted && (
                      <Button
                        size="sm"
                        onClick={() => markStepComplete(activeStep.stepNumber)}
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{activeStep.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">AI-Optimized Development Prompt</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Copy this prompt to your AI coding assistant:
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(activeStep.startPrompt);
                          toast({ title: "Copied!", description: "Prompt copied to clipboard" });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <pre className="text-sm whitespace-pre-wrap break-words">
                        {activeStep.startPrompt}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Validation Checklist</h4>
                  <div className="space-y-2">
                    {activeStep.validationChecklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border border-gray-300" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Need Help? Generate Custom Rescue Prompt</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Describe what you're stuck on or what error you're encountering..."
                      value={customProblem}
                      onChange={(e) => setCustomProblem(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={generateCustomRescue}
                      disabled={!customProblem || isGeneratingCustom}
                      className="w-full"
                    >
                      {isGeneratingCustom ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Generating Rescue...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Custom Rescue Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  {customSolution && (
                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Custom Rescue Prompt:
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(customSolution);
                            toast({ title: "Copied!", description: "Rescue prompt copied to clipboard" });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <ScrollArea className="h-[200px]">
                        <pre className="text-sm whitespace-pre-wrap break-words text-yellow-800 dark:text-yellow-200">
                          {customSolution}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Quick Rescue Prompts</h4>
                  <div className="space-y-2">
                    {activeStep.rescuePrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          toast({ title: "Copied!", description: "Rescue prompt copied to clipboard" });
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Copy className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{prompt.split(':')[1]?.trim() || prompt}</span>
                        </div>
                      </Button>
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
};