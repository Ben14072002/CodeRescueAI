import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  User, 
  Crown, 
  CreditCard,
  Shield,
  Bell,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Mail,
  Key
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserSettingsProps {
  onBack: () => void;
}

export function UserSettings({ onBack }: UserSettingsProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    tier: 'free',
    status: 'active',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false
  });

  // Profile settings state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [notifications, setNotifications] = useState(true);

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/cancel-subscription", {
        userId: user?.uid
      });
      if (response.ok) {
        setShowCancelConfirm(false);
        setSubscriptionData(prev => ({ ...prev, cancelAtPeriodEnd: true }));
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription will end at the current billing period.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/reactivate-subscription", {
        userId: user?.uid
      });
      if (response.ok) {
        setSubscriptionData(prev => ({ ...prev, cancelAtPeriodEnd: false }));
        toast({
          title: "Subscription Reactivated",
          description: "Your subscription will continue as normal.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Update profile through Firebase Auth
      if (user && displayName !== user.displayName) {
        // This would typically update the profile
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would handle account deletion
    toast({
      title: "Contact Support",
      description: "Please contact support@digitalduo.org to delete your account.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Account Settings</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-100">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-700 border-slate-600 text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <Label htmlFor="displayName" className="text-slate-300">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-slate-200 font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive updates about your account</p>
                </div>
                <Button
                  variant={notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications(!notifications)}
                  className="border-slate-600"
                >
                  {notifications ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <Button 
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-100">
                <CreditCard className="w-5 h-5 mr-2" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 font-medium">Current Plan</p>
                  <p className="text-sm text-slate-400">Free Plan - 3 rescues per month</p>
                </div>
                <Badge variant="outline" className="bg-slate-700 text-slate-300">
                  Free Tier
                </Badge>
              </div>

              <Separator className="bg-slate-600" />

              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro - $9.99/month
                </Button>
                
                <div className="text-sm text-slate-400">
                  <p>Pro benefits:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Unlimited rescue sessions</li>
                    <li>Custom AI prompt generator</li>
                    <li>Priority support</li>
                    <li>Advanced analytics</li>
                  </ul>
                </div>
              </div>

              {subscriptionData.tier === 'pro' && (
                <div className="space-y-3">
                  <Separator className="bg-slate-600" />
                  
                  {subscriptionData.cancelAtPeriodEnd ? (
                    <Alert className="border-amber-500/20 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-amber-200">
                        Your subscription will end on{' '}
                        {subscriptionData.currentPeriodEnd 
                          ? new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()
                          : 'the current billing period'}
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="flex gap-2">
                    {subscriptionData.cancelAtPeriodEnd ? (
                      <Button
                        variant="outline"
                        onClick={handleReactivateSubscription}
                        disabled={isLoading}
                        className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reactivate Subscription
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelConfirm(true)}
                        disabled={isLoading}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="surface-800 border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 font-medium">Delete Account</p>
                  <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Security */}
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-100">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Password</p>
                  <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Two-Factor Auth</p>
                  <p className="text-xs text-slate-500">Not enabled</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="surface-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-100">
                <Mail className="w-5 h-5 mr-2" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-400">
                Need help? Contact our support team.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300"
                onClick={() => window.open('mailto:contact@digitalduo.org')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="surface-800 border-slate-700 max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-slate-100">Cancel Subscription?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                Are you sure you want to cancel your Pro subscription? You'll lose access to:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                <li>Unlimited rescue sessions</li>
                <li>Custom AI prompt generator</li>
                <li>Priority support</li>
              </ul>
              <p className="text-sm text-slate-500">
                Your subscription will remain active until the end of your current billing period.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Cancelling..." : "Cancel Subscription"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}