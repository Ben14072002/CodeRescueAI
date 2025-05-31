import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

type AuthView = "login" | "register" | "forgot-password";

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
            onSwitchToRegister={() => setCurrentView("register")}
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
        {renderCurrentView()}
      </DialogContent>
    </Dialog>
  );
}