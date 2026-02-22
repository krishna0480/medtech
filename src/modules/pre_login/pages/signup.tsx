"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { SignupForm } from "../forms";
import { SIGNUP_FIELDS, signupSchema, SignupValues } from "../schema/signup_schema";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/config/supabase_client";

// Error Boundary for UI stability
class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 bg-red-50 text-red-500 rounded">Something went wrong.</div>;
    return this.props.children;
  }
}

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    reValidateMode: "onChange",
    mode: "onSubmit",
    defaultValues: { username: "", email: "", password: "", confirm_password: "" },
  });

  const handleSignup = async (values: SignupValues) => {
    try {
      // 1. Sign up with Supabase Auth
      // We pass username in 'options.data' so it's accessible to DB triggers or manual inserts
      const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.username,
          },
        },
      });
      console.log("data",data.user)
      console.log("authError",authError)
      if (authError) throw authError;

      if (data.user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          username: values.username,
        });

        if (dbError) throw dbError;

        alert("Signed up successfully, proceed to login");
        router.push("/login");
      }
      
    } catch (error: any) {
      // Handle unique constraint or provider errors
      if (error.message.includes("already registered")) {
        form.setError("email", { message: "This email is already in use." });
      } else {
        alert(error.message || "An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0d1b2a]">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the care tracking portal</p>
        </header>

        <FormErrorBoundary>
          <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#04374E]" /></div>}>
            <SignupForm 
              form={form} 
              onSubmit={handleSignup} 
              fields={SIGNUP_FIELDS} 
              submitbuttonValue="Sign up"
              footerLink={{
                text: "Already have an account?",
                linkText: "Log in",
                href: "/login",
              }} 
            />
          </Suspense>
        </FormErrorBoundary>
      </div>
    </div>
  );
}