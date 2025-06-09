import { Bug, Code, Database, Lock, Palette, Server, Zap, Brain, Shield, Smartphone, Globe, Rocket, FileText, Search, BarChart } from "lucide-react";

export interface AIAgentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  prompts: {
    name: string;
    text: string;
    explanation: string;
  }[];
}

export const aiAgentTemplates: AIAgentTemplate[] = [
  {
    id: 'ai-debugging',
    title: 'AI Agent Debugging & Error Resolution',
    description: 'Complete debugging prompts optimized for Replit AI, Cursor, Windsurf & Lovable',
    category: 'Problem Solving',
    icon: Bug,
    color: 'text-red-600 dark:text-red-400',
    prompts: [
      {
        name: 'Complete Error Resolution',
        text: `**AI CODING ASSISTANT - DEBUG & FIX**

I have an error that needs complete resolution. Provide FULL, WORKING code fixes.

**ERROR DETAILS:**
- Stack Trace: [PASTE_COMPLETE_STACK_TRACE]
- Expected Behavior: [WHAT_SHOULD_HAPPEN]
- Current Behavior: [WHAT_IS_HAPPENING]
- Project Type: [REACT/NODE/FULLSTACK/etc]
- Framework: [NEXT.JS/EXPRESS/VITE/etc]

**REQUIRED OUTPUT:**
- Root cause analysis with explanation
- Complete fixed code files (not snippets)
- Step-by-step implementation instructions
- Testing verification steps
- Prevention strategies for future

**CRITICAL:** Provide complete, copy-paste ready code that resolves the issue entirely. Include all imports, types, and configuration needed.`,
        explanation: 'Optimized for AI coding agents to provide complete error resolution with working code.'
      },
      {
        name: 'Performance Debug & Optimize',
        text: `**AI CODING ASSISTANT - PERFORMANCE FIX**

My application has performance issues. I need complete optimization with working code.

**PERFORMANCE ISSUES:**
- Symptoms: [DESCRIBE_PERFORMANCE_PROBLEMS]
- Load Time: [CURRENT_LOAD_TIME]
- User Count: [NUMBER_OF_USERS]
- Platform: [WEB/MOBILE/DESKTOP]
- Tech Stack: [REACT/NODE/DATABASE/etc]

**OPTIMIZATION REQUIREMENTS:**
- Complete performance audit with metrics
- Full code optimizations with implementations
- Database query optimizations with examples
- Frontend performance improvements (lazy loading, code splitting)
- Caching strategies with complete code
- Bundle size optimizations

**DELIVER:** Complete optimized code files, configuration changes, performance monitoring setup, and before/after benchmarks.`,
        explanation: 'Designed for AI agents to provide comprehensive performance optimizations with complete implementations.'
      },
      {
        name: 'API Integration Debug',
        text: `**AI CODING ASSISTANT - API INTEGRATION FIX**

My API integration is broken. Provide complete working integration code.

**INTEGRATION DETAILS:**
- API Service: [API_NAME_AND_VERSION]
- Error Message: [EXACT_ERROR_MESSAGE]
- Request Details: [METHOD, ENDPOINT, PAYLOAD]
- Expected Response: [WHAT_SHOULD_BE_RETURNED]
- Authentication: [API_KEY/OAUTH/JWT/etc]

**COMPLETE SOLUTION NEEDED:**
- Full API service class with error handling
- Authentication setup and token management
- Request/response type definitions (TypeScript)
- Error handling and retry logic with exponential backoff
- Rate limiting and quota management
- Testing and validation code
- Environment configuration

**OUTPUT:** Complete, production-ready API integration files that I can copy directly into my project.`,
        explanation: 'Optimized for AI coding agents to deliver complete API integration solutions with full error handling.'
      }
    ]
  },
  {
    id: 'ai-authentication',
    title: 'AI Agent Authentication Systems',
    description: 'Complete authentication prompts for AI coding assistants',
    category: 'Authentication',
    icon: Lock,
    color: 'text-blue-500',
    prompts: [
      {
        name: 'Complete Auth System Implementation',
        text: `**AI CODING ASSISTANT - AUTHENTICATION SYSTEM**

Build a complete authentication system with all security features. Provide FULL, WORKING code.

**AUTH REQUIREMENTS:**
- Platform: [WEB/MOBILE/DESKTOP]
- User Scale: [EXPECTED_NUMBER_OF_USERS]
- Auth Type: [EMAIL/OAUTH/SOCIAL/ENTERPRISE]
- Framework: [REACT/NEXT/EXPRESS/etc]

**COMPLETE IMPLEMENTATION NEEDED:**
- User registration with email verification
- Secure login with password hashing (bcrypt/argon2)
- JWT token management (access + refresh tokens)
- Password reset functionality
- Protected routes and middleware
- User session management
- Security headers and CSRF protection

**DELIVERABLES:**
- Complete auth service files
- Frontend auth components with forms
- Backend API routes with validation
- Database schema and migrations
- Environment configuration
- TypeScript types for all auth data
- Testing setup with examples

**SECURITY FEATURES:**
- Rate limiting for login attempts
- Account lockout after failed attempts
- Secure password requirements
- Email verification flow
- Remember me functionality

**OUTPUT:** Complete, production-ready authentication system that I can copy into my project.`,
        explanation: 'Optimized for AI agents to deliver complete authentication systems with all security features.'
      },
      {
        name: 'OAuth Integration Setup',
        text: `**AI CODING ASSISTANT - OAUTH INTEGRATION**

Implement complete OAuth authentication with multiple providers. Provide FULL, WORKING code.

**OAUTH SPECIFICATIONS:**
- Providers: [GOOGLE/GITHUB/FACEBOOK/MICROSOFT/etc]
- Framework: [NEXT.JS/EXPRESS/FASTIFY/etc]
- Frontend: [REACT/NEXT/VANILLA/etc]
- Database: [POSTGRESQL/MYSQL/MONGODB/etc]

**COMPLETE OAUTH IMPLEMENTATION:**
- OAuth provider setup and configuration
- Complete authentication flow handling
- User account linking and creation
- Profile data synchronization
- Token refresh and management
- Error handling for OAuth failures
- Fallback authentication methods

**REQUIRED DELIVERABLES:**
- Complete OAuth service implementation
- Frontend OAuth buttons and handlers
- Backend OAuth callback routes
- User profile management
- Database schema for OAuth data
- Environment configuration setup
- TypeScript interfaces for all data

**INTEGRATION FEATURES:**
- Multiple provider support
- Account merging for existing users
- Profile picture and data import
- Automatic user creation
- Secure token storage

**OUTPUT:** Complete OAuth system with multiple providers that works immediately after configuration.`,
        explanation: 'Complete OAuth implementation with multiple providers and user management features.'
      }
    ]
  },
  {
    id: 'ai-database',
    title: 'AI Agent Database Operations',
    description: 'Database prompts optimized for AI coding assistants',
    category: 'Database',
    icon: Database,
    color: 'text-green-500',
    prompts: [
      {
        name: 'Complete Database Setup',
        text: `**AI CODING ASSISTANT - DATABASE IMPLEMENTATION**

Build a complete database system with all operations. Provide FULL, WORKING code.

**DATABASE REQUIREMENTS:**
- Database Type: [POSTGRESQL/MYSQL/MONGODB/etc]
- ORM/ODM: [PRISMA/DRIZZLE/MONGOOSE/etc]
- Data Complexity: [SIMPLE/MEDIUM/COMPLEX]
- Expected Scale: [NUMBER_OF_USERS]
- Framework: [NODE.JS/NEXT.JS/etc]

**COMPLETE DATABASE IMPLEMENTATION:**
- Database schema design with relationships
- Complete ORM/ODM setup and configuration
- All CRUD operations with validation
- Database migrations and seeding
- Query optimization and indexing
- Connection pooling and management
- Error handling and logging

**REQUIRED DELIVERABLES:**
- Complete database schema files
- ORM/ODM configuration and setup
- All model definitions with relationships
- CRUD service implementations
- API routes with validation
- Database migration scripts
- Seed data for testing
- TypeScript types for all data

**OPTIMIZATION FEATURES:**
- Database indexing strategy
- Query optimization techniques
- Connection pooling setup
- Caching implementation
- Performance monitoring

**OUTPUT:** Complete database system that handles all data operations efficiently.`,
        explanation: 'Complete database implementation with schema, operations, and optimization features.'
      },
      {
        name: 'Database Migration & Optimization',
        text: `**AI CODING ASSISTANT - DATABASE MIGRATION**

Implement database migrations and optimizations. Provide FULL, WORKING migration code.

**MIGRATION REQUIREMENTS:**
- Current Schema: [DESCRIBE_CURRENT_SCHEMA]
- Target Schema: [DESCRIBE_TARGET_SCHEMA]
- Data Volume: [AMOUNT_OF_DATA]
- Database: [POSTGRESQL/MYSQL/etc]
- Downtime Tolerance: [ZERO/MINIMAL/ACCEPTABLE]

**COMPLETE MIGRATION IMPLEMENTATION:**
- Safe migration scripts with rollback
- Data transformation and validation
- Index creation and optimization
- Performance monitoring during migration
- Zero-downtime migration strategies
- Data integrity verification
- Backup and recovery procedures

**DELIVERABLES NEEDED:**
- Complete migration script files
- Rollback scripts for safety
- Data validation queries
- Performance optimization queries
- Index creation strategies
- Monitoring and logging setup
- Testing procedures for migrations

**SAFETY FEATURES:**
- Transaction-based migrations
- Data integrity checks
- Performance impact monitoring
- Automatic rollback triggers
- Progress tracking and logging

**OUTPUT:** Complete, safe migration system with rollback capabilities and performance optimization.`,
        explanation: 'Safe database migration implementation with optimization and rollback capabilities.'
      }
    ]
  },
  {
    id: 'ai-frontend',
    title: 'AI Agent Frontend Development',
    description: 'Complete frontend prompts for AI coding assistants',
    category: 'Frontend',
    icon: Palette,
    color: 'text-purple-500',
    prompts: [
      {
        name: 'Complete React Component System',
        text: `**AI CODING ASSISTANT - REACT COMPONENT SYSTEM**

Build a complete React component system with state management. Provide FULL, WORKING code.

**COMPONENT REQUIREMENTS:**
- Framework: [REACT/NEXT.JS/REMIX/etc]
- Styling: [TAILWIND/STYLED-COMPONENTS/CSS-MODULES/etc]
- State Management: [ZUSTAND/REDUX/CONTEXT/etc]
- TypeScript: [YES/NO]
- UI Library: [SHADCN/MUI/CHAKRA/etc]

**COMPLETE COMPONENT IMPLEMENTATION:**
- Reusable component library with props
- State management setup and configuration
- Form handling with validation
- API integration with loading states
- Error handling and user feedback
- Responsive design implementation
- Dark mode support
- Accessibility features (ARIA, keyboard navigation)

**REQUIRED DELIVERABLES:**
- Complete component files with TypeScript
- State management store implementation
- Custom hooks for data fetching
- Form components with validation
- Loading and error state components
- Responsive layout components
- Theme provider and dark mode toggle
- Storybook or documentation

**ADVANCED FEATURES:**
- Component composition patterns
- Performance optimization (React.memo, useMemo)
- Code splitting and lazy loading
- SEO optimization
- Testing setup with examples

**OUTPUT:** Complete React component system that's production-ready and scalable.`,
        explanation: 'Complete React component system with state management, forms, and advanced features.'
      },
      {
        name: 'Frontend Performance Optimization',
        text: `**AI CODING ASSISTANT - FRONTEND OPTIMIZATION**

Optimize my frontend application for maximum performance. Provide COMPLETE optimization implementation.

**CURRENT PERFORMANCE:**
- Framework: [REACT/NEXT/VITE/etc]
- Bundle Size: [CURRENT_SIZE]
- Load Time: [CURRENT_LOAD_TIME]
- Performance Issues: [DESCRIBE_ISSUES]
- Target Metrics: [DESIRED_PERFORMANCE]

**COMPLETE OPTIMIZATION IMPLEMENTATION:**
- Bundle size optimization and code splitting
- Image optimization and lazy loading
- Font optimization and preloading
- Critical CSS extraction
- JavaScript optimization (tree shaking, minification)
- Caching strategies (browser, CDN, service worker)
- Performance monitoring setup

**REQUIRED DELIVERABLES:**
- Complete webpack/vite configuration
- Code splitting implementation
- Image optimization setup
- Font optimization configuration
- Service worker implementation
- Performance monitoring tools
- Lighthouse score improvements
- Core Web Vitals optimization

**OPTIMIZATION TECHNIQUES:**
- Dynamic imports for route-based splitting
- Component-level code splitting
- Resource preloading strategies
- Progressive image loading
- Virtual scrolling for large lists
- Debounced search and input handling

**OUTPUT:** Complete frontend optimization setup with measurable performance improvements.`,
        explanation: 'Complete frontend performance optimization with code splitting, caching, and monitoring.'
      }
    ]
  },
  {
    id: 'ai-deployment',
    title: 'AI Agent Deployment & DevOps',
    description: 'Complete deployment prompts for AI coding assistants',
    category: 'DevOps',
    icon: Zap,
    color: 'text-orange-500',
    prompts: [
      {
        name: 'Complete Production Deployment',
        text: `**AI CODING ASSISTANT - PRODUCTION DEPLOYMENT**

Deploy my application to production with complete DevOps setup. Provide FULL, WORKING deployment code.

**DEPLOYMENT REQUIREMENTS:**
- Platform: [VERCEL/NETLIFY/AWS/DIGITAL_OCEAN/etc]
- Application Type: [FULLSTACK/FRONTEND/BACKEND]
- Database: [POSTGRESQL/MYSQL/MONGODB/etc]
- Expected Traffic: [LOW/MEDIUM/HIGH]
- Budget: [FREE/LOW/MEDIUM/HIGH]

**COMPLETE DEPLOYMENT IMPLEMENTATION:**
- Production-ready build configuration
- Environment variable management
- Database deployment and migrations
- SSL certificate setup
- Domain configuration
- CI/CD pipeline setup
- Monitoring and logging
- Backup and disaster recovery

**REQUIRED DELIVERABLES:**
- Complete deployment scripts
- CI/CD pipeline configuration (GitHub Actions/GitLab CI)
- Environment setup guides
- Database deployment scripts
- SSL and domain configuration
- Monitoring dashboard setup
- Error tracking and alerting
- Performance monitoring tools

**DEVOPS FEATURES:**
- Automated testing in pipeline
- Blue-green deployment strategy
- Auto-scaling configuration
- Database backup automation
- Security scanning and updates
- Cost optimization setup

**OUTPUT:** Complete production deployment setup that's scalable and maintainable.`,
        explanation: 'Complete production deployment with CI/CD, monitoring, and DevOps best practices.'
      },
      {
        name: 'Docker & Container Deployment',
        text: `**AI CODING ASSISTANT - DOCKER DEPLOYMENT**

Containerize my application with Docker and deploy to production. Provide COMPLETE Docker setup.

**CONTAINERIZATION REQUIREMENTS:**
- Application: [NODE.JS/PYTHON/etc]
- Database: [POSTGRESQL/MYSQL/REDIS/etc]
- Platform: [DOCKER/KUBERNETES/DOCKER_COMPOSE]
- Environment: [DEVELOPMENT/STAGING/PRODUCTION]
- Orchestration: [DOCKER_SWARM/KUBERNETES/etc]

**COMPLETE DOCKER IMPLEMENTATION:**
- Multi-stage Dockerfile optimization
- Docker Compose for local development
- Production-ready container configuration
- Environment variable management
- Volume mounting and data persistence
- Network configuration and security
- Health checks and monitoring

**REQUIRED DELIVERABLES:**
- Optimized Dockerfile with best practices
- Docker Compose files for all environments
- Environment-specific configurations
- Database container setup
- Nginx reverse proxy configuration
- SSL certificate handling
- Logging and monitoring setup
- Deployment scripts and automation

**PRODUCTION FEATURES:**
- Container security hardening
- Resource limits and optimization
- Auto-restart and health checks
- Log aggregation and monitoring
- Backup and restore procedures
- Rolling updates and zero downtime

**OUTPUT:** Complete containerized application ready for production deployment.`,
        explanation: 'Complete Docker containerization with production-ready configuration and deployment.'
      }
    ]
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning Implementation',
    description: 'Complete AI/ML integration prompts for intelligent applications',
    category: 'AI/ML',
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400',
    prompts: [
      {
        name: 'AI Model Integration',
        text: `**AI CODING ASSISTANT - AI MODEL INTEGRATION**

Build complete AI model integration with production features. Provide FULL, WORKING code.

**AI INTEGRATION REQUIREMENTS:**
- Model Type: [OPENAI/HUGGINGFACE/CUSTOM/etc]
- Use Case: [CHAT/IMAGE/TEXT/ANALYSIS/etc]
- Platform: [WEB/MOBILE/API]
- Framework: [REACT/NODE/PYTHON/etc]
- Scale: [REQUESTS_PER_DAY]

**COMPLETE AI IMPLEMENTATION:**
- AI service configuration and setup
- API integration with authentication
- Request/response handling with types
- Error handling and fallback mechanisms
- Rate limiting and quota management
- Streaming responses for real-time
- Caching for performance optimization
- Usage tracking and analytics

**REQUIRED DELIVERABLES:**
- Complete AI service class
- Frontend integration components
- Backend API endpoints
- Type definitions for all data
- Configuration management
- Error boundary components
- Testing setup and examples
- Performance monitoring

**PRODUCTION FEATURES:**
- Token usage optimization
- Response caching strategy
- Failover and redundancy
- User context management
- Content filtering and safety
- Cost tracking and limits

**OUTPUT:** Production-ready AI integration that handles all edge cases and scales efficiently.`,
        explanation: 'Complete AI model integration with production-grade features and error handling.'
      },
      {
        name: 'Intelligent Data Processing',
        text: `**AI CODING ASSISTANT - INTELLIGENT DATA PROCESSING**

Create AI-powered data processing system. Provide FULL, WORKING implementation.

**DATA PROCESSING REQUIREMENTS:**
- Data Type: [TEXT/IMAGE/AUDIO/STRUCTURED/etc]
- Processing Goal: [ANALYSIS/CLASSIFICATION/EXTRACTION/etc]
- Data Volume: [AMOUNT_PER_DAY]
- Accuracy Needs: [PRECISION_REQUIREMENTS]
- Framework: [PYTHON/NODE/etc]

**COMPLETE PROCESSING SYSTEM:**
- Data ingestion and validation
- AI-powered analysis pipeline
- Real-time and batch processing
- Results storage and retrieval
- Quality assurance and validation
- Performance monitoring
- Error handling and recovery
- Scalable processing architecture

**IMPLEMENTATION COMPONENTS:**
- Data preprocessing utilities
- AI model integration
- Processing pipeline orchestration
- Results validation and scoring
- Database integration for results
- API endpoints for processing
- Queue management for batch jobs
- Monitoring and alerting system

**OUTPUT:** Complete intelligent data processing system with AI capabilities and production reliability.`,
        explanation: 'AI-powered data processing system with validation, monitoring, and scalable architecture.'
      },
      {
        name: 'Conversational AI Assistant',
        text: `**AI CODING ASSISTANT - CONVERSATIONAL AI**

Build complete conversational AI assistant. Provide FULL, WORKING implementation.

**ASSISTANT REQUIREMENTS:**
- Conversation Type: [CUSTOMER_SERVICE/TECHNICAL/GENERAL/etc]
- Integration: [WEBSITE/SLACK/DISCORD/etc]
- Knowledge Base: [DOCS/FAQ/CUSTOM/etc]
- Language Support: [ENGLISH/MULTILINGUAL]
- Framework: [REACT/NODE/etc]

**COMPLETE ASSISTANT IMPLEMENTATION:**
- Conversation management system
- Context tracking and memory
- Intent recognition and routing
- Response generation and formatting
- Knowledge base integration
- Multi-turn conversation handling
- Fallback and escalation logic
- Analytics and improvement tracking

**CORE COMPONENTS:**
- Chat interface with typing indicators
- Message processing and validation
- AI model integration for responses
- Context storage and retrieval
- User session management
- Conversation history and search
- Admin dashboard for monitoring
- Integration APIs for external systems

**ADVANCED FEATURES:**
- Sentiment analysis and routing
- Multi-language support
- Voice input/output capabilities
- File and image processing
- Integration with business systems
- A/B testing for improvements

**OUTPUT:** Production-ready conversational AI assistant with full feature set and monitoring capabilities.`,
        explanation: 'Complete conversational AI assistant with context management, integrations, and analytics.'
      }
    ]
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy Implementation',
    description: 'Comprehensive security and privacy protection systems',
    category: 'Security',
    icon: Shield,
    color: 'text-green-600 dark:text-green-400',
    prompts: [
      {
        name: 'Complete Security Audit & Hardening',
        text: `**AI CODING ASSISTANT - SECURITY AUDIT**

Perform complete security audit and implement hardening measures. Provide FULL, WORKING security code.

**SECURITY AUDIT SCOPE:**
- Application Type: [WEB/API/MOBILE/DESKTOP]
- Tech Stack: [REACT/NODE/DATABASE/etc]
- User Data: [PERSONAL/FINANCIAL/HEALTH/etc]
- Compliance: [GDPR/HIPAA/SOC2/etc]
- Threat Model: [EXTERNAL/INTERNAL/BOTH]

**COMPLETE SECURITY IMPLEMENTATION:**
- Input validation and sanitization
- Authentication and authorization hardening
- Data encryption at rest and in transit
- API security and rate limiting
- CSRF and XSS protection
- SQL injection prevention
- Secure headers implementation
- Logging and monitoring setup

**SECURITY COMPONENTS:**
- Complete input validation middleware
- Secure authentication system
- Role-based access control (RBAC)
- Data encryption utilities
- Security headers configuration
- API rate limiting and throttling
- Audit logging system
- Vulnerability scanning integration

**COMPLIANCE FEATURES:**
- Data privacy controls
- User consent management
- Data retention policies
- Audit trail implementation
- Incident response procedures
- Security documentation

**OUTPUT:** Complete security hardening implementation with compliance features and monitoring.`,
        explanation: 'Comprehensive security audit and hardening with compliance features and threat protection.'
      },
      {
        name: 'Data Privacy & GDPR Compliance',
        text: `**AI CODING ASSISTANT - PRIVACY COMPLIANCE**

Implement complete data privacy and GDPR compliance system. Provide FULL, WORKING code.

**PRIVACY REQUIREMENTS:**
- Data Types: [PERSONAL/BEHAVIORAL/FINANCIAL/etc]
- User Base: [EU/GLOBAL/US/etc]
- Compliance: [GDPR/CCPA/PIPEDA/etc]
- Data Processing: [AUTOMATED/MANUAL/BOTH]
- Framework: [REACT/NODE/etc]

**COMPLETE PRIVACY IMPLEMENTATION:**
- User consent management system
- Data subject rights automation
- Privacy policy generator
- Cookie consent and management
- Data portability features
- Right to erasure implementation
- Data processing records
- Privacy impact assessments

**CORE COMPONENTS:**
- Consent collection and storage
- User preference center
- Data export functionality
- Secure data deletion system
- Privacy dashboard for users
- Compliance reporting tools
- Data mapping and inventory
- Breach notification system

**LEGAL COMPLIANCE FEATURES:**
- Lawful basis tracking
- Purpose limitation enforcement
- Data minimization controls
- Retention policy automation
- Cross-border transfer controls
- Vendor privacy assessments

**OUTPUT:** Complete privacy compliance system with automated rights management and audit capabilities.`,
        explanation: 'Full GDPR and privacy compliance implementation with automated rights management and reporting.'
      }
    ]
  },
  {
    id: 'mobile-development',
    title: 'Mobile App Development',
    description: 'Complete mobile application development prompts',
    category: 'Mobile',
    icon: Smartphone,
    color: 'text-indigo-600 dark:text-indigo-400',
    prompts: [
      {
        name: 'Cross-Platform Mobile App',
        text: `**AI CODING ASSISTANT - MOBILE APP DEVELOPMENT**

Build complete cross-platform mobile application. Provide FULL, WORKING code.

**MOBILE APP REQUIREMENTS:**
- Platform: [REACT_NATIVE/FLUTTER/IONIC/etc]
- App Type: [BUSINESS/SOCIAL/UTILITY/etc]
- Features: [OFFLINE/PUSH/CAMERA/etc]
- Backend: [FIREBASE/CUSTOM_API/etc]
- Target: [IOS/ANDROID/BOTH]

**COMPLETE APP IMPLEMENTATION:**
- Navigation and routing setup
- State management implementation
- API integration and data handling
- Local storage and caching
- Push notification system
- Device feature integration
- Authentication and user management
- App store optimization setup

**CORE FEATURES:**
- Complete component library
- Navigation stack configuration
- API service layer
- Local database setup (SQLite/Realm)
- Image handling and optimization
- Push notification setup
- Deep linking implementation
- Offline functionality

**PRODUCTION FEATURES:**
- Error boundary and crash reporting
- Analytics and user tracking
- Performance monitoring
- App update mechanisms
- Security and data protection
- Testing setup (unit/integration)
- CI/CD pipeline configuration
- App store deployment guides

**OUTPUT:** Complete mobile application with all production features and deployment configuration.`,
        explanation: 'Complete cross-platform mobile app with navigation, API integration, and production features.'
      },
      {
        name: 'Mobile Performance Optimization',
        text: `**AI CODING ASSISTANT - MOBILE PERFORMANCE**

Optimize mobile app performance completely. Provide FULL, WORKING optimization code.

**PERFORMANCE REQUIREMENTS:**
- Current Issues: [SLOW_LOADING/CRASHES/BATTERY/etc]
- App Size: [CURRENT_SIZE_MB]
- Target Performance: [LOAD_TIME_GOALS]
- Platform: [REACT_NATIVE/FLUTTER/etc]
- User Base: [NUMBER_OF_USERS]

**COMPLETE OPTIMIZATION IMPLEMENTATION:**
- Bundle size optimization and code splitting
- Image optimization and lazy loading
- Memory management and leak prevention
- Battery usage optimization
- Network request optimization
- Rendering performance improvements
- Startup time optimization
- Background task management

**OPTIMIZATION COMPONENTS:**
- Image compression and caching system
- Lazy loading implementation
- Memory profiling and cleanup
- Network request batching
- Component optimization utilities
- Performance monitoring setup
- Crash reporting and analytics
- Battery usage tracking

**PERFORMANCE MONITORING:**
- Real-time performance metrics
- User experience tracking
- Crash and error monitoring
- Network performance analysis
- Memory usage monitoring
- Battery impact assessment

**OUTPUT:** Complete mobile performance optimization with monitoring and continuous improvement systems.`,
        explanation: 'Comprehensive mobile performance optimization with monitoring, caching, and user experience improvements.'
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Modern Web Development',
    description: 'Complete web application development and optimization',
    category: 'Web Development',
    icon: Globe,
    color: 'text-cyan-600 dark:text-cyan-400',
    prompts: [
      {
        name: 'Full-Stack Web Application',
        text: `**AI CODING ASSISTANT - FULL-STACK WEB APP**

Build complete full-stack web application. Provide FULL, WORKING code.

**WEB APP REQUIREMENTS:**
- Frontend: [REACT/NEXT/VUE/etc]
- Backend: [NODE/PYTHON/GO/etc]
- Database: [POSTGRESQL/MONGODB/etc]
- Features: [AUTH/PAYMENTS/REAL_TIME/etc]
- Scale: [EXPECTED_USERS]

**COMPLETE FULL-STACK IMPLEMENTATION:**
- Modern frontend with responsive design
- RESTful API with full CRUD operations
- Database design and optimization
- Authentication and authorization
- Real-time features (WebSockets/SSE)
- Payment integration if needed
- File upload and management
- Email and notification systems

**FRONTEND COMPONENTS:**
- Complete component library
- State management setup
- Routing and navigation
- Form handling and validation
- API integration layer
- Error boundary implementation
- Loading states and skeletons
- Responsive design system

**BACKEND IMPLEMENTATION:**
- Express/FastAPI server setup
- Database ORM/ODM configuration
- API route implementations
- Middleware for auth/logging/CORS
- File upload handling
- Email service integration
- Background job processing
- API documentation

**PRODUCTION FEATURES:**
- Environment configuration
- Error handling and logging
- Performance monitoring
- Security implementations
- Testing setup (unit/integration/e2e)
- CI/CD pipeline
- Docker containerization
- Deployment configuration

**OUTPUT:** Complete production-ready full-stack application with all modern features and deployment setup.`,
        explanation: 'Complete full-stack web application with modern architecture, security, and deployment configuration.'
      },
      {
        name: 'Progressive Web App (PWA)',
        text: `**AI CODING ASSISTANT - PROGRESSIVE WEB APP**

Create complete Progressive Web App with all PWA features. Provide FULL, WORKING code.

**PWA REQUIREMENTS:**
- Base App: [REACT/VUE/VANILLA/etc]
- Offline Features: [CACHING_STRATEGY]
- Push Notifications: [REQUIRED/OPTIONAL]
- Installation: [DESKTOP/MOBILE/BOTH]
- Framework: [WORKBOX/CUSTOM/etc]

**COMPLETE PWA IMPLEMENTATION:**
- Service worker with caching strategies
- Web app manifest configuration
- Offline functionality and sync
- Push notification system
- App installation prompts
- Background sync capabilities
- Performance optimizations
- Progressive enhancement

**PWA CORE FEATURES:**
- Service worker registration and management
- Cache-first/network-first strategies
- Offline page and fallbacks
- Background sync for data
- Push notification setup
- App shell architecture
- Responsive and accessible design
- App installation handling

**ADVANCED PWA FEATURES:**
- Web Push API integration
- Background sync for forms
- IndexedDB for offline storage
- Workbox for advanced caching
- App shortcuts and icons
- Share target API integration
- Periodic background sync
- Performance monitoring

**INSTALLATION & DEPLOYMENT:**
- Manifest.json configuration
- Service worker deployment
- HTTPS setup requirements
- App store submission prep
- Performance auditing setup
- PWA testing checklist

**OUTPUT:** Complete Progressive Web App with offline capabilities, push notifications, and app-like experience.`,
        explanation: 'Complete PWA implementation with offline functionality, push notifications, and native app-like features.'
      }
    ]
  },
  {
    id: 'devops-deployment',
    title: 'DevOps & Deployment Automation',
    description: 'Complete DevOps pipelines and deployment automation',
    category: 'DevOps',
    icon: Rocket,
    color: 'text-orange-600 dark:text-orange-400',
    prompts: [
      {
        name: 'Complete CI/CD Pipeline',
        text: `**AI CODING ASSISTANT - CI/CD PIPELINE**

Build complete CI/CD pipeline with deployment automation. Provide FULL, WORKING configuration.

**PIPELINE REQUIREMENTS:**
- Platform: [GITHUB_ACTIONS/GITLAB_CI/JENKINS/etc]
- Tech Stack: [NODE/PYTHON/DOCKER/etc]
- Deployment: [AWS/VERCEL/DIGITAL_OCEAN/etc]
- Testing: [UNIT/INTEGRATION/E2E]
- Environment: [STAGING/PRODUCTION/MULTI]

**COMPLETE CI/CD IMPLEMENTATION:**
- Automated testing pipeline
- Build and deployment automation
- Environment management
- Security scanning integration
- Performance monitoring setup
- Rollback mechanisms
- Notification systems
- Infrastructure as code

**PIPELINE STAGES:**
- Code quality checks (linting/formatting)
- Automated test execution
- Security vulnerability scanning
- Build optimization and artifacts
- Staging deployment and testing
- Production deployment with approvals
- Post-deployment monitoring
- Rollback procedures

**INFRASTRUCTURE COMPONENTS:**
- Docker containerization setup
- Environment configuration management
- Database migration automation
- CDN and asset optimization
- Load balancer configuration
- Monitoring and alerting setup
- Backup and recovery systems
- Scaling and auto-scaling rules

**DEPLOYMENT FEATURES:**
- Blue-green deployment strategy
- Canary releases with monitoring
- Feature flag integration
- Database migration handling
- Environment variable management
- SSL certificate automation
- Domain and DNS management

**OUTPUT:** Complete CI/CD pipeline with automated testing, deployment, monitoring, and rollback capabilities.`,
        explanation: 'Complete CI/CD pipeline with automated testing, deployment strategies, and infrastructure management.'
      },
      {
        name: 'Container Orchestration & Scaling',
        text: `**AI CODING ASSISTANT - CONTAINER ORCHESTRATION**

Implement complete container orchestration and auto-scaling. Provide FULL, WORKING configuration.

**ORCHESTRATION REQUIREMENTS:**
- Platform: [KUBERNETES/DOCKER_SWARM/ECS/etc]
- Application: [WEB_APP/API/MICROSERVICES/etc]
- Scale: [EXPECTED_LOAD]
- Environment: [CLOUD/ON_PREMISE/HYBRID]
- Monitoring: [PROMETHEUS/DATADOG/etc]

**COMPLETE ORCHESTRATION SETUP:**
- Container definition and optimization
- Kubernetes/orchestration manifests
- Service discovery and networking
- Load balancing and ingress
- Auto-scaling configuration
- Health checks and monitoring
- Persistent storage management
- Security and RBAC setup

**CONTAINER COMPONENTS:**
- Optimized Dockerfile with multi-stage builds
- Kubernetes deployment manifests
- Service and ingress configurations
- ConfigMap and Secret management
- Horizontal Pod Autoscaler (HPA)
- Vertical Pod Autoscaler (VPA)
- Network policies and security
- Persistent volume configurations

**SCALING & MONITORING:**
- Auto-scaling based on metrics
- Resource limits and requests
- Performance monitoring setup
- Log aggregation and analysis
- Alert and notification systems
- Cost optimization strategies
- Backup and disaster recovery
- Rolling updates and rollbacks

**PRODUCTION FEATURES:**
- Multi-environment setup
- GitOps deployment workflow
- Certificate management
- Database connection pooling
- Caching layer integration
- Security scanning and compliance
- Performance testing automation

**OUTPUT:** Complete container orchestration with auto-scaling, monitoring, and production-grade reliability.`,
        explanation: 'Complete Kubernetes/container orchestration with auto-scaling, monitoring, and production deployment strategies.'
      }
    ]
  },
  {
    id: 'documentation-content',
    title: 'Documentation & Content Systems',
    description: 'Complete documentation and content management solutions',
    category: 'Documentation',
    icon: FileText,
    color: 'text-slate-600 dark:text-slate-400',
    prompts: [
      {
        name: 'Technical Documentation System',
        text: `**AI CODING ASSISTANT - DOCUMENTATION SYSTEM**

Build complete technical documentation system. Provide FULL, WORKING implementation.

**DOCUMENTATION REQUIREMENTS:**
- Content Type: [API/USER_GUIDE/TECHNICAL/etc]
- Platform: [DOCS_SITE/WIKI/CONFLUENCE/etc]
- Features: [SEARCH/VERSIONING/COLLABORATION/etc]
- Framework: [DOCUSAURUS/GITBOOK/CUSTOM/etc]
- Integration: [GITHUB/JIRA/SLACK/etc]

**COMPLETE DOCUMENTATION IMPLEMENTATION:**
- Documentation site with modern design
- Content management and organization
- Search and navigation features
- Version control and management
- Collaborative editing capabilities
- API documentation generation
- Integration with development workflow
- Analytics and user feedback

**CORE FEATURES:**
- Markdown-based content system
- Automatic API documentation generation
- Search functionality with indexing
- Multi-version documentation support
- Responsive design for all devices
- Dark/light theme switching
- User authentication and permissions
- Content approval workflows

**ADVANCED CAPABILITIES:**
- Interactive API explorer
- Code example testing and validation
- Automatic screenshot generation
- Translation and localization support
- Analytics and usage tracking
- Feedback collection and processing
- Integration with issue tracking
- Automated content updates

**INTEGRATION FEATURES:**
- Git-based workflow integration
- CI/CD for documentation deployment
- Slack/Discord notifications
- Jira/GitHub issue linking
- API schema synchronization
- Content review and approval process

**OUTPUT:** Complete documentation system with modern features, automation, and seamless development integration.`,
        explanation: 'Complete technical documentation system with automation, search, versioning, and development workflow integration.'
      },
      {
        name: 'Content Management & Publishing',
        text: `**AI CODING ASSISTANT - CONTENT MANAGEMENT**

Create complete content management and publishing system. Provide FULL, WORKING implementation.

**CMS REQUIREMENTS:**
- Content Types: [BLOG/DOCS/MARKETING/etc]
- Users: [AUTHORS/EDITORS/ADMINS]
- Features: [WORKFLOW/SEO/ANALYTICS/etc]
- Platform: [HEADLESS/TRADITIONAL/HYBRID]
- Framework: [STRAPI/CONTENTFUL/CUSTOM/etc]

**COMPLETE CMS IMPLEMENTATION:**
- Content creation and editing interface
- Workflow and approval systems
- Multi-user collaboration features
- SEO optimization tools
- Content scheduling and publishing
- Media management and optimization
- Analytics and performance tracking
- API for headless content delivery

**CONTENT MANAGEMENT FEATURES:**
- Rich text editor with media embedding
- Content templates and reusable blocks
- Version control and revision history
- Content tagging and categorization
- Search and filtering capabilities
- Bulk operations and content import
- Content relationships and references
- Custom field types and validation

**PUBLISHING & DISTRIBUTION:**
- Multi-channel publishing (web/mobile/API)
- Content scheduling and automation
- SEO optimization and meta management
- Social media integration and sharing
- Email newsletter integration
- RSS and syndication feeds
- CDN integration for performance
- Cache management and invalidation

**WORKFLOW & COLLABORATION:**
- User roles and permission management
- Content approval and review process
- Comment and collaboration tools
- Notification and alert systems
- Activity logging and audit trails
- Integration with external tools
- Backup and recovery systems

**OUTPUT:** Complete content management system with workflow, publishing, SEO, and multi-channel distribution capabilities.`,
        explanation: 'Complete CMS with workflow management, multi-channel publishing, SEO optimization, and collaboration features.'
      }
    ]
  },
  {
    id: 'search-analytics',
    title: 'Search & Analytics Implementation',
    description: 'Advanced search and analytics systems for applications',
    category: 'Search & Analytics',
    icon: Search,
    color: 'text-yellow-600 dark:text-yellow-400',
    prompts: [
      {
        name: 'Advanced Search System',
        text: `**AI CODING ASSISTANT - SEARCH SYSTEM**

Build complete advanced search system with AI capabilities. Provide FULL, WORKING implementation.

**SEARCH REQUIREMENTS:**
- Data Types: [TEXT/DOCUMENTS/PRODUCTS/etc]
- Search Features: [FACETED/FUZZY/SEMANTIC/etc]
- Scale: [NUMBER_OF_DOCUMENTS]
- Platform: [ELASTICSEARCH/ALGOLIA/CUSTOM/etc]
- Framework: [REACT/NODE/etc]

**COMPLETE SEARCH IMPLEMENTATION:**
- Search engine setup and configuration
- Indexing and data synchronization
- Advanced query processing
- Faceted search and filtering
- Auto-complete and suggestions
- Search analytics and optimization
- Performance monitoring
- A/B testing for search improvements

**SEARCH FEATURES:**
- Full-text search with relevance scoring
- Fuzzy matching and typo tolerance
- Semantic search capabilities
- Faceted navigation and filters
- Auto-complete with intelligent suggestions
- Search-as-you-type functionality
- Advanced query syntax support
- Geographic and location-based search

**AI-POWERED FEATURES:**
- Semantic search using embeddings
- Query intent understanding
- Personalized search results
- Search result ranking optimization
- Natural language query processing
- Search behavior analysis
- Recommendation engine integration
- Content discovery automation

**PERFORMANCE & ANALYTICS:**
- Search performance monitoring
- Query analysis and optimization
- User behavior tracking
- A/B testing framework
- Search result click-through rates
- Conversion tracking and attribution
- Search quality metrics
- Performance benchmarking

**OUTPUT:** Complete search system with AI capabilities, analytics, and optimization features for superior user experience.`,
        explanation: 'Advanced search system with AI capabilities, semantic search, analytics, and performance optimization.'
      },
      {
        name: 'Analytics & Business Intelligence',
        text: `**AI CODING ASSISTANT - ANALYTICS SYSTEM**

Create complete analytics and business intelligence system. Provide FULL, WORKING implementation.

**ANALYTICS REQUIREMENTS:**
- Data Sources: [WEB/MOBILE/API/DATABASE/etc]
- Metrics: [USER/BUSINESS/PERFORMANCE/etc]
- Visualization: [DASHBOARDS/REPORTS/REAL_TIME/etc]
- Platform: [CUSTOM/GOOGLE_ANALYTICS/MIXPANEL/etc]
- Framework: [REACT/D3/CHART_JS/etc]

**COMPLETE ANALYTICS IMPLEMENTATION:**
- Data collection and tracking setup
- Real-time and batch data processing
- Interactive dashboard creation
- Custom reporting and visualization
- Alert and notification systems
- Data export and API access
- Performance monitoring
- Compliance and privacy controls

**DATA COLLECTION:**
- Event tracking implementation
- User behavior analytics
- Performance metrics collection
- Custom event definitions
- Data validation and cleaning
- Privacy-compliant tracking
- Cross-platform data unification
- Real-time data streaming

**VISUALIZATION & REPORTING:**
- Interactive dashboard components
- Custom chart and graph creation
- Drill-down and filtering capabilities
- Automated report generation
- Data export in multiple formats
- Mobile-responsive visualizations
- Print-friendly report layouts
- Scheduled report delivery

**BUSINESS INTELLIGENCE:**
- KPI monitoring and alerting
- Cohort analysis and retention
- Funnel analysis and optimization
- A/B testing result analysis
- Predictive analytics capabilities
- Anomaly detection and alerts
- Comparative analysis tools
- ROI and attribution modeling

**OUTPUT:** Complete analytics system with real-time dashboards, business intelligence, and automated reporting capabilities.`,
        explanation: 'Complete analytics and BI system with real-time dashboards, custom reporting, and business intelligence features.'
      }
    ]
  },
  {
    id: 'performance-monitoring',
    title: 'Performance & Monitoring Systems',
    description: 'Complete application performance monitoring and optimization',
    category: 'Performance',
    icon: BarChart,
    color: 'text-emerald-600 dark:text-emerald-400',
    prompts: [
      {
        name: 'Application Performance Monitoring',
        text: `**AI CODING ASSISTANT - PERFORMANCE MONITORING**

Implement complete application performance monitoring system. Provide FULL, WORKING monitoring code.

**MONITORING REQUIREMENTS:**
- Application Type: [WEB/API/MOBILE/DESKTOP]
- Metrics: [RESPONSE_TIME/THROUGHPUT/ERRORS/etc]
- Scale: [REQUESTS_PER_SECOND]
- Platform: [DATADOG/NEW_RELIC/CUSTOM/etc]
- Framework: [NODE/REACT/etc]

**COMPLETE MONITORING IMPLEMENTATION:**
- Real-time performance metrics collection
- Application health monitoring
- Error tracking and alerting
- User experience monitoring
- Infrastructure monitoring
- Log aggregation and analysis
- Alert and notification systems
- Performance optimization recommendations

**PERFORMANCE METRICS:**
- Response time and latency tracking
- Throughput and request rate monitoring
- Error rate and exception tracking
- Memory usage and leak detection
- CPU utilization monitoring
- Database query performance
- Third-party service monitoring
- User experience metrics (Core Web Vitals)

**MONITORING COMPONENTS:**
- Custom metrics collection agents
- Real-time dashboard creation
- Alert rule configuration
- Log parsing and analysis
- Performance baseline establishment
- Anomaly detection algorithms
- Automated scaling triggers
- Incident response automation

**ALERTING & NOTIFICATIONS:**
- Multi-channel alert delivery
- Escalation policy configuration
- Alert correlation and grouping
- Maintenance window management
- SLA monitoring and reporting
- Incident tracking and resolution
- Performance regression detection
- Capacity planning recommendations

**OUTPUT:** Complete performance monitoring system with real-time alerts, dashboards, and automated optimization recommendations.`,
        explanation: 'Complete APM system with real-time monitoring, alerting, error tracking, and performance optimization.'
      },
      {
        name: 'System Health & Reliability',
        text: `**AI CODING ASSISTANT - SYSTEM RELIABILITY**

Build complete system health and reliability monitoring. Provide FULL, WORKING reliability implementation.

**RELIABILITY REQUIREMENTS:**
- System Type: [DISTRIBUTED/MONOLITH/MICROSERVICES]
- Availability Target: [99.9%/99.99%/etc]
- Monitoring Scope: [APPLICATION/INFRASTRUCTURE/BOTH]
- Platform: [KUBERNETES/AWS/CUSTOM/etc]
- Framework: [PROMETHEUS/GRAFANA/etc]

**COMPLETE RELIABILITY IMPLEMENTATION:**
- Health check and heartbeat systems
- Circuit breaker implementation
- Retry logic with exponential backoff
- Graceful degradation mechanisms
- Load balancing and failover
- Disaster recovery automation
- Capacity planning and scaling
- Reliability testing and chaos engineering

**HEALTH MONITORING:**
- Deep health check endpoints
- Dependency health verification
- Service mesh monitoring
- Database connection monitoring
- External service health tracking
- Resource utilization monitoring
- Network connectivity verification
- Security vulnerability scanning

**FAULT TOLERANCE:**
- Circuit breaker pattern implementation
- Bulkhead isolation mechanisms
- Timeout and retry configurations
- Graceful service degradation
- Failover and redundancy setup
- Data consistency monitoring
- Transaction monitoring and rollback
- Error recovery automation

**RELIABILITY FEATURES:**
- SLA/SLO monitoring and reporting
- Incident detection and response
- Automated scaling and load balancing
- Backup and recovery verification
- Chaos engineering test automation
- Performance regression detection
- Capacity forecasting and planning
- Cost optimization recommendations

**OUTPUT:** Complete system reliability implementation with fault tolerance, monitoring, and automated recovery capabilities.`,
        explanation: 'Complete system reliability monitoring with fault tolerance, automated recovery, and chaos engineering capabilities.'
      }
    ]
  }
];