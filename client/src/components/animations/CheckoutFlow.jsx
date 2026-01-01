import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  buttonHover, 
  loadingSpinner,
  modalSlideIn,
  animationConfig 
} from '../../config/premium-animations';

const CheckoutFlow = ({ 
  currentStep, 
  onStepChange, 
  onComplete,
  onClose,
  isOpen 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = [
    { id: 'shipping', title: 'Shipping Information', icon: '📦' },
    { id: 'payment', title: 'Payment Method', icon: '💳' },
    { id: 'review', title: 'Review Order', icon: '👀' },
    { id: 'success', title: 'Order Complete!', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentStepIndex < steps.length - 1) {
      onStepChange(steps[currentStepIndex + 1].id);
    } else {
      await onComplete();
    }
    
    setIsProcessing(false);
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      onStepChange(steps[currentStepIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationConfig.duration.normal }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <motion.input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <motion.input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <motion.input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <motion.textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <motion.input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <motion.input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationConfig.duration.normal }}
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="text-sm text-gray-600">Secure payment powered by Stripe</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <motion.input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <motion.input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <motion.input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-orange-700">Your payment information is secure and encrypted</span>
              </div>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationConfig.duration.normal }}
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$299.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$25.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">$334.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Address:</span> {formData.address}</p>
                <p><span className="font-medium">City:</span> {formData.city}, {formData.zipCode}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700">Your order is ready to be processed</span>
              </div>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: animationConfig.duration.slow }}
          >
            <motion.div
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: animationConfig.ease.bouncy }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900">Order Complete!</h2>
            <p className="text-gray-600">Thank you for your purchase. You will receive a confirmation email shortly.</p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Order #ORD-{Date.now()}</p>
              <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
            </div>
            
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              variants={buttonHover}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Checkout Modal */}
          <motion.div
            className="fixed inset-x-4 inset-y-4 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            variants={modalSlideIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center p-6 bg-gray-50">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index <= currentStepIndex
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: animationConfig.duration.fast }}
                  >
                    <span className="text-sm font-bold">{step.icon}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={`w-16 h-1 mx-2 ${
                        index < currentStepIndex ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <motion.button
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0 || currentStep === 'success'}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: currentStepIndex > 0 ? 1.05 : 1 }}
                whileTap={{ scale: currentStepIndex > 0 ? 0.95 : 1 }}
              >
                Previous
              </motion.button>

              <motion.button
                onClick={handleNextStep}
                disabled={isProcessing || currentStep === 'success'}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                variants={buttonHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <motion.div
                        variants={loadingSpinner}
                        animate="animate"
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="button"
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span>
                        {currentStepIndex === steps.length - 1 ? 'Complete Order' : 'Next Step'}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutFlow;
