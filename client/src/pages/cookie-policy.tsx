import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center mb-4">
            <Cookie className="w-8 h-8 text-amber-400 mr-3" />
            <h1 className="text-4xl font-bold text-slate-100">Cookie Policy</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Necessary Cookies</h3>
                <p className="mb-2">
                  These cookies are essential for the website to function properly. They include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Basic website functionality</li>
                  <li>User preferences and settings</li>
                </ul>
                <p className="mt-2 text-sm text-slate-400">
                  These cookies cannot be disabled as they are necessary for the website to work.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Analytics Cookies</h3>
                <p className="mb-2">
                  These cookies help us understand how visitors interact with our website:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Page views and user behavior analytics</li>
                  <li>Performance monitoring and error tracking</li>
                  <li>Feature usage statistics</li>
                  <li>A/B testing for improvements</li>
                </ul>
                <p className="mt-2 text-sm text-slate-400">
                  We use this information to improve our website and services. You can opt out of these cookies.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Marketing Cookies</h3>
                <p className="mb-2">
                  These cookies are used for advertising and marketing purposes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Tracking conversions from advertising campaigns</li>
                  <li>Personalizing advertisements</li>
                  <li>Measuring advertising effectiveness</li>
                  <li>Retargeting visitors with relevant ads</li>
                </ul>
                <p className="mt-2 text-sm text-slate-400">
                  These cookies help us show you relevant advertisements. You can opt out of these cookies.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                We may use third-party services that set their own cookies. These include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Google Analytics:</strong> For website analytics (if enabled)</li>
                <li><strong>Firebase:</strong> For authentication and user management</li>
              </ul>
              <p>
                These third parties have their own cookie policies, which we encourage you to review.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                You have several options for managing cookies:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-200">Cookie Banner</h4>
                  <p className="text-slate-400">
                    When you first visit our website, you'll see a cookie banner where you can accept, reject, or customize your preferences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Browser Settings</h4>
                  <p className="text-slate-400">
                    You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Opt-Out Links</h4>
                  <p className="text-slate-400">
                    You can opt out of analytics and advertising cookies using industry opt-out tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                Different types of cookies are stored for different periods:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Stored for up to 2 years</li>
                <li><strong>Analytics cookies:</strong> Stored for up to 26 months</li>
                <li><strong>Marketing cookies:</strong> Stored for up to 13 months</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                If you have questions about our cookie policy, please contact us:
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p><strong>Email:</strong> contact@digitalduo.org</p>
                <p><strong>Business:</strong> CodeBreaker by DigitalDuo</p>
                <p><strong>Owner:</strong> Ben Paltinat</p>
                <p><strong>SIRET:</strong> 92471132800014</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                We may update this cookie policy from time to time. When we do, we will post the updated policy on this page 
                and update the "Last updated" date at the top of this page.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}