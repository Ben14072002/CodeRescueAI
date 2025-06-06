import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { apiRequest } from "@/lib/queryClient";

interface TrialStatus {
  isTrialActive: boolean;
  daysRemaining: number;
}

export function useTrial() {
  const { user } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialActive: false,
    daysRemaining: 0
  });
  const [loading, setLoading] = useState(true);

  const checkTrialStatus = async () => {
    if (!user?.uid) {
      setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/trial-status/${user.uid}`);
      if (response.ok) {
        const status = await response.json();
        setTrialStatus(status);
      } else {
        setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
      }
    } catch (error) {
      console.error('Failed to check trial status:', error);
      setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
    } finally {
      setLoading(false);
    }
  };

  const expireTrial = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`/api/expire-trial/${user.uid}`, {
        method: 'POST'
      });
      if (response.ok) {
        setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
        return true;
      }
    } catch (error) {
      console.error('Failed to expire trial:', error);
    }
    return false;
  };

  useEffect(() => {
    checkTrialStatus();
    
    // Check trial status every hour
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user?.uid]);

  // Auto-expire trial when it reaches 0
  useEffect(() => {
    if (trialStatus.isTrialActive && trialStatus.daysRemaining <= 0) {
      expireTrial();
    }
  }, [trialStatus.daysRemaining, trialStatus.isTrialActive]);

  return {
    ...trialStatus,
    loading,
    expireTrial,
    refreshTrialStatus: checkTrialStatus
  };
}