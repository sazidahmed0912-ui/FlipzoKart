// src/components/ui/Loader.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';

const LoadingSpinner = ({ size = 'md', color = '#ff7a00' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <motion.div
        className={`w-full h-full border-4 border-gray-200 border-t-${color} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

const Loader = ({ 
  mode = 'global',
  message = '',
  showOverlay = true,
  preventScroll = true,
  className = ''
}) => {
  const { loadingState } = useLoading();

  const isLoading = loadingState[mode] || false;
  const displayMessage = message || loadingState.message || '';

  React.useEffect(() => {
    if (isLoading && preventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading, preventScroll]);

  if (!isLoading) return null;

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const renderLoaderContent = () => {
    switch (mode) {
      case 'addToCart':
        return (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Adding...</span>
          </div>
        );

      case 'payment':
        return (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <p className="text-lg font-medium mb-2">{displayMessage}</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4].map((step) => (
                  <motion.div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= loadingState.paymentStep ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                    animate={{
                      scale: step <= loadingState.paymentStep ? [1, 1.2, 1] : 1,
                      transition: { duration: 0.3, delay: step * 0.1 }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'checkout':
      case 'order':
        return (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-lg font-medium">{displayMessage}</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-lg font-medium">{displayMessage || 'Loading...'}</p>
          </div>
        );
    }
  };

  if (mode === 'addToCart') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={className}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderLoaderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            showOverlay ? 'bg-black bg-opacity-50' : ''
          } ${className}`}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={displayMessage || 'Loading'}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            variants={contentVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {renderLoaderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
