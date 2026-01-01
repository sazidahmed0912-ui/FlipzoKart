import React from 'react';
import { useButtonLoading } from '../../context/LoadingContext';
import { ButtonLoader } from './PremiumLoader';

const LoadingButton = ({ 
  children, 
  onClick, 
  loadingMessage = 'Loading...',
  loading = false,
  disabled = false,
  color = '#ff7a00',
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const { startLoading, stopLoading, isLoading: contextLoading } = useButtonLoading();
  const [internalLoading, setInternalLoading] = useState(false);
  
  const isActuallyLoading = loading || contextLoading || internalLoading;
  const isDisabled = disabled || isActuallyLoading;

  const handleClick = async (e) => {
    if (isDisabled) return;
    
    try {
      setInternalLoading(true);
      
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const baseClasses = {
    primary: `bg-gradient-to-r from-[#ff7a00] to-[#ff8800] text-white hover:from-[#ff6600] hover:to-[#ff7700] disabled:from-gray-400 disabled:to-gray-500`,
    secondary: `bg-white text-[#ff7a00] border-2 border-[#ff7a00] hover:bg-[#ff7a00] hover:text-white disabled:border-gray-300 disabled:text-gray-400`,
    outline: `bg-transparent text-[#ff7a00] border-2 border-[#ff7a00] hover:bg-[#ff7a00] hover:text-white disabled:border-gray-300 disabled:text-gray-400`,
    ghost: `bg-transparent text-[#ff7a00] hover:bg-[#ff7a00]/10 disabled:text-gray-400`
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const classes = `
    loading-button
    ${baseClasses[variant] || baseClasses.primary}
    ${sizeClasses[size] || sizeClasses.medium}
    ${className}
    relative
    inline-flex
    items-center
    justify-center
    font-semibold
    rounded-lg
    transition-all
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-[#ff7a00]/50
    disabled:cursor-not-allowed
    disabled:opacity-50
    transform
    hover:scale-105
    active:scale-95
  `.trim();

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      <ButtonLoader loading={isActuallyLoading} color={color} size={size}>
        {children}
      </ButtonLoader>
    </button>
  );
};

// Add to Cart Button - Specialized version
export const AddToCartButton = ({ 
  product, 
  onAddToCart, 
  color = '#ff7a00',
  className = '',
  ...props 
}) => {
  const { startCartLoading, stopCartLoading } = useCartLoading();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      startCartLoading('Adding to cart...');
      
      if (onAddToCart) {
        await onAddToCart(product);
      }
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
      stopCartLoading();
    }
  };

  return (
    <LoadingButton
      onClick={handleAddToCart}
      loading={loading}
      loadingMessage="Adding..."
      color={color}
      variant="primary"
      size="medium"
      className={`w-full ${className}`}
      {...props}
    >
      🛒 Add to Cart
    </LoadingButton>
  );
};

// Proceed to Checkout Button
export const ProceedToCheckoutButton = ({ 
  onCheckout, 
  color = '#ff7a00',
  className = '',
  ...props 
}) => {
  const { startCheckoutLoading, stopCheckoutLoading } = useCheckoutLoading();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      startCheckoutLoading('Preparing secure checkout...');
      
      if (onCheckout) {
        await onCheckout();
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
      stopCheckoutLoading();
    }
  };

  return (
    <LoadingButton
      onClick={handleCheckout}
      loading={loading}
      loadingMessage="Preparing..."
      color={color}
      variant="primary"
      size="large"
      className={`w-full ${className}`}
      {...props}
    >
      🚀 Proceed to Checkout
    </LoadingButton>
  );
};

// Payment Button
export const PaymentButton = ({ 
  onPayment, 
  color = '#ff7a00',
  className = '',
  ...props 
}) => {
  const { startPaymentLoading, stopPaymentLoading } = usePaymentLoading();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      startPaymentLoading('Initializing payment...');
      
      if (onPayment) {
        await onPayment();
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
      stopPaymentLoading();
    }
  };

  return (
    <LoadingButton
      onClick={handlePayment}
      loading={loading}
      loadingMessage="Processing..."
      color={color}
      variant="primary"
      size="large"
      className={`w-full ${className}`}
      {...props}
    >
      💳 Pay Now
    </LoadingButton>
  );
};

// Place Order Button
export const PlaceOrderButton = ({ 
  onPlaceOrder, 
  color = '#ff7a00',
  className = '',
  ...props 
}) => {
  const { startOrderLoading, stopOrderLoading } = useOrderLoading();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      startOrderLoading('Placing order...');
      
      if (onPlaceOrder) {
        await onPlaceOrder();
      }
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setLoading(false);
      stopOrderLoading();
    }
  };

  return (
    <LoadingButton
      onClick={handlePlaceOrder}
      loading={loading}
      loadingMessage="Placing..."
      color={color}
      variant="primary"
      size="large"
      className={`w-full ${className}`}
      {...props}
    >
      📦 Place Order
    </LoadingButton>
  );
};

export default LoadingButton;
