// constants/onboarding.ts
import { User, Users2 } from "lucide-react";

export const ROLE_OPTIONS = [
  {
    id: "patient",
    title: "I'm a Patient",
    description: "Track your medication schedule and maintain your health records",
    icon: User,
    features: [
      "Mark medications as taken",
      "Upload proof photos (optional)",
      "View your medication calendar",
      "Large, easy-to-use interface",
    ],
    buttonText: "Continue as Patient",
    variant: "blue" as "blue" | "green",
  },
  {
    id: "caretaker",
    title: "I'm a Caretaker",
    description: "Monitor and support your loved one's medication adherence",
    icon: Users2,
    features: [
      "Monitor medication compliance",
      "Set up notification preferences",
      "View detailed reports",
      "Receive email alerts",
    ],
    buttonText: "Continue as Caretaker",
    variant: "green" as "blue" | "green",
  },
];

export const PATIENT_STATS = [
  { label: "Day Streak", value: "0" },
  { label: "Today's Status", value: "◯" },
  { label: "Monthly Rate", value: "0%" },
];