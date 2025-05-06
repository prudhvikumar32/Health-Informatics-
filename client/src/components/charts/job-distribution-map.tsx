import React, { useState } from 'react';
import { StateJobCount } from '@shared/types';

interface JobDistributionMapProps {
  data: StateJobCount[];
  title: string;
}

// Define regions for state organization (exact order from the screenshot)
const regionMap = {
  Northeast: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"],
  Southeast: ["DE", "MD", "DC", "VA", "WV", "NC", "SC", "GA", "FL"],
  Midwest: ["OH", "MI", "IN", "IL", "WI", "MN", "IA", "MO", "ND", "SD", "NE", "KS"],
  Southwest: ["TX", "OK", "NM", "AZ"],
  West: ["CO", "WY", "MT", "ID", "UT", "NV", "CA", "OR", "WA"]
};

// Data from the provided CSV file
const csvData = [
  { state: "Georgia", stateCode: "GA", jobCount: 31561 },
  { state: "California", stateCode: "CA", jobCount: 31014 },
  { state: "Pennsylvania", stateCode: "PA", jobCount: 29812 },
  { state: "New York", stateCode: "NY", jobCount: 29657 },
  { state: "Ohio", stateCode: "OH", jobCount: 28129 },
  { state: "Texas", stateCode: "TX", jobCount: 27469 },
  { state: "Illinois", stateCode: "IL", jobCount: 26991 },
  { state: "Florida", stateCode: "FL", jobCount: 26862 },
  { state: "Oregon", stateCode: "OR", jobCount: 5804 },
  { state: "Iowa", stateCode: "IA", jobCount: 5489 },
  { state: "North Carolina", stateCode: "NC", jobCount: 5108 },
  { state: "Arizona", stateCode: "AZ", jobCount: 5108 },
  { state: "Tennessee", stateCode: "TN", jobCount: 4988 },
  { state: "Colorado", stateCode: "CO", jobCount: 4972 },
  { state: "Wisconsin", stateCode: "WI", jobCount: 4904 },
  { state: "Washington", stateCode: "WA", jobCount: 4859 },
  { state: "Alabama", stateCode: "AL", jobCount: 4853 },
  { state: "Maryland", stateCode: "MD", jobCount: 4673 },
  { state: "Michigan", stateCode: "MI", jobCount: 4173 },
  { state: "Missouri", stateCode: "MO", jobCount: 3990 },
  { state: "Oklahoma", stateCode: "OK", jobCount: 3627 },
  { state: "New Jersey", stateCode: "NJ", jobCount: 3537 },
  { state: "District of Columbia", stateCode: "DC", jobCount: 3448 },
  { state: "Mississippi", stateCode: "MS", jobCount: 3381 },
  { state: "Kentucky", stateCode: "KY", jobCount: 3212 },
  { state: "Indiana", stateCode: "IN", jobCount: 3062 },
  { state: "Virginia", stateCode: "VA", jobCount: 2929 },
  { state: "South Carolina", stateCode: "SC", jobCount: 2831 },
  { state: "Minnesota", stateCode: "MN", jobCount: 2779 },
  { state: "Connecticut", stateCode: "CT", jobCount: 2591 },
  { state: "Massachusetts", stateCode: "MA", jobCount: 2016 }
];

// Function to determine color intensity based on job count
const getColorClass = (count: number): string => {
  if (count > 25000) return 'bg-[#67000d] text-white'; // Darkest red - top tier (GA, CA, PA, NY, OH, TX, IL, FL)
  if (count > 10000) return 'bg-[#a50f15] text-white'; // Dark red
  if (count > 5000) return 'bg-[#cb181d] text-white';  // Medium dark red (OR, IA, NC, AZ, TN, CO, WI, WA, AL)
  if (count > 3500) return 'bg-[#ef3b2c] text-white';  // Medium red (MD, MI, MO, OK, NJ, DC)
  if (count > 2500) return 'bg-[#fb6a4a]';             // Light red (MS, KY, IN, VA, SC, MN, CT)
  if (count > 0) return 'bg-[#fdd0a2] text-gray-700';  // Very light orange for other states
  return 'bg-[#f7f7f7] text-gray-400';                 // Default light gray
};

// Calculate percentage of total for each state
const calculatePercentages = (data: Array<{state: string, stateCode: string, jobCount: number}>) => {
  const total = data.reduce((sum, item) => sum + item.jobCount, 0);
  return data.map(item => ({
    ...item,
    percentage: item.jobCount / total
  }));
};

const JobDistributionMap: React.FC<JobDistributionMapProps> = ({ data, title }) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  
  // Use CSV data with calculated percentages
  const displayData = calculatePercentages(data);  
  // Create a mapping of state codes to job data
  const stateJobMap: Record<string, { jobCount: number, percentage: number }> = {};
  
  // Fill the map with data
  displayData.forEach(item => {
    stateJobMap[item.stateCode] = { 
      jobCount: item.jobCount,
      percentage: item.percentage
    };
  });
  
  // Complete state map with full state names
  const stateNameMap: {[key: string]: string} = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        <div className="mt-4">
          {/* State grid organized by region - matching screenshot exactly */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(regionMap).map(([region, states]) => (
              <div key={region} className="flex flex-col gap-2">
                <div className="text-center text-sm font-medium">{region}</div>
                
                {states.map(stateCode => {
                  const stateData = stateJobMap[stateCode] || { jobCount: 0, percentage: 0 };
                  const jobCount = stateData.jobCount;
                  const percentage = stateData.percentage * 100;
                  const isHovered = hoveredState === stateCode;
                  
                  return (
                    <div 
                      key={stateCode}
                      className={`${getColorClass(jobCount)} p-2 text-center relative
                        transition-transform duration-150 cursor-pointer rounded hover:scale-105`}
                      onMouseEnter={() => setHoveredState(stateCode)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      {stateCode}
                      
                      {/* Hover tooltip */}
                      {isHovered && (
                        <div className="absolute z-10 bg-white p-2 rounded shadow-lg border
                                       -translate-y-full left-1/2 -translate-x-1/2 w-48">
                          <p className="font-bold text-gray-900">{stateNameMap[stateCode]}</p>
                          <p className="text-gray-700">{jobCount.toLocaleString()} jobs</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of US total</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Color legend */}
          <div className="mt-6 flex justify-center items-center">
            <div className="text-sm mr-2">Job Density:</div>
            <div className="flex">
              <div className="w-5 h-5 bg-[#fdd0a2] border border-gray-200"></div>
              <div className="w-5 h-5 bg-[#fb6a4a] border border-gray-200"></div>
              <div className="w-5 h-5 bg-[#ef3b2c] border border-gray-200"></div>
              <div className="w-5 h-5 bg-[#cb181d] border border-gray-200"></div>
              <div className="w-5 h-5 bg-[#a50f15] border border-gray-200"></div>
              <div className="w-5 h-5 bg-[#67000d] border border-gray-200"></div>
            </div>
            <div className="text-sm ml-2 flex items-center">
              <span>Low</span>
              <span className="mx-2">→</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Top states list - showing top 6 states from CSV data */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {displayData
              .sort((a, b) => b.jobCount - a.jobCount)
              .slice(0, 6)
              .map(item => (
                <div key={item.stateCode} className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${getColorClass(item.jobCount).split(' ')[0]}`}></div>
                  <span className="text-sm">
                    {item.state} ({item.jobCount.toLocaleString()} jobs)
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDistributionMap;
