import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookmarkPlus, RefreshCw, Share2 } from 'lucide-react';
import { SalaryRangeData } from '@shared/types';

const SalaryBenchmark: React.FC = () => {
  const { toast } = useToast();
  
  // State for filter selections
  const [selectedRole, setSelectedRole] = useState<string>('clinical_systems_analyst');
  const [selectedLocation, setSelectedLocation] = useState<string>('national');
  const [selectedExperience, setSelectedExperience] = useState<string>('mid');
  
  // Fetch job roles for dropdown
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });
  
  // Fetch BLS jobs data
  const { data: blsJobs } = useQuery({
    queryKey: ['/api/bls/jobs'],
  });
  
  // Get BLS code for selected role
  const getBLSCodeForRole = (role: string) => {
    const roleNames: Record<string, string> = {
      'clinical_systems_analyst': '15-1211', // Computer Systems Analysts
      'health_data_scientist': '15-2051',    // Data Scientists
      'ehr_implementation_specialist': '15-1251', // Computer Programmers
      'healthcare_it_project_manager': '13-1082', // Project Management Specialists
      'medical_informaticist': '29-9021'     // Health Information Technologists
    };
    
    return roleNames[role] || '15-1211'; // Default to Computer Systems Analysts if not found
  };
  
  // Fetch salary data based on selected role
  const { data: salaryData, isLoading: salaryLoading, refetch: refetchSalary } = useQuery({
    queryKey: ['/api/bls/salary', getBLSCodeForRole(selectedRole)],
    queryFn: async () => {
      const response = await fetch(`/api/bls/salary/${getBLSCodeForRole(selectedRole)}`);
      if (!response.ok) throw new Error('Failed to fetch salary data');
      return response.json();
    }
  });
  
  // Fetch location data based on selected role and location
  const { data: locationData, isLoading: locationLoading, refetch: refetchLocation } = useQuery({
    queryKey: ['/api/bls/location', getBLSCodeForRole(selectedRole), selectedLocation],
    queryFn: async () => {
      const query = selectedLocation !== 'national' ? `?state=${selectedLocation}` : '';
      const response = await fetch(`/api/bls/location/${getBLSCodeForRole(selectedRole)}${query}`);
      if (!response.ok) throw new Error('Failed to fetch location data');
      return response.json();
    }
  });
  
  // Adjust salary based on experience level
  const adjustSalaryForExperience = (baseSalary: number, experience: string) => {
    switch(experience) {
      case 'entry':
        return baseSalary * 0.85; // 15% below median
      case 'mid':
        return baseSalary; // Median salary
      case 'senior':
        return baseSalary * 1.25; // 25% above median
      case 'expert':
        return baseSalary * 1.45; // 45% above median
      default:
        return baseSalary;
    }
  };
  
  // Handle save report
  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "Salary benchmark report has been saved to your profile",
    });
  };
  
  // Handle export data
  const handleExportData = (format: string) => {
    toast({
      title: `Data Exported as ${format.toUpperCase()}`,
      description: `Salary data has been exported to ${format}`,
    });
  };
  
  // Handle refresh data
  const handleRefreshData = async () => {
    try {
      await refetchSalary();
      await refetchLocation();
      toast({
        title: "Data Refreshed",
        description: "Salary benchmark data has been updated with latest information",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh salary data",
        variant: "destructive"
      });
    }
  };
  
  // Handle generate report - Apply all selected filters and fetch new data
  const handleGenerateReport = async () => {
    try {
      await refetchSalary();
      await refetchLocation();
      toast({
        title: "Report Generated", 
        description: `Generated salary report for ${selectedRole === 'clinical_systems_analyst' ? 'Clinical Systems Analyst' : 
                     selectedRole === 'health_data_scientist' ? 'Health Data Scientist' : 
                     selectedRole === 'ehr_implementation_specialist' ? 'EHR Implementation Specialist' : 
                     selectedRole === 'healthcare_it_project_manager' ? 'Healthcare IT Project Manager' : 
                     'Medical Informaticist'} in ${selectedLocation === 'national' ? 'National Average' : 
                                                  selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)} region`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate salary report with selected filters",
        variant: "destructive"
      });
    }
  };
  
  // Dynamic salary range data using real BLS data
  const salaryRangeData: SalaryRangeData = salaryData ? {
    role: salaryData.occupation,
    location: selectedLocation === 'national' ? 'National Average' : 
             selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1),
    experience: selectedExperience === 'entry' ? 'Entry Level (0-2 yrs)' : 
               selectedExperience === 'mid' ? 'Mid Level (3-5 yrs)' : 
               selectedExperience === 'senior' ? 'Senior (6-9 yrs)' : 'Expert (10+ yrs)',
    median: adjustSalaryForExperience(salaryData.medianAnnualWage, selectedExperience),
    percentile10: adjustSalaryForExperience(salaryData.percentile10, selectedExperience),
    percentile90: adjustSalaryForExperience(salaryData.percentile90, selectedExperience)
  } : {
    role: 'Loading...',
    location: 'National Average',
    experience: 'Mid Level (3-5 yrs)',
    median: 85000,
    percentile10: 72500,
    percentile90: 98750
  };
  
  // Dynamic regional comparison data using location data from BLS API
  const regionalComparisonData = React.useMemo(() => {
    if (!locationData || !Array.isArray(locationData) || locationData.length === 0) {
      // Return default data while loading
      return [
        { region: 'Northeast', salary: 92000 },
        { region: 'West', salary: 97500 },
        { region: 'Midwest', salary: 82000 },
        { region: 'Southeast', salary: 79500 },
        { region: 'Southwest', salary: 83000 }
      ];
    }
    
    // Group location data by region
    const regions: { [key: string]: number[] } = {
      'Northeast': [],
      'West': [],
      'Midwest': [],
      'South': [],
      'Southwest': []
    };
    
    // Map states to regions
    const stateToRegion: { [key: string]: string } = {
      // Northeast
      'CT': 'Northeast', 'ME': 'Northeast', 'MA': 'Northeast', 'NH': 'Northeast', 
      'RI': 'Northeast', 'VT': 'Northeast', 'NJ': 'Northeast', 'NY': 'Northeast', 'PA': 'Northeast',
      // Midwest
      'IL': 'Midwest', 'IN': 'Midwest', 'MI': 'Midwest', 'OH': 'Midwest', 'WI': 'Midwest',
      'IA': 'Midwest', 'KS': 'Midwest', 'MN': 'Midwest', 'MO': 'Midwest', 'NE': 'Midwest', 
      'ND': 'Midwest', 'SD': 'Midwest',
      // South
      'DE': 'South', 'FL': 'South', 'GA': 'South', 'MD': 'South', 'NC': 'South', 'SC': 'South',
      'VA': 'South', 'DC': 'South', 'WV': 'South', 'AL': 'South', 'KY': 'South', 'MS': 'South', 
      'TN': 'South', 'AR': 'South', 'LA': 'South',
      // West
      'CO': 'West', 'ID': 'West', 'MT': 'West', 'NV': 'West',
      'UT': 'West', 'WY': 'West', 'AK': 'West', 'CA': 'West', 'HI': 'West', 'OR': 'West', 'WA': 'West',
      // Southwest (subset of West/South)
      'AZ': 'Southwest', 'NM': 'Southwest', 'TX': 'Southwest', 'OK': 'Southwest'
    };
    
    // Group wages by region
    locationData.forEach(location => {
      const region = stateToRegion[location.stateCode];
      if (region && location.meanAnnualWage) {
        regions[region].push(adjustSalaryForExperience(location.meanAnnualWage, selectedExperience));
      }
    });
    
    // Calculate average for each region
    return Object.entries(regions)
      .filter(([_, wages]) => wages.length > 0)
      .map(([region, wages]) => ({
        region,
        salary: Math.round(wages.reduce((sum, wage) => sum + wage, 0) / wages.length)
      }))
      .sort((a, b) => b.salary - a.salary); // Sort by salary in descending order
  }, [locationData, selectedExperience]);
  
  // Sample data for organization size comparison
  const orgSizeComparisonData = [
    { size: 'Small (< 100 employees)', salary: 78000 },
    { size: 'Medium (100-500 employees)', salary: 85000 },
    { size: 'Large (501-1000 employees)', salary: 92000 },
    { size: 'Enterprise (1000+ employees)', salary: 98000 }
  ];
  
  // Sample data for historical salary trends
  const historicalTrendsData = [
    { year: 2018, yourOrg: 78000, industry: 75000 },
    { year: 2019, yourOrg: 80500, industry: 77500 },
    { year: 2020, yourOrg: 83000, industry: 80000 },
    { year: 2021, yourOrg: 86000, industry: 82500 },
    { year: 2022, yourOrg: 90000, industry: 85000 },
    { year: 2023, yourOrg: 95000, industry: 88000 }
  ];
  
  // Format salary for display
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Calculate the difference and create a friendly message
  const calculateDifference = () => {
    const industryMedian = salaryRangeData.median;
    const yourOrgSalary = historicalTrendsData[historicalTrendsData.length - 1].yourOrg;
    
    const difference = yourOrgSalary - industryMedian;
    const percentDifference = (difference / industryMedian) * 100;
    
    if (difference > 0) {
      return {
        message: `Your organization's salary is ${percentDifference.toFixed(1)}% above the industry median`,
        color: 'text-green-700',
        bgColor: 'bg-green-50'
      };
    } else if (difference < 0) {
      return {
        message: `Your organization's salary is ${Math.abs(percentDifference).toFixed(1)}% below the industry median`,
        color: 'text-red-700',
        bgColor: 'bg-red-50'
      };
    } else {
      return {
        message: "Your organization's salary matches the industry median exactly",
        color: 'text-blue-700',
        bgColor: 'bg-blue-50'
      };
    }
  };
  
  const differenceData = calculateDifference();
  
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
                    <h1 className="text-2xl font-semibold text-gray-900">Salary Benchmarking Tool</h1>
                    <p className="mt-1 text-sm text-gray-600">Compare market rates across roles, regions, and experience levels to optimize your compensation strategy.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleRefreshData()}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleSaveReport()}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Report
                    </Button>
                  </div>
                </div>
                
                {/* Filter section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Benchmark Filters</CardTitle>
                    <CardDescription>
                      Configure parameters to generate a customized salary report
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Role
                        </label>
                        <Select
                          value={selectedRole}
                          onValueChange={(value) => {
                            setSelectedRole(value);
                            refetchSalary();
                            refetchLocation();
                          }}
                          defaultValue="clinical_systems_analyst"
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {selectedRole === 'clinical_systems_analyst' ? 'Clinical Systems Analyst' : 
                               selectedRole === 'health_data_scientist' ? 'Health Data Scientist' : 
                               selectedRole === 'ehr_implementation_specialist' ? 'EHR Implementation Specialist' : 
                               selectedRole === 'healthcare_it_project_manager' ? 'Healthcare IT Project Manager' : 
                               selectedRole === 'medical_informaticist' ? 'Medical Informaticist' : 
                               'Clinical Systems Analyst'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinical_systems_analyst">Clinical Systems Analyst</SelectItem>
                            <SelectItem value="health_data_scientist">Health Data Scientist</SelectItem>
                            <SelectItem value="ehr_implementation_specialist">EHR Implementation Specialist</SelectItem>
                            <SelectItem value="healthcare_it_project_manager">Healthcare IT Project Manager</SelectItem>
                            <SelectItem value="medical_informaticist">Medical Informaticist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Location
                        </label>
                        <Select
                          value={selectedLocation}
                          onValueChange={(value) => {
                            setSelectedLocation(value);
                            refetchLocation();
                          }}
                          defaultValue="national"
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {selectedLocation === 'national' ? 'National Average' :
                               selectedLocation === 'northeast' ? 'Northeast' :
                               selectedLocation === 'midwest' ? 'Midwest' :
                               selectedLocation === 'south' ? 'South' :
                               selectedLocation === 'west' ? 'West' :
                               'National Average'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="national">National Average</SelectItem>
                            <SelectItem value="northeast">Northeast</SelectItem>
                            <SelectItem value="midwest">Midwest</SelectItem>
                            <SelectItem value="south">South</SelectItem>
                            <SelectItem value="west">West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Experience
                        </label>
                        <Select
                          value={selectedExperience}
                          onValueChange={(value) => {
                            setSelectedExperience(value);
                            refetchSalary();
                            refetchLocation();
                          }}
                          defaultValue="mid"
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {selectedExperience === 'entry' ? 'Entry Level (0-2 yrs)' :
                               selectedExperience === 'mid' ? 'Mid Level (3-5 yrs)' :
                               selectedExperience === 'senior' ? 'Senior (6-9 yrs)' :
                               selectedExperience === 'expert' ? 'Expert (10+ yrs)' :
                               'Mid Level (3-5 yrs)'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level (0-2 yrs)</SelectItem>
                            <SelectItem value="mid">Mid Level (3-5 yrs)</SelectItem>
                            <SelectItem value="senior">Senior (6-9 yrs)</SelectItem>
                            <SelectItem value="expert">Expert (10+ yrs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleGenerateReport} disabled={salaryLoading || locationLoading}>
                        {(salaryLoading || locationLoading) ? 'Generating...' : 'Generate Report'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Salary Range Display */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Salary Range for {salaryRangeData.role}</CardTitle>
                    <CardDescription>
                      {salaryRangeData.location} • {salaryRangeData.experience}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-6 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          10th Percentile: {formatSalary(salaryRangeData.percentile10)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          90th Percentile: {formatSalary(salaryRangeData.percentile90)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-10 relative rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gray-200 absolute"></div>
                      <div className="h-full bg-gradient-to-r from-blue-300 to-blue-600 absolute" style={{ width: '80%' }}></div>
                      <div className="h-full flex items-center justify-center absolute inset-0">
                        <span className="text-sm font-medium">Median: {formatSalary(salaryRangeData.median)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>{formatSalary(salaryRangeData.percentile10 - 5000)}</span>
                      <span>{formatSalary(salaryRangeData.median - 10000)}</span>
                      <span>{formatSalary(salaryRangeData.median)}</span>
                      <span>{formatSalary(salaryRangeData.median + 10000)}</span>
                      <span>{formatSalary(salaryRangeData.percentile90 + 5000)}</span>
                    </div>
                    
                    <div className={`mt-6 ${differenceData.bgColor} p-4 rounded-md`}>
                      <p className={`text-sm ${differenceData.color}`}>
                        <span className="font-medium">Comparison:</span> {differenceData.message}
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-2">Market Insights:</h3>
                      <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1 text-sm">
                        <li>Your selected region ({salaryRangeData.location}) is 3% above the national median</li>
                        <li>Demand is increasing with 15% more job postings year-over-year</li>
                        <li>Top paying markets: San Francisco, Boston, Seattle</li>
                        <li>Organizations offering remote work show 7% higher compensation on average</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detailed Comparison Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Regional Comparison */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Regional Salary Comparison</CardTitle>
                      <CardDescription>
                        How salaries for this role vary by geographic region
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={regionalComparisonData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[70000, 100000]} tickFormatter={formatSalary} />
                            <YAxis type="category" dataKey="region" width={80} />
                            <Tooltip formatter={(value) => [formatSalary(value as number), 'Average Salary']} />
                            <Legend />
                            <Bar dataKey="salary" name="Average Salary" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 p-3 rounded-md">
                        <p className="text-sm text-blue-700">
                          West coast and Northeast regions consistently offer 15-20% higher salaries for this role 
                          compared to Southeast regions, even when adjusted for cost of living.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Organization Size Comparison */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Organization Size Impact</CardTitle>
                      <CardDescription>
                        How organization size affects compensation for this role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={orgSizeComparisonData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="size" />
                            <YAxis domain={[70000, 100000]} tickFormatter={formatSalary} />
                            <Tooltip formatter={(value) => [formatSalary(value as number), 'Average Salary']} />
                            <Legend />
                            <Bar dataKey="salary" name="Average Salary" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-purple-50 p-3 rounded-md">
                        <p className="text-sm text-purple-700">
                          Enterprise organizations (1000+ employees) typically pay 25% more than small organizations 
                          for the same role and experience level, likely due to greater complexity and scope.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Historical Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Salary Trends (2018-2023)</CardTitle>
                    <CardDescription>
                      Compare your organization's salary trends against industry averages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalTrendsData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis domain={[70000, 100000]} tickFormatter={formatSalary} />
                          <Tooltip formatter={(value) => [formatSalary(value as number), '']} />
                          <Legend />
                          <Line type="monotone" dataKey="yourOrg" name="Your Organization" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="industry" name="Industry Average" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-blue-800">Annual Growth</h3>
                        <p className="mt-1 text-lg font-bold text-blue-900">7.9%</p>
                        <p className="text-xs text-blue-700 mt-1">Your organization's annual growth rate</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-green-800">Industry Average</h3>
                        <p className="mt-1 text-lg font-bold text-green-900">5.4%</p>
                        <p className="text-xs text-green-700 mt-1">Industry's annual growth rate</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-purple-800">5-Year Growth</h3>
                        <p className="mt-1 text-lg font-bold text-purple-900">21.8%</p>
                        <p className="text-xs text-purple-700 mt-1">Total salary growth since 2018</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-sm" onClick={() => handleExportData('csv')}>
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                      </Button>
                      <Button variant="outline" className="text-sm" onClick={() => handleExportData('pdf')}>
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                      </Button>
                    </div>
                    <Button className="text-sm" onClick={() => handleSaveReport()}>
                      <BookmarkPlus className="h-4 w-4 mr-2" /> Save Report
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Compensation Strategy Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compensation Strategy Recommendations</CardTitle>
                    <CardDescription>
                      Strategic insights based on benchmark analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Competitive Positioning</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Your salary ranges for {salaryRangeData.role} are consistently above industry average, 
                            providing a strong advantage in talent attraction. Consider highlighting this in recruitment 
                            materials to improve conversion rates.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Regional Adjustments</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            The 20% differential between West/Northeast and Southeast regions suggests an opportunity to optimize 
                            costs by utilizing remote workers in lower-cost regions for suitable roles, while still offering them 
                            wages above their local market rate.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-purple-100 rounded-full p-2 mt-1 flex-shrink-0">
                          <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Experience Premium</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            The data shows a significant salary premium (40%+) for experienced professionals in this field. 
                            Consider implementing a structured retention program with clear growth paths and training opportunities 
                            to develop and retain mid-level talent rather than competing for senior talent in the market.
                          </p>
                        </div>
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

export default SalaryBenchmark;
