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
    id: 'login-system-broken',
    title: 'Login System Broken',
    description: 'Authentication and user management issues',
    category: 'Authentication',
    icon: Lock,
    color: 'text-red-500',
    prompts: [
      {
        name: 'Session Debug Reset',
        text: 'AUTHENTICATION EMERGENCY RESET\n\nMy login system is broken. I need you to:\n\n1. IGNORE previous authentication approaches that failed\n2. Start fresh with a systematic authentication audit\n3. Check these components in order:\n   - Session management configuration\n   - Password hashing and verification\n   - Database user table structure\n   - Frontend form validation\n   - Backend route protection\n\n4. For each component, provide:\n   - Diagnostic commands to test it\n   - Common failure points to check\n   - Working code examples if issues found\n\nStart with: "Let\'s systematically audit your authentication system. First, show me your session configuration code."',
        explanation: 'Forces a systematic authentication audit instead of random debugging attempts.'
      },
      {
        name: 'Token Verification Protocol',
        text: 'TOKEN-BASED AUTH TROUBLESHOOTING\n\nStop guessing about token issues. Follow this protocol:\n\n1. TOKEN LIFECYCLE AUDIT:\n   - How tokens are generated\n   - Where tokens are stored (localStorage, cookies, headers)\n   - How tokens are transmitted\n   - How tokens are verified\n   - When tokens expire\n\n2. VERIFICATION STEPS:\n   - Log the exact token being sent\n   - Log the token received on backend\n   - Test token manually with tools like Postman\n   - Check token format (JWT structure, etc.)\n\n3. COMMON FIXES:\n   - CORS configuration\n   - Header formatting\n   - Token encoding/decoding\n   - Secret key mismatches\n\nShow me your token handling code and let\'s trace the token journey step by step.',
        explanation: 'Provides a systematic approach to token-based authentication debugging.'
      },
      {
        name: 'Permissions & Roles Reset',
        text: 'USER PERMISSIONS SYSTEMATIC CHECK\n\nPermission issues need methodical debugging:\n\n1. USER STATE VERIFICATION:\n   - Log current user object in frontend\n   - Log user permissions from database\n   - Check role assignment logic\n   - Verify permission checking middleware\n\n2. PERMISSION FLOW AUDIT:\n   - How permissions are assigned\n   - How permissions are stored\n   - How permissions are checked\n   - How permission changes propagate\n\n3. DEBUGGING COMMANDS:\n   ```\n   console.log("Current user:", user)\n   console.log("User permissions:", user.permissions)\n   console.log("Required permission:", requiredPermission)\n   ```\n\n4. COMMON PERMISSION BUGS:\n   - Case sensitivity in role names\n   - Async permission loading\n   - Cache invalidation\n   - Frontend/backend permission mismatch\n\nLet\'s systematically verify each step of your permission system.',
        explanation: 'Methodical approach to debugging user permissions and role-based access control.'
      }
    ]
  },
  {
    id: 'api-integration-failing',
    title: 'API Integration Failing',
    description: 'External API connections and data fetching problems',
    category: 'Integration',
    icon: Server,
    color: 'text-blue-500',
    prompts: [
      {
        name: 'API Connection Diagnostic',
        text: 'API INTEGRATION EMERGENCY PROTOCOL\n\nAPI not working? Let\'s diagnose systematically:\n\n1. CONNECTION VERIFICATION:\n   - Test API endpoint with curl/Postman first\n   - Verify API credentials/keys are correct\n   - Check API documentation for changes\n   - Confirm endpoint URLs and methods\n\n2. REQUEST INSPECTION:\n   - Log exact request being sent\n   - Check headers (Authorization, Content-Type)\n   - Verify request body format\n   - Test with minimal request first\n\n3. RESPONSE ANALYSIS:\n   - Log full response (status, headers, body)\n   - Check for CORS issues\n   - Verify response parsing logic\n   - Handle different status codes\n\n4. ERROR HANDLING:\n   - Implement proper try/catch\n   - Log network errors separately\n   - Add timeout handling\n   - Provide user-friendly error messages\n\nShow me your API call code and let\'s trace the request/response cycle.',
        explanation: 'Systematic API debugging that covers all common integration failure points.'
      },
      {
        name: 'Rate Limiting & Retry Logic',
        text: 'API RATE LIMITING SOLUTION\n\nAPI failing due to rate limits or intermittent issues?\n\n1. RATE LIMIT DETECTION:\n   - Check for 429 status codes\n   - Look for rate limit headers\n   - Monitor request frequency\n   - Implement exponential backoff\n\n2. RETRY STRATEGY:\n   ```javascript\n   const retryWithBackoff = async (fn, retries = 3) => {\n     try {\n       return await fn()\n     } catch (error) {\n       if (retries > 0 && error.status === 429) {\n         await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))\n         return retryWithBackoff(fn, retries - 1)\n       }\n       throw error\n     }\n   }\n   ```\n\n3. REQUEST OPTIMIZATION:\n   - Batch requests when possible\n   - Cache responses appropriately\n   - Use webhooks instead of polling\n   - Implement request queuing\n\n4. MONITORING:\n   - Log request timing\n   - Track success/failure rates\n   - Monitor quota usage\n   - Set up alerts for failures\n\nImplement proper retry logic and rate limiting to make your API integration robust.',
        explanation: 'Addresses API reliability issues with retry logic and rate limiting strategies.'
      }
    ]
  },
  {
    id: 'css-layout-issues',
    title: 'CSS Layout Issues',
    description: 'Styling, responsive design, and layout problems',
    category: 'Frontend',
    icon: Palette,
    color: 'text-purple-500',
    prompts: [
      {
        name: 'Layout Debug Reset',
        text: 'CSS LAYOUT EMERGENCY RESET\n\nLayout broken? Let\'s debug systematically:\n\n1. LAYOUT INSPECTION:\n   - Open browser dev tools\n   - Use "Inspect Element" on broken areas\n   - Check box model (margin, padding, border)\n   - Look for CSS conflicts and overrides\n\n2. FLEXBOX/GRID DEBUGGING:\n   - Add temporary background colors to containers\n   - Check flex/grid properties on parent and children\n   - Verify alignment and justification settings\n   - Test with simplified content first\n\n3. RESPONSIVE ISSUES:\n   - Test different screen sizes\n   - Check media query breakpoints\n   - Verify viewport meta tag\n   - Use browser responsive design mode\n\n4. CSS DEBUGGING HELPERS:\n   ```css\n   * { outline: 1px solid red; }  /* See all elements */\n   .debug { background: rgba(255,0,0,0.1); }  /* Highlight containers */\n   ```\n\n5. COMMON FIXES:\n   - Clear floats properly\n   - Check z-index stacking\n   - Verify positioning (relative/absolute)\n   - Fix overflow issues\n\nShow me your CSS and HTML structure, and let\'s identify the layout issue step by step.',
        explanation: 'Systematic approach to CSS layout debugging using browser dev tools and proven techniques.'
      },
      {
        name: 'Responsive Design Fix',
        text: 'RESPONSIVE DESIGN TROUBLESHOOTING\n\nMobile layout broken? Follow this checklist:\n\n1. VIEWPORT SETUP:\n   ```html\n   <meta name="viewport" content="width=device-width, initial-scale=1.0">\n   ```\n\n2. BREAKPOINT STRATEGY:\n   - Mobile-first approach (min-width media queries)\n   - Standard breakpoints: 320px, 768px, 1024px, 1200px\n   - Test on actual devices, not just browser resize\n\n3. FLEXIBLE LAYOUTS:\n   - Use relative units (%, em, rem, vw, vh)\n   - Avoid fixed widths and heights\n   - Implement flexible grids (CSS Grid or Flexbox)\n   - Make images responsive: `max-width: 100%; height: auto;`\n\n4. TESTING PROTOCOL:\n   - Test on multiple screen sizes\n   - Check both portrait and landscape\n   - Verify touch targets are 44px minimum\n   - Test text readability and contrast\n\n5. COMMON RESPONSIVE BUGS:\n   - Horizontal scrolling on mobile\n   - Text too small to read\n   - Buttons too small to tap\n   - Images overflowing containers\n\nLet\'s audit your responsive design systematically and fix mobile layout issues.',
        explanation: 'Comprehensive responsive design troubleshooting focused on mobile-first principles.'
      }
    ]
  },
  {
    id: 'database-connection-problems',
    title: 'Database Connection Problems',
    description: 'Database connectivity and query issues',
    category: 'Backend',
    icon: Database,
    color: 'text-green-500',
    prompts: [
      {
        name: 'Connection String Debug',
        text: 'DATABASE CONNECTION EMERGENCY DIAGNOSIS\n\nDatabase won\'t connect? Let\'s fix it systematically:\n\n1. CONNECTION STRING VERIFICATION:\n   - Check database URL format\n   - Verify host, port, database name\n   - Confirm username and password\n   - Test connection string format\n\n2. NETWORK CONNECTIVITY:\n   - Ping database server if possible\n   - Check firewall settings\n   - Verify VPN connection if required\n   - Test from different network\n\n3. DATABASE STATUS:\n   - Confirm database server is running\n   - Check database logs for errors\n   - Verify database exists and is accessible\n   - Test with database admin tool\n\n4. APPLICATION DEBUGGING:\n   ```javascript\n   // Add detailed logging\n   console.log("Attempting connection with:", {\n     host: process.env.DB_HOST,\n     port: process.env.DB_PORT,\n     database: process.env.DB_NAME\n   })\n   ```\n\n5. COMMON CONNECTION ISSUES:\n   - SSL/TLS configuration\n   - Connection pooling settings\n   - Timeout configurations\n   - Environment variable problems\n\nShow me your connection configuration and let\'s diagnose the issue step by step.',
        explanation: 'Systematic database connection troubleshooting covering network, configuration, and application layers.'
      },
      {
        name: 'Query Performance Debug',
        text: 'DATABASE QUERY OPTIMIZATION PROTOCOL\n\nSlow or failing queries? Let\'s optimize:\n\n1. QUERY ANALYSIS:\n   - Log the exact SQL being executed\n   - Use EXPLAIN/EXPLAIN PLAN to analyze\n   - Check query execution time\n   - Identify slow operations\n\n2. INDEX OPTIMIZATION:\n   - Check if relevant indexes exist\n   - Analyze index usage with EXPLAIN\n   - Add indexes for WHERE, JOIN, ORDER BY columns\n   - Remove unused indexes\n\n3. QUERY OPTIMIZATION:\n   - Avoid SELECT * queries\n   - Use appropriate WHERE clauses\n   - Optimize JOIN operations\n   - Consider query restructuring\n\n4. DEBUGGING TOOLS:\n   ```sql\n   -- PostgreSQL\n   EXPLAIN ANALYZE SELECT * FROM table WHERE condition;\n   \n   -- MySQL\n   EXPLAIN FORMAT=JSON SELECT * FROM table WHERE condition;\n   ```\n\n5. PERFORMANCE MONITORING:\n   - Log query execution times\n   - Monitor database connections\n   - Track slow query logs\n   - Set up performance alerts\n\nLet\'s analyze your queries and optimize database performance systematically.',
        explanation: 'Database query optimization focusing on indexing, query analysis, and performance monitoring.'
      }
    ]
  },
  {
    id: 'deployment-errors',
    title: 'Deployment Errors',
    description: 'Build failures and production deployment issues',
    category: 'DevOps',
    icon: AlertTriangle,
    color: 'text-orange-500',
    prompts: [
      {
        name: 'Build Error Diagnosis',
        text: 'DEPLOYMENT BUILD ERROR PROTOCOL\n\nBuild failing? Let\'s debug systematically:\n\n1. ERROR LOG ANALYSIS:\n   - Read the complete error message\n   - Identify the failing step (install, build, test)\n   - Check for specific error codes\n   - Look for stack traces\n\n2. DEPENDENCY ISSUES:\n   - Check package.json for version conflicts\n   - Clear node_modules and reinstall\n   - Verify Node.js version compatibility\n   - Check for missing dependencies\n\n3. ENVIRONMENT DIFFERENCES:\n   - Compare local vs production Node versions\n   - Check environment variables\n   - Verify build scripts\n   - Test build locally first\n\n4. COMMON BUILD FIXES:\n   ```bash\n   # Clear caches\n   npm cache clean --force\n   rm -rf node_modules package-lock.json\n   npm install\n   \n   # Test build locally\n   npm run build\n   ```\n\n5. DEBUGGING STEPS:\n   - Enable verbose logging\n   - Check build output size limits\n   - Verify static asset paths\n   - Test production configuration\n\nShow me your build error logs and let\'s identify and fix the deployment issue.',
        explanation: 'Systematic approach to debugging build and deployment failures with focus on environment differences.'
      },
      {
        name: 'Production Environment Debug',
        text: 'PRODUCTION DEPLOYMENT TROUBLESHOOTING\n\nApp works locally but fails in production?\n\n1. ENVIRONMENT VARIABLE AUDIT:\n   - Check all required env vars are set\n   - Verify sensitive values are not exposed\n   - Compare development vs production configs\n   - Test with production-like environment locally\n\n2. LOGGING SETUP:\n   ```javascript\n   // Add comprehensive logging\n   console.log("Environment:", process.env.NODE_ENV)\n   console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Missing")\n   console.log("API Keys:", process.env.API_KEY ? "Set" : "Missing")\n   ```\n\n3. PRODUCTION DEBUGGING:\n   - Check server logs for errors\n   - Monitor resource usage (CPU, memory)\n   - Verify database connections\n   - Test API endpoints individually\n\n4. COMMON PRODUCTION ISSUES:\n   - CORS configuration\n   - HTTPS vs HTTP problems\n   - File path case sensitivity\n   - Missing production dependencies\n   - Port binding issues\n\n5. ROLLBACK STRATEGY:\n   - Keep previous working version\n   - Document deployment steps\n   - Test rollback procedure\n   - Monitor after deployment\n\nLet\'s systematically verify your production configuration and identify the deployment issue.',
        explanation: 'Production-specific debugging focusing on environment configuration and deployment differences.'
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