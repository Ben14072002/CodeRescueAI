import { Button } from "@/components/ui/button";
import { Play, Bot, Unlink, Code } from "lucide-react";

interface LandingSectionProps {
  onGetStarted: () => void;
}

export function LandingSection({ onGetStarted }: LandingSectionProps) {
  return (
    <section className="text-center mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Hero illustration */}
        <div className="mb-8 p-8 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-center space-x-4">
            <Bot className="w-16 h-16 text-primary" />
            <Unlink className="w-10 h-10 text-amber-500" />
            <Code className="w-16 h-16 text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          When your AI coding assistant gets stuck, we break you free
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Get unstuck fast with proven strategies and prompts designed to rescue your AI development workflow
        </p>
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Get Unstuck Now
        </Button>
      </div>
    </section>
  );
}
