import React from 'react';
import { motion } from 'framer-motion';
import { 
  floatingAnimation,
  glowEffect,
  animationConfig 
} from '../../config/premium-animations';

const FloatingElements = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full opacity-30"
        variants={floatingAnimation}
        animate="animate"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      <motion.div
        className="absolute top-40 right-32 w-24 h-24 bg-orange-300 rounded-full opacity-40"
        variants={floatingAnimation}
        animate="animate"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-orange-100 rounded-full opacity-20"
        variants={floatingAnimation}
        animate="animate"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Glow Effects */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
        variants={glowEffect}
        animate="animate"
        style={{
          willChange: 'filter, box-shadow',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Animated Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r="1"
              fill="rgba(255, 122, 0, 0.1)"
            >
              <motion.circle
                cx="20"
                cy="20"
                r="1"
                fill="rgba(255, 122, 0, 0.3)"
                animate={{
                  r: [1, 2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: animationConfig.ease.luxury
                }}
              />
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationConfig.duration.slow }}
        >
          <h1 className="text-6xl font-bold text-gray-900">Premium Animations</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Experience ultra-smooth, luxury-grade animations that run at 120fps
          </p>
          
          <motion.div
            className="flex space-x-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 122, 0, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            >
              Get Started
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 122, 0, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: animationConfig.duration.fast }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingElements;
