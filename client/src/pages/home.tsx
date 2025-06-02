import { useState } from "react";
import { LandingSection } from "@/components/landing-section";
import { ProblemSelection } from "@/components/problem-selection";
import { SolutionDashboard } from "@/components/solution-dashboard";
import { CustomPromptGenerator } from "@/components/custom-prompt-generator";
import { SuccessModal } from "@/components/success-modal";
import { CopyToast } from "@/components/copy-toast";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";

type Section = "landing" | "problems" | "solution" | "dashboard" | "custom-prompts";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultView, setAuthDefaultView] = useState<"login" | "register">("login");
  
  const { currentSession } = useSession();
  const { user, loading } = useAuth();

  const navigateToProblems = () => {
    if (!user) {
      setAuthDefaultView("login");
      setShowAuthModal(true);
      return;
    }
    setCurrentSection("problems");
  };
  
  const navigateToSolution = () => setCurrentSection("solution");
  const navigateToLanding = () => setCurrentSection("landing");
  const navigateToDashboard = () => setCurrentSection("dashboard");
  const navigateToCustomPrompts = () => setCurrentSection("custom-prompts");

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCopy = () => {
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleNewSession = () => {
    setShowSuccessModal(false);
    setCurrentSection("problems");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="surface-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={navigateToLanding}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeBreaker</h1>
                <p className="text-sm text-slate-400">AI Assistant Rescue Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button 
                    onClick={navigateToDashboard}
                    className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="hidden md:block">{user.displayName || "Dashboard"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setAuthDefaultView("login");
                      setShowAuthModal(true);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setAuthDefaultView("register");
                      setShowAuthModal(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentSection === "landing" && (
          <LandingSection onGetStarted={navigateToProblems} />
        )}
        
        {currentSection === "problems" && (
          <ProblemSelection
            onAnalyze={navigateToSolution}
            onBack={navigateToLanding}
            onCustomPrompts={navigateToCustomPrompts}
          />
        )}
        
        {currentSection === "solution" && (
          <SolutionDashboard
            onBack={navigateToProblems}
            onNewSession={navigateToProblems}
            onSuccess={handleSuccess}
            onCopy={handleCopy}
          />
        )}

        {currentSection === "custom-prompts" && (
          <CustomPromptGenerator onBack={navigateToProblems} />
        )}

        {currentSection === "dashboard" && (
          <UserDashboard onClose={navigateToLanding} />
        )}
      </main>

      {/* Modals and Toasts */}
      <SuccessModal
        show={showSuccessModal}
        session={currentSession}
        onClose={() => setShowSuccessModal(false)}
        onNewSession={handleNewSession}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authDefaultView}
      />
      
      <CopyToast show={showCopyToast} />
    </div>
  );
}
