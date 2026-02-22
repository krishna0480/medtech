"use client"

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/config/supabase_client";
import { MedicationLogValues } from "../schema/medication";
import { AnalysisHero } from "../component/medication_hero_setion";
import MedicationDashboard from "../forms/medications";
import { format } from "date-fns";

// 1. Updated interface to match your exact DB object structure
interface MedicationLogEntry {
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string; // "2026-02-22"
  status: "taken" | "missed";
  proof_url: string | null; // URL string from your example
  created_at: string;
  updated_at: string;
}

export default function PatientLogPage() {
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLogs = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (error) throw error;
      
      if (data) {
        console.log("Fetched logs:", data);
        setLogs(data as MedicationLogEntry[]);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Fetch error:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLogSubmit = async (values: MedicationLogValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in");

      // Ensure date format matches log_date in your object: "2026-02-22"
      const dateString = format(values.date, "yyyy-MM-dd");

      // 1. Check for existing record for this specific user and date
      const { data: existingLog, error: fetchError } = await supabase
        .from("medication_logs")
        .select("id")
        .eq("user_id", user.id)
        .eq("log_date", dateString)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // 2. Prepare data object matching your DB columns
      const logData = {
        user_id: user.id,
        medication_name: values.medicationName,
        log_date: dateString,
        status: values.status,
        proof_url: values.proofPhoto || null, // Matches proof_url in your sample
        updated_at: new Date().toISOString(),
      };

      if (existingLog) {
        // UPDATE existing record
        const { error: updateError } = await supabase
          .from("medication_logs")
          .update(logData)
          .eq("id", existingLog.id);

        if (updateError) throw updateError;
        alert(`Updated record for ${dateString}`);
      } else {
        // INSERT new record
        const { error: insertError } = await supabase
          .from("medication_logs")
          .insert({
            ...logData,
            created_at: new Date().toISOString() // Set on creation
          });

        if (insertError) throw insertError;
        alert(`Saved new record for ${dateString}`);
      }

      await fetchLogs(); // Refresh calendar view

    } catch (error) {
      const err = error as Error;
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Portal</h1>
        <p className="text-slate-500">
          Track your daily medication for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      <AnalysisHero />
      
      <div className="mt-10">
        <MedicationDashboard 
          onSubmit={handleLogSubmit} 
          logs={logs} 
          isSubmitting={isLoading}
        />
      </div>
    </div>
  );
}