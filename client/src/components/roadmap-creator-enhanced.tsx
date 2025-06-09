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
  const [showCustomRescue, setShowCustomRescue] = useState(false);
  const [customProblem, setCustomProblem] = useState('');
  const [customSolution, setCustomSolution] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [projectRecipe, setProjectRecipe] = useState<any>(null);
  const [showRecipeDownload, setShowRecipeDownload] = useState(false);
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
      
      // Generate complete project recipe
      const recipe = generateProjectRecipe(projectInput, customRecommendations);
      setProjectRecipe(recipe);
      
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

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE authentication system - no partial implementations
✅ FULL login/register forms with working validation
✅ COMPLETE protected route system with redirect logic
✅ WORKING session management and user persistence
✅ COMPLETE password security (hashing, salting, validation)
✅ FULL user profile management interface

**AI CODING OPTIMIZATION STRATEGIES:**
- REPLIT AI: Provide complete file replacements, not snippets
- CURSOR AI: Include full context and complete implementations
- WINDSURF AI: Structure as complete, deployable modules
- LOVABLE AI: Focus on complete, visual components with full functionality

**TECHNICAL SPECIFICATIONS:**
1. Authentication Library: ${recommendations.recommendedTechStack.find(tech => tech.includes('Auth') || tech.includes('Passport') || tech.includes('Firebase')) || 'Firebase Auth/NextAuth/Passport'}
2. Session Storage: ${projectInput.dataComplexity.includes('Database') ? 'Database sessions' : 'JWT tokens'}
3. Security Level: Production-ready with ${projectInput.expectedUsers} user capacity
4. UI Framework: ${recommendations.recommendedTechStack.find(tech => tech.includes('React') || tech.includes('Vue') || tech.includes('Angular')) || 'React'}

**DELIVERABLE FORMAT:**
📁 Complete file structure with exact paths
🔧 Installation commands for dependencies
📄 Complete component files (no TODO comments)
⚙️ Configuration files with environment variables
🔒 Security middleware and route protection
📱 Responsive forms for ${projectInput.responsiveness}
🧪 Testing commands to verify functionality

**CRITICAL OUTPUT CONSTRAINT:** Every code block must be complete and immediately executable. No placeholders, no "implement later", no pseudo-code.
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

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE deployment configuration - no partial setups
✅ FULL CI/CD pipeline with working builds and tests
✅ COMPLETE environment and secrets management
✅ WORKING SSL/TLS and domain configuration
✅ COMPLETE database deployment with migrations
✅ FULL monitoring, logging, and alerting system
✅ COMPLETE backup and disaster recovery

**AI CODING OPTIMIZATION STRATEGIES:**
- REPLIT AI: Provide complete deployment files, not templates
- CURSOR AI: Include full production configuration context
- WINDSURF AI: Structure as complete infrastructure-as-code
- LOVABLE AI: Focus on complete, visual deployment dashboards

**DEPLOYMENT DELIVERABLES:**
📁 Complete deployment file structure
🐳 Production-ready Docker configurations
⚙️ Full CI/CD pipeline files (GitHub Actions/GitLab CI)
🔐 Complete environment and secrets setup
🌐 SSL certificate and domain configuration scripts
💾 Database deployment and migration automation
📊 Complete monitoring stack (logging, metrics, alerts)
🔄 Backup automation and disaster recovery procedures
💰 Cost optimization for ${projectInput.budget} budget
🚀 Auto-scaling configuration for ${projectInput.expectedUsers} users

**PLATFORM-SPECIFIC OPTIMIZATION:**
- ${projectInput.hostingType}: Complete infrastructure setup
- Performance: ${projectInput.performanceNeeds} tier configuration
- Maintenance: ${projectInput.maintenance} automation workflows
- Scaling: Auto-scaling for ${projectInput.expectedUsers} capacity

**CRITICAL OUTPUT CONSTRAINTS:**
🎯 Every configuration file must be complete and deployable
🎯 No placeholder values or TODO comments
🎯 Include exact commands and scripts
🎯 Provide verification steps for each component
🎯 Production-ready security and performance settings

**EXECUTION FORMAT:**
1. **INFRASTRUCTURE**: Complete hosting platform setup
2. **CI/CD**: Full pipeline configuration with testing
3. **DEPLOYMENT**: Production deployment scripts
4. **MONITORING**: Complete observability stack
5. **SECURITY**: SSL, secrets, and hardening
6. **VERIFICATION**: Step-by-step deployment testing`,
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
    setRoadmapSteps(prev => {
      const updated = prev.map(step => 
        step.stepNumber === stepNumber 
          ? { ...step, isCompleted: true }
          : step
      );
      
      // Check if all steps are completed
      const allCompleted = updated.every(step => step.isCompleted);
      if (allCompleted) {
        setShowCongratsPopup(true);
      }
      
      return updated;
    });
    
    if (stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const generateCustomRescuePrompt = () => {
    setIsGeneratingCustom(true);
    
    // Advanced prompting strategies for AI coding assistants
    const promptStrategies = {
      replit: "REPLIT AI AGENT INSTRUCTIONS",
      cursor: "CURSOR AI CODING INSTRUCTIONS", 
      windsurf: "WINDSURF AI DEVELOPMENT GUIDE",
      lovable: "LOVABLE AI BUILD INSTRUCTIONS"
    };

    const basePrompt = `🔧 ${promptStrategies.replit} | ${promptStrategies.cursor} | ${promptStrategies.windsurf} | ${promptStrategies.lovable}

**CRITICAL AI AGENT DIRECTIVE:** You are working with a professional developer who needs COMPLETE, EXECUTABLE code solutions. Do not provide incomplete snippets, pseudo-code, or placeholders.

**PROBLEM STATEMENT:**
${customProblem}

**PROJECT CONTEXT:**
- Project: ${projectInput.name}
- Current Development Phase: ${roadmapSteps[currentStep]?.title || 'Development Phase'}
- Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
- Experience Level: ${projectInput.experienceLevel}
- Target: ${projectInput.targetAudience} ${projectInput.platform}
- Scale: ${projectInput.expectedUsers} users
- Complexity: ${recommendations?.suggestedComplexity}

**AI CODING ASSISTANT OPTIMIZATION STRATEGIES:**

1. **COMPLETE FILE DELIVERY**: Provide full, working files that can be copied directly into the project
2. **CONTEXT AWARENESS**: Reference the existing tech stack and project structure
3. **PROGRESSIVE COMPLEXITY**: Build from simple to complex, ensuring each step works
4. **ERROR PREVENTION**: Include comprehensive error handling and edge cases
5. **PRODUCTION READY**: Code should be deployment-ready, not just proof-of-concept

**REQUIRED DELIVERABLES:**
✅ Complete, working code files (no partial implementations)
✅ Exact file paths and folder structure
✅ Installation commands for any new dependencies  
✅ Configuration files (if needed)
✅ Testing instructions to verify the solution works
✅ Integration steps with existing codebase

**AI AGENT EXECUTION FORMAT:**
1. **FILE STRUCTURE**: Show complete directory structure
2. **DEPENDENCIES**: List exact package.json additions or pip requirements
3. **CODE FILES**: Provide full, complete files with proper imports/exports
4. **CONFIGURATION**: Include environment variables, config files, etc.
5. **INTEGRATION**: Step-by-step instructions to integrate with existing code
6. **VERIFICATION**: Commands to test that the solution works

**OPTIMIZATION FOR AI CODING PLATFORMS:**
- REPLIT AI: Focus on complete file replacement and clear dependency management
- CURSOR AI: Emphasize context-aware suggestions and incremental improvements  
- WINDSURF AI: Provide comprehensive project-level guidance and architecture decisions
- LOVABLE AI: Structure for rapid iteration and visual component development

**CRITICAL SUCCESS FACTORS:**
🎯 Solution must be immediately executable
🎯 No TODO comments or incomplete implementations
🎯 Include all necessary imports and dependencies
🎯 Provide exact commands for testing
🎯 Consider ${projectInput.experienceLevel} developer experience level

**OUTPUT CONSTRAINT:** Every code block must be complete and ready to use. No placeholders, no "implement this later", no pseudo-code.`;

    setCustomSolution(basePrompt);
    setIsGeneratingCustom(false);
    
    toast({
      title: "Custom Rescue Prompt Generated!",
      description: "Advanced AI coding assistant prompt ready to copy",
    });
  };

  // Complete Project Recipe Generator
  const generateProjectRecipe = (input: ProjectInput, recommendations: Recommendations) => {
    const recipe = {
      overview: {
        name: input.name,
        description: input.description,
        techStack: recommendations.recommendedTechStack,
        estimatedTime: recommendations.estimatedTimeline,
        targetAudience: input.targetAudience,
        complexity: recommendations.suggestedComplexity,
        userScale: input.expectedUsers
      },
      architecture: {
        frontend: recommendations.recommendedTechStack.find(tech => 
          tech.includes('React') || tech.includes('Vue') || tech.includes('Angular')
        ) || 'React',
        backend: recommendations.recommendedTechStack.find(tech => 
          tech.includes('Node') || tech.includes('Express') || tech.includes('API')
        ) || 'Node.js + Express',
        database: recommendations.recommendedTechStack.find(tech => 
          tech.includes('SQL') || tech.includes('MongoDB') || tech.includes('Database')
        ) || 'PostgreSQL',
        authentication: input.authenticationNeeds,
        deployment: input.hostingType
      },
      fileStructure: generateFileStructure(input, recommendations),
      databaseSchema: generateDatabaseSchema(input),
      apiEndpoints: generateAPIEndpoints(input),
      uiComponents: generateUIComponents(input),
      dependencies: generateDependencies(recommendations),
      deploymentStrategy: generateDeploymentStrategy(input),
      timeline: generateDetailedTimeline(input, recommendations),
      challenges: recommendations.potentialChallenges
    };
    
    return recipe;
  };

  const generateFileStructure = (input: ProjectInput, recommendations: Recommendations) => {
    const framework = recommendations.recommendedTechStack.find(tech => 
      tech.includes('React') || tech.includes('Vue') || tech.includes('Next')
    );
    
    if (framework?.includes('Next')) {
      return {
        root: [
          'pages/',
          'components/',
          'lib/',
          'public/',
          'styles/',
          'api/',
          'utils/',
          'types/',
          'hooks/',
          'context/',
          'package.json',
          'next.config.js',
          'tsconfig.json',
          '.env.local'
        ],
        details: {
          'pages/': ['index.tsx', 'login.tsx', 'dashboard.tsx', '_app.tsx', '_document.tsx'],
          'components/': ['Header.tsx', 'Sidebar.tsx', 'Layout.tsx', 'ui/'],
          'api/': ['auth/', 'users/', 'data/'],
          'lib/': ['auth.ts', 'db.ts', 'utils.ts'],
          'types/': ['index.ts', 'api.ts', 'auth.ts']
        }
      };
    }
    
    return {
      root: [
        'src/',
        'public/',
        'server/',
        'package.json',
        'vite.config.ts',
        'tsconfig.json',
        '.env'
      ],
      details: {
        'src/': ['components/', 'pages/', 'hooks/', 'utils/', 'types/', 'App.tsx', 'main.tsx'],
        'components/': ['ui/', 'layout/', 'forms/', 'common/'],
        'server/': ['routes/', 'middleware/', 'models/', 'config/', 'index.ts'],
        'server/routes/': ['auth.ts', 'users.ts', 'api.ts'],
        'server/models/': ['User.ts', 'Session.ts']
      }
    };
  };

  const generateDatabaseSchema = (input: ProjectInput) => {
    const schemas = {
      users: {
        id: 'Primary Key (UUID/Int)',
        email: 'String (Unique)',
        password: 'String (Hashed)',
        name: 'String',
        createdAt: 'DateTime',
        updatedAt: 'DateTime',
        role: 'Enum (user, admin)',
        isActive: 'Boolean'
      }
    };

    if (input.targetAudience === 'B2B') {
      schemas.organizations = {
        id: 'Primary Key',
        name: 'String',
        domain: 'String',
        createdAt: 'DateTime',
        ownerId: 'Foreign Key → users.id'
      };
      schemas.users.organizationId = 'Foreign Key → organizations.id';
    }

    if (input.dataComplexity.includes('analytics')) {
      schemas.analytics = {
        id: 'Primary Key',
        userId: 'Foreign Key → users.id',
        event: 'String',
        properties: 'JSON',
        timestamp: 'DateTime'
      };
    }

    return schemas;
  };

  const generateAPIEndpoints = (input: ProjectInput) => {
    const endpoints = [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'User registration',
        body: '{ email, password, name }',
        response: '{ user, token }'
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'User authentication',
        body: '{ email, password }',
        response: '{ user, token }'
      },
      {
        method: 'GET',
        path: '/api/user/profile',
        description: 'Get user profile',
        auth: 'Required',
        response: '{ user }'
      }
    ];

    if (input.targetAudience === 'B2B') {
      endpoints.push({
        method: 'GET',
        path: '/api/organizations',
        description: 'List user organizations',
        auth: 'Required',
        response: '{ organizations[] }'
      });
    }

    return endpoints;
  };

  const generateUIComponents = (input: ProjectInput) => {
    const components = [
      'Layout/Header',
      'Layout/Sidebar', 
      'Layout/Footer',
      'Auth/LoginForm',
      'Auth/RegisterForm',
      'Common/Button',
      'Common/Input',
      'Common/Modal'
    ];

    if (input.designComplexity.includes('animations')) {
      components.push('Animations/PageTransition', 'Animations/LoadingSpinner');
    }

    if (input.responsiveness === 'Mobile first') {
      components.push('Mobile/BottomNav', 'Mobile/SwipeGestures');
    }

    return components;
  };

  const generateDependencies = (recommendations: Recommendations) => {
    const deps = {
      frontend: [],
      backend: [],
      development: []
    };

    if (recommendations.recommendedTechStack.includes('React')) {
      deps.frontend.push('react', 'react-dom', 'react-router-dom');
    }
    if (recommendations.recommendedTechStack.includes('TypeScript')) {
      deps.development.push('@types/react', '@types/node', 'typescript');
    }
    if (recommendations.recommendedTechStack.includes('Node.js')) {
      deps.backend.push('express', 'cors', 'helmet');
    }

    return deps;
  };

  const generateDeploymentStrategy = (input: ProjectInput) => {
    const strategy = {
      hosting: input.hostingType,
      cicd: 'GitHub Actions',
      monitoring: 'Basic logging',
      scaling: 'Manual',
      backup: 'Daily automated'
    };

    if (input.performanceNeeds === 'High performance') {
      strategy.scaling = 'Auto-scaling';
      strategy.monitoring = 'Advanced metrics + alerts';
    }

    return strategy;
  };

  const generateDetailedTimeline = (input: ProjectInput, recommendations: Recommendations) => {
    const baseHours = recommendations.suggestedComplexity === 'simple' ? 20 : 
                     recommendations.suggestedComplexity === 'medium' ? 40 : 60;
    
    return {
      setup: '2-4 hours',
      authentication: input.authenticationNeeds === 'None' ? '0 hours' : '4-8 hours',
      coreFeatures: `${Math.floor(baseHours * 0.6)}-${Math.floor(baseHours * 0.8)} hours`,
      testing: `${Math.floor(baseHours * 0.15)}-${Math.floor(baseHours * 0.2)} hours`,
      deployment: '4-8 hours',
      total: `${baseHours}-${baseHours + 20} hours`
    };
  };

  const downloadProjectRecipe = () => {
    if (!projectRecipe || !recommendations) return;
    
    const markdown = generateRecipeMarkdown(projectRecipe);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInput.name.replace(/\s+/g, '-').toLowerCase()}-project-recipe.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Recipe Downloaded!",
      description: "Complete project specification saved as markdown file",
    });
  };

  const generateRecipeMarkdown = (recipe: any) => {
    return `# ${recipe.overview.name} - Complete Project Recipe

## Project Overview
- **Description**: ${recipe.overview.description}
- **Target Audience**: ${recipe.overview.targetAudience}
- **User Scale**: ${recipe.overview.userScale}
- **Complexity**: ${recipe.overview.complexity}
- **Estimated Time**: ${recipe.overview.estimatedTime}

## Architecture
- **Frontend**: ${recipe.architecture.frontend}
- **Backend**: ${recipe.architecture.backend}
- **Database**: ${recipe.architecture.database}
- **Authentication**: ${recipe.architecture.authentication}
- **Deployment**: ${recipe.architecture.deployment}

## Tech Stack
${recipe.overview.techStack.map(tech => `- ${tech}`).join('\n')}

## File Structure
\`\`\`
${recipe.fileStructure.root.map(item => `${item}`).join('\n')}
\`\`\`

### Detailed Structure
${Object.entries(recipe.fileStructure.details).map(([folder, files]) => 
  `**${folder}**\n${Array.isArray(files) ? files.map(file => `- ${file}`).join('\n') : '- ' + files}`
).join('\n\n')}

## Database Schema
${Object.entries(recipe.databaseSchema).map(([table, fields]) => 
  `### ${table}\n${Object.entries(fields).map(([field, type]) => `- **${field}**: ${type}`).join('\n')}`
).join('\n\n')}

## API Endpoints
${recipe.apiEndpoints.map(endpoint => 
  `### ${endpoint.method} ${endpoint.path}\n- **Description**: ${endpoint.description}\n- **Body**: ${endpoint.body || 'None'}\n- **Response**: ${endpoint.response}\n- **Auth**: ${endpoint.auth || 'None'}`
).join('\n\n')}

## UI Components
${recipe.uiComponents.map(component => `- ${component}`).join('\n')}

## Dependencies
### Frontend
${recipe.dependencies.frontend.map(dep => `- ${dep}`).join('\n')}

### Backend
${recipe.dependencies.backend.map(dep => `- ${dep}`).join('\n')}

### Development
${recipe.dependencies.development.map(dep => `- ${dep}`).join('\n')}

## Timeline Breakdown
- **Setup**: ${recipe.timeline.setup}
- **Authentication**: ${recipe.timeline.authentication}
- **Core Features**: ${recipe.timeline.coreFeatures}
- **Testing**: ${recipe.timeline.testing}
- **Deployment**: ${recipe.timeline.deployment}
- **Total**: ${recipe.timeline.total}

## Deployment Strategy
- **Hosting**: ${recipe.deploymentStrategy.hosting}
- **CI/CD**: ${recipe.deploymentStrategy.cicd}
- **Monitoring**: ${recipe.deploymentStrategy.monitoring}
- **Scaling**: ${recipe.deploymentStrategy.scaling}
- **Backup**: ${recipe.deploymentStrategy.backup}

## Potential Challenges
${recipe.challenges.map(challenge => `- ${challenge}`).join('\n')}

---
*Generated by CodeBreaker AI Development Assistant*
`;
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

          {/* Complete Project Recipe */}
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
                    <ArrowLeft className="h-4 w-4 mr-2 rotate-90" />
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
          {/* Left Panel - Phase Overview */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Steps Overview */}
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

              {/* Project Recipe Quick Access */}
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
                      <ArrowLeft className="h-4 w-4 mr-2 rotate-90" />
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

          {/* Center Panel - Current Step Details */}
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
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <h4 className="font-semibold">Rescue Prompts</h4>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      AI Agent Ready
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Stuck on this step? These rescue prompts are pre-configured with your project context:
                  </p>
                  
                  <div className="space-y-3">
                    {activeStep.rescuePrompts?.map((rescuePrompt, index) => (
                      <Card key={index} className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-orange-900 dark:text-orange-100 text-sm mb-2">
                                Rescue Option {index + 1}
                              </h5>
                              <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg">
                                <pre className="text-xs whitespace-pre-wrap font-mono text-slate-100 leading-relaxed">
                                  {rescuePrompt}
                                  
{`
PROJECT CONTEXT:
- Name: ${projectInput.name}
- Current Step: ${activeStep.title}
- Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
- Experience Level: ${projectInput.experienceLevel}
- Target Audience: ${projectInput.targetAudience}
- Platform: ${projectInput.platform}
- Expected Users: ${projectInput.expectedUsers}
`}
                                </pre>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyPrompt(rescuePrompt + `

PROJECT CONTEXT:
- Name: ${projectInput.name}
- Current Step: ${activeStep.title}
- Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
- Experience Level: ${projectInput.experienceLevel}
- Target Audience: ${projectInput.targetAudience}
- Platform: ${projectInput.platform}
- Expected Users: ${projectInput.expectedUsers}
`)}
                              className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Custom Rescue Generator */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-purple-500" />
                      Custom Rescue Generator
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomRescue(!showCustomRescue)}
                      className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    >
                      {showCustomRescue ? 'Hide' : 'Create Custom Prompt'}
                    </Button>
                  </div>
                  
                  {showCustomRescue && (
                    <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <Label htmlFor="customProblem">Describe Your Specific Problem:</Label>
                          <Textarea
                            id="customProblem"
                            placeholder="e.g., My authentication isn't working, users can't log in, getting 401 errors..."
                            rows={3}
                            value={customProblem}
                            onChange={(e) => setCustomProblem(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        
                        <Button
                          onClick={generateCustomRescuePrompt}
                          disabled={!customProblem.trim() || isGeneratingCustom}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {isGeneratingCustom ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                              Generating Custom Prompt...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Generate AI-Optimized Rescue Prompt
                            </>
                          )}
                        </Button>
                        
                        {customSolution && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-medium">Your Custom AI Agent Prompt:</Label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyPrompt(customSolution)}
                                className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                              <pre className="text-xs whitespace-pre-wrap font-mono text-slate-100 leading-relaxed">
                                {customSolution}
                              </pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
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

        {/* Congratulations Popup */}
        {showCongratsPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 bg-white dark:bg-gray-900">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                  🎉 Project Complete!
                </CardTitle>
                <CardDescription className="text-lg">
                  Congratulations on finishing your {projectInput.name} roadmap!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You've successfully completed all {roadmapSteps.length} development steps. 
                  Your project is ready for the next phase!
                </p>
                
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Next Steps:
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-200 space-y-1 text-left">
                    <li>• Deploy your application to production</li>
                    <li>• Set up monitoring and analytics</li>
                    <li>• Gather user feedback</li>
                    <li>• Plan your next feature roadmap</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCongratsPopup(false)}
                    className="flex-1"
                  >
                    Continue Reviewing
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCongratsPopup(false);
                      onBack();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start New Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return null;
}