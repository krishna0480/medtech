"use client";

import React, { Suspense, useState, useEffect } from "react";
import { AnalysisHero } from "../component/medication_hero_setion";
import MedicationDashboard from "../forms/medications";
import { MedicationLogValues } from "../schema/medication";
import { supabase } from "@/src/config/supabase_client";
import { format } from "date-fns";
import { Loader2, Settings2, ClipboardList } from "lucide-react";
import { useMedicationData } from "../hooks/use_patient_data";

// Notification Form Imports
import { useForm } from "react-hook-form";
import { notificationSettingsSchema, NotificationSettingsValues } from "../schema/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notification } from "../component/tabs/notifcation";

class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-10 bg-red-50 rounded-[2.5rem] font-bold text-red-600">Something went wrong with the form.</div>;
    return this.props.children;
  }
}

export default function PatientLogPage() {
  const { logs, schedule, isLoading, stats, refresh, notifications } = useMedicationData();
  const [activeTab, setActiveTab] = useState("logging");

  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: false,
      emailAddress: "",
      enableMissedAlerts: false,
      gracePeriod: "2 hours",
      dailyReminderTime: "08:00 AM",
    },
  });

  useEffect(() => {
    if (schedule) {
      notificationForm.reset({
        emailAddress: schedule.caretaker_email || "",
        dailyReminderTime: schedule.cutoff_time || "08:00 AM",
        enableEmailNotifications: !!schedule.caretaker_email,
        enableMissedAlerts: !!schedule.cutoff_time,
        gracePeriod: "2 hours", 
      });
    }
  }, [schedule, notificationForm]);

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
      refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSettingsSave = async (data: NotificationSettingsValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("medication_schedules")
        .upsert({
          user_id: user.id,
          caretaker_email: data.emailAddress,
          cutoff_time: data.dailyReminderTime,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      alert("Settings saved successfully!");
      refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save settings.");
    }
  };

  console.log('notifications',schedule)

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter ">Patient Portal</h1>
          <p className="text-slate-500 font-medium">Track progress and manage caretaker alerts</p>
        </div>

      </header>

      <FormErrorBoundary>
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
          <div className="space-y-12">
            <AnalysisHero 
              streak={stats.streak}
              todayStatus={stats.todayStatus as any}
              monthlyRate={stats.monthlyRate}
            />
            
            <Tabs value={activeTab} className="mt-0">
              <TabsContent value="logging" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <MedicationDashboard 
                  onSubmit={handleLogSubmit}
                  logs={logs}
                  isSubmitting={isLoading}
                  notifications={notifications} 
                  schedule={schedule}              
                   />
              </TabsContent>

              <TabsContent value="settings" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Notification Preferences</h2>
                    <p className="text-slate-500 mb-10 font-medium">Configure automated alerts for your caretaker.</p>
                    
                    <Notification
                      form={notificationForm} 
                      onSubmit={handleSettingsSave} 
                      submitButtonValue={isLoading ? "Saving..." : "Update Preferences"} 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Suspense>
      </FormErrorBoundary>
    </div>
  );
}