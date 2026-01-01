import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  loadingSpinner,
  animationConfig 
} from '../../config/premium-animations';

const PremiumLoader = ({ 
  type = 'spinner', 
  message = 'Loading...', 
  fullScreen = false,
  showProgress = false,
  progress = 0 
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="relative">
            <motion.div
              className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
              variants={loadingSpinner}
              animate="animate"
              style={{
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(255, 122, 0, 0)',
                  '0 0 20px rgba(255, 122, 0, 0.3)',
                  '0 0 0px rgba(255, 122, 0, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: animationConfig.ease.luxury
              }}
            />
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: animationConfig.ease.luxury
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <motion.div
              className="w-16 h-16 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: animationConfig.ease.luxury
              }}
            />
            <motion.div
              className="absolute inset-0 bg-orange-300 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: animationConfig.ease.luxury
              }}
            />
          </div>
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-orange-500 rounded-full"
                animate={{
                  height: ['16px', '32px', '16px']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: animationConfig.ease.luxury
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${fullScreen ? 'min-h-screen' : ''}`}>
      {renderLoader()}
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 text-center font-medium"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {message}
        </motion.p>
      )}

      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: animationConfig.ease.luxury }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: animationConfig.duration.normal, ease: animationConfig.ease.luxury }}
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {content}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return content;
};

export default PremiumLoader;
