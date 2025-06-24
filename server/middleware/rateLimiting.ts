import type { Request, Response, NextFunction } from "express";

// In-memory rate limiting store (for production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const createRateLimit = (options: RateLimitOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests from this IP, please try again later',
    statusCode = 429,
    keyGenerator = (req: Request) => req.ip || req.connection.remoteAddress || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const resetTime = now + windowMs;

    let current = rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      current = { count: 0, resetTime };
      rateLimitStore.set(key, current);
    }

    current.count++;

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': Math.max(0, max - current.count).toString(),
      'X-RateLimit-Reset': new Date(current.resetTime).toISOString()
    });

    if (current.count > max) {
      return res.status(statusCode).json({
        success: false,
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
    }

    // Track response to potentially skip counting
    const originalSend = res.send;
    res.send = function(data) {
      const shouldSkip = 
        (skipSuccessfulRequests && res.statusCode < 400) ||
        (skipFailedRequests && res.statusCode >= 400);

      if (shouldSkip && current) {
        current.count--;
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

// Predefined rate limiters for different endpoints
export const RateLimiters = {
  // Strict limiting for subscription endpoints
  subscription: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes per IP
    message: 'Too many subscription requests. Please wait before trying again.',
    keyGenerator: (req: Request) => `subscription:${req.ip || 'unknown'}`
  }),

  // Medium limiting for authentication
  auth: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes per IP
    message: 'Too many authentication requests. Please wait before trying again.',
    keyGenerator: (req: Request) => `auth:${req.ip || 'unknown'}`
  }),

  // Generous limiting for AI wizard (expensive operations)
  wizard: createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // 20 requests per 5 minutes per IP
    message: 'AI wizard rate limit exceeded. Please wait before generating more solutions.',
    keyGenerator: (req: Request) => `wizard:${req.ip || 'unknown'}`
  }),

  // Very strict for trial activation (prevent abuse)
  trial: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 trial attempts per hour per IP
    message: 'Too many trial activation attempts. Please wait before trying again.',
    keyGenerator: (req: Request) => `trial:${req.ip || 'unknown'}`
  }),

  // General API limiting
  general: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes per IP
    message: 'Rate limit exceeded. Please slow down your requests.',
    keyGenerator: (req: Request) => `general:${req.ip || 'unknown'}`
  }),

  // Webhook rate limiting (per endpoint)
  webhook: createRateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 webhooks per minute per IP
    message: 'Webhook rate limit exceeded.',
    keyGenerator: (req: Request) => `webhook:${req.ip || 'unknown'}`
  })
};

// User-specific rate limiting (requires user identification)
export const createUserRateLimit = (options: RateLimitOptions & { userIdExtractor: (req: Request) => string | null }) => {
  const { userIdExtractor, ...rateLimitOptions } = options;

  return createRateLimit({
    ...rateLimitOptions,
    keyGenerator: (req: Request) => {
      const userId = userIdExtractor(req);
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      return userId ? `user:${userId}` : `ip:${ip}`;
    }
  });
};

// Advanced rate limiting with different tiers based on user subscription
export const createTieredRateLimit = (limits: {
  free: { windowMs: number; max: number };
  trial: { windowMs: number; max: number };
  pro: { windowMs: number; max: number };
}, getUserTier: (req: Request) => Promise<'free' | 'trial' | 'pro'>) => {
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tier = await getUserTier(req);
      const limit = limits[tier];
      
      const rateLimiter = createRateLimit({
        windowMs: limit.windowMs,
        max: limit.max,
        message: `Rate limit exceeded for ${tier} tier. Consider upgrading for higher limits.`,
        keyGenerator: (req: Request) => {
          const userId = req.params.userId || req.body.userId;
          const ip = req.ip || 'unknown';
          return userId ? `${tier}:user:${userId}` : `${tier}:ip:${ip}`;
        }
      });

      rateLimiter(req, res, next);
    } catch (error) {
      console.error('Error in tiered rate limiting:', error);
      // Fallback to general rate limiting
      RateLimiters.general(req, res, next);
    }
  };
};

// Burst protection (allows short bursts but limits sustained usage)
export const createBurstRateLimit = (
  shortWindow: { windowMs: number; max: number },
  longWindow: { windowMs: number; max: number }
) => {
  const shortLimiter = createRateLimit(shortWindow);
  const longLimiter = createRateLimit(longWindow);

  return (req: Request, res: Response, next: NextFunction) => {
    shortLimiter(req, res, (shortErr) => {
      if (shortErr) return;
      
      longLimiter(req, res, (longErr) => {
        if (longErr) return;
        next();
      });
    });
  };
};