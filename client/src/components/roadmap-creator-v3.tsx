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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

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
                  onClick={() => setCurrentPhase('roadmap')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Create Development Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for roadmap phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto text-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Phase 3: Granular Roadmap Coming Soon</h2>
        <p className="text-gray-600 mb-8">
          Micro-step roadmap generation will be implemented in Phase 3
        </p>
        <button
          onClick={() => setCurrentPhase('recipe')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Back to Recipe
        </button>
      </div>
    </div>
  );
}