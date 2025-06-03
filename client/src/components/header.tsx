import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { UserSettings } from "@/components/user-settings";
import { useAuth } from "@/hooks/use-auth";
import { User, Menu, X } from "lucide-react";

interface HeaderProps {
  onGetStarted?: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onGetStarted?.();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/attached_assets/Design sans titre (22).png" 
                alt="CodeBreaker Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-white">CodeBreaker</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-slate-300 hover:text-white transition-colors">
                FAQ
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 text-sm">
                    {user?.displayName || user?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserDashboard(true)}
                    className="text-slate-300 hover:text-white"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAuthModal(true)}
                    className="text-slate-300 hover:text-white"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#faq" className="text-slate-300 hover:text-white transition-colors">
                  FAQ
                </a>
                <div className="pt-4 border-t border-slate-700">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      onClick={() => setShowUserDashboard(true)}
                      className="w-full justify-start text-slate-300 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowAuthModal(true)}
                        className="w-full justify-start text-slate-300 hover:text-white"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={handleGetStarted}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showUserDashboard && (
        <UserDashboard
          onClose={() => setShowUserDashboard(false)}
          onSettings={() => {
            setShowUserDashboard(false);
            setShowUserSettings(true);
          }}
        />
      )}

      {showUserSettings && (
        <UserSettings
          onBack={() => {
            setShowUserSettings(false);
            setShowUserDashboard(true);
          }}
        />
      )}
    </>
  );
}