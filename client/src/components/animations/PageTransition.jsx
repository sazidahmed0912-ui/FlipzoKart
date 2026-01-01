import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '../config/premium-animations';

const PageTransition = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location?.pathname || window.location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
