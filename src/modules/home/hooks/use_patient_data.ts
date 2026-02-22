import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/src/config/supabase_client";
import { format, isSameMonth, parseISO } from "date-fns";

export interface MedicationLogEntry {
  updated_at: string;
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string;
  status: "taken" | "missed";
  proof_url: string | null;
  created_at: string;
}

export interface CaretakerNotification {
  id: string;
  notification_type: "missed_dose" | "reminder" | "summary";
  recipient_email: string;
  sent_at: string;
  status: "delivered" | "failed";
}

// Updated to match your ACTUAL database columns
export interface MedicationSchedule {
  caretaker_email: string;
  cutoff_time: string; // "08:00:00"
  reminder_time: string; // "09:00:00"
  med_name: string;
  display_time: string; // Formatted "8:00 AM"
}

export function useMedicationData() {
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [schedule, setSchedule] = useState<MedicationSchedule | null>(null);
  const [notifications, setNotifications] = useState<CaretakerNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    // Converts "08:00:00" to "8:00 AM"
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [logsRes, scheduleRes, notifyRes] = await Promise.all([
        supabase.from("medication_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false }),
        supabase.from("medication_schedules").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("caretaker_notifications").select("*").eq("user_id", user.id).order("sent_at", { ascending: false }).limit(20)
      ]);

      if (logsRes.error) throw logsRes.error;

      setLogs((logsRes.data as MedicationLogEntry[]) || []);
      setNotifications((notifyRes.data as CaretakerNotification[]) || []);

      if (scheduleRes.data) {
        setSchedule({
          caretaker_email: scheduleRes.data.caretaker_email || "",
          cutoff_time: scheduleRes.data.cutoff_time || "08:00:00",
          reminder_time: scheduleRes.data.reminder_time || "09:00:00",
          med_name: scheduleRes.data.med_name || "Daily Medication Set",
          display_time: formatTime(scheduleRes.data.cutoff_time)
        });
      }
    } catch (error) {
      console.error("Hook fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayEntry = logs.find(log => log.log_date === todayStr);
    const todayStatus = todayEntry ? todayEntry.status : "pending";

    const currentMonthLogs = logs.filter(log => isSameMonth(parseISO(log.log_date), new Date()));
    const takenCount = currentMonthLogs.filter(log => log.status === "taken").length;
    const monthlyRate = currentMonthLogs.length > 0 ? Math.round((takenCount / currentMonthLogs.length) * 100) : 0;

    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => b.log_date.localeCompare(a.log_date));
    for (const log of sortedLogs) {
      if (log.status === "taken") streak++;
      else if (log.log_date === todayStr && todayStatus === "pending") continue;
      else break;
    }

    return { streak, todayStatus, monthlyRate };
  }, [logs]);

  return { logs, schedule, notifications, isLoading, stats, refresh: fetchData };
}