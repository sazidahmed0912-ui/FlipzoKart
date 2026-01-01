import React from 'react';
import { motion } from 'framer-motion';
import { 
  buttonHover, 
  inputFocus, 
  checkboxAnimation,
  animationConfig 
} from '../../config/premium-animations';

const MicroInteractions = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationConfig.duration.normal }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Premium Micro-Interactions</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Interactions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Button Interactions</h2>
              
              <div className="space-y-4">
                <motion.button
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium"
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    willChange: 'transform, box-shadow',
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  Primary Button
                </motion.button>

                <motion.button
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: animationConfig.duration.fast }}
                >
                  Secondary Button
                </motion.button>

                <motion.button
                  className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-500 hover:text-white"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(255, 122, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: animationConfig.duration.fast }}
                >
                  Outlined Button
                </motion.button>

                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(255, 122, 0, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: animationConfig.duration.fast }}
                >
                  Gradient Button
                </motion.button>
              </div>
            </div>

            {/* Input Interactions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Input Interactions</h2>
              
              <div className="space-y-4">
                <motion.input
                  type="text"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  variants={inputFocus}
                  initial="initial"
                  animate={isFocused ? "focus" : "initial"}
                  style={{
                    willChange: 'border-color, box-shadow',
                    transform: 'translate3d(0, 0, 0)'
                  }}
                />

                <motion.textarea
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
                  whileFocus={{ 
                    scale: 1.02,
                    borderColor: '#ff7a00',
                    boxShadow: '0 0 0 3px rgba(255, 122, 0, 0.1)'
                  }}
                  transition={{ duration: animationConfig.duration.fast }}
                />

                <motion.div className="relative">
                  <motion.input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none"
                    whileFocus={{ 
                      scale: 1.02,
                      borderColor: '#ff7a00',
                      boxShadow: '0 0 0 3px rgba(255, 122, 0, 0.1)'
                    }}
                    transition={{ duration: animationConfig.duration.fast }}
                  />
                  <motion.button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Checkbox & Radio */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Checkbox & Radio</h2>
              
              <div className="space-y-4">
                <motion.label
                  className="flex items-center space-x-3 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: animationConfig.duration.fast }}
                >
                  <motion.div
                    className={`w-5 h-5 border-2 rounded ${
                      isChecked ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                    }`}
                    variants={checkboxAnimation}
                    animate={isChecked ? "animate" : "initial"}
                    onClick={() => setIsChecked(!isChecked)}
                    style={{
                      willChange: 'transform',
                      transform: 'translate3d(0, 0, 0)'
                    }}
                  >
                    {isChecked && (
                      <motion.svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: animationConfig.duration.fast }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.div>
                  <span className="text-gray-700">Premium Option</span>
                </motion.label>

                <div className="space-y-2">
                  {['Option A', 'Option B', 'Option C'].map((option) => (
                    <motion.label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: animationConfig.duration.fast }}
                    >
                      <motion.div
                        className={`w-5 h-5 border-2 rounded-full ${
                          selectedOption === option ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedOption(option)}
                        style={{
                          willChange: 'transform',
                          transform: 'translate3d(0, 0, 0)'
                        }}
                      >
                        {selectedOption === option && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full mx-auto mt-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: animationConfig.duration.fast }}
                          />
                        )}
                      </motion.div>
                      <span className="text-gray-700">{option}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Toggle Switch</h2>
              
              <motion.button
                className="relative w-14 h-8 bg-gray-300 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChecked(!isChecked)}
                style={{
                  willChange: 'transform',
                  transform: 'translate3d(0, 0, 0)'
                }}
              >
                <motion.div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md ${
                    isChecked ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  animate={{ x: isChecked ? 24 : 4 }}
                  transition={{ duration: animationConfig.duration.normal, ease: animationConfig.ease.luxury }}
                />
              </motion.button>
            </div>

            {/* Loading States */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Loading States</h2>
              
              <div className="space-y-4">
                <motion.button
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium"
                  disabled
                  style={{ cursor: 'not-allowed' }}
                >
                  <motion.div className="flex items-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        ease: "linear",
                        repeat: Infinity
                      }}
                    />
                    <span>Loading...</span>
                  </motion.div>
                </motion.button>

                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-orange-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: animationConfig.ease.luxury
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hover Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Card 1', 'Card 2', 'Card 3'].map((card, index) => (
              <motion.div
                key={card}
                className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  y: -5
                }}
                transition={{ 
                  duration: animationConfig.duration.normal,
                  ease: animationConfig.ease.luxury
                }}
                style={{
                  willChange: 'transform, box-shadow',
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <motion.h3
                  className="text-lg font-semibold text-gray-800 mb-2"
                  whileHover={{ color: '#ff7a00' }}
                  transition={{ duration: animationConfig.duration.fast }}
                >
                  {card}
                </motion.h3>
                <p className="text-gray-600 text-sm">
                  Hover over this card to see the premium interaction effect with smooth scaling and shadow.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MicroInteractions;
