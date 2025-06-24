import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "./errorHandler";

// Validation schemas using native validation (avoiding external dependencies)
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type: 'string' | 'number' | 'email' | 'array' | 'object' | 'boolean';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: string[];
    custom?: (value: any) => boolean | string;
  };
}

export class InputValidator {
  static validate(data: any, schema: ValidationSchema): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip validation if field is not required and not provided
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
            break;
          }
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be no more than ${rules.maxLength} characters`);
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${field} format is invalid`);
          }
          if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
          }
          break;

        case 'email':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
            break;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field} must be a valid email address`);
          }
          break;

        case 'number':
          if (typeof value !== 'number' && !(!isNaN(Number(value)))) {
            errors.push(`${field} must be a number`);
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${field} must be a boolean`);
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`${field} must be an array`);
          }
          break;

        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`${field} must be an object`);
          }
          break;
      }

      // Custom validation
      if (rules.custom) {
        const customResult = rules.custom(value);
        if (customResult !== true) {
          errors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Middleware factory for request validation
export const validateRequest = (schema: ValidationSchema, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
    const { isValid, errors } = InputValidator.validate(data, schema);

    if (!isValid) {
      throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
    }

    next();
  };
};

// Common validation schemas
export const ValidationSchemas = {
  userRegistration: {
    uid: { required: true, type: 'string' as const, minLength: 1 },
    email: { required: true, type: 'email' as const },
    username: { required: false, type: 'string' as const, minLength: 3, maxLength: 50 }
  },

  checkoutSession: {
    plan: { required: true, type: 'string' as const, enum: ['pro_monthly', 'pro_yearly'] },
    userId: { required: true, type: 'string' as const, minLength: 1 }
  },

  trialSession: {
    userId: { required: true, type: 'string' as const, minLength: 1 },
    email: { required: true, type: 'email' as const },
    feature: { required: false, type: 'string' as const }
  },

  wizardClassification: {
    userInput: { required: true, type: 'string' as const, minLength: 10, maxLength: 2000 },
    sessionId: { required: false, type: 'string' as const }
  },

  wizardSolution: {
    classification: { required: true, type: 'object' as const },
    responses: { required: true, type: 'array' as const },
    sessionId: { required: false, type: 'string' as const }
  },

  customPrompt: {
    problem: { required: true, type: 'string' as const, minLength: 10, maxLength: 1000 },
    techStack: { required: false, type: 'string' as const, maxLength: 200 },
    context: { required: false, type: 'string' as const, maxLength: 500 },
    complexity: { required: false, type: 'string' as const, enum: ['simple', 'medium', 'complex'] },
    outputFormat: { required: false, type: 'string' as const, maxLength: 200 }
  },

  userId: {
    userId: { 
      required: true, 
      type: 'string' as const, 
      minLength: 1,
      custom: (value: string) => {
        // Allow Firebase UIDs or numeric IDs
        return /^[a-zA-Z0-9_-]+$/.test(value) || !isNaN(Number(value));
      }
    }
  },

  setupIntent: {
    setupIntentId: { required: true, type: 'string' as const, minLength: 1 },
    userId: { required: true, type: 'string' as const, minLength: 1 }
  },

  trialSetupIntent: {
    userId: { required: true, type: 'string' as const, minLength: 1 },
    email: { required: true, type: 'email' as const },
    name: { required: false, type: 'string' as const, maxLength: 100 }
  }
};

// Rate limiting helpers
export const createRateLimitKey = (req: Request, identifier: string): string => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  return `${identifier}:${ip}`;
};

// Security validation helpers
export const SecurityValidation = {
  isValidFirebaseUid: (uid: string): boolean => {
    return /^[a-zA-Z0-9]{28}$/.test(uid);
  },

  isValidStripeId: (id: string, type: 'customer' | 'subscription' | 'session'): boolean => {
    const prefixes = {
      customer: 'cus_',
      subscription: 'sub_',
      session: 'cs_'
    };
    return id.startsWith(prefixes[type]) && id.length > 10;
  },

  sanitizeUserInput: (input: string): string => {
    // Remove potentially dangerous characters
    return input.replace(/[<>\"'&]/g, '').trim();
  },

  isValidSessionId: (sessionId: string): boolean => {
    // UUID v4 format or similar secure random string
    return /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(sessionId) ||
           /^[a-zA-Z0-9_-]{20,}$/.test(sessionId);
  }
};