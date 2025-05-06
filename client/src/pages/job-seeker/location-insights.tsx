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
import { useCSVData } from "../job-seeker/useCSVData";
import { useMemo,useEffect} from "react";
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
  const [selectedSpecialty, setSelectedSpecialty] = useState("all_specialties");
  const specialtyKeywords: Record<string, string[]> = {
    "Data & Analytics": ["data", "analytics", "scientist", "engineer"],
    "Clinical Informatics": ["clinical", "ehr", "medical", "applications"],
    "Health IT Management": ["manager", "project", "consultant"],
    "Public & Population Health": ["population", "public"],
    "Coding & Terminology": ["coder", "terminology"],
    "Telehealth & Remote Care": ["telehealth"]
  };

  const matchesSpecialty = (job: Record<string, any>) =>
    selectedSpecialty === "all_specialties" ||
    (specialtyKeywords[selectedSpecialty] || []).some((keyword) =>
      job["Job Title"]?.toLowerCase().includes(keyword)
    );


   const { data: csvData, loading: csvLoading } = useCSVData();
    useEffect(() => {
      if (!csvLoading && csvData.length > 0) {
        console.log("✅ Loaded CSV data:", csvData.slice(0, 5));
      }
    }, [csvData, csvLoading]);
  // Fetch job roles
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const filteredData = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];
  
    return csvData.filter((job) => {
      const title = job["Job Title"]?.toLowerCase() || "";
  
      const matchesSpecialty =
        selectedSpecialty === "all_specialties" ||
        (specialtyKeywords[selectedSpecialty] || []).some((kw) =>
          title.includes(kw)
        );
  
        const matchesRegion =
      selectedRegion === "all" ||
      (regions[selectedRegion]?.includes(job.State))
      return matchesSpecialty && matchesRegion;
    });
  }, [csvData, selectedSpecialty,selectedRegion]);
  
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
  const filteredLocationData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    return filteredData.filter((job) => {
      const matchesJob =
        selectedJobRole === 'all' ||
        job['Job Title']?.toLowerCase().includes(selectedJobRole.toLowerCase());
  
      const matchesRegion =
        selectedRegion === 'all' || regions[selectedRegion]?.includes(job.State);
  
      return matchesJob && matchesRegion;
    });
  }, [csvData, selectedJobRole, selectedRegion]);
  
  
  const jobDistributionData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    const grouped = filteredData.reduce((acc, row) => {
      const state = row.State?.trim();
      if (!state) return acc;
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const totalJobs = Object.values(grouped).reduce((a, b) => a + b, 0);
  
    return Object.entries(grouped)
      .map(([state, jobCount]) => ({
        state,
        stateCode: stateAbbreviations[state] || state.slice(0, 2).toUpperCase(),
        jobCount,
        percentage: Math.round((jobCount / totalJobs) * 100),
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  }, [filteredData]);
  
  
  // Prepare data for regional distribution pie chart
  const regionalDistributionData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    const grouped = filteredData.reduce((acc, row) => {
      const region = row.Region?.trim();
      if (!region) return acc;
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const totalJobs = Object.values(grouped).reduce((a, b) => a + b, 0);
  
    return Object.entries(grouped)
      .map(([region, jobCount]) => ({
        region,
        jobCount,
        percentage: Math.round((jobCount / totalJobs) * 100),
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  }, [filteredData]);
  
  const workArrangementData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    let remote = 0;
    let onsite = 0;
  
    filteredData.forEach((job) => {
      const value = job["Remote Work"]?.toLowerCase();
      if (value === "yes") remote += 1;
      else onsite += 1;
    });
  
    const total = remote + onsite;
  
    return [
      { name: "Remote", value: Math.round((remote / total) * 100) },
      { name: "On-site", value: Math.round((onsite / total) * 100) },
    ];
  }, [filteredData]);

  const topCities = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    const counts: Record<string, number> = {};
    filteredData.forEach((job) => {
      const city = job["City"]?.trim();
      const state = job["State"]?.trim();
      if (!city || !state) return;
      const key = `${city}, ${state}`;
      counts[key] = (counts[key] || 0) + 1;
    });
  
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // top 6 cities
  }, [filteredData]);

  const remoteTrends = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    const grouped: Record<string, { total: number; remote: number }> = {};
  
    filteredData.forEach((job) => {
      const year = String(job["Year"])?.trim();
      const remote = job["Remote Work"]?.toLowerCase() === "yes";
      if (!year) return;
      if (!grouped[year]) grouped[year] = { total: 0, remote: 0 };
      grouped[year].total += 1;
      if (remote) grouped[year].remote += 1;
    });
  
    return Object.entries(grouped)
      .map(([year, { total, remote }]) => ({
        year,
        percentage: Math.round((remote / total) * 100),
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [csvData]);

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
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
  <SelectTrigger className="w-full md:w-[250px]">
    <SelectValue placeholder="Select a specialty" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all_specialties">All Specialties</SelectItem>
    <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
    <SelectItem value="Clinical Informatics">Clinical Informatics</SelectItem>
    <SelectItem value="Health IT Management">Health IT Management</SelectItem>
    <SelectItem value="Public & Population Health">Public & Population Health</SelectItem>
    <SelectItem value="Coding & Terminology">Coding & Terminology</SelectItem>
    <SelectItem value="Telehealth & Remote Care">Telehealth & Remote Care</SelectItem>
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
  formatter={(value) => [`${value.toLocaleString()} jobs`, 'Job Count']}
  labelFormatter={(label, payload) => {
    if (payload?.[0]?.payload) {
      return `State: ${payload[0].payload.state}`;
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
                    {topCities.map((city, index) => (
                      <div key={city.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                          <span>{city.name}</span>
                        </div>
                        <div className="text-sm font-medium">{city.count.toLocaleString()} jobs</div>
                      </div>
                    ))}
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
                    {remoteTrends.map((item) => (
  <div key={item.year}>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{item.year}</span>
      <span className="text-sm text-gray-500">{item.percentage}% Remote</span>
    </div>
    <div className="bg-gray-200 rounded-full">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${item.percentage}%` }}
      ></div>
    </div>
  </div>
))}
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
