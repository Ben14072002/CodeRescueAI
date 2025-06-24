import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./routes/auth";
import { registerSubscriptionRoutes } from "./routes/subscriptions";
import { registerWebhookRoutes } from "./routes/webhooks";
import { registerWizardRoutes } from "./routes/wizard";
import { registerStatusRoutes } from "./routes/status";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerAuthRoutes(app);
  registerSubscriptionRoutes(app);
  registerWebhookRoutes(app);
  registerWizardRoutes(app);
  registerStatusRoutes(app);

  return createServer(app);
}