import { useEffect, useRef } from 'react';

// WebView Bridge for Android apps
export const WebViewBridge = ({ children }) => {
  const bridgeRef = useRef(null);

  useEffect(() => {
    // Initialize WebView bridge
    if (typeof window !== 'undefined' && window.AndroidWebView) {
      bridgeRef.current = window.AndroidWebView;
      
      // Register back handler for WebView
      const handleBackPress = () => {
        // Send message to native Android
        if (bridgeRef.current && bridgeRef.current.handleBackPress) {
          bridgeRef.current.handleBackPress();
        }
        return true; // Prevent default back behavior
      };

      // Register with WebView
      if (bridgeRef.current.registerBackHandler) {
        bridgeRef.current.registerBackHandler(handleBackPress);
      }
    }

    // Handle browser back button
    const handleBrowserBack = (event) => {
      event.preventDefault();
      
      // Check if we're in WebView
      if (bridgeRef.current) {
        bridgeRef.current.handleBackPress();
      } else {
        // Browser behavior - let the app handle it
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleBrowserBack);
    
    return () => {
      window.removeEventListener('popstate', handleBrowserBack);
      
      // Cleanup WebView bridge
      if (bridgeRef.current && bridgeRef.current.unregisterBackHandler) {
        bridgeRef.current.unregisterBackHandler();
      }
    };
  }, []);

  return children;
};

// Android WebView JavaScript Interface
export const AndroidWebViewInterface = `
// Add this to your Android WebView setup
webView.addJavascriptInterface(new Object() {
    @JavascriptInterface
    public void handleBackPress() {
        runOnUiThread(() -> {
            if (doubleBackToExitPressedOnce) {
                finish(); // Exit the app
                return;
            }
            
            this.doubleBackToExitPressedOnce = true;
            Toast.makeText(MainActivity.this, "Press back again to exit", Toast.LENGTH_SHORT).show();
            
            new Handler().postDelayed(() -> {
                doubleBackToExitPressedOnce = false;
            }, 2000);
        });
    }
    
    public void registerBackHandler(Function handler) {
        // Store handler reference
    }
    
    public void unregisterBackHandler() {
        // Cleanup handler
    }
}, "AndroidWebView");
`;
