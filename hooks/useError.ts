/**
 * Error Handling Hook
 */

'use client';

import { useCallback } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { AppError, logError } from '@/utils/error-handler';

export function useErrorHandler() {
  const { showNotification } = useNotification();

  const handleError = useCallback(
    (error: any, context?: Record<string, any>) => {
      let message = 'Something went wrong. Please try again.';

      if (error instanceof AppError) {
        message = error.userMessage;
        logError(error, context);
      } else if (error?.message) {
        message = error.message;
        logError(
          new AppError(error.message, message, 'UNKNOWN_ERROR'),
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
