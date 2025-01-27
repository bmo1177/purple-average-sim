import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import ModuleSection from "@/components/ModuleSection";
import BranchSelector from "@/components/BranchSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Subject } from "@/types";
import { iadModules, glModules, giModules, rtModules } from "@/data/branches";

const Index = () => {
  const [branch, setBranch] = useState<string>("iad");
  const [modules, setModules] = useState(iadModules);
  const { theme, setTheme } = useTheme();
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

  const calculateSubjectAverage = useCallback((subject: Subject, currentBranch: string) => {
    const { grades, hasTD, hasTP } = subject;
    const exam = parseFloat(grades.exam) || 0;

    // Special calculation for GL branch
    if (currentBranch === "gl") {
      if (!hasTD && !hasTP) return exam;

      const practicalWork = [];
      if (hasTD) practicalWork.push(parseFloat(grades.td) || 0);
      if (hasTP) practicalWork.push(parseFloat(grades.tp) || 0);

      const practicalAverage =
        practicalWork.reduce((a, b) => a + b, 0) / practicalWork.length;
      
      // Apply 40% TD/TP + 60% Exam formula
      return (practicalAverage * 0.4) + (exam * 0.6);
    }

    // Default calculation for other branches
    if (!hasTD && !hasTP) return exam;

    const practicalWork = [];
    if (hasTD) practicalWork.push(parseFloat(grades.td) || 0);
    if (hasTP) practicalWork.push(parseFloat(grades.tp) || 0);

    const practicalAverage =
      practicalWork.reduce((a, b) => a + b, 0) / practicalWork.length;
    return practicalAverage * 0.4 + exam * 0.6;
  }, []);

  const calculateModuleAverage = useCallback(
    (subjects: Subject[]) => {
      const totalCoefficient = subjects.reduce(
        (sum, subject) => sum + subject.coefficient,
        0
      );
      const weightedSum = subjects.reduce((sum, subject) => {
        const average = calculateSubjectAverage(subject, branch);
        return sum + average * subject.coefficient;
      }, 0);
      return totalCoefficient ? weightedSum / totalCoefficient : 0;
    },
    [calculateSubjectAverage, branch]
  );

  const semesterAverage = useMemo(() => {
    if (branch === "gl") {
      // For GL branch: sum of (subject average * coefficient) divided by 16
      const totalWeightedSum = modules.reduce((sum, module) => {
        return sum + module.subjects.reduce((moduleSum, subject) => {
          const subjectAverage = calculateSubjectAverage(subject, branch);
          return moduleSum + (subjectAverage * subject.coefficient);
        }, 0);
      }, 0);
      return totalWeightedSum / 16;
    }

    // Default calculation for other branches
    const totalCredits = modules.reduce(
      (sum, module) =>
        sum + module.subjects.reduce((s, subject) => s + subject.credits, 0),
      0
    );
    const weightedSum = modules.reduce((sum, module) => {
      return (
        sum +
        module.subjects.reduce((s, subject) => {
          const average = calculateSubjectAverage(subject, branch);
          return s + average * subject.credits;
        }, 0)
      );
    }, 0);
    return totalCredits ? weightedSum / totalCredits : 0;
  }, [modules, calculateSubjectAverage, branch]);

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
      average: semesterAverage,
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <header className="text-center space-y-4 animate-fadeIn relative">
        <div className="absolute right-0 top-0 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            className="rounded-full"
          >
            <Printer className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Simulateur de Moyenne - 1er Semestre
        </h1>
        <div className="max-w-xl mx-auto space-y-4">
          <BranchSelector value={branch} onChange={handleBranchChange} />
          <p className="text-lg text-muted-foreground">
            Calculez votre moyenne du premier semestre en entrant vos notes. Les
            moyennes sont calculées automatiquement selon la formule : 40% TD/TP +
            60% Examen.
          </p>
        </div>
      </header>

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
            moduleAverage={calculateModuleAverage(module.subjects)}
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
