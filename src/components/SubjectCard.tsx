import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradeInput from "./GradeInput";

interface SubjectCardProps {
  title: string;
  coefficient: number;
  credits: number;
  hasTD?: boolean;
  hasTP?: boolean;
  grades: {
    td: string;
    tp: string;
    exam: string;
  };
  onGradeChange: (type: "td" | "tp" | "exam", value: string) => void;
  average: number;
  showCredits?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  coefficient,
  credits,
  hasTD = false,
  hasTP = false,
  grades,
  onGradeChange,
  average,
  showCredits = true,
}) => {
  return (
    <Card className="glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Coefficient: {coefficient}
          {showCredits && ` | Credits: ${credits}`}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          {hasTD && (
            <GradeInput
              label="TD"
              value={grades.td}
              onChange={(value) => onGradeChange("td", value)}
            />
          )}
          {hasTP && (
            <GradeInput
              label="TP"
              value={grades.tp}
              onChange={(value) => onGradeChange("tp", value)}
            />
          )}
          <GradeInput
            label="Exam"
            value={grades.exam}
            onChange={(value) => onGradeChange("exam", value)}
          />
          <div className="ml-auto text-right">
            <div className="text-sm text-muted-foreground">Moyenne</div>
            <div className="text-xl font-semibold">
              {average.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;