import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Global loading methods
  const showGlobalLoader = useCallback((message = '') => {
    setGlobalLoading(true);
    setLoadingMessage(message);
  }, []);

  const hideGlobalLoader = useCallback(() => {
    setGlobalLoading(false);
    setLoadingMessage('');
  }, []);

  // Page transition loading
  const showPageLoader = useCallback(() => {
    setPageLoading(true);
  }, []);

  const hidePageLoader = useCallback(() => {
    setPageLoading(false);
  }, []);

  // Action-based loading (Add to Cart, etc.)
  const showActionLoader = useCallback((actionId, message = '') => {
    setActionLoading(prev => ({
      ...prev,
      [actionId]: { loading: true, message }
    }));
  }, []);

  const hideActionLoader = useCallback((actionId) => {
    setActionLoading(prev => {
      const newState = { ...prev };
      delete newState[actionId];
      return newState;
    });
  }, []);

  // Payment loading with steps
  const showPaymentLoader = useCallback((step = 'initializing') => {
    setPaymentLoading(true);
    setPaymentStep(step);
  }, []);

  const updatePaymentStep = useCallback((step) => {
    setPaymentStep(step);
  }, []);

  const hidePaymentLoader = useCallback(() => {
    setPaymentLoading(false);
    setPaymentStep('');
  }, []);

  // Utility method for async operations
  const withLoading = useCallback(async (operation, options = {}) => {
    const {
      type = 'global',
      actionId = null,
      message = '',
      paymentStep = null
    } = options;

    try {
      if (type === 'global') {
        showGlobalLoader(message);
      } else if (type === 'page') {
        showPageLoader();
      } else if (type === 'action' && actionId) {
        showActionLoader(actionId, message);
      } else if (type === 'payment') {
        showPaymentLoader(paymentStep || 'initializing');
      }

      const result = await operation();

      return result;
    } finally {
      if (type === 'global') {
        hideGlobalLoader();
      } else if (type === 'page') {
        hidePageLoader();
      } else if (type === 'action' && actionId) {
        hideActionLoader(actionId);
      } else if (type === 'payment') {
        hidePaymentLoader();
      }
    }
  }, [showGlobalLoader, hideGlobalLoader, showPageLoader, hidePageLoader, showActionLoader, hideActionLoader, showPaymentLoader, hidePaymentLoader]);

  // Handle page transitions
  useEffect(() => {
    const handleRouteChangeStart = () => {
      showPageLoader();
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        hidePageLoader();
      }, 300);
    };

    // This would be integrated with React Router or Next.js
    // For now, we'll provide the methods to be used manually

    return () => {
      // Cleanup
    };
  }, [showPageLoader, hidePageLoader]);

  const value = {
    // States
    globalLoading,
    pageLoading,
    actionLoading,
    paymentLoading,
    paymentStep,
    loadingMessage,

    // Global loading
    showGlobalLoader,
    hideGlobalLoader,

    // Page loading
    showPageLoader,
    hidePageLoader,

    // Action loading
    showActionLoader,
    hideActionLoader,

    // Payment loading
    showPaymentLoader,
    updatePaymentStep,
    hidePaymentLoader,

    // Utility
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
