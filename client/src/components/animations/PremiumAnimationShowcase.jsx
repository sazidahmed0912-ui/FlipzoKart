import React from 'react';
import { PageTransition } from './components/animations';
import { HeroSection } from './components/animations';
import { ProductCard } from './components/animations';
import { CartSystem } from './components/animations';
import { CheckoutFlow } from './components/animations';
import { MicroInteractions } from './components/animations';
import { PremiumLoader } from './components/animations';
import { ResponsiveCarousel } from './components/animations';
import { ToastNotification, ToastContainer, useToast } from './components/animations';
import { FloatingElements } from './components/animations';

// Example usage component demonstrating all premium animations
const PremiumAnimationShowcase = () => {
  const { addToast } = useToast();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 299,
      image: '/api/placeholder/1',
      category: 'Electronics',
      description: 'High-quality wireless headphones with premium sound',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      originalPrice: 399,
      discount: 25
    },
    {
      id: 2,
      name: 'Luxury Watch',
      price: 599,
      image: '/api/placeholder/2',
      category: 'Accessories',
      description: 'Elegant timepiece with premium materials',
      rating: 4.8,
      reviews: 89,
      isNew: false,
      originalPrice: 799,
      discount: 25
    },
    {
      id: 3,
      name: 'Designer Bag',
      price: 449,
      image: '/api/placeholder/3',
      category: 'Fashion',
      description: 'Stylish handbag with premium leather',
      rating: 4.6,
      reviews: 156,
      isNew: true,
      originalPrice: 599,
      discount: 25
    }
  ];

  const carouselItems = [
    <HeroSection key="hero" />,
    <MicroInteractions key="micro" />,
    <div key="products" className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onAddToCart={(product) => {
            addToast(`${product.name} added to cart!`, 'success');
          }}
        />
      ))}
    </div>,
    <FloatingElements key="floating" />
  ];

  const handleAddToCart = (product) => {
    // Add to cart logic
    console.log('Added to cart:', product);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = () => {
    addToast('Order completed successfully!', 'success');
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTransition>
        <div className="space-y-8">
          {/* Cart Icon */}
          <div className="fixed top-4 right-4 z-50">
            <CartSystem
              items={products}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onRemoveItem={(id) => {
                addToast('Item removed from cart', 'info');
              }}
              onUpdateQuantity={(id, quantity) => {
                addToast('Cart updated', 'info');
              }}
              onCheckout={handleCheckout}
            />
          </div>

          {/* Checkout Flow */}
          <CheckoutFlow
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onComplete={handleCompleteOrder}
            currentStep="shipping"
            onStepChange={(step) => console.log('Step changed to:', step)}
          />

          {/* Main Content */}
          <ResponsiveCarousel items={carouselItems} />

          {/* Loading Overlay */}
          {isLoading && (
            <PremiumLoader
              type="spinner"
              message="Processing your request..."
              fullScreen={true}
              showProgress={true}
              progress={75}
            />
          )}

          {/* Toast Notifications */}
          <ToastContainer />
        </div>
      </PageTransition>
    </div>
  );
};

export default PremiumAnimationShowcase;
