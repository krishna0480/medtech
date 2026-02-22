"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { CaretakerHero } from '../component/care-taker_hero'
import CaretakerView from '../component/care_taker'
import { supabase } from "@/src/config/supabase_client"
import { format } from "date-fns"

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

const CareTakerPage = () => {
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [calendarMap, setCalendarMap] = useState<CalendarDataMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Patient";
      setPatientName(name);

      const { data: logData, error: logError } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (logError) throw logError;

      const typedData = logData as MedicationLogEntry[];
      const map: CalendarDataMap = {};
      
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
    } catch (error) {
      console.error("Caretaker fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This is the core function called when the Notification form is saved
const handleUpdateSettings = async (email: string, time: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Check if a record already exists for this user
    const { data: existing } = await supabase
      .from("medication_schedules")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // 2. If it exists, use UPDATE
      const { error } = await supabase
        .from("medication_schedules")
        .update({
          caretaker_email: email,
          cutoff_time: time,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
      
      if (error) throw error;
    } else {
      // 3. If it doesn't exist, use INSERT
      const { error } = await supabase
        .from("medication_schedules")
        .insert({
          user_id: user.id,
          caretaker_email: email,
          cutoff_time: time,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    }

    // 2. Trigger the Route Level Email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        patientName: patientName,
        time: time
      }),
    });

    if (response.ok) {
      alert("Settings saved and email sent to patient!");
    }

    alert("Settings updated!");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">MediCare Companion</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Monitoring Dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="rounded-2xl font-bold px-6 border-slate-200 hover:bg-slate-50 transition-all" 
              onClick={fetchData}
              disabled={isLoading}
            >
              {isLoading ? "Syncing..." : "Refresh Data"}
            </Button>
            <Button variant="default" className="rounded-2xl font-bold px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Switch to Patient
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <CaretakerHero logs={logs} patientName={patientName} />
        
        {/* Main Tabs Section */}
        <div className="mt-12">
          <CaretakerView 
            mockFirebaseData={logs} 
            calendarOver={calendarMap} 
            onSettingsSave={handleUpdateSettings}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default CareTakerPage;