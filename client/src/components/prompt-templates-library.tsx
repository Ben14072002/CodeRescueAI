import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, CheckCircle, Star, AlertTriangle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiAgentTemplates, type AIAgentTemplate } from "./ai-agent-templates";

interface PromptTemplatesLibraryProps {
  onBack: () => void;
}

const TEMPLATE_CATEGORIES: AIAgentTemplate[] = aiAgentTemplates;
    prompts: [
      {
        name: 'Enterprise Auth System with Zero-Trust Architecture',
        text: 'CONTEXT: I need to implement a zero-trust authentication system for a SaaS platform handling sensitive user data. This system must be production-ready, scalable, and pass security audits.\n\nARCHITECTURAL REQUIREMENTS:\n```typescript\n// Database Schema (PostgreSQL with row-level security)\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password_hash VARCHAR(255) NOT NULL,\n  email_verified BOOLEAN DEFAULT false,\n  mfa_enabled BOOLEAN DEFAULT false,\n  mfa_secret VARCHAR(32),\n  failed_login_attempts INTEGER DEFAULT 0,\n  account_locked_until TIMESTAMP,\n  last_login TIMESTAMP,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE refresh_tokens (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  token_hash VARCHAR(255) NOT NULL,\n  device_fingerprint VARCHAR(255),\n  ip_address INET,\n  expires_at TIMESTAMP NOT NULL,\n  revoked BOOLEAN DEFAULT false\n);\n```\n\nIMPLEMENTATION SPECIFICATIONS:\n1. Password Security:\n   - Argon2id hashing (memory: 64MB, iterations: 3, parallelism: 4)\n   - Minimum 12 characters with complexity requirements\n   - Password breach checking via HaveIBeenPwned API\n   - Secure password reset with time-limited tokens\n\n2. JWT Implementation:\n   - Access tokens: 15-minute expiry, RS256 signing\n   - Refresh tokens: 30-day expiry, stored as SHA-256 hash\n   - Token rotation on every refresh\n   - Automatic revocation of suspicious sessions\n\n3. Rate Limiting & Security:\n   - Sliding window rate limiter (5 attempts/15min per IP)\n   - Progressive delays: 1s, 5s, 15s, 60s, 300s\n   - Device fingerprinting for anomaly detection\n   - Geolocation-based risk scoring\n\n4. Multi-Factor Authentication:\n   - TOTP implementation with crypto.randomBytes(20)\n   - Backup codes (8 single-use codes)\n   - SMS fallback with Twilio integration\n   - Recovery email verification\n\nCODE REQUIREMENTS:\n- TypeScript with strict mode and branded types\n- Comprehensive error handling with custom error classes\n- Structured logging with correlation IDs\n- Metrics collection for monitoring\n- Integration tests with supertest\n- Security headers: CSP, HSTS, X-Frame-Options\n\nExpected output: Complete authentication service with middleware, types, tests, and deployment configuration.',
        explanation: 'Complete authentication system implementation with all security features and database integration.'
      },
      {
        name: 'Advanced Stripe Payment Architecture with Revenue Recognition',
        text: 'CONTEXT: Build a sophisticated payment system for a B2B SaaS platform with complex billing scenarios, revenue recognition compliance (ASC 606), and multi-tenant architecture.\n\nARCHITECTURAL REQUIREMENTS:\n```typescript\n// Database Schema with temporal tables for audit compliance\nCREATE TABLE stripe_customers (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  tenant_id UUID NOT NULL,\n  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,\n  business_name VARCHAR(255),\n  tax_id VARCHAR(50),\n  billing_address JSONB,\n  payment_methods JSONB[],\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE subscription_plans (\n  id UUID PRIMARY KEY,\n  stripe_price_id VARCHAR(255) UNIQUE NOT NULL,\n  tier_name VARCHAR(50) NOT NULL,\n  billing_interval billing_interval_enum,\n  unit_amount INTEGER NOT NULL,\n  currency CHAR(3) DEFAULT \'USD\',\n  features JSONB NOT NULL,\n  usage_limits JSONB\n);\n\nCREATE TABLE revenue_recognition (\n  id UUID PRIMARY KEY,\n  subscription_id UUID REFERENCES subscriptions(id),\n  recognition_date DATE NOT NULL,\n  recognized_amount INTEGER NOT NULL,\n  deferred_amount INTEGER NOT NULL,\n  accounting_period VARCHAR(7) -- YYYY-MM format\n);\n```\n\nADVANCED IMPLEMENTATION:\n1. Payment Intent Optimization:\n   - Automatic payment method attachment\n   - Save payment details for future use\n   - Support for SEPA, ACH, and international payment methods\n   - Dynamic descriptor for better customer recognition\n   - Fraud detection with Radar rules\n\n2. Subscription Management:\n   - Proration handling for mid-cycle upgrades/downgrades\n   - Usage-based billing with metered components\n   - Automatic invoice finalization with custom logic\n   - Failed payment retry with exponential backoff\n   - Dunning management for failed payments\n\n3. Webhook Architecture:\n   - Idempotent webhook processing with Redis locks\n   - Event replay mechanism for failed processing\n   - Signature verification with multiple endpoint secrets\n   - Dead letter queue for failed events\n   - Structured logging with correlation IDs\n\n4. Revenue Recognition (ASC 606):\n   - Contract identification and performance obligations\n   - Transaction price allocation across obligations\n   - Recognition over time vs. point in time\n   - Deferred revenue calculations\n   - Monthly/quarterly revenue reports\n\nCODE ARCHITECTURE:\n```typescript\ninterface PaymentOrchestrator {\n  createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult>;\n  handleUpgrade(subscriptionId: string, newPlan: PlanConfig): Promise<ProrationResult>;\n  processWebhook(event: Stripe.Event): Promise<WebhookProcessingResult>;\n  calculateRevenue(period: AccountingPeriod): Promise<RevenueCalculation>;\n}\n```\n\nCOMPLIANCE REQUIREMENTS:\n- PCI DSS Level 1 compliance\n- SOX financial controls\n- GDPR data handling for EU customers\n- Tax calculation with TaxJar/Avalara integration\n- Multi-currency support with FX rate management\n\nExpected output: Enterprise-grade payment system with financial reporting, compliance features, and comprehensive error handling.',
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
        name: 'Microservices API Gateway with Advanced Orchestration',
        text: 'CONTEXT: Build a production-grade API gateway for a microservices architecture handling 10k+ requests/minute with service mesh integration, advanced caching, and distributed tracing.\n\nARCHITECTURAL REQUIREMENTS:\n```typescript\n// Gateway Architecture\ninterface APIGateway {\n  routing: ServiceRouter;\n  authentication: AuthenticationLayer;\n  rateLimit: RateLimitingEngine;\n  caching: DistributedCache;\n  monitoring: ObservabilityStack;\n  security: SecurityMiddleware;\n}\n\n// Service Discovery Integration\ninterface ServiceRegistry {\n  discover(serviceName: string): Promise<ServiceInstance[]>;\n  healthCheck(instance: ServiceInstance): Promise<HealthStatus>;\n  loadBalance(instances: ServiceInstance[]): ServiceInstance;\n}\n```\n\nCORE IMPLEMENTATION:\n1. Dynamic Routing & Load Balancing:\n   - Consul/Eureka service discovery integration\n   - Weighted round-robin with health checks\n   - Circuit breaker pattern (Netflix Hystrix)\n   - Request retries with jittered exponential backoff\n   - Failover to secondary regions\n\n2. Authentication & Authorization:\n   - OAuth 2.0/OIDC integration with multiple providers\n   - JWT validation with public key rotation\n   - RBAC with fine-grained permissions\n   - API key management with rate limiting\n   - mTLS for service-to-service communication\n\n3. Advanced Caching Strategy:\n```typescript\ninterface CacheStrategy {\n  levels: [\"edge\", \"gateway\", \"service\", \"database\"];\n  policies: {\n    edge: { ttl: 300, vary: [\"Authorization\", \"Accept-Language\"] };\n    gateway: { ttl: 60, compression: \"gzip\", etag: true };\n    service: { ttl: 30, invalidation: \"tag-based\" };\n  };\n}\n```\n\n4. Observability & Monitoring:\n   - Distributed tracing with Jaeger/Zipkin\n   - Prometheus metrics with custom SLIs\n   - Structured logging with correlation IDs\n   - Real-time dashboards with Grafana\n   - Alert management with PagerDuty integration\n\nPERFORMANCE OPTIMIZATION:\n- Connection pooling with keep-alive\n- HTTP/2 with server push capabilities\n- Response compression (gzip, brotli)\n- Request/response streaming for large payloads\n- Edge caching with CDN integration\n\nSECURITY FEATURES:\n```typescript\n// Security middleware stack\nconst securityStack = [\n  rateLimiter({ windowMs: 60000, max: 1000 }),\n  helmet({ contentSecurityPolicy: strictCSP }),\n  cors({ origin: allowedOrigins, credentials: true }),\n  sanitizer({ xss: true, sql: true, noSql: true }),\n  validator({ schemas: openAPISpecs })\n];\n```\n\nSCALING ARCHITECTURE:\n- Horizontal pod autoscaling based on CPU/memory\n- Database connection pooling with PgBouncer\n- Redis cluster for session management\n- Message queues (RabbitMQ/Kafka) for async processing\n- Blue-green deployment with traffic splitting\n\nERROR HANDLING:\n- Structured error responses with RFC 7807\n- Graceful degradation patterns\n- Timeout handling with circuit breakers\n- Dead letter queues for failed requests\n- Automated incident response\n\nExpected output: Enterprise API gateway with service mesh integration, advanced caching, monitoring, and deployment configuration.',
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
        name: 'Enterprise React Architecture with Advanced Patterns',
        text: 'CONTEXT: Build a scalable React component system for a large enterprise application with complex state management, performance optimization, and accessibility compliance (WCAG 2.1 AA).\n\nARCHITECTURAL REQUIREMENTS:\n```typescript\n// Component System Architecture\ninterface ComponentSystem {\n  theme: DesignSystem;\n  components: ComponentLibrary;\n  hooks: CustomHookRegistry;\n  utils: UtilityLibrary;\n  testing: TestingFramework;\n}\n\n// Advanced TypeScript Patterns\ntype PropsWithVariants<T> = T & {\n  variant?: keyof ComponentVariants;\n  size?: ComponentSize;\n  state?: ComponentState;\n};\n\ntype ComponentWithForwardRef<T, R = HTMLElement> = \n  React.ForwardRefExoticComponent<PropsWithVariants<T> & React.RefAttributes<R>>;\n```\n\nCOMPONENT ARCHITECTURE:\n1. Compound Components with Context:\n```typescript\nconst Table = {\n  Root: TableRoot,\n  Header: TableHeader,\n  Body: TableBody,\n  Row: TableRow,\n  Cell: TableCell,\n  Pagination: TablePagination\n};\n\n// Usage: <Table.Root><Table.Header>...</Table.Header></Table.Root>\n```\n\n2. Render Props & Higher-Order Components:\n   - DataProvider with render props for complex data management\n   - withInfiniteScroll HOC for virtualized lists\n   - useVirtualization hook for 10k+ item performance\n   - Intersection Observer API for lazy loading\n\n3. Advanced State Management:\n   - Context composition with multiple providers\n   - State machines with XState integration\n   - Optimistic updates with rollback capability\n   - Real-time synchronization with WebSocket integration\n\nPERFORMANCE OPTIMIZATION:\n```typescript\n// Memoization strategies\nconst OptimizedComponent = React.memo(Component, customComparison);\n\n// Code splitting with React.lazy\nconst LazyComponent = React.lazy(() => import(\'./HeavyComponent\'));\n\n// Virtual scrolling for large datasets\ninterface VirtualizedListProps<T> {\n  items: T[];\n  itemHeight: number;\n  renderItem: (item: T, index: number) => React.ReactNode;\n  overscan?: number;\n}\n```\n\nADVANCED HOOKS IMPLEMENTATION:\n1. useInfiniteQuery with caching and error recovery\n2. useOptimisticUpdate with conflict resolution\n3. useWebSocket with automatic reconnection\n4. useMediaQuery with SSR compatibility\n5. useIntersectionObserver for progressive loading\n6. useKeyboardNavigation for complex interactions\n\nACCESSIBILITY FEATURES:\n- ARIA live regions for dynamic content\n- Focus management with focus traps\n- Keyboard navigation patterns\n- Screen reader announcements\n- Color contrast compliance\n- Reduced motion preferences\n\nTESTING STRATEGY:\n```typescript\n// Component testing with MSW and React Testing Library\ndescribe(\'DataTable\', () => {\n  beforeEach(() => {\n    server.use(\n      rest.get(\'/api/data\', (req, res, ctx) => {\n        return res(ctx.json(mockData));\n      })\n    );\n  });\n\n  it(\'handles sorting and filtering\', async () => {\n    render(<DataTable endpoint="/api/data" />);\n    // Test implementation\n  });\n});\n```\n\nExpected output: Production-ready React system with advanced patterns, performance optimization, accessibility compliance, and comprehensive testing.',
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