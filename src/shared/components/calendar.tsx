"use client";

import React from "react";
import { isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// 1. Interface updated to match your actual Supabase object structure
export interface MedicationLogEntry {
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string; // "2026-02-22"
  status: "taken" | "missed"; // Matching your DB enum
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CalendarProps {
  logs: MedicationLogEntry[];
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function MedicationCalendar({ logs, selectedDate, onDateChange }: CalendarProps) {
  
  // 2. Updated helper to find logs matching the date
  const getEntryForDate = (date: Date) => {
    return logs.find(log => {
      // parseISO handles the "YYYY-MM-DD" string from your DB correctly
      const logDate = parseISO(log.log_date);
      return isSameDay(logDate, date);
    });
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        className="p-0 bg-white"
        classNames={{
          day_today: "bg-blue-50 text-blue-600 font-bold rounded-lg",
          day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white rounded-lg shadow-sm focus:bg-blue-600 focus:text-white",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative",
          nav_button: "border border-slate-200 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-50 rounded-md",
          head_cell: "text-slate-400 font-bold text-[11px] uppercase tracking-wider w-9",
          caption_label: "text-sm font-bold text-slate-900",
        }}
        // 3. Modifiers updated to match your DB "status" values
        modifiers={{
          taken: (date) => getEntryForDate(date)?.status === "taken",
          missed: (date) => getEntryForDate(date)?.status === "missed",
        }}
        modifiersClassNames={{
          taken: cn(
            "relative font-semibold text-slate-900",
            "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1",
            "after:bg-emerald-500 after:rounded-full after:ring-1 after:ring-white"
          ),
          missed: cn(
            "relative font-semibold text-slate-900",
            "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1",
            "after:bg-red-500 after:rounded-full after:ring-1 after:ring-white"
          ),
        }}
      />

      {/* Legend */}
      <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-emerald-50" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Taken</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-red-50" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Missed</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-blue-50" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Selected / Today</span>
        </div>
      </div>
    </div>
  );
}