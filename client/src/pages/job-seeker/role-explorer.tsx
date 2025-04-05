import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { JobRole, JobPostingData, SelectedJobData } from '@shared/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, BookmarkPlus, ExternalLink, TrendingUp } from 'lucide-react';
import JobSearch from '@/components/job-seeker/job-search';

const RoleExplorer: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<SelectedJobData[]>([]);

  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery<JobRole[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: roleDetails, isLoading: roleDetailsLoading } = useQuery({
    queryKey: ['/api/jobs', selectedRole],
    enabled: selectedRole !== null,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = jobRoles?.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveRole = (roleId: number) => {
    toast({
      title: 'Role Saved',
      description: 'This role has been added to your saved items',
    });
  };

  const mockJobPostings: JobPostingData[] = [
    {
      id: 1,
      title: 'Healthcare IT Project Manager',
      company: 'Cleveland Clinic',
      location: 'Cleveland, OH',
      salary: '$95,000 - $110,000',
      postedAt: '5 days ago',
      remote: false,
    },
    {
      id: 2,
      title: 'Senior Health Informatics Specialist',
      company: 'Mayo Clinic',
      location: 'Rochester, MN',
      salary: '$105,000 - $125,000',
      postedAt: '1 week ago',
      remote: true,
    },
    {
      id: 3,
      title: 'Healthcare Data Architect',
      company: 'Cerner Corporation',
      location: 'Kansas City, MO',
      salary: '$120,000 - $140,000',
      postedAt: '3 days ago',
      remote: false,
    },
  ];

  const handleJobSelectionChange = (jobs: SelectedJobData[]) => {
    setSelectedJobs(jobs);
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
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Health Informatics Role Explorer</h1>
                  <p className="mt-1 text-sm text-gray-600">Discover detailed information about various health informatics careers and their requirements.</p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search roles by title or keyword"
                          className="pl-8"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="whitespace-nowrap">Filter Options</Button>
                        <Button variant="outline" className="whitespace-nowrap" onClick={() => setSearchTerm('')}>Clear Filters</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <JobSearch
                  jobListings={mockJobPostings}
                  onJobSelectionChange={handleJobSelectionChange}
                />

                {/* The rest of the tabs and detail rendering would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleExplorer;