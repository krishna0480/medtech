import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";

// Re-exporting interfaces for consistency
export interface MedicationLogEntry {
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string;
  status: "taken" | "missed";
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationEntry {
  date: string;
  status: "taken" | "missed" | "pending";
  medicationName: string;
  time: string;
  note?: string;
}

export interface CalendarDataMap {
  [dateKey: string]: MedicationEntry;
}

export function useCaretakerData() {
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [calendarMap, setCalendarMap] = useState<CalendarDataMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Set Patient Name
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Patient";
      setPatientName(name);

      // Fetch Logs
      const { data: logData, error: logError } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (logError) throw logError;

      const typedData = logData as MedicationLogEntry[];
      const map: CalendarDataMap = {};
      
      // Transform data for the Calendar view
      typedData.forEach((log) => {
        map[log.log_date] = {
          date: log.log_date,
          status: log.status === "taken" ? "taken" : "missed",
          medicationName: log.medication_name,
          time: format(new Date(log.updated_at), "hh:mm a"),
          note: log.proof_url ? "Photo proof provided" : ""
        };
      });

      setLogs(typedData);
      setCalendarMap(map);
    } catch (error: any) {
      console.error("Caretaker hook error:", error);
      throw error; // Let the ErrorBoundary catch this if needed
    } finally {
      setIsLoading(false);  
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { logs, calendarMap, isLoading, patientName, refresh: fetchData };
}