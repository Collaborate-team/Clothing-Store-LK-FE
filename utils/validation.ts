/**
 * Validation Utilities for Product Stock, Cart, and Image Uploads
 */

import { AppError, ERROR_MESSAGES } from './error-handler';
import { ErrorCode } from '@/types/errors';

export const VALIDATION_RULES = {
  MAX_CART_QUANTITY: 100,
  MAX_QUANTITY_PER_PRODUCT: 100,
  MIN_QUANTITY: 1,
  MAX_IMAGE_SIZE_MB: 1024, // 1GB
  MAX_IMAGE_SIZE_BYTES: 1024 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],
  MAX_IMAGES_PER_PRODUCT: 1000,
  STOCK_THRESHOLD: 1000,
};

/**
 * Validate product quantity for add to cart
 */
export function validateQuantity(quantity: number, availableStock: number): AppError | null {
  if (!Number.isInteger(quantity) || quantity < VALIDATION_RULES.MIN_QUANTITY) {
    return new AppError(
      'Invalid quantity',
      ERROR_MESSAGES.INVALID_QUANTITY,
      ErrorCode.INVALID_INPUT
    );
  }

  if (quantity > availableStock) {
    return new AppError(
      'Insufficient stock',
      `Only ${availableStock} items are available in stock.`,
      ErrorCode.INSUFFICIENT_STOCK,
      409,
      { requested: quantity, available: availableStock }
    );
  }

  return null;
}

/**
 * Check if product is out of stock
 */
export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

/**
 * Check if product has low stock warning
 */
export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= VALIDATION_RULES.STOCK_THRESHOLD;
}

/**
 * Validate single image file
 */
export function validateImageFile(file: File): AppError | null {
  if (!VALIDATION_RULES.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return new AppError(
      'Invalid image type',
      ERROR_MESSAGES.INVALID_IMAGE_TYPE,
      ErrorCode.INVALID_IMAGE_TYPE,
      undefined,
      { received: file.type, allowed: VALIDATION_RULES.ALLOWED_IMAGE_TYPES }
    );
  }

  if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxMB = VALIDATION_RULES.MAX_IMAGE_SIZE_MB;
    return new AppError(
      'Image file too large',
      `Image size is ${sizeMB}MB. Please upload images smaller than ${maxMB}MB.`,
      ErrorCode.IMAGE_TOO_LARGE,
      413,
      { size: file.size, maxSize: VALIDATION_RULES.MAX_IMAGE_SIZE_BYTES, sizeInMB: sizeMB }
    );
  }

  return null;
}

/**
 * Validate multiple image files
 */
export function validateImageFiles(files: File[]): AppError | null {
  if (files.length > VALIDATION_RULES.MAX_IMAGES_PER_PRODUCT) {
    return new AppError(
      'Too many images',
      ERROR_MESSAGES.MAX_IMAGES_EXCEEDED,
      ErrorCode.MAX_IMAGES_EXCEEDED,
      undefined,
      { provided: files.length, maxAllowed: VALIDATION_RULES.MAX_IMAGES_PER_PRODUCT }
    );
  }

  for (const file of files) {
    const error = validateImageFile(file);
    if (error) return error;
  }

  return null;
}

/**
 * Get human-readable file size
 */
export function getReadableFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate image upload request
 */
export function validateImageUpload(files: File | File[]): AppError | null {
  const fileArray = Array.isArray(files) ? files : [files];

  if (fileArray.length === 0) {
    return new AppError(
      'No files provided',
      'Please select at least one image.',
      'NO_FILES_PROVIDED'
    );
  }

  return validateImageFiles(fileArray);
}
