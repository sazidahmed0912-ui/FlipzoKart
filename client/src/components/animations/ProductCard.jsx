import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  productCard, 
  buttonHover, 
  addToCartSuccess,
  priceHighlight,
  animationConfig 
} from '../../config/premium-animations';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  className = '',
  index = 0 
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdded(true);
    await onAddToCart(product);
    
    // Reset animation after completion
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
      variants={productCard}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{
        willChange: 'transform, box-shadow',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          whileHover={{ scale: 1.1 }}
          transition={{
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.luxury
          }}
        />
        
        {/* Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Product Badge */}
        {product.isNew && (
          <motion.div
            className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              duration: animationConfig.duration.fast,
              ease: animationConfig.ease.bouncy
            }}
          >
            NEW
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="absolute top-4 right-4 flex flex-col space-y-2"
          initial={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: animationConfig.duration.fast }}
        >
          <motion.button
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
          <motion.button
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <motion.div
          className="text-xs font-medium text-orange-500 uppercase tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          {product.category}
        </motion.div>

        {/* Product Name */}
        <motion.h3
          className="text-lg font-semibold text-gray-900 line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.05 }}
        >
          {product.name}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-sm text-gray-600 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.05 }}
        >
          {product.description}
        </motion.p>

        {/* Rating */}
        <motion.div
          className="flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.05 }}
        >
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating ? 'text-orange-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </motion.div>

        {/* Price */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
        >
          <div className="flex items-center space-x-2">
            <motion.span
              className="text-2xl font-bold text-gray-900"
              variants={priceHighlight}
              animate="animate"
            >
              ${product.price}
            </motion.span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <motion.div
              className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.6 + index * 0.05,
                ease: animationConfig.ease.bouncy
              }}
            >
              -{product.discount}%
            </motion.div>
          )}
        </motion.div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-300 relative overflow-hidden"
          variants={buttonHover}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          disabled={isAdded}
          style={{
            willChange: 'transform, box-shadow',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="success"
                variants={addToCartSuccess}
                initial="initial"
                animate="animate"
                className="flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Added!</span>
              </motion.div>
            ) : (
              <motion.div
                key="button"
                className="flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{
              scale: [0, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 0.6,
              ease: animationConfig.ease.luxury
            }}
          />
        </motion.button>
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
};

export default ProductCard;
