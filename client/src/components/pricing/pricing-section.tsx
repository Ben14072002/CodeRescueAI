import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Users } from "lucide-react";
import { PRICING_PLANS, type PricingPlan } from "@/lib/stripe";
import { useAuth } from "@/hooks/use-auth";

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>("pro");

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan === "free") {
      // Free plan doesn't require payment
      return;
    }
    
    if (!user) {
      // User needs to sign in first - trigger auth modal
      onSelectPlan(plan);
      return;
    }
    
    // Redirect to checkout with plan
    setLocation(`/checkout?plan=${plan}`);
  };

  const getPlanIcon = (plan: PricingPlan) => {
    switch (plan) {
      case "pro":
        return <Crown className="w-6 h-6" />;
      case "team":
        return <Users className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getPlanColor = (plan: PricingPlan) => {
    switch (plan) {
      case "pro":
        return "text-primary";
      case "team":
        return "text-purple-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start free and upgrade when you need more power
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => {
            const planKey = key as PricingPlan;
            const isPopular = planKey === "pro";
            const isCurrentPlan = user?.subscriptionTier === planKey;
            
            return (
              <Card 
                key={planKey}
                className={`relative surface-800 border-slate-700 ${
                  isPopular ? "border-primary bg-primary/5" : ""
                } ${selectedPlan === planKey ? "ring-2 ring-primary" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`${getPlanColor(planKey)} mr-2`}>
                      {getPlanIcon(planKey)}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-100">
                      {plan.name}
                    </CardTitle>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-100">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400">/month</span>
                    )}
                  </div>

                  {isCurrentPlan && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Current Plan
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(planKey)}
                    disabled={isCurrentPlan}
                    className={`w-full ${
                      planKey === "free"
                        ? "bg-slate-700 hover:bg-slate-600"
                        : planKey === "pro"
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isCurrentPlan 
                      ? "Current Plan" 
                      : planKey === "free" 
                      ? "Get Started" 
                      : "Upgrade Now"
                    }
                  </Button>

                  {planKey !== "free" && (
                    <p className="text-xs text-slate-500 text-center">
                      Cancel anytime • No hidden fees
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            All plans include our core AI rescue strategies and unlimited support
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <span>• 30-day money-back guarantee</span>
            <span>• Secure payments with Stripe</span>
            <span>• Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}