"use client";

import React, { Suspense } from "react";
import { AnalysisHero } from "../component/medication_hero_setion";
import MedicationDashboard from "../forms/medications";
import { MedicationLogValues } from "../schema/medication";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useMedicationData } from "../hooks/use_patient_data";

// Error Boundary stays the same as your structure...
class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-10 bg-red-50 rounded-[2.5rem]">Error...</div>;
    return this.props.children;
  }
}

export default function PatientLogPage() {
  const { logs, isLoading, stats, refresh } = useMedicationData();

  const handleLogSubmit = async (values: MedicationLogValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in");

      const { error } = await supabase
        .from("medication_logs")
        .upsert({
          user_id: user.id,
          medication_name: values.medicationName,
          log_date: format(values.date, "yyyy-MM-dd"),
          status: values.status,
          proof_url: values.proofPhoto || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id, log_date' });

      if (error) throw error;
      alert("Log updated!");
      refresh(); // Use the refresh function from our hook
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Patient Portal</h1>
      </header>

      <FormErrorBoundary>
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnalysisHero 
              streak={stats.streak}
              todayStatus={stats.todayStatus as any}
              monthlyRate={stats.monthlyRate}
            />
            
            <div className="mt-10">
              <MedicationDashboard 
                onSubmit={handleLogSubmit} 
                logs={logs} 
                isSubmitting={isLoading}
              />
            </div>
          </div>
        </Suspense>
      </FormErrorBoundary>
    </div>
  );
}