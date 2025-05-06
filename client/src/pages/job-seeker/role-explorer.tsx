// RoleExplorerWithCharts.tsx
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { useCSVData } from '../job-seeker/useCSVData';

const COLORS = ['#3b82f6', '#10b981'];

const RoleExplorerWithCharts: React.FC = () => {
  const { data: csvData, loading: csvLoading } = useCSVData();
  const [selectedSpecialty, setSelectedSpecialty] = useState("all_specialties");
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedEmployment, setSelectedEmployment] = useState('all');

  const specialtyKeywords: Record<string, string[]> = {
    "Data & Analytics": ["data", "analytics", "scientist", "engineer"],
    "Clinical Informatics": ["clinical", "ehr", "medical", "applications"],
    "Health IT Management": ["manager", "project", "consultant"],
    "Public & Population Health": ["population", "public"],
    "Coding & Terminology": ["coder", "terminology"],
    "Telehealth & Remote Care": ["telehealth"]
  };

  const filteredData = useMemo(() => {
    if (!csvData || csvData.length === 0) return [];
    return csvData.filter((job) => {
      const title = job['Job Title']?.toLowerCase();
      const region = job['Region'];
      const employment = job['Employment Type'];
      const matchesSpecialty = selectedSpecialty === "all_specialties" ||
        (specialtyKeywords[selectedSpecialty] || []).some((kw) => title?.includes(kw));

      return (
        matchesSpecialty &&
        (selectedRegion === 'all' || region === selectedRegion) &&
        (selectedEmployment === 'all' || employment === selectedEmployment)
      );
    });
  }, [csvData, selectedSpecialty, selectedRegion, selectedEmployment]);

  const avgSalaryByJob = useMemo(() => {
    const grouped: Record<string, number[]> = {};
    filteredData.forEach((job) => {
      const title = job['Job Title'];
      const salary = parseFloat(String(job['Average Salary ($)']));
      if (!title || isNaN(salary)) return;
      if (!grouped[title]) grouped[title] = [];
      grouped[title].push(salary);
    });
    return Object.entries(grouped).map(([title, salaries]) => ({
      title,
      avgSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
    })).sort((a, b) => b.avgSalary - a.avgSalary);
  }, [filteredData]);

  const jobCountByTitle = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach((job) => {
      const title = job['Job Title'];
      if (!title) return;
      counts[title] = (counts[title] || 0) + 1;
    });
    return Object.entries(counts).map(([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count);
  }, [filteredData]);

  const remotePieData = useMemo(() => {
    let remote = 0;
    let onsite = 0;
    filteredData.forEach((job) => {
      const remoteFlag = String(job['Remote Work']).toLowerCase();
      if (remoteFlag === 'yes') remote++;
      else onsite++;
    });
    return [
      { name: 'Remote', value: remote },
      { name: 'On-site', value: onsite }
    ];
  }, [filteredData]);

  const salaryTrendByYear = useMemo(() => {
    const grouped: Record<string, Record<number, number[]>> = {};
    filteredData.forEach((job) => {
      const title = job['Job Title'];
      const year = parseInt(String(job['Year']));
      const salary = parseFloat(String(job['Average Salary ($)']));
      if (!title || !year || isNaN(salary)) return;
      if (!grouped[title]) grouped[title] = {};
      if (!grouped[title][year]) grouped[title][year] = [];
      grouped[title][year].push(salary);
    });

    const chartData: Record<number, Record<string, number>> = {};
    Object.entries(grouped).forEach(([title, yearMap]) => {
      Object.entries(yearMap).forEach(([yearStr, salaries]) => {
        const year = parseInt(yearStr);
        const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
        if (!chartData[year]) chartData[year] = { year };
        chartData[year][title] = avg;
      });
    });
    return Object.values(chartData).sort((a, b) => a.year - b.year);
  }, [filteredData]);

  const uniqueRegions = [...new Set(csvData?.map((j) => j['Region']).filter(Boolean))];
  const uniqueEmploymentTypes = [...new Set(csvData?.map((j) => j['Employment Type']).filter(Boolean))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Role Explorer Dashboard</h1>
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_specialties">All Specialties</SelectItem>
                    {Object.keys(specialtyKeywords).map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueRegions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedEmployment} onValueChange={setSelectedEmployment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueEmploymentTypes.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Salary by Job Title</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={avgSalaryByJob.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgSalary" fill="#3b82f6" name="Avg Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Count by Title</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobCountByTitle.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#10b981" name="Job Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remote vs On-Site Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={remotePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {remotePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Trends Over Years</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salaryTrendByYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(salaryTrendByYear[0] || {}).filter(k => k !== 'year').map((title) => (
                        <Line
                          key={title}
                          type="monotone"
                          dataKey={title}
                          stroke="#3b82f6"
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleExplorerWithCharts;