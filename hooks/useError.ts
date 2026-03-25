/**
 * Error Handling Hook
 */

'use client';

import { useCallback } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { AppError, ERROR_MESSAGES, logError } from '@/utils/error-handler';
import { ErrorCode } from '@/types/errors';

export function useErrorHandler() {
  const { showNotification } = useNotification();

  const handleError = useCallback(
    (error: unknown, context?: Record<string, unknown>) => {
      let message: string = ERROR_MESSAGES.UNKNOWN_ERROR;

      if (error instanceof AppError) {
        message = error.userMessage;
        logError(error, context);
      } else if (error instanceof Error) {
        message = error.message;
        logError(
          new AppError(error.message, message, ErrorCode.UNKNOWN_ERROR),
          context
        );
      }

      showNotification(message, 'error');
    },
    [showNotification]
  );

  const handleSuccess = useCallback(
    (message: string) => {
      showNotification(message, 'success');
    },
    [showNotification]
  );

  const handleWarning = useCallback(
    (message: string) => {
      showNotification(message, 'warning');
    },
    [showNotification]
  );

  return {
    handleError,
    handleSuccess,
    handleWarning,
  };
}
