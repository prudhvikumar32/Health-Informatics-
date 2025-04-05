import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { SkillData } from '@shared/types';

interface TopSkillsChartProps {
  skills: SkillData[];
  title: string;
}

const TopSkillsChart: React.FC<TopSkillsChartProps> = ({ skills, title }) => {
  // Sort skills by percentage
  const sortedSkills = [...skills].sort((a, b) => b.percentage - a.percentage);

  // Take top 10 skills
  const topSkills = sortedSkills.slice(0, 10);

  // Colors for different categories
  const getSkillColor = (category: string) => {
    switch(category) {
      case 'Technical Skills':
        return '#4f46e5'; // Indigo
      case 'Soft Skills':
        return '#10b981'; // Emerald
      case 'Domain Knowledge':
        return '#f59e0b'; // Amber
      default:
        return '#3b82f6'; // Blue
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="chart-container mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topSkills}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "Demand Level"]}
                labelFormatter={(label) => `Skill: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="percentage" 
                name="Demand Percentage" 
                maxBarSize={20}
              >
                {topSkills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSkillColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend showing categories */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></div>
              <span className="text-sm">Technical Skills</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-600 mr-2"></div>
              <span className="text-sm">Soft Skills</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm">Domain Knowledge</span>
            </div>
          </div>
          
          {/* Key insights */}
          <div className="mt-4 bg-gray-50 rounded p-3">
            <div className="text-sm font-medium text-gray-700">Key Insight</div>
            <div className="text-sm text-gray-600 mt-1">
              {topSkills.length > 0 ? (
                <>The most in-demand skill is <strong>{topSkills[0].name}</strong> with {topSkills[0].percentage}% demand rate.</>
              ) : (
                <>No skill data available</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSkillsChart;