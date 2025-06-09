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

interface ProjectRecipe {
  projectName: string;
  description: string;
  
  technicalArchitecture: {
    overview: string;
    components: {
      name: string;
      purpose: string;
      technologies: string[];
    }[];
    dataFlow: string;
    securityConsiderations: string;
  };
  
  fileStructure: {
    directory: string;
    purpose: string;
    files: {
      filename: string;
      purpose: string;
      dependencies: string[];
    }[];
  }[];
  
  databaseSchema: {
    database: string;
    tables: {
      name: string;
      purpose: string;
      fields: {
        name: string;
        type: string;
        constraints: string;
        description: string;
      }[];
      relationships: string[];
    }[];
    indexes: string[];
  };
  
  apiEndpoints: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    purpose: string;
    requestBody?: string;
    responseFormat: string;
    authentication: boolean;
    rateLimiting?: string;
  }[];
  
  implementationTimeline: {
    phase: string;
    duration: string;
    tasks: string[];
    deliverables: string[];
    dependencies: string[];
  }[];
  
  deploymentGuide: {
    environment: string;
    requirements: string[];
    steps: string[];
    configuration: string[];
  };
}

interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  phase: string;
  dependencies: number[];
  
  aiPrompt: {
    context: string;
    task: string;
    constraints: string[];
    examples: string[];
    validation: string[];
    troubleshooting: string[];
    expectedOutput: string;
    testingInstructions: string[];
    commonMistakes: string[];
    optimizationTips: string[];
  };
  
  rescuePrompts: string[];
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent?: string;
  notes?: string;
}

interface ProjectRoadmap {
  projectName: string;
  totalSteps: number;
  estimatedDuration: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  phases: {
    name: string;
    description: string;
    duration: string;
    steps: number[];
  }[];
  
  steps: RoadmapStep[];
  
  progressTracking: {
    completedSteps: number;
    currentPhase: string;
    timeSpent: string;
    estimatedRemaining: string;
  };
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
  const [projectRecipe, setProjectRecipe] = useState<ProjectRecipe | null>(null);
  const [projectRoadmap, setProjectRoadmap] = useState<ProjectRoadmap | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

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

  // PHASE 2: DETAILED RECIPE GENERATION
  const generateDetailedRecipe = async () => {
    if (!projectAnalysis) return;
    
    setIsGeneratingRecipe(true);
    
    try {
      // Simulate recipe generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const recipe = await createProjectRecipe(projectInput, projectAnalysis);
      setProjectRecipe(recipe);
      setCurrentPhase('recipe');
    } catch (error) {
      console.error('Recipe generation failed:', error);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const createProjectRecipe = async (input: ProjectInput, analysis: ProjectAnalysis): Promise<ProjectRecipe> => {
    const framework = analysis.techStackRecommendations.find(t => t.category === 'frontend')?.technology || 'React';
    const backend = analysis.techStackRecommendations.find(t => t.category === 'backend')?.technology || 'Node.js';
    const database = analysis.techStackRecommendations.find(t => t.category === 'database')?.technology || 'PostgreSQL';
    
    return {
      projectName: input.name,
      description: input.description,
      
      technicalArchitecture: {
        overview: `${input.name} follows a modern ${framework} frontend with ${backend} backend architecture. The system is designed for ${analysis.complexityRating.overall} developers and implements ${analysis.detectedFeatures.map(f => f.feature.toLowerCase()).join(', ')} functionality.`,
        components: [
          {
            name: 'Frontend Application',
            purpose: `${framework}-based user interface for ${input.name}`,
            technologies: [framework, 'CSS3', 'JavaScript/TypeScript']
          },
          {
            name: 'Backend API',
            purpose: `${backend} RESTful API server handling business logic`,
            technologies: [backend, 'Express.js', 'JWT Authentication']
          },
          {
            name: 'Database Layer',
            purpose: `${database} database for persistent data storage`,
            technologies: [database, 'Database Migrations', 'Query Optimization']
          },
          ...(analysis.detectedFeatures.some(f => f.feature.includes('Real-time')) ? [{
            name: 'Real-time Engine',
            purpose: 'WebSocket connections for live updates',
            technologies: ['Socket.io', 'WebSocket Protocol', 'Event Broadcasting']
          }] : []),
          ...(analysis.detectedFeatures.some(f => f.feature.includes('Payment')) ? [{
            name: 'Payment Processing',
            purpose: 'Secure payment handling and transaction management',
            technologies: ['Stripe API', 'Webhook Processing', 'PCI Compliance']
          }] : [])
        ],
        dataFlow: `Client requests → ${framework} Router → API Endpoints → ${backend} Controllers → ${database} Queries → Response Processing → Client Updates`,
        securityConsiderations: `Implement JWT authentication, HTTPS encryption, input validation, rate limiting, and ${analysis.detectedFeatures.some(f => f.feature.includes('Payment')) ? 'PCI-compliant payment processing' : 'secure data handling'}.`
      },
      
      fileStructure: generateFileStructure(input, analysis),
      databaseSchema: generateDatabaseSchema(input, analysis),
      apiEndpoints: generateAPIEndpoints(input, analysis),
      implementationTimeline: generateImplementationTimeline(input, analysis),
      deploymentGuide: generateDeploymentGuide(input, analysis)
    };
  };

  const generateFileStructure = (input: ProjectInput, analysis: ProjectAnalysis) => {
    const isNextJS = analysis.techStackRecommendations.some(t => t.technology.includes('Next.js'));
    
    return [
      {
        directory: '/',
        purpose: 'Project root directory',
        files: [
          { filename: 'package.json', purpose: 'Node.js dependencies and scripts', dependencies: [] },
          { filename: 'README.md', purpose: `${input.name} project documentation`, dependencies: [] },
          { filename: '.env.example', purpose: 'Environment variables template', dependencies: [] },
          { filename: '.gitignore', purpose: 'Git ignore patterns', dependencies: [] }
        ]
      },
      {
        directory: '/src',
        purpose: 'Source code directory',
        files: []
      },
      {
        directory: '/src/components',
        purpose: 'Reusable React components',
        files: [
          { filename: 'Header.jsx', purpose: 'Navigation header component', dependencies: ['react'] },
          { filename: 'Footer.jsx', purpose: 'Page footer component', dependencies: ['react'] },
          ...(analysis.detectedFeatures.some(f => f.feature.includes('User')) ? [
            { filename: 'LoginForm.jsx', purpose: 'User authentication form', dependencies: ['react', 'axios'] },
            { filename: 'UserProfile.jsx', purpose: 'User profile display', dependencies: ['react'] }
          ] : [])
        ]
      },
      {
        directory: '/src/pages',
        purpose: `${isNextJS ? 'Next.js pages' : 'Application views'}`,
        files: [
          { filename: 'Home.jsx', purpose: `${input.name} main page`, dependencies: ['react'] },
          ...(analysis.projectType === 'E-commerce Platform' ? [
            { filename: 'Products.jsx', purpose: 'Product listing page', dependencies: ['react', 'api'] },
            { filename: 'ProductDetail.jsx', purpose: 'Individual product page', dependencies: ['react', 'router'] }
          ] : []),
          ...(analysis.projectType === 'Task Management System' ? [
            { filename: 'Dashboard.jsx', purpose: 'Task dashboard', dependencies: ['react', 'state-management'] },
            { filename: 'TaskBoard.jsx', purpose: 'Kanban task board', dependencies: ['react', 'drag-drop'] }
          ] : [])
        ]
      },
      {
        directory: '/server',
        purpose: 'Backend server code',
        files: [
          { filename: 'index.js', purpose: 'Express server entry point', dependencies: ['express', 'cors'] },
          { filename: 'routes.js', purpose: 'API route definitions', dependencies: ['express', 'controllers'] },
          { filename: 'middleware.js', purpose: 'Custom middleware functions', dependencies: ['express'] }
        ]
      },
      {
        directory: '/server/models',
        purpose: 'Database models and schemas',
        files: [
          { filename: 'User.js', purpose: 'User data model', dependencies: ['database'] },
          ...(analysis.projectType === 'E-commerce Platform' ? [
            { filename: 'Product.js', purpose: 'Product data model', dependencies: ['database'] },
            { filename: 'Order.js', purpose: 'Order management model', dependencies: ['database', 'User'] }
          ] : []),
          ...(analysis.projectType === 'Task Management System' ? [
            { filename: 'Task.js', purpose: 'Task data model', dependencies: ['database', 'User'] },
            { filename: 'Project.js', purpose: 'Project organization model', dependencies: ['database'] }
          ] : [])
        ]
      },
      {
        directory: '/server/controllers',
        purpose: 'Business logic controllers',
        files: [
          { filename: 'authController.js', purpose: 'Authentication logic', dependencies: ['models', 'jwt'] },
          ...(analysis.projectType === 'E-commerce Platform' ? [
            { filename: 'productController.js', purpose: 'Product management logic', dependencies: ['models'] },
            { filename: 'orderController.js', purpose: 'Order processing logic', dependencies: ['models', 'payment'] }
          ] : [])
        ]
      }
    ];
  };

  const generateDatabaseSchema = (input: ProjectInput, analysis: ProjectAnalysis) => {
    const isPostgreSQL = analysis.techStackRecommendations.some(t => t.technology.includes('PostgreSQL'));
    
    const baseTables = [
      {
        name: 'users',
        purpose: 'Store user account information',
        fields: [
          { name: 'id', type: isPostgreSQL ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY', constraints: 'NOT NULL', description: 'Unique user identifier' },
          { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL', description: 'User email address' },
          { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Encrypted password' },
          { name: 'username', type: 'VARCHAR(100)', constraints: 'UNIQUE', description: 'Display name' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Account creation date' },
          { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Last profile update' }
        ],
        relationships: ['Has many sessions', 'Has many preferences']
      }
    ];

    // Add project-specific tables
    if (analysis.projectType === 'E-commerce Platform') {
      baseTables.push(
        {
          name: 'products',
          purpose: 'Store product catalog information',
          fields: [
            { name: 'id', type: isPostgreSQL ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY', constraints: 'NOT NULL', description: 'Product identifier' },
            { name: 'name', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Product name' },
            { name: 'description', type: 'TEXT', constraints: '', description: 'Product description' },
            { name: 'price', type: 'DECIMAL(10,2)', constraints: 'NOT NULL', description: 'Product price' },
            { name: 'category', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Product category' },
            { name: 'inventory_count', type: 'INTEGER', constraints: 'DEFAULT 0', description: 'Available quantity' },
            { name: 'sku', type: 'VARCHAR(50)', constraints: 'UNIQUE', description: 'Stock keeping unit' }
          ],
          relationships: ['Belongs to category', 'Has many order_items']
        },
        {
          name: 'orders',
          purpose: 'Store customer order information',
          fields: [
            { name: 'id', type: isPostgreSQL ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY', constraints: 'NOT NULL', description: 'Order identifier' },
            { name: 'user_id', type: 'INTEGER', constraints: 'FOREIGN KEY REFERENCES users(id)', description: 'Customer reference' },
            { name: 'total_amount', type: 'DECIMAL(10,2)', constraints: 'NOT NULL', description: 'Order total' },
            { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'pending\'', description: 'Order status' },
            { name: 'shipping_address', type: 'TEXT', constraints: '', description: 'Delivery address' }
          ],
          relationships: ['Belongs to user', 'Has many order_items']
        }
      );
    }

    if (analysis.projectType === 'Task Management System') {
      baseTables.push(
        {
          name: 'projects',
          purpose: 'Store project information',
          fields: [
            { name: 'id', type: isPostgreSQL ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY', constraints: 'NOT NULL', description: 'Project identifier' },
            { name: 'name', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Project name' },
            { name: 'description', type: 'TEXT', constraints: '', description: 'Project description' },
            { name: 'owner_id', type: 'INTEGER', constraints: 'FOREIGN KEY REFERENCES users(id)', description: 'Project owner' },
            { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Creation date' }
          ],
          relationships: ['Belongs to user', 'Has many tasks']
        },
        {
          name: 'tasks',
          purpose: 'Store task information',
          fields: [
            { name: 'id', type: isPostgreSQL ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY', constraints: 'NOT NULL', description: 'Task identifier' },
            { name: 'title', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Task title' },
            { name: 'description', type: 'TEXT', constraints: '', description: 'Task details' },
            { name: 'project_id', type: 'INTEGER', constraints: 'FOREIGN KEY REFERENCES projects(id)', description: 'Parent project' },
            { name: 'assigned_to', type: 'INTEGER', constraints: 'FOREIGN KEY REFERENCES users(id)', description: 'Assigned user' },
            { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'todo\'', description: 'Task status' },
            { name: 'priority', type: 'VARCHAR(20)', constraints: 'DEFAULT \'medium\'', description: 'Task priority' },
            { name: 'due_date', type: 'TIMESTAMP', constraints: '', description: 'Task deadline' }
          ],
          relationships: ['Belongs to project', 'Assigned to user']
        }
      );
    }

    return {
      database: isPostgreSQL ? 'PostgreSQL' : 'SQLite',
      tables: baseTables,
      indexes: [
        'CREATE INDEX idx_users_email ON users(email)',
        'CREATE INDEX idx_users_username ON users(username)',
        ...(analysis.projectType === 'E-commerce Platform' ? [
          'CREATE INDEX idx_products_category ON products(category)',
          'CREATE INDEX idx_orders_user ON orders(user_id)',
          'CREATE INDEX idx_orders_status ON orders(status)'
        ] : []),
        ...(analysis.projectType === 'Task Management System' ? [
          'CREATE INDEX idx_tasks_project ON tasks(project_id)',
          'CREATE INDEX idx_tasks_assigned ON tasks(assigned_to)',
          'CREATE INDEX idx_tasks_status ON tasks(status)'
        ] : [])
      ]
    };
  };

  const generateAPIEndpoints = (input: ProjectInput, analysis: ProjectAnalysis) => {
    const baseEndpoints = [
      {
        endpoint: '/api/auth/register',
        method: 'POST' as const,
        purpose: 'Create new user account',
        requestBody: '{ email, password, username }',
        responseFormat: '{ success: boolean, user: object, token: string }',
        authentication: false
      },
      {
        endpoint: '/api/auth/login',
        method: 'POST' as const,
        purpose: 'Authenticate existing user',
        requestBody: '{ email, password }',
        responseFormat: '{ success: boolean, user: object, token: string }',
        authentication: false
      },
      {
        endpoint: '/api/user/profile',
        method: 'GET' as const,
        purpose: 'Get current user profile',
        responseFormat: '{ user: object, preferences: object }',
        authentication: true
      }
    ];

    // Add project-specific endpoints
    if (analysis.projectType === 'E-commerce Platform') {
      baseEndpoints.push(
        {
          endpoint: '/api/products',
          method: 'GET' as const,
          purpose: 'Get product listings with filtering',
          responseFormat: '{ products: array, pagination: object }',
          authentication: false,
          rateLimiting: '100 requests per minute'
        },
        {
          endpoint: '/api/products',
          method: 'POST' as const,
          purpose: 'Create new product (admin only)',
          requestBody: '{ name, description, price, category, inventory_count }',
          responseFormat: '{ success: boolean, product: object }',
          authentication: true
        },
        {
          endpoint: '/api/orders',
          method: 'POST' as const,
          purpose: 'Create new order',
          requestBody: '{ items: array, shipping_address: string }',
          responseFormat: '{ success: boolean, order: object, payment_intent: string }',
          authentication: true
        }
      );
    }

    if (analysis.projectType === 'Task Management System') {
      baseEndpoints.push(
        {
          endpoint: '/api/projects',
          method: 'GET' as const,
          purpose: 'Get user projects',
          responseFormat: '{ projects: array }',
          authentication: true
        },
        {
          endpoint: '/api/projects',
          method: 'POST' as const,
          purpose: 'Create new project',
          requestBody: '{ name, description }',
          responseFormat: '{ success: boolean, project: object }',
          authentication: true
        },
        {
          endpoint: '/api/tasks',
          method: 'GET' as const,
          purpose: 'Get tasks with filtering',
          responseFormat: '{ tasks: array, filters: object }',
          authentication: true
        },
        {
          endpoint: '/api/tasks',
          method: 'POST' as const,
          purpose: 'Create new task',
          requestBody: '{ title, description, project_id, assigned_to, due_date }',
          responseFormat: '{ success: boolean, task: object }',
          authentication: true
        }
      );
    }

    return baseEndpoints;
  };

  const generateImplementationTimeline = (input: ProjectInput, analysis: ProjectAnalysis) => {
    const basePhases = [
      {
        phase: 'Phase 1: Project Foundation',
        duration: '3-5 days',
        tasks: [
          'Set up development environment',
          'Initialize project structure',
          'Configure build tools and dependencies',
          'Set up version control and CI/CD'
        ],
        deliverables: [
          'Working development setup',
          'Project repository with initial structure',
          'Build and deployment pipeline'
        ],
        dependencies: []
      },
      {
        phase: 'Phase 2: Authentication & User Management',
        duration: '5-7 days',
        tasks: [
          'Implement user registration',
          'Build login/logout functionality',
          'Create user profile management',
          'Set up JWT authentication'
        ],
        deliverables: [
          'Complete authentication system',
          'User management interface',
          'Security middleware'
        ],
        dependencies: ['Phase 1']
      }
    ];

    // Add project-specific phases
    if (analysis.projectType === 'E-commerce Platform') {
      basePhases.push(
        {
          phase: 'Phase 3: Product Management',
          duration: '7-10 days',
          tasks: [
            'Create product catalog system',
            'Build product listing interface',
            'Implement search and filtering',
            'Add product detail pages'
          ],
          deliverables: [
            'Product management system',
            'Product browsing interface',
            'Search functionality'
          ],
          dependencies: ['Phase 2']
        },
        {
          phase: 'Phase 4: Shopping Cart & Checkout',
          duration: '8-12 days',
          tasks: [
            'Implement shopping cart functionality',
            'Integrate payment processing',
            'Build checkout flow',
            'Add order management'
          ],
          deliverables: [
            'Complete e-commerce functionality',
            'Payment processing system',
            'Order management interface'
          ],
          dependencies: ['Phase 3']
        }
      );
    }

    if (analysis.projectType === 'Task Management System') {
      basePhases.push(
        {
          phase: 'Phase 3: Project & Task Management',
          duration: '8-12 days',
          tasks: [
            'Create project management system',
            'Build task creation and editing',
            'Implement task assignment and tracking',
            'Add project collaboration features'
          ],
          deliverables: [
            'Project management interface',
            'Task tracking system',
            'Team collaboration features'
          ],
          dependencies: ['Phase 2']
        },
        {
          phase: 'Phase 4: Dashboard & Analytics',
          duration: '5-8 days',
          tasks: [
            'Build project dashboard',
            'Add progress tracking',
            'Implement reporting features',
            'Create data visualization'
          ],
          deliverables: [
            'Project dashboard',
            'Progress tracking system',
            'Analytics and reporting'
          ],
          dependencies: ['Phase 3']
        }
      );
    }

    basePhases.push({
      phase: 'Phase 5: Testing & Deployment',
      duration: '3-5 days',
      tasks: [
        'Comprehensive testing suite',
        'Performance optimization',
        'Security audit',
        'Production deployment'
      ],
      deliverables: [
        'Tested and optimized application',
        'Security-audited codebase',
        'Live production deployment'
      ],
      dependencies: [`Phase ${basePhases.length + 1}`]
    });

    return basePhases;
  };

  const generateDeploymentGuide = (input: ProjectInput, analysis: ProjectAnalysis) => {
    return {
      environment: 'Production Deployment',
      requirements: [
        'Node.js 18+ runtime environment',
        `${analysis.techStackRecommendations.find(t => t.category === 'database')?.technology || 'PostgreSQL'} database server`,
        'SSL certificate for HTTPS',
        'Domain name and DNS configuration',
        ...(analysis.detectedFeatures.some(f => f.feature.includes('Payment')) ? ['Stripe account and API keys'] : []),
        ...(analysis.detectedFeatures.some(f => f.feature.includes('File')) ? ['Cloud storage service (AWS S3/Cloudinary)'] : [])
      ],
      steps: [
        'Clone repository to production server',
        'Install dependencies with npm install --production',
        'Set up environment variables (.env file)',
        'Run database migrations',
        'Build frontend assets',
        'Configure reverse proxy (Nginx)',
        'Set up SSL certificates',
        'Start application with PM2 or similar process manager'
      ],
      configuration: [
        'Environment variables: DATABASE_URL, JWT_SECRET, NODE_ENV=production',
        ...(analysis.detectedFeatures.some(f => f.feature.includes('Payment')) ? ['Stripe API keys: STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY'] : []),
        'CORS configuration for production domain',
        'Rate limiting and security headers',
        'Database connection pooling',
        'Log management and monitoring setup'
      ]
    };
  };

  const downloadRecipe = () => {
    if (!projectRecipe) return;
    
    const recipeContent = formatRecipeAsMarkdown(projectRecipe);
    const blob = new Blob([recipeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectRecipe.projectName.replace(/\s+/g, '-').toLowerCase()}-recipe.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatRecipeAsMarkdown = (recipe: ProjectRecipe): string => {
    return `# ${recipe.projectName} - Technical Recipe

## Project Overview
${recipe.description}

## Technical Architecture

### Overview
${recipe.technicalArchitecture.overview}

### Components
${recipe.technicalArchitecture.components.map(comp => 
  `- **${comp.name}**: ${comp.purpose}\n  - Technologies: ${comp.technologies.join(', ')}`
).join('\n')}

### Data Flow
${recipe.technicalArchitecture.dataFlow}

### Security Considerations
${recipe.technicalArchitecture.securityConsiderations}

## File Structure

${recipe.fileStructure.map(dir => 
  `### ${dir.directory}\n${dir.purpose}\n\n${dir.files.map(file => 
    `- \`${file.filename}\`: ${file.purpose}`
  ).join('\n')}`
).join('\n\n')}

## Database Schema

**Database**: ${recipe.databaseSchema.database}

${recipe.databaseSchema.tables.map(table => 
  `### ${table.name} Table\n${table.purpose}\n\n**Fields:**\n${table.fields.map(field => 
    `- \`${field.name}\` (${field.type}): ${field.description}`
  ).join('\n')}\n\n**Relationships:** ${table.relationships.join(', ')}`
).join('\n\n')}

### Database Indexes
${recipe.databaseSchema.indexes.map(index => `- \`${index}\``).join('\n')}

## API Endpoints

${recipe.apiEndpoints.map(endpoint => 
  `### ${endpoint.method} ${endpoint.endpoint}\n${endpoint.purpose}\n\n- **Authentication**: ${endpoint.authentication ? 'Required' : 'None'}\n- **Request**: ${endpoint.requestBody || 'None'}\n- **Response**: ${endpoint.responseFormat}${endpoint.rateLimiting ? `\n- **Rate Limiting**: ${endpoint.rateLimiting}` : ''}`
).join('\n\n')}

## Implementation Timeline

${recipe.implementationTimeline.map(phase => 
  `### ${phase.phase}\n**Duration**: ${phase.duration}\n\n**Tasks:**\n${phase.tasks.map(task => `- ${task}`).join('\n')}\n\n**Deliverables:**\n${phase.deliverables.map(deliverable => `- ${deliverable}`).join('\n')}\n\n**Dependencies**: ${phase.dependencies.length ? phase.dependencies.join(', ') : 'None'}`
).join('\n\n')}

## Deployment Guide

**Environment**: ${recipe.deploymentGuide.environment}

### Requirements
${recipe.deploymentGuide.requirements.map(req => `- ${req}`).join('\n')}

### Deployment Steps
${recipe.deploymentGuide.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

### Configuration
${recipe.deploymentGuide.configuration.map(config => `- ${config}`).join('\n')}

---
*Generated by CodeBreaker Roadmap Creator*
`;
  };

  // PHASE 4: SOPHISTICATED PROMPT ENHANCEMENT
  const createEnhancedPrompt = (
    context: string,
    task: string,
    constraints: string[],
    examples: string[],
    validation: string[],
    troubleshooting: string[],
    stepType: string
  ) => ({
    context,
    task,
    constraints,
    examples,
    validation,
    troubleshooting,
    expectedOutput: `Completed ${stepType} implementation with:
- All required functionality working correctly
- Proper error handling and validation
- Clean, maintainable code structure
- Documentation and comments where needed`,
    testingInstructions: [
      'Test all implemented functionality manually',
      'Check for console errors in browser/terminal',
      'Verify all validation rules work correctly',
      'Test edge cases and error scenarios'
    ],
    commonMistakes: [
      'Implementing features beyond the current step scope',
      'Skipping proper error handling and validation',
      'Not testing the implementation thoroughly',
      'Proceeding to next steps before current step works'
    ],
    optimizationTips: [
      'Follow coding best practices and conventions',
      'Add helpful comments for complex logic',
      'Use proper naming conventions for variables/functions',
      'Keep code modular and reusable where possible'
    ]
  });

  // PHASE 3: GRANULAR ROADMAP BREAKDOWN
  const generateGranularRoadmap = async () => {
    if (!projectRecipe || !projectAnalysis) return;
    
    setIsGeneratingRoadmap(true);
    
    try {
      // Simulate roadmap generation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const roadmap = await createGranularRoadmap(projectInput, projectAnalysis, projectRecipe);
      setProjectRoadmap(roadmap);
      setCurrentPhase('roadmap');
    } catch (error) {
      console.error('Roadmap generation failed:', error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const createGranularRoadmap = async (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe
  ): Promise<ProjectRoadmap> => {
    const steps: RoadmapStep[] = [];
    let stepNumber = 1;

    // PHASE 1: PROJECT SETUP (2-4 steps)
    const setupSteps = generateSetupMicroSteps(input, analysis, recipe, stepNumber);
    steps.push(...setupSteps);
    stepNumber += setupSteps.length;

    // PHASE 2: AUTHENTICATION SYSTEM (3-5 steps)
    const authSteps = generateAuthMicroSteps(input, analysis, recipe, stepNumber);
    steps.push(...authSteps);
    stepNumber += authSteps.length;

    // PHASE 3: CORE FEATURES (5-12 steps based on project type)
    const coreSteps = generateCoreFeaturesSteps(input, analysis, recipe, stepNumber);
    steps.push(...coreSteps);
    stepNumber += coreSteps.length;

    // PHASE 4: ADVANCED FEATURES (2-6 steps based on detected features)
    const advancedSteps = generateAdvancedFeaturesSteps(input, analysis, recipe, stepNumber);
    steps.push(...advancedSteps);
    stepNumber += advancedSteps.length;

    // PHASE 5: TESTING & DEPLOYMENT (2-3 steps)
    const deploymentSteps = generateDeploymentSteps(input, analysis, recipe, stepNumber);
    steps.push(...deploymentSteps);

    const phases = [
      {
        name: 'Project Setup',
        description: 'Initialize development environment and project structure',
        duration: '1-2 days',
        steps: setupSteps.map(s => s.stepNumber)
      },
      {
        name: 'Authentication System',
        description: 'Implement user registration, login, and security',
        duration: '2-3 days',
        steps: authSteps.map(s => s.stepNumber)
      },
      {
        name: 'Core Features',
        description: `Build main ${analysis.projectType.toLowerCase()} functionality`,
        duration: '4-8 days',
        steps: coreSteps.map(s => s.stepNumber)
      },
      {
        name: 'Advanced Features',
        description: 'Add specialized features and integrations',
        duration: '2-5 days',
        steps: advancedSteps.map(s => s.stepNumber)
      },
      {
        name: 'Testing & Deployment',
        description: 'Test, optimize, and deploy the application',
        duration: '1-2 days',
        steps: deploymentSteps.map(s => s.stepNumber)
      }
    ];

    return {
      projectName: input.name,
      totalSteps: steps.length,
      estimatedDuration: `${Math.ceil(steps.length * 0.5)} - ${Math.ceil(steps.length * 0.8)} days`,
      difficultyLevel: analysis.complexityRating.overall,
      phases,
      steps,
      progressTracking: {
        completedSteps: 0,
        currentPhase: phases[0].name,
        timeSpent: '0 hours',
        estimatedRemaining: `${Math.ceil(steps.length * 0.6)} hours`
      }
    };
  };

  const generateSetupMicroSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => {
    const framework = analysis.techStackRecommendations.find(t => t.category === 'frontend')?.technology || 'React';
    const isNextJS = framework.includes('Next.js');
    
    return [
      {
        stepNumber: startNumber,
        title: `Initialize ${input.name} Project Structure`,
        description: `Set up the basic project structure and development environment for ${input.name}`,
        estimatedTime: '20 minutes',
        difficulty: 'easy' as const,
        phase: 'Project Setup',
        dependencies: [],
        aiPrompt: {
          context: `You are building "${input.name}" - a ${analysis.projectType.toLowerCase()}. The project uses ${framework} for frontend and ${analysis.techStackRecommendations.find(t => t.category === 'backend')?.technology || 'Node.js'} for backend.`,
          task: `Initialize the project structure for "${input.name}" using ${framework}${isNextJS ? ' with TypeScript' : ''}. Create ONLY the foundational structure - no features yet.`,
          constraints: [
            'ONLY create the initial project structure',
            'DO NOT add any features or components yet',
            'DO NOT install additional packages beyond the basic setup',
            'Focus on getting the development environment running',
            'Use exact folder structure from the technical recipe',
            'STOP after confirming dev server runs - do not proceed to next steps'
          ],
          examples: [
            isNextJS ? 
              'npx create-next-app@latest my-project --typescript --tailwind --eslint --app' :
              'npm create vite@latest my-project -- --template react-ts',
            'mkdir src/{components,pages,hooks,utils}',
            'mkdir server/{routes,models,middleware}',
            'Verify npm run dev starts on correct port'
          ],
          validation: [
            'Project folder structure matches requirements',
            'Development server starts without errors',
            'Basic routing works (shows default page)',
            'TypeScript compilation works if applicable',
            'All required directories exist'
          ],
          troubleshooting: [
            'If npm install fails: Clear cache with npm cache clean --force',
            'If port conflicts: Check if port 3000/5173 is already in use',
            'If TypeScript errors: Ensure tsconfig.json is properly configured',
            'If create command fails: Check Node.js version (requires 16+)',
            'If permission errors: Run with sudo or check directory permissions'
          ],
          expectedOutput: `A fully functional ${framework} project with:
- Clean project structure with src/, server/, and component folders
- Working development server accessible at localhost:3000 or 5173
- Default homepage displaying successfully
- No build errors or TypeScript issues
- All dependencies properly installed`,
          testingInstructions: [
            'Run npm run dev and verify server starts',
            'Open localhost:3000 (Next.js) or localhost:5173 (Vite) in browser',
            'Confirm default page loads without errors',
            'Check browser console for any JavaScript errors',
            'Verify hot reloading works by making a small text change'
          ],
          commonMistakes: [
            'Installing extra packages during setup (wait for next steps)',
            'Modifying default configuration files prematurely',
            'Creating components or features before basic structure is confirmed',
            'Skipping verification that dev server actually works',
            'Using wrong Node.js version or missing dependencies'
          ],
          optimizationTips: [
            'Use exact package manager recommended for the framework',
            'Enable TypeScript strict mode for better error catching',
            'Configure VS Code workspace settings for consistent formatting',
            'Set up proper .gitignore to exclude node_modules and build files'
          ]
        },
        rescuePrompts: [
          `**PROJECT SETUP RESCUE**: My ${input.name} project initialization is failing. Debug the setup process and get the development environment running.`
        ],
        isCompleted: false
      },
      {
        stepNumber: startNumber + 1,
        title: `Configure ${input.name} Development Environment`,
        description: 'Set up essential development tools, linting, and environment variables',
        estimatedTime: '15 minutes',
        difficulty: 'easy' as const,
        phase: 'Project Setup',
        dependencies: [startNumber],
        aiPrompt: {
          context: `${input.name} project structure is ready. Now configure the development environment with proper tooling and environment variables.`,
          task: 'Configure development environment with ESLint, Prettier, and environment variables setup.',
          constraints: [
            'ONLY configure development tools',
            'DO NOT add business logic or components',
            'Focus on code quality and environment setup',
            'Create .env.example with placeholder values'
          ],
          examples: [
            'Set up .eslintrc.json with recommended rules',
            'Configure prettier.config.js for consistent formatting',
            'Create .env.example with DATABASE_URL, JWT_SECRET placeholders',
            'Add git hooks for pre-commit linting'
          ],
          validation: [
            'ESLint runs without errors',
            'Prettier formats code consistently',
            '.env.example file exists with all required variables',
            'Git pre-commit hooks work'
          ],
          troubleshooting: [
            'If ESLint conflicts: Check for conflicting rules in config',
            'If Prettier not working: Verify VS Code extension is enabled',
            'If env variables not loading: Check .env file location and syntax'
          ],
          expectedOutput: `Development environment configured with:
- ESLint configuration file with proper rules
- Prettier configuration for consistent code formatting
- .env.example file with all required environment variables
- Git hooks for automated code quality checks`,
          testingInstructions: [
            'Run npm run lint to verify ESLint works',
            'Format a file to test Prettier integration',
            'Check .env.example contains all required variables',
            'Make a commit to test pre-commit hooks'
          ],
          commonMistakes: [
            'Conflicting ESLint and Prettier rules',
            'Missing environment variables in .env.example',
            'Incorrect file paths in configuration',
            'Forgetting to install required dev dependencies'
          ],
          optimizationTips: [
            'Use shared ESLint configs for consistency',
            'Set up editor integration for real-time feedback',
            'Document all environment variables with descriptions',
            'Configure VS Code settings for automatic formatting'
          ]
        },
        rescuePrompts: [
          `**DEV ENVIRONMENT RESCUE**: My ${input.name} development environment configuration is broken. Fix ESLint, Prettier, and environment setup.`
        ],
        isCompleted: false
      }
    ];
  };

  const generateAuthMicroSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => {
    const database = analysis.techStackRecommendations.find(t => t.category === 'database')?.technology || 'PostgreSQL';
    
    return [
      {
        stepNumber: startNumber,
        title: `Create ${input.name} User Database Schema`,
        description: 'Set up user table and authentication-related database structure',
        estimatedTime: '25 minutes',
        difficulty: 'medium' as const,
        phase: 'Authentication System',
        dependencies: [startNumber - 1],
        aiPrompt: createEnhancedPrompt(
          `Building user authentication for ${input.name}. Use ${database} database with the exact schema from the technical recipe.`,
          'Create user table with proper fields for authentication and profile data.',
          [
            'ONLY create the user table and related auth tables',
            'DO NOT create application-specific tables yet',
            'Use exact field names and types from the recipe',
            'Include proper indexes for performance',
            'Add password hashing and security considerations'
          ],
          [
            'CREATE TABLE users (id, email, password_hash, username, created_at)',
            'Add unique constraints on email and username',
            'Create indexes on frequently queried fields',
            'Set up password hashing with bcrypt or similar'
          ],
          [
            'User table exists with all required fields',
            'Unique constraints work (no duplicate emails)',
            'Indexes are properly created',
            'Database connection works from application'
          ],
          [
            'If table creation fails: Check database connection string',
            'If constraints fail: Verify field types match requirements',
            'If permissions error: Ensure database user has CREATE privileges'
          ],
          'User Database Schema'
        ),
        rescuePrompts: [
          `**DATABASE SETUP RESCUE**: My ${input.name} user database schema creation is failing. Debug database connection and table creation.`
        ],
        isCompleted: false
      },
      {
        stepNumber: startNumber + 1,
        title: `Build ${input.name} Registration Form`,
        description: 'Create user registration form component with validation',
        estimatedTime: '30 minutes',
        difficulty: 'medium' as const,
        phase: 'Authentication System',
        dependencies: [startNumber],
        aiPrompt: {
          context: `Creating user registration for ${input.name}. Build a clean, accessible form component with proper validation.`,
          task: 'Create registration form component with email, username, password fields and client-side validation.',
          constraints: [
            'ONLY create the registration form component',
            'DO NOT implement backend API yet',
            'Focus on form validation and user experience',
            'Use controlled components with React hooks',
            'Add password strength validation'
          ],
          examples: [
            'Use useState for form data: {email, username, password, confirmPassword}',
            'Add email format validation with regex',
            'Implement password strength checking',
            'Show validation errors in real-time',
            'Make form accessible with proper labels and ARIA attributes'
          ],
          validation: [
            'Form renders correctly with all fields',
            'Email validation works (format checking)',
            'Password strength indicator shows',
            'Form submission is prevented when invalid',
            'Error messages are clear and helpful'
          ],
          troubleshooting: [
            'If validation not working: Check regex patterns',
            'If form not submitting: Verify preventDefault() is called',
            'If styling issues: Check CSS class conflicts'
          ]
        },
        rescuePrompts: [
          `**REGISTRATION FORM RESCUE**: My ${input.name} registration form is broken. Fix validation, form handling, and user experience issues.`
        ],
        isCompleted: false
      },
      {
        stepNumber: startNumber + 2,
        title: `Implement ${input.name} Registration API`,
        description: 'Create backend endpoint for user registration with security',
        estimatedTime: '35 minutes',
        difficulty: 'medium' as const,
        phase: 'Authentication System',
        dependencies: [startNumber, startNumber + 1],
        aiPrompt: {
          context: `Building secure user registration API for ${input.name}. Handle password hashing, validation, and database operations.`,
          task: 'Create POST /api/auth/register endpoint with password hashing and user creation.',
          constraints: [
            'ONLY implement registration endpoint',
            'DO NOT add login or other auth endpoints yet',
            'Hash passwords with bcrypt before storing',
            'Validate all input data server-side',
            'Return appropriate HTTP status codes',
            'Never store plain text passwords'
          ],
          examples: [
            'app.post("/api/auth/register", async (req, res) => { ... })',
            'Use bcrypt.hash() with salt rounds 12',
            'Check for existing email/username before creating',
            'Return 409 for duplicate users, 201 for success',
            'Sanitize and validate all input fields'
          ],
          validation: [
            'Endpoint accepts POST requests to /api/auth/register',
            'Passwords are hashed before database storage',
            'Duplicate email/username returns proper error',
            'Successful registration returns user data (no password)',
            'Input validation prevents SQL injection'
          ],
          troubleshooting: [
            'If bcrypt errors: Ensure bcrypt is properly installed',
            'If database errors: Check connection and table structure',
            'If validation fails: Verify request body parsing middleware'
          ]
        },
        rescuePrompts: [
          `**REGISTRATION API RESCUE**: My ${input.name} registration API endpoint is failing. Debug password hashing, validation, and database operations.`
        ],
        isCompleted: false
      },
      {
        stepNumber: startNumber + 3,
        title: `Create ${input.name} Login System`,
        description: 'Build login form and authentication endpoint with JWT tokens',
        estimatedTime: '40 minutes',
        difficulty: 'medium' as const,
        phase: 'Authentication System',
        dependencies: [startNumber + 2],
        aiPrompt: {
          context: `Completing authentication for ${input.name}. Create login form and API endpoint with JWT token generation.`,
          task: 'Build login form component and POST /api/auth/login endpoint with JWT token generation.',
          constraints: [
            'Create both login form AND login API endpoint',
            'Use JWT tokens for session management',
            'Verify passwords with bcrypt.compare()',
            'Store JWT token in localStorage or httpOnly cookies',
            'Add proper error handling for invalid credentials'
          ],
          examples: [
            'Login form: {email, password} with validation',
            'API: bcrypt.compare(password, user.password_hash)',
            'Generate JWT: jwt.sign({userId, email}, JWT_SECRET)',
            'Return token in response: {success: true, token, user}',
            'Store token: localStorage.setItem("token", token)'
          ],
          validation: [
            'Login form submits to API endpoint correctly',
            'Correct credentials return JWT token',
            'Invalid credentials return proper error message',
            'JWT token is stored and accessible',
            'Token includes user ID and expiration'
          ],
          troubleshooting: [
            'If JWT errors: Check JWT_SECRET environment variable',
            'If password comparison fails: Verify bcrypt version compatibility',
            'If token not storing: Check localStorage permissions in browser'
          ]
        },
        rescuePrompts: [
          `**LOGIN SYSTEM RESCUE**: My ${input.name} login form and API authentication is broken. Fix JWT generation, password verification, and token handling.`
        ],
        isCompleted: false
      }
    ];
  };

  const generateCoreFeaturesSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => {
    if (analysis.projectType === 'E-commerce Platform') {
      return generateEcommerceSteps(input, analysis, recipe, startNumber);
    } else if (analysis.projectType === 'Task Management System') {
      return generateTaskManagementSteps(input, analysis, recipe, startNumber);
    } else if (analysis.projectType === 'Content Management System') {
      return generateCMSSteps(input, analysis, recipe, startNumber);
    } else {
      return generateGenericSteps(input, analysis, recipe, startNumber);
    }
  };

  const generateEcommerceSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => [
    {
      stepNumber: startNumber,
      title: `Create ${input.name} Product Database Schema`,
      description: 'Set up product catalog tables with inventory tracking',
      estimatedTime: '30 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber - 1],
      aiPrompt: {
        context: `Building e-commerce product catalog for ${input.name}. Create comprehensive product database schema.`,
        task: 'Create products, categories, and inventory tables with proper relationships.',
        constraints: [
          'ONLY create product-related tables',
          'DO NOT create order or payment tables yet',
          'Include fields: name, description, price, SKU, inventory_count',
          'Add category system with hierarchical support',
          'Include product images array field'
        ],
        examples: [
          'CREATE TABLE products (id, name, description, price, sku, category_id, inventory_count, images)',
          'CREATE TABLE categories (id, name, parent_id, description)',
          'Add foreign key: products.category_id REFERENCES categories(id)',
          'Create indexes on: sku, category_id, price'
        ],
        validation: [
          'Product table exists with all required fields',
          'Category table supports hierarchical structure',
          'Foreign key relationships work correctly',
          'Indexes improve query performance'
        ],
        troubleshooting: [
          'If foreign key fails: Check category table exists first',
          'If price field issues: Use DECIMAL(10,2) for currency',
          'If array field fails: Use JSON type for images in some databases'
        ]
      },
      rescuePrompts: [
        `**PRODUCT DATABASE RESCUE**: My ${input.name} product database schema creation is failing. Debug table creation and relationships.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 1,
      title: `Build ${input.name} Product Form Component`,
      description: 'Create product creation and editing form with image upload',
      estimatedTime: '45 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber],
      aiPrompt: {
        context: `Creating product management interface for ${input.name}. Build comprehensive product form component.`,
        task: 'Create product form with fields: name, description, price, category, SKU, inventory, images.',
        constraints: [
          'ONLY create the product form component',
          'DO NOT implement API endpoints yet',
          'Include image URL input fields (multiple)',
          'Add category dropdown from categories',
          'Implement form validation for all fields',
          'Auto-generate SKU option'
        ],
        examples: [
          'useState for: {name, description, price, categoryId, sku, inventory, images: []}',
          'Price validation: must be positive number',
          'SKU generation: name + timestamp',
          'Image array: map over inputs with add/remove buttons',
          'Category dropdown: fetch from API or hardcode initially'
        ],
        validation: [
          'Form renders with all product fields',
          'Price validation prevents negative numbers',
          'SKU auto-generation works',
          'Multiple image URLs can be added/removed',
          'Category selection works correctly'
        ],
        troubleshooting: [
          'If price validation fails: Use parseFloat() and check isNaN()',
          'If image array issues: Use key prop in mapped inputs',
          'If category dropdown empty: Check data fetching logic'
        ]
      },
      rescuePrompts: [
        `**PRODUCT FORM RESCUE**: My ${input.name} product creation form is broken. Fix validation, image handling, and form functionality.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 2,
      title: `Implement ${input.name} Product Management API`,
      description: 'Create CRUD endpoints for product management',
      estimatedTime: '50 minutes',
      difficulty: 'hard' as const,
      phase: 'Core Features',
      dependencies: [startNumber, startNumber + 1],
      aiPrompt: {
        context: `Building product management API for ${input.name}. Implement full CRUD operations with validation.`,
        task: 'Create GET, POST, PUT, DELETE endpoints for products with search and filtering.',
        constraints: [
          'Implement ALL product CRUD operations',
          'Add search by name/description functionality',
          'Include category filtering',
          'Add pagination for product lists',
          'Validate all input data',
          'Handle inventory updates properly'
        ],
        examples: [
          'GET /api/products?search=&category=&page=1&limit=10',
          'POST /api/products with full validation',
          'PUT /api/products/:id for updates',
          'DELETE /api/products/:id with cascade considerations',
          'Search: WHERE name ILIKE %search% OR description ILIKE %search%'
        ],
        validation: [
          'All CRUD endpoints work correctly',
          'Search returns relevant products',
          'Category filtering works',
          'Pagination includes total count',
          'Input validation prevents invalid data'
        ],
        troubleshooting: [
          'If search not working: Check SQL LIKE syntax',
          'If pagination fails: Verify LIMIT/OFFSET calculations',
          'If validation errors: Check request body middleware'
        ]
      },
      rescuePrompts: [
        `**PRODUCT API RESCUE**: My ${input.name} product management API endpoints are failing. Debug CRUD operations, search, and validation.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 3,
      title: `Create ${input.name} Product Catalog Interface`,
      description: 'Build product listing page with search and category filters',
      estimatedTime: '55 minutes',
      difficulty: 'hard' as const,
      phase: 'Core Features',
      dependencies: [startNumber + 2],
      aiPrompt: {
        context: `Creating customer-facing product catalog for ${input.name}. Build responsive product grid with filtering.`,
        task: 'Create product listing page with grid layout, search bar, category filters, and pagination.',
        constraints: [
          'Create customer product browsing interface',
          'DO NOT add shopping cart functionality yet',
          'Include responsive grid layout',
          'Add search and filter functionality',
          'Show product images, names, prices',
          'Implement pagination controls'
        ],
        examples: [
          'Grid: CSS Grid or Flexbox with responsive columns',
          'Search: onChange handler with debouncing',
          'Filters: Category dropdown + price range',
          'Product cards: image, name, price, "View Details"',
          'Pagination: Previous/Next + page numbers'
        ],
        validation: [
          'Products display in responsive grid',
          'Search filters products in real-time',
          'Category filtering works correctly',
          'Pagination controls function properly',
          'Product images load and display correctly'
        ],
        troubleshooting: [
          'If grid layout breaks: Check CSS Grid browser support',
          'If search is slow: Add debouncing with setTimeout',
          'If images not loading: Verify image URL validation'
        ]
      },
      rescuePrompts: [
        `**PRODUCT CATALOG RESCUE**: My ${input.name} product catalog interface is broken. Fix grid layout, search, filtering, and pagination.`
      ],
      isCompleted: false
    }
  ];

  const generateTaskManagementSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => [
    {
      stepNumber: startNumber,
      title: `Create ${input.name} Project & Task Database Schema`,
      description: 'Set up projects and tasks tables with user relationships',
      estimatedTime: '35 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber - 1],
      aiPrompt: {
        context: `Building task management system for ${input.name}. Create comprehensive project and task database schema.`,
        task: 'Create projects and tasks tables with proper user relationships and status tracking.',
        constraints: [
          'ONLY create project and task tables',
          'Include task status: todo, in-progress, review, completed',
          'Add priority levels: low, medium, high, urgent',
          'Include due dates and time tracking',
          'Set up proper foreign key relationships'
        ],
        examples: [
          'CREATE TABLE projects (id, name, description, owner_id, created_at)',
          'CREATE TABLE tasks (id, title, description, project_id, assigned_to, status, priority, due_date)',
          'Foreign keys: tasks.project_id → projects.id, tasks.assigned_to → users.id',
          'Add indexes on: project_id, assigned_to, status, due_date'
        ],
        validation: [
          'Projects table exists with owner relationship',
          'Tasks table has all status and priority options',
          'Foreign key relationships work correctly',
          'Due date field accepts timestamp values'
        ],
        troubleshooting: [
          'If foreign key fails: Ensure users table exists first',
          'If enum values fail: Use VARCHAR with CHECK constraints',
          'If date issues: Use TIMESTAMP type for due_date'
        ]
      },
      rescuePrompts: [
        `**TASK DATABASE RESCUE**: My ${input.name} project and task database schema is failing. Debug table relationships and constraints.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 1,
      title: `Build ${input.name} Task Creation Form`,
      description: 'Create task creation form with project assignment and priorities',
      estimatedTime: '40 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber],
      aiPrompt: {
        context: `Creating task management interface for ${input.name}. Build comprehensive task creation form.`,
        task: 'Create task form with title, description, project selection, assignee, priority, due date.',
        constraints: [
          'ONLY create task creation form',
          'DO NOT implement API endpoints yet',
          'Include project dropdown selection',
          'Add priority radio buttons or dropdown',
          'Include due date picker',
          'Add assignee selection from team members'
        ],
        examples: [
          'useState: {title, description, projectId, assignedTo, priority, dueDate}',
          'Project dropdown: map over user projects',
          'Priority options: low, medium, high, urgent',
          'Date picker: HTML5 datetime-local input',
          'Assignee: dropdown of project team members'
        ],
        validation: [
          'Form renders with all task fields',
          'Project selection populates correctly',
          'Priority selection works',
          'Due date picker accepts valid dates',
          'Form validation prevents empty required fields'
        ],
        troubleshooting: [
          'If project dropdown empty: Check user projects API call',
          'If date picker not working: Use input type="datetime-local"',
          'If validation fails: Check required field attributes'
        ]
      },
      rescuePrompts: [
        `**TASK FORM RESCUE**: My ${input.name} task creation form is broken. Fix form fields, validation, and data handling.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 2,
      title: `Create ${input.name} Kanban Board Interface`,
      description: 'Build drag-and-drop task board with status columns',
      estimatedTime: '60 minutes',
      difficulty: 'hard' as const,
      phase: 'Core Features',
      dependencies: [startNumber + 1],
      aiPrompt: {
        context: `Building Kanban task board for ${input.name}. Create drag-and-drop interface with status columns.`,
        task: 'Create Kanban board with columns: To Do, In Progress, Review, Completed. Add drag-and-drop functionality.',
        constraints: [
          'Create visual Kanban board layout',
          'Implement drag-and-drop between columns',
          'Show tasks as cards with key information',
          'Update task status when moved between columns',
          'Include task priority visual indicators'
        ],
        examples: [
          'Columns: flex layout with 4 equal-width columns',
          'Task cards: title, assignee, due date, priority badge',
          'Drag-and-drop: use HTML5 drag API or library like react-dnd',
          'Status update: onDrop handler updates task status',
          'Priority colors: red=urgent, orange=high, yellow=medium, green=low'
        ],
        validation: [
          'Kanban board displays with 4 status columns',
          'Tasks render as draggable cards',
          'Drag-and-drop between columns works',
          'Task status updates when moved',
          'Priority indicators show correctly'
        ],
        troubleshooting: [
          'If drag-and-drop not working: Check dragover preventDefault()',
          'If status not updating: Verify API call on drop',
          'If layout breaks: Check CSS flexbox properties'
        ]
      },
      rescuePrompts: [
        `**KANBAN BOARD RESCUE**: My ${input.name} Kanban board drag-and-drop interface is broken. Fix dragging, status updates, and layout.`
      ],
      isCompleted: false
    }
  ];

  const generateCMSSteps = (input: ProjectInput, analysis: ProjectAnalysis, recipe: ProjectRecipe, startNumber: number): RoadmapStep[] => [
    {
      stepNumber: startNumber,
      title: `Create ${input.name} Content Database Schema`,
      description: 'Set up content/posts tables with categories and publishing workflow',
      estimatedTime: '30 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber - 1],
      aiPrompt: {
        context: `Building content management system for ${input.name}. Create content database schema with publishing workflow.`,
        task: 'Create posts, categories, and content tables with draft/published status.',
        constraints: [
          'ONLY create content-related tables',
          'Include post status: draft, published, archived',
          'Add category system for content organization',
          'Include SEO fields: meta title, description',
          'Add content versioning capability'
        ],
        examples: [
          'CREATE TABLE posts (id, title, content, excerpt, author_id, category_id, status, published_at)',
          'CREATE TABLE categories (id, name, slug, description)',
          'SEO fields: meta_title, meta_description, slug',
          'Add indexes on: status, category_id, published_at, slug'
        ],
        validation: [
          'Posts table exists with all content fields',
          'Category system works correctly',
          'Publishing status can be updated',
          'SEO fields are properly structured'
        ],
        troubleshooting: [
          'If text field too small: Use TEXT type for content',
          'If slug conflicts: Add unique constraint on slug',
          'If date issues: Use TIMESTAMP for published_at'
        ]
      },
      rescuePrompts: [
        `**CONTENT DATABASE RESCUE**: My ${input.name} content database schema creation is failing. Debug table structure and relationships.`
      ],
      isCompleted: false
    }
  ];

  const generateGenericSteps = (input: ProjectInput, analysis: ProjectAnalysis, recipe: ProjectRecipe, startNumber: number): RoadmapStep[] => [
    {
      stepNumber: startNumber,
      title: `Create ${input.name} Core Data Schema`,
      description: 'Set up main application data structures',
      estimatedTime: '25 minutes',
      difficulty: 'medium' as const,
      phase: 'Core Features',
      dependencies: [startNumber - 1],
      aiPrompt: {
        context: `Building core functionality for ${input.name}. Create main application data schema based on project requirements.`,
        task: 'Create primary data tables based on the project description and requirements.',
        constraints: [
          'ONLY create core application tables',
          'Base structure on project description keywords',
          'Include proper relationships and constraints',
          'Add necessary indexes for performance'
        ],
        examples: [
          'Analyze project description for main entities',
          'Create tables with appropriate fields',
          'Add foreign key relationships',
          'Include timestamps and status fields'
        ],
        validation: [
          'Core tables exist and are properly structured',
          'Relationships work correctly',
          'Data can be inserted and queried',
          'Indexes improve query performance'
        ],
        troubleshooting: [
          'If table creation fails: Check field type compatibility',
          'If relationships fail: Verify foreign key syntax',
          'If performance issues: Add appropriate indexes'
        ]
      },
      rescuePrompts: [
        `**CORE DATA RESCUE**: My ${input.name} core data schema creation is failing. Debug table structure and relationships.`
      ],
      isCompleted: false
    }
  ];

  const generateAdvancedFeaturesSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => {
    const steps: RoadmapStep[] = [];

    // Real-time features
    if (analysis.detectedFeatures.some(f => f.feature.includes('Real-time'))) {
      steps.push({
        stepNumber: startNumber + steps.length,
        title: `Add ${input.name} Real-time Updates`,
        description: 'Implement WebSocket connections for live data synchronization',
        estimatedTime: '45 minutes',
        difficulty: 'hard' as const,
        phase: 'Advanced Features',
        dependencies: [startNumber - 1],
        aiPrompt: {
          context: `Adding real-time functionality to ${input.name}. Implement WebSocket connections for live updates.`,
          task: 'Set up Socket.io for real-time communication between client and server.',
          constraints: [
            'ONLY implement real-time infrastructure',
            'Set up Socket.io on both client and server',
            'Create connection management',
            'Add basic event broadcasting',
            'Handle connection errors gracefully'
          ],
          examples: [
            'Server: const io = require("socket.io")(server)',
            'Client: import io from "socket.io-client"',
            'Events: io.emit("update", data) and socket.on("update", callback)',
            'Room management: socket.join(roomId)',
            'Error handling: connection, disconnect, error events'
          ],
          validation: [
            'WebSocket connections establish successfully',
            'Events can be sent and received',
            'Multiple clients can connect simultaneously',
            'Connection errors are handled properly'
          ],
          troubleshooting: [
            'If connection fails: Check CORS settings',
            'If events not received: Verify event names match',
            'If multiple connection issues: Implement connection pooling'
          ]
        },
        rescuePrompts: [
          `**REAL-TIME RESCUE**: My ${input.name} WebSocket/real-time functionality is broken. Fix Socket.io setup and event handling.`
        ],
        isCompleted: false
      });
    }

    // Payment processing
    if (analysis.detectedFeatures.some(f => f.feature.includes('Payment'))) {
      steps.push({
        stepNumber: startNumber + steps.length,
        title: `Integrate ${input.name} Payment Processing`,
        description: 'Set up Stripe payment integration with checkout flow',
        estimatedTime: '50 minutes',
        difficulty: 'hard' as const,
        phase: 'Advanced Features',
        dependencies: [startNumber - 1],
        aiPrompt: {
          context: `Adding payment processing to ${input.name}. Integrate Stripe for secure payment handling.`,
          task: 'Set up Stripe payment integration with checkout form and payment processing.',
          constraints: [
            'ONLY implement basic payment processing',
            'Use Stripe Elements for secure card input',
            'Create payment intent on server',
            'Handle successful and failed payments',
            'Never store card data directly'
          ],
          examples: [
            'npm install @stripe/stripe-js @stripe/react-stripe-js stripe',
            'Server: stripe.paymentIntents.create({amount, currency})',
            'Client: <CardElement> from Stripe Elements',
            'Confirm payment: stripe.confirmCardPayment(clientSecret)',
            'Webhook: stripe.webhooks.constructEvent for payment confirmation'
          ],
          validation: [
            'Stripe integration loads correctly',
            'Payment form accepts card details',
            'Payment processing completes successfully',
            'Failed payments show appropriate errors'
          ],
          troubleshooting: [
            'If Stripe not loading: Check public key configuration',
            'If payment fails: Verify secret key and webhook setup',
            'If amount errors: Ensure amount is in cents'
          ]
        },
        rescuePrompts: [
          `**PAYMENT INTEGRATION RESCUE**: My ${input.name} Stripe payment integration is failing. Debug payment processing and checkout flow.`
        ],
        isCompleted: false
      });
    }

    // File upload functionality
    if (analysis.detectedFeatures.some(f => f.feature.includes('File'))) {
      steps.push({
        stepNumber: startNumber + steps.length,
        title: `Add ${input.name} File Upload System`,
        description: 'Implement file upload with validation and storage',
        estimatedTime: '35 minutes',
        difficulty: 'medium' as const,
        phase: 'Advanced Features',
        dependencies: [startNumber - 1],
        aiPrompt: {
          context: `Adding file upload capability to ${input.name}. Implement secure file handling with validation.`,
          task: 'Create file upload component with drag-and-drop, validation, and storage.',
          constraints: [
            'ONLY implement file upload functionality',
            'Add file type and size validation',
            'Support drag-and-drop upload',
            'Show upload progress',
            'Handle upload errors gracefully'
          ],
          examples: [
            'Frontend: <input type="file" multiple> or drag-drop zone',
            'Validation: check file.type and file.size',
            'Upload: FormData with fetch() or axios',
            'Backend: multer middleware for file handling',
            'Storage: local storage or cloud service integration'
          ],
          validation: [
            'File upload interface works correctly',
            'File type and size validation prevents invalid uploads',
            'Upload progress shows for large files',
            'Files are stored securely on server'
          ],
          troubleshooting: [
            'If upload fails: Check Content-Type headers',
            'If large files timeout: Increase server timeout limits',
            'If validation not working: Check MIME type detection'
          ]
        },
        rescuePrompts: [
          `**FILE UPLOAD RESCUE**: My ${input.name} file upload system is broken. Fix upload handling, validation, and storage.`
        ],
        isCompleted: false
      });
    }

    return steps;
  };

  const generateDeploymentSteps = (
    input: ProjectInput, 
    analysis: ProjectAnalysis, 
    recipe: ProjectRecipe, 
    startNumber: number
  ): RoadmapStep[] => [
    {
      stepNumber: startNumber,
      title: `Test ${input.name} Application`,
      description: 'Comprehensive testing of all features and functionality',
      estimatedTime: '40 minutes',
      difficulty: 'medium' as const,
      phase: 'Testing & Deployment',
      dependencies: [startNumber - 1],
      aiPrompt: {
        context: `Testing ${input.name} before deployment. Perform comprehensive testing of all implemented features.`,
        task: 'Test all application functionality including user flows, API endpoints, and edge cases.',
        constraints: [
          'Test ALL implemented features systematically',
          'Check both happy path and error scenarios',
          'Verify responsive design on different screen sizes',
          'Test form validation and error handling',
          'Ensure data persistence works correctly'
        ],
        examples: [
          'User registration and login flow',
          'Core feature functionality (products, tasks, content)',
          'API endpoints with valid and invalid data',
          'Mobile responsiveness testing',
          'Error handling and validation messages'
        ],
        validation: [
          'All user flows work without errors',
          'API endpoints return correct responses',
          'Form validation catches all edge cases',
          'Application works on mobile devices',
          'Error messages are clear and helpful'
        ],
        troubleshooting: [
          'If tests fail: Check browser console for errors',
          'If API issues: Verify endpoint URLs and request format',
          'If mobile issues: Test CSS media queries'
        ]
      },
      rescuePrompts: [
        `**TESTING RESCUE**: My ${input.name} application testing is revealing bugs. Debug and fix all functionality issues.`
      ],
      isCompleted: false
    },
    {
      stepNumber: startNumber + 1,
      title: `Deploy ${input.name} to Production`,
      description: 'Deploy application to hosting platform with environment configuration',
      estimatedTime: '35 minutes',
      difficulty: 'medium' as const,
      phase: 'Testing & Deployment',
      dependencies: [startNumber],
      aiPrompt: {
        context: `Deploying ${input.name} to production. Set up hosting, environment variables, and domain configuration.`,
        task: 'Deploy application to production hosting platform with proper environment configuration.',
        constraints: [
          'ONLY deploy the tested application',
          'Set up production environment variables',
          'Configure domain and SSL if available',
          'Set up database in production environment',
          'Ensure security best practices'
        ],
        examples: [
          'Platform options: Vercel, Netlify, Railway, DigitalOcean',
          'Environment variables: DATABASE_URL, JWT_SECRET, API keys',
          'Build command: npm run build',
          'Start command: npm start',
          'Database: Set up production database instance'
        ],
        validation: [
          'Application loads correctly in production',
          'All environment variables are configured',
          'Database connections work in production',
          'SSL certificate is properly configured',
          'Domain routing works correctly'
        ],
        troubleshooting: [
          'If build fails: Check build logs for missing dependencies',
          'If database issues: Verify connection string format',
          'If SSL problems: Check domain DNS configuration'
        ]
      },
      rescuePrompts: [
        `**DEPLOYMENT RESCUE**: My ${input.name} production deployment is failing. Debug hosting, environment, and configuration issues.`
      ],
      isCompleted: false
    }
  ];

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
                onClick={generateDetailedRecipe}
                disabled={isGeneratingRecipe}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingRecipe ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate Detailed Recipe
                  </>
                )}
              </button>
              <button
                onClick={generateGranularRoadmap}
                disabled={isGeneratingRoadmap}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingRoadmap ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Development Roadmap
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 'recipe' && projectRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPhase('analysis')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Analysis
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Technical Recipe</h1>
                <p className="text-gray-600">Detailed specifications for "{projectRecipe.projectName}"</p>
              </div>
            </div>
            <button
              onClick={downloadRecipe}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Recipe
            </button>
          </div>

          {/* Recipe Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Technical Architecture */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Technical Architecture</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Overview</h3>
                    <p className="text-gray-600 text-sm">{projectRecipe.technicalArchitecture.overview}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Components</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projectRecipe.technicalArchitecture.components.map((component, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-sm">{component.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{component.purpose}</p>
                          <div className="flex flex-wrap gap-1">
                            {component.technologies.map((tech, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Data Flow</h3>
                    <p className="text-gray-600 text-sm font-mono bg-gray-50 p-3 rounded">
                      {projectRecipe.technicalArchitecture.dataFlow}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Security Considerations</h3>
                    <p className="text-gray-600 text-sm">{projectRecipe.technicalArchitecture.securityConsiderations}</p>
                  </div>
                </div>
              </div>

              {/* File Structure */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Code2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">File Structure</h2>
                </div>
                
                <div className="space-y-4">
                  {projectRecipe.fileStructure.map((directory, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{directory.directory}</span>
                        <span className="text-xs text-gray-500">{directory.purpose}</span>
                      </div>
                      
                      {directory.files.length > 0 && (
                        <div className="space-y-2">
                          {directory.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <span className="font-mono text-sm">{file.filename}</span>
                                <p className="text-xs text-gray-600">{file.purpose}</p>
                              </div>
                              {file.dependencies.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {file.dependencies.map((dep, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {dep}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Schema */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Database Schema</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Database: <span className="font-medium">{projectRecipe.databaseSchema.database}</span></p>
                  
                  {projectRecipe.databaseSchema.tables.map((table, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{table.name}</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{table.purpose}</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3">Field</th>
                              <th className="text-left py-2 px-3">Type</th>
                              <th className="text-left py-2 px-3">Constraints</th>
                              <th className="text-left py-2 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.fields.map((field, fieldIndex) => (
                              <tr key={fieldIndex} className="border-b border-gray-100">
                                <td className="py-2 px-3 font-mono">{field.name}</td>
                                <td className="py-2 px-3 font-mono text-xs">{field.type}</td>
                                <td className="py-2 px-3 text-xs">{field.constraints}</td>
                                <td className="py-2 px-3 text-xs text-gray-600">{field.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {table.relationships.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs font-medium">Relationships: </span>
                          <span className="text-xs text-gray-600">{table.relationships.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {projectRecipe.databaseSchema.indexes.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Database Indexes</h3>
                      <div className="space-y-1">
                        {projectRecipe.databaseSchema.indexes.map((index, i) => (
                          <code key={i} className="block text-xs bg-gray-50 p-2 rounded font-mono">
                            {index}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* API Endpoints */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold">API Endpoints</h2>
                </div>
                
                <div className="space-y-3">
                  {projectRecipe.apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-sm">{endpoint.endpoint}</code>
                        {endpoint.authentication && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Auth Required</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{endpoint.purpose}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {endpoint.requestBody && (
                          <div>
                            <span className="font-medium">Request:</span>
                            <code className="block bg-gray-50 p-2 rounded mt-1 font-mono">{endpoint.requestBody}</code>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Response:</span>
                          <code className="block bg-gray-50 p-2 rounded mt-1 font-mono">{endpoint.responseFormat}</code>
                        </div>
                      </div>
                      
                      {endpoint.rateLimiting && (
                        <p className="text-xs text-gray-500 mt-2">Rate Limiting: {endpoint.rateLimiting}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Implementation Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Implementation Timeline</h3>
                </div>
                
                <div className="space-y-4">
                  {projectRecipe.implementationTimeline.map((phase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{phase.phase}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{phase.duration}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Tasks:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {phase.tasks.slice(0, 3).map((task, i) => (
                              <li key={i}>• {task}</li>
                            ))}
                            {phase.tasks.length > 3 && (
                              <li className="text-gray-400">+ {phase.tasks.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Deliverables:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {phase.deliverables.map((deliverable, i) => (
                              <li key={i}>• {deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Guide */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Deployment</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Requirements</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {projectRecipe.deploymentGuide.requirements.slice(0, 4).map((req, i) => (
                        <li key={i}>• {req}</li>
                      ))}
                      {projectRecipe.deploymentGuide.requirements.length > 4 && (
                        <li className="text-gray-400">+ {projectRecipe.deploymentGuide.requirements.length - 4} more</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Steps</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {projectRecipe.deploymentGuide.steps.slice(0, 3).map((step, i) => (
                        <li key={i}>{i + 1}. {step}</li>
                      ))}
                      {projectRecipe.deploymentGuide.steps.length > 3 && (
                        <li className="text-gray-400">+ {projectRecipe.deploymentGuide.steps.length - 3} more steps</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Step */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Next Step</h3>
                <button
                  onClick={generateGranularRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Development Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 'roadmap' && projectRoadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPhase('recipe')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Recipe
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Development Roadmap</h1>
                <p className="text-gray-600">Step-by-step guide for "{projectRoadmap.projectName}"</p>
              </div>
            </div>
          </div>

          {/* Roadmap Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{projectRoadmap.totalSteps}</div>
                <p className="text-sm text-gray-600">Total Steps</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{projectRoadmap.estimatedDuration}</div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  projectRoadmap.difficultyLevel === 'beginner' ? 'text-green-600' :
                  projectRoadmap.difficultyLevel === 'intermediate' ? 'text-yellow-600' :
                  projectRoadmap.difficultyLevel === 'advanced' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {projectRoadmap.difficultyLevel.charAt(0).toUpperCase() + projectRoadmap.difficultyLevel.slice(1)}
                </div>
                <p className="text-sm text-gray-600">Difficulty Level</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{projectRoadmap.phases.length}</div>
                <p className="text-sm text-gray-600">Development Phases</p>
              </div>
            </div>
          </div>

          {/* Phase Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Development Phases</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {projectRoadmap.phases.map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <h3 className="font-medium text-sm">{phase.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{phase.duration}</p>
                  <p className="text-xs text-gray-500 mt-1">{phase.steps.length} steps</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Steps */}
          <div className="space-y-6">
            {projectRoadmap.phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{phaseIndex + 1}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{phase.name}</h2>
                    <p className="text-gray-600 text-sm">{phase.description}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {phase.duration}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {phase.steps.map(stepNumber => {
                    const step = projectRoadmap.steps.find(s => s.stepNumber === stepNumber);
                    if (!step) return null;

                    return (
                      <div key={step.stepNumber} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {/* Step Number */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              step.difficulty === 'easy' ? 'bg-green-500' :
                              step.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {step.stepNumber}
                            </div>
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{step.title}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {step.estimatedTime}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  step.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                  step.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {step.difficulty}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4">{step.description}</p>

                            {/* AI Prompt Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Brain className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-purple-800">AI Assistant Prompt</h4>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Context:</h5>
                                  <p className="text-sm text-gray-600 bg-white rounded p-2">{step.aiPrompt.context}</p>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Task:</h5>
                                  <p className="text-sm text-gray-600 bg-white rounded p-2">{step.aiPrompt.task}</p>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Constraints:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.constraints.map((constraint, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{constraint}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Examples:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.examples.map((example, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <code className="text-xs bg-gray-100 px-1 rounded">{example}</code>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Validation Checklist:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.validation.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">✓</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Troubleshooting:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.troubleshooting.map((tip, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">⚠</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Expected Output:</h5>
                                  <div className="text-sm text-gray-600 bg-white rounded p-2">
                                    {step.aiPrompt.expectedOutput}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Testing Instructions:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.testingInstructions.map((instruction, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">🧪</span>
                                        <span>{instruction}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Common Mistakes:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.commonMistakes.map((mistake, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">⚠</span>
                                        <span>{mistake}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Optimization Tips:</h5>
                                  <ul className="text-sm text-gray-600 bg-white rounded p-2 space-y-1">
                                    {step.aiPrompt.optimizationTips.map((tip, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">💡</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Rescue Prompts */}
                            <div className="bg-red-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <h5 className="text-sm font-medium text-red-800">Emergency Rescue Prompts</h5>
                              </div>
                              <div className="space-y-1">
                                {step.rescuePrompts.map((prompt, i) => (
                                  <div key={i} className="text-xs text-red-700 bg-white rounded p-2 font-mono">
                                    {prompt}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Dependencies */}
                            {step.dependencies.length > 0 && (
                              <div className="mt-3 text-xs text-gray-500">
                                <span className="font-medium">Dependencies:</span> Steps {step.dependencies.join(', ')} must be completed first
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Tracking Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projectRoadmap.progressTracking.completedSteps}/{projectRoadmap.totalSteps}
                </div>
                <p className="text-sm text-gray-600">Steps Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{projectRoadmap.progressTracking.currentPhase}</div>
                <p className="text-sm text-gray-600">Current Phase</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{projectRoadmap.progressTracking.timeSpent}</div>
                <p className="text-sm text-gray-600">Time Spent</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{projectRoadmap.progressTracking.estimatedRemaining}</div>
                <p className="text-sm text-gray-600">Estimated Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unexpected state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto text-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <button
          onClick={() => setCurrentPhase('input')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}