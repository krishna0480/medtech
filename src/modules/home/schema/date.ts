import * as z from "zod";

export const medicationSchema = z.object({
  date: z.string(), // "YYYY-MM-DD"
  status: z.enum(["taken", "missed", "pending"]),
  medicationName: z.string(),
  scheduledTime: z.string(),
  actualTakenTime: z.string().optional(),
  hasPhoto: z.boolean().default(false),
  photoUrl: z.string().optional(),
});

export type MedicationEntry = z.infer<typeof medicationSchema>;