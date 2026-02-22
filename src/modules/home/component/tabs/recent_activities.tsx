"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Camera, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { MedicationLogEntry } from "../../hooks/use_patient_data";

interface ActivityCardProps {
  log: MedicationLogEntry;
  onPhotoClick?: (url: string) => void;
}

export function ActivityCard({ log, onPhotoClick }: ActivityCardProps) {
  const isTaken = log.status === "taken";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50/80 transition-all duration-200 group shadow-sm hover:shadow-md gap-4">
      
      {/* Left Section: Icon & Details */}
      <div className="flex items-start sm:items-center gap-4">
        {/* Dynamic Status Icon - Shrink slightly on mobile */}
        <div className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors",
          isTaken ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isTaken ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> : <AlertCircle size={20} className="sm:w-6 sm:h-6" />}
        </div>

        <div className="min-w-0"> {/* min-w-0 prevents text overflow in flex containers */}
          <h4 className="font-bold text-slate-900 leading-tight truncate">
            {format(parseISO(log.log_date), "EEEE, MMM d")}
          </h4>
          
          <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
            {isTaken ? (
              <>
                <Clock size={14} className="text-slate-400" />
                <span className="font-medium whitespace-nowrap">
                  Taken at {format(new Date(log.updated_at), "h:mm a")}
                </span>
              </>
            ) : (
              <span className="text-red-500 font-medium italic">
                Medication was missed
              </span>
            )}
          </div>
          
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1 truncate">
            {log.medication_name}
          </p>
        </div>
      </div>

      {/* Right Section: Actions & Status */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
        {log.proof_url && (
          <button 
            onClick={() => {
              if (log.proof_url) {
                window.open(log.proof_url, "_blank", "noopener,noreferrer");
              }
              onPhotoClick?.(log.proof_url!);
            }}
            className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm active:scale-95"
          >
            <Camera size={14} />
            <span>View Proof</span>
          </button>
        )}

        <span className={cn(
          "px-3 sm:px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
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