/**
 * File Upload Utilities with Error Handling
 */

import { validateImageFile, validateImageFiles, getReadableFileSize, VALIDATION_RULES } from '@/utils/validation';
import { AppError, ERROR_MESSAGES, logError } from '@/utils/error-handler';

/**
 * Validate single file before upload
 */
export function validateFileBeforeUpload(file: File): { valid: boolean; error?: string } {
  const error = validateImageFile(file);
  if (error) {
    return { valid: false, error: error.userMessage };
  }
  return { valid: true };
}

/**
 * Validate multiple files before upload
 */
export function validateFilesBeforeUpload(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (files.length === 0) {
    errors.push('Please select at least one image.');
    return { valid: false, errors };
  }

  if (files.length > VALIDATION_RULES.MAX_IMAGES_PER_PRODUCT) {
    errors.push(`You can upload a maximum of ${VALIDATION_RULES.MAX_IMAGES_PER_PRODUCT} images.`);
    return { valid: false, errors };
  }

  for (const file of files) {
    const error = validateImageFile(file);
    if (error) {
      errors.push(`${file.name}: ${error.userMessage}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get file info
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    sizeReadable: getReadableFileSize(file.size),
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleDateString('en-US'),
  };
}

/**
 * Check if file is image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Get image preview URL
 */
export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Cleanup preview URL
 */
export function revokeImagePreviewUrl(url: string) {
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to revoke URL:', error);
  }
}

/**
 * Generate file upload error message
 */
export function getUploadErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  if (error.response?.status === 413) {
    return `Image is too large. Please upload images smaller than ${VALIDATION_RULES.MAX_IMAGE_SIZE_MB}MB.`;
  }

  if (error.response?.status === 400) {
    return error.response?.data?.message || ERROR_MESSAGES.INVALID_INPUT;
  }

  if (error.response?.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  return ERROR_MESSAGES.IMAGE_UPLOAD_FAILED;
}

/**
 * Create FormData for image upload
 */
export function createImageFormData(
  images: File[],
  additionalData?: Record<string, any>
): FormData {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append('images', image);
  });

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value instanceof Object && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
  }

  return formData;
}

/**
 * Safe file operations with error logging
 */
export async function safeFileOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error: any) {
    const errorMessage = getUploadErrorMessage(error);
    logError(
      error instanceof AppError ? error : new AppError(
        error.message,
        errorMessage,
        'FILE_OPERATION_ERROR'
      ),
      { operation: operationName }
    );
    return { data: null, error: errorMessage };
  }
}
