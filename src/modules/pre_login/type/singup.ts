// types/signup.ts
import { Path, FieldValues } from "react-hook-form";

export type DynamicFieldType = 'INPUT' | 'SELECT' | 'RADIO' | 'CHECKBOX';

export interface SignupFieldConfig {
  id: string; // This must match the keys in your Zod schema
  label: string;
  type: DynamicFieldType;
  placeholder?: string;
  options?: { id: string; value: string }[]; // For Select/Radio
  is_required: boolean;
}

// Reusable interface for components that need to be form-aware
export interface BaseFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}