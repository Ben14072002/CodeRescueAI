import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
import { EmergencyProActivation } from "@/components/emergency-pro-activation";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";
import { useTrial } from "@/hooks/use-trial";
import { useSubscription } from "@/hooks/use-subscription";



type Section = "landing" | "problems" | "solution" | "dashboard" | "custom-prompts" | "templates" | "project-planner" | "ai-wizard" | "settings";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultView, setAuthDefaultView] = useState<"login" | "register">("login");
  const [, setLocation] = useLocation();

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

  // Handle URL parameters for routing and authentication
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const plan = urlParams.get('plan');
    const upgrade = urlParams.get('upgrade');

    if (action === 'login') {
      setAuthDefaultView('login');
      setShowAuthModal(true);
    } else if (action === 'checkout' && plan) {
      setLocation(`/checkout?plan=${plan}`);
    } else if (upgrade === 'success') {
      // Handle successful payment return
      setCurrentSection('dashboard');
    }
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-sm bg-slate-900/80 border-b border-purple-500/20">
        <div className="container flex h-28 items-center justify-between px-8 mx-auto max-w-7xl">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">&lt;/&gt;</span>
              </div>
              <h1 className="text-xl font-bold text-white">CodeBreaker</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <button 
                  onClick={navigateToDashboard}
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-3 glassmorphism px-6 py-3 rounded-xl cosmic-glow-hover"
                >
                  <div className="w-10 h-10 cosmic-gradient-bg rounded-full flex items-center justify-center cosmic-glow">
                    <span className="text-sm font-bold text-white">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium">{user.displayName || "Dashboard"}</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setAuthDefaultView("login");
                    setShowAuthModal(true);
                  }}
                  className="text-gray-300 hover:text-white transition-colors font-medium px-6 py-3 rounded-lg hover:bg-purple-500/20"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setAuthDefaultView("register");
                    setShowAuthModal(true);
                  }}
                  className="cosmic-button text-white px-8 py-3 rounded-xl font-semibold cosmic-glow-hover shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-36 pb-12">
        {/* Emergency Pro Activation - Show for authenticated users without Pro access */}
        {user && !isPro && !isTrialActive && (
          <EmergencyProActivation />
        )}

        {/* Trial Countdown - Show only for authenticated users on non-landing pages */}
        {user && currentSection !== "landing" && !isPro && (
          <TrialCountdown 
            daysRemaining={daysRemaining} 
            isTrialActive={isTrialActive}
            onUpgrade={() => setLocation("/pricing")}
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