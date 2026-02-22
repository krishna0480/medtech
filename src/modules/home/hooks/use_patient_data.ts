import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/src/config/supabase_client";
import { format, startOfMonth, isSameMonth } from "date-fns";

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

export function useMedicationData() {
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (error) throw error;
      setLogs((data as MedicationLogEntry[]) || []);
    } catch (error) {
      console.error("Hook fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Memoize stats so they only recalculate when logs change
  const stats = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    // 1. Today's Status
    const todayEntry = logs.find(log => log.log_date === todayStr);
    const todayStatus = todayEntry ? todayEntry.status : "pending";

    // 2. Monthly Rate
    const currentMonthLogs = logs.filter(log => 
      isSameMonth(new Date(log.log_date), new Date())
    );
    const takenCount = currentMonthLogs.filter(log => log.status === "taken").length;
    const monthlyRate = currentMonthLogs.length > 0 
      ? Math.round((takenCount / currentMonthLogs.length) * 100) 
      : 0;

    // 3. Streak Calculation
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => b.log_date.localeCompare(a.log_date));
    for (const log of sortedLogs) {
      if (log.status === "taken") streak++;
      else break;
    }

    return { streak, todayStatus, monthlyRate };
  }, [logs]);

  return { logs, isLoading, stats, refresh: fetchLogs };
}