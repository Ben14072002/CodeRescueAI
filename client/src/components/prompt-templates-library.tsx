import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, CheckCircle, Star, AlertTriangle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiAgentTemplates, type AIAgentTemplate } from "./ai-agent-templates";

interface PromptTemplatesLibraryProps {
  onBack: () => void;
}

export function PromptTemplatesLibrary({ onBack }: PromptTemplatesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<AIAgentTemplate | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, promptName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(promptName);
      toast({
        title: "Copied to clipboard",
        description: `${promptName} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
            <div className="flex items-center gap-3">
              <selectedCategory.icon className={`w-6 h-6 ${selectedCategory.color}`} />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedCategory.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {selectedCategory.prompts.map((prompt, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {prompt.name}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {prompt.explanation}
                      </p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(prompt.text, prompt.name)}
                      variant="outline"
                      size="sm"
                      className="ml-4 flex items-center gap-2"
                      disabled={copiedPrompt === prompt.name}
                    >
                      {copiedPrompt === prompt.name ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={prompt.text}
                    readOnly
                    className="min-h-[300px] font-mono text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                AI Coding Agent Templates
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Copy-paste prompts optimized for Replit AI, Cursor, Windsurf & Lovable
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>AI Agent Optimized:</strong> These prompts are specifically designed to get complete, working code from AI coding assistants like Replit AI, Cursor, Windsurf, and Lovable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiAgentTemplates.map((category) => (
            <Card
              key={category.id}
              className="bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                      {category.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {category.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {category.prompts.length} templates
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      AI Optimized
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}