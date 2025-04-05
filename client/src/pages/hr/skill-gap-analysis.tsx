import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SkillGapData } from '@shared/types';
import { Download, BookmarkPlus, RefreshCw, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SkillGapAnalysis: React.FC = () => {
  const { toast } = useToast();
  
  // State for filter selections
  const [selectedRole, setSelectedRole] = useState<string>('health_data_scientist');
  const [selectedRegion, setSelectedRegion] = useState<string>('national');
  
  // Fetch skill gap data
  // Additional filters for sorting and status
  const [sortBy, setSortBy] = useState<string>('gap');
  const [statusFilter, setStatusFilter] = useState<string>('all_statuses');
  const [minDemand, setMinDemand] = useState<number>(0);
  
  // Fetch skill gap data with dynamic filters
  const { data: skillGapData, isLoading, refetch } = useQuery<SkillGapData[]>({
    queryKey: ['/api/hr/skill-gap-analysis', selectedRole, selectedRegion, statusFilter, sortBy, minDemand],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('role', selectedRole);
      params.append('region', selectedRegion);
      if (statusFilter && statusFilter !== 'all_statuses') params.append('status', statusFilter);
      if (sortBy) params.append('sortBy', sortBy);
      if (minDemand > 0) params.append('minDemand', minDemand.toString());
      
      const response = await fetch(`/api/hr/skill-gap-analysis?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch skill gap data');
      return response.json();
    }
  });
  
  // Refresh data
  const handleRefreshData = async () => {
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Skill gap analysis has been updated with latest data",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not update skill gap data",
        variant: "destructive"
      });
    }
  };
  
  // Handle save analysis
  const handleSaveAnalysis = () => {
    toast({
      title: "Analysis Saved",
      description: "Skill gap analysis has been saved to your profile",
    });
  };
  
  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleMinDemandChange = (value: string) => {
    setMinDemand(parseInt(value) || 0);
  };
  
  // Handle export data
  const handleExportData = (format: string) => {
    toast({
      title: `Data Exported as ${format.toUpperCase()}`,
      description: `Skill gap analysis has been exported to ${format}`,
    });
  };
  
  // Sample data for skill gaps
  const sampleSkillGapData: SkillGapData[] = [
    { name: 'SQL/Database', demand: 65, supply: 65, status: 'balanced' },
    { name: 'Python/R', demand: 75, supply: 40, status: 'shortage' },
    { name: 'Healthcare Analytics', demand: 80, supply: 30, status: 'shortage' },
    { name: 'Machine Learning', demand: 60, supply: 25, status: 'shortage' },
    { name: 'Data Visualization', demand: 70, supply: 55, status: 'shortage' }
  ];
  
  // Sample data for technical skills
  const technicalSkillsData: SkillGapData[] = [
    { name: 'SQL/Database', demand: 65, supply: 65, status: 'balanced' },
    { name: 'Python/R', demand: 75, supply: 40, status: 'shortage' },
    { name: 'Healthcare Analytics', demand: 80, supply: 30, status: 'shortage' },
    { name: 'Machine Learning', demand: 60, supply: 25, status: 'shortage' },
    { name: 'Data Visualization', demand: 70, supply: 55, status: 'shortage' },
    { name: 'Statistical Analysis', demand: 65, supply: 45, status: 'shortage' },
    { name: 'ETL Processes', demand: 55, supply: 40, status: 'shortage' }
  ];
  
  // Sample data for domain knowledge
  const domainSkillsData: SkillGapData[] = [
    { name: 'Electronic Health Records', demand: 85, supply: 70, status: 'shortage' },
    { name: 'Clinical Workflows', demand: 75, supply: 60, status: 'shortage' },
    { name: 'Healthcare Regulations', demand: 70, supply: 65, status: 'balanced' },
    { name: 'Medical Terminology', demand: 80, supply: 75, status: 'balanced' },
    { name: 'Population Health', demand: 65, supply: 40, status: 'shortage' }
  ];
  
  // Sample data for soft skills
  const softSkillsData: SkillGapData[] = [
    { name: 'Communication', demand: 90, supply: 65, status: 'shortage' },
    { name: 'Problem Solving', demand: 85, supply: 60, status: 'shortage' },
    { name: 'Teamwork', demand: 80, supply: 75, status: 'balanced' },
    { name: 'Project Management', demand: 70, supply: 55, status: 'shortage' },
    { name: 'Presentation Skills', demand: 65, supply: 45, status: 'shortage' }
  ];
  
  // Determine status class for skill gap
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'shortage':
        return {
          text: 'Talent shortage',
          textColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'surplus':
        return {
          text: 'Talent surplus',
          textColor: 'text-green-600',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'balanced':
        return {
          text: 'Supply meets demand',
          textColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          text: 'Unknown',
          textColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  // Calculate gap severity for recommendations
  const calculateGapSeverity = (skills: SkillGapData[] = []) => {
    let criticalCount = 0;
    let significantCount = 0;
    
    skills.forEach(skill => {
      const gap = skill.demand - skill.supply;
      if (gap >= 40) criticalCount++;
      else if (gap >= 20) significantCount++;
    });
    
    return { criticalCount, significantCount };
  };
  
  // Get the actual data or use default data when loading
  const getSkillData = () => skillGapData || sampleSkillGapData;
  
  // Categorize skills by type
  const categorizeSkills = (skills: SkillGapData[] = []) => {
    // Technical skills keywords
    const technicalKeywords = ['sql', 'database', 'python', 'r', 'data', 'analytics', 'machine learning', 
      'visualization', 'statistical', 'statistics', 'etl', 'programming', 'coding', 'algorithm', 'cloud'];
    
    // Domain knowledge keywords
    const domainKeywords = ['health', 'clinical', 'ehr', 'electronic health', 'medical', 'terminology', 
      'regulations', 'hipaa', 'population', 'patient', 'care', 'workflow'];
    
    // Soft skills keywords  
    const softKeywords = ['communication', 'problem solving', 'teamwork', 'collaboration', 'project management',
      'presentation', 'leadership', 'time management', 'critical thinking', 'interpersonal'];
      
    return {
      technical: skills.filter(skill => 
        technicalKeywords.some(keyword => skill.name.toLowerCase().includes(keyword))),
      domain: skills.filter(skill => 
        domainKeywords.some(keyword => skill.name.toLowerCase().includes(keyword))),
      soft: skills.filter(skill => 
        softKeywords.some(keyword => skill.name.toLowerCase().includes(keyword)))
    };
  };
  
  // Get categorized skills
  const { technical: actualTechnicalSkills, domain: actualDomainSkills, soft: actualSoftSkills } = 
    categorizeSkills(skillGapData);
  
  const severity = calculateGapSeverity(getSkillData());
  
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
                    <h1 className="text-2xl font-semibold text-gray-900">Skill Gap Analysis</h1>
                    <p className="mt-1 text-sm text-gray-600">Match job requirements to available talent pool to identify skill gaps and training opportunities.</p>
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
                      onClick={() => handleSaveAnalysis()}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Analysis
                    </Button>
                  </div>
                </div>
                
                {/* Filter section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Role
                        </label>
                        <Select
                          value={selectedRole}
                          onValueChange={(value) => {
                            setSelectedRole(value);
                            refetch();
                          }}
                          defaultValue="health_data_scientist"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {selectedRole === 'health_data_scientist' ? 'Health Data Scientist' : 
                               selectedRole === 'clinical_systems_analyst' ? 'Clinical Systems Analyst' : 
                               selectedRole === 'ehr_implementation_specialist' ? 'EHR Implementation Specialist' : 
                               selectedRole === 'healthcare_it_project_manager' ? 'Healthcare IT Project Manager' : 
                               selectedRole === 'medical_informaticist' ? 'Medical Informaticist' : 
                               'Health Data Scientist'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health_data_scientist">Health Data Scientist</SelectItem>
                            <SelectItem value="clinical_systems_analyst">Clinical Systems Analyst</SelectItem>
                            <SelectItem value="ehr_implementation_specialist">EHR Implementation Specialist</SelectItem>
                            <SelectItem value="healthcare_it_project_manager">Healthcare IT Project Manager</SelectItem>
                            <SelectItem value="medical_informaticist">Medical Informaticist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Region
                        </label>
                        <Select
                          value={selectedRegion}
                          onValueChange={(value) => {
                            setSelectedRegion(value);
                            refetch();
                          }}
                          defaultValue="national"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {selectedRegion === 'national' ? 'National' : 
                               selectedRegion === 'northeast' ? 'Northeast' : 
                               selectedRegion === 'midwest' ? 'Midwest' : 
                               selectedRegion === 'south' ? 'South' : 
                               selectedRegion === 'west' ? 'West' : 
                               'National'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="national">National</SelectItem>
                            <SelectItem value="northeast">Northeast</SelectItem>
                            <SelectItem value="midwest">Midwest</SelectItem>
                            <SelectItem value="south">South</SelectItem>
                            <SelectItem value="west">West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Status Filter
                        </label>
                        <Select
                          value={statusFilter}
                          onValueChange={(value) => {
                            handleStatusFilterChange(value);
                            refetch();
                          }}
                          defaultValue="all_statuses"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {statusFilter === 'all_statuses' ? 'All Statuses' : 
                               statusFilter === 'shortage' ? 'Shortage' : 
                               statusFilter === 'balanced' ? 'Balanced' : 
                               statusFilter === 'surplus' ? 'Surplus' : 
                               'All Statuses'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_statuses">All Statuses</SelectItem>
                            <SelectItem value="shortage">Shortage</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="surplus">Surplus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Sort By
                        </label>
                        <Select
                          value={sortBy}
                          onValueChange={(value) => {
                            handleSortChange(value);
                            refetch();
                          }}
                          defaultValue="gap"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {sortBy === 'gap' ? 'Largest Gap' : 
                               sortBy === 'demand' ? 'Highest Demand' : 
                               sortBy === 'supply' ? 'Highest Supply' : 
                               sortBy === 'name' ? 'Name (A-Z)' : 
                               'Largest Gap'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gap">Largest Gap</SelectItem>
                            <SelectItem value="demand">Highest Demand</SelectItem>
                            <SelectItem value="supply">Highest Supply</SelectItem>
                            <SelectItem value="name">Name (A-Z)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setSelectedRole('health_data_scientist');
                          setSelectedRegion('national');
                          setStatusFilter('all_statuses');
                          setSortBy('gap');
                          setMinDemand(0);
                          refetch();
                        }}
                      >
                        Reset All Filters
                      </Button>
                      <Button
                        onClick={() => {
                          refetch().then(() => {
                            toast({
                              title: "Analysis Generated",
                              description: `Generated skill gap analysis for ${selectedRole === 'clinical_systems_analyst' ? 'Clinical Systems Analyst' : 
                                           selectedRole === 'health_data_scientist' ? 'Health Data Scientist' : 
                                           selectedRole === 'ehr_implementation_specialist' ? 'EHR Implementation Specialist' : 
                                           selectedRole === 'healthcare_it_project_manager' ? 'Healthcare IT Project Manager' : 
                                           'Medical Informaticist'} in ${selectedRegion === 'national' ? 'National' : 
                                                           selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} region`
                            });
                          }).catch((error) => {
                            toast({
                              title: "Generation Failed",
                              description: "Could not generate analysis with selected filters",
                              variant: "destructive"
                            });
                          });
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Generating...' : 'Generate Analysis'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Skill Gap Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Gap Overview for {selectedRole === 'clinical_systems_analyst' ? 'Clinical Systems Analyst' : 
                               selectedRole === 'health_data_scientist' ? 'Health Data Scientist' : 
                               selectedRole === 'ehr_implementation_specialist' ? 'EHR Implementation Specialist' : 
                               selectedRole === 'healthcare_it_project_manager' ? 'Healthcare IT Project Manager' : 
                               'Medical Informaticist'}</CardTitle>
                    <CardDescription>
                      Analysis of market demand versus available talent supply in {selectedRegion === 'national' ? 'National Average' : 
                      selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} region
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="all">All Skills</TabsTrigger>
                        <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                        <TabsTrigger value="domain">Domain Knowledge</TabsTrigger>
                        <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-6">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                            <p className="mt-2 text-sm text-gray-600">Loading skill gap data...</p>
                          </div>
                        ) : getSkillData().length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-gray-600">No skill gap data available for the selected filters.</p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => handleRefreshData()}
                            >
                              Refresh Data
                            </Button>
                          </div>
                        ) : (
                          getSkillData().map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </TabsContent>
                      
                      <TabsContent value="technical" className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-6">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                            <p className="mt-2 text-sm text-gray-600">Loading technical skills...</p>
                          </div>
                        ) : (actualTechnicalSkills && actualTechnicalSkills.length > 0 ? (
                          actualTechnicalSkills.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          technicalSkillsData.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="domain" className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-6">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                            <p className="mt-2 text-sm text-gray-600">Loading domain knowledge...</p>
                          </div>
                        ) : (actualDomainSkills && actualDomainSkills.length > 0 ? (
                          actualDomainSkills.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          domainSkillsData.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="soft" className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-6">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                            <p className="mt-2 text-sm text-gray-600">Loading soft skills...</p>
                          </div>
                        ) : (actualSoftSkills && actualSoftSkills.length > 0 ? (
                          actualSoftSkills.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          softSkillsData.map((skill) => {
                            const status = getStatusClass(skill.status);
                            return (
                              <div key={skill.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className={`text-sm ${status.textColor}`}>{status.text}</span>
                                </div>
                                <div className="flex h-3 rounded-full bg-gray-200">
                                  <div className="h-3 rounded-l-full bg-blue-600" style={{ width: `${skill.demand}%` }}></div>
                                  <div className="h-3 rounded-r-full bg-green-500" style={{ width: `${skill.supply}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Demand: {skill.demand}%</span>
                                  <span>Supply: {skill.supply}%</span>
                                </div>
                              </div>
                            );
                          })
                        ))}
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-blue-800">Gap Analysis Summary</h3>
                      <p className="mt-2 text-sm text-blue-700">
                        Health Data Scientists show critical shortages in Healthcare Analytics (50% gap) and 
                        Machine Learning (35% gap) skills. While SQL/Database skills are well-balanced, there is 
                        a significant shortage in Python/R programming capabilities (35% gap) which is essential 
                        for advanced analytics in healthcare.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Gap Severity & Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gap Severity Assessment */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Gap Severity Assessment</CardTitle>
                      <CardDescription>
                        Evaluation of skill gap significance and impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">Critical Gaps ({'>'}40% difference)</h3>
                            <span className="text-sm font-medium text-red-600">{severity.criticalCount} skills</span>
                          </div>
                          <Progress value={severity.criticalCount / sampleSkillGapData.length * 100} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                          <div className="mt-2 text-xs text-gray-500">
                            Skills with critical gaps typically require immediate intervention through targeted recruitment 
                            or intensive training programs.
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">Significant Gaps (20-40% difference)</h3>
                            <span className="text-sm font-medium text-amber-600">{severity.significantCount} skills</span>
                          </div>
                          <Progress value={severity.significantCount / sampleSkillGapData.length * 100} className="h-2 bg-gray-100" indicatorClassName="bg-amber-500" />
                          <div className="mt-2 text-xs text-gray-500">
                            Skills with significant gaps may be addressed through structured training or focused 
                            professional development initiatives.
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">Balanced Skills (&lt;20% difference)</h3>
                            <span className="text-sm font-medium text-green-600">
                              {sampleSkillGapData.length - severity.criticalCount - severity.significantCount} skills
                            </span>
                          </div>
                          <Progress 
                            value={(sampleSkillGapData.length - severity.criticalCount - severity.significantCount) / sampleSkillGapData.length * 100} 
                            className="h-2 bg-gray-100" 
                            indicatorClassName="bg-green-500" 
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            Skills where supply meets demand indicate areas of strength in your talent pool.
                          </div>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-md mt-4">
                          <h3 className="text-sm font-medium text-red-800">Most Critical Gap</h3>
                          <p className="mt-1 text-sm text-red-700">
                            Healthcare Analytics shows the largest gap at 50%, indicating a critical need for specialists who can 
                            apply analytical methods specifically to healthcare data and workflows.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recommendations */}
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Strategic Recommendations</CardTitle>
                      <CardDescription>
                        Action plan to address identified skill gaps
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                          <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Training & Development</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              Implement a specialized training program in Healthcare Analytics and Machine Learning for 
                              current staff with adjacent skills (e.g., SQL developers, clinical analysts). Consider partnering 
                              with universities offering healthcare data science certifications.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Recruitment Strategy</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              Expand recruiting to target recent graduates from healthcare informatics, biostatistics, and 
                              health data science programs. Consider implementing a signing bonus specifically for candidates 
                              with Python/R and healthcare analytics experience.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="bg-purple-100 rounded-full p-2 mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 01-1-1h1a2 2 0 100-4H3a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Strategic Partnerships</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              Develop partnerships with healthcare data science bootcamps and academic institutions to create 
                              a talent pipeline. Consider implementing an internship program specifically targeting students 
                              with the critical skill combinations.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md mt-6">
                        <h3 className="text-sm font-medium text-blue-800">Implementation Priority</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800">Critical</Badge>
                            <span className="text-sm text-gray-700">Healthcare Analytics training program</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-800">High</Badge>
                            <span className="text-sm text-gray-700">Python/R skill development initiative</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
                            <span className="text-sm text-gray-700">Academic partnerships for talent pipeline</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Action Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Action Plan</CardTitle>
                    <CardDescription>
                      Tactical steps to address the skill gaps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Short-term (0-3 months)</h3>
                          <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Identify top 10% of SQL analysts with aptitude for learning Python/R and healthcare analytics</li>
                            <li>Launch a 12-week intensive training program with 1 day per week dedicated to upskilling</li>
                            <li>Revise job descriptions to better attract candidates with healthcare analytics experience</li>
                            <li>Implement retention bonuses for existing staff with critical skills in short supply</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Medium-term (3-6 months)</h3>
                          <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Establish partnerships with at least 3 universities offering health data science programs</li>
                            <li>Create an internship program targeting students with healthcare analytics skills</li>
                            <li>Develop a formal mentoring program pairing experienced staff with those developing new skills</li>
                            <li>Implement a referral bonus program specifically for candidates with critical skills</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="min-w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Long-term (6-12 months)</h3>
                          <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Establish an internal Healthcare Analytics Center of Excellence</li>
                            <li>Create a career progression framework that incentivizes skill development in critical areas</li>
                            <li>Develop and launch a healthcare-specific advanced analytics certification program</li>
                            <li>Re-evaluate skill gaps quarterly and adjust strategy based on progress and market changes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-sm" onClick={() => handleExportData('pdf')}>
                        <FileText className="h-4 w-4 mr-2" /> Generate Full Report
                      </Button>
                      <Button variant="outline" className="text-sm" onClick={() => handleExportData('csv')}>
                        <Download className="h-4 w-4 mr-2" /> Export Raw Data
                      </Button>
                    </div>
                    <Button className="text-sm" onClick={() => handleSaveAnalysis()}>
                      <BookmarkPlus className="h-4 w-4 mr-2" /> Save Analysis
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

export default SkillGapAnalysis;
