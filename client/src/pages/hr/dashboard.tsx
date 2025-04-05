import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import CardMetric from '@/components/ui/card-metric';
import { MetricCardData, BLSOccupation } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Mail, Filter, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from '@/lib/queryClient';

const HRDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // UI filter states
  const [timeframeFilter, setTimeframeFilter] = useState<string>('monthly');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all_specialties');
  const [regionFilter, setRegionFilter] = useState<string>('all_regions');
  
  // Fetch HR analytics data with dynamic filters
  const { data: trendsData, isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ['/api/hr/trend-analysis', timeframeFilter, specialtyFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (timeframeFilter) params.append('timeframe', timeframeFilter);
      if (specialtyFilter) params.append('specialty', specialtyFilter);
      
      const response = await fetch(`/api/hr/trend-analysis?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch trend analysis data');
      return response.json();
    }
  });
  
  // Fetch job data from BLS
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/bls/jobs'],
  });
  
  // Fetch regional analysis with dynamic filtering
  const { data: regionalData, isLoading: regionalLoading, refetch: refetchRegional } = useQuery({
    queryKey: ['/api/hr/regional-analysis', regionFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (regionFilter) params.append('region', regionFilter);
      
      const response = await fetch(`/api/hr/regional-analysis?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch regional analysis data');
      return response.json();
    },
    enabled: !!regionFilter  // Only run this query when a region is selected
  });
  
  // Handle filter changes
  const handleTimeframeChange = (value: string) => {
    setTimeframeFilter(value);
  };
  
  const handleSpecialtyChange = (value: string) => {
    setSpecialtyFilter(value);
  };
  
  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
  };
  
  // Handle data refresh
  const handleRefreshData = async () => {
    try {
      await Promise.all([refetchTrends(), refetchRegional()]);
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated with latest information",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not update dashboard data",
        variant: "destructive"
      });
    }
  };
  
  // Handle export data
  const handleExportData = async () => {
    try {
      // Simulate exporting data to CSV
      toast({
        title: "Data Exported",
        description: "Dashboard data has been exported to CSV",
      });
      
      // In a real app, this would make an API call to generate and download a CSV file
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not export dashboard data",
      });
    }
  };
  
  // Handle schedule report
  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Weekly report has been scheduled for delivery",
    });
  };
  
  // HR metrics data
  const metricsData: MetricCardData[] = [
    {
      title: 'Talent Pool Size',
      value: '24,580',
      change: '8% from last quarter',
      trend: 'up',
      icon: 'fas fa-users',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Avg. Time-to-Fill',
      value: '43 days',
      change: '5 days longer than Q1',
      trend: 'down',
      icon: 'fas fa-hourglass-half',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: '1-Year Retention',
      value: '82%',
      change: '3% improvement',
      trend: 'up',
      icon: 'fas fa-heart',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Candidate Satisfaction',
      value: '4.2/5.0',
      change: 'Based on 325 responses',
      trend: 'neutral',
      icon: 'fas fa-smile',
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];
  
  // Job openings vs applicants data
  const jobOpeningsVsApplicantsData = [
    { month: 'Jan', openings: 120, applicants: 240 },
    { month: 'Feb', openings: 135, applicants: 230 },
    { month: 'Mar', openings: 140, applicants: 250 },
    { month: 'Apr', openings: 155, applicants: 260 },
    { month: 'May', openings: 170, applicants: 270 },
    { month: 'Jun', openings: 180, applicants: 290 },
    { month: 'Jul', openings: 190, applicants: 310 },
    { month: 'Aug', openings: 200, applicants: 320 },
    { month: 'Sep', openings: 210, applicants: 315 },
    { month: 'Oct', openings: 205, applicants: 330 },
    { month: 'Nov', openings: 220, applicants: 350 },
    { month: 'Dec', openings: 230, applicants: 340 }
  ];
  
  // Year-over-year growth data
  const yoyGrowthData = [
    { specialty: 'Data Science', growth: 28 },
    { specialty: 'Clinical Informatics', growth: 22 },
    { specialty: 'EHR Implementation', growth: 15 },
    { specialty: 'Health IT Security', growth: 18 }
  ];
  
  // Turnover rates data
  const turnoverRatesData = [
    { role: 'Health Data Scientist', rate: 12 },
    { role: 'Clinical Systems Analyst', rate: 15 },
    { role: 'Health IT Project Manager', rate: 18 },
    { role: 'Medical Informaticist', rate: 14 },
    { role: 'EHR Implementation Specialist', rate: 22 }
  ];
  
  // Salary benchmark data
  const salaryTrendsData = [
    { year: 2018, actual: 72000, industry: 70000 },
    { year: 2019, actual: 75500, industry: 72500 },
    { year: 2020, actual: 79000, industry: 75000 },
    { year: 2021, actual: 82500, industry: 78000 },
    { year: 2022, actual: 87250, industry: 82000 },
    { year: 2023, actual: 92000, industry: 86000 }
  ];
  
  // Format salary for display
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Loading indicator
  if (trendsLoading) {
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
                    <h1 className="text-2xl font-semibold text-gray-900">HR Professional Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">Healthcare talent insights and market analytics to help with recruitment and retention.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleRefreshData}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleScheduleReport}
                    >
                      <Mail className="h-4 w-4" />
                      Schedule Report
                    </Button>
                  </div>
                </div>
                
                {/* Filter controls */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Dashboard Filters</CardTitle>
                    <CardDescription>
                      Customize your view with real-time data filters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Time period filter */}
                      <div className="space-y-2">
                        <Label htmlFor="timeframe">Time Period</Label>
                        <Select 
                          value={timeframeFilter} 
                          onValueChange={(value) => {
                            handleTimeframeChange(value);
                            refetchTrends();
                          }}
                          defaultValue="monthly"
                        >
                          <SelectTrigger id="timeframe">
                            <SelectValue>
                              {timeframeFilter === 'monthly' ? 'Monthly' : 
                               timeframeFilter === 'quarterly' ? 'Quarterly' : 
                               'Monthly'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Specialty filter */}
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty Area</Label>
                        <Select 
                          value={specialtyFilter} 
                          onValueChange={(value) => {
                            handleSpecialtyChange(value);
                            refetchTrends();
                          }}
                          defaultValue="all_specialties"
                        >
                          <SelectTrigger id="specialty">
                            <SelectValue>
                              {specialtyFilter === 'all_specialties' ? 'All Specialties' :
                               specialtyFilter === 'Data Science' ? 'Data Science' :
                               specialtyFilter === 'Clinical Informatics' ? 'Clinical Informatics' :
                               specialtyFilter === 'EHR' ? 'EHR Implementation' :
                               specialtyFilter === 'Security' ? 'Health IT Security' :
                               'All Specialties'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_specialties">All Specialties</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Clinical Informatics">Clinical Informatics</SelectItem>
                            <SelectItem value="EHR">EHR Implementation</SelectItem>
                            <SelectItem value="Security">Health IT Security</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Region filter */}
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select 
                          value={regionFilter} 
                          onValueChange={(value) => {
                            handleRegionChange(value);
                            refetchRegional();
                          }}
                          defaultValue="all_regions"
                        >
                          <SelectTrigger id="region">
                            <SelectValue>
                              {regionFilter === 'all_regions' ? 'All Regions' :
                               regionFilter === 'CA' ? 'California' :
                               regionFilter === 'TX' ? 'Texas' :
                               regionFilter === 'NY' ? 'New York' :
                               regionFilter === 'FL' ? 'Florida' :
                               regionFilter === 'IL' ? 'Illinois' :
                               'All Regions'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_regions">All Regions</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Key HR metrics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {metricsData.map((metric, index) => (
                    <CardMetric key={index} data={metric} />
                  ))}
                </div>
                
                {/* Market Trends Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Health Informatics Market Trends</CardTitle>
                    <CardDescription>
                      Year-over-year changes in key metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="openings" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="openings">Job Openings vs. Applicants</TabsTrigger>
                        <TabsTrigger value="growth">YoY Growth by Specialty</TabsTrigger>
                        <TabsTrigger value="turnover">Turnover Rates</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="openings">
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={trendsData?.jobOpeningsVsApplicants ? trendsData.jobOpeningsVsApplicants.months.map((month: string, index: number) => ({
                                month: month,
                                openings: trendsData.jobOpeningsVsApplicants.openings[index],
                                applicants: trendsData.jobOpeningsVsApplicants.applicants[index]
                              })) : jobOpeningsVsApplicantsData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="openings" fill="#e0f2fe" stroke="#3b82f6" name="Job Openings" />
                              <Line type="monotone" dataKey="applicants" stroke="#10b981" name="Qualified Applicants" />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 bg-blue-50 p-4 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Insight:</span> While job openings have increased by 15% over the past 12 months, 
                            the qualified applicant pool has not kept pace, leading to a widening talent gap especially in specialized roles 
                            like Health Data Science.
                          </p>
                          <div className="mt-2 text-xs text-blue-700">
                            Data refreshed: {new Date().toLocaleString()} • Timeframe: {timeframeFilter === 'monthly' ? 'Monthly' : 'Quarterly'}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="growth">
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={trendsData?.yearOverYearGrowth || yoyGrowthData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="specialty" />
                              <YAxis label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                              <Tooltip formatter={(value) => [`${value}%`, 'Growth']} />
                              <Legend />
                              <Bar dataKey="growth" name="YoY Growth %" fill="#8b5cf6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 bg-purple-50 p-4 rounded-md">
                          <p className="text-sm text-purple-800">
                            <span className="font-medium">Insight:</span> {
                              specialtyFilter && specialtyFilter !== 'all_specialties' ? 
                                `${specialtyFilter} roles are showing significant growth, reflecting the industry's increasing focus on specialized talent.` :
                                "Data Science roles within healthcare are showing the fastest growth at 28% year-over-year, reflecting the industry's increasing focus on data-driven decision making and personalized medicine."
                            }
                          </p>
                          <div className="mt-2 text-xs text-purple-700">
                            {specialtyFilter && specialtyFilter !== 'all_specialties' ? `Filtered by: ${specialtyFilter}` : 'Showing all specialties'} • Data refreshed: {new Date().toLocaleString()}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="turnover">
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={turnoverRatesData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="role" />
                              <YAxis label={{ value: 'Turnover %', angle: -90, position: 'insideLeft' }} />
                              <Tooltip formatter={(value) => [`${value}%`, 'Turnover Rate']} />
                              <Legend />
                              <Bar dataKey="rate" name="Annual Turnover %" fill="#f97316" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 bg-orange-50 p-4 rounded-md">
                          <p className="text-sm text-orange-800">
                            <span className="font-medium">Insight:</span> EHR Implementation Specialists 
                            show the highest turnover rate at 22%, indicating potential issues with burnout 
                            or career advancement. Consider implementing improved retention strategies for this role.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                {/* Salary Benchmarking & Skills Gap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Salary Benchmarking Tool */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Salary Benchmarking</CardTitle>
                      <CardDescription>
                        Compare your compensation against industry standards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salaryTrendsData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={formatSalary} />
                            <Tooltip formatter={(value) => [formatSalary(value as number), '']} />
                            <Legend />
                            <Line type="monotone" dataKey="actual" name="Your Organization" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="industry" name="Industry Average" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Insight:</span> Your organization's salaries 
                          consistently outpace the industry average by 7-8%, positioning you well for 
                          talent attraction. However, the gap is narrowing as industry standards rise.
                        </p>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-3">
                        <Button variant="outline" className="text-sm">
                          <Download className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                        <Button className="text-sm">
                          View Detailed Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Top Hiring Challenges */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Hiring Challenges</CardTitle>
                      <CardDescription>
                        Key obstacles reported by healthcare recruiters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Skills Gap</span>
                            <span className="text-sm text-gray-500">78%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Competitive Compensation</span>
                            <span className="text-sm text-gray-500">65%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Limited Talent Pool</span>
                            <span className="text-sm text-gray-500">61%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '61%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Role Clarity</span>
                            <span className="text-sm text-gray-500">52%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Time-to-Hire</span>
                            <span className="text-sm text-gray-500">47%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Recommendation:</span> Focus on building 
                          internal training programs to address the skills gap, especially for 
                          healthcare-specific data science and analytics skills which are most lacking.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Emerging Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emerging Trends in Health Informatics</CardTitle>
                    <CardDescription>
                      Key insights to inform your talent strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800">Top Emerging Skill</h3>
                        <p className="mt-1 text-xl font-bold text-blue-900">AI in Healthcare</p>
                        <p className="text-xs text-blue-700 mt-1">73% increase in job descriptions</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-green-800">Fastest Growing Role</h3>
                        <p className="mt-1 text-xl font-bold text-green-900">Health Data Scientist</p>
                        <p className="text-xs text-green-700 mt-1">32% YoY increase in job postings</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-purple-800">Competitive Insight</h3>
                        <p className="mt-1 text-xl font-bold text-purple-900">Remote Work</p>
                        <p className="text-xs text-purple-700 mt-1">58% of openings offer remote options</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Strategic Recommendations</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs mt-0.5 mr-2">1</div>
                          <span>Prioritize upskilling current employees in healthcare AI and ML to address the growing demand without relying solely on competitive external hiring.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs mt-0.5 mr-2">2</div>
                          <span>Expand remote work options to remain competitive in attracting top talent, especially for data science and analytics roles where remote work has become standard.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs mt-0.5 mr-2">3</div>
                          <span>Consider implementing a specialized retention strategy for EHR Implementation Specialists to address the high turnover rate in this critical role.</span>
                        </li>
                      </ul>
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

export default HRDashboard;
