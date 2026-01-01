// src/context/AnimationContext.js
import React, { createContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animationState, setAnimationState] = useState({
    pageTransitionType: 'fade',
    animationSpeed: 0.3,
    isAnimating: false
  });

  const pageTransitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 }
    }
  };

  return (
    <AnimationContext.Provider value={{ animationState, setAnimationState }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={window.location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransitionVariants[animationState.pageTransitionType]}
          transition={{ duration: animationState.animationSpeed, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AnimationContext.Provider>
  );
};
