import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["job_seeker", "hr"] }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job roles schema
export const jobRoles = pgTable("job_roles", {
  id: serial("id").primaryKey(), 
  title: text("title").notNull(),
  description: text("description").notNull(),
  averageSalary: integer("average_salary").notNull(),
  growthRate: text("growth_rate").notNull(),
  requirements: text("requirements").notNull(),
  onetCode: text("onet_code"),
  blsCode: text("bls_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Skills schema 
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  demand: integer("demand").notNull(), // 1-100 scale
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job role to skills relationship (many-to-many)
export const jobRoleSkills = pgTable("job_role_skills", {
  id: serial("id").primaryKey(),
  jobRoleId: integer("job_role_id").notNull().references(() => jobRoles.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  importance: integer("importance").notNull(), // 1-100 scale
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Salary data by location schema
export const salaryByLocation = pgTable("salary_by_location", {
  id: serial("id").primaryKey(),
  jobRoleId: integer("job_role_id").notNull().references(() => jobRoles.id),
  state: text("state").notNull(),
  salary: integer("salary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved insights schema
export const savedInsights = pgTable("saved_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // favorite_role, saved_report, etc.
  dataJson: text("data_json").notNull(), // Serialized JSON of saved data
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

export const insertJobRoleSchema = createInsertSchema(jobRoles).omit({ 
  id: true,
  createdAt: true 
});

export const insertSkillSchema = createInsertSchema(skills).omit({ 
  id: true,
  createdAt: true 
});

export const insertJobRoleSkillSchema = createInsertSchema(jobRoleSkills).omit({ 
  id: true, 
  createdAt: true 
});

export const insertSalaryByLocationSchema = createInsertSchema(salaryByLocation).omit({ 
  id: true, 
  createdAt: true 
});

export const insertSavedInsightSchema = createInsertSchema(savedInsights).omit({ 
  id: true, 
  createdAt: true 
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type JobRole = typeof jobRoles.$inferSelect;
export type InsertJobRole = z.infer<typeof insertJobRoleSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type JobRoleSkill = typeof jobRoleSkills.$inferSelect;
export type InsertJobRoleSkill = z.infer<typeof insertJobRoleSkillSchema>;

export type SalaryByLocation = typeof salaryByLocation.$inferSelect;
export type InsertSalaryByLocation = z.infer<typeof insertSalaryByLocationSchema>;

export type SavedInsight = typeof savedInsights.$inferSelect;
export type InsertSavedInsight = z.infer<typeof insertSavedInsightSchema>;
