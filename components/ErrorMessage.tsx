import React from 'react';
import { AppError, getUserFriendlyErrorMessage, ErrorType } from '@/lib/errorHandler';

interface ErrorMessageProps {
    error: AppError | string | null;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
    if (!error) return null;

    const errorMessage = typeof error === 'string'
        ? error
        : getUserFriendlyErrorMessage(error);

    const isAuthError = typeof error !== 'string' && error.type === ErrorType.AUTH;

    return (
        <div
            className={`p-4 mb-4 rounded-lg ${isAuthError
                    ? 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200'
                    : 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
                } ${className}`}
            role="alert"
        >
            <div className="flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="font-medium">{errorMessage}</span>
            </div>
        </div>
    );
};

export default ErrorMessage; 