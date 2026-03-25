/**
 * Centralized Error Handling System
 * Handles all application errors with user-friendly messages
 */

import { ErrorCode } from '@/types/errors';

export interface ApiError {
  status?: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

type AxiosLikeError = {
  code?: string;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      userMessage?: string;
      code?: string;
      details?: Record<string, unknown>;
    };
  };
};

export class AppError extends Error {
  constructor(
    public message: string,
    public userMessage: string,
    public code: string,
    public status?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * User-friendly error messages in English
 */
export const ERROR_MESSAGES = {
  // Stock/Inventory Errors
  INSUFFICIENT_STOCK: 'Sorry, this quantity is not available in stock. Please select a lower quantity.',
  OUT_OF_STOCK: 'This product is currently out of stock.',
  MAX_QUANTITY_EXCEEDED: 'You can add a maximum of 3 items to cart per product.',
  INVALID_QUANTITY: 'Please enter a valid quantity (minimum 1).',

  // Cart Errors
  CART_ADD_FAILED: 'Failed to add item to cart. Please try again.',
  CART_UPDATE_FAILED: 'Failed to update cart. Please try again.',
  CART_REMOVE_FAILED: 'Failed to remove item from cart. Please try again.',

  // Image Upload Errors
  INVALID_IMAGE_SIZE: 'Image is too large. Please upload images smaller than 5MB.',
  INVALID_IMAGE_TYPE: 'Invalid image format. Please upload JPG, PNG, or WebP images only.',
  IMAGE_UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  MAX_IMAGES_EXCEEDED: 'You can upload a maximum of 5 images per product.',

  // Product Errors
  PRODUCT_NOT_FOUND: 'This product could not be found.',
  PRODUCT_ADD_FAILED: 'Failed to add product. Please try again.',
  PRODUCT_UPDATE_FAILED: 'Failed to update product. Please try again.',
  PRODUCT_DELETE_FAILED: 'Failed to delete product. Please try again.',

  // Network/Server Errors
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Please log in and try again.',
  FORBIDDEN: 'You do not have permission to perform this action.',

  // Form/Validation Errors
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_INPUT: 'Please enter valid information.',

  // Generic Errors
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

/**
 * Parse API error and return user-friendly message
 */
export function parseApiError(error: unknown): AppError {
  const normalizedError = (error ?? {}) as AxiosLikeError;

  if (!normalizedError.response) {
    if (normalizedError.code === 'ECONNABORTED') {
      return new AppError(
        normalizedError.message || 'Timeout error',
        ERROR_MESSAGES.TIMEOUT_ERROR,
        ErrorCode.TIMEOUT_ERROR,
        undefined,
        { originalError: normalizedError }
      );
    }
    return new AppError(
      normalizedError.message || 'Network error',
      ERROR_MESSAGES.NETWORK_ERROR,
      ErrorCode.NETWORK_ERROR,
      undefined,
      { originalError: normalizedError }
    );
  }

  const status = normalizedError.response?.status;
  const data = normalizedError.response?.data;

  switch (status) {
    case 400:
      return new AppError(
        data?.message || 'Bad Request',
        data?.userMessage || data?.message || ERROR_MESSAGES.INVALID_INPUT,
        data?.code || ErrorCode.INVALID_INPUT,
        400,
        data?.details
      );
    case 401:
      return new AppError(
        'Unauthorized',
        ERROR_MESSAGES.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        401
      );
    case 403:
      return new AppError(
        'Forbidden',
        ERROR_MESSAGES.FORBIDDEN,
        ErrorCode.FORBIDDEN,
        403
      );
    case 404:
      return new AppError(
        'Not Found',
        ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        ErrorCode.PRODUCT_NOT_FOUND,
        404
      );
    case 409:
      return new AppError(
        data?.message || 'Conflict',
        data?.userMessage || data?.message || ERROR_MESSAGES.INSUFFICIENT_STOCK,
        data?.code || ErrorCode.INSUFFICIENT_STOCK,
        409,
        data?.details
      );
    case 413:
      return new AppError(
        'Payload Too Large',
        ERROR_MESSAGES.INVALID_IMAGE_SIZE,
        ErrorCode.IMAGE_TOO_LARGE,
        413
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        data?.message || 'Server Error',
        ERROR_MESSAGES.SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        status
      );
    default:
      return new AppError(
        data?.message || normalizedError.message || 'Unknown Error',
        data?.userMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
        data?.code || ErrorCode.UNKNOWN_ERROR,
        status,
        data?.details
      );
  }
}

/**
 * Handle async operations with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err: unknown) {
    const appError = err instanceof AppError ? err : parseApiError(err);
    errorHandler?.(appError);
    return { data: null, error: appError };
  }
}

/**
 * Log error for debugging
 */
export function logError(error: AppError | Error, context?: Record<string, unknown>) {
  const userAgent = globalThis.navigator === undefined
    ? 'N/A'
    : globalThis.navigator.userAgent;
  const currentUrl = globalThis.window === undefined
    ? 'N/A'
    : globalThis.window.location.href;

  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    context,
    userAgent,
    url: currentUrl,
  };

  console.error('[AppError]', errorData);
}
