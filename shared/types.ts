// API Response types from external services

export interface BLSOccupation {
  code: string;
  title: string;
  description?: string;
}

export interface BLSSalaryData {
  occupation: string;
  occupationCode: string;
  meanAnnualWage: number;
  medianAnnualWage: number;
  percentile10: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
}

export interface BLSLocationData {
  state: string;
  stateCode: string;
  occupation: string; 
  occupationCode: string;
  employmentCount: number;
  employmentPerThousand: number;
  locationQuotient: number;
  meanAnnualWage: number;
}

export interface BLSGrowthData {
  occupation: string;
  occupationCode: string;
  baseYear: number;
  projectedYear: number;
  employmentBase: number;
  employmentProjected: number;
  employmentChange: number;
  percentChange: number;
  annualPercentChange: number;
}

export interface ONETOccupation {
  code: string;
  title: string;
  description: string;
}

export interface ONETSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  importance: number; // 0-100 scale
  level: number; // 0-100 scale
}

export interface ONETJobDetail {
  code: string;
  title: string;
  description: string;
  tasks: string[];
  skills: ONETSkill[];
  knowledge: ONETSkill[];
  abilities: ONETSkill[];
  education: {
    level: string;
    percentage: number;
  }[];
  experience: {
    level: string;
    percentage: number;
  }[];
}

// Dashboard types

export interface MetricCardData {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export interface TopRoleData {
  title: string;
  salary: number;
  width: string;
}

export interface SkillData {
  name: string;
  percentage: number;
  category: string;
}

export interface JobPostingData {
  id?: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  remote: boolean;
}

export interface StateJobCount {
  state: string;
  stateCode?: string;
  jobCount: number;
  percentage: number;
}

export interface SalaryRangeData {
  role: string;
  location: string;
  experience: string;
  median: number;
  percentile10: number;
  percentile90: number;
}

export interface SkillGapData {
  name: string;
  demand: number;
  supply: number;
  status: 'shortage' | 'surplus' | 'balanced';
}

export interface RegionalSalaryData {
  region: string;
  salary: number;
  jobCount: number;
}

export interface SelectedJobData {
  id: number;
  title: string;
  company: string;
  selected: boolean;
}
