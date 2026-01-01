import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

const Loader = ({ 
  type = 'spinner', 
  size = 'md', 
  color = 'primary',
  message = '',
  fullScreen = false,
  showOverlay = true 
}) => {
  const { loadingMessage } = useLoading();

  const displayMessage = message || loadingMessage;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-orange-500',
    secondary: 'text-gray-500',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`} />
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`w-1 ${colorClasses[color]} rounded-full`}
                animate={{
                  height: ['16px', '32px', '16px'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${fullScreen ? 'min-h-screen' : ''}`}>
      {renderLoader()}
      {displayMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${colorClasses[color]} text-center`}
        >
          {displayMessage}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {showOverlay && (
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          )}
          <div className="relative bg-white rounded-lg p-8 shadow-xl">
            {loaderContent}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return loaderContent;
};

export default Loader;
