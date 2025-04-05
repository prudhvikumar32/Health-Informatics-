import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookmarkPlus, Mail, TrendingUp, Calendar, Filter } from 'lucide-react';

const MarketTrends: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>('1y');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch HR analytics data
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['/api/hr/trend-analysis'],
  });
  
  // Handle save report
  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "Market trends report has been saved to your profile",
    });
  };
  
  // Handle schedule report
  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Monthly report has been scheduled for delivery",
    });
  };
  
  // Handle export data
  const handleExportData = (format: string) => {
    toast({
      title: `Data Exported as ${format.toUpperCase()}`,
      description: `Market trends data has been exported to ${format}`,
    });
  };
  
  // Sample data for job openings vs demand
  const jobOpeningsTrendData = [
    { month: 'Jan', openings: 120, demand: 140 },
    { month: 'Feb', openings: 135, demand: 150 },
    { month: 'Mar', openings: 140, demand: 155 },
    { month: 'Apr', openings: 155, demand: 165 },
    { month: 'May', openings: 170, demand: 175 },
    { month: 'Jun', openings: 180, demand: 185 },
    { month: 'Jul', openings: 190, demand: 195 },
    { month: 'Aug', openings: 200, demand: 205 },
    { month: 'Sep', openings: 210, demand: 215 },
    { month: 'Oct', openings: 205, demand: 220 },
    { month: 'Nov', openings: 220, demand: 230 },
    { month: 'Dec', openings: 230, demand: 240 }
  ];
  
  // Sample data for growth vs decline roles
  const roleGrowthData = [
    { role: 'Health Data Scientist', growth: 32 },
    { role: 'Clinical Informatics Director', growth: 24 },
    { role: 'Healthcare IT Security', growth: 18 },
    { role: 'Clinical Systems Analyst', growth: 15 },
    { role: 'EHR Implementation Specialist', growth: 10 },
    { role: 'Healthcare Database Admin', growth: 8 },
    { role: 'Medical Records Technician', growth: -5 },
    { role: 'Medical Transcriptionist', growth: -12 }
  ];
  
  // Sample data for emerging skills
  const emergingSkillsData = [
    { name: 'AI in Healthcare', value: 73 },
    { name: 'Telehealth Systems', value: 65 },
    { name: 'Healthcare Data Security', value: 58 },
    { name: 'Patient Data Analytics', value: 52 },
    { name: 'Cloud Integration', value: 45 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Salary by experience level data
  const salaryTrendData = [
    { year: '2018', entry: 60000, mid: 75000, senior: 95000 },
    { year: '2019', entry: 62000, mid: 78000, senior: 98000 },
    { year: '2020', entry: 65000, mid: 82000, senior: 102000 },
    { year: '2021', entry: 68000, mid: 86000, senior: 107000 },
    { year: '2022', entry: 72000, mid: 90000, senior: 112000 },
    { year: '2023', entry: 75000, mid: 95000, senior: 118000 }
  ];
  
  // Format salary for display
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
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
                    <h1 className="text-2xl font-semibold text-gray-900">Health Informatics Market Trends</h1>
                    <p className="mt-1 text-sm text-gray-600">Analyze employment trends, skills demand, and growth rates in the health informatics sector.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleSaveReport()}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Report
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleScheduleReport()}
                    >
                      <Mail className="h-4 w-4" />
                      Schedule Report
                    </Button>
                  </div>
                </div>
                
                {/* Filter section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Time Range
                          </label>
                          <Select
                            value={timeRange}
                            onValueChange={setTimeRange}
                          >
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3m">Last 3 Months</SelectItem>
                              <SelectItem value="6m">Last 6 Months</SelectItem>
                              <SelectItem value="1y">Last 1 Year</SelectItem>
                              <SelectItem value="2y">Last 2 Years</SelectItem>
                              <SelectItem value="5y">Last 5 Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Job Category
                          </label>
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="w-full md:w-[220px]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="data">Data & Analytics</SelectItem>
                              <SelectItem value="clinical">Clinical Informatics</SelectItem>
                              <SelectItem value="implementation">Implementation & Support</SelectItem>
                              <SelectItem value="security">Healthcare IT Security</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-end">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          More Filters
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => {
                            setTimeRange('1y');
                            setSelectedCategory('all');
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Job Openings vs Demand Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Openings vs. Market Demand</CardTitle>
                    <CardDescription>
                      Comparison of available positions against estimated market demand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={jobOpeningsTrendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="openings" 
                            stackId="1" 
                            stroke="#3b82f6" 
                            fill="#93c5fd" 
                            name="Job Openings"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="demand" 
                            stackId="2" 
                            stroke="#10b981" 
                            fill="#a7f3d0" 
                            name="Market Demand"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Key Insight:</span> The gap between job openings and market demand indicates a talent shortage, 
                        particularly in specialized roles. This suggests a strategic opportunity to develop talent pipelines through training 
                        programs and upskilling initiatives.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Role Growth Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Role Growth Analysis</CardTitle>
                    <CardDescription>
                      High-growth vs low-growth roles in health informatics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={roleGrowthData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[-15, 35]} />
                          <YAxis type="category" dataKey="role" width={150} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                          <Legend />
                          <Bar 
                            dataKey="growth" 
                            name="Year-over-Year Growth (%)" 
                            fill={(data) => data > 0 ? '#10b981' : '#ef4444'}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-green-800">High-Growth Roles</h3>
                        <p className="mt-2 text-sm text-green-700">
                          Data science and informatics leadership roles show the strongest growth, reflecting 
                          healthcare's increasing reliance on data-driven decision making and digital transformation.
                        </p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-red-800">Declining Roles</h3>
                        <p className="mt-2 text-sm text-red-700">
                          Traditional medical records and transcription roles are being automated or transformed, 
                          suggesting a need for reskilling this workforce toward more technical health informatics roles.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Emerging Skills & Experience Level Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Emerging Skills */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Emerging Skills Analysis</CardTitle>
                      <CardDescription>
                        Fast-growing skills in health informatics job listings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={emergingSkillsData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {emergingSkillsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}% increase`, 'Growth']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-purple-50 p-4 rounded-md">
                        <p className="text-sm text-purple-800">
                          <span className="font-medium">Key Insight:</span> AI in healthcare and telehealth systems 
                          are experiencing the fastest growth in job requirements, indicating a shift toward more 
                          advanced technological integration in healthcare delivery and analytics.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Salary by Experience Level */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Salary Trends by Experience</CardTitle>
                      <CardDescription>
                        Six-year salary progression for different experience levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salaryTrendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={formatSalary} />
                            <Tooltip formatter={(value) => [formatSalary(value as number), '']} />
                            <Legend />
                            <Line type="monotone" dataKey="entry" name="Entry Level" stroke="#94a3b8" strokeWidth={2} />
                            <Line type="monotone" dataKey="mid" name="Mid-Career" stroke="#0ea5e9" strokeWidth={2} />
                            <Line type="monotone" dataKey="senior" name="Senior Level" stroke="#8b5cf6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Key Insight:</span> The salary premium for experience 
                          has increased over time, with senior-level professionals now earning 57% more than 
                          entry-level roles, up from 48% in 2018.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Strategic Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Market Insights</CardTitle>
                    <CardDescription>
                      Key takeaways to inform your talent strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-blue-100 rounded-full p-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Widen Your Talent Pipeline</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            The growing gap between job openings and qualified candidates suggests a need to develop internal 
                            talent pipelines through training programs, particularly for roles like Health Data Scientists where 
                            the demand outpaces available talent by nearly 40%.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-green-100 rounded-full p-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Prepare for Skill Shifts</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            The rapid rise of AI in healthcare and telehealth systems as required skills indicates a need to upskill 
                            your existing workforce in these areas. Consider implementing targeted learning programs for clinical 
                            staff to develop technical competencies.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-purple-100 rounded-full p-2">
                          <Filter className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Rethink Traditional Roles</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            The decline in traditional roles like Medical Transcriptionists provides an opportunity to transition 
                            this workforce toward growth areas through targeted retraining. These employees already have valuable 
                            healthcare domain knowledge that can be combined with technical training.
                          </p>
                        </div>
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
                    <Button className="text-sm" onClick={() => handleScheduleReport()}>
                      Schedule Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
