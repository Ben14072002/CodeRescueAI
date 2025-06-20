import { useState } from "react";
import { LandingSection } from "@/components/landing-section";
import { ProblemSelection } from "@/components/problem-selection";
import { SolutionDashboard } from "@/components/solution-dashboard";
import { CustomPromptGenerator } from "@/components/custom-prompt-generator";
import { PromptTemplatesLibrary } from "@/components/prompt-templates-library";
import { ProjectPlanner } from "@/components/project-planner";
import { AIDevelopmentWizard } from "@/components/ai-development-wizard";
import { UserSettings } from "@/components/user-settings";
import { SuccessModal } from "@/components/success-modal";
import { CopyToast } from "@/components/copy-toast";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { TrialCountdown } from "@/components/trial-countdown";
import { NewFeaturesPopup } from "@/components/new-features-popup";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";
import { useTrial } from "@/hooks/use-trial";
import { useSubscription } from "@/hooks/use-subscription";
import codeBreakeLogo from "@assets/Design sans titre (25).png";

type Section = "landing" | "problems" | "solution" | "dashboard" | "custom-prompts" | "templates" | "project-planner" | "ai-wizard" | "settings";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultView, setAuthDefaultView] = useState<"login" | "register">("login");
  
  const { currentSession } = useSession();
  const { user, loading } = useAuth();
  const { isTrialActive, daysRemaining } = useTrial();
  const { isPro } = useSubscription();

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
  const navigateToTemplates = () => setCurrentSection("templates");
  const navigateToProjectPlanner = () => setCurrentSection("project-planner");
  const navigateToAIWizard = () => setCurrentSection("ai-wizard");
  const navigateToSettings = () => setCurrentSection("settings");

  const handleExploreNewFeatures = () => {
    // Navigate to AI wizard to showcase the main new feature
    setCurrentSection("ai-wizard");
  };

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
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="logo-container cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
              onClick={navigateToLanding}
            >
              <img 
                src={codeBreakeLogo} 
                alt="CodeBreaker Logo" 
                className="w-32 md:w-48 h-auto object-contain transition-all duration-300"
              />
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
        {/* Trial Countdown - Show only for authenticated users on non-landing pages */}
        {user && currentSection !== "landing" && !isPro && (
          <TrialCountdown 
            daysRemaining={daysRemaining} 
            isTrialActive={isTrialActive}
            onUpgrade={() => setCurrentSection("landing")}
          />
        )}

        {currentSection === "landing" && (
          <LandingSection onGetStarted={navigateToProblems} />
        )}
        
        {currentSection === "problems" && (
          <ProblemSelection
            onAnalyze={navigateToSolution}
            onBack={navigateToLanding}
            onCustomPrompts={navigateToCustomPrompts}
            onTemplates={navigateToTemplates}
            onProjectPlanner={navigateToProjectPlanner}
            onAIWizard={navigateToAIWizard}
          />
        )}
        
        {currentSection === "solution" && (
          <SolutionDashboard
            onBack={navigateToProblems}
            onNewSession={navigateToProblems}
            onSuccess={handleSuccess}
            onCopy={handleCopy}
            onCustomPrompts={navigateToCustomPrompts}
          />
        )}

        {currentSection === "custom-prompts" && (
          <CustomPromptGenerator onBack={navigateToProblems} />
        )}

        {currentSection === "templates" && (
          <PromptTemplatesLibrary onBack={navigateToProblems} />
        )}

        {currentSection === "project-planner" && (
          <ProjectPlanner onBack={navigateToProblems} />
        )}

        {currentSection === "ai-wizard" && (
          <AIDevelopmentWizard onBack={navigateToProblems} />
        )}

        {currentSection === "settings" && (
          <UserSettings onBack={navigateToDashboard} />
        )}

        {currentSection === "dashboard" && (
          <UserDashboard 
            onClose={navigateToLanding} 
            onSettings={navigateToSettings}
          />
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
