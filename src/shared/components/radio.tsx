import { cn } from "@/lib/utils";
import { Pill, XCircle } from "lucide-react";

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const FormRadioGroup = ({ options, selectedValue, onChange }: FormRadioGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        const isTaken = option.value === "taken";
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
              isSelected 
                ? "bg-white shadow-sm " + (isTaken ? "text-blue-600" : "text-amber-600")
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {isTaken ? <Pill size={18} /> : <XCircle size={18} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};