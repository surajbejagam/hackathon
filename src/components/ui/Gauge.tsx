import React from 'react';

interface GaugeProps {
  value: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ value, size = 200, strokeWidth = 20 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (value * circumference);
  
  // Create gradient colors based on value
  const getColor = (val: number) => {
    if (val <= 0.33) return '#10b981'; // Green
    if (val <= 0.66) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const color = getColor(value);
  const angle = -90 + (value * 180); // -90 to 90 degrees

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size / 2 + strokeWidth} className="transform rotate-0">
        {/* Background semicircle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress semicircle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Needle */}
      <div 
        className="absolute w-1 bg-gray-800 origin-bottom transition-transform duration-1000"
        style={{ 
          height: radius - 10,
          bottom: '10px',
          transform: `rotate(${angle}deg)`
        }}
      />
      {/* Center value display */}
      <div className="absolute bottom-2 text-center">
        <div className="text-2xl font-bold text-gray-800">{(value * 100).toFixed(1)}%</div>
        <div className="text-sm text-gray-500">Risk Score</div>
      </div>
    </div>
  );
};