// src/components/ui/AppWithLoading.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingProvider } from '../../context/LoadingContext';
import Loader from './Loader';
import PageTransition from './PageTransition';
import PaymentLoader from './PaymentLoader';

const AppWithLoading = ({ children }) => {
  const location = useLocation();

  return (
    <LoadingProvider>
      <PageTransition location={location.pathname}>
        {children}
      </PageTransition>
      
      {/* Global Loaders */}
      <Loader mode="checkout" />
      <Loader mode="order" />
      <PaymentLoader />
    </LoadingProvider>
  );
};

export default AppWithLoading;
