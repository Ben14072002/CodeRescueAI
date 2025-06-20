import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { stripePromise } from "@/lib/stripe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

function TrialPaymentForm({ clientSecret, onComplete }: { 
  clientSecret: string; 
  onComplete: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;
    
    setIsLoading(true);
    
    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error("Payment setup failed:", error);
        alert(`Payment setup failed: ${error.message}`);
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        // Complete trial setup on backend
        await apiRequest("POST", "/api/complete-trial-setup", {
          userId: user?.uid,
          setupIntentId: setupIntent.id
        });
        
        onComplete();
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? "Setting up..." : "Complete Trial Setup"}
      </Button>
    </form>
  );
}

export default function TrialSetup() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // Get client secret from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('client_secret');
    if (secret) {
      setClientSecret(secret);
    } else {
      // Redirect back if no client secret
      setLocation('/');
    }
  }, [setLocation]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/?signup=trial');
    }
  }, [user, loading, setLocation]);

  const handleComplete = () => {
    setIsComplete(true);
    // Redirect to AI Wizard after successful setup
    setTimeout(() => {
      setLocation('/#wizard');
      window.location.reload(); // Refresh to update trial status
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                Trial Activated!
              </h1>
              <p className="text-slate-300">
                Your 3-day Pro trial is now active. Redirecting to AI Development Wizard...
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Crown className="w-4 h-4 mr-2" />
              Pro Trial Active
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-bold text-slate-100 mb-4">
              Invalid Trial Setup
            </h1>
            <p className="text-slate-400 mb-4">
              This trial setup link is invalid or expired.
            </p>
            <Button onClick={() => setLocation('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#8b5cf6',
        colorBackground: '#1e293b',
        colorText: '#f1f5f9',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px'
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-400 mr-2" />
            <Badge className="bg-purple-500 text-white">Step 2 of 2</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Complete Your Trial Setup
          </h1>
          <p className="text-slate-400">
            Add a payment method to activate your 3-day Pro trial
          </p>
        </div>

        <Card className="border-purple-500/30 bg-purple-500/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center text-sm text-purple-200 mb-2">
              <Shield className="w-4 h-4 mr-2" />
              <span className="font-medium">Trial Protection:</span>
            </div>
            <div className="text-xs text-purple-300 space-y-1">
              <div>• No charge for 3 days</div>
              <div>• Cancel anytime before trial ends</div>
              <div>• Automatic conversion to Pro after trial ($4.99/month)</div>
              <div>• Secure payment processing by Stripe</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-400" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={options}>
              <TrialPaymentForm 
                clientSecret={clientSecret}
                onComplete={handleComplete}
              />
            </Elements>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-white"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}