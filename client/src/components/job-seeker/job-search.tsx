import React, { useState } from 'react';
import { JobPostingData, SelectedJobData } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobSearchProps {
  jobListings: JobPostingData[];
  onJobSelectionChange: (selectedJobs: SelectedJobData[]) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ jobListings, onJobSelectionChange }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<SelectedJobData[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJobSelection = (job: JobPostingData) => {
    // Check if job is already selected
    const isSelected = selectedJobs.some(selectedJob => selectedJob.id === job.id);
    
    if (isSelected) {
      // If already selected, remove it
      const updatedSelectedJobs = selectedJobs.filter(selectedJob => selectedJob.id !== job.id);
      setSelectedJobs(updatedSelectedJobs);
      onJobSelectionChange(updatedSelectedJobs);
      
      toast({
        title: "Job Removed",
        description: `"${job.title}" has been removed from your selection`,
      });
    } else {
      // If not selected, add it
      const newSelectedJob: SelectedJobData = {
        id: job.id || Math.random(),
        title: job.title,
        company: job.company,
        selected: true
      };
      
      const updatedSelectedJobs = [...selectedJobs, newSelectedJob];
      setSelectedJobs(updatedSelectedJobs);
      onJobSelectionChange(updatedSelectedJobs);
      
      toast({
        title: "Job Added",
        description: `"${job.title}" has been added to your selection`,
      });
    }
  };

  const removeSelectedJob = (jobId: number) => {
    const updatedSelectedJobs = selectedJobs.filter(job => job.id !== jobId);
    setSelectedJobs(updatedSelectedJobs);
    onJobSelectionChange(updatedSelectedJobs);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Search Health Informatics Jobs</CardTitle>
        <CardDescription>
          Find and select jobs to compare opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search jobs by title, company, or location" 
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Selected jobs */}
          {selectedJobs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected Jobs:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJobs.map(job => (
                  <Badge key={job.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {job.title}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => removeSelectedJob(job.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Job listings */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => {
                const isSelected = selectedJobs.some(selectedJob => selectedJob.id === job.id);
                
                return (
                  <div 
                    key={job.id} 
                    className={`p-3 border rounded-md transition-colors ${isSelected ? 'bg-blue-50 border-primary' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{job.company} • {job.location}</div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-700">{job.salary}</span>
                          {job.remote && (
                            <Badge variant="outline" className="ml-2 text-xs">Remote</Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant={isSelected ? "default" : "outline"} 
                        size="sm" 
                        className={`ml-2 ${isSelected ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => handleJobSelection(job)}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">Posted {job.postedAt}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No jobs found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSearch;