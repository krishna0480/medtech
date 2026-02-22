"use client"

import { useMemo } from "react";
import { isWithinInterval, subDays, startOfMonth, endOfMonth, parseISO } from "date-fns";

// Define the exact shape of your Log based on the DB object we discussed
interface MedicationLogEntry {
  id: string;
  user_id: string;
  medication_name: string;
  log_date: string; // "2026-02-22"
  status: "taken" | "missed";
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CaretakerHeroProps {
  logs: MedicationLogEntry[];
  patientName?: string;
}

export function CaretakerHero({ logs, patientName = "Patient" }: CaretakerHeroProps) {
  
  const stats = useMemo(() => {
    const today = new Date();
    
    // 1. Adherence Rate
    const takenLogs = logs.filter(l => l.status === "taken");
    const adherenceRate = logs.length > 0 
      ? Math.round((takenLogs.length / logs.length) * 100) 
      : 0;

    // 2. Current Streak Logic
    let streak = 0;
    const takenDates = new Set(
      logs.filter(l => l.status === "taken").map(l => l.log_date)
    );

    let checkDate = new Date();
    // If today's log isn't in yet, start checking from yesterday for the streak
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!takenDates.has(todayStr)) {
      checkDate = subDays(checkDate, 1);
    }

    while (takenDates.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }

    // 3. Missed This Month
    const mStart = startOfMonth(today);
    const mEnd = endOfMonth(today);
    const missedThisMonth = logs.filter(l => 
      l.status === "missed" && 
      isWithinInterval(parseISO(l.log_date), { start: mStart, end: mEnd })
    ).length;

    // 4. Taken This Week (Last 7 Days)
    const weekAgo = subDays(today, 7);
    const takenThisWeek = logs.filter(l => 
      l.status === "taken" && 
      isWithinInterval(parseISO(l.log_date), { start: weekAgo, end: today })
    ).length;

    return [
      { label: "Adherence Rate", value: `${adherenceRate}%` },
      { label: "Current Streak", value: streak.toString() },
      { label: "Missed This Month", value: missedThisMonth.toString() },
      { label: "Taken This Week", value: takenThisWeek.toString() },
    ];
  }, [logs]);

  return (
    <div className="bg-gradient-to-r from-[#22c55e] via-[#2dd4bf] to-[#3b82f6] rounded-[2rem] p-8 text-white shadow-lg mb-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <span className="text-2xl">👥</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Caretaker Dashboard</h1>
          <p className="text-white/80 text-sm">Monitoring {patientName}'s medication adherence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-white/80 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}