import React from 'react';

interface SkillBarProps {
  name: string;
  percentage: number;
  color?: string;
  showPercentage?: boolean;
}

const SkillBar: React.FC<SkillBarProps> = ({ 
  name, 
  percentage, 
  color = 'bg-blue-600', 
  showPercentage = true 
}) => {
  return (
    <div className="bg-gray-200 rounded-full overflow-hidden mb-3">
      <div className={`h-2.5 ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
      <div className="flex justify-between text-xs mt-1">
        <span>{name}</span>
        {showPercentage && <span>{percentage}%</span>}
      </div>
    </div>
  );
};

export default SkillBar;
