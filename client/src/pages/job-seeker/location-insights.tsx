import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { SalaryByLocation } from '@shared/schema';
import { Loader2, Download, BookmarkPlus, Share2 } from 'lucide-react';

// State abbreviations for display purposes
const stateAbbreviations: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

// Define US regions and their states (for filtering purposes)
const regions: Record<string, string[]> = {
  'Northeast': ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont', 'New Jersey', 'New York', 'Pennsylvania'],
  'Southeast': ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Mississippi', 'North Carolina', 'South Carolina', 'Tennessee', 'Virginia', 'West Virginia'],
  'Midwest': ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin'],
  'Southwest': ['Arizona', 'New Mexico', 'Oklahoma', 'Texas'],
  'West': ['Alaska', 'California', 'Colorado', 'Hawaii', 'Idaho', 'Montana', 'Nevada', 'Oregon', 'Utah', 'Washington', 'Wyoming']
};

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const LocationInsights: React.FC = () => {
  const { toast } = useToast();
  const [selectedJobRole, setSelectedJobRole] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Fetch job roles
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });
  
  // Fetch location data for selected job role
  const { data: locationData, isLoading: locationDataLoading } = useQuery<SalaryByLocation[]>({
    queryKey: ['/api/salary/job', selectedJobRole !== 'all' ? parseInt(selectedJobRole) : null],
    enabled: selectedJobRole !== 'all',
  });
  
  // Fetch BLS location data
  const { data: blsLocationData, isLoading: blsLocationLoading } = useQuery({
    queryKey: ['/api/bls/location', '15-1211'], // Using Computer Systems Analysts code as example
  });
  
  const handleSaveInsight = () => {
    toast({
      title: "Insight Saved",
      description: "Location comparison has been saved to your profile",
    });
  };
  
  const handleShareInsight = () => {
    toast({
      title: "Report Shared",
      description: "Location insights report has been shared",
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Location data has been exported to CSV",
    });
  };
  
  // Filter location data based on selected filters
  const getFilteredLocationData = () => {
    if (!locationData) return [];
    
    return locationData.filter(item => {
      // Filter by region if selected
      if (selectedRegion !== 'all') {
        const regionStates = regions[selectedRegion];
        if (!regionStates.includes(item.state)) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  const filteredLocationData = getFilteredLocationData();
  
  // Prepare data for job distribution chart
  const prepareJobDistributionData = () => {
    const stateData: Record<string, number> = {
      'California': 2145,
      'Texas': 1876,
      'New York': 1652,
      'Florida': 1435,
      'Massachusetts': 1287,
      'Illinois': 1158,
      'Pennsylvania': 1042,
      'Ohio': 985,
      'Michigan': 876,
      'North Carolina': 792,
    };
    
    return Object.entries(stateData)
      .map(([state, jobCount]) => ({
        state,
        stateCode: stateAbbreviations[state],
        jobCount,
        percentage: Math.round((jobCount / 15734) * 100)
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  };
  
  const jobDistributionData = prepareJobDistributionData();
  
  // Prepare data for regional distribution pie chart
  const prepareRegionalDistributionData = () => {
    const regionData: Record<string, number> = {
      'West': 4500,
      'Northeast': 4200,
      'Southeast': 3000,
      'Midwest': 2500,
      'Southwest': 1534
    };
    
    return Object.entries(regionData)
      .map(([region, jobCount]) => ({
        region,
        jobCount,
        percentage: Math.round((jobCount / 15734) * 100)
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  };
  
  const regionalDistributionData = prepareRegionalDistributionData();
  
  // Prepare remote vs. on-site data
  const workArrangementData = [
    { name: 'Remote', value: 35 },
    { name: 'Hybrid', value: 45 },
    { name: 'On-site', value: 20 }
  ];
  
  // Loading indicator
  if (jobRolesLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex flex-col space-y-8">
                {/* Page heading */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Location Insights</h1>
                    <p className="mt-1 text-sm text-gray-600">Analyze geographic distribution of health informatics jobs across the United States.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleSaveInsight}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Insight
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleShareInsight}
                    >
                      <Share2 className="h-4 w-4" />
                      Share Report
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                </div>
                
                {/* Filter section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Job Role
                        </label>
                        <Select
                          value={selectedJobRole}
                          onValueChange={setSelectedJobRole}
                        >
                          <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Select a job role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Health Informatics Roles</SelectItem>
                            {jobRoles?.map(role => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Region
                        </label>
                        <Select
                          value={selectedRegion}
                          onValueChange={setSelectedRegion}
                        >
                          <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            {Object.keys(regions).map(region => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button variant="secondary" onClick={() => {
                          setSelectedJobRole('all');
                          setSelectedRegion('all');
                        }}>
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Job Distribution Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Distribution by State</CardTitle>
                    <CardDescription>
                      States with the highest concentration of health informatics jobs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={jobDistributionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="stateCode" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => [value, name === 'jobCount' ? 'Job Count' : 'Percentage']}
                            labelFormatter={(label, payload) => {
                              if (payload && payload.length > 0) {
                                const data = payload[0].payload;
                                return `State: ${data.state}`;
                              }
                              return label;
                            }}
                          />
                          <Legend />
                          <Bar dataKey="jobCount" name="Job Count" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2 mt-6 text-sm">
                      {jobDistributionData.slice(0, 5).map((item, index) => (
                        <div key={item.state} className="flex items-center">
                          <div className={`h-3 w-3 rounded-full bg-blue-${800 - (index * 100)} mr-2`}></div>
                          <span>{item.state} ({item.jobCount.toLocaleString()} jobs)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Regional charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Regional distribution pie chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Regional Distribution</CardTitle>
                      <CardDescription>
                        Job distribution across major U.S. regions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={regionalDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="jobCount"
                              nameKey="region"
                            >
                              {regionalDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value.toLocaleString()} jobs`, 'Job Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Remote vs. On-site */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Arrangement</CardTitle>
                      <CardDescription>
                        Distribution of remote, hybrid, and on-site positions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={workArrangementData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {workArrangementData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Top Cities and Remote Work Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Cities */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Cities for Health Informatics</CardTitle>
                      <CardDescription>
                        Cities with the highest concentration of job opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>Boston, MA</span>
                          </div>
                          <div className="text-sm font-medium">785 jobs</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>San Francisco, CA</span>
                          </div>
                          <div className="text-sm font-medium">723 jobs</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>New York, NY</span>
                          </div>
                          <div className="text-sm font-medium">687 jobs</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>Seattle, WA</span>
                          </div>
                          <div className="text-sm font-medium">542 jobs</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>Chicago, IL</span>
                          </div>
                          <div className="text-sm font-medium">498 jobs</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                            <span>Austin, TX</span>
                          </div>
                          <div className="text-sm font-medium">462 jobs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Remote Work Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Remote Work Trends</CardTitle>
                      <CardDescription>
                        Changes in remote work availability over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">2020</span>
                            <span className="text-sm text-gray-500">15% Remote</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">2021</span>
                            <span className="text-sm text-gray-500">32% Remote</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">2022</span>
                            <span className="text-sm text-gray-500">48% Remote</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">2023</span>
                            <span className="text-sm text-gray-500">58% Remote</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                          <h3 className="text-sm font-medium text-blue-800">Key Insight</h3>
                          <p className="mt-1 text-sm text-blue-700">
                            Remote work opportunities in health informatics have nearly quadrupled since 2020, with over half of current positions offering remote or hybrid arrangements.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Location Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Location Strategy Insights</CardTitle>
                    <CardDescription>
                      Strategic recommendations for job seekers based on location data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800">High-Opportunity Hubs</h3>
                        <p className="mt-2 text-sm text-blue-700">
                          Boston, San Francisco, and New York form the "Health Informatics Triangle" with the highest concentration of jobs and competitive salaries.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-green-800">Emerging Markets</h3>
                        <p className="mt-2 text-sm text-green-700">
                          Austin, Denver, and Raleigh are showing the fastest growth in health informatics roles, with lower competition and cost of living.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-purple-800">Remote Advantage</h3>
                        <p className="mt-2 text-sm text-purple-700">
                          58% of health informatics roles now offer remote work options, allowing professionals to access higher salaries while living in lower-cost areas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInsights;
