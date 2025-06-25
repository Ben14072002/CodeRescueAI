import { users, sessions, promptRatings, projects, wizardConversations, type User, type InsertUser, type Session, type InsertSession, type PromptRating, type InsertPromptRating, type Project, type InsertProject, type WizardConversation, type InsertWizardConversation } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<User>;
  checkTrialStatus(userId: number): Promise<{ isTrialActive: boolean; daysRemaining: number; }>;
  isTrialEligible(userId: number): Promise<{ eligible: boolean; reason?: string; }>;
  startTrial(userId: number): Promise<User>;
  expireTrial(userId: number): Promise<User>;
  getUserSessionsThisMonth(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  ratePrompt(rating: InsertPromptRating): Promise<PromptRating>;
  getPromptSuccessRate(problemType: string): Promise<{ positiveCount: number; totalCount: number; }>;
  getUserRecentSessions(userId: number, limit?: number): Promise<Session[]>;
  
  // Project persistence methods
  createProject(project: InsertProject): Promise<Project>;
  updateProject(projectId: number, updates: Partial<InsertProject>): Promise<Project>;
  getProject(projectId: number): Promise<Project | undefined>;
  getUserProjects(userId: number): Promise<Project[]>;
  deleteProject(projectId: number): Promise<void>;
  updateProjectProgress(projectId: number, progress: any): Promise<Project>;
  markProjectCompleted(projectId: number): Promise<Project>;
  
  // Wizard Conversation methods
  createWizardConversation(conversation: InsertWizardConversation): Promise<WizardConversation>;
  updateWizardConversation(sessionId: string, updates: Partial<InsertWizardConversation>): Promise<WizardConversation>;
  getWizardConversation(sessionId: string): Promise<WizardConversation | undefined>;
  getUserWizardConversations(userId: number): Promise<WizardConversation[]>;
  deleteWizardConversation(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  private promptRatings: Map<number, PromptRating>;
  private projects: Map<number, Project>;
  private wizardConversations: Map<string, WizardConversation>;
  currentId: number;
  currentSessionId: number;
  currentRatingId: number;
  currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.promptRatings = new Map();
    this.projects = new Map();
    this.wizardConversations = new Map();
    this.currentId = 1;
    this.currentSessionId = 1;
    this.currentRatingId = 1;
    this.currentProjectId = 1;
    
    // Optional demo user creation for development/testing
    // Set CREATE_DEMO_USER=true and DEMO_USER_EMAIL in environment to enable
    if (process.env.CREATE_DEMO_USER === 'true' && process.env.DEMO_USER_EMAIL) {
      this.createUser({
        username: process.env.DEMO_USER_NAME || 'demo_user',
        email: process.env.DEMO_USER_EMAIL,
        role: 'user'
      }).then(user => {
        if (process.env.DEMO_USER_SUBSCRIPTION === 'pro') {
          this.updateUserSubscription(user.id, {
            stripeCustomerId: 'demo_customer',
            stripeSubscriptionId: 'demo_subscription',
            subscriptionStatus: 'active',
            subscriptionTier: 'pro_monthly',
            subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
        }
      }).catch(error => {
        console.log('Demo user creation skipped or failed:', error.message);
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    for (const [_, user] of this.users) {
      if (user.firebaseUid === firebaseUid) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "free",
      subscriptionTier: "free",
      subscriptionCurrentPeriodEnd: null,
      trialStartDate: null,
      trialEndDate: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = {
      ...user,
      ...subscriptionData
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async checkTrialStatus(userId: number): Promise<{ isTrialActive: boolean; daysRemaining: number; }> {
    const user = this.users.get(userId);
    if (!user || !user.trialEndDate) {
      return { isTrialActive: false, daysRemaining: 0 };
    }

    const now = new Date();
    const trialEnd = new Date(user.trialEndDate);
    const isTrialActive = now < trialEnd && user.subscriptionTier === 'trial';
    const timeRemaining = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

    return { isTrialActive, daysRemaining };
  }

  async isTrialEligible(userId: number): Promise<{ eligible: boolean; reason?: string; }> {
    const user = this.users.get(userId);
    if (!user) {
      return { eligible: false, reason: "User not found" };
    }

    // SECURITY CHECK: Has user already used their trial?
    if (user.hasUsedTrial) {
      return { 
        eligible: false, 
        reason: `User has already used their trial period. Trial count: ${user.trialCount || 1}` 
      };
    }

    // SECURITY CHECK: Does user already have active Pro subscription?
    if (user.subscriptionTier === 'pro' && user.subscriptionStatus === 'active') {
      return { 
        eligible: false, 
        reason: "User already has active Pro subscription" 
      };
    }

    // SECURITY CHECK: Is user currently in trial period?
    const trialStatus = await this.checkTrialStatus(userId);
    if (trialStatus.isTrialActive) {
      return { 
        eligible: false, 
        reason: "User is already in active trial period" 
      };
    }

    return { eligible: true };
  }

  async startTrial(userId: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // SECURITY CHECK: Prevent multiple trials per user
    if (user.hasUsedTrial) {
      throw new Error("User has already used their trial period. Only one trial allowed per account.");
    }

    // SECURITY CHECK: Prevent trial if user already has active subscription
    if (user.subscriptionTier === 'pro' && user.subscriptionStatus === 'active') {
      throw new Error("User already has active Pro subscription");
    }

    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    const updatedUser: User = {
      ...user,
      subscriptionStatus: "trial",
      subscriptionTier: "trial",
      trialStartDate: now,
      trialEndDate: trialEndDate,
      hasUsedTrial: true, // SECURITY: Mark trial as used permanently
      trialCount: (user.trialCount || 0) + 1 // SECURITY: Increment trial count
    };
    
    this.users.set(userId, updatedUser);
    console.log(`🔒 Trial activated for user ${userId}. hasUsedTrial: true, trialCount: ${updatedUser.trialCount}`);
    return updatedUser;
  }

  async expireTrial(userId: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // SECURITY: Preserve trial history when expiring trial
    const updatedUser: User = {
      ...user,
      subscriptionStatus: "free",
      subscriptionTier: "free",
      // KEEP trial dates for audit trail - do NOT reset to null
      // KEEP hasUsedTrial: true - prevents getting another trial
      // KEEP trialCount - for analytics and fraud detection
    };

    this.users.set(userId, updatedUser);
    console.log(`🔒 Trial expired for user ${userId}. hasUsedTrial remains: ${user.hasUsedTrial}, trialCount: ${user.trialCount}`);
    return updatedUser;
  }

  async getUserSessionsThisMonth(userId: number): Promise<Session[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return Array.from(this.sessions.values()).filter(session => 
      session.userId === userId && 
      session.startTime >= startOfMonth
    );
  }

  async createSession(session: InsertSession): Promise<Session> {
    const newSession: Session = {
      id: this.currentSessionId++,
      userId: session.userId,
      problemType: session.problemType,
      projectDescription: session.projectDescription,
      customProblem: session.customProblem,
      selectedStrategy: session.selectedStrategy,
      startTime: session.startTime,
      actionSteps: session.actionSteps || [],
      prompts: session.prompts || [],
      aiResponse: session.aiResponse,
      isCompleted: session.isCompleted || false,
      totalTimeSpent: session.totalTimeSpent || 0,
      completedAt: session.completedAt,
    };
    
    this.sessions.set(newSession.id, newSession);
    return newSession;
  }

  async ratePrompt(rating: InsertPromptRating): Promise<PromptRating> {
    const newRating: PromptRating = {
      id: this.currentRatingId++,
      userId: rating.userId,
      sessionId: rating.sessionId,
      promptIndex: rating.promptIndex,
      rating: rating.rating,
      promptText: rating.promptText,
      problemType: rating.problemType,
      createdAt: new Date(),
    };
    
    this.promptRatings.set(newRating.id, newRating);
    return newRating;
  }

  async getPromptSuccessRate(problemType: string): Promise<{ positiveCount: number; totalCount: number; }> {
    const ratings = Array.from(this.promptRatings.values()).filter(
      rating => rating.problemType === problemType
    );
    
    const positiveCount = ratings.filter(rating => rating.rating === 'positive').length;
    const totalCount = ratings.length;
    
    return { positiveCount, totalCount };
  }

  async getUserRecentSessions(userId: number, limit: number = 5): Promise<Session[]> {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
    
    return userSessions;
  }

  // Project persistence methods
  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: this.currentProjectId++,
      ...project,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(projectId: number, updates: Partial<InsertProject>): Promise<Project> {
    const existingProject = this.projects.get(projectId);
    if (!existingProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const updatedProject: Project = {
      ...existingProject,
      ...updates,
      lastModified: new Date(),
    };

    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }

  async getProject(projectId: number): Promise<Project | undefined> {
    return this.projects.get(projectId);
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  async deleteProject(projectId: number): Promise<void> {
    this.projects.delete(projectId);
  }

  async updateProjectProgress(projectId: number, progress: any): Promise<Project> {
    const existingProject = this.projects.get(projectId);
    if (!existingProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const updatedProject: Project = {
      ...existingProject,
      projectProgress: progress,
      lastModified: new Date(),
    };

    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }

  async markProjectCompleted(projectId: number): Promise<Project> {
    const existingProject = this.projects.get(projectId);
    if (!existingProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const updatedProject: Project = {
      ...existingProject,
      isCompleted: true,
      lastModified: new Date(),
    };

    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }
}

export class DatabaseStorage implements IStorage {
  async isTrialEligible(userId: number): Promise<{ eligible: boolean; reason?: string; }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return { eligible: false, reason: "User not found" };
    }

    // SECURITY CHECK: Has user already used their trial?
    if (user.hasUsedTrial) {
      return { 
        eligible: false, 
        reason: `User has already used their trial period. Trial count: ${user.trialCount || 1}` 
      };
    }

    // SECURITY CHECK: Does user already have active Pro subscription?
    if (user.subscriptionTier === 'pro' && user.subscriptionStatus === 'active') {
      return { 
        eligible: false, 
        reason: "User already has active Pro subscription" 
      };
    }

    // SECURITY CHECK: Is user currently in trial period?
    const trialStatus = await this.checkTrialStatus(userId);
    if (trialStatus.isTrialActive) {
      return { 
        eligible: false, 
        reason: "User is already in active trial period" 
      };
    }

    return { eligible: true };
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(subscriptionData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async checkTrialStatus(userId: number): Promise<{ isTrialActive: boolean; daysRemaining: number; }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || !user.trialEndDate) {
      return { isTrialActive: false, daysRemaining: 0 };
    }

    const now = new Date();
    const trialEnd = new Date(user.trialEndDate);
    const isTrialActive = now < trialEnd && user.subscriptionTier === 'trial';
    const timeRemaining = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

    return { isTrialActive, daysRemaining };
  }

  async startTrial(userId: number): Promise<User> {
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: "trial",
        subscriptionTier: "trial", 
        trialStartDate: now,
        trialEndDate: trialEndDate
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async expireTrial(userId: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionStatus: "free",
        subscriptionTier: "free",
        trialStartDate: null,
        trialEndDate: null
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserSessionsThisMonth(userId: number): Promise<Session[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const userSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.startTime, startOfMonth)
        )
      );
    
    return userSessions;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async ratePrompt(rating: InsertPromptRating): Promise<PromptRating> {
    const [newRating] = await db
      .insert(promptRatings)
      .values(rating)
      .returning();
    return newRating;
  }

  async getPromptSuccessRate(problemType: string): Promise<{ positiveCount: number; totalCount: number; }> {
    const ratings = await db
      .select()
      .from(promptRatings)
      .where(eq(promptRatings.problemType, problemType));
    
    const positiveCount = ratings.filter(rating => rating.rating === 'positive').length;
    const totalCount = ratings.length;
    
    return { positiveCount, totalCount };
  }

  async getUserRecentSessions(userId: number, limit: number = 5): Promise<Session[]> {
    const userSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(sessions.startTime)
      .limit(limit);
    
    return userSessions;
  }

  // Project persistence methods
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(projectId: number, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, lastModified: new Date() })
      .where(eq(projects.id, projectId))
      .returning();
    
    if (!updatedProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    return updatedProject;
  }

  async getProject(projectId: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    return project || undefined;
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.lastModified);
  }

  async deleteProject(projectId: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, projectId));
  }

  async updateProjectProgress(projectId: number, progress: any): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ projectProgress: progress, lastModified: new Date() })
      .where(eq(projects.id, projectId))
      .returning();
    
    if (!updatedProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    return updatedProject;
  }

  async markProjectCompleted(projectId: number): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ isCompleted: true, lastModified: new Date() })
      .where(eq(projects.id, projectId))
      .returning();
    
    if (!updatedProject) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    return updatedProject;
  }

  async createWizardConversation(conversation: InsertWizardConversation): Promise<WizardConversation> {
    const [newConversation] = await db
      .insert(wizardConversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async updateWizardConversation(sessionId: string, updates: Partial<InsertWizardConversation>): Promise<WizardConversation> {
    const [updatedConversation] = await db
      .update(wizardConversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(wizardConversations.sessionId, sessionId))
      .returning();
    
    if (!updatedConversation) {
      throw new Error('Wizard conversation not found');
    }
    
    return updatedConversation;
  }

  async getWizardConversation(sessionId: string): Promise<WizardConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(wizardConversations)
      .where(eq(wizardConversations.sessionId, sessionId));
    return conversation || undefined;
  }

  async getUserWizardConversations(userId: number): Promise<WizardConversation[]> {
    return await db
      .select()
      .from(wizardConversations)
      .where(eq(wizardConversations.userId, userId))
      .orderBy(desc(wizardConversations.updatedAt));
  }

  async deleteWizardConversation(sessionId: string): Promise<void> {
    await db
      .delete(wizardConversations)
      .where(eq(wizardConversations.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
