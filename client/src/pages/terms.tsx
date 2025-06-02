import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Terms() {
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
              Terms of Service
            </CardTitle>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using CodeBreaker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">2. Description of Service</h2>
                <p>
                  CodeBreaker is a web-based tool that provides strategies and prompts to help developers resolve issues with AI coding assistants. The Service includes both free and paid subscription tiers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">3. User Accounts</h2>
                <p>
                  To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">4. Subscription Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free accounts are limited to 3 rescue sessions per month</li>
                  <li>Pro subscriptions provide unlimited access to all features</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Refunds are available within 30 days of purchase</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">5. Acceptable Use</h2>
                <p>
                  You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You may not attempt to gain unauthorized access to any part of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">6. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by CodeBreaker and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">7. Limitation of Liability</h2>
                <p>
                  In no event shall CodeBreaker be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">8. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at support@codebreaker.dev
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}