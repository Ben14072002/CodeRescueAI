import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Crown, Shield } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@/hooks/use-auth";

interface TrialRegisterFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function TrialRegisterForm({ onBack, onSuccess }: TrialRegisterFormProps) {
  const [step, setStep] = useState<"account" | "payment">("account");
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { register, loginWithGoogle, error } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.displayName);
      // After successful registration, the user will have trial status
      onSuccess();
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      console.error("Google signup failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-purple-400 mr-2" />
          <Badge className="bg-purple-500 text-white">3-Day Pro Trial</Badge>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Start Your Free Trial</h2>
        <p className="text-slate-400">Create your account to begin your 3-day Pro trial</p>
      </div>

      {/* Trial Benefits Banner */}
      <Card className="border-purple-500/30 bg-purple-500/10">
        <CardContent className="p-4">
          <div className="flex items-center text-sm text-purple-200">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium">Trial includes:</span>
          </div>
          <div className="mt-2 text-xs text-purple-300 space-y-1">
            <div>• Unlimited AI rescues for 3 days</div>
            <div>• Custom prompt generator access</div>
            <div>• All premium strategies</div>
            <div>• Payment method required (no charge during trial)</div>
          </div>
        </CardContent>
      </Card>

      <Card className="surface-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Signup */}
          <Button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            variant="outline"
            className="w-full border-slate-600 hover:bg-slate-700"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-red-400" />
            {isLoading ? "Creating account..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">or</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-slate-200">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 bg-slate-700 border-slate-600 text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10 bg-slate-700 border-slate-600 text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {(validationError || error) && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {validationError || error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? "Creating account..." : "Start Free Trial"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-slate-200"
            >
              Back to plan selection
            </Button>
          </div>

          <div className="text-xs text-slate-500 text-center space-y-1">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
            <p>Your trial will automatically convert to a paid subscription after 3 days.</p>
            <p>Cancel anytime during the trial period to avoid charges.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}