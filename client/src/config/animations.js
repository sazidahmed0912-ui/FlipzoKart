// src/config/animations.js
export const animationConfig = {
  // Timing defaults
  fast: 0.2,
  medium: 0.4,
  slow: 0.6,
  
  // Easing curves
  easeStandard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  easeDecelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  easeAccelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
  easeSharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
  
  // Spring physics
  springDefault: {
    type: "spring",
    stiffness: 300,
    damping: 20
  },
  springBouncy: {
    type: "spring",
    stiffness: 400,
    damping: 10
  },
  springSmooth: {
    type: "spring",
    stiffness: 200,
    damping: 30
  },
  
  // Component-specific config
  pageTransition: {
    duration: 0.6,
    ease: "easeInOut"
  },
  button: {
    hoverScale: 1.05,
    tapScale: 0.98,
    transition: 0.15
  },
  card: {
    hoverLift: 10, // pixels
    shadowIntensity: "0 15px 30px rgba(0,0,0,0.1)",
    transition: 0.3
  },
  toast: {
    duration: 0.4,
    displayTime: 3000 // ms
  }
};

// Helper function for staggered animations
export const getStaggerConfig = (index = 0, stagger = 0.1) => ({
  delay: index * stagger,
  duration: 0.6,
  ease: "back.out"
});
