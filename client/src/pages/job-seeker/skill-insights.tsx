import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skill } from '@shared/schema';
import { Loader2, TrendingUp, BookmarkPlus, Download } from 'lucide-react';

// Temporary fallback demo data
const fallbackSkills: Skill[] = [
  { id: 1, name: 'Data Analysis', demand: 85, category: 'Technical' },
  { id: 2, name: 'SQL', demand: 80, category: 'Technical' },
  { id: 3, name: 'Communication', demand: 78, category: 'Soft' },
  { id: 4, name: 'Project Management', demand: 75, category: 'Soft' },
  { id: 5, name: 'EHR Systems', demand: 72, category: 'Technical' },
  { id: 6, name: 'Healthcare IT', demand: 70, category: 'Technical' },
  { id: 7, name: 'Critical Thinking', demand: 68, category: 'Soft' },
  { id: 8, name: 'Data Governance', demand: 65, category: 'Technical' },
  { id: 9, name: 'Team Collaboration', demand: 63, category: 'Soft' },
  { id: 10, name: 'Python', demand: 60, category: 'Technical' },
];

const SkillInsights: React.FC = () => {
  const { toast } = useToast();
  const [selectedJobRole, setSelectedJobRole] = useState<string>('all');

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const handleSaveInsight = () => {
    toast({
      title: 'Insight Saved',
      description: 'Skills analysis has been saved to your profile',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Data Exported',
      description: 'Skills data has been exported to CSV',
    });
  };

  const activeSkills = skills && skills.length > 0 ? skills : fallbackSkills;

  const groupedSkills = activeSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const topSkillsChartData = [...activeSkills]
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 10)
    .map(skill => ({
      name: skill.name,
      demand: skill.demand,
    }));

  const categories = Object.keys(groupedSkills);

  if (skillsLoading && jobRolesLoading) {
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Skills Insights</h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Analyze in-demand skills in the health informatics field and identify growth opportunities.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleSaveInsight}>
                      <BookmarkPlus className="h-4 w-4" />
                      Save Insight
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Filter by Job Role
                        </label>
                        <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
                          <SelectTrigger className="w-full md:w-[300px]">
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

                      <div className="flex items-end gap-2">
                        <Button variant="secondary" onClick={() => setSelectedJobRole('all')}>
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Skills in Demand</CardTitle>
                    <CardDescription>
                      Most sought-after skills in health informatics based on job listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topSkillsChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Demand Score', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={value => [`${value}%`, 'Demand']} />
                          <Legend />
                          <Bar dataKey="demand" name="Demand Score" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {categories.map(category => (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle>{category}</CardTitle>
                        <CardDescription>{groupedSkills[category].length} skills in this category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {groupedSkills[category]
                            .sort((a, b) => b.demand - a.demand)
                            .map(skill => (
                              <div key={skill.id} className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                  <span className="text-sm text-gray-500">{skill.demand}% demand</span>
                                </div>
                                <Progress value={skill.demand} className="h-2" />
                                <div className="flex gap-2 mt-1">
                                  {skill.demand > 80 && (
                                    <Badge variant="outline" className="text-green-600 bg-green-50">
                                      High Demand
                                    </Badge>
                                  )}
                                  {skill.demand > 60 && skill.demand <= 80 && (
                                    <Badge variant="outline" className="text-blue-600 bg-blue-50">
                                      Growing
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
