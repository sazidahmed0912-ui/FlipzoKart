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
      
      // Check if we're at the home page
      if (historyRef.current.length <= 2) {
        callback();
      } else {
        // Allow normal back navigation
        historyRef.current.pop();
        window.history.back();
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
  const lastBackPress = useRef(0);
  
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
      
      const now = Date.now();
      const timeSinceLastBack = now - lastBackPress.current;
      
      // Check if we're at the home page
      if (historyRef.current.length <= 2 || router.pathname === '/') {
        if (timeSinceLastBack < 2000) {
          // Double back detected - allow exit
          callback();
        } else {
          // First back - show warning
          lastBackPress.current = now;
          showExitWarning();
          
          // Prevent immediate exit
          window.history.pushState(null, '', window.location.pathname);
        }
      } else {
        // Allow normal back navigation
        historyRef.current.pop();
        router.back();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, callback]);
};

const showExitWarning = () => {
  // Create a toast/notification instead of alert for better UX
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    animation: slideUp 0.3s ease;
  `;
  toast.textContent = 'Press back again to exit';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translate(-50%, 100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 300);
  }, 2000);
};
