import { z } from "zod";
import { pgTable, serial, varchar, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
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
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("trial"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default("trial"),
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  trialEndDate: timestamp("trial_end_date"),
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

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  preferences: one(userPreferences),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
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

// Types from database tables
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Session = z.infer<typeof sessionSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// Insert schemas
export const insertSessionSchema = sessionSchema.omit({ id: true });
export const insertUserPreferencesSchema = userPreferencesSchema;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
