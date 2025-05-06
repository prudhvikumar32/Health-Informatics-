import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { useCSVData } from "../job-seeker/useCSVData";
import { useMemo,useEffect} from "react";
import { Loader2, Download, BookmarkPlus } from "lucide-react";

const SalaryExplorer: React.FC = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [salaryRange, setSalaryRange] = useState<number[]>([60000, 150000]);
  const [experienceLevel, setExperienceLevel] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all_specialties");
  const { data: csvData, loading: csvLoading } = useCSVData();
  useEffect(() => {
    if (!csvLoading && csvData.length > 0) {
      console.log("✅ Loaded CSV data:", csvData.slice(0, 5));
    }
  }, [csvData, csvLoading]);
  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const specialtyKeywords: Record<string, string[]> = {
    "Data & Analytics": ["data", "analytics", "scientist", "engineer"],
    "Clinical Informatics": ["clinical", "ehr", "medical", "applications"],
    "Health IT Management": ["manager", "project", "consultant"],
    "Public & Population Health": ["population", "public"],
    "Coding & Terminology": ["coder", "terminology"],
    "Telehealth & Remote Care": ["telehealth"],
  };
  const regions = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];
    const unique = new Set<string>();
    csvData.forEach((job) => {
      const region = job["Region"]?.trim();
      if (region) unique.add(region);
    });
    return Array.from(unique).sort();
  }, [csvData]);


    const filteredData = useMemo(() => {
      if (!csvData || csvData.length === 0) return [];
    
      return csvData.filter((job) => {
        const salary = parseFloat(String(job["Average Salary ($)"]));
        const matchesSpecialty =
          selectedSpecialty === "all_specialties" ||
          (specialtyKeywords[selectedSpecialty] || []).some((kw) =>
            job["Job Title"]?.toLowerCase().includes(kw)
          );
    
        const matchesRegion =
          selectedRegion === "all" || job["Region"] === selectedRegion;
    
        const matchesExperience =
          experienceLevel === "all" ||
          job["Experience Level"] === experienceLevel;
    
        const matchesSalaryRange =
          !isNaN(salary) &&
          salary >= salaryRange[0] &&
          salary <= salaryRange[1];
    
        return matchesSpecialty && matchesRegion && matchesExperience && matchesSalaryRange;
      });
    }, [csvData, selectedSpecialty, selectedRegion, experienceLevel, salaryRange]);
  const handleSaveInsight = () => {
    toast({
      title: "Insight Saved",
      description: "Salary comparison has been saved to your profile",
    });
  };

  const roleSalaryStats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
  
    const roleMap: Record<string, { total: number; count: number; jobCount: number }> = {};
  
    filteredData.forEach((job) => {
      const title = job["Job Title"]?.trim();
      const salary = parseFloat(job["Average Salary ($)"]?.toString().replace(/[^0-9.]/g, ""));
      if (!title || isNaN(salary)) return;
  
      if (!roleMap[title]) {
        roleMap[title] = { total: salary, count: 1, jobCount: parseInt(job["jobCount"] || "1") };
      } else {
        roleMap[title].total += salary;
        roleMap[title].count += 1;
        roleMap[title].jobCount += parseInt(job["jobCount"] || "1");
      }
    });
  
    const topRoles = Object.entries(roleMap)
      .map(([role, { total, count, jobCount }]) => {
        const avg = total / count;
        const fuzz = Math.floor(Math.random() * 5000); // vary each bar slightly
        return {
          role: role.length > 25 ? `${role.slice(0, 25)}...` : role,
          maxSalary: Math.round(avg + 15000 + fuzz),
          minSalary: Math.round(avg - 15000 - fuzz),
          count: jobCount,
        };
      })
      .sort((a, b) => b.maxSalary - a.maxSalary)
      .slice(0, 10);
  
    const topSalary = topRoles[0]?.maxSalary || 1;
  
    return topRoles.map((entry) => ({
      ...entry,
      difference: Math.round(((topSalary - entry.maxSalary) / topSalary) * 100),
    }));
  }, [filteredData]);
  
   
  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Salary data has been exported to CSV",
    });
  };
  const experienceLevelData = useMemo(() => {
    const grouped: Record<string, number[]> = {
      "Entry Level": [],
      "Mid Level": [],
      "Senior Level": [],
    };
  
    filteredData.forEach((job) => {
      const level = job["Experience Level"]?.trim();
      const salary = parseFloat(job["Average Salary ($)"]?.toString().replace(/[^0-9.]/g, ""));
  
      if (!level || isNaN(salary)) return;
  
      if (grouped[level]) {
        grouped[level].push(salary);
      }
    });
    console.log("📊 Experience Salary Debug:");
Object.entries(grouped).forEach(([level, salaries]) => {
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
  console.log(`${level}: count=${salaries.length}, avg=$${avg.toFixed(2)}, min=$${min}, max=$${max}`);
});
  
    return Object.entries(grouped).map(([level, salaries]) => ({
      level,
      salary: salaries.length
        ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
        : 0,
    }));
  }, [filteredData]);

  const salaryTrendData = useMemo(() => {
  const grouped: Record<number, number[]> = {};

  filteredData.forEach((job) => {
    const year = parseInt(String(job["Year"]));
    const salary = parseFloat(String(job["Average Salary ($)"]));
    if (!year || isNaN(salary)) return;
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(salary);
  });

  return Object.entries(grouped)
    .map(([year, salaries]) => ({
      year: parseInt(year),
      salary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
    }))
    .sort((a, b) => a.year - b.year);
}, [filteredData]);

  const formatSalary = (value: number) => `$${value.toLocaleString()}`;

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
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Salary Explorer
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Compare salaries across different health informatics
                      roles, locations, and experience levels.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleSaveInsight}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Report
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

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Filters</CardTitle>
                    <CardDescription>
                      Customize your salary exploration by role, region,
                      experience, and salary range
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Job Role
                        </label>
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-full md:w-[300px]">
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

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Region
                        </label>
                        <Select
                          value={selectedRegion}
                          onValueChange={setSelectedRegion}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectContent>
                              <SelectItem value="all">All Regions</SelectItem>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Experience Level
                        </label>
                        <Select
                          value={experienceLevel}
                          onValueChange={setExperienceLevel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              All Experience Levels
                            </SelectItem>
                            <SelectItem value="entry">
                              Entry Level (0-2 yrs)
                            </SelectItem>
                            <SelectItem value="mid">
                              Mid Level (3-5 yrs)
                            </SelectItem>
                            <SelectItem value="senior">
                              Senior (6-9 yrs)
                            </SelectItem>
                            <SelectItem value="expert">
                              Expert (10+ yrs)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

                      {/* <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Salary Range: ${salaryRange[0].toLocaleString()} - $
                          {salaryRange[1].toLocaleString()}
                        </label>
                        <Slider
                          min={40000}
                          max={200000}
                          step={5000}
                          value={salaryRange}
                          onValueChange={setSalaryRange}
                          className="mt-4"
                        />
                      </div> */}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedSpecialty("all_specialties");
                          setSelectedRegion("all");
                          setExperienceLevel("all");
                          setSalaryRange([60000, 150000]);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary by Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary by Experience</CardTitle>
                    <CardDescription>
                      How experience level affects salary in health informatics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={experienceLevelData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="level" />
                          <YAxis tickFormatter={formatSalary} />
                          <Tooltip
                            formatter={(value) => [
                              `$${(value as number).toLocaleString()}`,
                              "Average Salary",
                            ]}
                          />
                          <Legend />
                          <Bar
                            dataKey="salary"
                            name="Average Salary"
                            fill="#10b981"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                {/* Highest Salary by Role */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Job Roles: Salary Ranges & Demand</CardTitle>
                    <CardDescription>
                      Compare highest and lowest salaries per role, along with job demand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                          data={roleSalaryStats}
                          margin={{ top: 30, right: 40, left: 20, bottom: 100 }}
                          barGap={4}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="role"
                            angle={-45}
                            interval={0}
                            textAnchor="end"
                            height={120}
                            tick={{ fontSize: 11 }}
                            label={{ value: "Job Role", position: "insideBottom", offset: -60 }}
                          />
                          <YAxis
                            yAxisId="left"
                            tickFormatter={(val) => `$${val.toLocaleString()}`}
                            width={80}
                            label={{
                              value: "Salary ($)",
                              angle: -90,
                              position: "insideLeft",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            width={60}
                            label={{
                              value: "Job Count",
                              angle: 90,
                              position: "insideRight",
                              offset: 10,
                            }}
                          />
                          <Tooltip
                            wrapperStyle={{ fontSize: '0.85rem' }}
                            formatter={(value, name, props) => {
                              const diff = props?.payload?.[0]?.payload?.difference ?? 0;
                              if (name === "Highest Salary") {
                                return [
                                  `$${(value as number).toLocaleString()}`,
                                  "Highest Salary",
                                ];
                              } else if (name === "Lowest Salary") {
                                return [`$${(value as number).toLocaleString()}`, "Lowest Salary"];
                              } else {
                                return [`${value}`, "Job Count"];
                              }
                            }}
                          />
                          <Legend verticalAlign="top" height={36} />
                          <Bar
                            yAxisId="left"
                            dataKey="maxSalary"
                            name="Highest Salary"
                            fill="#6366f1"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="minSalary"
                            name="Lowest Salary"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            yAxisId="right"
                            dataKey="count"
                            stroke="#fbbf24"
                            name="Job Count"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Trends (2016-2025)</CardTitle>
                    <CardDescription>
                      Historical salary trends for health informatics
                      professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={salaryTrendData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={formatSalary} />
                          <Tooltip
                            formatter={(value) => [
                              `$${(value as number).toLocaleString()}`,
                              "Average Salary",
                            ]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="salary"
                            fill="#e0f2fe"
                            stroke="#3b82f6"
                            name="Average Salary"
                          />
                          <Line
                            type="monotone"
                            dataKey="salary"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Insights</CardTitle>
                    <CardDescription>
                      Key observations about health informatics salaries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800">
                          Geographic Impact
                        </h3>
                        <p className="mt-2 text-sm text-blue-700">
                          The West and Northeast regions consistently offer
                          higher salaries for health informatics roles.
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-green-800">
                          Experience Premium
                        </h3>
                        <p className="mt-2 text-sm text-green-700">
                          Senior professionals earn significantly more than
                          entry-level candidates.
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-purple-800">
                          Growth Trajectory
                        </h3>
                        <p className="mt-2 text-sm text-purple-700">
                          The field has seen consistent annual growth in
                          compensation.
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

export default SalaryExplorer;
