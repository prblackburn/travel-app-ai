/**
 * Error handling utilities for consistent error management
 * Provides typed error creation, handling, and formatting functions
 */

import type { AppError, ValidationError } from '../types/index.js';

// Common error codes used throughout the application
export const ERROR_CODES = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  INVALID_TIME_FORMAT: 'INVALID_TIME_FORMAT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',

  // Business logic errors
  TRIP_DATE_CONFLICT: 'TRIP_DATE_CONFLICT',
  ACTIVITY_OUTSIDE_TRIP_RANGE: 'ACTIVITY_OUTSIDE_TRIP_RANGE',
  PACKING_LIST_NOT_EMPTY: 'PACKING_LIST_NOT_EMPTY',

  // Network/API errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Creates a standardized AppError object
 */
export function createAppError(message: string, code?: ErrorCode, details?: unknown): AppError {
  return {
    message,
    code,
    details,
  };
}

/**
 * Creates a validation error for form fields
 */
export function createValidationError(field: string, message: string): ValidationError {
  return {
    field,
    message,
  };
}

/**
 * Handles database errors and converts them to AppError
 */
export function handleDatabaseError(error: unknown): AppError {
  if (error instanceof Error) {
    // Handle specific SQLite error patterns
    if (error.message.includes('UNIQUE constraint failed')) {
      return createAppError(
        'A record with this information already exists',
        ERROR_CODES.DUPLICATE_RECORD,
        error
      );
    }

    if (error.message.includes('FOREIGN KEY constraint failed')) {
      return createAppError(
        'Cannot perform this operation due to related data',
        ERROR_CODES.FOREIGN_KEY_CONSTRAINT,
        error
      );
    }

    if (error.message.includes('NOT NULL constraint failed')) {
      return createAppError('Required information is missing', ERROR_CODES.VALIDATION_ERROR, error);
    }

    // Generic database error
    return createAppError('Database operation failed', ERROR_CODES.DATABASE_ERROR, error);
  }

  return createAppError('An unknown database error occurred', ERROR_CODES.UNKNOWN_ERROR, error);
}

/**
 * Handles network/fetch errors and converts them to AppError
 */
export function handleNetworkError(error: unknown, url?: string): AppError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createAppError(
      'Network connection failed. Please check your internet connection.',
      ERROR_CODES.NETWORK_ERROR,
      { error, url }
    );
  }

  if (error instanceof Error) {
    return createAppError(`Network error: ${error.message}`, ERROR_CODES.NETWORK_ERROR, {
      error,
      url,
    });
  }

  return createAppError('An unknown network error occurred', ERROR_CODES.UNKNOWN_ERROR, {
    error,
    url,
  });
}

/**
 * Handles HTTP response errors and converts them to AppError
 */
export function handleHttpError(response: Response): AppError {
  switch (response.status) {
    case 400:
      return createAppError('Invalid request data', ERROR_CODES.VALIDATION_ERROR, {
        status: response.status,
        statusText: response.statusText,
      });
    case 401:
      return createAppError('Authentication required', ERROR_CODES.UNAUTHORIZED, {
        status: response.status,
        statusText: response.statusText,
      });
    case 403:
      return createAppError('Permission denied', ERROR_CODES.FORBIDDEN, {
        status: response.status,
        statusText: response.statusText,
      });
    case 404:
      return createAppError('Requested resource not found', ERROR_CODES.RECORD_NOT_FOUND, {
        status: response.status,
        statusText: response.statusText,
      });
    case 500:
      return createAppError('Internal server error', ERROR_CODES.SERVER_ERROR, {
        status: response.status,
        statusText: response.statusText,
      });
    default:
      return createAppError(
        `HTTP error: ${response.status} ${response.statusText}`,
        ERROR_CODES.SERVER_ERROR,
        { status: response.status, statusText: response.statusText }
      );
  }
}

/**
 * Gets user-friendly error message for display
 */
export function getErrorMessage(error: AppError): string {
  // Return custom messages for known error codes
  switch (error.code) {
    case ERROR_CODES.VALIDATION_ERROR:
      return error.message || 'Please check your input and try again';
    case ERROR_CODES.RECORD_NOT_FOUND:
      return 'The requested item could not be found';
    case ERROR_CODES.DUPLICATE_RECORD:
      return 'This item already exists';
    case ERROR_CODES.NETWORK_ERROR:
      return 'Network connection failed. Please try again.';
    case ERROR_CODES.SERVER_ERROR:
      return 'Server error occurred. Please try again later.';
    case ERROR_CODES.TRIP_DATE_CONFLICT:
      return 'Trip dates overlap with an existing trip';
    case ERROR_CODES.ACTIVITY_OUTSIDE_TRIP_RANGE:
      return 'Activity date must be within the trip date range';
    case ERROR_CODES.INVALID_DATE_RANGE:
      return 'End date must be after start date';
    default:
      return error.message || 'An unexpected error occurred';
  }
}

/**
 * Determines if an error is a validation error
 */
export function isValidationError(error: AppError): boolean {
  return (
    error.code === ERROR_CODES.VALIDATION_ERROR ||
    error.code === ERROR_CODES.INVALID_DATE_RANGE ||
    error.code === ERROR_CODES.INVALID_TIME_FORMAT ||
    error.code === ERROR_CODES.REQUIRED_FIELD
  );
}

/**
 * Determines if an error is a database error
 */
export function isDatabaseError(error: AppError): boolean {
  return (
    error.code === ERROR_CODES.DATABASE_ERROR ||
    error.code === ERROR_CODES.RECORD_NOT_FOUND ||
    error.code === ERROR_CODES.DUPLICATE_RECORD ||
    error.code === ERROR_CODES.FOREIGN_KEY_CONSTRAINT
  );
}

/**
 * Determines if an error is a network error
 */
export function isNetworkError(error: AppError): boolean {
  return error.code === ERROR_CODES.NETWORK_ERROR;
}

/**
 * Logs error with appropriate level based on error type
 */
export function logError(error: AppError, context?: string): void {
  const logContext = context ? `[${context}]` : '';
  const errorDetails = {
    message: error.message,
    code: error.code,
    details: error.details,
  };

  // Use console.error for serious errors, console.warn for validation errors
  if (isValidationError(error)) {
    console.warn(`${logContext} Validation error:`, errorDetails);
  } else if (isNetworkError(error)) {
    console.warn(`${logContext} Network error:`, errorDetails);
  } else {
    console.error(`${logContext} Application error:`, errorDetails);
  }
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError =
        error instanceof Error
          ? createAppError(error.message, ERROR_CODES.INTERNAL_ERROR, error)
          : createAppError('Unknown error occurred', ERROR_CODES.UNKNOWN_ERROR, error);

      logError(appError, context);
      throw appError;
    }
  };
}

/**
 * Creates business logic validation errors for domain-specific rules
 */
export function createBusinessRuleError(rule: string, details?: unknown): AppError {
  switch (rule) {
    case 'trip-date-range':
      return createAppError(
        'Trip end date must be after start date',
        ERROR_CODES.INVALID_DATE_RANGE,
        details
      );
    case 'activity-trip-range':
      return createAppError(
        'Activity date must be within trip date range',
        ERROR_CODES.ACTIVITY_OUTSIDE_TRIP_RANGE,
        details
      );
    case 'packing-list-not-empty':
      return createAppError(
        'Cannot delete packing list that contains items',
        ERROR_CODES.PACKING_LIST_NOT_EMPTY,
        details
      );
    default:
      return createAppError(
        `Business rule violation: ${rule}`,
        ERROR_CODES.VALIDATION_ERROR,
        details
      );
  }
}
