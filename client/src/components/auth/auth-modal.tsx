import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { SignupChoice } from "./signup-choice";
import { TrialRegisterForm } from "./trial-register-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

type AuthView = "login" | "register" | "forgot-password" | "signup-choice" | "trial-register";

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  const handleSuccess = () => {
    onClose();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSwitchToRegister={() => setCurrentView("signup-choice")}
            onForgotPassword={() => setCurrentView("forgot-password")}
            onSuccess={handleSuccess}
          />
        );
      case "register":
        return (
          <RegisterForm
            onSwitchToLogin={() => setCurrentView("login")}
            onSuccess={handleSuccess}
          />
        );
      case "signup-choice":
        return (
          <SignupChoice
            onTrialSignup={() => setCurrentView("trial-register")}
            onFreeSignup={() => setCurrentView("register")}
            onBack={() => setCurrentView("login")}
          />
        );
      case "trial-register":
        return (
          <TrialRegisterForm
            onBack={() => setCurrentView("signup-choice")}
            onSuccess={handleSuccess}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onBack={() => setCurrentView("login")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
        <VisuallyHidden>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Sign in or create an account</DialogDescription>
        </VisuallyHidden>
        {renderCurrentView()}
      </DialogContent>
    </Dialog>
  );
}