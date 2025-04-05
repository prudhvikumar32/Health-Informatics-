import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RegionalSalaryData } from '@shared/types';

interface RegionalSalaryChartProps {
  data: RegionalSalaryData[];
  title: string;
}

const RegionalSalaryChart: React.FC<RegionalSalaryChartProps> = ({ data, title }) => {
  // Format salary for display
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  // Sort data by salary
  const sortedData = [...data].sort((a, b) => b.salary - a.salary);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="chart-container mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sortedData}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis 
                tickFormatter={formatSalary} 
                domain={['dataMin - 10000', 'dataMax + 10000']}
              />
              <Tooltip 
                formatter={(value) => [formatSalary(value as number), "Average Salary"]}
                labelFormatter={(label) => `Region: ${label}`}
              />
              <Legend />
              <Bar dataKey="salary" name="Average Salary" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded p-3">
              <div className="text-sm font-medium text-gray-500">Highest Paying Region</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {sortedData.length > 0 ? sortedData[0].region : 'N/A'}
              </div>
              <div className="text-sm text-green-600 mt-1">
                {sortedData.length > 0 ? formatSalary(sortedData[0].salary) : ''}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded p-3">
              <div className="text-sm font-medium text-gray-500">Regional Variance</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {sortedData.length > 1 
                  ? formatSalary(sortedData[0].salary - sortedData[sortedData.length - 1].salary) 
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Max difference in pay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalSalaryChart;