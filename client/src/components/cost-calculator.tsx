import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, TrendingUp, Zap, AlertTriangle, Target, Coffee, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

export function CostCalculator() {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [, setLocation] = useLocation();
  const [scenario, setScenario] = useState<'light' | 'normal' | 'heavy'>('normal');
  const [animateCounter, setAnimateCounter] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Scenario-based presets with realistic data
  const scenarios = {
    light: { 
      sessions: 2, 
      checkpoints: 15, 
      description: "Casual User",
      timeWasted: 3,
      frustrationLevel: "Low"
    },
    normal: { 
      sessions: 6, 
      checkpoints: 25, 
      description: "Regular Dev",
      timeWasted: 8,
      frustrationLevel: "Medium" 
    }, 
    heavy: { 
      sessions: 15, 
      checkpoints: 35, 
      description: "Power User",
      timeWasted: 20,
      frustrationLevel: "High"
    }
  };

  const current = scenarios[scenario];
  const proPlanCost = 4.99;
  const checkpointCost = 0.25;
  const costPerSession = checkpointCost * current.checkpoints;
  const monthlyCost = costPerSession * current.sessions;
  const yearlyCost = monthlyCost * 12;
  const savings = Math.max(0, monthlyCost - proPlanCost);
  const roiPercentage = savings > 0 ? Math.round((savings / proPlanCost) * 100) : 0;
  const breakEvenSessions = Math.ceil(proPlanCost / costPerSession);

  useEffect(() => {
    setAnimateCounter(true);
    const timer = setTimeout(() => setAnimateCounter(false), 600);
    return () => clearTimeout(timer);
  }, [scenario]);

  const handleGetPro = () => {
    if (!user) {
      // User not logged in - redirect to home and show auth modal
      setLocation('/');
      return;
    }

    if (isPro) {
      // User already has Pro - redirect to dashboard
      setLocation('/');
      return;
    }

    // User logged in but not Pro - redirect to checkout
    setLocation('/checkout?plan=pro_monthly');
  };

  const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => (
    <span className={`transition-all duration-500 ${animateCounter ? 'scale-110 text-primary' : ''}`}>
      {prefix}{value.toFixed(value < 10 ? 2 : 0)}{suffix}
    </span>
  );

  return (
    <section className="mb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge className="bg-red-600/20 text-red-300 border-red-600/30 mb-4 text-sm px-4 py-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              REALITY CHECK TIME
            </Badge>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-100 leading-tight">
            You're <span className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">Bleeding Money</span>
            <br />Every Month
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto mb-8">
            While you're stuck in AI loops, your wallet is getting lighter. 
            <span className="text-red-300 font-semibold"> Each checkpoint costs real money.</span>
          </p>
        </div>

        {/* Interactive Scenario Selector - Mobile Optimized */}
        <div className="flex justify-center mb-12 px-4">
          <div className="bg-slate-800/80 backdrop-blur p-3 sm:p-4 rounded-xl border border-slate-600 shadow-2xl w-full max-w-3xl">
            <p className="text-slate-300 text-sm mb-3 text-center">Which developer are you?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map((key) => (
                <Button
                  key={key}
                  variant={scenario === key ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setScenario(key)}
                  className={`transition-all transform hover:scale-105 min-h-[60px] text-center ${
                    scenario === key 
                      ? "bg-primary text-white shadow-lg scale-105" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="text-center w-full">
                    <div className="font-semibold text-sm sm:text-base">{scenarios[key].description}</div>
                    <div className="text-xs opacity-80">{scenarios[key].sessions} stuck sessions/month</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Impact Display - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 px-4">
          {/* Current Waste */}
          <Card className="bg-slate-800/50 border-slate-600 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-500"></div>
            <CardHeader className="text-center pb-2">
              <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 w-fit mx-auto mb-2 text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                YOUR MONTHLY WASTE
              </Badge>
              <CardTitle className="text-slate-100 text-base md:text-lg">Currently Burning</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-slate-100 mb-2">
                $<AnimatedNumber value={monthlyCost} />
              </div>
              <p className="text-slate-400 mb-4 text-sm">per month on stuck AI sessions</p>
              <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400">Per session:</span>
                  <span className="text-slate-200 font-semibold">${costPerSession.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400">Sessions/month:</span>
                  <span className="text-slate-200 font-semibold">{current.sessions}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400">Checkpoints wasted:</span>
                  <span className="text-slate-200 font-semibold">{current.checkpoints * current.sessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CodeBreaker Solution */}
          <Card className="bg-slate-800/70 border-primary/30 border-2 relative overflow-hidden md:transform md:scale-105">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <CardHeader className="text-center pb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 w-fit mx-auto mb-2 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                CODEBREAKER PRO
              </Badge>
              <CardTitle className="text-slate-100 text-base md:text-lg">Fixed Monthly Cost</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                $4.99
              </div>
              <p className="text-slate-400 mb-4 text-sm">unlimited AI rescues</p>
              {savings > 0 ? (
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="text-primary font-bold text-base md:text-lg mb-2">
                    You Save: ${savings.toFixed(2)}/month
                  </div>
                  <div className="text-slate-300 text-xs md:text-sm">
                    That's <span className="font-bold">{roiPercentage}% ROI</span> instantly!
                  </div>
                  <div className="text-slate-300 text-xs mt-2">
                    Annual savings: ${(savings * 12).toFixed(0)}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-slate-200 font-semibold text-xs md:text-sm mb-1">
                    Pays for itself after {breakEvenSessions} stuck sessions
                  </div>
                  <div className="text-slate-400 text-xs">
                    Plus: No more frustration & wasted time!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Impact */}
          <Card className="bg-slate-800/50 border-slate-600 relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-500"></div>
            <CardHeader className="text-center pb-2">
              <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 w-fit mx-auto mb-2 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                TIME WASTED
              </Badge>
              <CardTitle className="text-slate-100 text-base md:text-lg">Lost Productivity</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-slate-100 mb-2">
                <AnimatedNumber value={current.timeWasted} />h
              </div>
              <p className="text-slate-400 mb-4 text-sm">wasted monthly on stuck AI</p>
              <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-center text-xs md:text-sm text-slate-300 mb-2">
                  <Coffee className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  That's {Math.floor(current.timeWasted / 0.5)} coffee breaks worth!
                </div>
                <div className="text-slate-400 text-xs">
                  Frustration level: <span className="font-bold">{current.frustrationLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Annual Impact */}
        <div className="text-center mb-12">
          <Card className="bg-slate-800/50 border-slate-600 max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Annual Impact</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    ${yearlyCost.toFixed(0)}
                  </div>
                  <p className="text-slate-400 text-sm">Wasted on checkpoints</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${(proPlanCost * 12).toFixed(2)}
                  </div>
                  <p className="text-slate-400 text-sm">CodeBreaker Pro cost</p>
                </div>
              </div>
              {yearlyCost > (proPlanCost * 12) && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-primary font-bold text-xl">
                    Net Savings: ${(yearlyCost - (proPlanCost * 12)).toFixed(0)}/year
                  </div>
                  <p className="text-slate-300 text-sm mt-1">
                    That's enough for {Math.floor((yearlyCost - (proPlanCost * 12)) / 5)} premium coffee drinks!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              Stop the bleeding. Start saving.
            </h3>
            <p className="text-slate-300 mb-6 text-lg">
              Break free from expensive AI loops today
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 text-lg"
              onClick={handleGetPro}
            >
              {isPro ? "Already Pro" : "Get CodeBreaker Pro"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-slate-400 text-sm mt-4">
              Cancel anytime • 30-day money back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}