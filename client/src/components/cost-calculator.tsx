import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, TrendingUp } from "lucide-react";

export function CostCalculator() {
  const [checkpointCost, setCheckpointCost] = useState([0.25]);
  const [checkpointsWasted, setCheckpointsWasted] = useState([20]);
  const [timesPerMonth, setTimesPerMonth] = useState([4]);

  const costPerIncident = checkpointCost[0] * checkpointsWasted[0];
  const monthlyCost = costPerIncident * timesPerMonth[0];
  const yearlyCost = monthlyCost * 12;
  const savings = monthlyCost - 9.99; // Cost of Rescue Pro
  const roiPercentage = savings > 0 ? Math.round((savings / 9.99) * 100) : 0;

  return (
    <section className="mb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
            <span className="text-red-400">Stop Burning Money</span> on Stuck AI Tools
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Calculate how much you're losing when Replit, Lovable, or Windsurf get stuck in loops
          </p>
          <div className="mt-4 inline-flex items-center bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-sm font-medium">
              💡 Most developers waste 15-30 checkpoints per stuck session
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Controls */}
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Your Development Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label className="text-slate-300 text-base mb-4 block">
                  Cost per checkpoint: ${checkpointCost[0].toFixed(2)}
                </Label>
                <Slider
                  value={checkpointCost}
                  onValueChange={setCheckpointCost}
                  max={1}
                  min={0.15}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>$0.15</span>
                  <span>$1.00</span>
                </div>
              </div>

              <div>
                <Label className="text-slate-300 text-base mb-4 block">
                  Checkpoints wasted per stuck session: {checkpointsWasted[0]}
                </Label>
                <Slider
                  value={checkpointsWasted}
                  onValueChange={setCheckpointsWasted}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>5 checkpoints</span>
                  <span>50 checkpoints</span>
                </div>
              </div>

              <div>
                <Label className="text-slate-300 text-base mb-4 block">
                  Times stuck per month: {timesPerMonth[0]}
                </Label>
                <Slider
                  value={timesPerMonth}
                  onValueChange={setTimesPerMonth}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>1 time</span>
                  <span>10 times</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100">Your Hidden Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-400 mb-2">You're currently wasting</p>
                <div className="text-4xl font-bold text-red-400 mb-1">
                  ${monthlyCost.toFixed(2)}
                </div>
                <p className="text-sm text-slate-500">per month on stuck AI sessions</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-slate-400">Per stuck session</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400">${costPerIncident.toFixed(2)}</p>
                </div>

                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-slate-400">Annual waste</span>
                  </div>
                  <p className="text-3xl font-bold text-red-500">${yearlyCost.toFixed(0)}</p>
                  <p className="text-xs text-slate-500 mt-1">That's a lot of coffee money!</p>
                </div>
              </div>

              {savings > 0 ? (
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-lg p-6 text-center relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-emerald-500 text-white font-bold text-xs">
                      INSTANT ROI
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-3">
                    💰 Your Monthly Savings
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-emerald-300">${savings.toFixed(2)}</span>
                    <span className="text-lg text-slate-400 ml-2">saved</span>
                  </div>
                  <div className="bg-emerald-500/20 rounded-lg p-3 mb-3">
                    <p className="text-sm text-emerald-300 font-semibold">
                      Pay $9.99, save ${savings.toFixed(2)} = {roiPercentage}% return
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Annual savings: <span className="text-emerald-400 font-bold">${(savings * 12).toFixed(0)}</span>
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                    🎯 Still Worth It
                  </h3>
                  <p className="text-sm text-slate-300 mb-2">
                    Even with light usage, CodeBreaker prevents frustrating AI loops
                  </p>
                  <p className="text-xs text-slate-400">
                    One prevented 6-hour debugging session = month paid for
                  </p>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-slate-300 text-center">
                  <strong>Average developer</strong> saves <strong>{Math.round(checkpointsWasted[0] * 0.7)} checkpoints</strong> per month with CodeBreaker
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}