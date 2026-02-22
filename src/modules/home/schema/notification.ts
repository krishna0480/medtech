import * as z from "zod";

export const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  emailAddress: z.string().email("Invalid email").or(z.literal("")),
  enableMissedAlerts: z.boolean(),
  gracePeriod: z.string().min(1, "Required"),
  dailyReminderTime: z.string().min(1, "Required"),
});

export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;