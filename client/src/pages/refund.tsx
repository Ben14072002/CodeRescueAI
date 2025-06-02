import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Refund() {
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
              Refund Policy
            </CardTitle>
            <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">30-Day Money-Back Guarantee</h2>
                <p>
                  We stand behind CodeBreaker with a 30-day money-back guarantee. If you're not completely satisfied with your Rescue Pro subscription, we'll refund your payment in full.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">Eligibility Criteria</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refund requests must be made within 30 days of your initial purchase</li>
                  <li>Available for first-time Rescue Pro subscribers only</li>
                  <li>Account must be in good standing with no terms of service violations</li>
                  <li>Applies to monthly and yearly subscription purchases</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">How to Request a Refund</h2>
                <p>To request a refund, please contact our support team:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Email: support@codebreaker.dev</li>
                  <li>Include your account email and reason for refund</li>
                  <li>We'll respond within 24 hours</li>
                  <li>Refunds are processed within 5-7 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">Refund Processing</h2>
                <p>
                  Refunds will be processed back to your original payment method. If you paid by credit card, the refund will appear on your statement within 5-7 business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">Service Cancellation</h2>
                <p>
                  You can cancel your subscription at any time through your account settings or by contacting support. Cancellations take effect at the end of your current billing period.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">Exceptions</h2>
                <p>Refunds may not be available in the following cases:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Violation of terms of service</li>
                  <li>Fraudulent activity or chargebacks</li>
                  <li>Excessive usage or abuse of the service</li>
                  <li>Requests made after the 30-day window</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-100 mb-3">Contact Support</h2>
                <p>
                  If you have any questions about our refund policy or need assistance, please don't hesitate to contact us at support@codebreaker.dev
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}