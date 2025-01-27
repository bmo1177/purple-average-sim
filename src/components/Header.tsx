import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Printer } from "lucide-react";
import BranchSelector from "./BranchSelector";

interface HeaderProps {
  branch: string;
  onBranchChange: (value: string) => void;
  onPrint: () => void;
}

const Header: React.FC<HeaderProps> = ({ branch, onBranchChange, onPrint }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="text-center space-y-4 animate-fadeIn relative">
      <div className="absolute right-0 top-0 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrint}
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
        <BranchSelector value={branch} onChange={onBranchChange} />
        <p className="text-lg text-muted-foreground">
          Calculez votre moyenne du premier semestre en entrant vos notes. Les
          moyennes sont calculées automatiquement selon la formule : 40% TD/TP +
          60% Examen.
        </p>
      </div>
    </header>
  );
};

export default Header;