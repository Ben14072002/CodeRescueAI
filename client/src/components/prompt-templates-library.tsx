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
        name: 'Production-Ready Auth Architecture',
        text: 'BUILD SECURE AUTHENTICATION SYSTEM\n\nI need to implement a production-ready authentication system. Guide me through:\n\n1. SECURITY-FIRST ARCHITECTURE:\n   - JWT vs session-based authentication pros/cons for my use case\n   - Secure password hashing with salt (bcrypt recommended settings)\n   - Token storage best practices (httpOnly cookies vs localStorage)\n   - CSRF protection implementation\n   - Rate limiting for login attempts\n\n2. DATABASE DESIGN:\n   - User table schema with security fields\n   - Password reset tokens table\n   - Session management tables if needed\n   - Proper indexing for performance\n\n3. IMPLEMENTATION CHECKLIST:\n   - Input validation and sanitization\n   - Secure password requirements\n   - Email verification flow\n   - Password reset functionality\n   - Multi-factor authentication considerations\n\n4. TESTING STRATEGY:\n   - Security test cases\n   - Authentication flow testing\n   - Edge case handling\n\nProvide code examples and explain the security reasoning behind each choice.',
        explanation: 'Comprehensive guide for building secure authentication from the ground up with security best practices.'
      },
      {
        name: 'JWT Implementation Best Practices',
        text: 'IMPLEMENT SECURE JWT AUTHENTICATION\n\nGuide me through implementing JWT authentication correctly:\n\n1. JWT SETUP REQUIREMENTS:\n   - Secure secret key generation and storage\n   - Appropriate token expiration times\n   - Refresh token implementation\n   - Payload structure (minimal, no sensitive data)\n\n2. SECURITY IMPLEMENTATIONS:\n   - Token signing and verification\n   - Blacklist/whitelist for token revocation\n   - Secure token transmission (Authorization header)\n   - HTTPS enforcement\n\n3. MIDDLEWARE SETUP:\n   - Authentication middleware for protected routes\n   - Token validation logic\n   - Error handling for expired/invalid tokens\n   - Request logging for security monitoring\n\n4. FRONTEND INTEGRATION:\n   - Secure token storage\n   - Automatic token refresh\n   - Request interceptors\n   - Logout functionality\n\nProvide complete working examples with security explanations for each component.',
        explanation: 'Step-by-step JWT implementation focusing on security best practices and common pitfalls to avoid.'
      },
      {
        name: 'Role-Based Access Control Setup',
        text: 'IMPLEMENT ROBUST PERMISSION SYSTEM\n\nHelp me build a scalable role-based access control (RBAC) system:\n\n1. RBAC ARCHITECTURE DESIGN:\n   - User, Role, and Permission entities\n   - Many-to-many relationships setup\n   - Hierarchical roles if needed\n   - Resource-based permissions\n\n2. DATABASE SCHEMA:\n   - Users table with role assignments\n   - Roles table with descriptions\n   - Permissions table with resource mapping\n   - Junction tables for relationships\n\n3. MIDDLEWARE IMPLEMENTATION:\n   - Permission checking middleware\n   - Route-level access control\n   - Resource-specific permissions\n   - Dynamic permission loading\n\n4. FRONTEND INTEGRATION:\n   - Conditional rendering based on permissions\n   - Menu/navigation filtering\n   - Button/action visibility\n   - Permission state management\n\nProvide code examples for both backend and frontend implementation with scalability considerations.',
        explanation: 'Complete RBAC system setup guide with database design and implementation patterns for scalable permission management.'
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
        name: 'Production-Ready API Client',
        text: 'BUILD ENTERPRISE-GRADE API INTEGRATION\n\nHelp me create a robust API client from the ground up:\n\n1. CLIENT ARCHITECTURE:\n   - HTTP client configuration (axios/fetch setup)\n   - Base URL and environment management\n   - Request/response interceptors\n   - Authentication token management\n   - Automatic token refresh logic\n\n2. ERROR HANDLING STRATEGY:\n   - Comprehensive error type definitions\n   - Network error vs API error handling\n   - Retry logic with exponential backoff\n   - Circuit breaker pattern for failing APIs\n   - Graceful degradation strategies\n\n3. PERFORMANCE OPTIMIZATION:\n   - Request/response caching\n   - Request deduplication\n   - Concurrent request limiting\n   - Response compression handling\n   - Request timeout configuration\n\n4. MONITORING & LOGGING:\n   - Request/response logging\n   - Performance metrics tracking\n   - Error rate monitoring\n   - API usage analytics\n\nProvide complete implementation with TypeScript types and explain the architecture decisions.',
        explanation: 'Comprehensive guide for building production-ready API clients with enterprise-level reliability and monitoring.'
      },
      {
        name: 'API Rate Limiting & Caching Setup',
        text: 'IMPLEMENT SMART API USAGE PATTERNS\n\nGuide me through setting up intelligent API usage:\n\n1. RATE LIMITING IMPLEMENTATION:\n   - Rate limit detection and handling\n   - Queue-based request management\n   - Priority-based request scheduling\n   - Backoff strategies (exponential, linear, custom)\n   - Rate limit header interpretation\n\n2. CACHING STRATEGY:\n   - Response caching layers (memory, localStorage, Redis)\n   - Cache invalidation policies\n   - TTL (Time To Live) configuration\n   - Conditional requests (ETag, Last-Modified)\n   - Cache warming strategies\n\n3. REQUEST OPTIMIZATION:\n   - Request batching when possible\n   - Pagination handling\n   - Data transformation and normalization\n   - Webhook integration for real-time updates\n   - GraphQL vs REST optimization\n\n4. RESILIENCE PATTERNS:\n   - Circuit breaker implementation\n   - Fallback data strategies\n   - Health check endpoints\n   - Graceful API versioning\n\nProvide working examples with performance metrics and explain when to use each pattern.',
        explanation: 'Advanced API optimization patterns focusing on performance, reliability, and efficient resource usage.'
      }
    ]
  },
  {
    id: 'scalable-frontend-architecture',
    title: 'Scalable Frontend Architecture',
    description: 'Build maintainable CSS and responsive design systems',
    category: 'Frontend',
    icon: Palette,
    color: 'text-purple-500',
    prompts: [
      {
        name: 'CSS Architecture & Design System',
        text: 'BUILD SCALABLE CSS ARCHITECTURE\n\nHelp me establish a maintainable CSS architecture from the start:\n\n1. CSS METHODOLOGY SETUP:\n   - BEM (Block Element Modifier) naming convention\n   - Component-based CSS organization\n   - CSS custom properties (variables) system\n   - Utility-first vs component-first approach decision\n   - CSS-in-JS vs traditional CSS trade-offs\n\n2. DESIGN SYSTEM FOUNDATION:\n   - Color palette and theming system\n   - Typography scale and hierarchy\n   - Spacing system (margin, padding grid)\n   - Component library structure\n   - Design tokens implementation\n\n3. RESPONSIVE DESIGN STRATEGY:\n   - Mobile-first breakpoint system\n   - Fluid typography and spacing\n   - Container queries vs media queries\n   - Responsive image and media handling\n   - Touch-friendly interaction design\n\n4. PERFORMANCE OPTIMIZATION:\n   - CSS bundle optimization\n   - Critical CSS extraction\n   - Unused CSS elimination\n   - CSS loading strategies\n   - Animation performance\n\nProvide a complete setup guide with file structure and explain the scalability benefits of each choice.',
        explanation: 'Comprehensive guide for building scalable CSS architecture with design systems and performance optimization.'
      },
      {
        name: 'Modern Layout Techniques Setup',
        text: 'IMPLEMENT MODERN CSS LAYOUT SYSTEMS\n\nGuide me through setting up robust layout systems:\n\n1. CSS GRID MASTERY:\n   - Grid container and item setup\n   - Named grid lines and areas\n   - Implicit vs explicit grid behavior\n   - Responsive grid patterns\n   - Grid fallbacks for older browsers\n\n2. FLEXBOX BEST PRACTICES:\n   - Flex container optimization\n   - Flex item behavior control\n   - Common flexbox patterns\n   - Flexbox vs Grid decision matrix\n   - Accessibility considerations\n\n3. ADVANCED LAYOUT PATTERNS:\n   - Container queries implementation\n   - Intrinsic web design principles\n   - Subgrid for nested layouts\n   - CSS logical properties\n   - Multi-column layouts\n\n4. RESPONSIVE STRATEGY:\n   - Fluid layouts without breakpoints\n   - Component-level responsiveness\n   - Progressive enhancement approach\n   - Performance-first responsive images\n   - Accessibility-focused responsive design\n\nProvide working examples with progressive enhancement and explain when to use each technique.',
        explanation: 'Modern CSS layout techniques focusing on flexibility, maintainability, and progressive enhancement.'
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