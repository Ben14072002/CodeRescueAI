import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, TrendingUp } from "lucide-react";

export function CostCalculator() {
  const [checkpointCost, setCheckpointCost] = useState([0.25]);
  const [checkpointsWasted, setCheckpointsWasted] = useState([15]);
  const [timesPerMonth, setTimesPerMonth] = useState([3]);

  const costPerIncident = checkpointCost[0] * checkpointsWasted[0];
  const monthlyCost = costPerIncident * timesPerMonth[0];
  const yearlyCost = monthlyCost * 12;
  const savings = monthlyCost - 9.99; // Cost of Rescue Pro

  return (
    <section className="mb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
            Calculate Your Checkpoint Waste
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See how much you're spending on wasted checkpoints when AI tools like Replit, Lovable, or Windsurf get stuck
          </p>
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
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-400">Cost per incident</p>
                      <p className="text-xl font-bold text-red-400">${costPerIncident}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-400">Monthly lost revenue</p>
                      <p className="text-xl font-bold text-orange-400">${monthlyCost}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm text-slate-400">Yearly lost revenue</p>
                      <p className="text-2xl font-bold text-red-500">${yearlyCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    Monthly Savings with CodeBreaker
                  </h3>
                  <p className="text-3xl font-bold text-emerald-400 mb-2">
                    ${savings.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Rescue Pro pays for itself in minutes
                  </p>
                  <Badge className="mt-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                    {Math.round(savings / 9.99 * 100)}% ROI
                  </Badge>
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