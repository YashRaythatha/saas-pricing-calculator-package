import React from 'react';

const VectorSenseLogo = ({ className = "", width = "120", height = "30" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none transition-transform hover:scale-105"
      >
        {/* Vector text */}
        <text
          x="0"
          y="20"
          className="fill-gray-800 font-semibold"
          style={{
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >
          Vector
        </text>
        
        {/* Sense text */}
        <text
          x="48"
          y="20"
          className="fill-gray-800 font-normal"
          style={{
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >
          Sense
        </text>
        
        {/* Blue dot */}
        <circle
          cx="110"
          cy="15"
          r="3"
          className="fill-blue-500"
        />
      </svg>
    </div>
  );
};

export default VectorSenseLogo;
