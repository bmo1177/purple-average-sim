import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GradeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
}

const GradeInput: React.FC<GradeInputProps> = ({
  label,
  value,
  onChange,
  max = 20,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || (Number(newValue) >= 0 && Number(newValue) <= max)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={0}
        max={max}
        step={0.25}
        className="input-transition w-24 text-center"
        placeholder="0.00"
      />
    </div>
  );
};

export default GradeInput;