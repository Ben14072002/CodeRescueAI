import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-6 text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="surface-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-100">
              Privacy Policy
            </CardTitle>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Account information (email, username)</li>
                  <li>Usage data (rescue sessions, problem types)</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Technical data (IP address, browser type, device information)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and manage subscriptions</li>
                  <li>Send important account and service updates</li>
                  <li>Improve our services and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties, except:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>With your explicit consent</li>
                  <li>To process payments through Stripe</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment processing is handled securely by Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">5. Data Retention</h2>
                <p>
                  We retain your personal information only as long as necessary to provide our services and fulfill the purposes described in this policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">7. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">8. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@codebreaker.dev
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}