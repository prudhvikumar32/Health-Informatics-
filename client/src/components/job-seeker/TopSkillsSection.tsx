import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface SkillData {
  name: string;
  percentage: number;
  category: "Technical Skills" | "Soft Skills";
}

interface TopSkillsSectionProps {
  skills: SkillData[];
}

const TopSkillsSection: React.FC<TopSkillsSectionProps> = ({ skills }) => {
  const techSkills = skills.filter((s) => s.category === "Technical Skills");
  const softSkills = skills.filter((s) => s.category === "Soft Skills");

  const renderSkills = (skills: SkillData[], color: string) => (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.name} className="text-sm">
          <div className="flex justify-between font-medium mb-1">
            <span>{skill.name}</span>
            <span>{skill.percentage}%</span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${color}`}
              style={{ width: `${skill.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Soft Skills</CardTitle>
        </CardHeader>
        <CardContent>{renderSkills(softSkills, "bg-green-500")}</CardContent>
      </Card>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Technical Skills</CardTitle>
        </CardHeader>
        <CardContent>{renderSkills(techSkills, "bg-blue-500")}</CardContent>
      </Card>
    </div>
  );
};

export default TopSkillsSection;
