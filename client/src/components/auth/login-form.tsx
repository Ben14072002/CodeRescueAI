import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@/hooks/use-auth";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onSwitchToRegister, onForgotPassword, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto surface-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-100">Welcome Back</CardTitle>
        <p className="text-slate-400">Sign in to continue your rescue sessions</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-slate-700 border-slate-600 text-slate-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </button>
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
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <FaGoogle className="w-4 h-4 mr-2" />
          Sign in with Google
        </Button>

        <div className="text-center">
          <span className="text-slate-400">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
}