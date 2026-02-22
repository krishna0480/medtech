// schema/medication.ts
import * as z from "zod";

export const medicationLogSchema = z.object({
  date: z.date(),
  medicationName: z.string().min(1, "Required"),
  status: z.enum(["taken", "missed"]),
  proofPhoto: z.string().optional().or(z.literal("")), // URL from Supabase
});

export type MedicationLogValues = z.infer<typeof medicationLogSchema>;