import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TopRoleData } from '@shared/types';

interface SalaryChartProps {
  data: TopRoleData[];
  title: string;
}

const SalaryChart: React.FC<SalaryChartProps> = ({ data, title }) => {
  // Format salary for display
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="chart-container mt-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 10000']} tickFormatter={formatSalary} />
              <YAxis type="category" dataKey="title" width={150} />
              <Tooltip formatter={(value) => formatSalary(value as number)} />
              <Legend />
              <Bar dataKey="salary" name="Annual Salary" fill="#3b82f6" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalaryChart;
