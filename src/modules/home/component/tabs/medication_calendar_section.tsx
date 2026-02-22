"use client";

import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MedicationCalendar, MedicationLogEntry } from "@/src/shared/components/calendar";

// Interface for the data structure coming from the Main Page
export interface CalendarData {
  [dateKey: string]: {
    status: "taken" | "missed" | "pending";
    medicationName: string;
    time: string;
    note?: string;
  };
}

interface Props {
  data: CalendarData; 
}

export function MedicationCalendarSection({ data }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const logsArray: MedicationLogEntry[] = useMemo(() => {
    return Object.entries(data).map(([date, details]) => ({
      id: date, 
      user_id: "", 
      medication_name: details.medicationName,
      log_date: date,
      status: details.status as "taken" | "missed",
      proof_url: null,
      created_at: `${date}T${details.time}:00Z`,
      updated_at: new Date().toISOString(),
    }));
  }, [data]);

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const dayDetails = data[dateKey];

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-8 px-2">Medication Calendar Overview</h2>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Using the Reusable Component */}
        <div className="flex-1">
          <MedicationCalendar 
            logs={logsArray} 
            selectedDate={selectedDate} 
            onDateChange={(date) => date && setSelectedDate(date)} 
          />
        </div>

        {/* Right Side: Dynamic Day Details */}
        <div className="w-full lg:w-[400px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Details for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          {dayDetails ? (
            <div className={cn(
              "p-6 rounded-2xl border flex flex-col gap-4 transition-all animate-in fade-in slide-in-from-right-4",
              dayDetails.status === "taken" 
                ? "bg-emerald-50/50 border-emerald-100" 
                : "bg-red-50/50 border-red-100"
            )}>
              <div className="flex items-start justify-between">
                <div className={cn(
                  "flex items-center gap-2 font-bold",
                  dayDetails.status === "taken" ? "text-emerald-600" : "text-red-600"
                )}>
                  {dayDetails.status === "taken" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="capitalize">{dayDetails.status}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Clock size={14} />
                  <span>{dayDetails.time}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-900 font-bold text-lg">
                  {dayDetails.medicationName}
                </p>
                {dayDetails.note && (
                  <p className="text-slate-500 text-sm mt-1 bg-white/50 p-2 rounded-lg border border-slate-100 italic">
                    "{dayDetails.note}"
                  </p>
                )}
              </div>
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