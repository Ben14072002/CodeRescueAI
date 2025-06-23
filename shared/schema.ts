import { z } from "zod";
import { pgTable, serial, varchar, text, boolean, timestamp, integer, jsonb, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Database Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("free"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default("free"),
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  hasUsedTrial: boolean("has_used_trial").default(false),
  trialCount: integer("trial_count").default(0),
  firebaseUid: varchar("firebase_uid", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  problemType: varchar("problem_type", { length: 100 }).notNull(),
  projectDescription: text("project_description"),
  customProblem: text("custom_problem"),
  selectedStrategy: varchar("selected_strategy", { length: 100 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  completedAt: timestamp("completed_at"),
  actionSteps: jsonb("action_steps").notNull(),
  prompts: jsonb("prompts").notNull(),
  notes: text("notes").notNull().default(""),
  success: boolean("success").notNull().default(false),
  progress: integer("progress").notNull().default(0),
  stepsCompleted: integer("steps_completed").notNull().default(0),
  totalTimeSpent: integer("total_time_spent").notNull().default(0),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  theme: varchar("theme", { length: 20 }).notNull().default("dark"),
  defaultPromptStyle: varchar("default_prompt_style", { length: 20 }).notNull().default("direct"),
  lastProblemType: varchar("last_problem_type", { length: 100 }),
});

export const wizardConversations = pgTable("wizard_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull().unique(),
  title: text("title").notNull(),
  problemCategory: text("problem_category").notNull(),
  classification: json("classification").$type<{
    category: string;
    severity: number;
    complexity: string;
    urgency: string;
    aiTool?: string;
    experience: string;
    emotionalState: string;
    technicalIndicators?: string[];
    rootCauseLikely?: string;
  }>(),
  messages: json("messages").$type<Array<{
    id: string;
    type: 'user' | 'wizard';
    content: string;
    timestamp: Date;
  }>>(),
  solution: json("solution").$type<{
    diagnosis: string;
    solutionSteps: Array<{
      step: number;
      title: string;
      description: string;
      code?: string;
      expectedTime: string;
      aiPrompt?: string;
      successCriteria?: string;
    }>;
    expectedTime: string;
    alternativeApproaches: string[];
    preventionTips: string[];
    learningResources: string[];
    troubleshootingTips?: string[];
  }>(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promptRatings = pgTable("prompt_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  promptIndex: integer("prompt_index").notNull(),
  rating: varchar("rating", { length: 10 }).notNull(), // 'positive', 'negative'
  promptText: text("prompt_text").notNull(),
  problemType: varchar("problem_type", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectName: text("project_name").notNull(),
  projectDescription: text("project_description").notNull(),
  techStack: text("tech_stack").array().notNull(),
  experienceLevel: varchar("experience_level", { length: 20 }).notNull(),
  complexity: varchar("complexity", { length: 20 }).notNull(),
  timeline: varchar("timeline", { length: 20 }).notNull(),
  steps: jsonb("steps").notNull(),
  recommendations: jsonb("recommendations"),
  currentStep: integer("current_step").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  projectDetails: jsonb("project_details").notNull(), // All form inputs
  generatedRecipe: jsonb("generated_recipe"), // Complete project recipe
  roadmapSteps: jsonb("roadmap_steps").notNull().default('[]'), // Step progress
  projectProgress: jsonb("project_progress").notNull().default('{"currentStep":0,"totalSteps":0,"completedSteps":[],"timeSpent":0}'),
  isActive: boolean("is_active").notNull().default(true),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastModified: timestamp("last_modified").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  preferences: one(userPreferences),
  promptRatings: many(promptRatings),
  roadmaps: many(roadmaps),
  projects: many(projects),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  promptRatings: many(promptRatings),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const promptRatingsRelations = relations(promptRatings, ({ one }) => ({
  user: one(users, {
    fields: [promptRatings.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [promptRatings.sessionId],
    references: [sessions.id],
  }),
}));

export const roadmapsRelations = relations(roadmaps, ({ one }) => ({
  user: one(users, {
    fields: [roadmaps.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const wizardConversationsRelations = relations(wizardConversations, ({ one }) => ({
  user: one(users, {
    fields: [wizardConversations.userId],
    references: [users.id],
  }),
}));

// Zod Schemas
export const sessionSchema = z.object({
  id: z.number(),
  problemType: z.string(),
  projectDescription: z.string().optional(),
  customProblem: z.string().optional(),
  selectedStrategy: z.string(),
  startTime: z.date(),
  completedAt: z.date().optional(),
  actionSteps: z.array(z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
    timeSpent: z.number(), // in seconds
    startTime: z.date().optional(),
  })),
  prompts: z.array(z.object({
    id: z.number(),
    text: z.string(),
    used: z.boolean(),
    rating: z.number().min(1).max(5).optional(),
  })),
  notes: z.string(),
  success: z.boolean(),
  progress: z.number().min(0).max(100),
  stepsCompleted: z.number(),
  totalTimeSpent: z.number(), // in seconds
});

export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).default("dark"),
  defaultPromptStyle: z.enum(["direct", "collaborative", "questioning"]).default("direct"),
  lastProblemType: z.string().optional(),
});

export const promptRatingSchema = z.object({
  id: z.number(),
  userId: z.number(),
  sessionId: z.number(),
  promptIndex: z.number(),
  rating: z.enum(["positive", "negative"]),
  promptText: z.string(),
  problemType: z.string(),
  createdAt: z.date(),
});

export const roadmapStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  estimatedTime: z.string(),
  startPrompt: z.string(),
  rescuePrompts: z.array(z.string()),
  validationChecklist: z.array(z.string()),
  isCompleted: z.boolean().default(false),
  dependencies: z.array(z.number()).default([]),
});

export const roadmapRecommendationsSchema = z.object({
  recommendedTechStack: z.array(z.string()),
  suggestedComplexity: z.string(),
  estimatedTimeline: z.string(),
  coreFeatures: z.array(z.string()),
  optionalFeatures: z.array(z.string()),
  potentialChallenges: z.array(z.string()),
  reasoning: z.object({
    techStackReason: z.string(),
    complexityReason: z.string(),
    timelineReason: z.string(),
  }),
});

export const roadmapSchema = z.object({
  id: z.number(),
  userId: z.number(),
  projectName: z.string(),
  projectDescription: z.string(),
  techStack: z.array(z.string()),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  complexity: z.enum(["simple", "medium", "complex"]),
  timeline: z.enum(["fast", "production"]),
  steps: z.array(roadmapStepSchema),
  recommendations: roadmapRecommendationsSchema.optional(),
  currentStep: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types from database tables
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Session = z.infer<typeof sessionSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type PromptRating = z.infer<typeof promptRatingSchema>;
export type InsertPromptRating = typeof promptRatings.$inferInsert;
export type Roadmap = z.infer<typeof roadmapSchema>;
export type InsertRoadmap = typeof roadmaps.$inferInsert;
export type RoadmapStep = z.infer<typeof roadmapStepSchema>;
export type RoadmapRecommendations = z.infer<typeof roadmapRecommendationsSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Insert schemas
export const insertSessionSchema = sessionSchema.omit({ id: true });
export const insertUserPreferencesSchema = userPreferencesSchema;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
