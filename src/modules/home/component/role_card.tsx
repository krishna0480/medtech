// src/components/dashboard/RoleCard.tsx
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  list: string[];
  buttonText: string;
  variant: "blue" | "green";
  icon: LucideIcon;
  onSelect: () => void;
}

export function RoleCard({ title, description, list, buttonText, variant, icon: Icon, onSelect }: RoleCardProps) {
  const isBlue = variant === "blue";
  
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
      <div className={`p-4 rounded-2xl ${isBlue ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
      <ul className="text-left w-full space-y-2 py-4">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <span className={`w-1.5 h-1.5 rounded-full ${isBlue ? "bg-blue-500" : "bg-green-500"}`} />
            {item}
          </li>
        ))}
      </ul>
      <PrimaryButton 
        onClick={onSelect}>
        {buttonText}
      </PrimaryButton>
    </div>
  );
}