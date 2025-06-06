import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Crown, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface TrialCountdownProps {
  daysRemaining: number;
  isTrialActive: boolean;
  onUpgrade?: () => void;
}

export function TrialCountdown({ daysRemaining, isTrialActive, onUpgrade }: TrialCountdownProps) {
  const [, setLocation] = useLocation();
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    if (!isTrialActive) return;

    const updateTimeString = () => {
      const hours = Math.floor((daysRemaining * 24) % 24);
      const minutes = Math.floor((daysRemaining * 24 * 60) % 60);
      
      if (daysRemaining > 1) {
        setTimeString(`${Math.floor(daysRemaining)} days remaining`);
      } else if (daysRemaining > 0) {
        setTimeString(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeString("Trial expired");
      }
    };

    updateTimeString();
    const interval = setInterval(updateTimeString, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [daysRemaining, isTrialActive]);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      setLocation('/checkout?plan=pro_monthly');
    }
  };

  if (!isTrialActive && daysRemaining <= 0) {
    // Trial expired - show upgrade prompt
    return (
      <Card className="border-amber-500/20 bg-amber-500/5 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-slate-100">Trial Expired</p>
                <p className="text-sm text-slate-400">
                  Upgrade to continue unlimited rescues
                </p>
              </div>
            </div>
            <Button onClick={handleUpgrade} size="sm" className="bg-primary hover:bg-primary/90">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isTrialActive) {
    return null; // Don't show anything if not in trial
  }

  const urgencyLevel = daysRemaining <= 1 ? "critical" : daysRemaining <= 2 ? "warning" : "normal";
  
  const getCardStyles = () => {
    switch (urgencyLevel) {
      case "critical":
        return "border-red-500/20 bg-red-500/5";
      case "warning":
        return "border-amber-500/20 bg-amber-500/5";
      default:
        return "border-emerald-500/20 bg-emerald-500/5";
    }
  };

  const getTextColor = () => {
    switch (urgencyLevel) {
      case "critical":
        return "text-red-400";
      case "warning":
        return "text-amber-400";
      default:
        return "text-emerald-400";
    }
  };

  return (
    <Card className={`${getCardStyles()} mb-6`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Zap className={`w-5 h-5 ${getTextColor()}`} />
              <Badge variant="outline" className={`ml-2 ${getTextColor()} border-current`}>
                FREE TRIAL
              </Badge>
            </div>
            <div>
              <p className="font-medium text-slate-100">
                {timeString}
              </p>
              <p className="text-sm text-slate-400">
                Unlimited rescues during trial
              </p>
            </div>
          </div>
          {urgencyLevel !== "normal" && (
            <Button 
              onClick={handleUpgrade} 
              size="sm" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}