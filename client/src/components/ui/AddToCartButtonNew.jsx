import React from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const AddToCartButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  actionId = 'add-to-cart',
  loadingText = 'Adding...' 
}) => {
  const { actionLoading, showActionLoader, hideActionLoader } = useLoading();
  const isLoading = actionLoading[actionId]?.loading || false;

  const handleClick = async (e) => {
    if (disabled || isLoading) return;

    try {
      showActionLoader(actionId, loadingText);
      
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      hideActionLoader(actionId);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center
        px-6 py-3 text-sm font-medium rounded-lg
        bg-orange-500 text-white
        hover:bg-orange-600 focus:outline-none
        focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2"
          >
            <LoadingSpinner type="dots" size="sm" color="white" />
            <span>{loadingText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToCartButton;
