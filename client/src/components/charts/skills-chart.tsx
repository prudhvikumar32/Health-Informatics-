import React from 'react';
import SkillBar from '@/components/ui/skill-bar';
import { SkillData } from '@shared/types';

interface SkillsChartProps {
  skills: SkillData[];
  title: string;
}

const SkillsChart: React.FC<SkillsChartProps> = ({ skills, title }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillData[]>);
  
  const categories = Object.keys(groupedSkills);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="chart-container mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
            {categories.map((category, index) => (
              <div key={category} className="flex flex-col">
                <div className="text-sm font-medium mb-2">{category}</div>
                {groupedSkills[category].map((skill) => (
                  <SkillBar 
                    key={skill.name}
                    name={skill.name}
                    percentage={skill.percentage}
                    color={category === 'Technical Skills' ? 'bg-blue-600' : 'bg-green-600'}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsChart;
