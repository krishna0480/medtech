import z from "zod";
import { SignupFieldConfig } from "../type";

// Define the fields for Login
export const LOGIN_FIELDS: SignupFieldConfig[] = [
  { id: "email", label: "Email Address", type: "INPUT", placeholder: "your@email.com", is_required: true },
  { id: "password", label: "Password", type: "INPUT", placeholder: "••••••••", is_required: true },
];

// Define the Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;