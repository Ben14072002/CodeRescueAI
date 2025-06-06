import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, CheckCircle, Star, Database, Lock, Palette, Server, AlertTriangle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompts: {
    name: string;
    text: string;
    explanation: string;
  }[];
  icon: any;
  color: string;
}

interface PromptTemplatesLibraryProps {
  onBack: () => void;
}

const TEMPLATE_CATEGORIES: PromptTemplate[] = [
  {
    id: 'secure-authentication-setup',
    title: 'Secure Authentication Setup',
    description: 'Build robust login systems with security best practices',
    category: 'Authentication',
    icon: Lock,
    color: 'text-blue-500',
    prompts: [
      {
        name: 'Complete Auth System with JWT + Database',
        text: 'Create a production-ready authentication system with the following specifications:\n\nREQUIREMENTS:\n- JWT-based authentication with refresh tokens\n- Secure password hashing using bcrypt (cost factor 12)\n- PostgreSQL/MySQL database with proper schema\n- Email verification and password reset flows\n- Rate limiting (5 login attempts per 15 minutes)\n- CSRF protection and secure headers\n\nDELIVERABLES:\n1. Database schema with users, refresh_tokens, and password_reset_tokens tables\n2. Registration endpoint with email verification\n3. Login endpoint with rate limiting\n4. Password reset flow (request + confirm)\n5. JWT middleware for protected routes\n6. Refresh token rotation mechanism\n7. Logout endpoint that invalidates tokens\n\nSECURITY REQUIREMENTS:\n- Store JWT in httpOnly cookies\n- Validate all inputs with joi/zod\n- Hash passwords with bcrypt cost 12+\n- Use crypto.randomBytes for reset tokens\n- Implement CORS properly\n- Add helmet.js security headers\n- Log authentication events\n\nProvide complete working code with error handling, TypeScript types, and security best practices.',
        explanation: 'Complete authentication system implementation with all security features and database integration.'
      },
      {
        name: 'Stripe Payment Integration Setup',
        text: 'Implement a complete Stripe payment system with the following requirements:\n\nFEATURES NEEDED:\n- One-time payments for products/services\n- Subscription billing with multiple tiers\n- Webhook handling for payment events\n- Customer portal for subscription management\n- Invoice generation and email notifications\n- Failed payment retry logic\n\nTECHNICAL REQUIREMENTS:\n1. Backend API endpoints:\n   - POST /create-payment-intent (one-time payments)\n   - POST /create-subscription (recurring billing)\n   - POST /webhook (Stripe event handling)\n   - GET /customer-portal (redirect URL)\n   - POST /cancel-subscription\n\n2. Frontend components:\n   - Stripe Elements integration\n   - Payment form with card validation\n   - Subscription plan selection\n   - Payment success/failure handling\n   - Loading states and error handling\n\n3. Database integration:\n   - Customer records with Stripe IDs\n   - Subscription status tracking\n   - Payment history logging\n   - Invoice storage\n\nSECURITY & COMPLIANCE:\n- Server-side payment intent creation\n- Webhook signature verification\n- PCI compliance considerations\n- Error handling without exposing sensitive data\n\nProvide complete working code with TypeScript types, error handling, and testing examples.',
        explanation: 'Complete Stripe payment integration with subscriptions, webhooks, and customer management.'
      },
      {
        name: 'Email System with Templates & Queue',
        text: 'Build a production-ready email system with the following specifications:\n\nCORE FEATURES:\n- Transactional emails (welcome, password reset, notifications)\n- Template system with dynamic content\n- Email queue with retry mechanism\n- Bounce and complaint handling\n- Email analytics and tracking\n- Multi-provider support (SendGrid, Mailgun, SES)\n\nTECHNICAL IMPLEMENTATION:\n1. Email service architecture:\n   - Email provider abstraction layer\n   - Template engine (Handlebars/Mustache)\n   - Queue system (Bull/Agenda with Redis)\n   - Webhook handlers for delivery events\n   - Email validation and sanitization\n\n2. Database schema:\n   - email_templates table with versioning\n   - email_queue table with status tracking\n   - email_logs table for delivery history\n   - user_email_preferences for opt-outs\n\n3. API endpoints:\n   - POST /send-email (immediate send)\n   - POST /queue-email (scheduled send)\n   - GET /email-status/:id (delivery tracking)\n   - POST /email-webhook (provider callbacks)\n\n4. Frontend components:\n   - Email preference management\n   - Template preview system\n   - Email analytics dashboard\n   - Unsubscribe handling\n\nSECURITY & COMPLIANCE:\n- SPF, DKIM, DMARC configuration\n- CAN-SPAM compliance\n- GDPR email consent handling\n- Rate limiting and anti-spam measures\n\nProvide complete code with error handling, retry logic, and monitoring integration.',
        explanation: 'Complete email system with templates, queuing, delivery tracking, and compliance features.'
      }
    ]
  },
  {
    id: 'robust-api-integration',
    title: 'Robust API Integration',
    description: 'Build reliable external API connections with best practices',
    category: 'Integration',
    icon: Server,
    color: 'text-green-500',
    prompts: [
      {
        name: 'Production API Client with Retry Logic',
        text: 'Build a robust API client with the following specifications:\n\nCORE FEATURES:\n- Axios-based HTTP client with interceptors\n- Automatic token refresh for expired JWTs\n- Exponential backoff retry mechanism\n- Request/response caching with TTL\n- Circuit breaker for failing endpoints\n- Request deduplication for identical calls\n\nTECHNICAL REQUIREMENTS:\n1. Client configuration:\n   - Base URL from environment variables\n   - Default timeout (30s)\n   - Content-Type application/json\n   - Authorization header injection\n   - CORS handling\n\n2. Interceptor setup:\n   - Request interceptor: add auth tokens\n   - Response interceptor: handle 401s with refresh\n   - Error interceptor: retry failed requests\n   - Logging interceptor: track API calls\n\n3. Error handling:\n   - Network errors vs HTTP errors\n   - Retry logic (max 3 attempts)\n   - Exponential backoff (1s, 2s, 4s)\n   - Circuit breaker (5 failures = 60s cooldown)\n   - Fallback responses for critical endpoints\n\n4. TypeScript integration:\n   - API response type definitions\n   - Generic request/response interfaces\n   - Error type unions\n   - Status code enums\n\nSECURITY FEATURES:\n- Token storage in httpOnly cookies\n- Automatic XSRF token handling\n- Request/response sanitization\n- Rate limiting compliance\n\nProvide complete working code with comprehensive error handling and TypeScript types.',
        explanation: 'Production-ready API client with retry logic, caching, circuit breaker, and comprehensive error handling.'
      },
      {
        name: 'Real-time Features with WebSockets',
        text: 'Build real-time functionality with the following specifications:\n\nCORE FEATURES:\n- WebSocket server with Socket.IO\n- Real-time chat/messaging system\n- Live notifications and updates\n- Real-time collaboration features\n- Connection management and reconnection\n- Room-based broadcasting\n\nTECHNICAL IMPLEMENTATION:\n1. WebSocket server setup:\n   - Socket.IO server configuration\n   - CORS and authentication handling\n   - Connection event management\n   - Error handling and logging\n   - Scaling with Redis adapter\n\n2. Client-side integration:\n   - Socket.IO client connection\n   - Event listeners and emitters\n   - Automatic reconnection logic\n   - Connection state management\n   - Message queuing for offline mode\n\n3. Real-time features:\n   - Live chat with typing indicators\n   - Push notifications system\n   - Real-time document collaboration\n   - Live user presence indicators\n   - Real-time data synchronization\n\n4. Database integration:\n   - Message storage and retrieval\n   - User online/offline status\n   - Chat room/channel management\n   - Message history pagination\n   - Read receipts and delivery status\n\nSCALING CONSIDERATIONS:\n- Redis for session management\n- Load balancing with sticky sessions\n- Message queuing with Bull/Agenda\n- Rate limiting for socket events\n- Connection pooling optimization\n\nSECURITY FEATURES:\n- JWT authentication for sockets\n- Rate limiting per connection\n- Input sanitization and validation\n- CORS configuration\n- DDoS protection\n\nProvide complete working code with React hooks, TypeScript types, and scaling architecture.',
        explanation: 'Complete real-time system with WebSockets, chat, notifications, and collaboration features.'
      }
    ]
  },
  {
    id: 'scalable-frontend-architecture',
    title: 'React Components & State Management',
    description: 'Build professional React applications with proper architecture',
    category: 'Frontend',
    icon: Palette,
    color: 'text-purple-500',
    prompts: [
      {
        name: 'React Component Library with TypeScript',
        text: 'Create a professional React component library with the following specifications:\n\nCORE REQUIREMENTS:\n- TypeScript with strict mode enabled\n- Reusable components with proper prop interfaces\n- Custom hooks for common functionality\n- Context API for global state management\n- Proper error boundaries and loading states\n- Storybook for component documentation\n\nCOMPONENT STRUCTURE:\n1. Base components to build:\n   - Button (variants: primary, secondary, danger)\n   - Input (text, email, password, textarea)\n   - Modal/Dialog with backdrop and focus management\n   - Form wrapper with validation\n   - Table with sorting and pagination\n   - Card/Panel layout components\n\n2. Advanced components:\n   - DataTable with filters and search\n   - DatePicker with range selection\n   - FileUpload with drag-and-drop\n   - Toast notification system\n   - Sidebar navigation with collapsible items\n\n3. Custom hooks to implement:\n   - useApi (for data fetching with loading/error states)\n   - useLocalStorage (with SSR compatibility)\n   - useDebounce (for search inputs)\n   - useForm (with validation)\n   - useToggle, useCounter, usePrevious\n\nTYPESCRIPT REQUIREMENTS:\n- Proper interface definitions for all props\n- Generic types for reusable components\n- Union types for component variants\n- Utility types (Pick, Omit, Partial)\n- Strict null checks and proper error handling\n\nTESTING SETUP:\n- Jest and React Testing Library\n- Component unit tests\n- Custom hook testing\n- Integration test examples\n- Accessibility testing with jest-axe\n\nProvide complete working code with TypeScript interfaces, proper component composition patterns, and comprehensive testing examples.',
        explanation: 'Professional React component library with TypeScript, custom hooks, and comprehensive testing setup.'
      },
      {
        name: 'Advanced State Management with Zustand',
        text: 'Implement a scalable state management solution with the following specifications:\n\nSTATE ARCHITECTURE:\n- Zustand for global state management\n- TypeScript interfaces for all state slices\n- Persistent storage with localStorage/sessionStorage\n- Optimistic updates for better UX\n- Middleware for logging and debugging\n- State normalization for complex data\n\nSTORE STRUCTURE:\n1. User authentication store:\n   - User profile and preferences\n   - Authentication status and tokens\n   - Permission and role management\n   - Login/logout actions\n\n2. Application data stores:\n   - API data with loading/error states\n   - Form state management\n   - UI state (modals, notifications)\n   - Shopping cart or similar business logic\n\n3. Advanced patterns:\n   - Store composition and slicing\n   - Computed values and selectors\n   - Async actions with error handling\n   - Undo/redo functionality\n   - Real-time data synchronization\n\nTYPESCRIPT INTEGRATION:\n- Strict typing for all store methods\n- State interface definitions\n- Action type safety\n- Selector return type inference\n- Generic store patterns\n\nPERFORMANCE OPTIMIZATION:\n- Shallow equality checks\n- Selective subscriptions\n- State normalization\n- Memoized selectors\n- Lazy loading of store slices\n\nDEVELOPER EXPERIENCE:\n- Redux DevTools integration\n- Hot reload support\n- Time-travel debugging\n- State persistence\n- Error boundaries for state errors\n\nTESTING STRATEGY:\n- Store unit tests\n- Action testing\n- State mutation testing\n- Integration test examples\n- Mock store setup for components\n\nProvide complete working code with TypeScript interfaces, performance optimizations, and comprehensive testing examples.',
        explanation: 'Advanced state management system with Zustand, TypeScript, persistence, and comprehensive testing setup.'
      }
    ]
  },
  {
    id: 'scalable-database-architecture',
    title: 'Scalable Database Architecture',
    description: 'Design performant database systems from the ground up',
    category: 'Backend',
    icon: Database,
    color: 'text-cyan-500',
    prompts: [
      {
        name: 'Production Database Design',
        text: 'DESIGN SCALABLE DATABASE ARCHITECTURE\n\nHelp me architect a production-ready database system:\n\n1. DATABASE DESIGN FUNDAMENTALS:\n   - Schema design with normalization principles\n   - Primary key and foreign key strategies\n   - Index planning for query patterns\n   - Data type optimization for storage and performance\n   - Constraint design for data integrity\n\n2. PERFORMANCE ARCHITECTURE:\n   - Connection pooling configuration\n   - Read replica setup for scaling reads\n   - Partitioning strategies for large tables\n   - Caching layers (Redis, Memcached integration)\n   - Query optimization patterns\n\n3. SECURITY IMPLEMENTATION:\n   - Database user roles and permissions\n   - Row-level security policies\n   - Data encryption at rest and in transit\n   - SQL injection prevention\n   - Audit logging setup\n\n4. BACKUP & RECOVERY STRATEGY:\n   - Automated backup scheduling\n   - Point-in-time recovery setup\n   - Disaster recovery planning\n   - Database migration strategies\n   - Environment synchronization\n\nProvide complete setup instructions with performance considerations and explain the scalability benefits.',
        explanation: 'Comprehensive database architecture guide focusing on performance, security, and scalability from the start.'
      },
      {
        name: 'Database Performance Optimization Setup',
        text: 'IMPLEMENT HIGH-PERFORMANCE DATABASE PATTERNS\n\nGuide me through optimizing database performance from the beginning:\n\n1. INDEXING STRATEGY:\n   - Primary and secondary index design\n   - Composite index optimization\n   - Partial and functional indexes\n   - Index maintenance and monitoring\n   - Query plan analysis tools\n\n2. CONNECTION MANAGEMENT:\n   - Connection pool sizing and configuration\n   - Connection lifecycle management\n   - Prepared statement optimization\n   - Transaction isolation levels\n   - Deadlock prevention strategies\n\n3. QUERY OPTIMIZATION PATTERNS:\n   - Efficient JOIN strategies\n   - Subquery vs JOIN performance\n   - Pagination techniques for large datasets\n   - Bulk operation optimization\n   - N+1 query problem prevention\n\n4. MONITORING & METRICS:\n   - Performance monitoring setup\n   - Slow query logging\n   - Resource utilization tracking\n   - Database health checks\n   - Alerting thresholds\n\nProvide working examples with performance benchmarks and explain when to use each optimization technique.',
        explanation: 'Advanced database performance optimization focusing on indexing, query patterns, and monitoring strategies.'
      }
    ]
  },
  {
    id: 'production-deployment-setup',
    title: 'Production Deployment Setup',
    description: 'Build robust CI/CD pipelines and production infrastructure',
    category: 'DevOps',
    icon: Server,
    color: 'text-orange-500',
    prompts: [
      {
        name: 'CI/CD Pipeline Architecture',
        text: 'BUILD PRODUCTION-READY DEPLOYMENT PIPELINE\n\nHelp me establish a robust CI/CD pipeline from scratch:\n\n1. PIPELINE ARCHITECTURE:\n   - Git workflow strategy (GitFlow, GitHub Flow)\n   - Branch protection and review policies\n   - Automated testing stages (unit, integration, e2e)\n   - Build and artifact management\n   - Deployment environments (staging, production)\n\n2. BUILD OPTIMIZATION:\n   - Multi-stage Docker builds\n   - Build caching strategies\n   - Asset optimization and bundling\n   - Environment-specific configurations\n   - Security scanning integration\n\n3. DEPLOYMENT STRATEGIES:\n   - Blue-green deployment setup\n   - Rolling deployment configuration\n   - Canary release implementation\n   - Database migration handling\n   - Zero-downtime deployment patterns\n\n4. MONITORING & OBSERVABILITY:\n   - Health check endpoints\n   - Application monitoring setup\n   - Error tracking and alerting\n   - Performance metrics collection\n   - Log aggregation and analysis\n\nProvide complete pipeline configuration with security best practices and explain the reliability benefits.',
        explanation: 'Comprehensive CI/CD pipeline setup focusing on reliability, security, and automated deployment strategies.'
      },
      {
        name: 'Production Infrastructure Best Practices',
        text: 'IMPLEMENT SCALABLE PRODUCTION INFRASTRUCTURE\n\nGuide me through setting up production-ready infrastructure:\n\n1. INFRASTRUCTURE AS CODE:\n   - Terraform or CloudFormation setup\n   - Environment configuration management\n   - Resource provisioning automation\n   - Infrastructure versioning and rollback\n   - Cost optimization strategies\n\n2. SECURITY IMPLEMENTATION:\n   - SSL/TLS certificate management\n   - Environment variable and secret management\n   - Network security groups and firewalls\n   - Access control and IAM policies\n   - Security monitoring and compliance\n\n3. SCALABILITY ARCHITECTURE:\n   - Load balancer configuration\n   - Auto-scaling policies\n   - Database scaling strategies\n   - CDN setup for static assets\n   - Microservices deployment patterns\n\n4. RELIABILITY PATTERNS:\n   - Backup and disaster recovery\n   - Multi-region deployment\n   - Circuit breaker implementation\n   - Rate limiting and DDoS protection\n   - Monitoring and alerting systems\n\nProvide infrastructure setup guides with cost considerations and explain the scalability trade-offs.',
        explanation: 'Production infrastructure setup focusing on security, scalability, and reliability patterns for enterprise applications.'
      }
    ]
  }
];

export function PromptTemplatesLibrary({ onBack }: PromptTemplatesLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyPrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIndex(index);
    toast({
      title: "Prompt Copied",
      description: "The prompt has been copied to your clipboard."
    });
    
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  if (selectedTemplate) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedTemplate(null)}
          className="mb-6 text-slate-400 hover:text-slate-200 min-h-[44px]"
        >
          ← Back to Templates
        </Button>

        <Card className="surface-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
              <selectedTemplate.icon className={`w-6 h-6 mr-3 ${selectedTemplate.color}`} />
              {selectedTemplate.title}
              <Badge className="ml-3 bg-green-500/20 text-green-300 border-green-500/30">
                <Gift className="w-3 h-3 mr-1" />
                Free
              </Badge>
            </CardTitle>
            <p className="text-slate-400">{selectedTemplate.description}</p>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {selectedTemplate.prompts.map((prompt, index) => (
            <Card key={index} className="surface-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="text-slate-100">{prompt.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPrompt(prompt.text, index)}
                    className="border-slate-600 hover:border-primary"
                  >
                    {copiedPromptIndex === index ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedPromptIndex === index ? "Copied!" : "Copy"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Prompt:</h4>
                  <Textarea
                    value={prompt.text}
                    readOnly
                    className="min-h-32 bg-slate-900/50 border-slate-600 text-slate-100 font-mono text-sm"
                  />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Why this works:</h4>
                  <p className="text-sm text-blue-200">{prompt.explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-slate-400 hover:text-slate-200 min-h-[44px]"
      >
        ← Back to Problems
      </Button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-green-400 mr-3" />
          <h1 className="text-3xl font-bold text-slate-100">Ready-to-Use Templates</h1>
          <Badge className="ml-3 bg-green-500/20 text-green-300 border-green-500/30">
            Free for Everyone
          </Badge>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Proven prompt templates for the most common coding problems. No subscription required - 
          these battle-tested prompts are available to all users to help you get unstuck quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {TEMPLATE_CATEGORIES.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer transition-all surface-800 border-slate-700 hover:border-primary min-h-[200px] active:scale-95"
            onClick={() => setSelectedTemplate(template)}
          >
            <CardContent className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <template.icon className={`w-8 h-8 ${template.color} mb-3 mx-auto`} />
                <h3 className="text-lg font-semibold mb-2 text-slate-100">{template.title}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4 flex-grow">{template.description}</p>
              <div className="space-y-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  {template.prompts.length} Proven Prompts
                </Badge>
                <div className="text-xs text-slate-500">
                  <span className={`bg-${template.color.split('-')[1]}-500/20 ${template.color} px-2 py-1 rounded text-xs`}>
                    {template.category}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Free Templates for Everyone
          </h3>
          <p className="text-slate-300 mb-4">
            These templates are based on real debugging sessions and proven to work. 
            Each template includes 2-3 specialized prompts with explanations of why they're effective.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-500/10 rounded-lg p-3">
              <h4 className="font-semibold text-green-300 mb-1">Battle-Tested</h4>
              <p className="text-green-200">Used successfully by thousands of developers</p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3">
              <h4 className="font-semibold text-blue-300 mb-1">Copy & Paste</h4>
              <p className="text-blue-200">Ready to use immediately, no customization needed</p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3">
              <h4 className="font-semibold text-purple-300 mb-1">Always Free</h4>
              <p className="text-purple-200">No subscription required, available to everyone</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}