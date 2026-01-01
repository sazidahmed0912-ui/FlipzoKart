// src/context/LoadingContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    global: false,
    pageTransition: false,
    addToCart: false,
    checkout: false,
    payment: false,
    order: false,
    message: '',
    paymentStep: 0
  });

  const setLoading = useCallback((type, isLoading, message = '') => {
    setLoadingState(prev => ({
      ...prev,
      [type]: isLoading,
      message: isLoading ? message : prev.message,
      ...(type === 'payment' && { paymentStep: isLoading ? 1 : 0 })
    }));
  }, []);

  const startPageTransition = useCallback(() => {
    setLoading('pageTransition', true, 'Loading...');
  }, [setLoading]);

  const stopPageTransition = useCallback(() => {
    setLoading('pageTransition', false, '');
  }, [setLoading]);

  const startAddToCart = useCallback(() => {
    setLoading('addToCart', true, 'Adding to cart...');
  }, [setLoading]);

  const stopAddToCart = useCallback(() => {
    setLoading('addToCart', false, '');
  }, [setLoading]);

  const startCheckout = useCallback(() => {
    setLoading('checkout', true, 'Preparing secure checkout...');
  }, [setLoading]);

  const stopCheckout = useCallback(() => {
    setLoading('checkout', false, '');
  }, [setLoading]);

  const startPayment = useCallback((step = 1) => {
    const messages = [
      'Initializing payment...',
      'Redirecting to gateway...',
      'Verifying payment...',
      'Processing payment...'
    ];
    setLoading('payment', true, messages[step - 1] || messages[0]);
    setLoadingState(prev => ({ ...prev, paymentStep: step }));
  }, [setLoading]);

  const stopPayment = useCallback(() => {
    setLoading('payment', false, '');
    setLoadingState(prev => ({ ...prev, paymentStep: 0 }));
  }, [setLoading]);

  const startOrder = useCallback(() => {
    setLoading('order', true, 'Placing your order...');
  }, [setLoading]);

  const stopOrder = useCallback(() => {
    setLoading('order', false, '');
  }, [setLoading]);

  const isAnyLoading = Object.values(loadingState).some(value => 
    typeof value === 'boolean' ? value : false
  );

  return (
    <LoadingContext.Provider value={{
      loadingState,
      setLoading,
      startPageTransition,
      stopPageTransition,
      startAddToCart,
      stopAddToCart,
      startCheckout,
      stopCheckout,
      startPayment,
      stopPayment,
      startOrder,
      stopOrder,
      isAnyLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};
