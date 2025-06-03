import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { LandingSection } from "@/components/landing-section";
import { ProblemSelection } from "@/components/problem-selection";
import { SolutionDashboard } from "@/components/solution-dashboard";
import { UserDashboard } from "@/components/user-dashboard";
import { CustomPromptGenerator } from "@/components/custom-prompt-generator";
import { UserSettings } from "@/components/user-settings";
import { SuccessModal } from "@/components/success-modal";
import { CopyToast } from "@/components/copy-toast";
import { PricingSection } from "@/components/pricing/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { useSession } from "@/hooks/use-session";
import { initializeScrollAnimations } from "@/lib/scroll-animations";

type Section = "landing" | "problems" | "solution" | "dashboard" | "custom-prompts" | "settings";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const { currentSession } = useSession();

  useEffect(() => {
    // Initialize scroll animations after component mounts
    const cleanup = initializeScrollAnimations();
    return cleanup;
  }, []);

  const handleGetStarted = () => {
    setCurrentSection("problems");
  };

  const handleAnalyze = () => {
    setCurrentSection("solution");
  };

  const handleBack = () => {
    setCurrentSection("landing");
  };

  const handleBackToProblems = () => {
    setCurrentSection("problems");
  };

  const handleNewSession = () => {
    setCurrentSection("problems");
    setShowSuccessModal(false);
  };

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCopy = () => {
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  const handleSelectPlan = (plan: any) => {
    // Handle plan selection - could redirect to checkout
    console.log("Selected plan:", plan);
  };

  if (currentSection === "dashboard") {
    return (
      <UserDashboard
        onClose={() => setCurrentSection("landing")}
        onSettings={() => setCurrentSection("settings")}
      />
    );
  }

  if (currentSection === "settings") {
    return (
      <UserSettings
        onBack={() => setCurrentSection("dashboard")}
      />
    );
  }

  if (currentSection === "custom-prompts") {
    return (
      <CustomPromptGenerator
        onBack={() => setCurrentSection("problems")}
      />
    );
  }

  if (currentSection === "solution") {
    return (
      <>
        <SolutionDashboard
          onBack={handleBackToProblems}
          onNewSession={handleNewSession}
          onSuccess={handleSuccess}
          onCopy={handleCopy}
        />
        <SuccessModal
          show={showSuccessModal}
          session={currentSession}
          onClose={() => setShowSuccessModal(false)}
          onNewSession={handleNewSession}
        />
        <CopyToast show={showCopyToast} />
      </>
    );
  }

  if (currentSection === "problems") {
    return (
      <ProblemSelection
        onAnalyze={handleAnalyze}
        onBack={handleBack}
        onCustomPrompts={() => setCurrentSection("custom-prompts")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header onGetStarted={handleGetStarted} />
      
      <main>
        <LandingSection onGetStarted={handleGetStarted} />
        
        <section id="pricing" className="py-20 bg-slate-900/80">
          <PricingSection onSelectPlan={handleSelectPlan} />
        </section>
        
        <section id="faq" className="py-20 bg-black">
          <FAQSection />
        </section>
      </main>
      
      <Footer />
      
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