import { Home, Calendar, Pill, User, ClipboardList, LucideIcon } from "lucide-react";

export type CardVariant = "blue" | "green" | "border-blue" | "border-green";

export interface DashboardCard {
  title: string;
  icon: LucideIcon;
  variant: CardVariant;
  description: string | null;
  buttonText: string | null;
  buttonVariant: "blue" | "green" | null;
  route: string | null;
  list: string[] | null;
}

// 1. Define the unique data only
const DATA = [
  {
    title: "Upcoming Appointments",
    description: "adherence",
    buttonText: "Dashboard Patient",
    buttonVariant: "blue",
    route: "/dashboard/patient",
    variant: "blue",
    icon: User,
  },
  {
    title: "Today's Medications",
    description: "Track your medication schedule maintenance",
    buttonText: "Dashboard Card",
    buttonVariant: "green",
    route: "/dashboard/care_taker",
    variant: "green",
    icon: Pill,
  },
  {
    title: "Daily Tasks",
    variant: "border-blue",
    icon: ClipboardList,
    list: ["Mark medications as taken", "Upload proof photos (optional)", "Spare Interest"],
  },
  {
    title: "Recent Activity",
    variant: "border-green",
    icon: ClipboardList,
    list: ["Monitor medication", "View detailed reports", "Receive email alerts"],
  },
];

// 2. Map and spread defaults to avoid repetition
export const DASHBOARD_CARDS: DashboardCard[] = DATA.map((card) => ({
  description: null,
  buttonText: null,
  buttonVariant: null,
  route: null,
  list: null,
  ...card,
})) as DashboardCard[];

export const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Patient", href: "/dashboard/patient", icon: Calendar },
  { label: "Caretaker", href: "/dashboard/care_taker", icon: Pill },
];