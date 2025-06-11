import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Users } from "lucide-react";
import { PRICING_PLANS, type PricingPlan } from "@/lib/stripe";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [, setLocation] = useLocation();
  const [isYearly, setIsYearly] = useState(false);

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
      case "pro_monthly":
      case "pro_yearly":
        return <Crown className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getPlanColor = (plan: PricingPlan) => {
    switch (plan) {
      case "pro_monthly":
      case "pro_yearly":
        return "text-primary";
      default:
        return "text-slate-400";
    }
  };

  // Get the plans to display based on billing cycle
  const getDisplayPlans = (): PricingPlan[] => {
    return ["free", isYearly ? "pro_yearly" : "pro_monthly"];
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
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-slate-100' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-primary' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-slate-100' : 'text-slate-400'}`}>
              Yearly
              <Badge className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pro Subscription Active Message */}
        {isPro && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="surface-800 border-green-500/20 bg-green-500/5">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-amber-400 mr-3" />
                  <h3 className="text-xl font-bold text-slate-100">Pro Subscription Active</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  You already have an active Pro subscription with unlimited access to all features.
                </p>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Monthly
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto ${isPro ? 'opacity-50 pointer-events-none' : ''}`}>
          {getDisplayPlans().map((planKey) => {
            const plan = PRICING_PLANS[planKey];
            const isPopular = planKey.includes("pro");
            const isCurrentPlan = isPro && planKey.includes("pro");
            
            return (
              <Card 
                key={planKey}
                className={`relative surface-800 border-slate-700 ${
                  isPopular ? "border-primary bg-primary/5" : ""
                }`}
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
                      €{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400">
                        /{plan.interval}
                      </span>
                    )}
                    {plan.interval === 'year' && (
                      <div className="text-sm text-emerald-400 mt-1">
                        $15.83/month when billed annually
                      </div>
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
                    disabled={isCurrentPlan || (isPro && planKey.includes("pro"))}
                    className={`w-full ${
                      planKey === "free"
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {isCurrentPlan 
                      ? "Current Plan" 
                      : (isPro && planKey.includes("pro"))
                      ? "Already Subscribed"
                      : planKey === "free" 
                      ? "Get Started" 
                      : isYearly ? "Subscribe Yearly" : "Subscribe Monthly"
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