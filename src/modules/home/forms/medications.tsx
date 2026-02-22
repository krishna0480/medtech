"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, CalendarIcon, ExternalLink, Loader2 } from "lucide-react";

/* Shared / UI Imports */
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MedicationCalendar } from "@/src/shared/components/calendar";
import { medicationLogSchema, MedicationLogValues } from "../schema/medication";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";

// Match the interface from your Page component
interface MedicationLogEntry {
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string;
  status: "taken" | "missed";
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationDashboardProps {
  onSubmit: (values: MedicationLogValues) => Promise<void>;
  isSubmitting: boolean;
  logs: MedicationLogEntry[]; 
}

const MedicationDashboard = ({ 
  onSubmit, 
  isSubmitting,
  logs = [] 
}: MedicationDashboardProps) => {

  /* 1. Initialize Form */
  const form = useForm<MedicationLogValues>({
    resolver: zodResolver(medicationLogSchema),
    defaultValues: {
      status: "taken",
      medicationName: "Daily Medication Set",
      date: new Date(),
      proofPhoto: "",
    },
  });

  const { 
    setValue, 
    watch, 
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors } 
  } = form;

  const [isUploading, setIsUploading] = useState(false);
  const activeDate = watch("date");
  const currentPhotoUrl = watch("proofPhoto");

  /* 2. AUTO-SYNC: When activeDate changes, check if a log already exists in the 'logs' prop */
  useEffect(() => {
    const selectedDateString = format(activeDate, "yyyy-MM-dd");
    const existingEntry = logs.find(log => log.log_date === selectedDateString);

    if (existingEntry) {
      // Populate form with existing data for this date
      setValue("status", existingEntry.status);
      setValue("proofPhoto", existingEntry.proof_url || "");
    } else {
      // Reset to defaults for a fresh day
      setValue("status", "taken");
      setValue("proofPhoto", "");
    }
  }, [activeDate, logs, setValue]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("date", date, { shouldValidate: true });
    }
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("proofs")
        .upload(`med-proofs/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("proofs")
        .getPublicUrl(`med-proofs/${fileName}`);

      setValue("proofPhoto", publicUrl, { shouldValidate: true });
      clearErrors("proofPhoto");
    } catch (error: any) {
      setError("proofPhoto", { type: "manual", message: error.message });
    } finally {
      setIsUploading(false);
    }
  }, [setValue, clearErrors, setError]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      
      {/* LEFT COLUMN: FORM */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2 mb-2 text-blue-600">
          <CalendarIcon size={20} />
          <h2 className="text-xl font-bold text-slate-800">
            Log for {format(activeDate, "MMMM do, yyyy")}
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Photo Upload Area */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 bg-slate-50/30 flex flex-col items-center min-h-[250px] justify-center">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" />
                    <span className="text-sm text-slate-500">Uploading to proofs...</span>
                  </div>
                ) : currentPhotoUrl ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <img src={currentPhotoUrl} className="w-32 h-32 object-cover rounded-xl mb-3 border shadow-md" alt="Medication proof" />
                    <div className="flex gap-4">
                      <a href={currentPhotoUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        <ExternalLink size={14} /> Full View
                      </a>
                      <button type="button" onClick={() => setValue("proofPhoto", "")} className="text-xs font-bold text-red-500 hover:text-red-700">
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera size={48} className="text-slate-300 mb-4" />
                    <input type="file" id="photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <label htmlFor="photo" className="cursor-pointer px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                      Upload Proof Image
                    </label>
                    <p className="text-xs text-slate-400 mt-4">Capture your medication to verify</p>
                  </>
                )}
                {errors.proofPhoto && <p className="text-red-500 text-xs mt-2 font-medium">{errors.proofPhoto.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isUploading || isSubmitting} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-emerald-100 transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
                {logs.some(l => l.log_date === format(activeDate, "yyyy-MM-dd")) ? "Update Log" : "Mark as Taken"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* RIGHT COLUMN: CALENDAR */}
      <div className="w-full lg:w-[380px] space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-2">Adherence History</h2>
        <div className="bg-white border rounded-3xl p-6 shadow-sm border-slate-100">
          <MedicationCalendar 
            logs={logs} 
            selectedDate={activeDate}
            onDateChange={handleDateChange} 
          />
          
          <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" /> Taken
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                {logs.filter(l => l.status === "taken").length} Days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className="w-3 h-3 bg-red-400 rounded-full shadow-sm shadow-red-200" /> Missed
              </div>
              <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded-full">
                {logs.filter(l => l.status === "missed").length} Days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDashboard;