// src/components/examples/LoadingIntegrationExample.jsx
import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import { AddToCartButton } from '../ui';

// Example Product Card with Loading Integration
const ProductCard = ({ product }) => {
  const { startCheckout, startPayment, startOrder } = useLoading();

  const handleAddToCart = async (product) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Added to cart:', product);
  };

  const handleCheckout = async () => {
    try {
      startCheckout();
      // Simulate checkout preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to checkout page
      window.location.href = '/checkout';
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handlePayment = async () => {
    try {
      startPayment(1);
      // Payment processing will be handled by PaymentLoader component
      await new Promise(resolve => setTimeout(resolve, 8000));
      console.log('Payment completed');
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleOrder = async () => {
    try {
      startOrder();
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Order placed');
      // Navigate to success page
      window.location.href = '/order-success';
    } catch (error) {
      console.error('Order error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">₹{product.price}</p>
      
      <div className="space-y-3">
        <AddToCartButton 
          product={product}
          onAddToCart={handleAddToCart}
          className="w-full"
        />
        
        <button
          onClick={handleCheckout}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </button>
        
        <button
          onClick={handlePayment}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Pay Now
        </button>
        
        <button
          onClick={handleOrder}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

// Example App Integration
const AppExample = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your app header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Premium E-Commerce</h1>
        </div>
      </header>

      {/* Your app content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product cards will go here */}
          <ProductCard 
            product={{
              id: 1,
              name: 'Premium Product',
              price: 999,
              image: '/product-image.jpg'
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default AppExample;
