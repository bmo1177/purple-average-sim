import React, { useState, useCallback, useMemo } from "react";
import ModuleSection from "@/components/ModuleSection";
import { Card, CardContent } from "@/components/ui/card";

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
}

interface Module {
  id: string;
  title: string;
  subjects: Subject[];
}

const initialModules: Module[] = [
  {
    id: "uet",
    title: "U.E.T - Communication",
    subjects: [
      {
        id: "anglais",
        title: "Anglais",
        coefficient: 1,
        credits: 1,
        hasTD: false,
        hasTP: false,
        grades: { td: "", tp: "", exam: "" },
      },
    ],
  },
  {
    id: "ued1",
    title: "U.E.D1 - Logique pour Intelligence Artificielle",
    subjects: [
      {
        id: "logique",
        title: "Logique pour Intelligence Artificielle",
        coefficient: 2,
        credits: 2,
        hasTD: true,
        hasTP: false,
        grades: { td: "", tp: "", exam: "" },
      },
    ],
  },
  {
    id: "uem1",
    title: "U.EM1 - Qualité Logiciel",
    subjects: [
      {
        id: "complexite",
        title: "Compléxité Algorithmique",
        coefficient: 2,
        credits: 5,
        hasTD: true,
        hasTP: true,
        grades: { td: "", tp: "", exam: "" },
      },
      {
        id: "qualite",
        title: "Gestion de la Qualité",
        coefficient: 2,
        credits: 4,
        hasTD: true,
        hasTP: false,
        grades: { td: "", tp: "", exam: "" },
      },
    ],
  },
  {
    id: "uef1",
    title: "UEF.1 - Fondement du Génie Logiciel",
    subjects: [
      {
        id: "genie",
        title: "Génie Logiciel",
        coefficient: 2,
        credits: 4,
        hasTD: true,
        hasTP: false,
        grades: { td: "", tp: "", exam: "" },
      },
      {
        id: "simulation",
        title: "Simulation Multi-Agent",
        coefficient: 3,
        credits: 6,
        hasTD: true,
        hasTP: false,
        grades: { td: "", tp: "", exam: "" },
      },
    ],
  },
  {
    id: "uef2",
    title: "UEF2 - Bases de Données Avancées",
    subjects: [
      {
        id: "aasgbd",
        title: "Architecture et Administration de SGBD",
        coefficient: 2,
        credits: 4,
        hasTD: false,
        hasTP: true,
        grades: { td: "", tp: "", exam: "" },
      },
      {
        id: "datamining",
        title: "Base de Données et Data Mining",
        coefficient: 2,
        credits: 4,
        hasTD: false,
        hasTP: true,
        grades: { td: "", tp: "", exam: "" },
      },
    ],
  },
];

const Index = () => {
  const [modules, setModules] = useState(initialModules);

  const calculateSubjectAverage = useCallback((subject: Subject) => {
    const { grades, hasTD, hasTP } = subject;
    const exam = parseFloat(grades.exam) || 0;
    
    if (!hasTD && !hasTP) return exam;

    const practicalWork = [];
    if (hasTD) practicalWork.push(parseFloat(grades.td) || 0);
    if (hasTP) practicalWork.push(parseFloat(grades.tp) || 0);
    
    const practicalAverage = practicalWork.reduce((a, b) => a + b, 0) / practicalWork.length;
    return practicalAverage * 0.4 + exam * 0.6;
  }, []);

  const calculateModuleAverage = useCallback((subjects: Subject[]) => {
    const totalCoefficient = subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
    const weightedSum = subjects.reduce((sum, subject) => {
      const average = calculateSubjectAverage(subject);
      return sum + average * subject.coefficient;
    }, 0);
    return totalCoefficient ? weightedSum / totalCoefficient : 0;
  }, [calculateSubjectAverage]);

  const semesterAverage = useMemo(() => {
    const totalCredits = modules.reduce(
      (sum, module) => sum + module.subjects.reduce((s, subject) => s + subject.credits, 0),
      0
    );
    const weightedSum = modules.reduce((sum, module) => {
      return (
        sum +
        module.subjects.reduce((s, subject) => {
          const average = calculateSubjectAverage(subject);
          return s + average * subject.credits;
        }, 0)
      );
    }, 0);
    return totalCredits ? weightedSum / totalCredits : 0;
  }, [modules, calculateSubjectAverage]);

  const handleGradeChange = (
    moduleId: string,
    subjectId: string,
    type: "td" | "tp" | "exam",
    value: string
  ) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              subjects: module.subjects.map((subject) =>
                subject.id === subjectId
                  ? {
                      ...subject,
                      grades: { ...subject.grades, [type]: value },
                    }
                  : subject
              ),
            }
          : module
      )
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <header className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-4xl font-bold tracking-tight">
          Simulation de la Moyenne - Master 1 Génie Logiciel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculez votre moyenne du premier semestre en entrant vos notes.
          Les moyennes sont calculées automatiquement selon la formule : 40% TD/TP + 60% Examen.
        </p>
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
              average: calculateSubjectAverage(subject),
            }))}
            onGradeChange={(subjectId, type, value) =>
              handleGradeChange(module.id, subjectId, type, value)
            }
            moduleAverage={calculateModuleAverage(module.subjects)}
          />
        ))}
      </div>

      <footer className="text-center text-sm text-muted-foreground pt-8 pb-4 animate-fadeIn">
        <p>Développé pour Master 1 Génie Logiciel</p>
        <a
          href="#"
          className="text-primary hover:underline transition-colors"
          onClick={(e) => {
            e.preventDefault();
            alert("La moyenne est calculée selon la formule : 40% TD/TP + 60% Examen pour chaque matière, puis pondérée par les coefficients et crédits.");
          }}
        >
          En savoir plus sur le calcul des moyennes
        </a>
      </footer>
    </div>
  );
};

export default Index;