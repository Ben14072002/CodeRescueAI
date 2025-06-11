import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Check, ArrowRight } from "lucide-react";

interface SignupChoiceProps {
  onTrialSignup: () => void;
  onFreeSignup: () => void;
  onBack: () => void;
}

export function SignupChoice({ onTrialSignup, onFreeSignup, onBack }: SignupChoiceProps) {
  const [selectedPlan, setSelectedPlan] = useState<"trial" | "free" | null>(null);

  const handleContinue = () => {
    if (selectedPlan === "trial") {
      onTrialSignup();
    } else if (selectedPlan === "free") {
      onFreeSignup();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose Your Plan</h2>
        <p className="text-slate-400">Start with a 3-day Pro trial or use the free plan</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Trial Option */}
        <Card 
          className={`cursor-pointer transition-all border-2 ${
            selectedPlan === "trial" 
              ? "border-purple-500 bg-purple-500/10" 
              : "border-slate-700 hover:border-purple-400"
          }`}
          onClick={() => setSelectedPlan("trial")}
        >
          <CardHeader className="text-center pb-4">
            <div className="relative">
              <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <Badge className="bg-purple-500 text-white text-xs">Recommended</Badge>
            </div>
            <CardTitle className="text-xl text-purple-200">Start 3-Day Pro Trial</CardTitle>
            <p className="text-sm text-slate-400">Full access to all Pro features</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Unlimited AI rescues
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Custom prompt generator
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Premium strategies
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Priority support
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Payment method required • No charge during trial
              </p>
              <p className="text-xs text-slate-500">
                $4.99/month after trial unless cancelled
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Free Option */}
        <Card 
          className={`cursor-pointer transition-all border-2 ${
            selectedPlan === "free" 
              ? "border-slate-500 bg-slate-500/10" 
              : "border-slate-700 hover:border-slate-500"
          }`}
          onClick={() => setSelectedPlan("free")}
        >
          <CardHeader className="text-center pb-4">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-4" />
            <CardTitle className="text-xl text-slate-200">Use Free Plan</CardTitle>
            <p className="text-sm text-slate-400">Basic features to get started</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                1 AI rescue per month
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <span className="w-4 h-4 mr-2 text-slate-600">×</span>
                Custom prompt generator
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <span className="w-4 h-4 mr-2 text-slate-600">×</span>
                Premium strategies
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Community support
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                No payment required
              </p>
              <p className="text-xs text-slate-500">
                Upgrade anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan}
          size="lg"
          className={`w-full ${
            selectedPlan === "trial" 
              ? "bg-purple-600 hover:bg-purple-700" 
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          {selectedPlan === "trial" ? "Start Free Trial" : selectedPlan === "free" ? "Continue with Free" : "Select a Plan"}
        </Button>
        
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}