import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Cookie, Settings } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    setPreferences(onlyNecessary);
    saveCookiePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }));
    
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Initialize Google Analytics or other analytics
      console.log('Analytics cookies accepted');
    }
    
    // Initialize marketing if accepted
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log('Marketing cookies accepted');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-slate-900/95 backdrop-blur border-slate-700 shadow-2xl">
        <CardContent className="p-6">
          {!showSettings ? (
            // Main banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2">We use cookies</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We use essential cookies to make our site work. We'd also like to use analytics cookies 
                    to help us improve your experience. You can manage your preferences below.
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    By continuing to use our site, you agree to our{" "}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{" "}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectAll}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-primary hover:bg-primary/90"
                >
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Settings panel
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Cookie Preferences
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-200">Necessary Cookies</h4>
                      <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400 border-green-600/30">
                        Required
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      Essential for the website to function. These cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200 mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-primary justify-end' : 'bg-slate-600 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200 mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Used to track visitors and display personalized ads.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-primary justify-end' : 'bg-slate-600 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleRejectAll}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleAcceptSelected}
                  className="bg-primary hover:bg-primary/90 flex-1"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}