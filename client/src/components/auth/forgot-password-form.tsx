import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (err) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto surface-800 border-slate-700">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Check Your Email</h2>
          <p className="text-slate-400 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Button onClick={onBack} variant="outline" className="border-slate-600 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto surface-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-100">Reset Password</CardTitle>
        <p className="text-slate-400">Enter your email to receive a reset link</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        <Button 
          onClick={onBack} 
          variant="ghost" 
          className="w-full text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}