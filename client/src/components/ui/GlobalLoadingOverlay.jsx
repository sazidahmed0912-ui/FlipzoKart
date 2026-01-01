import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const GlobalLoadingOverlay = () => {
  const { globalLoading, loadingMessage } = useLoading();

  return (
    <AnimatePresence>
      {globalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner type="spinner" size="lg" color="primary" />
              
              {loadingMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-700 text-center font-medium"
                >
                  {loadingMessage}
                </motion.p>
              )}
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm text-center"
              >
                Please wait...
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingOverlay;
