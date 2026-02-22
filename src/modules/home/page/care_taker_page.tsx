"use client";

import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CaretakerHero } from '../component/care-taker_hero';
import CaretakerView from '../forms/care_taker';
import { supabase } from "@/src/config/supabase_client";
import { Loader2 } from "lucide-react";
import { useCaretakerData } from '../hooks/use_caretaker_data';

class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-100 text-red-600 rounded-[2rem] text-center font-medium">
          Something went wrong loading the dashboard. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CareTakerPage() {
  const { logs, calendarMap, isLoading, patientName, refresh } = useCaretakerData();

  const handleUpdateSettings = async (email: string, time: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("medication_schedules")
        .upsert({
          user_id: user.id,
          caretaker_email: email,
          cutoff_time: time,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, patientName, time }),
      // });

      alert("Settings updated and patient notified!");
    } catch (err: any) {
      alert(err.message || "An error occurred while saving settings.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">MediCare Companion</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Monitoring Dashboard</p>
          </div>
      
        </header>

        <FormErrorBoundary>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
              <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
              <p className="text-slate-400 font-medium">Analyzing patient records...</p>
            </div>
          }>
            <div className="animate-in fade-in duration-500">
              <CaretakerHero logs={logs} patientName={patientName} />
              
              <div className="mt-12">
                <CaretakerView 
                  mockFirebaseData={logs} 
                  calendarOver={calendarMap} 
                  onSettingsSave={handleUpdateSettings}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </Suspense>
        </FormErrorBoundary>
      </div>
    </div>
  );
}