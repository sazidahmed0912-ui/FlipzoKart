import React from 'react';
import { motion } from 'framer-motion';
import { 
  staggeredTextContainer, 
  letterReveal, 
  heroTextReveal,
  animationConfig 
} from '../../config/premium-animations';

const HeroSection = ({ title, subtitle, ctaText, onCtaClick }) => {
  // Split text into individual letters for staggered animation
  const splitText = (text) => {
    return text.split('').map((letter, index) => (
      <motion.span
        key={index}
        variants={letterReveal}
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2, opacity: 0.3 }}
        animate={{ 
          scale: [1.2, 1.1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: animationConfig.ease.luxury
        }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-100 rounded-full filter blur-2xl" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={staggeredTextContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            variants={heroTextReveal}
          >
            <div className="space-y-2">
              <div className="text-orange-500">
                {splitText('DISCOVER')}
              </div>
              <div className="text-gray-800">
                {splitText('PREMIUM')}
              </div>
              <div className="text-gray-700">
                {splitText('QUALITY')}
              </div>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            variants={heroTextReveal}
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            Experience luxury shopping with our premium collection of carefully curated products
            designed for the modern lifestyle.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={heroTextReveal}
            className="pt-8"
          >
            <motion.button
              onClick={onCtaClick}
              className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-orange-500 rounded-full shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Button Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: animationConfig.ease.luxury
                }}
              />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center space-x-3">
                <span>{ctaText || 'Shop Now'}</span>
                <motion.svg
                  className="w-5 h-5"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: animationConfig.ease.luxury
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>

              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white opacity-0"
                whileHover={{
                  scale: [1, 1.2, 1.4],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 0.6,
                  ease: animationConfig.ease.luxury
                }}
              />
            </motion.button>
          </motion.div>

          {/* Additional CTAs */}
          <motion.div
            variants={heroTextReveal}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.a
              href="#products"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Collection
            </motion.a>
            <motion.a
              href="#about"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: animationConfig.ease.luxury
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-12 h-12 bg-orange-300 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: animationConfig.ease.luxury
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: animationConfig.ease.luxury
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-gray-400 text-sm">Scroll</span>
          <motion.div
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          >
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full"
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: animationConfig.ease.luxury
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
