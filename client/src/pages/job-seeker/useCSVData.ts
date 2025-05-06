// hooks/useCSVData.ts
import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface JobCSV {
  State: string;
  City: string;
  Region: string;
  Year: number;
  "Job Title": string;
  "SOC Code": string;
  Openings: number;
  "Previous Year Openings": number;
  "Job Growth (%)": number;
  "Average Salary ($)": number;
  "Median Salary ($)": number;
  Industry: string;
  "Employment Type": string;
  "Remote Work": string;
  "Education Requirement": string;
  "Experience Level": string;
  "Key Skills": string;
  "Posting Source": string;
}

export const useCSVData = () => {
  const [data, setData] = useState<JobCSV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/health_informatics.csv") // Ensure this is in /public/
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<JobCSV>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
        setLoading(false);
      });
  }, []);

  return { data, loading };
};