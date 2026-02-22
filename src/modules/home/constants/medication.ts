export const MEDICATION_STATUS_OPTIONS = [
  { label: "Taken", value: "taken" },
  { label: "Missed", value: "missed" },
] as const;

export const MEDICATION_DEFAULTS = {
  name: "Daily Medication Set",
  time: "8:00 AM"
};