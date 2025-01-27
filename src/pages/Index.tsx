import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import ModuleSection from "@/components/ModuleSection";
import Header from "@/components/Header";
import { iadModules, glModules, giModules, rtModules } from "@/data/branches";
import {
  calculateSubjectAverage,
  calculateModuleAverage,
  calculateSemesterAverage,
} from "@/utils/gradeCalculations";

const Index = () => {
  const [branch, setBranch] = useState<string>("iad");
  const [modules, setModules] = useState(iadModules);
  const { toast } = useToast();

  const handleGradeChange = (
    moduleId: string,
    subjectId: string,
    type: "td" | "tp" | "exam",
    value: string
  ) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          subjects: module.subjects.map((subject) => {
            if (subject.id !== subjectId) return subject;
            return {
              ...subject,
              grades: {
                ...subject.grades,
                [type]: value,
              },
            };
          }),
        };
      })
    );
  };

  const handleBranchChange = (newBranch: string) => {
    setBranch(newBranch);
    switch (newBranch) {
      case "gl":
        setModules(glModules);
        break;
      case "gi":
        setModules(giModules);
        break;
      case "rt":
        setModules(rtModules);
        break;
      default:
        setModules(iadModules);
    }
  };

  const handlePrint = async () => {
    const data = {
      branch:
        branch === "gl"
          ? "Master 1 Génie Logiciel"
          : branch === "gi"
          ? "Master 1 Génie Informatique"
          : branch === "rt"
          ? "Master 1 Réseaux et Télécommunications"
          : "Master 1 Intelligence Artificielle et Digitalisation",
      average: calculateSemesterAverage(modules, branch),
      modules: modules.map((module) => ({
        title: module.title,
        subjects: module.subjects.map((subject) => ({
          title: subject.title,
          grades: subject.grades,
          average: calculateSubjectAverage(subject, branch),
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const currentDate = new Date().toISOString().split("T")[0];
    link.download = `moyenne-s1-${branch}-${currentDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Fichier JSON généré",
      description: "Vos moyennes ont été exportées au format JSON.",
    });
  };

  const semesterAverage = calculateSemesterAverage(modules, branch);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <Header
        branch={branch}
        onBranchChange={handleBranchChange}
        onPrint={handlePrint}
      />

      <Card className="glass-card p-4 text-center animate-fadeIn">
        <CardContent>
          <div className="text-2xl font-bold">
            Moyenne Semestre: {semesterAverage.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {modules.map((module) => (
          <ModuleSection
            key={module.id}
            title={module.title}
            subjects={module.subjects.map((subject) => ({
              ...subject,
              average: calculateSubjectAverage(subject, branch),
            }))}
            onGradeChange={(subjectId, type, value) =>
              handleGradeChange(module.id, subjectId, type, value)
            }
            moduleAverage={calculateModuleAverage(module.subjects, branch)}
            showCredits={branch !== "iad"}
          />
        ))}
      </div>

      <footer className="text-center text-sm text-muted-foreground pt-8 pb-4 animate-fadeIn">
        <p>
          Développé pour Master 1 Génie Logiciel et Intelligence Artificielle et
          Digitalisation
        </p>
        <a
          href="#"
          className="text-primary hover:underline transition-colors"
          onClick={(e) => {
            e.preventDefault();
            alert(
              "La moyenne est calculée selon la formule : 40% TD/TP + 60% Examen pour chaque matière, puis pondérée par les coefficients et crédits."
            );
          }}
        >
          En savoir plus sur le calcul des moyennes
        </a>
      </footer>
    </div>
  );
};

export default Index;