"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Camera, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
// Import the strict type we defined in the Page
import { format, parseISO } from "date-fns";
import { MedicationLogEntry } from "../../page/care_taker_page";

interface ActivityCardProps {
  log: MedicationLogEntry;
  onPhotoClick?: (url: string) => void;
}

export function ActivityCard({ log, onPhotoClick }: ActivityCardProps) {
  // Update: Check for 'taken' to match Supabase status
  const isTaken = log.status === "taken";

  return (
    <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50/80 transition-all duration-200 group shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Dynamic Status Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
          isTaken ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isTaken ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
        </div>

        <div>
          {/* Format the date nicely: e.g., "Monday, Feb 23" */}
          <h4 className="font-bold text-slate-900 leading-tight">
            {format(parseISO(log.log_date), "EEEE, MMM d")}
          </h4>
          
          <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
            {isTaken ? (
              <>
                <Clock size={14} className="text-slate-400" />
                <span className="font-medium">
                  Taken at {format(new Date(log.updated_at), "h:mm a")}
                </span>
              </>
            ) : (
              <span className="text-red-500 font-medium italic">
                Medication was missed
              </span>
            )}
          </div>
          
          {/* Display the medication name if available */}
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">
            {log.medication_name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Show Photo button if a proof_url exists in Supabase */}
       {/* Show Photo button if a proof_url exists in Supabase */}
        {log.proof_url && (
          <button 
            onClick={() => {
              // Logic: If proof_url exists (is not null), open it
              if (log.proof_url) {
                window.open(log.proof_url, "_blank", "noopener,noreferrer");
              }
              onPhotoClick?.(log.proof_url!);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Camera size={14} />
            View Proof
          </button>
        )}

        {/* Status Pill */}
        <span className={cn(
          "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
          isTaken 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
            : "bg-red-50 text-red-600 border-red-100"
        )}>
          {log.status}
        </span>
      </div>
    </div>
  );
}