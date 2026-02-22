import { MedicationLogValues } from "../schema/medication";

export type FieldType = "text" | "date" | "file" | "select";

export interface DynamicField {
  name: keyof MedicationLogValues;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[]; // For future select fields
}

export const MEDICATION_FORM_FIELDS: DynamicField[] = [
  {
    name: "medicationName",
    label: "Medication Name",
    type: "text",
    placeholder: "e.g., Morning Dosage (Pills)",
    description: "Specify the medication or set you are logging."
  },
  {
    name: "date",
    label: "Schedule Date",
    type: "date",
    description: "The date this medication was intended for."
  },
  {
    name: "proofPhoto",
    label: "Photo Verification",
    type: "file",
    description: "Upload a clear photo of your medication."
  }
];