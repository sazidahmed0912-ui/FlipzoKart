import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`}>
        <div className="loading-circle">
          <div className="loading-f">F</div>
          <div className="loading-ring"></div>
          <div className="loading-ring ring-2"></div>
          <div className="loading-ring ring-3"></div>
        </div>
        <div className="loading-text">{text}</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
