import { motion } from 'framer-motion';

// Global animation configuration for consistent timing and feel
export const animationConfig = {
  // Timing constants (optimized for 120fps)
  duration: {
    fast: 0.2,    // 200ms
    normal: 0.3,  // 300ms
    slow: 0.5,    // 500ms
    slower: 0.8   // 800ms
  },
  
  // Easing functions for premium feel
  ease: {
    smooth: [0.4, 0, 0.2, 1],           // Default smooth
    bouncy: [0.68, -0.55, 0.265, 1.55], // Bouncy for CTAs
    luxury: [0.25, 0.46, 0.45, 0.94],   // Luxury smooth
    sharp: [0.4, 0, 0.6, 1],             // Quick transitions
    elastic: [0.68, -0.6, 0.32, 1.6]     // Elastic for special effects
  },
  
  // Stagger delays for sequential animations
  stagger: {
    fast: 0.05,   // 50ms between items
    normal: 0.1,  // 100ms between items
    slow: 0.15    // 150ms between items
  },
  
  // Transform values for hardware acceleration
  transforms: {
    subtle: { y: -5, scale: 1.02 },
    noticeable: { y: -10, scale: 1.05 },
    dramatic: { y: -20, scale: 1.1 },
    slideIn: { x: -50, opacity: 0 },
    fadeIn: { opacity: 0 },
    scaleIn: { scale: 0.8, opacity: 0 }
  }
};

// Page transition variants
export const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.luxury
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.sharp
    }
  }
};

// Hero text reveal variants
export const heroTextReveal = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.slow,
      ease: animationConfig.ease.luxury
    }
  }
};

// Staggered text animation for hero section
export const staggeredTextContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: animationConfig.stagger.fast,
      delayChildren: animationConfig.duration.fast
    }
  }
};

// Individual letter animation
export const letterReveal = {
  initial: { 
    opacity: 0, 
    y: 50,
    rotateX: -90
  },
  animate: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.bouncy
    }
  }
};

// Product card hover variants
export const productCard = {
  initial: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    scale: 1.05, 
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.luxury
    }
  }
};

// Button hover variants
export const buttonHover = {
  initial: { 
    scale: 1, 
    boxShadow: '0 4px 6px -1px rgba(255, 122, 0, 0.3)'
  },
  hover: { 
    scale: 1.05, 
    boxShadow: '0 0 20px rgba(255, 122, 0, 0.4)',
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.bouncy
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.sharp
    }
  }
};

// Cart icon bounce animation
export const cartBounce = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.bouncy
    }
  }
};

// Add to cart success animation
export const addToCartSuccess = {
  initial: { 
    scale: 0, 
    opacity: 0,
    rotate: -180
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    rotate: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.elastic
    }
  }
};

// Modal slide-in animation
export const modalSlideIn = {
  initial: { 
    opacity: 0, 
    y: 100,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.luxury
    }
  },
  exit: { 
    opacity: 0, 
    y: 100,
    scale: 0.9,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.sharp
    }
  }
};

// Loading spinner animation
export const loadingSpinner = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Pulse animation for CTAs
export const pulseAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: animationConfig.ease.luxury,
      repeat: Infinity
    }
  }
};

// Price highlight animation
export const priceHighlight = {
  initial: { color: '#1f2937' },
  animate: { 
    color: ['#1f2937', '#ff7a00', '#1f2937'],
    transition: {
      duration: animationConfig.duration.slow,
      ease: animationConfig.ease.luxury
    }
  }
};

// Toast notification slide
export const toastSlide = {
  initial: { 
    x: 300, 
    opacity: 0,
    scale: 0.8
  },
  animate: { 
    x: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.luxury
    }
  },
  exit: { 
    x: 300, 
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.sharp
    }
  }
};

// Input focus animation
export const inputFocus = {
  initial: { 
    borderColor: '#d1d5db',
    boxShadow: '0 0 0 0px rgba(255, 122, 0, 0)'
  },
  focus: { 
    borderColor: '#ff7a00',
    boxShadow: '0 0 0 3px rgba(255, 122, 0, 0.1)',
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.luxury
    }
  }
};

// Checkbox animation
export const checkboxAnimation = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.bouncy
    }
  }
};

// Parallax scroll effect
export const parallaxEffect = {
  initial: { y: 0 },
  whileInView: { 
    y: [-50, 50],
    transition: {
      duration: 1,
      ease: animationConfig.ease.luxury
    }
  }
};

// Carousel slide animation
export const carouselSlide = {
  initial: { 
    x: 100, 
    opacity: 0,
    scale: 0.8
  },
  animate: { 
    x: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.luxury
    }
  },
  exit: { 
    x: -100, 
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.sharp
    }
  }
};

// Floating animation for special elements
export const floatingAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10],
    transition: {
      duration: 3,
      ease: animationConfig.ease.luxury,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Glow effect for premium elements
export const glowEffect = {
  initial: { 
    filter: 'brightness(1)',
    boxShadow: '0 0 0px rgba(255, 122, 0, 0)'
  },
  animate: { 
    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
    boxShadow: [
      '0 0 0px rgba(255, 122, 0, 0)',
      '0 0 20px rgba(255, 122, 0, 0.3)',
      '0 0 0px rgba(255, 122, 0, 0)'
    ],
    transition: {
      duration: 2,
      ease: animationConfig.ease.luxury,
      repeat: Infinity
    }
  }
};

// Responsive animation variants
export const responsiveAnimation = {
  mobile: {
    duration: animationConfig.duration.fast,
    ease: animationConfig.ease.sharp
  },
  tablet: {
    duration: animationConfig.duration.normal,
    ease: animationConfig.ease.luxury
  },
  desktop: {
    duration: animationConfig.duration.normal,
    ease: animationConfig.ease.luxury
  }
};

// Hardware-accelerated transform utility
export const hardwareAccelerated = {
  transform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  perspective: 1000
};

export default animationConfig;
