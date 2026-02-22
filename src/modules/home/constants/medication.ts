import { MedicationLogValues } from "../schema/medication";

export type FieldType = "text" | "date" | "file" | "select" | "radio";

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
    name: "status",
    label: "Intake Status",
    type: "radio",
    description: "Did you take your medication today?",
    options: [
      { label: "Taken", value: "taken" },
      { label: "Missed", value: "missed" },
    ],
  },
  {
    name: "proofPhoto",
    label: "Photo Verification",
    type: "file",
    description: "Upload a clear photo of your medication.",
  }
];