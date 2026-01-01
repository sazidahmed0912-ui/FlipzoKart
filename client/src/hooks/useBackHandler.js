import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useLocation } from 'react-router-dom';

// For React Router (if using React)
export const useBackHandler = (callback) => {
  const location = useLocation();
  const historyRef = useRef([]);
  
  useEffect(() => {
    // Track navigation history
    historyRef.current.push(location.pathname);
    
    // Keep only last 10 entries
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10);
    }
  }, [location]);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      
      // Check if we can go back in history
      if (window.history.length > 1) {
        // Navigate to previous page
        window.history.back();
        historyRef.current.pop();
      } else {
        // No history to go back to - trigger callback for exit
        callback();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [callback]);
};

// For Next.js (if using Next.js)
export const useNextBackHandler = (callback) => {
  const router = useRouter();
  const historyRef = useRef([]);
  
  useEffect(() => {
    // Track navigation history
    const handleRouteChange = (url) => {
      historyRef.current.push(url);
      
      // Keep only last 10 entries
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      
      // Check if we can go back in history
      if (window.history.length > 1 || router.pathname !== '/') {
        // Navigate to previous page
        router.back();
        historyRef.current.pop();
      } else {
        // No history to go back to - trigger callback for exit
        callback();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, callback]);
};
