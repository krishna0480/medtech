"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, CalendarIcon, ExternalLink, Loader2 } from "lucide-react";

/* Shared / UI Imports */
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MedicationCalendar } from "@/src/shared/components/calendar";
import { medicationLogSchema, MedicationLogValues } from "../schema/medication";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";
import { MEDICATION_FORM_FIELDS } from "../constants/medication";

// Use this to define the structure of your fields
export interface FormFieldConfig {
  name: keyof MedicationLogValues;
  label: string;
  type: "text" | "date" | "file";
  placeholder?: string;
}

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
  logs = [],
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

  const { setValue, watch, handleSubmit, setError, clearErrors, formState: { errors } } = form;
  const [isUploading, setIsUploading] = useState(false);
  
  const activeDate = watch("date");
  const currentPhotoUrl = watch("proofPhoto");

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
    }
  }, [activeDate, logs, setValue]);

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
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      <div className="flex-1 space-y-4">
        <header className="flex items-center gap-2 mb-2 text-blue-600">
          <CalendarIcon size={20} />
          <h2 className="text-xl font-bold text-slate-800">
            Log for {format(activeDate, "MMMM do, yyyy")}
          </h2>
        </header>

        <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* DYNAMIC FIELD MAPPING */}
              {MEDICATION_FORM_FIELDS.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      {field.type !== "file" && <FormLabel className="font-bold text-slate-700">{field.label}</FormLabel>}
                      
                      <FormControl>
                        {field.type === "text" ? (
                          <Input 
                            {...formField} 
                            placeholder={field.placeholder} 
                            className="rounded-xl h-12 border-slate-200 focus:ring-blue-500"
                            value={formField.value instanceof Date ? "" : formField.value}
                          />
                        ) : field.type === "file" ? (
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/30 flex flex-col items-center justify-center min-h-[200px]">
                            {isUploading ? (
                              <Loader2 className="animate-spin text-blue-600" />
                            ) : currentPhotoUrl ? (
                              <div className="text-center">
                                <img src={currentPhotoUrl} className="w-24 h-24 object-cover rounded-xl mx-auto border mb-2" alt="Proof" />
                                <button type="button" onClick={() => setValue("proofPhoto", "")} className="text-xs font-bold text-red-500">Remove</button>
                              </div>
                            ) : (
                              <>
                                <Camera size={32} className="text-slate-300 mb-2" />
                                <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                <label htmlFor="photo-upload" className="cursor-pointer text-sm font-bold text-blue-600 hover:underline">
                                  {field.label}
                                </label>
                              </>
                            )}
                          </div>
                        ) : null /* Date is handled by the Calendar on the right */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button 
                type="submit" 
                disabled={isUploading || isSubmitting} 
                className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-bold transition-all shadow-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
                {logs.some(l => l.log_date === format(activeDate, "yyyy-MM-dd")) ? "Update Record" : "Log Medication"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* CALENDAR COLUMN */}
      <div className="w-full lg:w-[380px] space-y-4">
        <div className="bg-white border rounded-[2.5rem] p-6 shadow-sm border-slate-100">
          <MedicationCalendar 
            logs={logs} 
            selectedDate={activeDate}
            onDateChange={(date) => date && setValue("date", date)} 
          />
        </div>
      </div>
    </div>
  );
};

export default MedicationDashboard;