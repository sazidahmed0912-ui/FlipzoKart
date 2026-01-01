import React from 'react';
import { motion } from 'framer-motion';
import { 
  AddToCartButton, 
  ProceedToCheckoutButton, 
  PlaceOrderButton,
  useLoading 
} from '../components/ui/loading-index';

const LoadingSystemExample = () => {
  const { 
    showGlobalLoader, 
    hideGlobalLoader, 
    showPageLoader, 
    hidePageLoader,
    showPaymentLoader,
    hidePaymentLoader,
    updatePaymentStep,
    withLoading
  } = useLoading();

  const handleAddToCart = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Product added to cart!');
  };

  const handleCheckout = async () => {
    // Simulate checkout preparation
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Checkout prepared!');
  };

  const handlePlaceOrder = async () => {
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log('Order placed!');
  };

  const handlePaymentFlow = async () => {
    showPaymentLoader('initializing');
    
    // Simulate payment steps
    await new Promise(resolve => setTimeout(resolve, 2000));
    updatePaymentStep('processing');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    updatePaymentStep('redirecting');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    updatePaymentStep('verifying');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    hidePaymentLoader();
    
    console.log('Payment completed!');
  };

  const handleWithLoading = async () => {
    await withLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Operation completed with loading!');
      },
      { type: 'global', message: 'Processing your request...' }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Loading System Examples
          </h1>

          <div className="space-y-8">
            {/* Add to Cart Button */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add to Cart Button
              </h2>
              <p className="text-gray-600">
                Shows loading state with dots animation and disables button during operation.
              </p>
              <AddToCartButton onClick={handleAddToCart}>
                Add to Cart
              </AddToCartButton>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Proceed to Checkout Button
              </h2>
              <p className="text-gray-600">
                Shows global loader overlay with preparation message.
              </p>
              <ProceedToCheckoutButton onClick={handleCheckout}>
                Proceed to Checkout
              </ProceedToCheckoutButton>
            </div>

            {/* Place Order Button */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Place Order Button
              </h2>
              <p className="text-gray-600">
                Shows global loader with order processing message.
              </p>
              <PlaceOrderButton onClick={handlePlaceOrder}>
                Place Order
              </PlaceOrderButton>
            </div>

            {/* Payment Flow */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Payment Processing Flow
              </h2>
              <p className="text-gray-600">
                Multi-step payment loader with progress indicator.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePaymentFlow}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Payment Flow
              </motion.button>
            </div>

            {/* Manual Loading Controls */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Manual Loading Controls
              </h2>
              <p className="text-gray-600">
                Direct access to loading methods for custom implementations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    showGlobalLoader('Custom global loading...');
                    setTimeout(hideGlobalLoader, 2000);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Global Loader
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    showPageLoader();
                    setTimeout(hidePageLoader, 2000);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Page Loader
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWithLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  With Loading Helper
                </motion.button>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Features Implemented
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">✅ Core Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Global loading state management</li>
                    <li>• Page transition loading</li>
                    <li>• Action-based button loaders</li>
                    <li>• Payment processing flow</li>
                    <li>• Context-based state management</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">✅ Design Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Luxury brand color (#ff7a00)</li>
                    <li>• Smooth animations (300-500ms)</li>
                    <li>• No flicker transitions</li>
                    <li>• Professional micro-interactions</li>
                    <li>• Accessibility compliant</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">✅ Technical Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• React Context API</li>
                    <li>• Framer Motion animations</li>
                    <li>• TypeScript ready</li>
                    <li>• Reusable components</li>
                    <li>• No duplicated logic</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">✅ Loading Types</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Spinner animation</li>
                    <li>• Dots animation</li>
                    <li>• Pulse animation</li>
                    <li>• Bars animation</li>
                    <li>• Custom brand styling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSystemExample;
