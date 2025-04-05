import { 
  User, InsertUser, JobRole, InsertJobRole, Skill, InsertSkill,
  JobRoleSkill, InsertJobRoleSkill, SalaryByLocation, InsertSalaryByLocation,
  SavedInsight, InsertSavedInsight
} from "@shared/schema";
import { SkillGapData } from "@shared/types";
import session from "express-session";
import createMemoryStore from "memorystore";
import mongoose from "mongoose";

const MemoryStore = createMemoryStore(session);

// Define MongoDB schemas
const userSchema = new mongoose.Schema({
  id: Number,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["job_seeker", "hr"], required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const jobRoleSchema = new mongoose.Schema({
  id: Number,
  title: { type: String, required: true },
  description: { type: String, required: true },
  averageSalary: { type: Number, required: true },
  growthRate: { type: String, required: true },
  requirements: { type: String, required: true },
  onetCode: String,
  blsCode: String,
  createdAt: { type: Date, default: Date.now }
});

const skillSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  demand: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const jobRoleSkillSchema = new mongoose.Schema({
  id: Number,
  jobRoleId: { type: Number, required: true },
  skillId: { type: Number, required: true },
  importance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const salaryByLocationSchema = new mongoose.Schema({
  id: Number,
  jobRoleId: { type: Number, required: true },
  state: { type: String, required: true },
  salary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const savedInsightSchema = new mongoose.Schema({
  id: Number,
  userId: { type: Number, required: true },
  type: { type: String, required: true },
  dataJson: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Job role operations
  getAllJobRoles(): Promise<JobRole[]>;
  getJobRole(id: number): Promise<JobRole | undefined>;
  createJobRole(jobRole: InsertJobRole): Promise<JobRole>;
  
  // Skill operations
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  getSkillsByJobRole(jobRoleId: number): Promise<(Skill & { importance: number })[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  // Job role to skill relationship operations
  createJobRoleSkill(jobRoleSkill: InsertJobRoleSkill): Promise<JobRoleSkill>;
  
  // Salary data operations
  getSalariesByState(state: string): Promise<SalaryByLocation[]>;
  getSalariesByJobRole(jobRoleId: number): Promise<SalaryByLocation[]>;
  createSalaryByLocation(salaryData: InsertSalaryByLocation): Promise<SalaryByLocation>;
  
  // Saved insights operations
  getSavedInsightsByUser(userId: number): Promise<SavedInsight[]>;
  getSavedInsight(id: number): Promise<SavedInsight | undefined>;
  createSavedInsight(insight: InsertSavedInsight): Promise<SavedInsight>;
  deleteSavedInsight(id: number): Promise<void>;
  
  // HR analytics operations
  getJobTrends(): Promise<any>;
  getSkillGapAnalysis(): Promise<SkillGapData[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;

  // Connect to MongoDB
  connect(): Promise<void>;
}

export class MongoDBStorage implements IStorage {
  private UserModel: mongoose.Model<any>;
  private JobRoleModel: mongoose.Model<any>;
  private SkillModel: mongoose.Model<any>;
  private JobRoleSkillModel: mongoose.Model<any>;
  private SalaryByLocationModel: mongoose.Model<any>;
  private SavedInsightModel: mongoose.Model<any>;
  
  sessionStore: session.SessionStore;
  
  constructor() {
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize MongoDB models
    this.UserModel = mongoose.model('User', userSchema);
    this.JobRoleModel = mongoose.model('JobRole', jobRoleSchema);
    this.SkillModel = mongoose.model('Skill', skillSchema);
    this.JobRoleSkillModel = mongoose.model('JobRoleSkill', jobRoleSkillSchema);
    this.SalaryByLocationModel = mongoose.model('SalaryByLocation', salaryByLocationSchema);
    this.SavedInsightModel = mongoose.model('SavedInsight', savedInsightSchema);
  }
  
  async connect(): Promise<void> {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://vineethketham:0WF8hTMzjscVRqHS@cluster0.sxyor4s.mongodb.net/health_informatics";
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await this.UserModel.findOne({ id });
    return user ? this.mapToUser(user) : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.UserModel.findOne({ username });
    return user ? this.mapToUser(user) : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.UserModel.findOne({ email });
    return user ? this.mapToUser(user) : undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    // Get the next ID
    const maxIdUser = await this.UserModel.findOne().sort('-id');
    const nextId = maxIdUser ? maxIdUser.id + 1 : 1;
    
    const newUser = new this.UserModel({
      ...user,
      id: nextId
    });
    
    await newUser.save();
    return this.mapToUser(newUser);
  }
  
  // Job role operations
  async getAllJobRoles(): Promise<JobRole[]> {
    const jobRoles = await this.JobRoleModel.find();
    return jobRoles.map(this.mapToJobRole);
  }
  
  async getJobRole(id: number): Promise<JobRole | undefined> {
    const jobRole = await this.JobRoleModel.findOne({ id });
    return jobRole ? this.mapToJobRole(jobRole) : undefined;
  }
  
  async createJobRole(jobRole: InsertJobRole): Promise<JobRole> {
    const maxIdRole = await this.JobRoleModel.findOne().sort('-id');
    const nextId = maxIdRole ? maxIdRole.id + 1 : 1;
    
    const newJobRole = new this.JobRoleModel({
      ...jobRole,
      id: nextId
    });
    
    await newJobRole.save();
    return this.mapToJobRole(newJobRole);
  }
  
  // Skill operations
  async getAllSkills(): Promise<Skill[]> {
    const skills = await this.SkillModel.find();
    return skills.map(this.mapToSkill);
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    const skill = await this.SkillModel.findOne({ id });
    return skill ? this.mapToSkill(skill) : undefined;
  }
  
  async getSkillsByJobRole(jobRoleId: number): Promise<(Skill & { importance: number })[]> {
    const jobRoleSkills = await this.JobRoleSkillModel.find({ jobRoleId });
    
    const skillsWithImportance = await Promise.all(
      jobRoleSkills.map(async (jrs) => {
        const skill = await this.SkillModel.findOne({ id: jrs.skillId });
        if (!skill) return null;
        
        return {
          ...this.mapToSkill(skill),
          importance: jrs.importance
        };
      })
    );
    
    return skillsWithImportance.filter(Boolean) as (Skill & { importance: number })[];
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const maxIdSkill = await this.SkillModel.findOne().sort('-id');
    const nextId = maxIdSkill ? maxIdSkill.id + 1 : 1;
    
    const newSkill = new this.SkillModel({
      ...skill,
      id: nextId
    });
    
    await newSkill.save();
    return this.mapToSkill(newSkill);
  }
  
  // Job role to skill relationship operations
  async createJobRoleSkill(jobRoleSkill: InsertJobRoleSkill): Promise<JobRoleSkill> {
    const maxIdJRS = await this.JobRoleSkillModel.findOne().sort('-id');
    const nextId = maxIdJRS ? maxIdJRS.id + 1 : 1;
    
    const newJobRoleSkill = new this.JobRoleSkillModel({
      ...jobRoleSkill,
      id: nextId
    });
    
    await newJobRoleSkill.save();
    return this.mapToJobRoleSkill(newJobRoleSkill);
  }
  
  // Salary data operations
  async getSalariesByState(state: string): Promise<SalaryByLocation[]> {
    const salaries = await this.SalaryByLocationModel.find({ state });
    return salaries.map(this.mapToSalaryByLocation);
  }
  
  async getSalariesByJobRole(jobRoleId: number): Promise<SalaryByLocation[]> {
    const salaries = await this.SalaryByLocationModel.find({ jobRoleId });
    return salaries.map(this.mapToSalaryByLocation);
  }
  
  async createSalaryByLocation(salaryData: InsertSalaryByLocation): Promise<SalaryByLocation> {
    const maxIdSalary = await this.SalaryByLocationModel.findOne().sort('-id');
    const nextId = maxIdSalary ? maxIdSalary.id + 1 : 1;
    
    const newSalaryByLocation = new this.SalaryByLocationModel({
      ...salaryData,
      id: nextId
    });
    
    await newSalaryByLocation.save();
    return this.mapToSalaryByLocation(newSalaryByLocation);
  }
  
  // Saved insights operations
  async getSavedInsightsByUser(userId: number): Promise<SavedInsight[]> {
    const insights = await this.SavedInsightModel.find({ userId });
    return insights.map(this.mapToSavedInsight);
  }
  
  async getSavedInsight(id: number): Promise<SavedInsight | undefined> {
    const insight = await this.SavedInsightModel.findOne({ id });
    return insight ? this.mapToSavedInsight(insight) : undefined;
  }
  
  async createSavedInsight(insight: InsertSavedInsight): Promise<SavedInsight> {
    const maxIdInsight = await this.SavedInsightModel.findOne().sort('-id');
    const nextId = maxIdInsight ? maxIdInsight.id + 1 : 1;
    
    const newSavedInsight = new this.SavedInsightModel({
      ...insight,
      id: nextId
    });
    
    await newSavedInsight.save();
    return this.mapToSavedInsight(newSavedInsight);
  }
  
  async deleteSavedInsight(id: number): Promise<void> {
    await this.SavedInsightModel.deleteOne({ id });
  }
  
  // HR analytics operations
  async getJobTrends(): Promise<any> {
    // This would normally fetch and analyze data from various sources
    // Mocked implementation for now
    return {
      yearOverYearGrowth: [
        { specialty: "Data Science", growth: 28 },
        { specialty: "Clinical Informatics", growth: 22 },
        { specialty: "EHR Implementation", growth: 15 },
        { specialty: "Health IT Security", growth: 18 }
      ],
      jobOpeningsVsApplicants: {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        openings: [120, 135, 140, 155, 170, 180, 190, 200, 210, 205, 220, 230],
        applicants: [240, 230, 250, 260, 270, 290, 310, 320, 315, 330, 350, 340]
      },
      emergingSkills: [
        { skill: "AI in Healthcare", increase: 73 },
        { skill: "Telehealth Systems", increase: 65 },
        { skill: "Healthcare Data Security", increase: 58 }
      ]
    };
  }
  
  async getSkillGapAnalysis(): Promise<SkillGapData[]> {
    // This would normally compute supply and demand from various sources
    // Mocked implementation for now
    return [
      { name: "SQL/Database", demand: 65, supply: 65, status: "balanced" },
      { name: "Python/R", demand: 75, supply: 40, status: "shortage" },
      { name: "Healthcare Analytics", demand: 80, supply: 30, status: "shortage" },
      { name: "Machine Learning", demand: 60, supply: 25, status: "shortage" },
      { name: "Data Visualization", demand: 70, supply: 55, status: "shortage" }
    ];
  }
  
  // Mapping functions from MongoDB documents to our types
  private mapToUser(doc: any): User {
    return {
      id: doc.id,
      username: doc.username,
      password: doc.password,
      email: doc.email,
      role: doc.role,
      name: doc.name,
      createdAt: doc.createdAt
    };
  }
  
  private mapToJobRole(doc: any): JobRole {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      averageSalary: doc.averageSalary,
      growthRate: doc.growthRate,
      requirements: doc.requirements,
      onetCode: doc.onetCode,
      blsCode: doc.blsCode,
      createdAt: doc.createdAt
    };
  }
  
  private mapToSkill(doc: any): Skill {
    return {
      id: doc.id,
      name: doc.name,
      category: doc.category,
      demand: doc.demand,
      createdAt: doc.createdAt
    };
  }
  
  private mapToJobRoleSkill(doc: any): JobRoleSkill {
    return {
      id: doc.id,
      jobRoleId: doc.jobRoleId,
      skillId: doc.skillId,
      importance: doc.importance,
      createdAt: doc.createdAt
    };
  }
  
  private mapToSalaryByLocation(doc: any): SalaryByLocation {
    return {
      id: doc.id,
      jobRoleId: doc.jobRoleId,
      state: doc.state,
      salary: doc.salary,
      createdAt: doc.createdAt
    };
  }
  
  private mapToSavedInsight(doc: any): SavedInsight {
    return {
      id: doc.id,
      userId: doc.userId,
      type: doc.type,
      dataJson: doc.dataJson,
      name: doc.name,
      createdAt: doc.createdAt
    };
  }
}

// Create and export a storage instance
export const storage = new MongoDBStorage();
