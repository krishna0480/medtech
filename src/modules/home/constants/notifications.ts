import { FieldValues, Path } from "react-hook-form";
import { NotificationSettingsValues } from "../schema/notification";

// 1. Define the interface for the field config
export interface NotificationFieldConfig<T extends FieldValues> {
  id: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}

// 1. Pass the specific Type into the Config
export const EMAIL_FIELDS: NotificationFieldConfig<NotificationSettingsValues>[] = [
  { 
    id: "emailAddress", 
    label: "Caretaker Email", 
    placeholder: "caretaker@example.com",
    type: "email" 
  },
];

export const ALERT_FIELDS: NotificationFieldConfig<NotificationSettingsValues>[] = [
  { 
    id: "gracePeriod", 
    label: "Alert Grace Period", 
    placeholder: "e.g. 2 hours",
    type: "text" 
  },
  { 
    id: "dailyReminderTime", 
    label: "Daily Reminder Time", 
    type: "time" 
  },
];