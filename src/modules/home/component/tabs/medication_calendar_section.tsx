"use client";

import React, { useState, useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Clock, Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interface for the data structure coming from the Main Page
export interface CalendarData {
  [dateKey: string]: { // Format: "YYYY-MM-DD"
    status: "taken" | "missed" | "pending";
    medicationName: string;
    time: string;
    note?: string;
  };
}

interface Props {
  data: CalendarData; // Passed from Main Page (Month-wise)
}

export function MedicationCalendarSection({ data }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format the selected date for lookup
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const dayDetails = data[dateKey];

  // Modifiers for the calendar dots
  const modifiers = useMemo(() => ({
    taken: (date: Date) => data[format(date, "yyyy-MM-dd")]?.status === "taken",
    missed: (date: Date) => data[format(date, "yyyy-MM-dd")]?.status === "missed",
  }), [data]);

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-8 px-2">Medication Calendar Overview</h2>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: The Calendar */}
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={modifiers}
            modifiersClassNames={{
              taken: "relative after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-emerald-500 after:rounded-full after:border-2 after:border-white",
              missed: "relative after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-red-400 after:rounded-full after:border-2 after:border-white",
            }}
            className="p-0 pointer-events-auto"
          />
          
          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> MEDICATION TAKEN
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full" /> MISSED MEDICATION
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /> TODAY
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Day Details */}
        <div className="w-full lg:w-[400px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Details for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          {dayDetails ? (
            <div className={cn(
              "p-6 rounded-2xl border flex flex-col gap-4 transition-all animate-in fade-in slide-in-from-right-4",
              dayDetails.status === "taken" ? "bg-emerald-50/30 border-emerald-100" : "bg-blue-50/30 border-blue-100"
            )}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Clock size={18} />
                  <span>Today</span>
                </div>
                {dayDetails.status === "taken" && (
                  <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded">Taken</span>
                )}
              </div>
              <p className="text-slate-600 text-sm font-medium">
                Monitor {dayDetails.medicationName} status for today.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center py-12">
              <Info className="text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No medication data recorded for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}