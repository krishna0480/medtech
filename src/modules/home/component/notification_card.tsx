import React from "react";
import { format, isSameDay } from "date-fns";
import { Bell, AlertCircle, Clock, Pill, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaretakerNotification, MedicationSchedule } from "../hooks/use_patient_data";

interface NotificationTimelineProps {
  notifications: CaretakerNotification[];
  selectedDate: Date;
  schedule: MedicationSchedule | null; // Added schedule prop
}

export const NotificationTimeline = ({ notifications, selectedDate, schedule }: NotificationTimelineProps) => {
  // Filter notifications sent on the selected calendar date
  const filteredNotifications = notifications.filter((n) =>
    isSameDay(new Date(n.sent_at), selectedDate)
  );

  return (
    <div className="space-y-6">
      {/* 1. PROTOCOL HEADER - Displays the Schedule */}
      <div className="relative">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200 overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                <Pill size={14} className="text-blue-300" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Active Schedule
              </span>
            </div>
            
            <h3 className="text-xl font-black tracking-tight mb-1">
              {schedule?.med_name || "Daily Medication Set"}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Complete set of daily tablets
            </p>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
               <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-400" />
                  <span className="text-sm font-black">{schedule?.display_time || "8:00 AM"}</span>
               </div>
               <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-300">
                    {format(selectedDate, "MMM d, yyyy")}
                  </span>
               </div>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <Pill className="absolute -right-4 -top-4 text-white/5 w-32 h-32 rotate-12" />
        </div>
      </div>

    </div>
  );
};