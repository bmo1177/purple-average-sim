export interface Subject {
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