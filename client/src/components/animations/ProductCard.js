// src/components/animations/ProductCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ProductCard = ({ product, onAddToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  
  const handleAddToCart = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowRipple(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      setShowRipple(false);
      onAddToCart(product);
    }, 800);
  };

  return (
    <motion.div 
      className="product-card"
      initial={false}
      whileHover={{ 
        y: -10,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }}
    >
      <motion.div 
        className="product-image-container"
        whileHover={{ scale: 1.05 }}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
      </motion.div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <motion.p 
          className="product-price"
          whileHover={{ color: "#ff7a00" }}
        >
          ₹{product.price}
        </motion.p>
        
        <motion.button
          onClick={handleAddToCart}
          className="add-to-cart-button relative overflow-hidden"
          whileTap={{ scale: 0.95 }}
          whileHover={{ 
            backgroundColor: "#ff7a00",
            color: "white"
          }}
        >
          Add to Cart
          {showRipple && (
            <motion.span 
              className="absolute inset-0 bg-white opacity-30"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: 2, 
                opacity: 0 
              }}
              transition={{ duration: 0.6 }}
            />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Product Grid Component
export const ProductGrid = ({ products }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="product-grid"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id} 
          variants={itemVariants}
          custom={i}
        >
          <ProductCard 
            product={product} 
            onAddToCart={() => {}} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
