/**
 * Types of errors that can occur in the application
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTH = 'AUTH',
    DATABASE = 'DATABASE',
    VALIDATION = 'VALIDATION',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Structure for application errors
 */
export interface AppError {
    type: ErrorType;
    message: string;
    code?: string;
    originalError?: unknown;
}

/**
 * Creates a structured error object for consistent error handling
 */
export function createError(
    type: ErrorType,
    message: string,
    code?: string,
    originalError?: unknown
): AppError {
    return {
        type,
        message,
        code,
        originalError,
    };
}

/**
 * Logs errors to the console in development mode
 * In production, this could be extended to log to an error monitoring service
 */
export function logError(error: AppError): void {
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${error.type}]${error.code ? ` (${error.code})` : ''}: ${error.message}`);
        if (error.originalError) {
            console.error('Original error:', error.originalError);
        }
    } else {
        // In production, you might want to log to an error monitoring service
        // For example: Sentry.captureException(error);
    }
}

/**
 * Handles API errors and transforms them into AppError objects
 */
export function handleApiError(error: unknown): AppError {
    if (error instanceof Response) {
        return createError(
            ErrorType.NETWORK,
            `API request failed with status: ${error.status}`,
            error.status.toString(),
            error
        );
    }

    if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
            return createError(
                ErrorType.NETWORK,
                'Network error occurred while fetching data',
                undefined,
                error
            );
        }

        return createError(
            ErrorType.UNKNOWN,
            error.message || 'An unknown error occurred',
            undefined,
            error
        );
    }

    return createError(
        ErrorType.UNKNOWN,
        'An unknown error occurred',
        undefined,
        error
    );
}

/**
 * Gets a user-friendly error message based on the error type
 */
export function getUserFriendlyErrorMessage(error: AppError): string {
    switch (error.type) {
        case ErrorType.NETWORK:
            return 'Network connection issue. Please check your internet connection and try again.';
        case ErrorType.AUTH:
            return 'Authentication error. Please sign in again.';
        case ErrorType.DATABASE:
            return 'Database error. Please try again later.';
        case ErrorType.VALIDATION:
            return error.message || 'Invalid input. Please check your information and try again.';
        case ErrorType.UNKNOWN:
        default:
            return 'An unexpected error occurred. Please try again later.';
    }
} 