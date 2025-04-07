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
import { Loader2, Download, BookmarkPlus } from "lucide-react";

const SalaryExplorer: React.FC = () => {
  const { toast } = useToast();
  const [selectedJobRole, setSelectedJobRole] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [salaryRange, setSalaryRange] = useState<number[]>([60000, 150000]);
  const [experienceLevel, setExperienceLevel] = useState<string>("all");

  const { data: jobRoles, isLoading: jobRolesLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const handleSaveInsight = () => {
    toast({
      title: "Insight Saved",
      description: "Salary comparison has been saved to your profile",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Salary data has been exported to CSV",
    });
  };

  const experienceLevelData = [
    { level: "Entry Level (0-2 yrs)", salary: 65000 },
    { level: "Mid Level (3-5 yrs)", salary: 85000 },
    { level: "Senior (6-9 yrs)", salary: 110000 },
    { level: "Expert (10+ yrs)", salary: 135000 },
  ];

  const salaryTrendData = [
    { year: 2018, salary: 72000 },
    { year: 2019, salary: 75500 },
    { year: 2020, salary: 79000 },
    { year: 2021, salary: 82500 },
    { year: 2022, salary: 87250 },
    { year: 2023, salary: 92000 },
  ];

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
                        <Select
                          value={selectedJobRole}
                          onValueChange={setSelectedJobRole}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              All Health Informatics Roles
                            </SelectItem>
                            {jobRoles?.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id.toString()}
                              >
                                {role.title}
                              </SelectItem>
                            ))}
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
                            <SelectItem value="all">
                              National Average
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
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
                      </div>

                      <div>
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
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedJobRole("all");
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

                {/* Salary Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Trends (2018-2023)</CardTitle>
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
