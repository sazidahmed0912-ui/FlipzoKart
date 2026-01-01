// src/components/animations/MicroInteractions.js
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedButton = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative overflow-hidden px-6 py-3 rounded-lg font-medium"
      whileHover={{ 
        y: -2,
        boxShadow: "0 4px 15px rgba(255, 122, 0, 0.3)"
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: "0 2px 5px rgba(255, 122, 0, 0.2)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }}
    >
      {children}
      <motion.span 
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export const AnimatedInput = ({ ...props }) => {
  return (
    <motion.div className="relative">
      <motion.input
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
        whileFocus={{ 
          borderColor: "#ff7a00",
          boxShadow: "0 0 0 3px rgba(255, 122, 0, 0.2)"
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-orange-500 w-0"
        whileFocus={{ width: "100%" }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

export const AnimatedCheckbox = ({ checked, onChange }) => {
  return (
    <motion.div 
      className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
      onClick={() => onChange(!checked)}
      animate={{ 
        backgroundColor: checked ? "#ff7a00" : "transparent",
        borderColor: checked ? "#ff7a00" : "#d1d5db"
      }}
      transition={{ duration: 0.2 }}
    >
      {checked && (
        <motion.svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.path
            fill="none"
            stroke="white"
            strokeWidth="3"
            d="M5 12l5 5L20 7"
          />
        </motion.svg>
      )}
    </motion.div>
  );
};

export const ToastNotification = ({ message, type = 'info', onClose }) => {
  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  }[type];

  return (
    <motion.div
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
    >
      <span>{message}</span>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        ✕
      </motion.button>
    </motion.div>
  );
};
