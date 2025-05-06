import React from 'react';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    text?: string;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'medium',
    fullScreen = false,
    text = 'Loading...'
}) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
            {text && <p className="mt-2 text-gray-600">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loading; 