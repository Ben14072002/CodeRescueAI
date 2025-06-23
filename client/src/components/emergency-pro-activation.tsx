import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; // Not needed
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, CheckCircle } from "lucide-react";

export function EmergencyProActivation() {
  const [isActivating, setIsActivating] = useState(false);
  const [activationResult, setActivationResult] = useState<string | null>(null);
  const [plan, setPlan] = useState('pro_monthly');
  const { user } = useAuth();

  const activatePro = async () => {
    if (!user?.uid) {
      setActivationResult('Error: Please sign in first');
      return;
    }

    setIsActivating(true);
    setActivationResult(null);

    try {
      const response = await fetch('/api/activate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          plan: plan
        })
      });

      const data = await response.json();

      if (data.success) {
        setActivationResult(`Success! Pro subscription activated for plan: ${data.plan}`);
        // Force page refresh to update subscription status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setActivationResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setActivationResult(`Error: ${error}`);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 border-red-500/50 bg-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Emergency Pro Activation
        </CardTitle>
        <CardDescription className="text-red-300">
          For users who paid but don't have Pro access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plan">Subscription Plan</Label>
          <select 
            id="plan"
            value={plan} 
            onChange={(e) => setPlan(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
          >
            <option value="pro_monthly">Pro Monthly</option>
            <option value="pro_yearly">Pro Yearly</option>
          </select>
        </div>

        {user?.uid && (
          <div className="text-sm text-gray-400">
            User ID: {user.uid}
          </div>
        )}

        <Button 
          onClick={activatePro}
          disabled={isActivating || !user?.uid}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {isActivating ? 'Activating...' : 'Activate Pro Access'}
        </Button>

        {activationResult && (
          <div className={`p-3 rounded text-sm ${
            activationResult.startsWith('Success') 
              ? 'bg-green-950/50 text-green-400 border border-green-500/50' 
              : 'bg-red-950/50 text-red-400 border border-red-500/50'
          }`}>
            {activationResult.startsWith('Success') && (
              <CheckCircle className="w-4 h-4 inline mr-2" />
            )}
            {activationResult}
          </div>
        )}
      </CardContent>
    </Card>
  );
}