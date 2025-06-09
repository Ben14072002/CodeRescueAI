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
  Zap
} from "lucide-react";

interface RoadmapCreatorProps {
  onBack: () => void;
  onOpenRescue?: (context: string) => void;
}

type Phase = 'input' | 'recommendations' | 'customization' | 'roadmap';

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
  const [phase, setPhase] = useState<Phase>('input');
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
      fileStructure: generateFileStructure(input, recommendations),
      databaseSchema: generateDatabaseSchema(input),
      apiEndpoints: generateAPIEndpoints(input),
      uiComponents: generateUIComponents(input),
      dependencies: generateDependencies(recommendations),
      detailedTimeline: generateDetailedTimeline(input, recommendations)
    };
  };

  const generateFileStructure = (input: ProjectInput, recommendations: Recommendations) => {
    return `
project-root/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   └── layout/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── public/
├── tests/
├── docs/
└── deployment/
    ├── docker/
    ├── ci-cd/
    └── scripts/`;
  };

  const generateDatabaseSchema = (input: ProjectInput) => {
    if (input.dataComplexity === 'Static content') return 'No database required';
    
    return `
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Additional tables based on your project needs
-- Generated based on project description analysis`;
  };

  const generateAPIEndpoints = (input: ProjectInput) => {
    const endpoints = [];
    
    if (input.authenticationNeeds !== 'None') {
      endpoints.push('POST /api/auth/register');
      endpoints.push('POST /api/auth/login');
      endpoints.push('POST /api/auth/logout');
    }
    
    if (input.dataComplexity !== 'Static content') {
      endpoints.push('GET /api/data');
      endpoints.push('POST /api/data');
      endpoints.push('PUT /api/data/:id');
      endpoints.push('DELETE /api/data/:id');
    }
    
    return endpoints.join('\n');
  };

  const generateUIComponents = (input: ProjectInput) => {
    const components = [];
    
    components.push('Header/Navigation');
    components.push('Footer');
    components.push('Layout components');
    
    if (input.authenticationNeeds !== 'None') {
      components.push('Login form');
      components.push('Registration form');
      components.push('User profile');
    }
    
    if (input.dataComplexity !== 'Static content') {
      components.push('Data display components');
      components.push('Form components');
    }
    
    return components.join('\n');
  };

  const generateDependencies = (recommendations: Recommendations) => {
    return recommendations.recommendedTechStack.join(', ') + ', Testing libraries, Build tools';
  };

  const generateDetailedTimeline = (input: ProjectInput, recommendations: Recommendations) => {
    return `
Week 1: Project setup, basic structure, authentication
Week 2-3: Core feature development, database integration
Week 4: UI/UX implementation, testing
Week 5: Integration, optimization, deployment
Total: ${recommendations.estimatedTimeline}`;
  };

  const downloadProjectRecipe = () => {
    if (!projectRecipe || !recommendations) return;
    
    const content = `# ${projectInput.name} - Complete Project Recipe

## Project Overview
- **Name**: ${projectInput.name}
- **Description**: ${projectInput.description}
- **Target Audience**: ${projectInput.targetAudience}
- **Platform**: ${projectInput.platform}
- **Expected Users**: ${projectInput.expectedUsers}
- **Timeline**: ${recommendations.estimatedTimeline}

## Architecture
- **Frontend**: ${projectRecipe.architecture.frontend}
- **Backend**: ${projectRecipe.architecture.backend}
- **Database**: ${projectRecipe.architecture.database}

## File Structure
\`\`\`
${projectRecipe.fileStructure}
\`\`\`

## Database Schema
\`\`\`sql
${projectRecipe.databaseSchema}
\`\`\`

## API Endpoints
\`\`\`
${projectRecipe.apiEndpoints}
\`\`\`

## UI Components
${projectRecipe.uiComponents}

## Dependencies
${projectRecipe.dependencies}

## Timeline
${projectRecipe.detailedTimeline}

## Deployment Strategy
- **Hosting**: ${projectRecipe.deploymentStrategy.hosting}
- **CI/CD**: ${projectRecipe.deploymentStrategy.cicd}
- **Scaling**: ${projectRecipe.deploymentStrategy.scaling}

## Next Steps
1. Set up development environment
2. Initialize project with recommended tech stack
3. Follow the detailed roadmap for implementation
4. Test thoroughly before deployment
5. Deploy to production environment

---
Generated by CodeBreaker AI Project Planner
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInput.name.replace(/\s+/g, '-').toLowerCase()}-project-recipe.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Recipe Downloaded",
      description: "Complete project specification has been downloaded.",
    });
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
}