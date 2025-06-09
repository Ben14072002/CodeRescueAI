import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MapPin, 
  Target, 
  Code2, 
  Clock, 
  CheckCircle, 
  Lightbulb, 
  AlertTriangle,
  ChevronDown,
  Copy,
  Download,
  Sparkles,
  Zap,
  FolderOpen,
  Plus,
  Trash2,
  Play
} from "lucide-react";

interface RoadmapCreatorProps {
  onBack: () => void;
  onOpenRescue?: (context: string) => void;
}

type Phase = 'projects' | 'input' | 'recommendations' | 'customization' | 'roadmap';

interface ProjectInput {
  name: string;
  description: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: 'B2B' | 'B2C' | 'Internal tool' | 'Personal project';
  platform: 'Web app' | 'Mobile responsive' | 'Native mobile' | 'Desktop app';
  expectedUsers: '1-100' | '100-1000' | '1000+' | 'Enterprise scale';
  projectTimeline: 'Weekend project' | '1-2 weeks' | '1-2 months' | 'Long-term';
  authenticationNeeds: 'None' | 'Simple login' | 'OAuth' | 'Enterprise SSO' | 'Custom auth';
  dataComplexity: 'Static content' | 'Simple forms' | 'Database driven' | 'Real-time data' | 'Complex analytics';
  integrations: string[];
  performanceNeeds: 'Basic' | 'Medium traffic' | 'High performance' | 'Enterprise scale';
  designComplexity: 'Minimal/functional' | 'Standard UI' | 'Custom branded' | 'Complex animations';
  responsiveness: 'Desktop only' | 'Mobile friendly' | 'Mobile first';
  accessibility: 'Basic' | 'WCAG compliant' | 'Enterprise accessibility';
  hostingType: 'Shared hosting' | 'Cloud platform' | 'Self-hosted' | 'Don\'t know';
  budget: 'Free/minimal' | 'Low budget' | 'Medium budget' | 'Enterprise budget';
  maintenance: 'Set and forget' | 'Occasional updates' | 'Active maintenance';
}

interface Recommendations {
  recommendedTechStack: string[];
  suggestedComplexity: 'simple' | 'medium' | 'complex';
  estimatedTimeline: string;
  coreFeatures: string[];
  optionalFeatures: string[];
  potentialChallenges: string[];
  reasoning: {
    techStackReason: string;
    complexityReason: string;
    timelineReason: string;
  };
}

interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
  dependencies: number[];
  rescuePrompts: string[];
  startPrompt: string;
  validationChecklist: string[];
}

interface ProjectRecipe {
  architecture: {
    frontend: string;
    backend: string;
    database: string;
  };
  timeline: {
    setup: string;
    authentication: string;
    coreFeatures: string;
    total: string;
  };
  deploymentStrategy: {
    hosting: string;
    cicd: string;
    scaling: string;
  };
  fileStructure: string;
  databaseSchema: string;
  apiEndpoints: string;
  uiComponents: string;
  dependencies: string;
  detailedTimeline: string;
}

export function RoadmapCreator({ onBack, onOpenRescue }: RoadmapCreatorProps) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('projects');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [projectRecipe, setProjectRecipe] = useState<ProjectRecipe | null>(null);
  const [customProblem, setCustomProblem] = useState("");
  const [customSolution, setCustomSolution] = useState("");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Get user ID from localStorage (Firebase auth)
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.uid || user.id;
    }
    return null;
  };

  const userId = getUserId();

  // Fetch user's projects
  const { data: projectsData, isLoading: projectsLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['/api/projects', userId],
    queryFn: async () => {
      if (!userId) return { projects: [] };
      const response = await apiRequest('GET', `/api/projects/${userId}`);
      return response.json();
    },
    enabled: !!userId
  });

  const userProjects = projectsData?.projects || [];

  // Project management functions
  const saveProject = async (projectData: any) => {
    if (!userId) return;
    
    try {
      await apiRequest('POST', '/api/projects', {
        userId,
        projectName: projectData.name,
        projectDetails: projectInput,
        generatedRecipe: projectRecipe,
        roadmapSteps: roadmapSteps
      });
      
      toast({
        title: "Project Saved",
        description: "Your project has been saved successfully.",
      });
      
      refetchProjects();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadProject = (project: any) => {
    setSelectedProject(project);
    setProjectInput(project.projectDetails || projectInput);
    setProjectRecipe(project.generatedRecipe);
    setRoadmapSteps(project.roadmapSteps || []);
    setRecommendations(project.generatedRecipe ? generateCustomAnalysis(project.projectDetails) : null);
    
    if (project.roadmapSteps && project.roadmapSteps.length > 0) {
      setPhase('roadmap');
    } else if (project.generatedRecipe) {
      setPhase('recommendations');
    } else {
      setPhase('input');
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await apiRequest('DELETE', `/api/project/${projectId}`);
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
      refetchProjects();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [projectInput, setProjectInput] = useState<ProjectInput>({
    name: "",
    description: "",
    experienceLevel: 'intermediate',
    targetAudience: 'B2C',
    platform: 'Web app',
    expectedUsers: '100-1000',
    projectTimeline: '1-2 months',
    authenticationNeeds: 'Simple login',
    dataComplexity: 'Database driven',
    integrations: [],
    performanceNeeds: 'Medium traffic',
    designComplexity: 'Standard UI',
    responsiveness: 'Mobile friendly',
    accessibility: 'Basic',
    hostingType: 'Cloud platform',
    budget: 'Medium budget',
    maintenance: 'Occasional updates'
  });

  const generateRecommendations = async () => {
    if (!projectInput.name || !projectInput.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a project name and description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const recs = generateCustomAnalysis(projectInput);
      const recipe = generateProjectRecipe(projectInput, recs);
      
      setRecommendations(recs);
      setProjectRecipe(recipe);
      setPhase('recommendations');
      
      // Auto-save project after generating recommendations
      if (userId && projectInput.name) {
        saveProject(projectInput);
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCustomAnalysis = (input: ProjectInput): Recommendations => {
    const techStackMap: Record<string, string[]> = {
      'Web app': ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
      'Mobile responsive': ['React', 'TypeScript', 'Next.js', 'Supabase', 'Tailwind CSS'],
      'Native mobile': ['React Native', 'TypeScript', 'Expo', 'Firebase', 'NativeBase'],
      'Desktop app': ['Electron', 'React', 'TypeScript', 'SQLite', 'Chakra UI']
    };

    const baseStack = techStackMap[input.platform] || techStackMap['Web app'];
    
    if (input.authenticationNeeds === 'OAuth') {
      baseStack.push('Auth0', 'Passport.js');
    }
    if (input.dataComplexity === 'Real-time data') {
      baseStack.push('Socket.io', 'Redis');
    }
    if (input.integrations.length > 0) {
      baseStack.push('Axios', 'REST APIs');
    }

    const complexity = input.dataComplexity === 'Static content' || input.expectedUsers === '1-100' 
      ? 'simple' 
      : input.expectedUsers === 'Enterprise scale' || input.dataComplexity === 'Complex analytics'
      ? 'complex'
      : 'medium';

    const timeline = input.projectTimeline === 'Weekend project' ? '2-3 days' :
                    input.projectTimeline === '1-2 weeks' ? '1-2 weeks' :
                    input.projectTimeline === '1-2 months' ? '4-6 weeks' : '2-3 months';

    const features = extractCoreFeatures(input);
    const optionalFeatures = extractOptionalFeatures(input);
    const challenges = extractChallenges(input);

    return {
      recommendedTechStack: baseStack.slice(0, 6),
      suggestedComplexity: complexity,
      estimatedTimeline: timeline,
      coreFeatures: features,
      optionalFeatures: optionalFeatures,
      potentialChallenges: challenges,
      reasoning: {
        techStackReason: `Selected based on ${input.platform} requirements, ${input.dataComplexity} needs, and ${input.expectedUsers} scale.`,
        complexityReason: `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} complexity due to ${input.dataComplexity} and ${input.expectedUsers} user scale.`,
        timelineReason: `${timeline} timeline accounts for ${input.experienceLevel} developer experience and ${complexity} complexity.`
      }
    };
  };

  const extractCoreFeatures = (input: ProjectInput): string[] => {
    const features = [];
    features.push("Project setup and configuration");
    
    if (input.authenticationNeeds !== 'None') {
      features.push(`${input.authenticationNeeds} authentication system`);
    }
    
    if (input.dataComplexity !== 'Static content') {
      features.push("Database schema and CRUD operations");
    }
    
    features.push("Core user interface");
    features.push("Basic functionality implementation");
    
    if (input.responsiveness !== 'Desktop only') {
      features.push("Responsive design implementation");
    }
    
    return features;
  };

  const extractOptionalFeatures = (input: ProjectInput): string[] => {
    const features = [];
    
    if (input.designComplexity === 'Complex animations') {
      features.push("Advanced animations and interactions");
    }
    
    if (input.performanceNeeds === 'High performance') {
      features.push("Performance optimization");
    }
    
    if (input.accessibility !== 'Basic') {
      features.push("Advanced accessibility features");
    }
    
    if (input.integrations.length > 0) {
      features.push("Third-party integrations");
    }
    
    features.push("Advanced testing suite");
    features.push("CI/CD pipeline");
    
    return features;
  };

  const extractChallenges = (input: ProjectInput): string[] => {
    const challenges = [];
    
    if (input.expectedUsers === 'Enterprise scale') {
      challenges.push("Scaling for enterprise-level traffic");
    }
    
    if (input.dataComplexity === 'Complex analytics') {
      challenges.push("Complex data processing and analytics");
    }
    
    if (input.authenticationNeeds === 'Enterprise SSO') {
      challenges.push("Enterprise authentication integration");
    }
    
    if (input.integrations.length > 3) {
      challenges.push("Managing multiple API integrations");
    }
    
    return challenges;
  };

  const generateRoadmap = async () => {
    if (!recommendations) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const steps = generateIntelligentRoadmap(projectInput, recommendations);
      setRoadmapSteps(steps);
      setPhase('roadmap');
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // COMPREHENSIVE PROJECT ANALYSIS ENGINE
  const analyzeProjectDetails = (input: ProjectInput) => {
    console.log("=== ROADMAP GENERATION DEBUG ===");
    console.log("User Input:", input);
    
    const analysis = {
      projectType: detectProjectType(input.description),
      features: extractSpecificFeatures(input.description),
      complexity: assessActualComplexity(input),
      techRequirements: determineTechNeeds(input),
      userGoals: extractUserGoals(input.description),
      constraints: identifyConstraints(input),
      customSteps: generateCustomSteps(input)
    };
    
    console.log("Project Analysis:", analysis);
    return analysis;
  };

  const detectProjectType = (description: string) => {
    const keywords = description.toLowerCase();
    
    if (keywords.includes('todo') || keywords.includes('task management') || keywords.includes('kanban') || keywords.includes('project management')) {
      return 'task_management';
    }
    if (keywords.includes('e-commerce') || keywords.includes('shop') || keywords.includes('store') || keywords.includes('marketplace') || keywords.includes('selling')) {
      return 'ecommerce';
    }
    if (keywords.includes('blog') || keywords.includes('cms') || keywords.includes('content') || keywords.includes('articles') || keywords.includes('posts')) {
      return 'content_management';
    }
    if (keywords.includes('dashboard') || keywords.includes('analytics') || keywords.includes('admin') || keywords.includes('reporting') || keywords.includes('metrics')) {
      return 'dashboard';
    }
    if (keywords.includes('social') || keywords.includes('chat') || keywords.includes('messaging') || keywords.includes('community') || keywords.includes('forum')) {
      return 'social_platform';
    }
    if (keywords.includes('booking') || keywords.includes('appointment') || keywords.includes('scheduling') || keywords.includes('calendar')) {
      return 'booking_system';
    }
    if (keywords.includes('portfolio') || keywords.includes('showcase') || keywords.includes('gallery')) {
      return 'portfolio';
    }
    if (keywords.includes('learning') || keywords.includes('course') || keywords.includes('education') || keywords.includes('tutorial')) {
      return 'learning_platform';
    }
    
    return 'custom';
  };

  const extractSpecificFeatures = (description: string) => {
    const features: string[] = [];
    const text = description.toLowerCase();
    
    // Authentication features
    if (text.includes('login') || text.includes('register') || text.includes('auth') || text.includes('account')) {
      features.push('user_authentication');
    }
    if (text.includes('oauth') || text.includes('google login') || text.includes('social login') || text.includes('github login')) {
      features.push('social_authentication');
    }
    
    // Data features
    if (text.includes('database') || text.includes('save') || text.includes('store') || text.includes('persist')) {
      features.push('data_persistence');
    }
    if (text.includes('real-time') || text.includes('live') || text.includes('instant') || text.includes('websocket')) {
      features.push('real_time_updates');
    }
    if (text.includes('search') || text.includes('filter') || text.includes('find')) {
      features.push('search_functionality');
    }
    
    // Business features
    if (text.includes('payment') || text.includes('stripe') || text.includes('checkout') || text.includes('billing') || text.includes('subscription')) {
      features.push('payment_processing');
    }
    if (text.includes('notification') || text.includes('email') || text.includes('alert') || text.includes('reminder')) {
      features.push('notifications');
    }
    if (text.includes('upload') || text.includes('file') || text.includes('image') || text.includes('document')) {
      features.push('file_upload');
    }
    
    // UI/UX features
    if (text.includes('responsive') || text.includes('mobile') || text.includes('tablet')) {
      features.push('responsive_design');
    }
    if (text.includes('dashboard') || text.includes('admin panel') || text.includes('control panel')) {
      features.push('admin_dashboard');
    }
    if (text.includes('drag') || text.includes('drop') || text.includes('sortable')) {
      features.push('drag_drop');
    }
    
    // Integration features
    if (text.includes('api') || text.includes('integration') || text.includes('webhook')) {
      features.push('api_integration');
    }
    if (text.includes('map') || text.includes('location') || text.includes('geolocation')) {
      features.push('maps_integration');
    }
    
    // Collaboration features
    if (text.includes('team') || text.includes('collaboration') || text.includes('share') || text.includes('invite')) {
      features.push('team_collaboration');
    }
    if (text.includes('comment') || text.includes('review') || text.includes('feedback')) {
      features.push('commenting_system');
    }
    
    return features;
  };

  // Helper functions for project analysis
  const assessActualComplexity = (input: ProjectInput) => {
    const factors = [];
    if (input.dataComplexity === 'Complex analytics' || input.dataComplexity === 'Real-time data') factors.push('high_data');
    if (input.expectedUsers === 'Enterprise scale') factors.push('high_scale');
    if (input.authenticationNeeds === 'Enterprise SSO') factors.push('complex_auth');
    if (input.integrations.length > 3) factors.push('many_integrations');
    
    return factors.length > 2 ? 'complex' : factors.length > 0 ? 'medium' : 'simple';
  };

  const determineTechNeeds = (input: ProjectInput) => {
    const needs = [];
    if (input.dataComplexity !== 'Static content') needs.push('database');
    if (input.authenticationNeeds !== 'None') needs.push('authentication');
    if (input.description.toLowerCase().includes('real-time')) needs.push('websockets');
    if (input.description.toLowerCase().includes('payment')) needs.push('payments');
    return needs;
  };

  const extractUserGoals = (description: string) => {
    const goals = [];
    const text = description.toLowerCase();
    if (text.includes('manage') || text.includes('organize')) goals.push('organization');
    if (text.includes('share') || text.includes('collaborate')) goals.push('collaboration');
    if (text.includes('sell') || text.includes('monetize')) goals.push('monetization');
    if (text.includes('automate') || text.includes('streamline')) goals.push('automation');
    return goals;
  };

  const identifyConstraints = (input: ProjectInput) => {
    const constraints = [];
    if (input.budget === 'Free/minimal') constraints.push('low_budget');
    if (input.projectTimeline === 'Weekend project') constraints.push('tight_timeline');
    if (input.experienceLevel === 'beginner') constraints.push('learning_curve');
    return constraints;
  };

  const generateTaskManagementSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `Build ${input.name} Task Management Core`,
      description: `Create the main task management functionality for ${input.name} including task creation, editing, and status tracking`,
      estimatedTime: "4-6 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} TASKS**: My ${input.name} task management system is broken. Debug task creation, editing, and status updates.`,
        `**AI CODING AGENT RESCUE - TASK CRUD**: Fix all task CRUD operations in ${input.name} with proper data validation.`
      ],
      startPrompt: generateTaskManagementPrompt(input, analysis),
      validationChecklist: [
        "Users can create new tasks",
        "Tasks can be edited and updated",
        "Task status can be changed",
        "Task list displays correctly"
      ]
    });

    if (analysis.features.includes('team_collaboration')) {
      steps.push({
        title: `${input.name} Team Collaboration Features`,
        description: `Implement team features for ${input.name} including task assignment and team member management`,
        estimatedTime: "3-5 hours",
        dependencies: [1, 2],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} TEAMS**: My ${input.name} team collaboration features are failing. Debug task assignment and team member management.`
        ],
        startPrompt: generateTeamCollaborationPrompt(input, analysis),
        validationChecklist: [
          "Tasks can be assigned to team members",
          "Team members can be invited",
          "Team dashboard shows assigned tasks",
          "Collaboration notifications work"
        ]
      });
    }

    return steps;
  };

  const generateEcommerceSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Product Catalog System`,
      description: `Build the product management system for ${input.name} including product listings, categories, and inventory`,
      estimatedTime: "5-7 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} PRODUCTS**: My ${input.name} product catalog is broken. Debug product creation, categories, and inventory management.`
      ],
      startPrompt: generateProductCatalogPrompt(input, analysis),
      validationChecklist: [
        "Products can be added and managed",
        "Product categories work correctly",
        "Product images upload properly",
        "Inventory tracking is functional"
      ]
    });

    steps.push({
      title: `${input.name} Shopping Cart & Checkout`,
      description: `Implement shopping cart functionality and checkout process for ${input.name}`,
      estimatedTime: "4-6 hours",
      dependencies: [1, 2],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} CART**: My ${input.name} shopping cart and checkout are failing. Debug cart operations and checkout flow.`
      ],
      startPrompt: generateCartCheckoutPrompt(input, analysis),
      validationChecklist: [
        "Items can be added to cart",
        "Cart quantities can be updated",
        "Checkout process works smoothly",
        "Order confirmation is sent"
      ]
    });

    return steps;
  };

  const generateCMSSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Content Management System`,
      description: `Build the core content management features for ${input.name} including post creation and editing`,
      estimatedTime: "4-6 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} CMS**: My ${input.name} content management system is broken. Debug post creation, editing, and publishing.`
      ],
      startPrompt: generateCMSPrompt(input, analysis),
      validationChecklist: [
        "Posts can be created and edited",
        "Rich text editor works properly",
        "Posts can be published/unpublished",
        "Content categorization works"
      ]
    });

    if (analysis.features.includes('commenting_system')) {
      steps.push({
        title: `${input.name} Comment System`,
        description: `Implement commenting functionality for ${input.name} posts`,
        estimatedTime: "2-4 hours",
        dependencies: [1, 2],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} COMMENTS**: My ${input.name} comment system is failing. Debug comment submission and display.`
        ],
        startPrompt: generateCommentSystemPrompt(input, analysis),
        validationChecklist: [
          "Users can post comments",
          "Comments display correctly",
          "Comment moderation works",
          "Reply functionality works"
        ]
      });
    }

    return steps;
  };

  const generateDashboardSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Dashboard Analytics`,
      description: `Build the analytics dashboard for ${input.name} with charts and data visualization`,
      estimatedTime: "5-7 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} DASHBOARD**: My ${input.name} dashboard analytics are broken. Debug data fetching and chart rendering.`
      ],
      startPrompt: generateDashboardPrompt(input, analysis),
      validationChecklist: [
        "Charts render data correctly",
        "Dashboard loads quickly",
        "Data refreshes properly",
        "Responsive design works"
      ]
    });

    return steps;
  };

  const generateSocialSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Social Features`,
      description: `Implement core social functionality for ${input.name} including user profiles and posts`,
      estimatedTime: "6-8 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} SOCIAL**: My ${input.name} social features are broken. Debug user profiles, posts, and social interactions.`
      ],
      startPrompt: generateSocialPrompt(input, analysis),
      validationChecklist: [
        "User profiles display correctly",
        "Posts can be created and shared",
        "Social interactions work",
        "Feed displays properly"
      ]
    });

    return steps;
  };

  const generateBookingSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Booking System`,
      description: `Build the appointment booking system for ${input.name} with calendar integration`,
      estimatedTime: "6-8 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} BOOKING**: My ${input.name} booking system is failing. Debug appointment scheduling and calendar integration.`
      ],
      startPrompt: generateBookingPrompt(input, analysis),
      validationChecklist: [
        "Appointments can be scheduled",
        "Calendar displays correctly",
        "Booking confirmations sent",
        "Time slots managed properly"
      ]
    });

    return steps;
  };

  const generateGenericSteps = (input: ProjectInput, analysis: any) => {
    const steps = [];
    
    steps.push({
      title: `${input.name} Core Functionality`,
      description: `Build the main features for ${input.name} based on your project description`,
      estimatedTime: "5-8 hours",
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} FEATURES**: My ${input.name} core functionality is broken. Debug the main features based on project requirements.`
      ],
      startPrompt: generateGenericPrompt(input, analysis),
      validationChecklist: [
        "Main features work as described",
        "User interface is functional",
        "Data operations work correctly",
        "Business logic is implemented"
      ]
    });

    return steps;
  };

  const generateCustomSteps = (input: ProjectInput) => {
    // Avoid infinite recursion by not calling analyzeProjectDetails again
    const analysis = {
      projectType: detectProjectType(input.description),
      features: extractSpecificFeatures(input.description),
      complexity: assessActualComplexity(input),
      techRequirements: determineTechNeeds(input),
      userGoals: extractUserGoals(input.description),
      constraints: identifyConstraints(input)
    };
    
    const steps: any[] = [];
    
    // Generate project-specific steps based on analysis
    switch (analysis.projectType) {
      case 'task_management':
        steps.push(...generateTaskManagementSteps(input, analysis));
        break;
      case 'ecommerce':
        steps.push(...generateEcommerceSteps(input, analysis));
        break;
      case 'content_management':
        steps.push(...generateCMSSteps(input, analysis));
        break;
      case 'dashboard':
        steps.push(...generateDashboardSteps(input, analysis));
        break;
      case 'social_platform':
        steps.push(...generateSocialSteps(input, analysis));
        break;
      case 'booking_system':
        steps.push(...generateBookingSteps(input, analysis));
        break;
      default:
        steps.push(...generateGenericSteps(input, analysis));
    }
    
    return steps;
  };

  // Custom prompt generators for project-specific steps
  const generateCustomSetupPrompt = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    return `You are building "${input.name}" - a ${analysis.projectType.replace('_', ' ')} application.

PROJECT DESCRIPTION: "${input.description}"

TECHNICAL REQUIREMENTS:
- Platform: ${input.platform}
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Expected Users: ${input.expectedUsers}
- Authentication: ${input.authenticationNeeds}
- Data Complexity: ${input.dataComplexity}

SETUP TASKS:
1. Initialize ${input.platform} project with proper folder structure
2. Install and configure: ${recommendations.recommendedTechStack.slice(0, 5).join(', ')}
3. Set up development environment and scripts
4. Configure routing for ${analysis.projectType} application
5. Set up basic layout and navigation structure

Focus specifically on ${input.name} requirements. This is a ${analysis.projectType} app, so structure the project accordingly.

CRITICAL: Reference "${input.name}" in all file names, components, and documentation.`;
  };

  const generateCustomAuthPrompt = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const authType = analysis.features.includes('social_authentication') ? 'Social OAuth (Google, GitHub)' : input.authenticationNeeds;
    
    return `Implement ${authType} authentication for "${input.name}" - your ${analysis.projectType.replace('_', ' ')} application.

PROJECT CONTEXT: "${input.description}"

AUTHENTICATION REQUIREMENTS:
- Auth Type: ${authType}
- User Scale: ${input.expectedUsers}
- Platform: ${input.platform}
- Security Level: ${input.authenticationNeeds}

IMPLEMENTATION TASKS:
1. Set up ${authType.toLowerCase()} authentication system
2. Create user registration and login forms for ${input.name}
3. Implement protected routes for ${input.name} features
4. Add user session management and persistence
5. Create user profile management for ${input.name} users

${analysis.features.includes('social_authentication') ? 
  '6. Configure OAuth providers (Google, GitHub, etc.)\n7. Handle OAuth callbacks and user data' : 
  '6. Implement password hashing and validation\n7. Add email verification if needed'}

Focus on ${input.name} user experience and ${analysis.projectType} application needs.`;
  };

  const generateTaskManagementPrompt = (input: ProjectInput, analysis: any) => {
    return `Build the core task management system for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

TASK MANAGEMENT FEATURES TO IMPLEMENT:
1. Create Task model with fields relevant to ${input.name}
2. Build task creation interface for ${input.name} users
3. Implement task listing and display
4. Add task editing and status updates
5. Create task filtering and search functionality

${analysis.features.includes('team_collaboration') ? 
  'TEAM FEATURES:\n6. Add task assignment to team members\n7. Implement task ownership and delegation\n8. Create team task dashboard' : ''}

${analysis.features.includes('real_time_updates') ? 
  'REAL-TIME FEATURES:\n- Live task updates across users\n- Real-time status changes\n- Live notifications' : ''}

Make this specific to ${input.name} and reference the project description throughout the implementation.`;
  };

  const generateProductCatalogPrompt = (input: ProjectInput, analysis: any) => {
    return `Build the product catalog system for "${input.name}" e-commerce platform.

PROJECT DESCRIPTION: "${input.description}"

PRODUCT MANAGEMENT FEATURES:
1. Create Product model for ${input.name}
2. Implement product creation and editing interface
3. Build product category system
4. Add product image upload and management
5. Create inventory tracking for ${input.name} products
6. Implement product search and filtering
7. Build product detail pages

${analysis.features.includes('payment_processing') ? 
  'PRICING FEATURES:\n- Product pricing and discounts\n- Tax calculation\n- Currency support' : ''}

Focus on ${input.name} business requirements and e-commerce needs described in the project.`;
  };

  const generateCartCheckoutPrompt = (input: ProjectInput, analysis: any) => {
    return `Implement shopping cart and checkout system for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

CART & CHECKOUT FEATURES:
1. Build shopping cart functionality for ${input.name}
2. Implement add/remove items from cart
3. Create cart quantity management
4. Build checkout flow for ${input.name} customers
5. Implement order processing and confirmation
6. Add order history and tracking

${analysis.features.includes('payment_processing') ? 
  'PAYMENT INTEGRATION:\n- Stripe payment processing\n- Payment security and validation\n- Payment confirmation emails' : ''}

Make the checkout process specific to ${input.name} business model and user needs.`;
  };

  const generateCMSPrompt = (input: ProjectInput, analysis: any) => {
    return `Build the content management system for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

CMS FEATURES TO IMPLEMENT:
1. Create content/post model for ${input.name}
2. Build content creation and editing interface
3. Implement rich text editor for ${input.name} content
4. Add content publishing and draft management
5. Create content categorization and tagging
6. Build content listing and archive pages

${analysis.features.includes('commenting_system') ? 
  'ENGAGEMENT FEATURES:\n- Comment system for content\n- Comment moderation\n- User engagement tracking' : ''}

Focus on ${input.name} content strategy and audience engagement needs.`;
  };

  const generateCommentSystemPrompt = (input: ProjectInput, analysis: any) => {
    return `Implement commenting system for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

COMMENT SYSTEM FEATURES:
1. Create comment model for ${input.name}
2. Build comment submission interface
3. Implement comment display and threading
4. Add comment moderation for ${input.name}
5. Create reply functionality
6. Implement comment voting/rating if needed

Focus on community engagement for ${input.name} and content interaction.`;
  };

  const generateDashboardPrompt = (input: ProjectInput, analysis: any) => {
    return `Build analytics dashboard for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

DASHBOARD FEATURES:
1. Create data visualization components for ${input.name}
2. Implement charts and graphs for key metrics
3. Build real-time data updates for dashboard
4. Add filtering and date range selection
5. Create responsive dashboard layout
6. Implement data export functionality

Focus on ${input.name} specific metrics and business intelligence needs.`;
  };

  const generateSocialPrompt = (input: ProjectInput, analysis: any) => {
    return `Implement social features for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SOCIAL FEATURES:
1. Create user profile system for ${input.name}
2. Build post creation and sharing
3. Implement user follow/friend system
4. Create activity feed for ${input.name} users
5. Add social interactions (likes, shares, comments)
6. Build notification system

Focus on community building and user engagement for ${input.name}.`;
  };

  const generateBookingPrompt = (input: ProjectInput, analysis: any) => {
    return `Build booking system for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

BOOKING FEATURES:
1. Create appointment/booking model for ${input.name}
2. Build calendar interface for ${input.name}
3. Implement time slot management
4. Add booking confirmation and notifications
5. Create booking management dashboard
6. Implement cancellation and rescheduling

Focus on ${input.name} scheduling needs and appointment management.`;
  };

  const generateGenericPrompt = (input: ProjectInput, analysis: any) => {
    return `Build the core functionality for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

BASED ON YOUR PROJECT DESCRIPTION, IMPLEMENT:
1. Main features described in "${input.description}"
2. Core business logic for ${input.name}
3. User interface components for key features
4. Data management and CRUD operations
5. User workflows and interactions

${analysis.features.length > 0 ? 
  `DETECTED FEATURES TO FOCUS ON:\n${analysis.features.map(f => `- ${f.replace('_', ' ')}`).join('\n')}` : ''}

Make this implementation specific to ${input.name} requirements and user needs.`;
  };

  const generateTeamCollaborationPrompt = (input: ProjectInput, analysis: any) => {
    return `Implement team collaboration features for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

TEAM FEATURES:
1. Create team/organization model for ${input.name}
2. Build team member invitation system
3. Implement role-based permissions
4. Add team workspace for ${input.name}
5. Create team activity tracking
6. Build team communication features

Focus on collaboration needs specific to ${input.name} workflow.`;
  };

  const generatePaymentPrompt = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    return `Implement payment processing for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

PAYMENT FEATURES:
1. Set up Stripe payment gateway for ${input.name}
2. Create checkout interface and payment forms
3. Implement secure payment processing
4. Add payment confirmation and receipts
5. Create subscription management if needed
6. Handle payment webhooks and notifications

Focus on ${input.name} monetization strategy and payment security.`;
  };

  const generateRealTimePrompt = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    return `Implement real-time features for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

REAL-TIME FEATURES:
1. Set up WebSocket connections for ${input.name}
2. Implement live data synchronization
3. Add real-time notifications
4. Create live updates for user interfaces
5. Build real-time collaboration features
6. Optimize for performance and scalability

Focus on ${input.name} real-time interaction needs and user experience.`;
  };

  const generateSearchPrompt = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    return `Build search functionality for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SEARCH FEATURES:
1. Create search interface for ${input.name}
2. Implement full-text search capabilities
3. Add advanced filtering options
4. Create search result display and pagination
5. Implement search autocomplete and suggestions
6. Add search analytics and optimization

Focus on ${input.name} content discovery and user search needs.`;
  };

  // MICRO-STEP PROMPT GENERATORS
  const generateFrontendSetupMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const projectSlug = input.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const framework = recommendations.recommendedTechStack.includes('Next.js') ? 'Next.js' : 'React';
    
    return `You are setting up the frontend for "${input.name}" - a ${analysis.projectType.replace('_', ' ')} application.

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Create ONLY the basic ${framework} project structure.

EXACT COMMANDS:
${framework === 'Next.js' ? 
  `1. Run: npx create-next-app@latest ${projectSlug} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
2. Navigate to project directory: cd ${projectSlug}` :
  `1. Run: npx create-react-app ${projectSlug} --template typescript
2. Navigate to project directory: cd ${projectSlug}`}

3. Create these folders in src/:
   - components/
   - pages/
   - hooks/
   - utils/
   - lib/
   - types/

4. Remove unnecessary files: ${framework === 'Next.js' ? 'README.md boilerplate' : 'App.test.tsx, logo.svg, reportWebVitals.ts'}

DO NOT:
- Install additional packages
- Modify any components
- Set up routing beyond basic structure
- Add styling frameworks
- Create any business logic

OUTPUT: Basic ${framework} project structure ready for development
TEST: ${framework === 'Next.js' ? 'npm run dev' : 'npm start'} should show default page

Stop here. Dependencies will be installed in next step.`;
  };

  const generateFrontendDependenciesMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const uiLibrary = recommendations.recommendedTechStack.includes('Material-UI') ? '@mui/material @emotion/react @emotion/styled' : 
                     recommendations.recommendedTechStack.includes('Chakra') ? '@chakra-ui/react @emotion/react @emotion/styled framer-motion' :
                     'lucide-react class-variance-authority clsx tailwind-merge';
    
    return `Install essential dependencies for "${input.name}" frontend.

PROJECT CONTEXT: "${input.description}"

SINGLE TASK: Install ONLY the core UI and utility packages.

EXACT COMMANDS:
1. Install UI library: npm install ${uiLibrary}
2. Install utilities: npm install axios react-query
${analysis.features.includes('real_time_updates') ? '3. Install WebSocket: npm install socket.io-client' : ''}
${analysis.features.includes('payment_processing') ? '3. Install Stripe: npm install @stripe/stripe-js @stripe/react-stripe-js' : ''}

DO NOT:
- Install backend dependencies
- Install testing libraries
- Install development tools
- Configure any packages
- Modify any code files

OUTPUT: All essential frontend packages installed
TEST: npm list should show all packages, npm start should still work

Stop here. Backend setup comes next.`;
  };

  const generateBackendSetupMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const projectSlug = input.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    return `Create the backend server structure for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Create ONLY the basic Express server foundation.

CREATE FILE STRUCTURE:
\`\`\`
backend/
├── src/
│   ├── index.js
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── utils/
├── package.json
└── .env.example
\`\`\`

EXACT CODE for src/index.js:
\`\`\`javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: '${input.name} API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`${input.name} server running on port \${PORT}\`);
});
\`\`\`

EXACT COMMANDS:
1. mkdir backend && cd backend
2. npm init -y
3. npm install express cors dotenv
4. Create folder structure as shown above

DO NOT:
- Set up database connections
- Create API routes
- Add authentication
- Configure advanced middleware

OUTPUT: Basic Express server that starts successfully
TEST: node src/index.js should start server, GET /health should return JSON

Stop here. Database connection comes next.`;
  };

  const generateDatabaseConnectionMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const dbType = recommendations.recommendedTechStack.includes('MongoDB') ? 'MongoDB' : 
                   recommendations.recommendedTechStack.includes('PostgreSQL') ? 'PostgreSQL' : 'MongoDB';
    
    return `Setup database connection for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Configure ONLY the ${dbType} database connection.

INSTALL DEPENDENCIES:
${dbType === 'MongoDB' ? 
  'npm install mongoose' : 
  'npm install pg'}

CREATE FILE: src/config/database.js
\`\`\`javascript
${dbType === 'MongoDB' ? 
  `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}');
    console.log(\`${input.name} MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`${input.name} Database connection error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;` :
  `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}',
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('${input.name} PostgreSQL Connected');
    client.release();
  } catch (error) {
    console.error(\`${input.name} Database connection error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };`}
\`\`\`

UPDATE src/index.js - ADD these lines after require statements:
\`\`\`javascript
const ${dbType === 'MongoDB' ? 'connectDB' : '{ connectDB }'} = require('./config/database');

// Connect to database
connectDB();
\`\`\`

DO NOT:
- Create database schemas
- Create models
- Add data validation
- Create database operations

OUTPUT: Database connects successfully when server starts
TEST: Server should log successful database connection

Stop here. Authentication setup comes next.`;
  };

  // AUTHENTICATION MICRO-STEP GENERATORS
  const generateUserModelMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const dbType = recommendations.recommendedTechStack.includes('MongoDB') ? 'MongoDB' : 'PostgreSQL';
    
    return `Create user model for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Define ONLY the user data structure.

CREATE FILE: ${dbType === 'MongoDB' ? 'src/models/User.js' : 'src/models/user.js'}
\`\`\`javascript
${dbType === 'MongoDB' ? 
  `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);` :
  `const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const createUsersTable = async () => {
  const query = \`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  \`;
  
  try {
    await pool.query(query);
    console.log('${input.name} users table created');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

module.exports = { createUsersTable, hashPassword };`}
\`\`\`

INSTALL DEPENDENCY:
npm install bcryptjs

DO NOT:
- Create authentication routes
- Build login/register forms
- Add JWT functionality
- Create user operations

OUTPUT: User model defined with password hashing
TEST: Model should import without errors

Stop here. Registration form comes next.`;
  };

  const generateRegistrationFormMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const framework = recommendations.recommendedTechStack.includes('Next.js') ? 'Next.js' : 'React';
    
    return `Create registration form for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Build ONLY the registration form component.

CREATE FILE: src/components/RegistrationForm.${framework === 'Next.js' ? 'tsx' : 'jsx'}
\`\`\`${framework === 'Next.js' ? 'typescript' : 'javascript'}
${framework === 'Next.js' ? "import { useState } from 'react';" : "import React, { useState } from 'react';"}

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e${framework === 'Next.js' ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors${framework === 'Next.js' ? ': any' : ''} = {};
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email || !/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e${framework === 'Next.js' ? ': React.FormEvent' : ''}) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // API call will be implemented in next step
      console.log('${input.name} registration data:', formData);
      alert('Registration form works! API integration comes next.');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Join ${input.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
\`\`\`

DO NOT:
- Connect to API endpoints
- Add authentication logic
- Implement actual registration
- Add advanced styling

OUTPUT: Functional registration form with validation
TEST: Form should render, validate inputs, and show success message

Stop here. Registration API comes next.`;
  };

  const generateRegistrationAPIMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const dbType = recommendations.recommendedTechStack.includes('MongoDB') ? 'MongoDB' : 'PostgreSQL';
    
    return `Create registration API endpoint for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Build ONLY the registration API endpoint.

CREATE FILE: src/routes/auth.js
\`\`\`javascript
const express = require('express');
${dbType === 'MongoDB' ? 
  "const User = require('../models/User');" : 
  "const { pool, hashPassword } = require('../models/user');"}
const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

${dbType === 'MongoDB' ? 
  `    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password // Will be hashed by pre-save middleware
    });
    
    await newUser.save();
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;` :
  `    // Check if user already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1 OR username = $2';
    const existingUser = await pool.query(existingUserQuery, [email, username]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const insertQuery = \`
      INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, role, created_at
    \`;
    
    const result = await pool.query(insertQuery, [username, email, hashedPassword]);
    const userResponse = result.rows[0];`}
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully for ${input.name}',
      user: userResponse
    });
    
  } catch (error) {
    console.error('${input.name} registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

module.exports = router;
\`\`\`

UPDATE src/index.js - ADD these lines:
\`\`\`javascript
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/auth', authRoutes);
\`\`\`

DO NOT:
- Add JWT token generation
- Create login functionality
- Add session management
- Implement user authentication

OUTPUT: Working registration endpoint
TEST: POST /api/auth/register should create users successfully

Stop here. Login form comes next.`;
  };

  const generateLoginFormMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const framework = recommendations.recommendedTechStack.includes('Next.js') ? 'Next.js' : 'React';
    
    return `Create login form for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Build ONLY the login form component.

CREATE FILE: src/components/LoginForm.${framework === 'Next.js' ? 'tsx' : 'jsx'}
\`\`\`${framework === 'Next.js' ? 'typescript' : 'javascript'}
${framework === 'Next.js' ? "import { useState } from 'react';" : "import React, { useState } from 'react';"}

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e${framework === 'Next.js' ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors${framework === 'Next.js' ? ': any' : ''} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e${framework === 'Next.js' ? ': React.FormEvent' : ''}) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // API call will be implemented in next step
      console.log('${input.name} login data:', formData);
      alert('Login form works! API integration comes next.');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome to ${input.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account? 
        <span className="text-blue-600 cursor-pointer hover:underline ml-1">
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
\`\`\`

DO NOT:
- Connect to API endpoints
- Add authentication logic
- Implement session management
- Add JWT handling

OUTPUT: Functional login form with validation
TEST: Form should render, validate inputs, and show success message

Stop here. Login API comes next.`;
  };

  const generateLoginAPIMicroStep = (input: ProjectInput, recommendations: Recommendations, analysis: any) => {
    const dbType = recommendations.recommendedTechStack.includes('MongoDB') ? 'MongoDB' : 'PostgreSQL';
    
    return `Create login API endpoint for "${input.name}".

PROJECT DESCRIPTION: "${input.description}"

SINGLE TASK: Build ONLY the login API endpoint with JWT.

INSTALL DEPENDENCIES:
npm install jsonwebtoken

UPDATE src/routes/auth.js - ADD login endpoint:
\`\`\`javascript
const jwt = require('jsonwebtoken');
${dbType === 'MongoDB' ? 
  "const bcrypt = require('bcryptjs');" : 
  "const bcrypt = require('bcryptjs');"}

// Add this after the registration endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

${dbType === 'MongoDB' ? 
  `    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Remove password from user object
    const userResponse = user.toObject();
    delete userResponse.password;` :
  `    // Find user by email
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const user = userResult.rows[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;`}
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: ${dbType === 'MongoDB' ? 'user._id' : 'user.id'}, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET || '${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_secret_key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful for ${input.name}',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('${input.name} login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});
\`\`\`

ADD TO .env file:
\`\`\`
JWT_SECRET=${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_jwt_secret_key_change_in_production
\`\`\`

DO NOT:
- Add token refresh functionality
- Create protected routes
- Add session management
- Implement user profile features

OUTPUT: Working login endpoint with JWT tokens
TEST: POST /api/auth/login should return JWT token

Stop here. Core features come next.`;
  };

  const generateIntelligentRoadmap = (input: ProjectInput, recommendations: Recommendations): RoadmapStep[] => {
    console.log("=== GENERATING GRANULAR ROADMAP ===");
    console.log("Project Name:", input.name);
    console.log("Project Description:", input.description);
    
    const analysis = analyzeProjectDetails(input);
    const steps: RoadmapStep[] = [];
    let stepNumber = 1;

    // PHASE 1: PROJECT FOUNDATION - MICRO-STEPS
    // MODULE 1.1: Frontend Setup
    steps.push({
      stepNumber: stepNumber++,
      title: `Create ${input.name} Frontend Structure`,
      description: `Initialize React/Next.js project structure for ${input.name} - Basic setup only`,
      estimatedTime: "15 minutes",
      isCompleted: false,
      dependencies: [],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} FRONTEND**: My ${input.name} frontend initialization is failing. Help me create the basic React/Next.js project structure.`,
      ],
      startPrompt: generateFrontendSetupMicroStep(input, recommendations, analysis),
      validationChecklist: [
        `${input.name} frontend project created`,
        "Essential folder structure exists",
        "Development server can start",
        "No build errors in terminal"
      ]
    });

    steps.push({
      stepNumber: stepNumber++,
      title: `Install ${input.name} Frontend Dependencies`,
      description: `Install core UI libraries and dependencies for ${input.name} - Dependencies only`,
      estimatedTime: "10 minutes",
      isCompleted: false,
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} DEPENDENCIES**: My ${input.name} dependency installation is failing. Help me install the required packages.`,
      ],
      startPrompt: generateFrontendDependenciesMicroStep(input, recommendations, analysis),
      validationChecklist: [
        "All dependencies installed successfully",
        "No package conflicts in package.json",
        "Node modules directory exists",
        "Project still builds without errors"
      ]
    });

    // MODULE 1.2: Backend Setup
    steps.push({
      stepNumber: stepNumber++,
      title: `Create ${input.name} Backend Server Structure`,
      description: `Initialize Express server structure for ${input.name} - Server foundation only`,
      estimatedTime: "15 minutes",
      isCompleted: false,
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} BACKEND**: My ${input.name} backend server setup is failing. Help me create the Express server structure.`,
      ],
      startPrompt: generateBackendSetupMicroStep(input, recommendations, analysis),
      validationChecklist: [
        "Express server file created",
        "Basic middleware configured",
        "Server starts successfully",
        "Health check endpoint responds"
      ]
    });

    steps.push({
      stepNumber: stepNumber++,
      title: `Setup ${input.name} Database Connection`,
      description: `Configure database connection for ${input.name} - Connection setup only`,
      estimatedTime: "20 minutes",
      isCompleted: false,
      dependencies: [3],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} DATABASE**: My ${input.name} database connection is failing. Help me configure the database connection.`,
      ],
      startPrompt: generateDatabaseConnectionMicroStep(input, recommendations, analysis),
      validationChecklist: [
        "Database connection file created",
        "Connection string configured",
        "Database connects successfully",
        "Connection error handling implemented"
      ]
    });

    // PHASE 2: AUTHENTICATION (if needed)
    if (input.authenticationNeeds !== 'None' || analysis.features.includes('user_authentication')) {
      const authType = analysis.features.includes('social_authentication') ? 'OAuth' : input.authenticationNeeds;
      
      steps.push({
        stepNumber: stepNumber++,
        title: `Create ${input.name} User Model`,
        description: `Define user data structure for ${input.name} - Model definition only`,
        estimatedTime: "15 minutes",
        isCompleted: false,
        dependencies: [4],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} USER MODEL**: My ${input.name} user model creation is failing. Help me define the user schema.`,
        ],
        startPrompt: generateUserModelMicroStep(input, recommendations, analysis),
        validationChecklist: [
          "User model file created",
          "Required fields defined",
          "Model exports properly",
          "No syntax errors in model"
        ]
      });

      steps.push({
        stepNumber: stepNumber++,
        title: `Build ${input.name} Registration Form`,
        description: `Create user registration form for ${input.name} - Frontend form only`,
        estimatedTime: "20 minutes",
        isCompleted: false,
        dependencies: [2, 5],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} REGISTRATION**: My ${input.name} registration form is broken. Help me create the registration form component.`,
        ],
        startPrompt: generateRegistrationFormMicroStep(input, recommendations, analysis),
        validationChecklist: [
          "Registration form component created",
          "Form fields render correctly",
          "Basic form validation works",
          "Form submits without errors"
        ]
      });

      steps.push({
        stepNumber: stepNumber++,
        title: `Create ${input.name} Registration API`,
        description: `Build registration endpoint for ${input.name} - API endpoint only`,
        estimatedTime: "25 minutes",
        isCompleted: false,
        dependencies: [3, 5],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} REG API**: My ${input.name} registration API is failing. Help me create the registration endpoint.`,
        ],
        startPrompt: generateRegistrationAPIMicroStep(input, recommendations, analysis),
        validationChecklist: [
          "Registration endpoint created",
          "Password hashing implemented",
          "User data validation works",
          "API returns proper responses"
        ]
      });

      steps.push({
        stepNumber: stepNumber++,
        title: `Build ${input.name} Login Form`,
        description: `Create user login form for ${input.name} - Frontend form only`,
        estimatedTime: "20 minutes",
        isCompleted: false,
        dependencies: [6],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} LOGIN**: My ${input.name} login form is broken. Help me create the login form component.`,
        ],
        startPrompt: generateLoginFormMicroStep(input, recommendations, analysis),
        validationChecklist: [
          "Login form component created",
          "Form fields render correctly",
          "Form validation works",
          "Form connects to API"
        ]
      });

      steps.push({
        stepNumber: stepNumber++,
        title: `Create ${input.name} Login API`,
        description: `Build login endpoint for ${input.name} - API endpoint only`,
        estimatedTime: "25 minutes",
        isCompleted: false,
        dependencies: [7],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} LOGIN API**: My ${input.name} login API is failing. Help me create the login endpoint.`,
        ],
        startPrompt: generateLoginAPIMicroStep(input, recommendations, analysis),
        validationChecklist: [
          "Login endpoint created",
          "Password verification works",
          "JWT tokens generated",
          "Session management functional"
        ]
      });
    }

    // Add custom project-specific steps
    const customSteps = analysis.customSteps;
    customSteps.forEach((customStep: any) => {
      steps.push({
        stepNumber: stepNumber++,
        title: customStep.title,
        description: customStep.description,
        estimatedTime: customStep.estimatedTime,
        isCompleted: false,
        dependencies: customStep.dependencies,
        rescuePrompts: customStep.rescuePrompts,
        startPrompt: customStep.startPrompt,
        validationChecklist: customStep.validationChecklist
      });
    });

    // Add feature-specific steps based on detected features
    if (analysis.features.includes('payment_processing')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `${input.name} Payment System`,
        description: `Implement secure payment processing for ${input.name} using Stripe or similar payment gateway`,
        estimatedTime: "4-6 hours",
        isCompleted: false,
        dependencies: [1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} PAYMENTS**: My ${input.name} payment integration is failing. Debug Stripe setup, webhook handling, and payment flow issues.`,
          `**AI CODING AGENT RESCUE - CHECKOUT ERRORS**: Fix all payment processing errors in ${input.name} checkout system.`
        ],
        startPrompt: generatePaymentPrompt(input, recommendations, analysis),
        validationChecklist: [
          "Payment gateway is properly configured",
          "Checkout process works end-to-end",
          "Payment webhooks are handled correctly",
          "Payment security is implemented"
        ]
      });
    }

    if (analysis.features.includes('real_time_updates')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `${input.name} Real-time Features`,
        description: `Implement real-time updates and live data synchronization for ${input.name}`,
        estimatedTime: "3-5 hours",
        isCompleted: false,
        dependencies: [1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} REAL-TIME**: My ${input.name} real-time features are not working. Debug WebSocket connections and live data updates.`,
          `**AI CODING AGENT RESCUE - WEBSOCKET ERRORS**: Fix all real-time communication issues in ${input.name}.`
        ],
        startPrompt: generateRealTimePrompt(input, recommendations, analysis),
        validationChecklist: [
          "Real-time updates work correctly",
          "WebSocket connections are stable",
          "Live data synchronization functional",
          "Real-time UI updates responsive"
        ]
      });
    }

    if (analysis.features.includes('search_functionality')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `${input.name} Search System`,
        description: `Build comprehensive search and filtering capabilities for ${input.name}`,
        estimatedTime: "2-4 hours",
        isCompleted: false,
        dependencies: [1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} SEARCH**: My ${input.name} search functionality is broken. Debug search queries, indexing, and filtering logic.`,
          `**AI CODING AGENT RESCUE - SEARCH ERRORS**: Fix all search and filter issues in ${input.name}.`
        ],
        startPrompt: generateSearchPrompt(input, recommendations, analysis),
        validationChecklist: [
          "Search functionality works accurately",
          "Filtering options are functional",
          "Search results are properly formatted",
          "Search performance is optimized"
        ]
      });
    }

    // Add integrations if specified
    if (input.integrations.length > 0) {
      steps.push({
        stepNumber: stepNumber++,
        title: "Third-party Integrations",
        description: `Integrate ${input.integrations.join(', ')} services`,
        estimatedTime: `${input.integrations.length * 3}-${input.integrations.length * 5} hours`,
        isCompleted: false,
        dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - API INTEGRATIONS**: My third-party API integrations are failing. Debug connection and authentication issues.",
          "**AI CODING AGENT RESCUE - INTEGRATION AUTH**: Fix API authentication and authorization issues with working OAuth flows."
        ],
        startPrompt: generateIntegrationsPrompt(input, recommendations),
        validationChecklist: [
          "All integrations are connected",
          "API authentication working",
          "Error handling implemented",
          "Rate limiting configured"
        ]
      });
    }

    // Add testing phase
    steps.push({
      stepNumber: stepNumber++,
      title: "Testing & Quality Assurance",
      description: "Implement comprehensive testing suite and quality checks",
      estimatedTime: "4-8 hours",
      isCompleted: false,
      dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
      rescuePrompts: [
        "**AI CODING AGENT RESCUE - TESTING**: My test suite is failing. Debug test configuration and assertion problems.",
        "**AI CODING AGENT RESCUE - TEST COVERAGE**: Fix test coverage gaps with complete working test files."
      ],
      startPrompt: generateTestingPrompt(input, recommendations),
      validationChecklist: [
        "Unit tests are passing",
        "Integration tests working",
        "Test coverage adequate",
        "CI/CD pipeline functional"
      ]
    });

    // Always end with deployment
    steps.push({
      stepNumber: stepNumber++,
      title: "Production Deployment",
      description: `Deploy to ${input.hostingType} with full production configuration`,
      estimatedTime: "4-8 hours",
      isCompleted: false,
      dependencies: Array.from({length: stepNumber - 2}, (_, i) => i + 1),
      rescuePrompts: [
        "**AI CODING AGENT RESCUE - DEPLOYMENT**: My deployment is failing. Debug hosting and environment configuration issues.",
        "**AI CODING AGENT RESCUE - PRODUCTION**: Fix production environment setup with complete deployment configuration."
      ],
      startPrompt: generateDeploymentPrompt(input, recommendations),
      validationChecklist: [
        "Application is accessible via public URL",
        "SSL certificates are configured",
        "Environment variables are properly set",
        "CI/CD pipeline is working",
        "Monitoring is in place"
      ]
    });

    return steps;
  };

  const extractFeaturesFromDescription = (description: string) => {
    const features: any[] = [];
    
    const featurePatterns = [
      {
        keywords: ['chat', 'messaging', 'real-time', 'socket'],
        title: 'Real-time Messaging System',
        description: 'Implement chat functionality with real-time messaging',
        estimatedTime: '8-12 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - REAL-TIME**: My WebSocket/real-time functionality is broken. Debug connection issues and message delivery.",
          "**AI CODING AGENT RESCUE - CHAT**: Fix chat interface and messaging system with complete working components."
        ],
        startPrompt: "Build a complete real-time messaging system with WebSocket connections, message persistence, and user presence indicators.",
        validationChecklist: [
          "Real-time messaging works",
          "Message persistence functional",
          "User presence indicators working",
          "WebSocket connections stable"
        ]
      },
      {
        keywords: ['dashboard', 'analytics', 'charts', 'graphs', 'metrics'],
        title: 'Analytics Dashboard',
        description: 'Create comprehensive analytics dashboard with charts and metrics',
        estimatedTime: '6-10 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - DASHBOARD**: My analytics dashboard is not displaying data correctly. Debug chart rendering and data aggregation.",
          "**AI CODING AGENT RESCUE - CHARTS**: Fix chart components and data visualization with complete working dashboard."
        ],
        startPrompt: "Build a comprehensive analytics dashboard with interactive charts, real-time data updates, and customizable metrics visualization.",
        validationChecklist: [
          "Charts render correctly",
          "Data aggregation working",
          "Real-time updates functional",
          "Responsive design implemented"
        ]
      },
      {
        keywords: ['payment', 'stripe', 'billing', 'subscription', 'checkout'],
        title: 'Payment Processing System',
        description: 'Implement secure payment processing and billing',
        estimatedTime: '8-12 hours',
        dependencies: [1, 2, 3],
        rescuePrompts: [
          "**AI CODING AGENT RESCUE - PAYMENTS**: My payment system is failing. Debug Stripe integration and transaction processing.",
          "**AI CODING AGENT RESCUE - BILLING**: Fix billing and subscription management with complete working payment flows."
        ],
        startPrompt: "Implement a complete payment processing system with Stripe integration, subscription management, and secure checkout flows.",
        validationChecklist: [
          "Payment processing works",
          "Webhooks are functional",
          "Subscription management implemented",
          "Security measures in place"
        ]
      }
    ];

    featurePatterns.forEach(pattern => {
      if (pattern.keywords.some(keyword => description.includes(keyword))) {
        features.push(pattern);
      }
    });

    return features;
  };

  const generateSetupPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - PROJECT SETUP**

I need help setting up a new ${input.targetAudience} ${input.platform.toLowerCase()} project. Please act as an expert ${input.experienceLevel} developer and provide COMPLETE, EXECUTABLE code and commands.

**PROJECT SPECIFICATIONS:**
- Project Name: ${input.name}
- Target Users: ${input.targetAudience} with ${input.expectedUsers} expected users  
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Complexity Level: ${recommendations.suggestedComplexity}
- Design Requirements: ${input.responsiveness}

**SPECIFIC TASKS FOR AI AGENT:**
1. Generate complete project initialization commands
2. Create full directory structure with all necessary folders
3. Write complete configuration files (package.json, tsconfig.json, etc.)
4. Set up routing system with example routes
5. Create starter components with proper TypeScript types
6. Generate .gitignore file with all necessary exclusions

**OUTPUT FORMAT REQUIRED:**
- Provide exact terminal commands that I can copy-paste
- Include complete file contents, not just snippets
- Add comments explaining each step for ${input.experienceLevel} developers
- Structure response as: Commands → File Contents → Verification Steps`;
  };

  const generateAuthPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - AUTHENTICATION SYSTEM**

I need you to implement a complete ${input.authenticationNeeds} authentication system. Provide FULL, WORKING code that I can copy directly into my project.

**PROJECT CONTEXT:**
- App: ${input.name} (${input.targetAudience} application)
- Expected Users: ${input.expectedUsers}
- Platform: ${input.platform}
- Auth Type: ${input.authenticationNeeds}
- Design Style: ${input.designComplexity}

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE authentication system - no partial implementations
✅ FULL login/register forms with working validation
✅ COMPLETE protected route system with redirect logic
✅ WORKING session management and user persistence
✅ COMPLETE password security (hashing, salting, validation)
✅ FULL user profile management interface

**DELIVERABLE FORMAT:**
📁 Complete file structure with exact paths
🔧 Installation commands for dependencies
📄 Complete component files (no TODO comments)
⚙️ Configuration files with environment variables
🔒 Security middleware and route protection
📱 Responsive forms for ${input.responsiveness}
🧪 Testing commands to verify functionality`;
  };

  const generateDatabasePrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - DATABASE & DATA MANAGEMENT**

Build a complete ${input.dataComplexity} system for my application. I need COMPLETE, EXECUTABLE code that handles ${input.expectedUsers} users efficiently.

**PROJECT REQUIREMENTS:**
- Application: ${input.name} (${input.targetAudience})
- Data Complexity: ${input.dataComplexity}
- User Scale: ${input.expectedUsers}
- Performance Needs: ${input.performanceNeeds}

**COMPLETE IMPLEMENTATION NEEDED:**
1. Full database schema design with all tables/collections
2. Complete database setup and connection configuration
3. All CRUD operations with TypeScript interfaces
4. Data validation schemas and error handling
5. Database migrations and seeding scripts
6. API endpoints with full request/response handling

**CRITICAL:** Provide complete, copy-paste ready code files with proper file structure and integration instructions.`;
  };

  const generateIntegrationsPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - THIRD-PARTY INTEGRATIONS**

Implement complete integrations for ${input.integrations.join(', ')} in my ${input.targetAudience} application. Provide FULL, WORKING integration code.

**INTEGRATION SPECIFICATIONS:**
- App: ${input.name} (${input.platform})
- Services: ${input.integrations.join(', ')}
- Budget Tier: ${input.budget}
- User Scale: ${input.expectedUsers}
- Performance: ${input.performanceNeeds}

**AI AGENT REQUIREMENTS:**
- Complete API service classes with all methods
- Full authentication setup (API keys, OAuth, webhooks)
- Error handling with retry logic and fallbacks
- Rate limiting and quota management implementation
- Complete UI components for each integration
- TypeScript interfaces for all API responses
- Environment configuration and secrets management`;
  };

  const generateTestingPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - TESTING & QUALITY ASSURANCE**

Create a comprehensive testing suite for my ${input.name} application. Provide COMPLETE, EXECUTABLE test files and configuration.

**PROJECT CONTEXT:**
- Application: ${input.name} (${input.targetAudience})
- Tech Stack: ${recommendations.recommendedTechStack.join(', ')}
- Complexity: ${recommendations.suggestedComplexity}
- User Scale: ${input.expectedUsers}

**COMPLETE TESTING IMPLEMENTATION:**
1. Unit tests for all components and functions
2. Integration tests for API endpoints
3. End-to-end tests for critical user flows
4. Performance tests for ${input.expectedUsers} load
5. Security tests for authentication and data protection
6. Complete test configuration and CI/CD setup

**CRITICAL:** All tests must be immediately runnable with provided commands.`;
  };

  const generateDeploymentPrompt = (input: ProjectInput, recommendations: Recommendations) => {
    return `**AI CODING ASSISTANT PROMPT - PRODUCTION DEPLOYMENT**

Deploy my ${input.targetAudience} application to production. I need COMPLETE deployment configuration and scripts that I can execute immediately.

**DEPLOYMENT SPECIFICATIONS:**
- Application: ${input.name} (${input.platform})
- Hosting Platform: ${input.hostingType}
- Expected Traffic: ${input.expectedUsers}
- Performance Tier: ${input.performanceNeeds}
- Budget Level: ${input.budget}

**CRITICAL AI AGENT REQUIREMENTS:**
✅ COMPLETE deployment configuration - no partial setups
✅ FULL CI/CD pipeline with working builds and tests
✅ COMPLETE environment and secrets management
✅ WORKING SSL/TLS and domain configuration
✅ COMPLETE database deployment with migrations
✅ FULL monitoring, logging, and alerting system

**EXECUTION FORMAT:**
1. **INFRASTRUCTURE**: Complete hosting platform setup
2. **CI/CD**: Full pipeline configuration with testing
3. **DEPLOYMENT**: Production deployment scripts
4. **MONITORING**: Complete observability stack
5. **SECURITY**: SSL, secrets, and hardening
6. **VERIFICATION**: Step-by-step deployment testing`;
  };

  const generateProjectRecipe = (input: ProjectInput, recommendations: Recommendations): ProjectRecipe => {
    return {
      architecture: {
        frontend: recommendations.recommendedTechStack.find(tech => tech.includes('React') || tech.includes('Vue') || tech.includes('Angular')) || 'React + TypeScript',
        backend: recommendations.recommendedTechStack.find(tech => tech.includes('Node') || tech.includes('Express') || tech.includes('Nest')) || 'Node.js + Express',
        database: recommendations.recommendedTechStack.find(tech => tech.includes('SQL') || tech.includes('MongoDB') || tech.includes('Firebase')) || 'PostgreSQL'
      },
      timeline: {
        setup: "2-4 hours",
        authentication: input.authenticationNeeds === 'None' ? "0 hours" : "4-8 hours",
        coreFeatures: recommendations.suggestedComplexity === 'simple' ? "8-16 hours" : 
                     recommendations.suggestedComplexity === 'medium' ? "20-40 hours" : "40-80 hours",
        total: recommendations.estimatedTimeline
      },
      deploymentStrategy: {
        hosting: input.hostingType === 'Cloud platform' ? 'Vercel/Netlify + Railway/Supabase' : input.hostingType,
        cicd: 'GitHub Actions with automated testing',
        scaling: input.expectedUsers === 'Enterprise scale' ? 'Load balancer + CDN + Auto-scaling' : 'Standard hosting'
      },
      fileStructure: generateComprehensiveFileStructure(input, recommendations),
      databaseSchema: generateComprehensiveDatabaseSchema(input),
      apiEndpoints: generateComprehensiveAPIEndpoints(input),
      uiComponents: generateComprehensiveUIComponents(input),
      dependencies: generateComprehensiveDependencies(recommendations),
      detailedTimeline: generateComprehensiveTimeline(input, recommendations)
    };
  };

  const generateComprehensiveFileStructure = (input: ProjectInput, recommendations: Recommendations) => {
    const frontend = recommendations.recommendedTechStack.find(tech => tech.includes('React')) ? 'React' : 'Vue';
    const backend = recommendations.recommendedTechStack.find(tech => tech.includes('Node')) ? 'Node.js' : 'Express';
    
    return `
project-root/
├── client/ (Frontend - ${frontend})
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Button, Input, Modal, etc.)
│   │   │   ├── auth/ (Login, Register, Profile)
│   │   │   ├── layout/ (Header, Footer, Sidebar)
│   │   │   ├── features/ (Core feature components)
│   │   │   └── shared/ (Reusable components)
│   │   ├── pages/
│   │   │   ├── auth/ (Login, Register pages)
│   │   │   ├── dashboard/ (Main dashboard)
│   │   │   └── settings/ (User settings)
│   │   ├── hooks/ (Custom React hooks)
│   │   ├── lib/ (API client, utilities)
│   │   ├── types/ (TypeScript definitions)
│   │   ├── context/ (React Context providers)
│   │   ├── utils/ (Helper functions)
│   │   └── assets/ (Images, icons, styles)
│   ├── public/
│   ├── tests/ (Component & integration tests)
│   └── docs/ (Component documentation)
├── server/ (Backend - ${backend})
│   ├── src/
│   │   ├── controllers/ (Route handlers)
│   │   ├── middleware/ (Auth, validation, etc.)
│   │   ├── models/ (Database models)
│   │   ├── routes/ (API routes)
│   │   ├── services/ (Business logic)
│   │   ├── utils/ (Helper functions)
│   │   ├── config/ (Database, environment)
│   │   └── types/ (TypeScript definitions)
│   ├── tests/ (API & unit tests)
│   └── migrations/ (Database migrations)
├── shared/ (Shared types & utilities)
├── docs/ (Project documentation)
├── deployment/
│   ├── docker/ (Containerization)
│   ├── ci-cd/ (GitHub Actions)
│   └── scripts/ (Build & deploy scripts)
└── tools/ (Development tools & configs)`;
  };

  const generateComprehensiveDatabaseSchema = (input: ProjectInput) => {
    if (input.dataComplexity === 'Static content') return 'No database required - Static hosting';
    
    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    const hasChat = features.some(f => f.title.includes('Messaging'));
    const hasPayments = features.some(f => f.title.includes('Payment'));
    const hasAnalytics = features.some(f => f.title.includes('Analytics'));
    
    let schema = `-- Core User Management
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Sessions
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW()
);`;

    if (input.dataComplexity === 'Database driven' || input.dataComplexity === 'Complex analytics') {
      schema += `

-- Core Data Entities
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Main Data Items
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasChat) {
      schema += `

-- Real-time Messaging
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'group',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  reply_to INTEGER REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasPayments) {
      schema += `

-- Payment System
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_name VARCHAR(100),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    if (hasAnalytics) {
      schema += `

-- Analytics & Tracking
CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  properties JSONB,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);`;
    }

    schema += `

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_items_project ON items(project_id);
CREATE INDEX idx_items_assignee ON items(assignee_id);
CREATE INDEX idx_items_status ON items(status);`;

    if (hasChat) {
      schema += `
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);`;
    }

    if (hasAnalytics) {
      schema += `
CREATE INDEX idx_activities_user ON user_activities(user_id);
CREATE INDEX idx_activities_created ON user_activities(created_at);
CREATE INDEX idx_events_name ON analytics_events(event_name);`;
    }

    return schema;
  };

  const generateComprehensiveAPIEndpoints = (input: ProjectInput) => {
    let endpoints = `# Authentication Endpoints`;
    
    if (input.authenticationNeeds !== 'None') {
      endpoints += `
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Password reset confirmation
GET    /api/auth/verify-email   # Email verification
POST   /api/auth/resend-verification # Resend verification`;
    }

    endpoints += `

# User Management
GET    /api/users/profile       # Get current user profile
PUT    /api/users/profile       # Update user profile
POST   /api/users/avatar        # Upload avatar
GET    /api/users/preferences   # Get user preferences
PUT    /api/users/preferences   # Update preferences
DELETE /api/users/account       # Delete account`;

    if (input.dataComplexity !== 'Static content') {
      endpoints += `

# Core Resource Management
GET    /api/projects            # List user projects
POST   /api/projects            # Create new project
GET    /api/projects/:id        # Get project details
PUT    /api/projects/:id        # Update project
DELETE /api/projects/:id        # Delete project

# Project Members
GET    /api/projects/:id/members # List project members
POST   /api/projects/:id/members # Add member
PUT    /api/projects/:id/members/:userId # Update member role
DELETE /api/projects/:id/members/:userId # Remove member

# Items/Tasks Management
GET    /api/projects/:id/items  # List project items
POST   /api/projects/:id/items  # Create item
GET    /api/items/:id           # Get item details
PUT    /api/items/:id           # Update item
DELETE /api/items/:id           # Delete item
POST   /api/items/:id/assign    # Assign item to user`;
    }

    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    if (features.some(f => f.title.includes('Messaging'))) {
      endpoints += `

# Real-time Messaging
GET    /api/conversations       # List user conversations
POST   /api/conversations       # Create conversation
GET    /api/conversations/:id/messages # Get messages
POST   /api/conversations/:id/messages # Send message
PUT    /api/messages/:id        # Edit message
DELETE /api/messages/:id        # Delete message

# WebSocket Events
- user:online, user:offline
- message:new, message:updated
- typing:start, typing:stop`;
    }

    if (features.some(f => f.title.includes('Payment'))) {
      endpoints += `

# Payment System
GET    /api/billing/plans       # Available plans
POST   /api/billing/subscribe   # Create subscription
GET    /api/billing/subscription # Current subscription
PUT    /api/billing/subscription # Update subscription
DELETE /api/billing/subscription # Cancel subscription
GET    /api/billing/invoices    # Payment history
POST   /api/billing/portal      # Customer portal link`;
    }

    if (features.some(f => f.title.includes('Analytics'))) {
      endpoints += `

# Analytics & Reporting
GET    /api/analytics/dashboard # Dashboard metrics
GET    /api/analytics/users     # User analytics
GET    /api/analytics/projects  # Project analytics
POST   /api/analytics/events    # Track custom event
GET    /api/analytics/export    # Export data`;
    }

    if (input.integrations.length > 0) {
      endpoints += `

# Third-party Integrations`;
      input.integrations.forEach(integration => {
        endpoints += `
GET    /api/integrations/${integration.toLowerCase()} # ${integration} status
POST   /api/integrations/${integration.toLowerCase()}/connect # Connect ${integration}
DELETE /api/integrations/${integration.toLowerCase()}/disconnect # Disconnect ${integration}`;
      });
    }

    endpoints += `

# File Management
POST   /api/upload              # Upload file
GET    /api/files/:id           # Get file
DELETE /api/files/:id           # Delete file

# Search & Filtering
GET    /api/search              # Global search
GET    /api/search/users        # Search users
GET    /api/search/projects     # Search projects

# Admin (if applicable)
GET    /api/admin/stats         # System statistics
GET    /api/admin/users         # User management
POST   /api/admin/announcements # System announcements`;

    return endpoints;
  };

  const generateComprehensiveUIComponents = (input: ProjectInput) => {
    let components = `# Core UI Components

## Layout Components
- AppLayout: Main application wrapper
- Header: Navigation, user menu, notifications
- Sidebar: Main navigation, project switcher
- Footer: Links, version, status
- PageContainer: Consistent page wrapper

## Form Components
- Input: Text, email, password inputs
- Textarea: Multi-line text input
- Select: Dropdown selection
- Checkbox: Boolean input
- RadioGroup: Single selection from options
- DatePicker: Date/time selection
- FileUpload: File upload with preview
- FormField: Wrapper with label and validation

## UI Elements
- Button: Primary, secondary, danger variants
- Badge: Status indicators, counts
- Avatar: User profile pictures
- Card: Content containers
- Modal: Overlay dialogs
- Toast: Notification messages
- Loader: Loading states and skeletons
- Pagination: List navigation
- Tabs: Content organization
- Accordion: Collapsible content`;

    if (input.authenticationNeeds !== 'None') {
      components += `

## Authentication Components
- LoginForm: User login interface
- RegisterForm: User registration
- ForgotPasswordForm: Password reset request
- ResetPasswordForm: Password reset confirmation
- EmailVerification: Email verification prompt
- AuthGuard: Protected route wrapper
- UserProfile: Profile management
- PasswordChange: Password update form`;
    }

    if (input.dataComplexity !== 'Static content') {
      components += `

## Data Management Components
- ProjectCard: Project overview display
- ProjectList: Grid/list of projects
- ProjectForm: Create/edit projects
- ItemCard: Individual item display
- ItemList: List of items with filtering
- ItemForm: Create/edit items
- SearchBar: Global search interface
- FilterPanel: Advanced filtering options
- SortControls: Sorting options`;
    }

    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    if (features.some(f => f.title.includes('Messaging'))) {
      components += `

## Real-time Chat Components
- ChatWindow: Main chat interface
- MessageList: Message display area
- MessageInput: Message composition
- ConversationList: Chat list sidebar
- UserList: Online users display
- TypingIndicator: Typing status
- MessageBubble: Individual message
- EmojiPicker: Reaction selection`;
    }

    if (features.some(f => f.title.includes('Analytics'))) {
      components += `

## Analytics Components
- DashboardCard: Metric display cards
- ChartContainer: Chart wrapper
- LineChart: Time-series data
- BarChart: Comparison data
- PieChart: Proportion display
- MetricCard: Single statistic display
- DateRangePicker: Date filtering
- ExportButton: Data export controls`;
    }

    if (features.some(f => f.title.includes('Payment'))) {
      components += `

## Payment Components
- PricingCard: Plan display
- PaymentForm: Credit card input
- SubscriptionStatus: Current plan display
- BillingHistory: Payment history
- PlanUpgrade: Upgrade interface
- PaymentMethod: Saved payment display`;
    }

    components += `

## Responsive Design
- Mobile-first approach
- Tablet breakpoint adaptations
- Desktop optimizations
- Touch-friendly interactions
- Keyboard navigation support`;

    return components;
  };

  const generateComprehensiveDependencies = (recommendations: Recommendations) => {
    const frontend = recommendations.recommendedTechStack.find(tech => tech.includes('React')) ? 'React' : 'Vue';
    const backend = recommendations.recommendedTechStack.find(tech => tech.includes('Node')) ? 'Node.js' : 'Express';
    
    return `# Frontend Dependencies (${frontend})
## Core Framework
- ${frontend.toLowerCase()}: ^18.0.0
- typescript: ^5.0.0
- vite: ^4.0.0

## UI & Styling
- tailwindcss: ^3.3.0
- @headlessui/react: ^1.7.0
- lucide-react: ^0.263.0
- framer-motion: ^10.12.0

## State Management
- zustand: ^4.3.0 (or @reduxjs/toolkit if complex)
- react-query: ^3.39.0

## Forms & Validation
- react-hook-form: ^7.44.0
- zod: ^3.21.0
- @hookform/resolvers: ^3.1.0

## Routing & Navigation
- react-router-dom: ^6.11.0
- @reach/router: ^1.3.0

## HTTP & Real-time
- axios: ^1.4.0
- socket.io-client: ^4.6.0

# Backend Dependencies (${backend})
## Core Framework
- express: ^4.18.0
- typescript: ^5.0.0
- ts-node: ^10.9.0

## Database & ORM
- prisma: ^4.15.0 (or drizzle-orm)
- postgresql: ^14.0.0
- redis: ^4.6.0

## Authentication & Security
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.0
- helmet: ^7.0.0
- cors: ^2.8.0
- rate-limiter-flexible: ^2.4.0

## Real-time Communication
- socket.io: ^4.6.0

## File Handling
- multer: ^1.4.0
- sharp: ^0.32.0

## Email & Notifications
- nodemailer: ^6.9.0
- twilio: ^4.11.0

## Testing
- jest: ^29.5.0
- supertest: ^6.3.0
- @testing-library/react: ^13.4.0

## Development Tools
- eslint: ^8.42.0
- prettier: ^2.8.0
- husky: ^8.0.0
- lint-staged: ^13.2.0

## Deployment & Monitoring
- pm2: ^5.3.0
- winston: ^3.9.0
- sentry: ^7.54.0`;
  };

  const generateComprehensiveTimeline = (input: ProjectInput, recommendations: Recommendations) => {
    const complexity = recommendations.suggestedComplexity;
    const hasAuth = input.authenticationNeeds !== 'None';
    const hasRealtime = input.dataComplexity === 'Real-time data';
    const features = extractFeaturesFromDescription(input.description.toLowerCase());
    
    let timeline = `# Development Timeline - ${recommendations.estimatedTimeline}

## Phase 1: Foundation & Setup (Week 1)
**Duration**: 5-7 days
**Goals**: Project infrastructure and basic architecture

### Tasks:
- [ ] Initialize project repositories (frontend/backend)
- [ ] Set up development environment and tools
- [ ] Configure TypeScript, linting, and formatting
- [ ] Set up database and basic schema
- [ ] Implement CI/CD pipeline basics
- [ ] Create project documentation structure

**Deliverables**:
- Working development environment
- Basic project structure
- Database connection established
- Initial deployment pipeline`;

    if (hasAuth) {
      timeline += `

## Phase 2: Authentication System (Week 2)
**Duration**: 5-7 days
**Goals**: Complete user management system

### Tasks:
- [ ] Design user database schema
- [ ] Implement registration/login API endpoints
- [ ] Create password reset functionality
- [ ] Build authentication middleware
- [ ] Design login/register UI components
- [ ] Implement protected routes
- [ ] Add email verification system
- [ ] Create user profile management

**Deliverables**:
- Fully functional auth system
- User registration and login flows
- Password reset capability
- Protected routes implementation`;
    }

    timeline += `

## Phase 3: Core Features Development (Weeks ${hasAuth ? '3-5' : '2-4'})
**Duration**: ${complexity === 'simple' ? '2 weeks' : complexity === 'medium' ? '3 weeks' : '4 weeks'}
**Goals**: Main application functionality

### Tasks:
- [ ] Implement core data models
- [ ] Build CRUD API endpoints
- [ ] Create main dashboard interface
- [ ] Develop core feature components
- [ ] Implement search and filtering
- [ ] Add data validation and error handling
- [ ] Create responsive layouts
- [ ] Implement basic user permissions`;

    features.forEach(feature => {
      timeline += `
- [ ] ${feature.title} implementation
- [ ] ${feature.title} UI components
- [ ] ${feature.title} testing`;
    });

    timeline += `

**Deliverables**:
- Core application functionality
- Main user interfaces
- Data management system
- Search and filtering features`;

    if (hasRealtime || features.some(f => f.title.includes('Messaging'))) {
      timeline += `

## Phase 4: Real-time Features (Week ${hasAuth ? '6' : '5'})
**Duration**: 5-7 days
**Goals**: Real-time communication and updates

### Tasks:
- [ ] Set up WebSocket infrastructure
- [ ] Implement real-time data synchronization
- [ ] Build chat/messaging system
- [ ] Add live notifications
- [ ] Create presence indicators
- [ ] Implement typing indicators
- [ ] Add real-time collaboration features

**Deliverables**:
- Real-time messaging system
- Live data updates
- Notification system
- Collaborative features`;
    }

    timeline += `

## Phase 5: Advanced Features & Polish (Weeks ${hasAuth ? '6-7' : '5-6'})
**Duration**: 1-2 weeks
**Goals**: Enhanced functionality and user experience

### Tasks:
- [ ] Implement advanced filtering and search
- [ ] Add file upload and management
- [ ] Create analytics and reporting
- [ ] Build admin interface (if needed)
- [ ] Implement data export features
- [ ] Add advanced user preferences
- [ ] Create onboarding flow
- [ ] Optimize performance and loading`;

    if (input.integrations.length > 0) {
      timeline += `
- [ ] Third-party integrations setup
- [ ] API integration testing
- [ ] Integration error handling`;
    }

    timeline += `

**Deliverables**:
- Advanced feature set
- Analytics and reporting
- File management system
- Optimized performance`;

    timeline += `

## Phase 6: Testing & Quality Assurance (Week ${hasAuth ? '8' : '7'})
**Duration**: 5-7 days
**Goals**: Comprehensive testing and bug fixes

### Tasks:
- [ ] Write comprehensive unit tests
- [ ] Implement integration testing
- [ ] Perform end-to-end testing
- [ ] Conduct security audit
- [ ] Performance testing and optimization
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Accessibility compliance check

**Deliverables**:
- Complete test suite (80%+ coverage)
- Security audit report
- Performance optimization
- Cross-platform compatibility

## Phase 7: Deployment & Launch (Week ${hasAuth ? '9-10' : '8-9'})
**Duration**: 1-2 weeks
**Goals**: Production deployment and monitoring

### Tasks:
- [ ] Set up production environment
- [ ] Configure monitoring and logging
- [ ] Implement backup strategies
- [ ] Set up SSL certificates
- [ ] Configure CDN and caching
- [ ] Implement error tracking
- [ ] Create deployment documentation
- [ ] Conduct final security review
- [ ] Perform load testing
- [ ] Launch monitoring dashboard

**Deliverables**:
- Production-ready application
- Monitoring and alerting system
- Deployment documentation
- Launch readiness certification

## Post-Launch: Maintenance & Iteration
**Ongoing**: After initial launch
**Goals**: Continuous improvement and feature expansion

### Monthly Tasks:
- [ ] Monitor system performance
- [ ] Gather user feedback
- [ ] Plan feature iterations
- [ ] Security updates and patches
- [ ] Performance optimizations
- [ ] User experience improvements

## Success Metrics:
- Application uptime: 99.9%+
- Average response time: <200ms
- Test coverage: 80%+
- Security vulnerabilities: 0 critical
- User satisfaction: 4.5+ stars`;

    return timeline;
  };

  const downloadProjectRecipe = () => {
    if (!projectRecipe || !recommendations) return;
    
    const features = extractFeaturesFromDescription(projectInput.description.toLowerCase());
    const hasAuth = projectInput.authenticationNeeds !== 'None';
    const hasRealtime = projectInput.dataComplexity === 'Real-time data' || features.some(f => f.title.includes('Messaging'));
    
    const content = `# AI-Ready Project Plan: ${projectInput.name}

## 1. PROJECT OVERVIEW

### Project Name: ${projectInput.name}

### Vision Statement
${projectInput.description}

### Core Value Proposition
- ${projectInput.targetAudience} focused ${projectInput.platform.toLowerCase()} application
- ${projectInput.designComplexity.toLowerCase()} design with ${projectInput.responsiveness.toLowerCase()} support
- Built for ${projectInput.expectedUsers} with ${projectInput.performanceNeeds.toLowerCase()} performance requirements
- ${projectInput.experienceLevel.charAt(0).toUpperCase() + projectInput.experienceLevel.slice(1)}-level development complexity

### Success Metrics
- User acquisition target: ${projectInput.expectedUsers}
- Performance target: ${projectInput.performanceNeeds === 'Enterprise scale' ? 'Sub-100ms response times' : 'Sub-200ms response times'}
- Availability target: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'} uptime
- User engagement: ${projectInput.expectedUsers === '1-100' ? '70%+' : '80%+'} active user retention

## 2. TECHNICAL SPECIFICATION

### Tech Stack
${recommendations.recommendedTechStack.map(tech => `- **${tech}**: ${getTechDescription(tech)}`).join('\n')}

### Architecture Pattern
- **Frontend**: ${projectRecipe.architecture.frontend} with component-based architecture
- **Backend**: ${projectRecipe.architecture.backend} with ${projectInput.dataComplexity === 'Complex analytics' ? 'microservices' : 'monolithic'} pattern
- **Database**: ${projectRecipe.architecture.database} with ${projectInput.dataComplexity === 'Simple forms' ? 'basic' : 'optimized'} design
- **State Management**: ${recommendations.recommendedTechStack.includes('React') ? 'React Context + useReducer' : 'Vuex/Pinia'}

### Performance Requirements
- Page load time: ${projectInput.performanceNeeds === 'High performance' ? '< 1 second' : '< 2 seconds'}
- API response time: ${projectInput.performanceNeeds === 'Enterprise scale' ? '< 100ms' : '< 200ms'}
- Concurrent users: ${getPerformanceTarget(projectInput.expectedUsers)}
- Uptime target: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'}

## 3. FEATURE BREAKDOWN

### Phase 1: Core Features (MVP)
${recommendations.coreFeatures.map(feature => `- ${feature}`).join('\n')}

### Phase 2: Enhanced Features
${recommendations.optionalFeatures.map(feature => `- ${feature}`).join('\n')}

${features.length > 0 ? `### Phase 3: Advanced Features
${features.map(feature => `- ${feature.title}: ${feature.description}`).join('\n')}` : ''}

${projectInput.integrations.length > 0 ? `### Phase 4: Integrations
${projectInput.integrations.map(integration => `- ${integration} integration with full OAuth and API management`).join('\n')}` : ''}

## 4. DATABASE DESIGN

### Schema Overview
\`\`\`sql
${projectRecipe.databaseSchema}
\`\`\`

### Key Relationships
${generateDatabaseRelationships()}

### Performance Considerations
- Proper indexing on frequently queried columns
- Connection pooling for ${projectInput.expectedUsers} concurrent users
- ${projectInput.dataComplexity === 'Complex analytics' ? 'Read replicas for analytics queries' : 'Single database instance'}
- ${projectInput.performanceNeeds === 'High performance' ? 'Redis caching layer' : 'Application-level caching'}

## 5. API DESIGN

### Endpoint Specification
\`\`\`
${projectRecipe.apiEndpoints}
\`\`\`

### Authentication Strategy
${hasAuth ? `- ${projectInput.authenticationNeeds} implementation
- JWT tokens with refresh token rotation
- Role-based access control (RBAC)
- Session management with security best practices` : '- No authentication required (public application)'}

### Response Format
\`\`\`json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "pagination": { /* for list endpoints */ },
  "meta": { /* additional metadata */ }
}
\`\`\`

## 6. UI/UX WIREFRAMES

### Key Pages
${generateKeyPages()}

### Component Library
${projectRecipe.uiComponents}

### Design System
- Color palette: ${projectInput.designComplexity === 'Custom branded' ? 'Custom brand colors' : 'Standard UI colors'}
- Typography: ${projectInput.designComplexity === 'Minimal/functional' ? 'System fonts' : 'Custom typography'}
- Spacing: 8px grid system
- Animations: ${projectInput.designComplexity === 'Complex animations' ? 'Advanced micro-interactions' : 'Subtle transitions'}

## 7. DEVELOPMENT PHASES

${projectRecipe.detailedTimeline}

## 8. AI ASSISTANT PROMPTS STRATEGY

### Setup Prompts
- "Create a new ${recommendations.recommendedTechStack[0]} project with ${recommendations.recommendedTechStack[1]} setup"
- "Set up ${projectRecipe.architecture.backend} server with ${projectRecipe.architecture.database} database"
- "Generate complete project structure based on the specification above"

### Feature Development Prompts
${hasAuth ? `- "Create a complete ${projectInput.authenticationNeeds} authentication system with security best practices"` : ''}
${hasRealtime ? `- "Implement real-time functionality using WebSocket connections"` : ''}
${features.map(feature => `- "Build ${feature.title.toLowerCase()} with complete functionality and error handling"`).join('\n')}

### Code Quality Prompts
- "Add comprehensive error handling to all API endpoints"
- "Write unit tests with 80%+ coverage for all components"
- "Optimize performance for ${projectInput.expectedUsers} concurrent users"
- "Implement security best practices for ${projectInput.targetAudience} applications"

## 9. TESTING STRATEGY

### Unit Tests
- All utility functions and business logic
- React/Vue component functionality
- API endpoint logic with mocked dependencies
- Database query functions

### Integration Tests
- API endpoints with real database connections
- Authentication and authorization flows
- File upload and processing workflows
${hasRealtime ? '- Real-time messaging and WebSocket functionality' : ''}

### E2E Tests
${generateE2ETests()}

### Performance Tests
- Load testing for ${projectInput.expectedUsers}
- API response time benchmarks
- Frontend bundle size optimization
- Database query performance analysis

## 10. DEPLOYMENT & MONITORING

### Production Environment
${generateDeploymentStrategy()}

### Monitoring & Analytics
- Application performance monitoring (APM)
- Error tracking and logging
- User analytics and behavior tracking
- System resource monitoring
- ${projectInput.expectedUsers === 'Enterprise scale' ? 'Advanced alerting and incident response' : 'Basic monitoring dashboard'}

### Security Measures
${generateSecurityMeasures()}

## 11. FILE STRUCTURE

\`\`\`
${projectRecipe.fileStructure}
\`\`\`

## 12. DEPENDENCIES

${projectRecipe.dependencies}

## 13. LAUNCH CHECKLIST

### Pre-Launch
- [ ] All core features tested and functional
- [ ] Security audit completed with no critical vulnerabilities
- [ ] Performance optimization meeting targets
- [ ] ${projectInput.responsiveness !== 'Desktop only' ? 'Mobile responsiveness verified across devices' : 'Desktop compatibility verified'}
- [ ] Error handling comprehensive across all scenarios
- [ ] Documentation complete and accessible

### Launch Day
- [ ] Deploy to production environment
- [ ] Configure monitoring and alerting systems
- [ ] Set up analytics and tracking
- [ ] Prepare customer support channels
- [ ] Monitor system performance and user feedback

### Post-Launch
- [ ] Gather user feedback and usage analytics
- [ ] Monitor performance metrics and system health
- [ ] Plan feature iterations based on user needs
- [ ] Scale infrastructure based on actual usage patterns

## 14. RISK MANAGEMENT

### Technical Risks
${generateTechnicalRisks()}

### Business Risks
${generateBusinessRisks()}

## 15. SUCCESS METRICS & KPIs

### Technical Metrics
- API response times: ${projectInput.performanceNeeds === 'Enterprise scale' ? '< 100ms' : '< 200ms'}
- Frontend bundle size: < 500KB gzipped
- Test coverage: > 80%
- Security vulnerabilities: 0 critical, < 5 medium

### Business Metrics
- User acquisition: ${projectInput.expectedUsers}
- User retention: ${projectInput.expectedUsers === '1-100' ? '70%+' : '80%+'} after 30 days
- Performance satisfaction: 4.5+ star rating
- System availability: ${projectInput.expectedUsers === 'Enterprise scale' ? '99.99%' : '99.9%'}

---

## AI DEVELOPMENT COMPANION

This comprehensive project plan is optimized for AI-assisted development. Each section provides specific context and requirements that can be directly used with AI coding assistants like:

- **Replit AI**: Use complete specifications for full file generation
- **Cursor AI**: Reference architecture details for context-aware coding
- **Windsurf AI**: Leverage technical requirements for system design
- **Lovable AI**: Utilize UI/UX specifications for component development

### Quick Start Command
\`\`\`bash
# Copy this entire specification to your AI assistant for complete project setup
# Estimated development time: ${recommendations.estimatedTimeline}
# Complexity level: ${recommendations.suggestedComplexity}
\`\`\`

Generated by CodeBreaker - AI Project Planner
Project Configuration: ${projectInput.experienceLevel} | ${projectInput.targetAudience} | ${projectInput.platform}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectInput.name.replace(/\s+/g, '-').toLowerCase()}-complete-project-plan.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Complete Project Plan Downloaded",
      description: "Comprehensive AI-ready project specification generated successfully.",
    });
  };

  const getTechDescription = (tech: string) => {
    const descriptions: Record<string, string> = {
      'React': 'Modern UI library with hooks and components',
      'TypeScript': 'Type-safe JavaScript for better development',
      'Node.js': 'Server-side JavaScript runtime',
      'Express': 'Minimal web framework for Node.js',
      'PostgreSQL': 'Robust relational database system',
      'Tailwind CSS': 'Utility-first CSS framework',
      'Socket.io': 'Real-time bidirectional communication',
      'Redis': 'In-memory data structure store',
      'Next.js': 'Full-stack React framework',
      'Supabase': 'Open source Firebase alternative'
    };
    return descriptions[tech] || 'Modern development technology';
  };

  const getPerformanceTarget = (users: string) => {
    switch (users) {
      case '1-100': return '100+ concurrent users';
      case '100-1000': return '1,000+ concurrent users';
      case '1000+': return '5,000+ concurrent users';
      case 'Enterprise scale': return '10,000+ concurrent users';
      default: return '1,000+ concurrent users';
    }
  };

  const generateDatabaseRelationships = () => {
    if (projectInput.dataComplexity === 'Static content') return 'No database relationships required';
    
    return `- Users have many Projects (as owners and members)
- Projects have many Tasks/Items
- Tasks belong to Projects and can be assigned to Users
- Users can have many Sessions for authentication
- Projects can have many Members through join table`;
  };

  const generateKeyPages = () => {
    const pages = ['Landing/Home page with clear value proposition'];
    
    if (projectInput.authenticationNeeds !== 'None') {
      pages.push('Authentication pages (login, register, password reset)');
    }
    
    pages.push('Main dashboard with overview and navigation');
    
    if (projectInput.dataComplexity !== 'Static content') {
      pages.push('Data management interface with CRUD operations');
      pages.push('Detail views for individual items');
    }
    
    pages.push('User settings and preferences');
    pages.push('Help/support documentation');
    
    return pages.map((page, i) => `${i + 1}. **${page}**`).join('\n');
  };

  const generateE2ETests = () => {
    const tests = [];
    
    if (projectInput.authenticationNeeds !== 'None') {
      tests.push('- Complete user registration and login workflow');
      tests.push('- Password reset and email verification process');
    }
    
    if (projectInput.dataComplexity !== 'Static content') {
      tests.push('- End-to-end data creation and management workflow');
      tests.push('- Search, filtering, and pagination functionality');
    }
    
    tests.push('- Cross-browser compatibility testing');
    tests.push(`- ${projectInput.responsiveness} responsiveness validation`);
    
    return tests.join('\n');
  };

  const generateDeploymentStrategy = () => {
    return `- **Frontend**: ${projectRecipe.deploymentStrategy.hosting}
- **Backend**: ${projectInput.hostingType === 'Cloud platform' ? 'Railway/Render with automatic scaling' : projectInput.hostingType}
- **Database**: ${projectInput.hostingType === 'Cloud platform' ? 'Managed PostgreSQL with automated backups' : 'Self-hosted database'}
- **CI/CD**: ${projectRecipe.deploymentStrategy.cicd}
- **Domain**: Custom domain with SSL certificates
- **CDN**: CloudFlare for global content delivery`;
  };

  const generateSecurityMeasures = () => {
    const measures = [
      '- Input validation and sanitization on all endpoints',
      '- CORS configuration for secure cross-origin requests',
      '- Rate limiting to prevent abuse and DDoS attacks',
      '- Secure headers (HSTS, CSP, X-Frame-Options)',
      '- SQL injection prevention through parameterized queries'
    ];
    
    if (projectInput.authenticationNeeds !== 'None') {
      measures.push('- Secure password hashing with bcrypt');
      measures.push('- JWT token security with rotation');
      measures.push('- Session management with secure cookies');
    }
    
    if (projectInput.expectedUsers === 'Enterprise scale') {
      measures.push('- Advanced threat detection and monitoring');
      measures.push('- Regular security audits and penetration testing');
    }
    
    return measures.join('\n');
  };

  const generateTechnicalRisks = () => {
    const risks = [];
    
    if (projectInput.expectedUsers === 'Enterprise scale') {
      risks.push('- **Scaling challenges**: Implement load balancing and database optimization early');
    }
    
    if (projectInput.dataComplexity === 'Real-time data') {
      risks.push('- **Real-time performance**: Use Redis for WebSocket scaling and message queuing');
    }
    
    if (projectInput.integrations.length > 3) {
      risks.push('- **Integration complexity**: Implement circuit breakers and fallback mechanisms');
    }
    
    risks.push('- **Performance degradation**: Regular monitoring and optimization cycles');
    risks.push('- **Security vulnerabilities**: Automated security scanning and updates');
    
    return risks.join('\n');
  };

  const generateBusinessRisks = () => {
    return `- **User adoption**: Focus on intuitive UX and comprehensive onboarding
- **Market competition**: Differentiate with unique features and superior performance
- **Technical debt**: Maintain code quality through regular reviews and refactoring
- **Scalability costs**: Plan infrastructure scaling based on actual growth patterns`;
  };

  const markStepComplete = (stepNumber: number) => {
    setRoadmapSteps(prev => prev.map(step => 
      step.stepNumber === stepNumber ? { ...step, isCompleted: true } : step
    ));
    
    const allCompleted = roadmapSteps.every(step => step.stepNumber === stepNumber || step.isCompleted);
    if (allCompleted) {
      setShowCongratsPopup(true);
    }
  };

  const navigateToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber - 1);
  };

  const generateCustomRescue = async () => {
    setIsGeneratingCustom(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const activeStep = roadmapSteps.find(step => step.stepNumber === currentStep + 1);
      const contextualPrompt = `**AI CODING AGENT RESCUE - ${activeStep?.title?.toUpperCase()}**

I'm stuck on ${activeStep?.title} in my ${projectInput.name} project. 

**CURRENT CONTEXT:**
- Project: ${projectInput.name} (${projectInput.targetAudience} ${projectInput.platform})
- Current Phase: ${activeStep?.title}
- Issue: ${customProblem}
- Tech Stack: ${recommendations?.recommendedTechStack.join(', ')}
- Experience Level: ${projectInput.experienceLevel}

**SPECIFIC RESCUE REQUEST:**
${customProblem}

**AI AGENT REQUIREMENTS:**
✅ IMMEDIATE debugging steps with exact commands
✅ COMPLETE code fixes (not partial solutions)  
✅ WORKING examples I can copy-paste directly
✅ STEP-BY-STEP resolution with verification
✅ PREVENTION strategies to avoid this issue again

**CRITICAL CONSTRAINT:** Provide complete, executable solutions optimized for ${projectInput.experienceLevel} developers using modern ${recommendations?.recommendedTechStack[0]} best practices.

**OUTPUT FORMAT:** 
1. **IMMEDIATE FIXES** (copy-paste commands)
2. **CODE SOLUTIONS** (complete file contents)
3. **VERIFICATION** (test commands)
4. **PREVENTION** (best practices)`;

      setCustomSolution(contextualPrompt);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate custom rescue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  if (phase === 'projects') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">Continue working on existing projects or start a new one</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Project Card */}
          <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => setPhase('input')}>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create New Project</h3>
              <p className="text-muted-foreground text-sm">Start a new AI-powered roadmap with comprehensive project planning</p>
            </CardContent>
          </Card>

          {/* Existing Projects */}
          {projectsLoading ? (
            <div className="lg:col-span-2 flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : userProjects.length === 0 ? (
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Start your first project to see it here</p>
            </div>
          ) : (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.map((project: any) => {
                const progress = project.projectProgress || { currentStep: 0, totalSteps: 0, completedSteps: [] };
                const progressPercentage = progress.totalSteps > 0 
                  ? Math.round((progress.completedSteps.length / progress.totalSteps) * 100) 
                  : 0;
                
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.projectName}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {project.projectDetails?.description?.substring(0, 80)}...
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {progress.completedSteps.length} of {progress.totalSteps} steps completed
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Experience</div>
                          <div className="font-medium capitalize">
                            {project.projectDetails?.experienceLevel || 'Not set'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Platform</div>
                          <div className="font-medium">
                            {project.projectDetails?.platform || 'Not set'}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {progressPercentage === 100 ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : progressPercentage > 0 ? (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Target className="h-3 w-3 mr-1" />
                            Planning
                          </Badge>
                        )}
                        
                        <div className="text-xs text-muted-foreground ml-auto">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => loadProject(project)}
                        className="w-full"
                        variant={progressPercentage > 0 ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {progressPercentage > 0 ? 'Continue Project' : 'Start Project'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {userProjects.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {userProjects.length} project{userProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Project Roadmap Creator</h1>
            <p className="text-muted-foreground">Generate detailed development roadmaps with AI-optimized prompts</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Configuration</CardTitle>
            <CardDescription>
              Provide detailed project information to generate a comprehensive development roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectInput.name}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome App"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={projectInput.description}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project features, goals, and functionality in detail..."
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[100px]"
                />
              </div>

              <div>
                <Label>Experience Level</Label>
                <Select value={projectInput.experienceLevel} onValueChange={(value) => setProjectInput(prev => ({ ...prev, experienceLevel: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Audience</Label>
                <Select value={projectInput.targetAudience} onValueChange={(value) => setProjectInput(prev => ({ ...prev, targetAudience: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="Internal tool">Internal tool</SelectItem>
                    <SelectItem value="Personal project">Personal project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Platform</Label>
                <Select value={projectInput.platform} onValueChange={(value) => setProjectInput(prev => ({ ...prev, platform: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web app">Web app</SelectItem>
                    <SelectItem value="Mobile responsive">Mobile responsive</SelectItem>
                    <SelectItem value="Native mobile">Native mobile</SelectItem>
                    <SelectItem value="Desktop app">Desktop app</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expected Users</Label>
                <Select value={projectInput.expectedUsers} onValueChange={(value) => setProjectInput(prev => ({ ...prev, expectedUsers: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-100">1-100 users</SelectItem>
                    <SelectItem value="100-1000">100-1000 users</SelectItem>
                    <SelectItem value="1000+">1000+ users</SelectItem>
                    <SelectItem value="Enterprise scale">Enterprise scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Timeline</Label>
                <Select value={projectInput.projectTimeline} onValueChange={(value) => setProjectInput(prev => ({ ...prev, projectTimeline: value as any }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekend project">Weekend project</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="Long-term">Long-term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="font-medium">Advanced Configuration Options</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {showAdvancedOptions && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Technical Requirements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Authentication</Label>
                      <Select value={projectInput.authenticationNeeds} onValueChange={(value) => setProjectInput(prev => ({ ...prev, authenticationNeeds: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">No authentication</SelectItem>
                          <SelectItem value="Simple login">Simple login</SelectItem>
                          <SelectItem value="OAuth">OAuth (Google, GitHub)</SelectItem>
                          <SelectItem value="Enterprise SSO">Enterprise SSO</SelectItem>
                          <SelectItem value="Custom auth">Custom authentication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data Complexity</Label>
                      <Select value={projectInput.dataComplexity} onValueChange={(value) => setProjectInput(prev => ({ ...prev, dataComplexity: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Static content">Static content</SelectItem>
                          <SelectItem value="Simple forms">Simple forms</SelectItem>
                          <SelectItem value="Database driven">Database driven</SelectItem>
                          <SelectItem value="Real-time data">Real-time data</SelectItem>
                          <SelectItem value="Complex analytics">Complex analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Performance Needs</Label>
                      <Select value={projectInput.performanceNeeds} onValueChange={(value) => setProjectInput(prev => ({ ...prev, performanceNeeds: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic performance</SelectItem>
                          <SelectItem value="Medium traffic">Medium traffic</SelectItem>
                          <SelectItem value="High performance">High performance</SelectItem>
                          <SelectItem value="Enterprise scale">Enterprise scale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Design & UX Requirements
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Design Complexity</Label>
                      <Select value={projectInput.designComplexity} onValueChange={(value) => setProjectInput(prev => ({ ...prev, designComplexity: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Minimal/functional">Minimal/functional</SelectItem>
                          <SelectItem value="Standard UI">Standard UI</SelectItem>
                          <SelectItem value="Custom branded">Custom branded</SelectItem>
                          <SelectItem value="Complex animations">Complex animations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Responsiveness</Label>
                      <Select value={projectInput.responsiveness} onValueChange={(value) => setProjectInput(prev => ({ ...prev, responsiveness: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Desktop only">Desktop only</SelectItem>
                          <SelectItem value="Mobile friendly">Mobile friendly</SelectItem>
                          <SelectItem value="Mobile first">Mobile first</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Accessibility</Label>
                      <Select value={projectInput.accessibility} onValueChange={(value) => setProjectInput(prev => ({ ...prev, accessibility: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="WCAG compliant">WCAG compliant</SelectItem>
                          <SelectItem value="Enterprise accessibility">Enterprise accessibility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Deployment & Maintenance
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Hosting Type</Label>
                      <Select value={projectInput.hostingType} onValueChange={(value) => setProjectInput(prev => ({ ...prev, hostingType: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shared hosting">Shared hosting</SelectItem>
                          <SelectItem value="Cloud platform">Cloud platform</SelectItem>
                          <SelectItem value="Self-hosted">Self-hosted</SelectItem>
                          <SelectItem value="Don't know">Don't know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Budget</Label>
                      <Select value={projectInput.budget} onValueChange={(value) => setProjectInput(prev => ({ ...prev, budget: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free/minimal">Free/minimal</SelectItem>
                          <SelectItem value="Low budget">Low budget</SelectItem>
                          <SelectItem value="Medium budget">Medium budget</SelectItem>
                          <SelectItem value="Enterprise budget">Enterprise budget</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Maintenance</Label>
                      <Select value={projectInput.maintenance} onValueChange={(value) => setProjectInput(prev => ({ ...prev, maintenance: value as any }))}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Set and forget">Set and forget</SelectItem>
                          <SelectItem value="Occasional updates">Occasional updates</SelectItem>
                          <SelectItem value="Active maintenance">Active maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={generateRecommendations} className="flex-1" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing Project...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Project Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'recommendations') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('input')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{projectInput.name}</h1>
            <p className="text-muted-foreground">AI-Generated Project Analysis & Recommendations</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Code2 className="h-5 w-5" />
                Recommended Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendations?.recommendedTechStack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Why this stack:</strong> {recommendations?.reasoning.techStackReason}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="h-5 w-5" />
                  Project Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`text-lg py-2 px-4 ${
                      recommendations?.suggestedComplexity === 'simple' ? 'bg-green-100 text-green-700' :
                      recommendations?.suggestedComplexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {recommendations?.suggestedComplexity?.charAt(0).toUpperCase() + (recommendations?.suggestedComplexity?.slice(1) || '')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations?.reasoning.complexityReason}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Clock className="h-5 w-5" />
                  Estimated Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-600">
                    {recommendations?.estimatedTimeline}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendations?.reasoning.timelineReason}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Core Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations?.coreFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Optional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations?.optionalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {recommendations?.potentialChallenges && recommendations.potentialChallenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Potential Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.potentialChallenges.map((challenge, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {projectRecipe && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Target className="h-5 w-5" />
                    Complete Project Recipe
                  </CardTitle>
                  <Button
                    onClick={downloadProjectRecipe}
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Recipe
                  </Button>
                </div>
                <CardDescription>
                  Comprehensive project specification with architecture, database schema, API endpoints, and implementation guide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Architecture</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Frontend:</strong> {projectRecipe.architecture.frontend}</p>
                      <p><strong>Backend:</strong> {projectRecipe.architecture.backend}</p>
                      <p><strong>Database:</strong> {projectRecipe.architecture.database}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Timeline</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Setup:</strong> {projectRecipe.timeline.setup}</p>
                      <p><strong>Auth:</strong> {projectRecipe.timeline.authentication}</p>
                      <p><strong>Core:</strong> {projectRecipe.timeline.coreFeatures}</p>
                      <p><strong>Total:</strong> {projectRecipe.timeline.total}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300">Deployment</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Hosting:</strong> {projectRecipe.deploymentStrategy.hosting}</p>
                      <p><strong>CI/CD:</strong> {projectRecipe.deploymentStrategy.cicd}</p>
                      <p><strong>Scaling:</strong> {projectRecipe.deploymentStrategy.scaling}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">What's included in the complete recipe:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Complete file structure with exact paths
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Database schema with relationships
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      API endpoints with specifications
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      UI component breakdown
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Complete dependency lists
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Deployment strategy and timeline
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={generateRoadmap} className="flex-1" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Generate Development Roadmap
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'roadmap') {
    const completedSteps = roadmapSteps.filter(step => step.isCompleted).length;
    const progressPercentage = (completedSteps / roadmapSteps.length) * 100;
    const activeStep = roadmapSteps.find(step => step.stepNumber === currentStep + 1) || roadmapSteps[0];

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('recommendations')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{projectInput.name}</h1>
            <p className="text-muted-foreground">Development Roadmap with AI Prompts</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-lg font-semibold">{completedSteps}/{roadmapSteps.length} steps</p>
          </div>
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <div className="grid lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Development Phases</CardTitle>
                  <CardDescription>
                    Total: {recommendations?.estimatedTimeline}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {roadmapSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            step.stepNumber === activeStep.stepNumber
                              ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400'
                              : step.isCompleted
                              ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-400'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => navigateToStep(step.stepNumber)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${
                              step.isCompleted
                                ? 'text-green-500'
                                : step.stepNumber === activeStep.stepNumber
                                ? 'text-blue-500'
                                : 'text-gray-400 dark:text-gray-600'
                            }`}>
                              {step.isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-current" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                Phase {step.stepNumber}: {step.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {step.estimatedTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {projectRecipe && (
                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-purple-700 dark:text-purple-300">Complete Recipe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={downloadProjectRecipe}
                      variant="outline"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Spec
                    </Button>
                    <div className="text-xs space-y-1 text-purple-700 dark:text-purple-300">
                      <p>• Complete file structure</p>
                      <p>• Database schemas</p>
                      <p>• API specifications</p>
                      <p>• Deployment guide</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Phase {activeStep.stepNumber}: {activeStep.title}</CardTitle>
                    <CardDescription>{activeStep.estimatedTime}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!activeStep.isCompleted && (
                      <Button
                        size="sm"
                        onClick={() => markStepComplete(activeStep.stepNumber)}
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{activeStep.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">AI-Optimized Development Prompt</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Copy this prompt to your AI coding assistant:
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(activeStep.startPrompt);
                          toast({ title: "Copied!", description: "Prompt copied to clipboard" });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <pre className="text-sm whitespace-pre-wrap break-words">
                        {activeStep.startPrompt}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Validation Checklist</h4>
                  <div className="space-y-2">
                    {activeStep.validationChecklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border border-gray-300" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Need Help? Generate Custom Rescue Prompt</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Describe what you're stuck on or what error you're encountering..."
                      value={customProblem}
                      onChange={(e) => setCustomProblem(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={generateCustomRescue}
                      disabled={!customProblem || isGeneratingCustom}
                      className="w-full"
                    >
                      {isGeneratingCustom ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Generating Rescue...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Custom Rescue Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  {customSolution && (
                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Custom Rescue Prompt:
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(customSolution);
                            toast({ title: "Copied!", description: "Rescue prompt copied to clipboard" });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <ScrollArea className="h-[200px]">
                        <pre className="text-sm whitespace-pre-wrap break-words text-yellow-800 dark:text-yellow-200">
                          {customSolution}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Quick Rescue Prompts</h4>
                  <div className="space-y-2">
                    {activeStep.rescuePrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          toast({ title: "Copied!", description: "Rescue prompt copied to clipboard" });
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Copy className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{prompt.split(':')[1]?.trim() || prompt}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};