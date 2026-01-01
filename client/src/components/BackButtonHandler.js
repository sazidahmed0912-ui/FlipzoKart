import React, { useEffect } from 'react';
import { WebViewBridge } from './WebViewBridge';

// Wrapper component that handles back button behavior for all pages
const BackButtonHandler = ({ children }) => {
  useEffect(() => {
    // Initialize back button handling for the entire app
    let lastBackPress = 0;
    
    const handleBackButton = (event) => {
      event.preventDefault();
      
      const now = Date.now();
      const timeSinceLastBack = now - lastBackPress;
      
      if (timeSinceLastBack < 2000) {
        // Double back detected - allow exit
        if (window.AndroidWebView) {
          window.AndroidWebView.exitApp();
        } else {
          window.close();
          window.location.href = 'about:blank';
        }
      } else {
        // First back - show warning
        lastBackPress = now;
        showExitWarning();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    const showExitWarning = () => {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
      `;
      toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Press back again to exit
        </div>
      `;
      
      if (!document.querySelector('#back-handler-styles')) {
        const style = document.createElement('style');
        style.id = 'back-handler-styles';
        style.textContent = `
          @keyframes slideUp {
            from { 
              transform: translate(-50%, 100%); 
              opacity: 0; 
            }
            to { 
              transform: translate(-50%, 0); 
              opacity: 1; 
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 400);
      }, 2000);
    };

    // Add popstate listener
    window.addEventListener('popstate', handleBackButton);
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  return <WebViewBridge>{children}</WebViewBridge>;
};

export default BackButtonHandler;
