import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CardMetric from "@/components/ui/card-metric";
import SalaryChart from "@/components/charts/salary-chart";
import TopSkillsSection from "@/components/job-seeker/TopSkillsSection";
import JobDistributionMap from "@/components/charts/job-distribution-map";
import TopSkillsChart from "@/components/charts/top-skills-chart";
import RegionalSalaryChart from "@/components/charts/regional-salary-chart";
import JobSearch from "@/components/job-seeker/job-search";
import { useCSVData } from "../job-seeker/useCSVData";
import { useMemo } from "react";

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
  const { data: csvData, loading: csvLoading } = useCSVData();
  useEffect(() => {
    if (!csvLoading && csvData.length > 0) {
      console.log("✅ CSV Data loaded:", csvData.slice(0, 5));
    }
  }, [csvData, csvLoading]);


  const top5SalaryJobs = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];
    return [...csvData]
      .filter((job) => job["Average Salary ($)"]) // ensure valid salary
      .sort((a, b) => Number(b["Average Salary ($)"]) - Number(a["Average Salary ($)"]))
      .slice(0, 5);
  }, [csvData]);

  const { toast } = useToast();
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<string>("all_specialties");
  const [selectedJobType, setSelectedJobType] =
    useState<string>("all_job_types");
  const [selectedJobs, setSelectedJobs] = useState<SelectedJobData[]>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");

  // Fetch job roles
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  // Fetch skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["/api/skills"],
  });

  const filteredData = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];

    return csvData.filter((job) => {
      const title = job["Job Title"]?.toLowerCase() || "";
      const remote = job["Remote Work"]?.toLowerCase() === "yes";
      const employmentType = job["Employment Type"]?.toLowerCase() || "";

      const matchesSpecialty =
        selectedSpecialty === "all_specialties" ||
        (selectedSpecialty === "Data & Analytics" && (
          title.includes("data") ||
          title.includes("analytics") ||
          title.includes("scientist") ||
          title.includes("engineer")
        )) ||
        (selectedSpecialty === "Clinical Informatics" && (
          title.includes("clinical") ||
          title.includes("ehr") ||
          title.includes("medical") ||
          title.includes("applications")
        )) ||
        (selectedSpecialty === "Health IT Management" && (
          title.includes("manager") ||
          title.includes("project") ||
          title.includes("consultant")
        )) ||
        (selectedSpecialty === "Public & Population Health" && (
          title.includes("population") ||
          title.includes("public")
        )) ||
        (selectedSpecialty === "Coding & Terminology" && (
          title.includes("coder") ||
          title.includes("terminology")
        )) ||
        (selectedSpecialty === "Telehealth & Remote Care" && (
          title.includes("telehealth")
        ));

      const matchesJobType =
        selectedJobType === "all_job_types" ||
        (selectedJobType === "remote" && remote) ||
        (selectedJobType === "on_site" && !remote);

      const matchesEmploymentType =
        selectedEmploymentType === "all" ||
        employmentType === selectedEmploymentType;

      return matchesSpecialty && matchesJobType && matchesEmploymentType;
    });
  }, [csvData, selectedSpecialty, selectedJobType, selectedEmploymentType]);

  // Metrics data
  const metricsData: MetricCardData[] = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const totalJobs = filteredData.length;

    const salaries = filteredData
      .map((job) => Number(job["Average Salary ($)"]))
      .filter((val) => !isNaN(val));

    const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    const growthRates = filteredData
      .map((job) => Number(job["Job Growth (%)"]))
      .filter((val) => !isNaN(val));

    const avgGrowthRate =
      growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    return [
      {
        title: "Total Health IT Jobs",
        value: totalJobs.toLocaleString(),
        change: "Based on current listings",
        trend: "up",
        icon: "fas fa-briefcase",
        iconBgColor: "bg-blue-100",
        iconColor: "text-primary",
      },
      {
        title: "Average Salary",
        value: `$${Math.round(avgSalary).toLocaleString()}`,
        change: "",
        trend: "up",
        icon: "fas fa-dollar-sign",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        title: "Field Growth Rate",
        value: `${avgGrowthRate.toFixed(1)}%`,
        change: "Average of job growth column",
        trend: "up",
        icon: "fas fa-chart-line",
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Job Outlook (10yr)",
        value: "Very Positive",
        change: "",
        trend: "up",
        icon: "fas fa-binoculars",
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ];
  }, [filteredData]);
  const topRolesData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const roleMap: Record<string, number[]> = {};

    filteredData.forEach((job) => {
      const title = job["Job Title"];
      const salary = Number(job["Average Salary ($)"]);
      if (!title || isNaN(salary)) return;

      if (!roleMap[title]) roleMap[title] = [];
      roleMap[title].push(salary);
    });

    const averaged = Object.entries(roleMap).map(([title, salaries]) => ({
      title,
      salary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
    }));

    const sorted = averaged.sort((a, b) => b.salary - a.salary).slice(0, 5);
    const topSalary = sorted[0]?.salary || 1;

    return sorted.map((role) => ({
      ...role,
      width: `${Math.round((role.salary / topSalary) * 100)}%`,
    }));
  }, [filteredData]);

  // Skills data
  const skillsData: SkillData[] = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const skillCounts: Record<string, number> = {};

    // Step 1: Count each individual skill
    filteredData.forEach((job) => {
      const skills = job["Key Skills"];
      if (!skills) return;

      skills.split(",").forEach((rawSkill) => {
        const skill = rawSkill.trim();
        if (!skill) return;

        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    // Step 2: Define categories (BI included in Data Analysis)
    const groupedSkills: Record<string, { label: string; total: number }> = {
      data: { label: "Data Analysis & Visualization", total: 0 },
      interoperability: { label: "Interoperability", total: 0 },
      ai: { label: "AI/ML in Healthcare", total: 0 },
      infra: { label: "Cloud & Integration", total: 0 },
      coding: { label: "Programming & Automation", total: 0 },
      training: { label: "Training", total: 0 },

      communication: { label: "Communication & Teamwork", total: 0 },
      project: { label: "Project Management", total: 0 },
      change: { label: "Change Management", total: 0 },
    };

    // Step 3: Group skills into categories
    for (const [skill, count] of Object.entries(skillCounts)) {
      const lower = skill.toLowerCase();

      if (
        lower.includes("power bi") ||
        lower.includes("tableau") ||
        lower.includes("data") ||
        lower.includes("visual")
      ) {
        groupedSkills.data.total += count;
      } else if (lower.includes("fhir") || lower.includes("hl7") || lower.includes("ehr")) {
        groupedSkills.interoperability.total += count;
      } else if (lower.includes("ai") || lower.includes("ml")) {
        groupedSkills.ai.total += count;
      } else if (lower.includes("cloud") || lower.includes("integration")) {
        groupedSkills.infra.total += count;
      } else if (lower.includes("python")) {
        groupedSkills.coding.total += count;
      } else if (lower.includes("train")) {
        groupedSkills.training.total += count;
      } else if (lower.includes("communication") || lower.includes("team")) {
        groupedSkills.communication.total += count;
      } else if (lower.includes("project")) {
        groupedSkills.project.total += count;
      } else if (lower.includes("change")) {
        groupedSkills.change.total += count;
      }
    }

    // Step 4: Separate and normalize
    const techSkills: SkillData[] = [];
    const softSkills: SkillData[] = [];

    let techTotal = 0;
    let softTotal = 0;

    for (const [key, group] of Object.entries(groupedSkills)) {
      if (group.total === 0) continue;

      const isSoft = ["communication", "project", "change"].includes(key);
      if (isSoft) softTotal += group.total;
      else techTotal += group.total;
    }

    for (const [key, group] of Object.entries(groupedSkills)) {
      if (group.total === 0) continue;

      const isSoft = ["communication", "project", "change"].includes(key);
      const percentage = isSoft
        ? Math.round((group.total / softTotal) * 100)
        : Math.round((group.total / techTotal) * 100);

      const data = {
        name: group.label,
        percentage,
        category: isSoft ? "Soft Skills" : "Technical Skills",
      };

      if (isSoft) softSkills.push(data);
      else techSkills.push(data);
    }

    // Fix rounding issue for each group separately
    const fixPercentages = (arr: SkillData[]) => {
      const sum = arr.reduce((a, b) => a + b.percentage, 0);
      const diff = 100 - sum;
      if (diff !== 0 && arr.length > 0) {
        arr[0].percentage += diff;
      }
    };

    fixPercentages(techSkills);
    fixPercentages(softSkills);

    return [...techSkills.sort((a, b) => b.percentage - a.percentage), ...softSkills.sort((a, b) => b.percentage - a.percentage)];
  }, [filteredData]);

  const stateToCodeMap: Record<string, string> = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC"
  };
  // Location data
  const locationData: StateJobCount[] = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const counts: Record<string, number> = {};

    filteredData.forEach((job) => {
      if (!job.State) return;
      counts[job.State] = (counts[job.State] || 0) + 1;
    });

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return Object.entries(counts).map(([state, jobCount]) => ({
      state,
      stateCode: stateToCodeMap[state] || "", // add this map below
      jobCount,
      percentage: jobCount / total,
    }));
  }, [filteredData]);


  const regionalSalaryData: RegionalSalaryData[] = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    const regionGroups: Record<string, number[]> = {};

    filteredData.forEach((job) => {
      const region = job.Region;
      const salary = Number(job["Average Salary ($)"]);

      if (!region || isNaN(salary)) return;

      if (!regionGroups[region]) {
        regionGroups[region] = [];
      }

      regionGroups[region].push(salary);
    });

    return Object.entries(regionGroups).map(([region, salaries]) => ({
      region,
      salary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      jobCount: salaries.length,
    }));
  }, [filteredData]);
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

  const topSkills = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const skillCounts: Record<string, number> = {};

    filteredData.forEach((row) => {
      const skill = row["Key Skills"]?.trim();
      if (!skill) return;

      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3
  }, [filteredData]);

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
                          Employment Type
                        </label>
                        <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                          <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="full-time">Full-Time</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="temporary">Temporary</SelectItem>
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

                {/* {!csvLoading && top5SalaryJobs.length > 0 && (
                  <div className="bg-white border rounded-md shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Top 5 Highest Paying Jobs (From CSV)
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 text-sm">
                      {top5SalaryJobs.map((job, index) => (
                        <li key={index}>
                          <strong>{job["Job Title"]}</strong> — ${Number(job["Average Salary ($)"]).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}
                {/* Main content - tabs for different views */}
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid grid-cols-2 w-full md:w-auto">
                    <TabsTrigger value="overview">Market Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Job Search</TabsTrigger>
                    {/* <TabsTrigger value="skills">Skills Analysis</TabsTrigger> */}
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
                      <Card>
  <CardHeader>
    <CardTitle>Top In-Demand Skills</CardTitle>
    <CardDescription>
      Breakdown of current top technical and soft skills
    </CardDescription>
  </CardHeader>
  <CardContent>
    <TopSkillsSection skills={skillsData} />
  </CardContent>
</Card>

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
                              <div>
                                <h2 className="text-xl font-bold mb-4">Fastest Growing Skills</h2>
                                {topSkills.map((s) => (
                                  <div key={s.skill} className="mb-2">
                                    <div className="flex justify-between font-medium">
                                      <span>{s.skill}</span>
                                      <span className="text-green-600">{s.count} jobs</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded">
                                      <div
                                        className="h-full bg-green-500 rounded"
                                        style={{ width: `${Math.min(s.count * 10, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
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
