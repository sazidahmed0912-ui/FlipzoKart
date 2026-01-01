// src/components/animations/HeroAnimation.js
import React from 'react';
import { motion } from 'framer-motion';

export const HeroAnimation = ({ children }) => {
  const staggerVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };

  return (
    <div className="hero-section">
      {React.Children.map(children, (child, i) => {
        if (typeof child === 'string') {
          return (
            <motion.div
              key={i}
              variants={staggerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="hero-text-block"
            >
              {child.split('').map((char, j) => (
                <motion.span
                  key={j}
                  variants={staggerVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: (i * 0.1) + (j * 0.02), duration: 0.4 }}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
          );
        }
        return React.cloneElement(child, { 
          as: motion.div,
          variants: staggerVariants,
          initial: "initial",
          animate: "animate",
          transition: { delay: i * 0.1, duration: 0.6 }
        });
      })}
    </div>
  );
};

// CTA Button Component
export const CTAButton = ({ children, primary = false }) => {
  return (
    <motion.button
      className={`cta-button relative overflow-hidden ${primary ? 'primary' : ''}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 122, 0, 0.5)"
      }}
      whileTap={{ scale: 0.98 }}
      animate={primary ? {
        scale: [1, 1.03, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    >
      {children}
      <motion.span 
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};
