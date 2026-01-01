import React from 'react';
import { LoadingProvider } from '../contexts/LoadingContext';
import GlobalLoadingOverlay from './ui/GlobalLoadingOverlay';
import PageTransitionLoader from './ui/PageTransitionLoader';
import PaymentProcessingLoader from './ui/PaymentProcessingLoader';

const AppWithLoading = ({ children }) => {
  return (
    <LoadingProvider>
      <PageTransitionLoader>
        {children}
      </PageTransitionLoader>
      <GlobalLoadingOverlay />
      <PaymentProcessingLoader />
    </LoadingProvider>
  );
};

export default AppWithLoading;
