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
    
    if (upgradeStatus === 'success') {
      console.log('Payment success detected, refreshing subscription status');
      // Invalidate subscription query to force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [queryClient]);

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