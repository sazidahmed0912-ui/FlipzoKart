// src/components/ui/AddToCartButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';

const AddToCartButton = ({ 
  product, 
  onAddToCart, 
  className = '',
  disabled = false,
  children = 'Add to Cart'
}) => {
  const { loadingState, startAddToCart, stopAddToCart } = useLoading();
  const isLoading = loadingState.addToCart;

  const handleClick = async () => {
    if (isLoading || disabled) return;

    try {
      startAddToCart();
      await onAddToCart(product);
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      stopAddToCart();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`
        relative overflow-hidden px-6 py-3 bg-orange-500 text-white rounded-lg
        font-medium transition-all duration-300
        hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
        disabled:hover:shadow-none disabled:hover:bg-orange-500
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      aria-label={isLoading ? 'Adding to cart' : children}
    >
      <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {children}
      </span>
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileTap={{ opacity: 0.1 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  );
};

export default AddToCartButton;
