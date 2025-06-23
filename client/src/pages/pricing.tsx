import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useLocation } from "wouter";

const FEATURES = {
  free: [
    "3 AI Rescue Sessions per month",
    "Basic problem-solving strategies",
    "Community support",
    "Free prompt templates"
  ],
  pro: [
    "Unlimited AI Rescue Sessions",
    "AI Development Wizard",
    "Custom Prompt Generator",
    "Advanced debugging strategies",
    "Priority support",
    "Export session reports",
    "Team collaboration tools",
    "Advanced analytics"
  ]
};

export default function Pricing() {
  const { user, loading } = useAuth();
  const { subscriptionData, isLoading: subLoading, trialData, isProUser } = useSubscription();
  const [, setLocation] = useLocation();
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      setLocation('/?action=login');
      return;
    }

    setUpgradeLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: plan === 'monthly' ? 'pro_monthly' : 'pro_yearly',
          userId: user.uid
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received:', data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Unable to start checkout. Please try again.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleTrialStart = async () => {
    if (!user) {
      setLocation('/');
      return;
    }

    setUpgradeLoading(true);
    try {
      // Check trial eligibility first
      const eligibilityResponse = await fetch(`/api/trial-eligibility/${user.uid}`);
      const eligibility = await eligibilityResponse.json();
      
      if (!eligibility.eligible) {
        alert(`Trial not available: ${eligibility.reason}`);
        return;
      }

      const response = await fetch('/api/create-trial-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          feature: 'upgrade'
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Trial start error:', error);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full cosmic-glow" />
      </div>
    );
  }

  const isPro = isProUser || false;
  const isTrialActive = trialData?.isTrialActive || false;

  return (
    <div className="min-h-screen cosmic-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="cosmic-gradient-text">Choose Your</span><br />
            <span className="text-white">Plan</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Get unstuck faster with our AI-powered development tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="glassmorphism-dark border-purple-400/20 cosmic-glow-hover">
            <CardHeader className="pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-white text-3xl font-bold">Free Plan</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Perfect for getting started
                  </CardDescription>
                </div>
                <Zap className="w-10 h-10 text-purple-400 cosmic-glow" />
              </div>
              <div className="text-4xl font-bold text-white">
                €0<span className="text-xl font-normal text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {FEATURES.free.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300"
                disabled={!isPro}
              >
                {isPro ? "Current Plan" : "Free Forever"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Crown className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Pro Plan</CardTitle>
                  <CardDescription className="text-slate-400">
                    Unlimited access to all features
                  </CardDescription>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-white">
                €4.99<span className="text-lg font-normal text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {FEATURES.pro.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {isPro ? (
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                  <Check className="w-4 h-4 mr-2" />
                  Current Plan
                </Button>
              ) : (
                <div className="space-y-3">
                  {!isTrialActive && (
                    <Button 
                      onClick={handleTrialStart}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      disabled={upgradeLoading}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Start 3-Day Free Trial
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleUpgrade('monthly')}
                    variant="outline"
                    className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    disabled={upgradeLoading}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-slate-500 text-center">
                Cancel anytime • Secure payment via Stripe
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="glassmorphism text-white hover:bg-purple-500/20 px-8 py-3 text-lg cosmic-glow-hover"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}