import { useState } from "react";
import { LandingSection } from "@/components/landing-section";
import { ProblemSelection } from "@/components/problem-selection";
import { SolutionDashboard } from "@/components/solution-dashboard";
import { SuccessModal } from "@/components/success-modal";
import { CopyToast } from "@/components/copy-toast";
import { useSession } from "@/hooks/use-session";

type Section = "landing" | "problems" | "solution";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  const { currentSession } = useSession();

  const navigateToProblems = () => setCurrentSection("problems");
  const navigateToSolution = () => setCurrentSection("solution");
  const navigateToLanding = () => setCurrentSection("landing");

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="surface-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeBreaker</h1>
                <p className="text-sm text-slate-400">AI Assistant Rescue Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-history" />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <i className="fas fa-cog" />
              </button>
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
      </main>

      {/* Modals and Toasts */}
      <SuccessModal
        show={showSuccessModal}
        session={currentSession}
        onClose={() => setShowSuccessModal(false)}
        onNewSession={handleNewSession}
      />
      
      <CopyToast show={showCopyToast} />
    </div>
  );
}
