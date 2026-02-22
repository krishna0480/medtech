import { CalendarIcon, History, LayoutDashboard, LucideIcon, Settings2 } from "lucide-react";

export type TabId = "overview" | "recent-activity" | "calendar-view" | "notifications";

export interface NavigationTab {
  id: TabId;
  label: string;
  icon: LucideIcon;
  // Optional: Add permissions if you later want to hide tabs based on user role
  roles?: ("patient" | "caretaker")[];
}

export const CARETAKER_NAVIGATION: NavigationTab[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "recent-activity", label: "Activity", icon: History },
  { id: "calendar-view", label: "Calendar", icon: CalendarIcon },
  { id: "notifications", label: "Settings", icon: Settings2 },
];