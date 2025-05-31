import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Loader2 } from "lucide-react";

const CheckoutForm = ({ planName, onSuccess }: { planName: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: `Welcome to ${planName}!`,
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Subscribe to ${planName}`
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [planName, setPlanName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    
    if (!plan || !user) {
      setLocation('/');
      return;
    }

    // Create checkout session
    apiRequest("POST", "/api/create-checkout-session", { 
      plan, 
      userId: user.id 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          setClientSecret(data.clientSecret);
          setPlanName(plan === 'pro' ? 'Pro Developer' : 'Team');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Checkout session error:', error);
        setLocation('/pricing');
      });
  }, [user, setLocation]);

  const handleSuccess = () => {
    setLocation('/dashboard');
  };

  const handleBack = () => {
    setLocation('/pricing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-md mx-auto px-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>

        <Card className="surface-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-slate-100">
              Complete Your Subscription
            </CardTitle>
            <p className="text-center text-slate-400">
              Subscribe to {planName} plan
            </p>
          </CardHeader>
          <CardContent>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#3b82f6',
                  }
                }
              }}
            >
              <CheckoutForm planName={planName} onSuccess={handleSuccess} />
            </Elements>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-500">
          <p>Secure payments powered by Stripe</p>
          <p>Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </div>
  );
}