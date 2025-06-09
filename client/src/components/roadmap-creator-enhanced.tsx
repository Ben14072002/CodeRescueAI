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
import { ArrowLeft, CheckCircle, Clock, Code2, Lightbulb, Target, AlertTriangle, Copy, ChevronDown, ArrowRight, MapPin, Users, Zap, Wrench } from 'lucide-react';
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
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Enhanced custom analysis engine
  const generateCustomAnalysis = (input: ProjectInput): Recommendations => {
    let techStack: string[] = [];
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
    let complexityFactors: string[] = [];

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
      recommendedTechStack: Array.from(new Set(techStack)),
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
    if (!recommendations) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sophisticated roadmap steps with enhanced prompts
      const steps: RoadmapStep[] = [
        {
          stepNumber: 1,
          title: "Project Setup & Environment",
          description: `Initialize your ${projectInput.platform.toLowerCase()} project with ${recommendations.recommendedTechStack.slice(0, 3).join(', ')} stack.`,
          estimatedTime: "2-4 hours",
          isCompleted: false,
          dependencies: [],
          rescuePrompts: [
            "**AI CODING AGENT RESCUE - PROJECT SETUP**: My project setup is failing. Help me debug initialization errors, dependency conflicts, and build configuration issues. Provide complete diagnostic commands and fix implementations.",
            "**AI CODING AGENT RESCUE - BUILD ERRORS**: Fix all build configuration errors in my project. I need complete working configuration files and step-by-step resolution for TypeScript, bundler, and dependency issues.",
            "**AI CODING AGENT RESCUE - DEPENDENCY CONFLICTS**: Resolve all package dependency conflicts and version incompatibilities. Provide exact package.json updates and installation commands that work."
          ],
          startPrompt: `**AI CODING ASSISTANT PROMPT - PROJECT SETUP**

I need help setting up a new ${projectInput.targetAudience} ${projectInput.platform.toLowerCase()} project. Please act as an expert ${projectInput.experienceLevel} developer and provide COMPLETE, EXECUTABLE code and commands.

**PROJECT SPECIFICATIONS:**
- Project Name: ${projectInput.name}
- Target Users: ${projectInput.targetAudience} with ${projectInput.expectedUsers} expected users  
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Complexity Level: ${recommendations.suggestedComplexity}
- Design Requirements: ${projectInput.responsiveness}

**SPECIFIC TASKS FOR AI AGENT:**
1. Generate complete project initialization commands for ${recommendations.recommendedTechStack[0]} and ${recommendations.recommendedTechStack[1]}
2. Create full directory structure with all necessary folders
3. Write complete configuration files (package.json, tsconfig.json, etc.)
4. Set up routing system with example routes
5. Create starter components with proper TypeScript types
6. Generate .gitignore file with all necessary exclusions

**OUTPUT FORMAT REQUIRED:**
- Provide exact terminal commands that I can copy-paste
- Include complete file contents, not just snippets
- Add comments explaining each step for ${projectInput.experienceLevel} developers
- Structure response as: Commands → File Contents → Verification Steps

**IMPORTANT:** This is for a ${projectInput.targetAudience} application expecting ${projectInput.expectedUsers}, so ensure scalability and best practices are included from the start.`,
          validationChecklist: [
            "Project builds without errors",
            "Development server starts successfully",
            "Basic routing is functional",
            "Git repository is initialized"
          ]
        },
        {
          stepNumber: 2,
          title: `${projectInput.authenticationNeeds} Authentication System`,
          description: `Implement ${projectInput.authenticationNeeds.toLowerCase()} authentication for your ${projectInput.targetAudience} application.`,
          estimatedTime: "4-8 hours",
          isCompleted: false,
          dependencies: [1],
          rescuePrompts: [
            "**AI CODING AGENT RESCUE - AUTH FLOW**: My authentication system is broken. Debug login/logout issues, session management problems, and user state persistence. Provide complete working auth implementation.",
            "**AI CODING AGENT RESCUE - LOGIN ERRORS**: Fix all login/register functionality errors. I need complete working forms, validation, and user feedback with proper error handling.",
            "**AI CODING AGENT RESCUE - SESSION ISSUES**: Resolve session management and user persistence problems. Provide complete session handling code with security best practices."
          ],
          startPrompt: `**AI CODING ASSISTANT PROMPT - AUTHENTICATION SYSTEM**

I need you to implement a complete ${projectInput.authenticationNeeds} authentication system. Provide FULL, WORKING code that I can copy directly into my project.

**PROJECT CONTEXT:**
- App: ${projectInput.name} (${projectInput.targetAudience} application)
- Expected Users: ${projectInput.expectedUsers}
- Platform: ${projectInput.platform}
- Auth Type: ${projectInput.authenticationNeeds}
- Design Style: ${projectInput.designComplexity}

**REQUIRED DELIVERABLES:**
1. Complete authentication setup using ${recommendations.recommendedTechStack.find(tech => tech.includes('Auth') || tech.includes('Passport') || tech.includes('Firebase')) || 'modern auth library'}
2. Full login/register component code with form validation
3. Protected route implementation with redirect logic
4. User session management and persistence
5. Password security implementation (hashing, validation)
6. User profile management interface
7. Error handling for all auth scenarios

**AI AGENT INSTRUCTIONS:**
- Write complete, production-ready code files
- Include all imports and dependencies needed
- Add TypeScript types for everything
- Provide exact installation commands for packages
- Include CSS/styling for ${projectInput.designComplexity.toLowerCase()} design
- Add comprehensive error handling and user feedback
- Structure for ${projectInput.expectedUsers} scale

**CRITICAL:** Give me complete files I can copy-paste, not code snippets. Include file paths and explain integration steps clearly.`,
          validationChecklist: [
            "Users can register and login successfully",
            "Password validation is implemented",
            "Protected routes work correctly",
            "Session management is secure"
          ]
        },
        {
          stepNumber: 3,
          title: `${projectInput.dataComplexity} Implementation`,
          description: `Build the core data management system for ${projectInput.dataComplexity.toLowerCase()}.`,
          estimatedTime: "6-12 hours",
          isCompleted: false,
          dependencies: [1, 2],
          rescuePrompts: [
            "**AI CODING AGENT RESCUE - DATABASE**: My database connections and schema are failing. Debug connection issues, migration errors, and ORM problems. Provide complete working database setup.",
            "**AI CODING AGENT RESCUE - CRUD OPERATIONS**: Fix all CRUD operation errors and API endpoint issues. I need complete working database operations with proper error handling and validation.",
            "**AI CODING AGENT RESCUE - DATA VALIDATION**: Resolve data validation and schema problems. Provide complete validation schemas, error handling, and data integrity solutions."
          ],
          startPrompt: `**AI CODING ASSISTANT PROMPT - DATABASE & DATA MANAGEMENT**

Build a complete ${projectInput.dataComplexity} system for my application. I need COMPLETE, EXECUTABLE code that handles ${projectInput.expectedUsers} users efficiently.

**PROJECT REQUIREMENTS:**
- Application: ${projectInput.name} (${projectInput.targetAudience})
- Data Complexity: ${projectInput.dataComplexity}
- Database: ${recommendations.recommendedTechStack.find(tech => tech.includes('SQL') || tech.includes('MongoDB') || tech.includes('Database')) || 'modern database solution'}
- User Scale: ${projectInput.expectedUsers}
- Performance Needs: ${projectInput.performanceNeeds}

**COMPLETE IMPLEMENTATION NEEDED:**
1. Full database schema design with all tables/collections
2. Complete database setup and connection configuration
3. All CRUD operations with TypeScript interfaces
4. Data validation schemas and error handling
5. Database migrations and seeding scripts
6. API endpoints with full request/response handling
${projectInput.dataComplexity === 'Real-time data' ? '7. WebSocket implementation for real-time features' : ''}
${projectInput.dataComplexity === 'Complex analytics' ? '7. Analytics queries and aggregation pipelines' : ''}

**AI AGENT DELIVERABLES:**
- Complete database schema files
- Full ORM/ODM configuration (Prisma, Mongoose, etc.)
- All model definitions with relationships
- Complete API route files with validation
- Environment setup and configuration files
- Migration scripts and database seeders
- TypeScript types for all data structures

**OPTIMIZATION REQUIREMENTS:**
- Structure for ${projectInput.expectedUsers} scale
- Implement ${projectInput.performanceNeeds.toLowerCase()} performance optimizations
- Add proper indexing and query optimization
- Include connection pooling and caching strategies

**CRITICAL:** Provide complete, copy-paste ready code files with proper file structure and integration instructions.`,
          validationChecklist: [
            "Database schema is properly designed",
            "CRUD operations work correctly",
            "Data validation is implemented",
            "Performance is optimized for expected load"
          ]
        }
      ];

      // Add integration steps based on selected integrations
      if (projectInput.integrations.length > 0) {
        steps.push({
          stepNumber: steps.length + 1,
          title: "Third-party Integrations",
          description: `Integrate ${projectInput.integrations.join(', ')} into your application.`,
          estimatedTime: "4-6 hours per integration",
          isCompleted: false,
          dependencies: [1, 2, 3],
          rescuePrompts: [
            "**AI CODING AGENT RESCUE - API INTEGRATIONS**: My third-party API integrations are failing. Debug connection issues, authentication errors, and response handling problems. Provide complete working integration code.",
            "**AI CODING AGENT RESCUE - INTEGRATION AUTH**: Fix API authentication and authorization issues. I need complete working OAuth flows, API key management, and secure credential handling.",
            "**AI CODING AGENT RESCUE - RATE LIMITING**: Resolve API rate limiting and quota management problems. Provide complete rate limiting solutions with retry logic and error handling."
          ],
          startPrompt: `**AI CODING ASSISTANT PROMPT - THIRD-PARTY INTEGRATIONS**

Implement complete integrations for ${projectInput.integrations.join(', ')} in my ${projectInput.targetAudience} application. Provide FULL, WORKING integration code.

**INTEGRATION SPECIFICATIONS:**
- App: ${projectInput.name} (${projectInput.platform})
- Services: ${projectInput.integrations.join(', ')}
- Budget Tier: ${projectInput.budget}
- User Scale: ${projectInput.expectedUsers}
- Performance: ${projectInput.performanceNeeds}

**COMPLETE INTEGRATION TASKS:**
${projectInput.integrations.map((integration, index) => `${index + 1}. ${integration}: Full API setup, authentication, error handling, and UI components`).join('\n')}

**AI AGENT REQUIREMENTS:**
- Complete API service classes with all methods
- Full authentication setup (API keys, OAuth, webhooks)
- Error handling with retry logic and fallbacks
- Rate limiting and quota management implementation
- Complete UI components for each integration
- TypeScript interfaces for all API responses
- Environment configuration and secrets management
- Comprehensive testing setup and mock data

**DELIVERABLES NEEDED:**
- Complete service files for each integration
- Configuration files and environment setup
- UI components with loading states and error handling
- API wrapper classes with proper typing
- Integration test suites
- Documentation for API limits and best practices

**INTEGRATION-SPECIFIC OPTIMIZATIONS:**
- Handle ${projectInput.expectedUsers} concurrent users
- Implement ${projectInput.performanceNeeds.toLowerCase()} caching strategies
- Add monitoring and analytics for integration health
- Include cost optimization for ${projectInput.budget} budget

**CRITICAL:** Provide complete, production-ready code files that I can copy directly into my project with clear integration steps.`,
          validationChecklist: projectInput.integrations.map(integration => `${integration} is working correctly`)
        });
      }

      // Add deployment step
      steps.push({
        stepNumber: steps.length + 1,
        title: `${projectInput.hostingType} Deployment`,
        description: `Deploy your application to ${projectInput.hostingType.toLowerCase()} with proper CI/CD pipeline.`,
        estimatedTime: "3-6 hours",
        isCompleted: false,
        dependencies: projectInput.integrations.length > 0 ? [1, 2, 3, 4] : [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - DEPLOYMENT**: My production deployment is failing. Debug hosting issues, configuration errors, and environment problems. Provide complete working deployment scripts and fixes.",
          "**AI CODING AGENT RESCUE - CI/CD PIPELINE**: Fix all CI/CD pipeline failures and automation issues. I need complete working pipeline configurations and deployment automation.",
          "**AI CODING AGENT RESCUE - HOSTING CONFIG**: Resolve hosting platform configuration and domain setup problems. Provide complete hosting configuration with SSL, monitoring, and security setup."
        ],
        startPrompt: `**AI CODING ASSISTANT PROMPT - PRODUCTION DEPLOYMENT**

Deploy my ${projectInput.targetAudience} application to production. I need COMPLETE deployment configuration and scripts that I can execute immediately.

**DEPLOYMENT SPECIFICATIONS:**
- Application: ${projectInput.name} (${projectInput.platform})
- Hosting Platform: ${projectInput.hostingType}
- Expected Traffic: ${projectInput.expectedUsers}
- Performance Tier: ${projectInput.performanceNeeds}
- Budget Level: ${projectInput.budget}
- Maintenance Style: ${projectInput.maintenance}

**COMPLETE DEPLOYMENT PACKAGE NEEDED:**
1. Full hosting platform setup (${projectInput.hostingType.toLowerCase()})
2. Complete CI/CD pipeline configuration files
3. Environment variables and secrets management
4. SSL certificate setup and domain configuration
5. Database deployment and migration scripts
6. Monitoring, logging, and alerting setup
7. Backup and disaster recovery implementation
8. Performance optimization configuration

**AI AGENT DELIVERABLES:**
- Complete deployment scripts (Docker, terraform, etc.)
- CI/CD configuration files (GitHub Actions, GitLab CI, etc.)
- Environment setup guides with exact commands
- SSL and domain configuration instructions
- Database deployment and backup scripts
- Monitoring dashboard setup (analytics, error tracking)
- Security configuration and best practices
- Cost optimization strategies for ${projectInput.budget}

**PLATFORM-SPECIFIC REQUIREMENTS:**
- Optimize for ${projectInput.expectedUsers} concurrent users
- Configure ${projectInput.performanceNeeds.toLowerCase()} performance settings
- Set up ${projectInput.maintenance.toLowerCase()} maintenance workflows
- Include auto-scaling and load balancing if needed

**CRITICAL DELIVERABLES:**
- Complete, executable deployment scripts
- Step-by-step deployment checklist
- Rollback procedures and disaster recovery plans
- Cost monitoring and optimization setup
- Security hardening and compliance configuration

**OUTPUT FORMAT:** Provide complete configuration files, deployment scripts, and detailed step-by-step instructions that I can follow to deploy immediately.`,
        validationChecklist: [
          "Application is accessible via public URL",
          "SSL certificates are configured",
          "Environment variables are properly set",
          "CI/CD pipeline is working",
          "Monitoring is in place"
        ]
      });

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
            <h1 className="text-2xl font-bold">Custom Analysis Complete</h1>
            <p className="text-muted-foreground">Review your personalized project recommendations</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tech Stack Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Code2 className="h-5 w-5" />
                Recommended Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendations.recommendedTechStack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Why this stack:</strong> {recommendations.reasoning.techStackReason}
              </p>
            </CardContent>
          </Card>

          {/* Project Analysis */}
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
                      recommendations.suggestedComplexity === 'simple' ? 'bg-green-100 text-green-700' :
                      recommendations.suggestedComplexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {recommendations.suggestedComplexity.charAt(0).toUpperCase() + recommendations.suggestedComplexity.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations.reasoning.complexityReason}
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
                    {recommendations.estimatedTimeline}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations.reasoning.timelineReason}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features and Challenges */}
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
                            ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400'
                            : step.isCompleted
                            ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-400'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setCurrentStep(step.stepNumber - 1)}
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
                    Stuck on this step? Use the rescue generator to get custom prompts for your specific problem with pre-filled project context.
                  </p>
                </div>

                <Separator />

                {/* Validation Checklist */}
                <div>
                  <h4 className="font-semibold mb-3">Validation Checklist:</h4>
                  <div className="space-y-2">
                    {activeStep.validationChecklist?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox id={`check-${index}`} />
                        <Label htmlFor={`check-${index}`} className="text-sm">{item}</Label>
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