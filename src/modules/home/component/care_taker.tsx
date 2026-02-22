"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Bell, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  LayoutDashboard,
  History,
  Settings2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ActivityCard } from "./tabs/recent_activities";
import { MedicationCalendarSection } from "./tabs/medication_calendar_section";
import { CalendarDataMap, MedicationLogEntry } from "../page/care_taker_page";
import { Notification } from "./tabs/notifcation";
import { Form, useForm } from "react-hook-form";
import { notificationSettingsSchema, NotificationSettingsValues } from "../schema/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/src/config/supabase_client"; // Ensure this path is correct

interface CaretakerViewProps {
  mockFirebaseData: MedicationLogEntry[];
  calendarOver: CalendarDataMap;
  onSettingsSave: (email: string, time: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CaretakerView({ 
  mockFirebaseData, 
  calendarOver, 
  onSettingsSave,
  isLoading 
}: CaretakerViewProps) {
  
  const [activeTab, setActiveTab] = useState("overview");

  // --- ADDED: Fetch Auth User ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        // Reset the form with the user's email once it's fetched
        form.reset({
          ...form.getValues(),
          emailAddress: user.email,
        });
      }
    };
    fetchUser();
  }, []);

  const stats = useMemo(() => {
    const total = mockFirebaseData.length;
    const taken = mockFirebaseData.filter(l => l.status === "taken").length;
    const missed = mockFirebaseData.filter(l => l.status === "missed").length;
    const rate = total > 0 ? Math.round((taken / total) * 100) : 0;
    
    const takenToday = mockFirebaseData.some(l => 
      l.status === "taken" && isSameDay(new Date(l.log_date), new Date())
    );

    return { total, taken, missed, rate, takenToday };
  }, [mockFirebaseData]);

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: true,
      emailAddress: "", // Starts empty, filled by useEffect above
      enableMissedAlerts: true,
      gracePeriod: "2 hours",
      dailyReminderTime: "08:00 AM",
    },
  });

  const onFormSubmit = async (data: NotificationSettingsValues) => {
    await onSettingsSave(data.emailAddress, data.dailyReminderTime);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-4">
      <div className="max-w-[1240px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center md:justify-start text-slate-900 font-bold">
           <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl h-14 border border-slate-200/50 shadow-sm flex items-center">
            <TabsTrigger 
              value="overview" 
              className="gap-2 px-5 font-bold text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl transition-all"
            >
              <LayoutDashboard size={16} /> 
              <span>Overview</span>
            </TabsTrigger>

            <TabsTrigger 
              value="recent-activity" 
              className="gap-2 px-5 font-bold text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl transition-all"
            >
              <History size={16} /> 
              <span>Activity</span>
            </TabsTrigger>

            <TabsTrigger 
              value="calendar-view" 
              className="gap-2 px-5 font-bold text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl transition-all"
            >
              <CalendarIcon size={16} /> 
              <span>Calendar</span>
            </TabsTrigger>

            <TabsTrigger 
              value="notifications" 
              className="gap-2 px-5 font-bold text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl transition-all"
            >
              <Settings2 size={16} /> 
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800">Live Status</h2>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">Real-time</span>
                </div>

                <div className={cn(
                  "flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all",
                  stats.takenToday 
                    ? "bg-emerald-50/30 border-emerald-100/50" 
                    : "bg-orange-50/30 border-orange-100/50"
                )}>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 text-lg">Daily Regimen</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                      <Clock size={16} className="text-slate-400" /> Standard Morning Dose
                    </div>
                  </div>
                  {stats.takenToday ? (
                    <div className="flex flex-col items-end">
                      <div className="bg-emerald-500 p-2 rounded-full text-white mb-2 shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="bg-orange-500 p-2 rounded-full text-white mb-2 shadow-lg shadow-orange-200 animate-pulse">
                        <AlertCircle size={24} />
                      </div>
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Pending</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl font-extrabold text-slate-800 mb-8">Quick Actions</h2>
                <div className="grid gap-4">
                  <button onClick={() => setActiveTab("notifications")} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:text-blue-600">
                        <Bell size={20} />
                      </div>
                      <span className="font-bold text-slate-700">Update Alert Schedule</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-extrabold text-slate-800">Adherence Insights</h2>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                   <span className="text-xs font-bold text-slate-500">Target: 90%</span>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4 px-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Overall Compliance</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{stats.rate}<span className="text-lg text-slate-400">%</span></span>
                  </div>
                  <Progress value={stats.rate} className="h-4 bg-slate-100 rounded-full" />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
                   <div className="text-center space-y-1">
                      <p className="text-3xl font-black text-emerald-500">{stats.taken}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Successful</p>
                   </div>
                   <div className="text-center border-x border-slate-100 px-6 space-y-1">
                      <p className="text-3xl font-black text-rose-500">{stats.missed}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Missed</p>
                   </div>
                   <div className="text-center space-y-1">
                      <p className="text-3xl font-black text-blue-500">{stats.total}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Logged</p>
                   </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent-activity" className="animate-in fade-in duration-500">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-800 mb-8">Patient Medication History</h2>
              <div className="space-y-4">
                {mockFirebaseData.map((item) => (
                  <ActivityCard log={item} key={item.id} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar-view">
             <MedicationCalendarSection data={calendarOver} />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-800 mb-8">Notification Settings</h2>
              {/* No nested Form here as Notification has its own */}
              <Notification 
                form={form}
                onSubmit={onFormSubmit}
                submitButtonValue={isLoading ? "Saving..." : "Save Preferences"} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}