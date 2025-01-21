import React from "react";
import SubjectCard from "./SubjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subject {
  id: string;
  title: string;
  coefficient: number;
  credits: number;
  hasTD: boolean;
  hasTP: boolean;
  grades: {
    td: string;
    tp: string;
    exam: string;
  };
  average: number;
}

interface ModuleSectionProps {
  title: string;
  subjects: Subject[];
  onGradeChange: (
    subjectId: string,
    type: "td" | "tp" | "exam",
    value: string
  ) => void;
  moduleAverage: number;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({
  title,
  subjects,
  onGradeChange,
  moduleAverage,
}) => {
  return (
    <section className="space-y-4 animate-slideIn">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-lg">
              Moyenne: {moduleAverage.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-2">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              title={subject.title}
              coefficient={subject.coefficient}
              credits={subject.credits}
              hasTD={subject.hasTD}
              hasTP={subject.hasTP}
              grades={subject.grades}
              onGradeChange={(type, value) =>
                onGradeChange(subject.id, type, value)
              }
              average={subject.average}
            />
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default ModuleSection;