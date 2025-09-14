import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'blue', icon }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colors[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="text-2xl opacity-75">{icon}</div>}
      </div>
    </div>
  );
};