import { BellRing, MailWarning, LucideIcon } from "lucide-react";
import { Path, FieldValues } from "react-hook-form";
import { NotificationSettingsValues } from "../schema/notification";

/**
 * Core Interfaces
 * Path<T> ensures that the 'id' strictly matches your Zod schema keys.
 */
export interface NotificationFieldConfig<T extends FieldValues> {
  id: Path<T>;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "time" | "number";
}

export interface NotificationSectionConfig<T extends FieldValues> {
  id: Path<T>;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: NotificationFieldConfig<T>[];
}

export const EMAIL_FIELDS: NotificationFieldConfig<NotificationSettingsValues>[] = [
  {
    id: "emailAddress",
    label: "Caretaker Email",
    placeholder: "caretaker@example.com",
    type: "email",
  }
];


export const ALERT_FIELDS: NotificationFieldConfig<NotificationSettingsValues>[] = [
  {
    id: "dailyReminderTime",
    label: "Daily Cutoff Time",
    placeholder: "08:00 AM",
    type: "text", // Can be changed to "time" if using native browser picker
  },
  {
    id: "gracePeriod",
    label: "Grace Period",
    placeholder: "e.g., 2 hours",
    type: "text",
  }
];


export const NOTIFICATION_SECTIONS: NotificationSectionConfig<NotificationSettingsValues>[] = [
  {
    id: "enableEmailNotifications",
    title: "Caretaker Email Alerts",
    description: "Send an automated report if a dose is marked as missed",
    icon: MailWarning,
    fields: EMAIL_FIELDS,
  },
  {
    id: "enableMissedAlerts",
    title: "Smart Reminders",
    description: "Define a strict daily schedule for medication logs",
    icon: BellRing,
    fields: ALERT_FIELDS,
  },
];