import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BranchSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px] mx-auto">
        <SelectValue placeholder="Sélectionnez votre branche" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="iad">
          Master 1 Intelligence Artificielle et Digitalisation (IAD)
        </SelectItem>
        <SelectItem value="gl">Master 1 Génie Logiciel (GL)</SelectItem>
        <SelectItem value="gi">Master 1 Génie Informatique (GI)</SelectItem>
        <SelectItem value="rt">
          Master 1 Réseaux et Télécommunications (RT)
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BranchSelector;