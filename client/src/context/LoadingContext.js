import React, { createContext, useContext, useState, useEffect } from 'react';

// Loading types
export const LOADING_TYPES = {
  PAGE_TRANSITION: 'page_transition',
  ADD_TO_CART: 'add_to_cart',
  PROCEED_TO_CHECKOUT: 'proceed_to_checkout',
  PAYMENT_PROCESSING: 'payment_processing',
  ORDER_PLACEMENT: 'order_placement',
  BUTTON_ACTION: 'button_action',
  GLOBAL_OVERLAY: 'global_overlay'
};

// Loading contexts
const LoadingContext = createContext();
const LoadingProviderContext = createContext();

// Loading state structure
const initialState = {
  isLoading: false,
  type: null,
  message: '',
  progress: 0,
  showOverlay: false,
  blockScroll: false
};

// Main loading provider
export const LoadingProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [loadingQueue, setLoadingQueue] = useState([]);
  const [activeOperations, setActiveOperations] = useState(new Set());

  // Global loading state
  const setLoading = (type, message = '', options = {}) => {
    const operationId = Date.now().toString();
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      type,
      message,
      progress: options.progress || 0,
      showOverlay: options.showOverlay || false,
      blockScroll: options.blockScroll || false
    }));

    // Track operation
    setActiveOperations(prev => new Set(prev).add(operationId));

    // Auto-hide after timeout
    const timeout = options.timeout || 5000;
    if (timeout > 0) {
      setTimeout(() => {
        clearLoading(operationId);
      }, timeout);
    }

    return operationId;
  };

  const clearLoading = (operationId = null) => {
    setState(prev => {
      if (operationId && activeOperations.has(operationId)) {
        return {
          ...prev,
          isLoading: activeOperations.size > 1,
          type: activeOperations.size > 1 ? prev.type : null,
          message: activeOperations.size > 1 ? prev.message : '',
          showOverlay: activeOperations.size > 1 ? prev.showOverlay : false,
          blockScroll: activeOperations.size > 1 ? prev.blockScroll : false
        };
      }
      
      if (operationId) {
        setActiveOperations(prev => {
          const newSet = new Set(prev);
          newSet.delete(operationId);
          return newSet;
        });
      } else {
        return initialState;
      }
    });
  };

  const setLoadingMessage = (message) => {
    setState(prev => ({ ...prev, message }));
  };

  const setProgress = (progress) => {
    setState(prev => ({ ...prev, progress: Math.max(0, Math.min(100, progress)) }));
  };

  // Global overlay loader
  const GlobalLoader = () => {
    if (!state.showOverlay) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Brand Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            
            {/* Loading Animation */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-emerald-200 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin animation-delay-300"></div>
            </div>
            
            {/* Message */}
            <p className="text-gray-700 text-center font-medium max-w-xs">
              {state.message || 'Loading...'}
            </p>
            
            {/* Progress Bar */}
            {state.progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <LoadingContext.Provider value={{ state, setLoading, clearLoading, setLoadingMessage, setProgress, GlobalLoader }}>
      <LoadingProviderContext.Provider value={{ state, setLoading, clearLoading, setLoadingMessage, setProgress, GlobalLoader }}>
        {children}
      </LoadingProviderContext.Provider>
    </LoadingContext.Provider>
  );
};

// Hook for accessing loading state
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

// Hook for button loading state
export const useButtonLoading = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startLoading = (message = 'Loading...', options = {}) => {
    return setLoading(LOADING_TYPES.BUTTON_ACTION, message, options);
  };
  
  const stopLoading = () => {
    clearLoading();
  };
  
  return { startLoading, stopLoading, isLoading: useLoading().isLoading };
};

// Hook for page transitions
export const usePageTransition = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startPageTransition = (message = 'Loading...', options = {}) => {
    return setLoading(LOADING_TYPES.PAGE_TRANSITION, message, {
      showOverlay: true,
      blockScroll: true,
      timeout: 1000,
      ...options
    });
  };
  
  const stopPageTransition = () => {
    clearLoading();
  };
  
  return { startPageTransition, stopPageTransition, isLoading: useLoading().isLoading };
};

// Hook for cart operations
export const useCartLoading = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startCartLoading = (message = 'Adding to cart...', options = {}) => {
    return setLoading(LOADING_TYPES.ADD_TO_CART, message, {
      timeout: 2000,
      ...options
    });
  };
  
  const stopCartLoading = () => {
    clearLoading();
  };
  
  return { startCartLoading, stopCartLoading, isLoading: useLoading().isLoading };
};

// Hook for checkout flow
export const useCheckoutLoading = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startCheckoutLoading = (message = 'Preparing secure checkout...', options = {}) => {
    return setLoading(LOADING_TYPES.PROCEED_TO_CHECKOUT, message, {
      showOverlay: true,
      blockScroll: true,
      timeout: 3000,
      ...options
    });
  };
  
  const stopCheckoutLoading = () => {
    clearLoading();
  };
  
  return { startCheckoutLoading, stopCheckoutLoading, isLoading: useLoading().isLoading };
};

// Hook for payment processing
export const usePaymentLoading = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startPaymentLoading = (message = 'Initializing payment...', options = {}) => {
    return setLoading(LOADING_TYPES.PAYMENT_PROCESSING, message, {
      showOverlay: true,
      blockScroll: true,
      timeout: 10000,
      progress: 0,
      ...options
    });
  };
  
  const updatePaymentProgress = (progress) => {
    setLoading(prev => ({ ...prev, progress }));
  };
  
  const stopPaymentLoading = () => {
    clearLoading();
  };
  
  return { 
    startPaymentLoading, 
    updatePaymentProgress, 
    stopPaymentLoading, 
    isLoading: useLoading().isLoading,
    progress: useLoading().progress
  };
};

// Hook for order placement
export const useOrderLoading = () => {
  const { setLoading, clearLoading } = useLoading();
  
  const startOrderLoading = (message = 'Placing order...', options = {}) => {
    return setLoading(LOADING_TYPES.ORDER_PLACEMENT, message, {
      showOverlay: true,
      blockScroll: true,
      timeout: 5000,
      progress: 0,
      ...options
    });
  };
  
  const updateOrderProgress = (progress) => {
    setLoading(prev => ({ ...prev, progress }));
  };
  
  const stopOrderLoading = () => {
    clearLoading();
  };
  
  return { 
    startOrderLoading, 
    updateOrderProgress, 
    stopOrderLoading, 
    isLoading: useLoading().isLoading,
    progress: useLoading().progress
  };
};
