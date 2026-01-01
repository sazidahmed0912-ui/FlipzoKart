// src/components/ui/PaymentLoader.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';

const PaymentLoader = () => {
  const { loadingState, startPayment, stopPayment } = useLoading();
  const isLoading = loadingState.payment;
  const currentStep = loadingState.paymentStep || 0;
  const intervalRef = useRef(null);

  const paymentSteps = [
    { title: 'Initializing payment...', duration: 1500 },
    { title: 'Redirecting to gateway...', duration: 2000 },
    { title: 'Verifying payment...', duration: 2500 },
    { title: 'Processing payment...', duration: 2000 }
  ];

  useEffect(() => {
    if (isLoading) {
      let stepIndex = currentStep - 1;
      
      const runStep = () => {
        if (stepIndex < paymentSteps.length - 1) {
          stepIndex++;
          startPayment(stepIndex + 1);
        }
      };

      if (stepIndex >= 0 && stepIndex < paymentSteps.length) {
        const currentStepData = paymentSteps[stepIndex];
        intervalRef.current = setTimeout(runStep, currentStepData.duration);
      }
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isLoading, currentStep, startPayment]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label="Payment Processing"
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Payment Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          className="text-center mb-6"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paymentSteps[currentStep - 1]?.title || 'Processing payment...'}
          </h3>
          <p className="text-gray-600 text-sm">
            Please wait while we process your payment securely
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {paymentSteps.map((_, index) => (
            <React.Fragment key={index}>
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  index < currentStep 
                    ? 'bg-orange-500' 
                    : index === currentStep - 1 
                      ? 'bg-orange-500' 
                      : 'bg-gray-300'
                }`}
                animate={{
                  scale: index === currentStep - 1 ? [1, 1.3, 1] : 1,
                  transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                }}
              />
              {index < paymentSteps.length - 1 && (
                <motion.div
                  className={`w-8 h-1 ${
                    index < currentStep - 1 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < currentStep - 1 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Security Badge */}
        <motion.div
          className="flex items-center justify-center gap-2 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secured by 256-bit encryption</span>
        </motion.div>

        {/* Prevent navigation */}
        <div className="sr-only" role="status" aria-live="polite">
          Payment processing step {currentStep} of {paymentSteps.length}: {paymentSteps[currentStep - 1]?.title}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentLoader;
