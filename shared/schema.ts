import { z } from "zod";

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

export type Session = z.infer<typeof sessionSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// Insert schemas
export const insertSessionSchema = sessionSchema.omit({ id: true });
export const insertUserPreferencesSchema = userPreferencesSchema;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
