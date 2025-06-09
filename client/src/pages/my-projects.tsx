import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Trash2, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';

interface SavedProject {
  id: number;
  title: string;
  description: string;
  projectData: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MyProjectsProps {
  onBack: () => void;
}

export function MyProjects({ onBack }: MyProjectsProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiRequest('GET', '/api/user/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await apiRequest('DELETE', `/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadProject = (project: SavedProject) => {
    const planText = generateProjectText(project);
    const blob = new Blob([planText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title}-project-plan.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateProjectText = (project: SavedProject) => {
    const plan = project.projectData;
    return `# ${project.title} - Project Plan

## Project Overview
**Purpose:** ${plan?.overview?.purpose || 'Not specified'}

**Target Users:** ${plan?.overview?.targetUsers || 'Not specified'}

**Goals:**
${plan?.overview?.goals?.map((goal: string) => `- ${goal}`).join('\n') || '- No goals specified'}

## Feature Specifications

### Essential Features
${plan?.features?.essential?.map((feature: string) => `- ${feature}`).join('\n') || '- No essential features specified'}

### Nice-to-Have Features
${plan?.features?.niceToHave?.map((feature: string) => `- ${feature}`).join('\n') || '- No nice-to-have features specified'}

## Technical Recommendations
**Architecture:** ${plan?.technical?.architecture || 'Not specified'}

**Tech Stack:**
${plan?.technical?.techStack?.map((tech: string) => `- ${tech}`).join('\n') || '- No tech stack specified'}

## User Experience Design

### User Flows
${plan?.userExperience?.userFlows?.map((flow: string) => `- ${flow}`).join('\n') || '- No user flows specified'}

### Interface Needs
${plan?.userExperience?.interfaceNeeds?.map((need: string) => `- ${need}`).join('\n') || '- No interface needs specified'}

## Development Timeline
**Total Estimate:** ${plan?.timeline?.totalEstimate || 'Not specified'}

### Phases
${plan?.timeline?.phases?.map((phase: any) => `**${phase.name}** (${phase.duration}): ${phase.description}`).join('\n\n') || 'No phases specified'}

## Potential Challenges

### Risks
${plan?.challenges?.risks?.map((risk: string) => `- ${risk}`).join('\n') || '- No risks identified'}

### Solutions
${plan?.challenges?.solutions?.map((solution: string) => `- ${solution}`).join('\n') || '- No solutions specified'}
`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedProject) {
    const plan = selectedProject.projectData;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Projects
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedProject.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Created on {formatDate(selectedProject.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => downloadProject(selectedProject)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Plan
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Project Overview */}
          {plan?.overview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.overview.purpose && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Purpose</h4>
                    <p className="text-gray-600 dark:text-gray-400">{plan.overview.purpose}</p>
                  </div>
                )}
                {plan.overview.targetUsers && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Target Users</h4>
                    <p className="text-gray-600 dark:text-gray-400">{plan.overview.targetUsers}</p>
                  </div>
                )}
                {plan.overview.goals?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Goals</h4>
                    <ul className="space-y-1">
                      {plan.overview.goals.map((goal: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-green-500 mt-1">•</span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Other sections... */}
          {plan?.features && (
            <Card>
              <CardHeader>
                <CardTitle>Feature Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.features.essential?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Essential Features</h4>
                    <ul className="space-y-1">
                      {plan.features.essential.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-green-500 mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.features.niceToHave?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nice-to-Have Features</h4>
                    <ul className="space-y-1">
                      {plan.features.niceToHave.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-blue-500 mt-1">+</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  My Project Plans
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {projects.length} saved project{projects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No project plans yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating project plans with the AI Project Planner to see them here.
            </p>
            <Button onClick={onBack}>
              Create Your First Project Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(project.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadProject(project)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}