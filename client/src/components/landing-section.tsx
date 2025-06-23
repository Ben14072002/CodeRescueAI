import React from "react";
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
  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <div className="min-h-screen cosmic-background">
      {/* Hero Section */}
      <section className="text-center mb-20 animate-fade-in pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Badge */}
          <div className="mb-8">
            <Badge className="glassmorphism cosmic-glow px-6 py-3 text-base font-medium border-purple-400/30 animate-pulse">
              <Zap className="w-5 h-5 mr-2 text-purple-300" />
              NEW: AI Development Wizard + Free Templates Available!
            </Badge>
          </div>

          {/* Main Headlines */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="cosmic-gradient-text">AI Assistant</span><br />
            <span className="text-white">Got Stuck?</span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-200 mb-6 max-w-4xl mx-auto font-medium">
            Break free in under 10 minutes with battle-tested strategies
          </p>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">Stop wasting hours when Cursor, Replit AI, Loveable or Windsurf get stuck in loops.</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="cosmic-button text-white px-10 py-5 text-xl font-semibold rounded-xl cosmic-glow-hover w-full sm:w-auto"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Rescue Session
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="glassmorphism border-purple-400/30 text-white hover:bg-purple-500/20 px-10 py-5 text-xl rounded-xl cosmic-glow-hover w-full sm:w-auto"
              onClick={() => setShowVideo(true)}
            >
              <Brain className="w-6 h-6 mr-3" />
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-200">
            <div className="glassmorphism-dark px-6 py-4 rounded-xl flex items-center gap-3 cosmic-glow-hover">
              <Clock className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-xl">8 min</span>
              <span className="text-gray-300">Avg. Time</span>
            </div>
            <div className="glassmorphism-dark px-6 py-4 rounded-xl flex items-center gap-3 cosmic-glow-hover">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-xl">94%</span>
              <span className="text-gray-300">Success Rate</span>
            </div>
            <div className="glassmorphism-dark px-6 py-4 rounded-xl flex items-center gap-3 cosmic-glow-hover">
              <Users className="w-6 h-6 text-purple-300" />
              <span className="font-bold text-xl">500+</span>
              <span className="text-gray-300">Developers</span>
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
      {/* Features Section - Engaging & Digestible */}
      <section id="how-it-works" className="mb-32 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              <span className="cosmic-gradient-text">Powerful Features</span><br />
              <span className="text-white">to Simplify Your</span><br />
              <span className="text-white">Development Experience</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Battle-tested strategies that get you coding again in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "AI Development Wizard",
                description: "Personal senior developer that walks you through problems step-by-step with precision guidance",
                highlight: "Avg. rescue time: 8 minutes",
                color: "text-purple-400",
                bgColor: "bg-purple-500/20",
                borderColor: "border-purple-400/30",
                example: "Example: 'React state not updating' → Get exact prompts to fix it"
              },
              {
                icon: Bot,
                title: "Free Prompt Library", 
                description: "50+ battle-tested prompts for the most common coding problems",
                highlight: "89% success rate",
                color: "text-cyan-400",
                bgColor: "bg-cyan-500/10",
                borderColor: "border-cyan-500/20",
                example: "Database failing? Get the exact prompt that fixes it in 94% of cases"
              },
              {
                icon: Target,
                title: "Smart Problem Detection",
                description: "Instantly identifies what's wrong and creates a custom action plan",
                highlight: "Works in 30 seconds",
                color: "text-emerald-400",
                bgColor: "bg-emerald-500/10",
                borderColor: "border-emerald-500/20",
                example: "Tell us what's stuck → Get personalized solution in under a minute"
              }
            ].map((feature, index) => (
              <Card key={index} className={`${feature.bgColor} ${feature.borderColor} hover:scale-105 transition-all duration-200 group cursor-pointer`}>
                <CardContent className="p-8 text-center">
                  <div className={`${feature.bgColor} p-4 rounded-lg inline-block mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400 mb-4 leading-relaxed">{feature.description}</p>

                  <Badge className={`${feature.bgColor} ${feature.color} border-none mb-4`}>
                    {feature.highlight}
                  </Badge>

                  <div className="bg-slate-900/50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-slate-300 italic">"{feature.example}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Process Overview */}
          <div className="mt-24 text-center">
            <h3 className="text-4xl font-bold mb-12 text-white">How It Works</h3>
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
              {[
                { step: "1", text: "Describe your problem", time: "30 sec" },
                { step: "2", text: "Get smart questions", time: "1 min" },
                { step: "3", text: "Receive action plan", time: "2 min" },
                { step: "4", text: "Follow prompts & ship", time: "5 min" }
              ].map((phase, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex flex-col items-center">
                    <div className="cosmic-gradient-bg text-white rounded-full w-16 h-16 flex items-center justify-center font-bold mb-4 text-xl cosmic-glow group-hover:scale-110 transition-transform duration-300">
                      {phase.step}
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">{phase.text}</p>
                    <p className="text-gray-400">{phase.time}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-8 h-8 text-purple-400 mx-8 hidden lg:block cosmic-glow" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="cosmic-button text-white px-12 py-6 text-2xl font-bold transform hover:scale-105 transition-all cosmic-glow-hover rounded-2xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your First Rescue
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
      {/* Video Modal */}
          {showVideo && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h3 className="text-xl font-semibold text-slate-100">How CodeBreaker Works</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVideo(false)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    ✕
                  </Button>
                </div>
                <div className="p-6">
                  <video 
                    controls 
                    className="w-full h-auto rounded-lg"
                    style={{ maxHeight: '70vh' }}
                  >
                    <source src="/codebreaker-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          )}
      {/* Footer */}
      <Footer />
    </div>
  );
}