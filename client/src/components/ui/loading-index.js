// Export all loading components for easy importing
export { default as LoadingProvider } from '../contexts/LoadingContext';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as AddToCartButton } from './AddToCartButtonNew';
export { default as ProceedToCheckoutButton } from './ProceedToCheckoutButton';
export { default as PlaceOrderButton } from './PlaceOrderButton';
export { default as PaymentProcessingLoader } from './PaymentProcessingLoader';
export { default as GlobalLoadingOverlay } from './GlobalLoadingOverlay';
export { default as PageTransitionLoader } from './PageTransitionLoader';
export { default as AppWithLoading } from '../AppWithLoading';

// Export the useLoading hook for easy access
export { useLoading } from '../contexts/LoadingContext';
