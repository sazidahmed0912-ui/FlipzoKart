import React, { useState, useEffect } from 'react';
import { usePageTransition } from '../../context/LoadingContext';
import { PageTransitionLoader } from './PremiumLoader';

const PageTransition = ({ 
  children, 
  loadingMessage = 'Loading...',
  timeout = 800,
  color = '#ff7a00'
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const { startPageTransition, stopPageTransition, isLoading } = usePageTransition();

  useEffect(() => {
    if (isLoading) {
      // Start transition
      setShowContent(false);
      setIsTransitioning(true);
      
      // Show loader after content fades out
      const loaderTimeout = setTimeout(() => {
        // Loader is shown by the global overlay
      }, 200);
      
      // Auto-stop after timeout
      const stopTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setShowContent(true);
        stopPageTransition();
      }, timeout);

      return () => {
        clearTimeout(loaderTimeout);
        clearTimeout(stopTimeout);
      };
    }
  }, [isLoading, timeout, stopPageTransition]);

  const startTransition = (message = loadingMessage) => {
    startPageTransition(message, { timeout });
  };

  return (
    <div className="page-transition-wrapper">
      {/* Content with fade animation */}
      <div className={`page-transition-content ${showContent ? 'show' : 'hide'}`}>
        {children}
      </div>
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="page-transition-overlay">
          <PageTransitionLoader message={loadingMessage} color={color} />
        </div>
      )}
    </div>
  );
};

export default PageTransition;
