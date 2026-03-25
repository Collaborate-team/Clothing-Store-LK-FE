/**
 * Error Codes and Types
 */

export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',

  // Stock errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  MAX_QUANTITY_EXCEEDED = 'MAX_QUANTITY_EXCEEDED',

  // Image errors
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  INVALID_IMAGE_TYPE = 'INVALID_IMAGE_TYPE',
  MAX_IMAGES_EXCEEDED = 'MAX_IMAGES_EXCEEDED',
  IMAGE_UPLOAD_FAILED = 'IMAGE_UPLOAD_FAILED',

  // Cart errors
  CART_ADD_FAILED = 'CART_ADD_FAILED',
  CART_UPDATE_FAILED = 'CART_UPDATE_FAILED',
  CART_REMOVE_FAILED = 'CART_REMOVE_FAILED',

  // Product errors
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ADD_FAILED = 'PRODUCT_ADD_FAILED',
  PRODUCT_UPDATE_FAILED = 'PRODUCT_UPDATE_FAILED',
  PRODUCT_DELETE_FAILED = 'PRODUCT_DELETE_FAILED',

  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  userMessage: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

export function isStockError(errorCode: string): boolean {
  return [
    ErrorCode.INSUFFICIENT_STOCK,
    ErrorCode.OUT_OF_STOCK,
    ErrorCode.MAX_QUANTITY_EXCEEDED,
  ].includes(errorCode as ErrorCode);
}

export function isImageError(errorCode: string): boolean {
  return [
    ErrorCode.IMAGE_TOO_LARGE,
    ErrorCode.INVALID_IMAGE_TYPE,
    ErrorCode.MAX_IMAGES_EXCEEDED,
    ErrorCode.IMAGE_UPLOAD_FAILED,
  ].includes(errorCode as ErrorCode);
}

export function isCartError(errorCode: string): boolean {
  return [
    ErrorCode.CART_ADD_FAILED,
    ErrorCode.CART_UPDATE_FAILED,
    ErrorCode.CART_REMOVE_FAILED,
  ].includes(errorCode as ErrorCode);
}

export function isServerError(errorCode: string): boolean {
  return [
    ErrorCode.SERVER_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.NETWORK_ERROR,
  ].includes(errorCode as ErrorCode);
}
