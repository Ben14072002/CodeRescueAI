import type { Request, Response, NextFunction } from "express";

// Custom error classes for better error handling
export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UserNotFoundError extends Error {
  statusCode = 404;
  code = 'USER_NOT_FOUND';
  
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class SubscriptionError extends Error {
  statusCode = 400;
  code = 'SUBSCRIPTION_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'SubscriptionError';
  }
}

export class StripeError extends Error {
  statusCode = 500;
  code = 'STRIPE_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'StripeError';
  }
}

export class OpenAIError extends Error {
  statusCode = 500;
  code = 'OPENAI_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

// Comprehensive error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error details for debugging (but don't expose to client)
  console.error('API Error:', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Handle known error types
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof UserNotFoundError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof SubscriptionError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }

  if (error instanceof StripeError) {
    return res.status(error.statusCode).json({
      success: false,
      error: 'Payment processing error. Please try again.',
      code: error.code
    });
  }

  if (error instanceof OpenAIError) {
    return res.status(error.statusCode).json({
      success: false,
      error: 'AI service temporarily unavailable. Please try again.',
      code: error.code
    });
  }

  // Handle Stripe webhook signature errors
  if (error.message?.includes('No signatures found matching the expected signature')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid webhook signature',
      code: 'WEBHOOK_SIGNATURE_ERROR'
    });
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      code: 'JSON_PARSE_ERROR'
    });
  }

  // Handle database connection errors
  if (error.message?.includes('connect ECONNREFUSED') || error.message?.includes('database')) {
    return res.status(503).json({
      success: false,
      error: 'Database temporarily unavailable',
      code: 'DATABASE_ERROR'
    });
  }

  // Handle rate limiting errors
  if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_ERROR'
    });
  }

  // Default error response (don't expose internal error details)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
};

// Async error wrapper to catch async errors in route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND'
  });
};