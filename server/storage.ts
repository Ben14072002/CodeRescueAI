import { users, sessions, type User, type InsertUser, type Session, type InsertSession } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<User>;
  getUserSessionsThisMonth(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  currentId: number;
  currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.currentId = 1;
    this.currentSessionId = 1;
    
    // Initialize with your Pro subscription
    this.createUser({
      username: 'benpaltinat',
      email: 'PYVvgDLO2RQYuFx4OVK1UMz7qVG3@firebase.temp',
      role: 'user'
    }).then(user => {
      this.updateUserSubscription(user.id, {
        stripeCustomerId: 'cus_pro_user',
        stripeSubscriptionId: 'sub_pro_monthly', 
        subscriptionStatus: 'active',
        subscriptionTier: 'pro_monthly',
        subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
    });
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "free",
      subscriptionTier: "free",
      subscriptionCurrentPeriodEnd: null
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
}

export class DatabaseStorage implements IStorage {
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
}

export const storage = new MemStorage();
