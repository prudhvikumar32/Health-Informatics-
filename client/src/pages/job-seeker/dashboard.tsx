import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CardMetric from "@/components/ui/card-metric";
import SalaryChart from "@/components/charts/salary-chart";
import SkillsChart from "@/components/charts/skills-chart";
import JobDistributionMap from "@/components/charts/job-distribution-map";
import TopSkillsChart from "@/components/charts/top-skills-chart";
import RegionalSalaryChart from "@/components/charts/regional-salary-chart";
import JobSearch from "@/components/job-seeker/job-search";
import {
  MetricCardData,
  TopRoleData,
  SkillData,
  StateJobCount,
  JobPostingData,
  SelectedJobData,
  RegionalSalaryData,
} from "@shared/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JobSeekerDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<string>("all_specialties");
  const [selectedJobType, setSelectedJobType] =
    useState<string>("all_job_types");
  const [selectedJobs, setSelectedJobs] = useState<SelectedJobData[]>([]);

  // Fetch job roles
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  // Fetch skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["/api/skills"],
  });

  // Metrics data
  const metricsData: MetricCardData[] = [
    {
      title: "Total Health IT Jobs",
      value: "15,734",
      change: "12% from last month",
      trend: "up",
      icon: "fas fa-briefcase",
      iconBgColor: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Average Salary",
      value: "$87,250",
      change: "3.5% year over year",
      trend: "up",
      icon: "fas fa-dollar-sign",
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Field Growth Rate",
      value: "14%",
      change: "Faster than average",
      trend: "up",
      icon: "fas fa-chart-line",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Job Outlook (10yr)",
      value: "Very Positive",
      change: "High demand projected",
      trend: "up",
      icon: "fas fa-binoculars",
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // Top roles data
  const topRolesData: TopRoleData[] = [
    {
      title: "Chief Medical Information Officer",
      salary: 145000,
      width: "100%",
    },
    { title: "Clinical Informatics Director", salary: 125000, width: "90%" },
    { title: "Health Data Scientist", salary: 115000, width: "85%" },
    { title: "Health IT Project Manager", salary: 98000, width: "75%" },
    { title: "Clinical Systems Analyst", salary: 85000, width: "65%" },
  ];

  // Skills data
  const skillsData: SkillData[] = [
    { name: "EHR Systems", percentage: 92, category: "Technical Skills" },
    { name: "SQL/Databases", percentage: 85, category: "Technical Skills" },
    { name: "Data Analysis", percentage: 78, category: "Technical Skills" },
    { name: "HL7/FHIR", percentage: 65, category: "Technical Skills" },
    { name: "Communication", percentage: 88, category: "Soft Skills" },
    { name: "Problem Solving", percentage: 82, category: "Soft Skills" },
    { name: "Teamwork", percentage: 76, category: "Soft Skills" },
    { name: "Project Management", percentage: 70, category: "Soft Skills" },
  ];

  // Location data
  const locationData: StateJobCount[] = [
    { state: "California", jobCount: 2145, percentage: 15 },
    { state: "Texas", jobCount: 1876, percentage: 12 },
    { state: "New York", jobCount: 1652, percentage: 10 },
    { state: "Florida", jobCount: 1435, percentage: 9 },
    { state: "Massachusetts", jobCount: 1287, percentage: 8 },
    { state: "Illinois", jobCount: 1158, percentage: 7 },
    { state: "Pennsylvania", jobCount: 1042, percentage: 6 },
    { state: "Ohio", jobCount: 985, percentage: 6 },
    { state: "Michigan", jobCount: 876, percentage: 5 },
    { state: "North Carolina", jobCount: 792, percentage: 5 },
  ];

  // Regional salary data
  const regionalSalaryData: RegionalSalaryData[] = [
    { region: "West", salary: 103750, jobCount: 3874 },
    { region: "Northeast", salary: 98500, jobCount: 3256 },
    { region: "Midwest", salary: 89250, jobCount: 3548 },
    { region: "Southeast", salary: 85000, jobCount: 2765 },
    { region: "Southwest", salary: 82500, jobCount: 2291 },
  ];

  // Job posting data
  const jobPostingsData: JobPostingData[] = [
    {
      id: 1,
      title: "Clinical Systems Analyst",
      company: "Mass General Hospital",
      location: "Boston, MA",
      salary: "$85,000 - $95,000",
      postedAt: "2 days ago",
      remote: true,
    },
    {
      id: 2,
      title: "Health Data Scientist",
      company: "Kaiser Permanente",
      location: "Oakland, CA",
      salary: "$110,000 - $130,000",
      postedAt: "1 week ago",
      remote: false,
    },
    {
      id: 3,
      title: "EHR Implementation Specialist",
      company: "Epic Systems",
      location: "Madison, WI",
      salary: "$75,000 - $90,000",
      postedAt: "3 days ago",
      remote: false,
    },
    {
      id: 4,
      title: "Healthcare IT Project Manager",
      company: "Cleveland Clinic",
      location: "Cleveland, OH",
      salary: "$95,000 - $110,000",
      postedAt: "5 days ago",
      remote: false,
    },
    {
      id: 5,
      title: "Senior Health Informatics Specialist",
      company: "Mayo Clinic",
      location: "Rochester, MN",
      salary: "$105,000 - $125,000",
      postedAt: "1 week ago",
      remote: true,
    },
    {
      id: 6,
      title: "Healthcare Data Architect",
      company: "Cerner Corporation",
      location: "Kansas City, MO",
      salary: "$120,000 - $140,000",
      postedAt: "3 days ago",
      remote: false,
    },
    {
      id: 7,
      title: "Clinical Applications Trainer",
      company: "Providence Health",
      location: "Seattle, WA",
      salary: "$70,000 - $85,000",
      postedAt: "4 days ago",
      remote: true,
    },
    {
      id: 8,
      title: "Medical Software Developer",
      company: "Allscripts",
      location: "Chicago, IL",
      salary: "$95,000 - $115,000",
      postedAt: "1 week ago",
      remote: false,
    },
  ];

  // Filter job postings based on specialty and job type
  const filteredJobPostings = jobPostingsData.filter((job) => {
    const matchesSpecialty =
      selectedSpecialty === "all_specialties" ||
      (selectedSpecialty === "analytical" && job.title.includes("Analyst")) ||
      job.title.includes("Data") ||
      (selectedSpecialty === "clinical" && job.title.includes("Clinical")) ||
      job.title.includes("Medical") ||
      (selectedSpecialty === "technical" && job.title.includes("Developer")) ||
      job.title.includes("Architect") ||
      job.title.includes("Implementation");

    const matchesJobType =
      selectedJobType === "all_job_types" ||
      (selectedJobType === "remote" && job.remote) ||
      (selectedJobType === "on_site" && !job.remote);

    return matchesSpecialty && matchesJobType;
  });

  // Handle job selection change
  const handleJobSelectionChange = (jobs: SelectedJobData[]) => {
    setSelectedJobs(jobs);
  };

  // Get skills based on selected jobs
  const getJobSpecificSkills = (): SkillData[] => {
    if (selectedJobs.length === 0) {
      return skillsData;
    }

    // In a real application, you would fetch the skills specific to the selected jobs
    // For now, we'll simulate this by returning a subset of skills with adjusted percentages
    const selectedTitles = selectedJobs.map((job) => job.title.toLowerCase());

    return skillsData.map((skill) => {
      const hasDataRelated = selectedTitles.some(
        (title) =>
          title.includes("data") ||
          title.includes("analyst") ||
          title.includes("scientist"),
      );

      const hasClinicalRelated = selectedTitles.some(
        (title) =>
          title.includes("clinical") ||
          title.includes("ehr") ||
          title.includes("medical"),
      );

      const hasTechnicalRelated = selectedTitles.some(
        (title) =>
          title.includes("developer") ||
          title.includes("architect") ||
          title.includes("implementation"),
      );

      // Adjust percentages based on selected job types
      let adjustedPercentage = skill.percentage;

      if (
        skill.name.includes("Data") ||
        skill.name.includes("SQL") ||
        skill.name === "Data Analysis"
      ) {
        adjustedPercentage = hasDataRelated
          ? Math.min(98, skill.percentage + 10)
          : skill.percentage;
      }

      if (skill.name.includes("EHR") || skill.name.includes("HL7")) {
        adjustedPercentage = hasClinicalRelated
          ? Math.min(98, skill.percentage + 10)
          : skill.percentage;
      }

      if (skill.name.includes("Project Management")) {
        adjustedPercentage = hasTechnicalRelated
          ? Math.min(98, skill.percentage + 10)
          : skill.percentage;
      }

      return {
        ...skill,
        percentage: adjustedPercentage,
      };
    });
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
                {/* Page heading and welcome message */}
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Job Seeker Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Welcome back! Here's an overview of the Health Informatics
                    job market.
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {metricsData.map((metric, index) => (
                    <CardMetric key={index} data={metric} />
                  ))}
                </div>

                {/* Filter section */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Specialty Area
                        </label>
                        <Select
                          value={selectedSpecialty}
                          onValueChange={setSelectedSpecialty}
                        >
                          <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Select a specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_specialties">
                              All Specialty Areas
                            </SelectItem>
                            <SelectItem value="analytical">
                              Data & Analytics
                            </SelectItem>
                            <SelectItem value="clinical">
                              Clinical Informatics
                            </SelectItem>
                            <SelectItem value="technical">
                              Technical Implementation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Job Type
                        </label>
                        <Select
                          value={selectedJobType}
                          onValueChange={setSelectedJobType}
                        >
                          <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_job_types">
                              All Job Types
                            </SelectItem>
                            <SelectItem value="remote">Remote Only</SelectItem>
                            <SelectItem value="on_site">
                              On-Site Only
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedSpecialty("all_specialties");
                          setSelectedJobType("all_job_types");
                          setSelectedJobs([]);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Main content - tabs for different views */}
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid grid-cols-3 w-full md:w-auto">
                    <TabsTrigger value="overview">Market Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Job Search</TabsTrigger>
                    <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    {/* Job Role Trends & Top Skills */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Top Paying Roles Chart */}
                      <SalaryChart
                        data={topRolesData}
                        title="Top Paying Health Informatics Roles"
                      />

                      {/* In-Demand Skills */}
                      <SkillsChart
                        skills={skillsData}
                        title="Top In-Demand Skills"
                      />
                    </div>

                    {/* Geographic Job Distribution Map */}
                    <JobDistributionMap
                      data={locationData}
                      title="Job Distribution by Location"
                    />

                    {/* Regional Salary Chart */}
                    <RegionalSalaryChart
                      data={regionalSalaryData}
                      title="Average Salary by US Region"
                    />
                  </TabsContent>

                  {/* Jobs Tab */}
                  <TabsContent value="jobs" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Job Search Component */}
                      <JobSearch
                        jobListings={filteredJobPostings}
                        onJobSelectionChange={handleJobSelectionChange}
                      />

                      {/* Selected Job Analysis */}
                      {selectedJobs.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Selected Job Analysis</CardTitle>
                            <CardDescription>
                              Insights for your selected jobs (
                              {selectedJobs.length} selected)
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Skill requirements for selected jobs */}
                              <TopSkillsChart
                                skills={getJobSpecificSkills()}
                                title="Skills Required for Selected Jobs"
                              />

                              {/* Location trends for selected job type */}
                              <div className="space-y-4">
                                <h3 className="text-base font-medium">
                                  Key Insights for Selected Jobs
                                </h3>

                                <div className="bg-blue-50 p-4 rounded-md">
                                  <h4 className="font-medium text-blue-700">
                                    Salary Range
                                  </h4>
                                  <p className="mt-1 text-sm text-blue-600">
                                    The selected roles have an average salary
                                    range of $85,000 - $115,000, which is 12%
                                    above the national average for health
                                    informatics positions.
                                  </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-md">
                                  <h4 className="font-medium text-green-700">
                                    Growth Trajectory
                                  </h4>
                                  <p className="mt-1 text-sm text-green-600">
                                    These roles are projected to grow 15-18%
                                    over the next five years, creating
                                    approximately 3,500 new positions
                                    nationally.
                                  </p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-md">
                                  <h4 className="font-medium text-purple-700">
                                    Remote Work Opportunity
                                  </h4>
                                  <p className="mt-1 text-sm text-purple-600">
                                    {selectedJobs.some(
                                      (job) =>
                                        job.title
                                          .toLowerCase()
                                          .includes("analyst") ||
                                        job.title
                                          .toLowerCase()
                                          .includes("data"),
                                    )
                                      ? "Data-focused roles have a 65% higher likelihood of offering remote work options."
                                      : "These roles vary in remote work availability, with about 40% offering full or hybrid remote options."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top In-Demand Skills */}
                      <TopSkillsChart
                        skills={skillsData.sort(
                          (a, b) => b.percentage - a.percentage,
                        )}
                        title="Top Skills in Demand"
                      />

                      {/* Skill Insights */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Skill Growth Trends</CardTitle>
                          <CardDescription>
                            How demand for key skills is changing over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                Fastest Growing Skills
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <div className="w-32 text-sm">
                                    AI/ML in Healthcare
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: "85%" }}
                                    ></div>
                                  </div>
                                  <div className="w-16 text-right text-sm font-medium text-green-600">
                                    +35%
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-32 text-sm">
                                    FHIR Standards
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: "70%" }}
                                    ></div>
                                  </div>
                                  <div className="w-16 text-right text-sm font-medium text-green-600">
                                    +28%
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-32 text-sm">
                                    Cloud Healthcare
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: "60%" }}
                                    ></div>
                                  </div>
                                  <div className="w-16 text-right text-sm font-medium text-green-600">
                                    +24%
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                Essential Skills By Role
                              </h4>
                              <div className="space-y-3">
                                <div className="bg-blue-50 p-3 rounded">
                                  <div className="font-medium text-blue-700">
                                    Data Analyst
                                  </div>
                                  <div className="mt-1 text-sm text-blue-600">
                                    SQL, R/Python, Tableau, Statistical Analysis
                                  </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded">
                                  <div className="font-medium text-green-700">
                                    Clinical Informatics
                                  </div>
                                  <div className="mt-1 text-sm text-green-600">
                                    EHR Systems, Clinical Workflow, HL7/FHIR,
                                    Medical Terminology
                                  </div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded">
                                  <div className="font-medium text-purple-700">
                                    IT Implementation
                                  </div>
                                  <div className="mt-1 text-sm text-purple-600">
                                    Project Management, Change Management,
                                    Systems Integration, Training
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
