// Standardized API response utility for consistent response formats

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiResponseUtil {
  /**
   * Create a successful API response
   */
  static success<T>(data: T, message?: string, meta?: any): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  /**
   * Create an error API response
   */
  static error(message: string, code?: string, details?: any): ApiErrorResponse {
    return {
      success: false,
      error: message,
      code,
      details,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Create a paginated success response
   */
  static paginated<T>(
    data: T[], 
    page: number, 
    limit: number, 
    total: number, 
    message?: string
  ): ApiSuccessResponse<T[]> {
    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        pagination: {
          page,
          limit,
          total,
          hasNext,
          hasPrev
        }
      }
    };
  }

  /**
   * Create a validation error response
   */
  static validationError(message: string, details?: any): ApiErrorResponse {
    return {
      success: false,
      error: message,
      code: 'VALIDATION_ERROR',
      details,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Create an unauthorized error response
   */
  static unauthorized(message: string = 'Unauthorized access'): ApiErrorResponse {
    return {
      success: false,
      error: message,
      code: 'UNAUTHORIZED',
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Create a not found error response
   */
  static notFound(resource: string = 'Resource'): ApiErrorResponse {
    return {
      success: false,
      error: `${resource} not found`,
      code: 'NOT_FOUND',
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Create a server error response
   */
  static serverError(message: string = 'Internal server error'): ApiErrorResponse {
    return {
      success: false,
      error: message,
      code: 'SERVER_ERROR',
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Create a rate limit error response
   */
  static rateLimitError(message: string = 'Rate limit exceeded'): ApiErrorResponse {
    return {
      success: false,
      error: message,
      code: 'RATE_LIMIT_EXCEEDED',
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }
}