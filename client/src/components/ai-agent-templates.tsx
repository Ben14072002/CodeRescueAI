import { Bug, Code, Database, Lock, Palette, Server, Zap } from "lucide-react";

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
  }
];