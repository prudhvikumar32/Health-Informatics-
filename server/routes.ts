import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, authenticateJWT, authorizeRole } from "./auth";
import { getBLSJobData, getBLSSalaryData, getBLSLocationData } from "./services/blsService";
import { getONETJobDetails, getONETSkills } from "./services/onetService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Job Roles endpoints
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobRoles();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job roles", error });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobRole(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ message: "Job role not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job role", error });
    }
  });

  // Skills endpoints
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Error fetching skills", error });
    }
  });

  app.get("/api/skills/:jobId", async (req, res) => {
    try {
      const skills = await storage.getSkillsByJobRole(parseInt(req.params.jobId));
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Error fetching skills for job role", error });
    }
  });

  // Salary data endpoints
  app.get("/api/salary/:state", async (req, res) => {
    try {
      const salaries = await storage.getSalariesByState(req.params.state);
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching salary data", error });
    }
  });

  app.get("/api/salary/job/:jobId", async (req, res) => {
    try {
      const salaries = await storage.getSalariesByJobRole(parseInt(req.params.jobId));
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching salary data for job role", error });
    }
  });

  // Saved insights endpoints (protected)
  app.get("/api/insights", authenticateJWT, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const insights = await storage.getSavedInsightsByUser(req.user.id as number);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Error fetching saved insights", error });
    }
  });

  app.post("/api/insights", authenticateJWT, async (req, res) => {
    try {
      const { type, dataJson, name } = req.body;
      
      if (!type || !dataJson || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const insight = await storage.createSavedInsight({
        userId: req.user.id as number,
        type,
        dataJson,
        name
      });
      
      res.status(201).json(insight);
    } catch (error) {
      res.status(500).json({ message: "Error saving insight", error });
    }
  });

  app.delete("/api/insights/:id", authenticateJWT, async (req, res) => {
    try {
      const insight = await storage.getSavedInsight(parseInt(req.params.id));
      
      if (!insight) {
        return res.status(404).json({ message: "Insight not found" });
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (insight.userId !== (req.user.id as number)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteSavedInsight(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting insight", error });
    }
  });

  // BLS API integration endpoints
  app.get("/api/bls/jobs", async (req, res) => {
    try {
      const jobs = await getBLSJobData();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching BLS job data", error });
    }
  });

  app.get("/api/bls/salary/:occupationCode", async (req, res) => {
    try {
      const salary = await getBLSSalaryData(req.params.occupationCode);
      res.json(salary);
    } catch (error) {
      res.status(500).json({ message: "Error fetching BLS salary data", error });
    }
  });

  // Enhanced location endpoint with filtering capabilities
  app.get("/api/bls/location/:occupationCode", async (req, res) => {
    try {
      const { state, minEmployment, sortBy } = req.query;
      let locationData = await getBLSLocationData(req.params.occupationCode);
      
      // Apply filters if provided
      if (state) {
        locationData = locationData.filter(location => 
          location.stateCode.toLowerCase() === (state as string).toLowerCase() || 
          location.state.toLowerCase().includes((state as string).toLowerCase())
        );
      }
      
      if (minEmployment) {
        const minCount = parseInt(minEmployment as string);
        if (!isNaN(minCount)) {
          locationData = locationData.filter(location => location.employmentCount >= minCount);
        }
      }
      
      // Apply sorting if provided
      if (sortBy) {
        switch(sortBy) {
          case 'employment':
            locationData.sort((a, b) => b.employmentCount - a.employmentCount);
            break;
          case 'wage':
            locationData.sort((a, b) => b.meanAnnualWage - a.meanAnnualWage);
            break;
          case 'quotient':
            locationData.sort((a, b) => b.locationQuotient - a.locationQuotient);
            break;
          case 'state':
            locationData.sort((a, b) => a.state.localeCompare(b.state));
            break;
        }
      }
      
      res.json(locationData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching BLS location data", error });
    }
  });
  
  // New endpoint to compare salaries across multiple occupations
  app.get("/api/bls/salary-comparison", async (req, res) => {
    try {
      const { codes } = req.query;
      
      if (!codes) {
        return res.status(400).json({ message: "Occupation codes are required" });
      }
      
      const occupationCodes = (codes as string).split(',');
      
      const salaryPromises = occupationCodes.map(code => getBLSSalaryData(code.trim()));
      const salaryData = await Promise.all(salaryPromises);
      
      res.json(salaryData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching BLS salary comparison data", error });
    }
  });

  // O*NET API integration endpoints
  app.get("/api/onet/job/:code", async (req, res) => {
    try {
      const jobDetails = await getONETJobDetails(req.params.code);
      res.json(jobDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching O*NET job details", error });
    }
  });

  // Enhanced skills endpoint with filtering and sorting capabilities
  app.get("/api/onet/skills/:code", async (req, res) => {
    try {
      const { category, minImportance, sortBy } = req.query;
      let skills = await getONETSkills(req.params.code);
      
      // Apply filters if provided
      if (category) {
        skills = skills.filter(skill => 
          skill.category.toLowerCase().includes((category as string).toLowerCase())
        );
      }
      
      if (minImportance) {
        const minValue = parseInt(minImportance as string);
        if (!isNaN(minValue)) {
          skills = skills.filter(skill => skill.importance >= minValue);
        }
      }
      
      // Apply sorting if provided
      if (sortBy) {
        switch(sortBy) {
          case 'importance':
            skills.sort((a, b) => b.importance - a.importance);
            break;
          case 'level':
            skills.sort((a, b) => b.level - a.level);
            break;
          case 'name':
            skills.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'category':
            skills.sort((a, b) => a.category.localeCompare(b.category));
            break;
        }
      }
      
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Error fetching O*NET skills data", error });
    }
  });
  
  // New endpoint for skill comparison across multiple job roles
  app.get("/api/onet/skills-comparison", async (req, res) => {
    try {
      const { codes } = req.query;
      
      if (!codes) {
        return res.status(400).json({ message: "Occupation codes are required" });
      }
      
      const occupationCodes = (codes as string).split(',');
      
      // Get all skills for each occupation code
      const skillsPromises = occupationCodes.map(async (code) => {
        const skills = await getONETSkills(code.trim());
        return {
          occupationCode: code.trim(),
          skills
        };
      });
      
      const skillsData = await Promise.all(skillsPromises);
      
      res.json(skillsData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching O*NET skills comparison data", error });
    }
  });

  // HR specific endpoints
  app.get("/api/hr/trend-analysis", authenticateJWT, authorizeRole(["hr"]), async (req, res) => {
    try {
      // Get query parameters for dynamic filtering
      const { timeframe, specialty } = req.query;
      
      // Get base trend data
      const trends = await storage.getJobTrends();
      
      // Filter data based on parameters if provided
      if (specialty) {
        // Filter year-over-year growth data by specialty
        trends.yearOverYearGrowth = trends.yearOverYearGrowth.filter((item: any) => 
          item.specialty.toLowerCase().includes((specialty as string).toLowerCase())
        );
      }
      
      if (timeframe === 'quarterly') {
        // Modify the months array to show quarterly data instead of monthly
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const quarterlyOpenings = [
          trends.jobOpeningsVsApplicants.openings.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.openings.slice(3, 6).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.openings.slice(6, 9).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.openings.slice(9, 12).reduce((a: number, b: number) => a + b, 0) / 3
        ];
        const quarterlyApplicants = [
          trends.jobOpeningsVsApplicants.applicants.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.applicants.slice(3, 6).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.applicants.slice(6, 9).reduce((a: number, b: number) => a + b, 0) / 3,
          trends.jobOpeningsVsApplicants.applicants.slice(9, 12).reduce((a: number, b: number) => a + b, 0) / 3
        ];
        
        // Override with quarterly data
        trends.jobOpeningsVsApplicants = {
          months: quarters,
          openings: quarterlyOpenings,
          applicants: quarterlyApplicants
        };
      }
      
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trend analysis", error });
    }
  });

  app.get("/api/hr/skill-gap", authenticateJWT, authorizeRole(["hr"]), async (req, res) => {
    try {
      // Get query parameters for dynamic filtering
      const { status, minDemand, sortBy } = req.query;
      
      // Get base skill gap data
      let skillGapData = await storage.getSkillGapAnalysis();
      
      // Filter by status if provided
      if (status) {
        skillGapData = skillGapData.filter(skill => 
          skill.status === status
        );
      }
      
      // Filter by minimum demand if provided
      if (minDemand) {
        const minValue = parseInt(minDemand as string);
        if (!isNaN(minValue)) {
          skillGapData = skillGapData.filter(skill => skill.demand >= minValue);
        }
      }
      
      // Apply sorting if provided
      if (sortBy) {
        switch(sortBy) {
          case 'demand':
            skillGapData.sort((a, b) => b.demand - a.demand);
            break;
          case 'supply':
            skillGapData.sort((a, b) => b.supply - a.supply);
            break;
          case 'gap':
            skillGapData.sort((a, b) => (b.demand - b.supply) - (a.demand - a.supply));
            break;
          case 'name':
            skillGapData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }
      
      res.json(skillGapData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching skill gap analysis", error });
    }
  });
  
  // New endpoint for HR market analysis by region
  app.get("/api/hr/regional-analysis", authenticateJWT, authorizeRole(["hr"]), async (req, res) => {
    try {
      const { region } = req.query;
      
      // Get job roles from the database
      const jobRoles = await storage.getAllJobRoles();
      
      // Get BLS data for each role (if BLS code is available)
      const regionalData = await Promise.all(
        jobRoles
          .filter(role => role.blsCode) // Only use roles with BLS codes
          .map(async (role) => {
            try {
              // Get location data for this role
              const locationData = await getBLSLocationData(role.blsCode!);
              
              // Filter by region if provided
              let filteredData = locationData;
              if (region) {
                filteredData = locationData.filter(location => 
                  location.state.toLowerCase().includes((region as string).toLowerCase()) ||
                  location.stateCode.toLowerCase() === (region as string).toLowerCase()
                );
              }
              
              // Get salary data for this role
              const salaryData = await getBLSSalaryData(role.blsCode!);
              
              return {
                roleId: role.id,
                roleTitle: role.title,
                blsCode: role.blsCode,
                locations: filteredData,
                salary: salaryData
              };
            } catch (error) {
              console.error(`Error fetching data for role ${role.title}:`, error);
              return null;
            }
          })
      );
      
      // Filter out any null results from failed API calls
      const validRegionalData = regionalData.filter(data => data !== null);
      
      res.json(validRegionalData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching regional analysis data", error });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
