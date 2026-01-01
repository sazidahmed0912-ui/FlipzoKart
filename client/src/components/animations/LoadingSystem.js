// src/components/animations/LoadingSystem.js
import React from 'react';
import { motion } from 'framer-motion';

// Premium Loading Spinner
export const PremiumLoader = ({ size = 64, color = "#ff7a00" }) => {
  return (
    <motion.div 
      className="relative" 
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: size * 0.7,
            height: size * 0.7,
            top: '15%',
            left: '15%',
            borderRadius: '50%',
            border: `3px solid ${color}`,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transformOrigin: 'center'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.25
          }}
        />
      ))}
    </motion.div>
  );
};

// Payment Processing Overlay
export const PaymentOverlay = ({ isVisible, message = "Processing Payment..." }) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <PremiumLoader size={80} />
        <motion.p 
          className="mt-6 text-lg font-medium text-gray-800"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {message}
        </motion.p>
        <motion.div 
          className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Loading Context Hook
export const useLoading = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('');

  const startLoading = (message = '') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    PaymentOverlay: () => (
      <PaymentOverlay isVisible={isLoading} message={loadingMessage} />
    )
  };
};
