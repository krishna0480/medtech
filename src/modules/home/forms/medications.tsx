"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Check, Bell, Pill, ShieldCheck, ClipboardList } from "lucide-react";

/* Shared / UI Imports */
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MedicationCalendar } from "@/src/shared/components/calendar";
import { medicationLogSchema, MedicationLogValues } from "../schema/medication";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";
import { MEDICATION_FORM_FIELDS } from "../constants/medication";
import { MedicationLogEntry, CaretakerNotification, MedicationSchedule } from "../hooks/use_patient_data";
import { cn } from "@/lib/utils";
import { FormRadioGroup } from "@/src/shared/components/radio";
import { FormFileUpload } from "@/src/shared/components/file_upload";
import { NotificationTimeline } from "../component/notification_card";

interface CalendarCompatibleLog extends MedicationLogEntry {
  updated_at: string;
}

export interface MedicationDashboardProps {
  onSubmit: (values: MedicationLogValues) => Promise<void>;
  isSubmitting: boolean;
  logs: MedicationLogEntry[];
  notifications: CaretakerNotification[];
  schedule: MedicationSchedule | null;
  onDateSelect?: (date: Date) => void;
}

const MedicationDashboard = ({ 
  onSubmit, 
  isSubmitting,
  logs = [],
  notifications = [],
  schedule, 
  onDateSelect
}: MedicationDashboardProps) => {

  const form = useForm<MedicationLogValues>({
    resolver: zodResolver(medicationLogSchema),
    defaultValues: {
      status: "taken",
      medicationName: "Daily Medication Set",
      date: new Date(),
      proofPhoto: "",
    },
  });

  const { setValue, handleSubmit, control, watch, setError, clearErrors } = form;
  const [isUploading, setIsUploading] = useState(false);
  
  const activeDate = watch("date");
  const currentStatus = watch("status");

  useEffect(() => {
    if (onDateSelect) onDateSelect(activeDate);
  }, [activeDate, onDateSelect]);

  const calendarLogs: CalendarCompatibleLog[] = useMemo(() => {
    return logs.map((log) => ({
      ...log,
      updated_at: log.updated_at || log.created_at,
    }));
  }, [logs]);

  useEffect(() => {
    const selectedDateString = format(activeDate, "yyyy-MM-dd");
    const existingEntry = logs.find(log => log.log_date === selectedDateString);

    if (existingEntry) {
      setValue("status", existingEntry.status);
      setValue("proofPhoto", existingEntry.proof_url || "");
      setValue("medicationName", existingEntry.medication_name);
    } else {
      setValue("status", "taken");
      setValue("proofPhoto", "");
      setValue("medicationName", schedule?.med_name || "Daily Medication Set");
    }
  }, [activeDate, logs, setValue, schedule]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from("proofs").upload(`med-proofs/${fileName}`, file);

      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("proofs").getPublicUrl(`med-proofs/${fileName}`);

      setValue("proofPhoto", publicUrl, { shouldValidate: true });
      clearErrors("proofPhoto");
    } catch (error: any) {
      setError("proofPhoto", { type: "manual", message: error.message });
    } finally {
      setIsUploading(false);
    }
  }, [setValue, clearErrors, setError]);

  return (
    <div className="space-y-8 antialiased">
      
      {/* PRIMARY GRID: Form (Left) & Calendar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: MAIN INTAKE FORM */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
          <header className="mb-10 relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-slate-900 rounded-2xl text-white">
                <ClipboardList size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Medication Log</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Verification Terminal</p>
              </div>
            </div>
          </header>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              {MEDICATION_FORM_FIELDS.map((field, idx) => (
                <FormField
                  key={field.name}
                  control={control}
                  name={field.name as any}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">{idx + 1}</span>
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        {(() => {
                          if (field.type === "radio") {
                            return <FormRadioGroup options={field.options || []} selectedValue={formField.value} onChange={(val) => setValue("status", val as any)} />;
                          }
                          if (field.type === "file") {
                            return <FormFileUpload currentUrl={formField.value} isUploading={isUploading} onUpload={handleFileUpload} onRemove={() => setValue("proofPhoto", "")} />;
                          }
                          return <Input {...formField} placeholder={field.placeholder} className="rounded-2xl border-slate-200 h-14 focus:ring-blue-500 font-bold" value={formField.value instanceof Date ? "" : (formField.value ?? "")} />;
                        })()}
                      </FormControl>
                      <FormMessage className="text-xs font-bold text-red-500" />
                    </FormItem>
                  )}
                />
              ))}

              <Button 
                type="submit" 
                disabled={isUploading || isSubmitting} 
                className="w-full bg-slate-900 hover:bg-black text-white h-16 rounded-[1.75rem] font-black text-lg shadow-xl transition-all active:scale-[0.98] group"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check className="mr-2" size={20} strokeWidth={3} />}
                {logs.some(l => l.log_date === format(activeDate, "yyyy-MM-dd")) ? "Update Daily Record" : "Confirm Dose Taken"}
              </Button>
            </form>
          </Form>
          
          <Pill className="absolute -bottom-10 -left-10 text-slate-50 w-64 h-64 -rotate-12 pointer-events-none" />
        </div>

        {/* RIGHT: CALENDAR & ACTIVITY FEED */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Calendar Selector Card */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <CalendarIcon size={18} />
              </div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Select Date</h3>
            </div>
            <MedicationCalendar 
              logs={calendarLogs} 
              selectedDate={activeDate}
              onDateChange={(date) => date && setValue("date", date)} 
            />
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-[500px] flex flex-col">
            <header className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-amber-500 shadow-sm">
                  <Bell size={18} />
                </div>
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">System Activity</h3>
              </div>
              <div className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse",
                currentStatus === "taken" ? "bg-emerald-400" : "bg-amber-400"
              )} />
            </header>

            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
              <NotificationTimeline 
                notifications={notifications} 
                schedule={schedule}
                selectedDate={activeDate} 
              />
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center py-6">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
          <ShieldCheck size={12} /> Secure Medical Log Encrypted
        </p>
      </div>
    </div>
  );
};

export default MedicationDashboard;