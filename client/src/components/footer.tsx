import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-slate-100 mb-4">CodeBreaker</h3>
            <p className="text-slate-400 text-sm mb-4">
              Break free from AI assistant loops. Get unstuck in minutes, not hours.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-slate-200 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#calculator" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Cost Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@digitalduo.org" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:contact@digitalduo.org" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Status Page
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 CodeBreaker by DigitalDuo - Ben Paltinat. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}