import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

interface SubscriptionData {
  tier: string;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd?: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isProUser, setIsProUser] = useState(false);
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['/api/subscription-status', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      
      const response = await fetch(`/api/subscription-status/${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      return response.json() as Promise<SubscriptionData>;
    },
    enabled: !!user?.uid,
    refetchInterval: 30000, // Refetch every 30 seconds to catch subscription updates
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const { data: trialData } = useQuery({
    queryKey: ['/api/trial-status', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return { isTrialActive: false, daysRemaining: 0 };
      
      const response = await fetch(`/api/trial-status/${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trial status');
      }
      return response.json() as Promise<{ isTrialActive: boolean; daysRemaining: number }>;
    },
    enabled: !!user?.uid,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  useEffect(() => {
    if (subscriptionData && trialData) {
      // Pro access includes: paid Pro subscribers OR active trial users
      const isPaidPro = subscriptionData.tier !== 'free' && 
                       (subscriptionData.tier === 'pro_monthly' || 
                        subscriptionData.tier === 'pro_yearly' ||
                        subscriptionData.tier === 'pro') &&
                       subscriptionData.status === 'active';
      
      // Trial users also get Pro access during their trial period
      const hasProAccess = isPaidPro || trialData.isTrialActive;
      
      setIsProUser(hasProAccess);
      
      console.log('Subscription status updated:', {
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        isPaidPro,
        isTrialActive: trialData.isTrialActive,
        hasProAccess
      });
    }
  }, [subscriptionData, trialData]);

  // Listen for upgrade success in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeStatus = urlParams.get('upgrade');
    const trialStatus = urlParams.get('trial');
    const uid = urlParams.get('uid');
    
    if (upgradeStatus === 'success') {
      console.log('Payment success detected, refreshing subscription status');
      // Invalidate subscription query to force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Handle trial completion - auto-activate trial for user
    if (trialStatus === 'success' && uid && user?.uid === uid) {
      console.log('Trial checkout success detected, activating trial for user:', uid);
      
      // Automatically activate trial via API
      fetch('/api/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Trial activated successfully:', data.message);
          // Force refresh subscription data
          queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
          queryClient.invalidateQueries({ queryKey: ['/api/trial-status'] });
        } else {
          console.error('Trial activation failed:', data.error);
        }
      })
      .catch(error => {
        console.error('Error activating trial:', error);
      });
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [queryClient, user]);

  const refreshSubscription = () => {
    console.log('Manually refreshing subscription status');
    queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
  };

  const checkPremiumAccess = (): boolean => {
    return isProUser;
  };

  return {
    subscriptionData,
    isProUser,
    isLoading,
    refreshSubscription,
    checkPremiumAccess,
    trialData,
    // Legacy compatibility
    isPro: isProUser,
    tier: subscriptionData?.tier || 'free',
    status: subscriptionData?.status || 'free'
  };
}