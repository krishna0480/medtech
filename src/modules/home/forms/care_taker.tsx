"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isSameDay } from "date-fns";

/* Icons & Logic */
import { supabase } from "@/src/config/supabase_client";
import { notificationSettingsSchema, NotificationSettingsValues } from "../schema/notification";

/* Tab Components */
import OverviewTab from "../component/tabs/overview_tab";
import { ActivityCard } from "../component/tabs/recent_activities";
import { MedicationCalendarSection } from "../component/tabs/medication_calendar_section";
import { Notification } from "../component/tabs/notifcation";

/* Props Interfaces */
import { MedicationLogEntry } from "../hooks/use_patient_data";
import { CalendarDataMap } from "../hooks/use_caretaker_data";
import { CARETAKER_NAVIGATION, TabId } from "../constants/caretaker";

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
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Notification Form logic
  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: true,
      emailAddress: "",
      enableMissedAlerts: true,
      gracePeriod: "2 hours",
      dailyReminderTime: "08:00 AM",
    },
  });

  useEffect(() => {
    const syncUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) form.setValue("emailAddress", user.email);
    };
    syncUserEmail();
  }, [form]);

  // Derived Statistics
  const stats = useMemo(() => {
    const total = mockFirebaseData.length;
    const taken = mockFirebaseData.filter(l => l.status === "taken").length;
    const rate = total > 0 ? Math.round((taken / total) * 100) : 0;
    const takenToday = mockFirebaseData.some(l => 
      l.status === "taken" && isSameDay(new Date(l.log_date), new Date())
    );
    return { total, taken, rate, takenToday, missed: total - taken };
  }, [mockFirebaseData]);

  /**
   * Type-safe Content Renderer
   * This ensures that as you add tabs to TabId, you must handle them here.
   */
  const renderDynamicContent = (id: TabId) => {
    const contentMap: Record<TabId, React.ReactNode> = {
      overview: (
        <OverviewTab stats={stats} onActionClick={(id) => setActiveTab(id as TabId)} />
      ),
      "recent-activity": (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tighter">Medication Timeline</h2>
          <div className="space-y-4">
            {mockFirebaseData.length > 0 ? (
              mockFirebaseData.map((item) => <ActivityCard log={item} key={item.id} />)
            ) : (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No History Found</div>
            )}
          </div>
        </div>
      ),
      "calendar-view": (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <MedicationCalendarSection data={calendarOver} />
        </div>
      ),
      notifications: (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tighter">Alert Settings</h2>
          <Notification 
            form={form}
            onSubmit={(data) => onSettingsSave(data.emailAddress, data.dailyReminderTime)}
            submitButtonValue={isLoading ? "Saving..." : "Save Preferences"} 
          />
        </div>
      )
    };

    return contentMap[id];
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-4">
      <div className="max-w-[1240px] mx-auto">
        <Tabs 
          value={activeTab} 
          onValueChange={(val) => setActiveTab(val as TabId)} 
          className="space-y-10"
        >
          {/* THE NAV BAR */}
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl h-14 border border-slate-200/50 shadow-sm">
              {CARETAKER_NAVIGATION.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="gap-2 px-6 font-bold text-slate-500 data-[state=active]:text-slate-900 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all h-11"
                >
                  <tab.icon size={18} /> 
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* THE CONTENT WINDOW */}
          {CARETAKER_NAVIGATION.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id} 
              className="focus-visible:outline-none"
            >
              {renderDynamicContent(tab.id)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}