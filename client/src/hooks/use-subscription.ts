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

      try {
        console.log('🔄 Fetching subscription status for user:', user.uid);
        const response = await fetch(`/api/subscription-status/${user.uid}`);
        if (!response.ok) {
          console.error('❌ Subscription status fetch failed:', response.status, response.statusText);
          throw new Error('Failed to fetch subscription status');
        }
        const data = await response.json() as Promise<SubscriptionData>;
        console.log('✅ Subscription status updated:', data);
        return data;
      } catch (error) {
        console.error('❌ Error fetching subscription status:', error);
        throw error;
      }
    },
    enabled: !!user?.uid,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchInterval: 5000, // Refetch every 5 seconds for immediate updates
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const { data: trialData } = useQuery({
    queryKey: ['/api/trial-status', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return { isTrialActive: false, daysRemaining: 0 };

      try {
        console.log('🔄 Fetching trial status for user:', user.uid);
        const response = await fetch(`/api/trial-status/${user.uid}`);
        if (!response.ok) {
          console.error('❌ Trial status fetch failed:', response.status, response.statusText);
          throw new Error('Failed to fetch trial status');
        }
        const data = await response.json() as Promise<{ isTrialActive: boolean; daysRemaining: number }>;
        console.log('✅ Trial status updated:', data);
        return data;
      } catch (error) {
        console.error('❌ Error fetching trial status:', error);
        throw error;
      }
    },
    enabled: !!user?.uid,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchInterval: 5000, // Refetch every 5 seconds for immediate updates
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  useEffect(() => {
    if (subscriptionData && trialData) {
      // ENHANCED PRO DETECTION: Multiple ways to qualify for Pro access
      const isPaidPro = subscriptionData.tier !== 'free' && 
                       (subscriptionData.tier === 'pro_monthly' || 
                        subscriptionData.tier === 'pro_yearly' ||
                        subscriptionData.tier === 'pro') &&
                       subscriptionData.status === 'active';

      // Check if user has Stripe subscription (indicates payment)
      const hasStripeSubscription = (subscriptionData as any).stripeSubscriptionId;

      // Trial users also get Pro access during their trial period
      const hasTrialAccess = trialData.isTrialActive;

      // Check if server auto-upgraded user
      const wasAutoUpgraded = (subscriptionData as any).autoUpgraded;

      // LIBERAL PRO ACCESS: Grant Pro if any indicator suggests payment
      const hasProAccess = isPaidPro || hasTrialAccess || hasStripeSubscription;

      setIsProUser(hasProAccess);

      console.log('🔍 SUBSCRIPTION ANALYSIS:', {
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        isPaidPro,
        hasStripeSubscription,
        isTrialActive: trialData.isTrialActive,
        hasProAccess,
        autoUpgraded: wasAutoUpgraded
      });

      // If auto-upgraded by server, log success and force refresh
      if (wasAutoUpgraded) {
        console.log('✅ CRITICAL FIX APPLIED: User was automatically upgraded to Pro after payment detection');
        // Force UI refresh to show Pro features immediately
        setTimeout(() => window.location.reload(), 1000);
      }
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

    // CRITICAL: Auto-activate trial when user returns from Stripe checkout
    // This bypasses webhook dependency and works immediately for all users
    if ((trialStatus === 'success' || window.location.search.includes('trial=success')) && user?.uid) {
      const userIdToActivate = uid || user.uid;
      console.log('AUTO-ACTIVATING TRIAL: User returned from Stripe checkout, activating trial for:', userIdToActivate);

      // Immediately activate trial via API call
      fetch('/api/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdToActivate })
      })
      .then(response => response.json())
      .then(data => {
        console.log('TRIAL ACTIVATION RESULT:', data);
        if (data.success) {
          console.log('✅ Trial successfully activated - user now has Pro access');
          // Force complete refresh of all subscription data
          queryClient.removeQueries({ queryKey: ['/api/subscription-status'] });
          queryClient.removeQueries({ queryKey: ['/api/trial-status'] });
          // Immediate refetch with fresh data
          setTimeout(() => {
            queryClient.refetchQueries({ queryKey: ['/api/subscription-status'] });
            queryClient.refetchQueries({ queryKey: ['/api/trial-status'] });
          }, 200);
        } else {
          console.error('❌ Trial activation failed:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ Network error during trial activation:', error);
      });

      // Clear URL parameters after processing
      if (window.location.search.includes('trial=success')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
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