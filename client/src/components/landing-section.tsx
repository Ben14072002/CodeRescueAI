import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CostCalculator } from "@/components/cost-calculator";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { 
  Play, 
  Bot, 
  Unlink, 
  Code, 
  CheckCircle, 
  Zap, 
  Target, 
  Users, 
  Star,
  ArrowRight,
  Clock,
  Brain,
  Lightbulb,
  TrendingUp
} from "lucide-react";

interface LandingSectionProps {
  onGetStarted: () => void;
}

export function LandingSection({ onGetStarted }: LandingSectionProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-20 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Badge */}
          <div className="mb-6">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2 animate-pulse">
              <Zap className="w-4 h-4 mr-2" />
              🎉 NEW: AI Development Wizard + Free Templates Available!
            </Badge>
          </div>
          
          {/* Main Headlines */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            AI Assistant<br />
            <span className="text-slate-200">Got Stuck?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-medium">
            Break free in under 10 minutes with battle-tested strategies
          </p>
          
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">Stop wasting hours when Cursor, Replit AI, Loveable or Windsurf get stuck in loops.</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Rescue Session
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg w-full sm:w-auto"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Brain className="w-5 h-5 mr-2" />
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
              Average rescue time: 8 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
              94% success rate
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-emerald-500" />
              500+ developers rescued
            </div>
          </div>
        </div>
      </section>



      {/* Problem/Solution Section */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
              Every Developer's Nightmare
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Sound familiar? You're not alone. Here's what CodeBreaker solves:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Problem Side */}
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">Before CodeBreaker</h3>
                <ul className="space-y-4">
                  {[
                    "AI builds everything at once, creating chaos",
                    "Can't connect two simple features together", 
                    "Suggests the same broken solution repeatedly",
                    "No clear plan, just random code generation",
                    "Hours wasted in endless debug loops"
                  ].map((problem, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <span className="text-red-500 mr-3 mt-1">✗</span>
                      {problem}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Solution Side */}
            <Card className="bg-emerald-500/10 border-emerald-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-emerald-400 mb-6">With CodeBreaker</h3>
                <ul className="space-y-4">
                  {[
                    "Break complex problems into manageable steps",
                    "Get specific prompts that redirect AI focus",
                    "Clear action plans with success criteria",
                    "Progress tracking with built-in timers",
                    "Back to productive coding in minutes"
                  ].map((solution, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <CheckCircle className="text-emerald-500 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Features Section - Detailed */}
      <section id="how-it-works" className="mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
              Everything You Need to Get Unstuck
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              See exactly what happens when you use each feature. No more guessing if it works.
            </p>
          </div>

          {/* AI Development Wizard Detailed Explanation */}
          <div className="mb-16">
            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">AI Development Wizard</h3>
                    <p className="text-purple-400">Your Personal Senior Developer Mentor</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100 mb-4">What Happens Step-by-Step:</h4>
                    <ol className="space-y-3 text-slate-300">
                      <li className="flex items-start">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                        <div>
                          <strong>Describe Your Problem:</strong> Tell the wizard what's stuck (e.g., "My React components won't update when state changes")
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                        <div>
                          <strong>Smart Questioning:</strong> The wizard asks specific questions to understand your exact situation and tech stack
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                        <div>
                          <strong>Diagnosis & Plan:</strong> Get a clear explanation of what's wrong and a step-by-step action plan
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                        <div>
                          <strong>Precise Prompts:</strong> Receive exact prompts to copy-paste into your AI assistant to fix the issue
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-slate-100 mb-4">Real Example Output:</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p><strong className="text-purple-400">Problem:</strong> "React state not updating UI"</p>
                      <p><strong className="text-purple-400">Diagnosis:</strong> Likely using object mutation instead of creating new state</p>
                      <p><strong className="text-purple-400">Prompt for AI:</strong></p>
                      <div className="bg-slate-800 p-3 rounded text-xs">
                        "I need to fix React state updates. Show me how to properly update state when working with objects and arrays. Include before/after examples using setState or useState hook."
                      </div>
                      <p><strong className="text-purple-400">Expected Fix Time:</strong> 5-8 minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Free Prompt Library Detailed Explanation */}
          <div className="mb-16">
            <Card className="bg-cyan-500/10 border-cyan-500/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-cyan-500/20 p-3 rounded-lg mr-4">
                    <Bot className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Free Prompt Library</h3>
                    <p className="text-cyan-400">Battle-Tested Prompts That Actually Work</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100 mb-4">What You Get:</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>• 50+ proven prompts for common issues</li>
                      <li>• Organized by problem type (debugging, features, optimization)</li>
                      <li>• Copy-paste ready templates</li>
                      <li>• Success rate tracking for each prompt</li>
                      <li>• Regular updates based on community feedback</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100 mb-4">Categories Include:</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Database Connection Issues</li>
                      <li>• API Integration Problems</li>
                      <li>• UI Component Bugs</li>
                      <li>• Authentication Failures</li>
                      <li>• Performance Optimization</li>
                      <li>• Deployment Problems</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-100 mb-3">Sample Prompt:</h4>
                    <div className="text-xs text-slate-300">
                      <p className="text-cyan-400 mb-2"><strong>Problem:</strong> Database queries failing</p>
                      <div className="bg-slate-800 p-2 rounded text-xs">
                        "My database queries are failing. Help me debug this step by step: 1) Check connection string format 2) Validate SQL syntax 3) Test with simple query first 4) Show error handling best practices"
                      </div>
                      <p className="mt-2 text-emerald-400"><strong>Success Rate:</strong> 89% (127 uses)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Problem Solving Process */}
          <div className="mb-12">
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-amber-500/20 p-3 rounded-lg mr-4">
                    <Lightbulb className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">The Complete Rescue Process</h3>
                    <p className="text-amber-400">From Stuck to Shipping in Under 10 Minutes</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    {
                      step: "1",
                      title: "Problem Detection",
                      description: "Smart analysis identifies exactly what type of issue you're facing",
                      time: "30 seconds"
                    },
                    {
                      step: "2", 
                      title: "Context Gathering",
                      description: "Quick questions about your tech stack, project type, and what you've tried",
                      time: "1-2 minutes"
                    },
                    {
                      step: "3",
                      title: "Solution Generation", 
                      description: "AI generates personalized, step-by-step action plan with specific prompts",
                      time: "2-3 minutes"
                    },
                    {
                      step: "4",
                      title: "Execution & Success",
                      description: "Follow the prompts, track progress, get back to productive coding",
                      time: "5-8 minutes"
                    }
                  ].map((phase, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-amber-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {phase.step}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-100 mb-2">{phase.title}</h4>
                      <p className="text-sm text-slate-300 mb-2">{phase.description}</p>
                      <Badge variant="outline" className="text-amber-400 border-amber-400">{phase.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              See It In Action - Start Free
            </Button>
            <p className="text-slate-400 mt-4">No credit card required • 3 free rescues monthly</p>
          </div>
        </div>
      </section>
      {/* Social Proof Section */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-100">
              Loved by Developers Worldwide
            </h2>
            <div className="flex items-center justify-center mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="ml-3 text-slate-300 font-semibold">4.9/5 from 500+ developers</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The new AI Development Wizard is incredible! It walked me through a complex database issue step-by-step. Saved 4 hours of debugging.",
                author: "Sarah Chen",
                role: "Frontend Developer"
              },
              {
                quote: "Love the free prompt library. Finally have battle-tested prompts that actually work instead of generic suggestions.",
                author: "Mike Rodriguez", 
                role: "Full Stack Developer"
              },
              {
                quote: "At $4.99/month, this is the best dev tool investment I've made. The personalized guidance beats any generic AI chat.",
                author: "Alex Thompson",
                role: "Senior Engineer"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="surface-800 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-100">{testimonial.author}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Cost Calculator */}
      <CostCalculator />
      {/* Pricing Preview */}
      <section className="mb-20" id="pricing">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-100">
            Simple, Developer-Friendly Pricing
          </h2>
          <p className="text-xl text-slate-400 mb-4">
            Start free, upgrade when you're ready to ship faster
          </p>
          <div className="mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              🎉 Price Drop: Now just $4.99/month (was $9.99)
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="surface-800 border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-100">Rescue Starter</h3>
                <p className="text-4xl font-bold text-primary mb-6">$0</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    3 AI rescues per month
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Access to Free Prompt Library
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Basic problem detection
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Community support
                  </li>
                </ul>
                <Button 
                  onClick={onGetStarted}
                  className="w-full bg-slate-700 hover:bg-slate-600"
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            <Card className="surface-800 border-primary bg-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-100">Rescue Pro</h3>
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
                <p className="text-4xl font-bold text-primary mb-6">$4.99<span className="text-lg text-slate-400">/month</span></p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Full AI Development Wizard access
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Unlimited AI rescues
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Premium prompt templates
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Personalized step-by-step guidance
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Priority support & session history
                  </li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <FAQSection />
      {/* Final CTA */}
      <section className="text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border-primary/20">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
                Ready to Break Free from AI Frustration?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of developers who've already rescued their projects. 
                Your next breakthrough is just one session away.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Rescue Now
                </Button>
                <p className="text-sm text-slate-400">
                  No credit card required • Free to start
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
