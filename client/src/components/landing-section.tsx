import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CostCalculator } from "@/components/cost-calculator";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { HoverMazeEffect } from "./background-effects";
import { initializeScrollAnimations } from "@/lib/scroll-animations";
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
  useEffect(() => {
    // Trigger hero animations on mount
    const animateHero = () => {
      // Animate headline words with staggered delays
      const words = document.querySelectorAll('.hero-headline .word');
      words.forEach((word, index) => {
        const delay = parseInt(word.getAttribute('data-delay') || '0');
        setTimeout(() => {
          (word as HTMLElement).style.animationDelay = `${delay}ms`;
        }, delay);
      });

      // Animate other elements
      setTimeout(() => {
        const badge = document.querySelector('.hero-badge');
        const logo = document.querySelector('.hero-logo');
        const typewriter = document.querySelector('.typewriter-container');
        const description = document.querySelector('.hero-description');
        const buttons = document.querySelector('.hero-buttons');
        const secondaryBtn = document.querySelector('.hero-button-secondary');

        if (badge) badge.classList.add('animate');
        if (logo) logo.classList.add('animate');
        if (typewriter) typewriter.classList.add('animate');
        if (description) description.classList.add('animate');
        if (buttons) buttons.classList.add('animate');
        if (secondaryBtn) secondaryBtn.classList.add('animate');

        // Start typewriter effect
        const typewriterText = document.querySelector('.typewriter-text');
        if (typewriterText) {
          const text = typewriterText.getAttribute('data-text') || '';
          setTimeout(() => {
            typewriterText.textContent = text;
          }, 1200);
        }
      }, 800);
    };

    // Small delay to ensure DOM is ready
    setTimeout(animateHero, 100);

    // Initialize scroll animations
    initializeScrollAnimations();
  }, []);

  return (
    <div className="min-h-screen relative bg-slate-950">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="parallax-element geometric-bg absolute top-20 left-10 w-16 h-16 border border-blue-500/20 rotate-45" data-speed="0.3" data-offset="0"></div>
        <div className="parallax-element geometric-bg absolute top-40 right-20 w-12 h-12 border border-emerald-500/20" data-speed="0.5" data-offset="20"></div>
        <div className="parallax-element geometric-bg absolute bottom-40 left-20 w-20 h-20 border border-cyan-500/20 rotate-12" data-speed="0.2" data-offset="10"></div>
        <div className="parallax-element geometric-bg absolute bottom-20 right-10 w-14 h-14 border border-purple-500/20 -rotate-12" data-speed="0.4" data-offset="-10"></div>
        
        {/* Additional parallax elements */}
        <div className="parallax-element absolute top-1/3 left-1/2 w-8 h-8 border border-blue-400/10 rounded-full" data-speed="0.6" data-offset="30"></div>
        <div className="parallax-element absolute top-2/3 right-1/3 w-6 h-6 border border-green-400/10" data-speed="0.25" data-offset="-20"></div>
      </div>
      {/* Hero Section */}
      <section className="text-center mb-20 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Badge */}
          <div className="hero-badge mb-8 opacity-0">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 animate-pulse">
              <Zap className="w-4 h-4 mr-2" />
              Used by 500+ developers this week
            </Badge>
          </div>
          
          {/* Logo */}
          <div className="hero-logo mb-8 opacity-0">
            <img 
              src="/attached_assets/Design sans titre (22).png" 
              alt="CodeBreaker Logo" 
              className="mx-auto w-64 h-auto"
            />
          </div>

          {/* Main Headlines */}
          <h1 className="hero-headline text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent leading-tight opacity-0">
            <span className="word" data-delay="0">AI</span> <span className="word" data-delay="100">Assistant</span><br />
            <span className="word text-slate-200" data-delay="200">Got</span> <span className="word text-slate-200" data-delay="300">Stuck?</span>
          </h1>
          
          <div className="typewriter-container opacity-0">
            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-medium typewriter-text" data-text="Break free in under 10 minutes with battle-tested strategies">
            </p>
          </div>
          
          <p className="hero-description text-lg text-slate-400 mb-12 max-w-2xl mx-auto opacity-0">
            Stop wasting hours on AI loops. Get specific prompts and action plans that actually work.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="floating-cta bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg w-full sm:w-auto relative overflow-hidden"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Rescue Session
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="hero-button-secondary border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg w-full sm:w-auto relative overflow-hidden opacity-0"
            >
              <Brain className="w-5 h-5 mr-2" />
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="stagger-children flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
              Average rescue time: <span className="counter-animate ml-1 text-emerald-400 font-semibold" data-target="8" data-duration="1500">0</span> minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="counter-animate text-emerald-400 font-semibold" data-target="94" data-duration="2000">0</span>% success rate
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="counter-animate text-emerald-400 font-semibold" data-target="500" data-duration="2500">0</span>+ developers rescued
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="section-reveal mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
              Every Developer's Nightmare
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Sound familiar? You're not alone. Here's what CodeBreaker solves:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Problem Side */}
            <div className="scroll-animate-left">
              <HoverMazeEffect>
                <Card className="bg-red-500/10 border-red-500/20 transition-all duration-300 hover:bg-red-500/15 hover:border-red-500/30">
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
              </HoverMazeEffect>
            </div>

            {/* Solution Side */}
            <div className="scroll-animate-right">
              <HoverMazeEffect>
                <Card className="bg-emerald-500/10 border-emerald-500/20 transition-all duration-300 hover:bg-emerald-500/15 hover:border-emerald-500/30">
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
              </HoverMazeEffect>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-reveal mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
              Everything You Need to Get Unstuck
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Battle-tested strategies used by hundreds of developers
            </p>
          </div>

          <div className="feature-grid grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Smart Problem Detection",
                description: "Identify exactly what's wrong with your AI assistant in seconds",
                color: "text-amber-500"
              },
              {
                icon: Lightbulb,
                title: "Proven Prompt Strategies", 
                description: "Ready-to-use prompts that redirect AI back on track",
                color: "text-purple-500"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Step-by-step action plans with built-in success metrics",
                color: "text-emerald-500"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-item">
                <HoverMazeEffect>
                  <Card className="surface-800 border-slate-700 hover:border-primary/50 transition-all duration-300 hover:bg-slate-800/50">
                    <CardContent className="p-8 text-center">
                      <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4 animate-pulse-slow`} />
                      <h3 className="text-xl font-semibold mb-4 text-slate-100">{feature.title}</h3>
                      <p className="text-slate-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </HoverMazeEffect>
              </div>
            ))}
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
                quote: "Saved me 3 hours yesterday when Cursor got stuck in a loop. The prompts actually work!",
                author: "Sarah Chen",
                role: "Frontend Developer"
              },
              {
                quote: "Finally, a tool that understands AI assistant problems. Back to shipping features.",
                author: "Mike Rodriguez", 
                role: "Full Stack Developer"
              },
              {
                quote: "The step-by-step approach is genius. No more throwing random prompts at the wall.",
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
          <p className="text-xl text-slate-400 mb-12">
            Start free, upgrade when you're ready to ship faster
          </p>

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
                    Basic problem detection
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Standard solution library
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
                <p className="text-4xl font-bold text-primary mb-6">$9.99<span className="text-lg text-slate-400">/month</span></p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Unlimited AI rescues
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Advanced problem analysis
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Premium solution templates
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Priority email support
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Session history & analytics
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
