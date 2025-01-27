import { Subject } from "@/types";

export const calculateSubjectAverage = (subject: Subject, currentBranch: string) => {
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
};

export const calculateModuleAverage = (subjects: Subject[], branch: string) => {
  const totalCoefficient = subjects.reduce(
    (sum, subject) => sum + subject.coefficient,
    0
  );
  const weightedSum = subjects.reduce((sum, subject) => {
    const average = calculateSubjectAverage(subject, branch);
    return sum + average * subject.coefficient;
  }, 0);
  return totalCoefficient ? weightedSum / totalCoefficient : 0;
};

export const calculateSemesterAverage = (modules: any[], branch: string) => {
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
};