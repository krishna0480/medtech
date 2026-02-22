"use client";

import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { useRouter } from "next/navigation";
import { DashboardCard } from "../constants";

export function StatCard({ 
  title, 
  description, 
  list, 
  buttonText, 
  buttonVariant, 
  variant, 
  icon: Icon,
  route 
}: DashboardCard) {
  const router = useRouter();
  const isBlue = variant?.includes("blue") || buttonVariant === "blue";

  return (
    <div className={cn(
      "bg-white p-8 rounded-[2rem] shadow-sm flex flex-col items-center text-center border transition-all hover:shadow-md h-full",
      variant === "border-blue" ? "border-blue-100 bg-blue-50/10" : 
      variant === "border-green" ? "border-green-100 bg-green-50/10" : 
      "border-slate-100"
    )}>
      
      {/* 1. Top Content Wrapper: flex-1 pushes everything below it down */}
      <div className="flex-1 flex flex-col items-center w-full space-y-4">
        {/* Icon Container */}
        <div className={cn(
          "p-4 rounded-2xl",
          isBlue ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
        )}>
          <Icon size={28} />
        </div>
        
        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* List Rendering */}
        {list !== null && (
          <ul className="text-left w-full space-y-3 mt-2 bg-white/50 p-4 rounded-xl border border-slate-50">
            {list.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", 
                  isBlue ? "bg-blue-500" : "bg-green-500"
                )} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. Button: Now anchored to the bottom */}
      {buttonText !== null && route !== null && (
        <div className="w-full pt-6 mt-auto">
          <PrimaryButton 
            onClick={() => router.push(route)} 
            className={cn(
              "w-full h-11 text-sm font-semibold rounded-xl transition-transform active:scale-95",
              buttonVariant === "blue" 
                ? "bg-[#04374E] hover:bg-[#04374E]/90" 
                : "bg-green-600 hover:bg-green-700"
            )}
          >
            {buttonText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}