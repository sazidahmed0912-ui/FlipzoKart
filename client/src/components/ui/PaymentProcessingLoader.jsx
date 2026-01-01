import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const PaymentProcessingLoader = () => {
  const { paymentLoading, paymentStep } = useLoading();

  const paymentSteps = [
    { id: 'initializing', label: 'Initializing payment...', duration: 2000 },
    { id: 'processing', label: 'Processing payment...', duration: 3000 },
    { id: 'redirecting', label: 'Redirecting to payment gateway...', duration: 2000 },
    { id: 'verifying', label: 'Verifying payment...', duration: 3000 }
  ];

  const currentStepIndex = paymentSteps.findIndex(step => step.id === paymentStep);
  const currentStep = paymentSteps[currentStepIndex] || paymentSteps[0];

  return (
    <AnimatePresence>
      {paymentLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Logo/Brand */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>

              {/* Loading Animation */}
              <div className="space-y-4">
                <LoadingSpinner type="spinner" size="lg" color="primary" />
                
                {/* Current Step Message */}
                <motion.p
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-700 font-medium"
                >
                  {currentStep.label}
                </motion.p>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Step {currentStepIndex + 1} of {paymentSteps.length}</span>
                  <span>{Math.round(((currentStepIndex + 1) / paymentSteps.length) * 100)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-orange-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIndex + 1) / paymentSteps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Security Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center space-x-2 text-xs text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure payment processing</span>
              </motion.div>

              {/* Cancel Option */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => {
                  // Handle payment cancellation
                }}
              >
                Cancel payment
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentProcessingLoader;
