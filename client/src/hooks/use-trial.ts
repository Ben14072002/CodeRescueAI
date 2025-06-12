import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { apiRequest } from "@/lib/queryClient";

interface TrialStatus {
  isTrialActive: boolean;
  daysRemaining: number;
}

interface TrialEligibility {
  eligible: boolean;
  reason?: string;
}

export function useTrial() {
  const { user } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialActive: false,
    daysRemaining: 0
  });
  const [trialEligibility, setTrialEligibility] = useState<TrialEligibility>({
    eligible: false
  });
  const [loading, setLoading] = useState(true);

  const checkTrialStatus = async () => {
    if (!user?.uid) {
      setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
      setTrialEligibility({ eligible: false });
      setLoading(false);
      return;
    }

    try {
      // Check both trial status and eligibility in parallel
      const [statusResponse, eligibilityResponse] = await Promise.all([
        fetch(`/api/trial-status/${user.uid}`),
        fetch(`/api/trial-eligibility/${user.uid}`)
      ]);
      
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        setTrialStatus(status);
      } else {
        setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
      }

      if (eligibilityResponse.ok) {
        const eligibility = await eligibilityResponse.json();
        setTrialEligibility(eligibility);
      } else {
        setTrialEligibility({ eligible: false, reason: "Failed to check eligibility" });
      }
    } catch (error) {
      console.error('Failed to check trial status/eligibility:', error);
      setTrialStatus({ isTrialActive: false, daysRemaining: 0 });
      setTrialEligibility({ eligible: false, reason: "Network error" });
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
    ...trialEligibility,
    loading,
    expireTrial,
    refreshTrialStatus: checkTrialStatus
  };
}