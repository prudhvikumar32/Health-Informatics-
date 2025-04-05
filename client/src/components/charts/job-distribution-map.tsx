import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StateJobCount } from '@shared/types';

interface JobDistributionMapProps {
  data: StateJobCount[];
  title: string;
}

const JobDistributionMap: React.FC<JobDistributionMapProps> = ({ data, title }) => {
  // For a real implementation, this would use a geospatial map component
  // For simplicity, using a bar chart to show job counts by state
  
  // Sort data by job count descending
  const sortedData = [...data].sort((a, b) => b.jobCount - a.jobCount);
  
  // Take top 10 states
  const topStates = sortedData.slice(0, 10);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <div className="map-container mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topStates}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} jobs`, "Count"]}
                labelFormatter={(label) => `State: ${label}`}
              />
              <Legend />
              <Bar dataKey="jobCount" name="Job Count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-6 text-sm">
            {sortedData.slice(0, 6).map((item, index) => (
              <div key={item.state} className="flex items-center">
                <div className={`h-3 w-3 rounded-full bg-blue-${800 - (index * 100)} mr-2`}></div>
                <span>{item.state} ({item.jobCount.toLocaleString()} jobs)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDistributionMap;
