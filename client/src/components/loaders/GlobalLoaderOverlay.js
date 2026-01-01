import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import { PremiumLoader, PaymentLoader, OrderLoader } from './PremiumLoader';

const GlobalLoaderOverlay = () => {
  const { state, GlobalLoader } = useLoading();

  // Don't render if not loading
  if (!state.isLoading || !state.showOverlay) {
    return null;
  }

  // Render different loaders based on type
  const renderLoader = () => {
    switch (state.type) {
      case 'payment_processing':
        return <PaymentLoader currentStep={Math.floor((state.progress / 100) * 3) + 1} color="#ff7a00" />;
      
      case 'order_placement':
        return <OrderLoader progress={state.progress} color="#ff7a00" />;
      
      default:
        return (
          <div className="global-loader-overlay">
            <PremiumLoader 
              size="large" 
              message={state.message || 'Loading...'} 
              showProgress={state.progress > 0}
              progress={state.progress}
              color="#ff7a00"
              variant="overlay"
            />
          </div>
        );
    }
  };

  return (
    <>
      {/* Block scroll if needed */}
      {state.blockScroll && (
        <style jsx global>{`
          body {
            overflow: hidden !important;
            position: fixed;
            width: 100%;
          }
        `}</style>
      )}
      
      {/* Global loader overlay */}
      {renderLoader()}
    </>
  );
};

export default GlobalLoaderOverlay;
