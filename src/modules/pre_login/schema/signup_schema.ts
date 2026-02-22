// lib/validations/auth.ts
import * as z from "zod";
import { SignupFieldConfig } from "../type";

export const SIGNUP_FIELDS: SignupFieldConfig[] = [
  { id: "username", label: "Full Name", type: "INPUT", placeholder: "John Doe", is_required: true },
  { id: "email", label: "Email Address", type: "INPUT", placeholder: "john@example.com", is_required: true },
  { id: "password", label: "Password", type: "INPUT", placeholder: "••••••••", is_required: true },
  { id: "confirm_password", label: "Confirm Password", type: "INPUT", placeholder: "••••••••", is_required: true },
];

export const signupSchema = z.object({
  username: z.string().trim().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirm_password: z.string().min(1, "Confirm password is required")
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
})

export type SignupValues = z.infer<typeof signupSchema>