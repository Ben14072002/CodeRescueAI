import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrial } from "@/hooks/use-trial";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, CreditCard, AlertTriangle, Shield, Star, X, ArrowLeft } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const { subscriptionData, isLoading: subLoading, refreshSubscription } = useSubscription();
  const { isTrialActive, daysRemaining, loading: trialLoading } = useTrial();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cancel-subscription", {
        userId: user?.uid
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled. You'll retain access until the end of your current period.",
      });
      refreshSubscription();
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reactivate-subscription", {
        userId: user?.uid
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated and will continue automatically.",
      });
      refreshSubscription();
    },
    onError: (error: any) => {
      toast({
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const loading = subLoading || trialLoading;

  const getStatusBadge = () => {
    if (isTrialActive) {
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Trial Active</Badge>;
    }
    
    if (subscriptionData?.status === 'active') {
      return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Pro Active</Badge>;
    }
    
    if (subscriptionData?.status === 'canceled') {
      return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Canceled</Badge>;
    }
    
    return <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Free</Badge>;
  };

  const canCancel = isTrialActive || (subscriptionData?.status === 'active');
  const canReactivate = subscriptionData?.status === 'canceled' && subscriptionData?.currentPeriodEnd && new Date(subscriptionData.currentPeriodEnd) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile & Subscription</h1>
          <p className="text-slate-300">Manage your account and subscription settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Email</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Account Type</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isTrialActive && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-blue-300">Free Trial Active</span>
                      </div>
                      <p className="text-sm text-blue-200">
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Trial expires today'}
                      </p>
                    </div>
                  )}

                  {subscriptionData?.status === 'active' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-emerald-300">Pro Subscription</span>
                      </div>
                      <p className="text-sm text-emerald-200">
                        ${subscriptionData.tier === 'pro_yearly' ? '47.88/year' : '4.99/month'}
                      </p>
                    </div>
                  )}

                  {subscriptionData?.currentPeriodEnd && (
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        {subscriptionData.status === 'canceled' ? 'Access Until' : 'Next Billing'}
                      </label>
                      <p className="text-white">
                        {format(new Date(subscriptionData.currentPeriodEnd), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}

                  {subscriptionData?.status === 'canceled' && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-orange-300">Subscription Canceled</span>
                      </div>
                      <p className="text-sm text-orange-200">
                        You'll retain access until {subscriptionData.currentPeriodEnd ? format(new Date(subscriptionData.currentPeriodEnd), 'MMM dd, yyyy') : 'trial end'}
                      </p>
                    </div>
                  )}

                  {!isTrialActive && !subscriptionData?.status && (
                    <p className="text-slate-400">No active subscription</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscription Actions */}
        <Card className="bg-slate-800/50 border-slate-600 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Subscription Management</CardTitle>
            <CardDescription>
              Manage your subscription settings and billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-600">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        {isTrialActive 
                          ? "Are you sure you want to cancel your trial? You'll lose access to Pro features immediately."
                          : "Are you sure you want to cancel your subscription? You'll retain access until the end of your current billing period."
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
                        Keep Subscription
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => cancelSubscriptionMutation.mutate()}
                        disabled={cancelSubscriptionMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {cancelSubscriptionMutation.isPending ? "Canceling..." : "Yes, Cancel"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {canReactivate && (
                <Button
                  onClick={() => reactivateSubscriptionMutation.mutate()}
                  disabled={reactivateSubscriptionMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {reactivateSubscriptionMutation.isPending ? "Reactivating..." : "Reactivate Subscription"}
                </Button>
              )}

              {!isTrialActive && !subscriptionData?.status && (
                <Button
                  onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start 3-Day Trial
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}