"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { SignupForm } from "../forms"; 
import { LOGIN_FIELDS, loginSchema, LoginValues } from "../schema/login_schema";
import { supabase } from "@/src/config/supabase_client"; // Updated import
import { useRouter } from "next/navigation";

class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 bg-red-50 text-red-500 rounded">Login error occurred.</div>;
    return this.props.children;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: LoginValues) => {
    try {
      // 1. Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Handle Supabase specific error messages
        if (error.message.includes("Invalid login credentials")) {
          alert("Invalid email or password.");
        } else {
          alert(error.message);
        }
        return;
      }

      if (data.user) {
        console.log("Logged in successfully:", data.user);
        // 2. Redirect to dashboard
        router.push("/dashboard");
        router.refresh(); // Refresh to update server-side auth state
      }

    } catch (error: any) {
      alert("An unexpected error occurred. Please try again.");
      console.error("Login catch block:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0d1b2a]">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to your account</p>
        </header>

        <FormErrorBoundary>
          <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0d1b2a]" /></div>}>
            <SignupForm 
              form={form} 
              onSubmit={handleLogin} 
              fields={LOGIN_FIELDS} 
              submitbuttonValue="Log In"
              footerLink={{
                text: "Don't have an account?",
                linkText: "Sign up",
                href: "/sign_up" // Ensure this matches your route name
              }}
            />
          </Suspense>
        </FormErrorBoundary>
      </div>
    </div>
  );
}