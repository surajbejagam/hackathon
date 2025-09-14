import React from 'react';

interface RiskBadgeProps {
  riskClass: 'CLASS I' | 'CLASS II' | 'CLASS III';
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskClass, size = 'md' }) => {
  const colors = {
    'CLASS I': 'bg-green-100 text-green-800 border-green-200',
    'CLASS II': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'CLASS III': 'bg-red-100 text-red-800 border-red-200'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full border-2 ${colors[riskClass]} ${sizes[size]}`}>
      {riskClass}
    </span>
  );
};