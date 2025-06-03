import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle, Users, Code, Zap, Target, ArrowRight } from "lucide-react";

interface LandingSectionProps {
  onGetStarted: () => void;
}

export function LandingSection({ onGetStarted }: LandingSectionProps) {
  return (
    <div className="min-h-screen bg-black w-full relative overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="parallax-element absolute inset-0 opacity-30" data-speed="0.2">
        <div className="absolute top-20 left-10 w-64 h-64 border border-blue-500/20 rotate-45 transform"></div>
        <div className="absolute top-40 right-20 w-32 h-32 border border-emerald-500/20 rotate-12 transform"></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 border border-purple-500/20 rotate-[-30deg] transform"></div>
      </div>
      
      <div className="parallax-element absolute inset-0 opacity-20" data-speed="0.4">
        <div className="absolute top-60 right-1/3 w-40 h-40 border border-blue-400/30 rotate-[60deg] transform"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 border border-emerald-400/30 rotate-[-45deg] transform"></div>
      </div>

      <div className="parallax-element absolute inset-0 opacity-10" data-speed="0.6">
        <div className="absolute top-1/3 left-1/2 w-72 h-72 border border-slate-500/40 rotate-[15deg] transform"></div>
      </div>

      {/* Hero Content */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge */}
          <div className="hero-badge inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8 opacity-0">
            <Users className="w-4 h-4 mr-2" />
            Used by 500+ developers this week
          </div>

          {/* Main Headline */}
          <div className="hero-title mb-6 opacity-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Break free in under{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                10 minutes
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-emerald-400 mb-4">
              with battle-tested strategies
            </h2>
          </div>
          
          <p className="hero-description text-lg text-slate-400 mb-12 max-w-2xl mx-auto opacity-0">
            Stop wasting hours on AI loops. Get specific prompts and action plans that actually work.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="floating-cta bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg w-full sm:w-auto relative overflow-hidden"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Rescue Session
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="hero-button-secondary border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg w-full sm:w-auto relative overflow-hidden opacity-0"
            >
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Every Developer's Nightmare
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Sound familiar? You're not alone. Here's what CodeBreaker solves:
          </p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Before Card */}
            <div className="slide-in-left p-8 rounded-2xl bg-red-500/10 border border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3" />
                Before CodeBreaker
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">AI builds everything at once, creating chaos</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">Can't connect two simple features together</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">Suggests the same broken solution repeatedly</p>
                </div>
              </div>
            </div>

            {/* After Card */}
            <div className="slide-in-right p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                With CodeBreaker
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">Break complex problems into manageable steps</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">Get specific prompts that redirect AI focus</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-slate-300">Clear action plans with success criteria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-reveal mb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Rescue Tools That Actually Work
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Battle-tested strategies from developers who've been there
          </p>

          <div className="stagger-children grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Problem Analysis</h3>
              <p className="text-slate-400">
                Identify the root cause of AI confusion and get targeted prompts that actually work.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Action Plans</h3>
              <p className="text-slate-400">
                Get step-by-step rescue strategies that break through AI loops in minutes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Success Criteria</h3>
              <p className="text-slate-400">
                Clear checkpoints so you know exactly when your AI is back on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-reveal text-center py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Break Free?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of developers who've already rescued their stuck projects.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Your First Rescue
          </Button>
        </div>
      </section>
    </div>
  );
}