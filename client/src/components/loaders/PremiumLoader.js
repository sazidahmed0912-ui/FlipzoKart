import React from 'react';
import './PremiumLoader.css';

// Luxury brand loader component
const PremiumLoader = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showProgress = false, 
  progress = 0,
  color = '#ff7a00',
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const messageSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`premium-loader ${variant}`} data-size={size}>
      {/* Main loader animation */}
      <div className={`premium-loader-spinner ${sizeClasses[size]}`} style={{ '--brand-color': color }}>
        {/* Outer ring */}
        <div className="premium-loader-ring premium-loader-ring-outer"></div>
        {/* Middle ring */}
        <div className="premium-loader-ring premium-loader-ring-middle"></div>
        {/* Inner ring */}
        <div className="premium-loader-ring premium-loader-ring-inner"></div>
        {/* Center dot */}
        <div className="premium-loader-center"></div>
      </div>

      {/* Message */}
      {message && (
        <p className={`premium-loader-message ${messageSizes[size]}`} style={{ color: color }}>
          {message}
        </p>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="premium-loader-progress">
          <div 
            className="premium-loader-progress-bar" 
            style={{ 
              width: `${progress}%`,
              backgroundColor: color 
            }}
          />
        </div>
      )}
    </div>
  );
};

// Button loader component
export const ButtonLoader = ({ loading, children, color = '#ff7a00', size = 'small' }) => {
  return (
    <div className={`button-loader ${loading ? 'loading' : ''}`} data-size={size}>
      {loading ? (
        <div className="button-loader-content">
          <div className="button-loader-spinner" style={{ '--brand-color': color }}>
            <div className="button-loader-ring"></div>
            <div className="button-loader-ring button-loader-ring-2"></div>
          </div>
          <span className="button-loader-text">{children}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

// Page transition loader
export const PageTransitionLoader = ({ message = 'Loading...', color = '#ff7a00' }) => {
  return (
    <div className="page-transition-loader">
      <div className="page-transition-content">
        {/* Brand logo */}
        <div className="page-transition-logo" style={{ backgroundColor: color }}>
          <span className="page-transition-logo-text">F</span>
        </div>
        
        {/* Animated dots */}
        <div className="page-transition-dots">
          <div className="page-transition-dot" style={{ backgroundColor: color }}></div>
          <div className="page-transition-dot" style={{ backgroundColor: color }}></div>
          <div className="page-transition-dot" style={{ backgroundColor: color }}></div>
        </div>
        
        {/* Message */}
        <p className="page-transition-message" style={{ color: color }}>
          {message}
        </p>
      </div>
    </div>
  );
};

// Payment processing loader with steps
export const PaymentLoader = ({ currentStep = 1, color = '#ff7a00' }) => {
  const steps = [
    { id: 1, label: 'Initializing payment' },
    { id: 2, label: 'Connecting to gateway' },
    { id: 3, label: 'Verifying payment' }
  ];

  return (
    <div className="payment-loader">
      <div className="payment-loader-content">
        {/* Animated payment icon */}
        <div className="payment-loader-icon">
          <div className="payment-loader-card" style={{ backgroundColor: color }}>
            <div className="payment-loader-chip"></div>
          </div>
        </div>

        {/* Steps */}
        <div className="payment-loader-steps">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`payment-step ${currentStep > step.id ? 'completed' : currentStep === step.id ? 'active' : 'pending'}`}
            >
              <div className="payment-step-number" style={{ 
                backgroundColor: currentStep >= step.id ? color : '#e5e7eb',
                color: currentStep >= step.id ? '#ffffff' : '#9ca3af'
              }}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="payment-step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Progress line */}
        <div className="payment-progress-line">
          <div 
            className="payment-progress-fill" 
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              backgroundColor: color 
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Order placement loader
export const OrderLoader = ({ progress = 0, color = '#ff7a00' }) => {
  const orderSteps = [
    'Validating order details',
    'Processing payment',
    'Confirming inventory',
    'Generating order confirmation',
    'Sending confirmation email'
  ];

  const currentStep = Math.floor((progress / 100) * orderSteps.length);
  const currentStepMessage = orderSteps[Math.min(currentStep, orderSteps.length - 1)];

  return (
    <div className="order-loader">
      <div className="order-loader-content">
        {/* Animated box */}
        <div className="order-loader-box">
          <div className="order-loader-lid" style={{ backgroundColor: color }}>
            <div className="order-loader-handle"></div>
          </div>
          <div className="order-loader-body">
            <div className="order-loader-item" style={{ backgroundColor: color }}></div>
          </div>
        </div>

        {/* Progress */}
        <div className="order-loader-progress">
          <div className="order-progress-bar">
            <div 
              className="order-progress-fill" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: color 
              }}
            />
          </div>
          <span className="order-progress-text">{Math.round(progress)}%</span>
        </div>

        {/* Current step message */}
        <p className="order-step-message" style={{ color: color }}>
          {currentStepMessage}
        </p>
      </div>
    </div>
  );
};

// Minimal inline loader for buttons
export const InlineLoader = ({ color = '#ff7a00', size = 'small' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <div className={`inline-loader ${sizeClasses[size]}`} style={{ '--brand-color': color }}>
      <div className="inline-loader-dot"></div>
      <div className="inline-loader-dot"></div>
      <div className="inline-loader-dot"></div>
    </div>
  );
};

export default PremiumLoader;
