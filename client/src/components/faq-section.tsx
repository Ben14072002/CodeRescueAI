import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "How does CodeBreaker work?",
      answer: "CodeBreaker analyzes your specific AI assistant problem and provides targeted strategies, proven prompts, and step-by-step action plans to get you unstuck. Our battle-tested approaches work with all major AI coding assistants like GitHub Copilot, Cursor, and ChatGPT."
    },
    {
      question: "What AI assistants does CodeBreaker support?",
      answer: "CodeBreaker works with all AI coding assistants including GitHub Copilot, Cursor, ChatGPT, Claude, Codeium, and others. Our strategies focus on prompt engineering and problem-solving approaches that are universal across platforms."
    },
    {
      question: "How many rescue sessions do I get with the free plan?",
      answer: "The free Rescue Starter plan includes 3 AI rescue sessions per month. Each session provides full access to our problem detection, solution strategies, and progress tracking features."
    },
    {
      question: "What happens when I reach my free session limit?",
      answer: "When you've used your 3 free sessions for the month, you'll see an upgrade prompt to Rescue Pro. You can either wait for your sessions to reset next month or upgrade for unlimited access to all features."
    },
    {
      question: "Can I cancel my Rescue Pro subscription anytime?",
      answer: "Yes, you can cancel your Rescue Pro subscription at any time through your account settings. Your access continues until the end of your current billing period, and we offer a 30-day money-back guarantee for new subscribers."
    },
    {
      question: "How quickly can CodeBreaker get me unstuck?",
      answer: "Most developers report being back to productive coding within 8-10 minutes. Our structured approach eliminates the trial-and-error of random prompt attempts and provides clear, actionable steps to resolve your specific situation."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for all new Rescue Pro subscriptions. If you're not completely satisfied, contact our support team for a full refund within 30 days of your purchase."
    },
    {
      question: "Is my code and project information secure?",
      answer: "Absolutely. CodeBreaker focuses on problem-solving strategies and doesn't require you to share your actual code. We only collect usage analytics and problem types to improve our service. All data is encrypted and stored securely."
    },
    {
      question: "What's the difference between monthly and yearly billing?",
      answer: "Yearly billing saves you 20% compared to monthly payments. You get the same unlimited access to all Rescue Pro features, but at a discounted rate when you commit to a full year."
    },
    {
      question: "Can I use CodeBreaker for team collaboration?",
      answer: "Currently, CodeBreaker is designed for individual developers. However, all Rescue Pro subscribers can share their successful strategies and solutions with their team members to help everyone get unstuck faster."
    }
  ];

  return (
    <section className="mb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Everything you need to know about getting unstuck with CodeBreaker
          </p>
        </div>

        <Card className="surface-800 border-slate-700">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-slate-700">
                  <AccordionTrigger className="text-left text-slate-200 hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}