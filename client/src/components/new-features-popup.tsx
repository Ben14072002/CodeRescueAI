import { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, DollarSign, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NewFeaturesPopupProps {
  onExploreFeatures?: () => void;
  onDismiss?: () => void;
}

export function NewFeaturesPopup({ onExploreFeatures, onDismiss }: NewFeaturesPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkShouldShow = () => {
      // Check if already seen permanently
      if (localStorage.getItem('newFeaturesPopupSeen') === 'true') {
        return false;
      }
      
      // Check if shown this session
      if (sessionStorage.getItem('popupShownThisSession') === 'true') {
        return false;
      }
      
      return true;
    };

    if (checkShouldShow()) {
      // Show popup after 2 second delay
      const timer = setTimeout(() => {
        setShouldShow(true);
        setIsVisible(true);
        sessionStorage.setItem('popupShownThisSession', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const popup = document.getElementById('new-features-popup');
      if (popup && !popup.contains(e.target as Node) && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      
      // Auto-close after 30 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 30000);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShouldShow(false), 300);
    onDismiss?.();
  };

  const handleExploreFeatures = () => {
    localStorage.setItem('newFeaturesPopupSeen', 'true');
    handleClose();
    onExploreFeatures?.();
  };

  const handleMaybeLater = () => {
    // Set flag to not show again today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem('newFeaturesPopupHideUntil', tomorrow.getTime().toString());
    handleClose();
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI Development Wizard",
      description: "Your personal senior developer mentor for when you're stuck",
      delay: 0
    },
    {
      icon: BookOpen,
      title: "Free Prompt Library",
      description: "Ready-to-use prompts for common AI coding problems",
      delay: 100
    },
    {
      icon: DollarSign,
      title: "Better Pricing",
      description: "Now just $4.99/month for Pro features",
      delay: 200
    },
    {
      icon: Rocket,
      title: "Smarter Problem Solving",
      description: "Get personalized guidance, not generic prompts",
      delay: 300
    }
  ];

  if (!shouldShow) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
      
      {/* Popup */}
      <Card 
        id="new-features-popup"
        className={`relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 transform ${
          isVisible ? 'scale-100 translate-y-0 animate-popup-enter' : 'scale-95 translate-y-4'
        }`}
      >
        <CardContent className="p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close popup"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 CodeBreaker Just Got Better!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Major updates based on your feedback
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  isVisible ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: isVisible ? `${feature.delay}ms` : undefined
                }}
              >
                <div className="feature-icon flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <feature.icon size={20} className="text-primary animate-icon-bounce" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleExploreFeatures}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
            >
              Explore New Features
            </Button>
            <Button 
              onClick={handleMaybeLater}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

// Hook for manual popup control
export function useNewFeaturesPopup() {
  const [isVisible, setIsVisible] = useState(false);

  const showPopup = () => {
    // Remove localStorage flag to force show
    localStorage.removeItem('newFeaturesPopupSeen');
    sessionStorage.removeItem('popupShownThisSession');
    setIsVisible(true);
  };

  const hidePopup = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    showPopup,
    hidePopup
  };
}