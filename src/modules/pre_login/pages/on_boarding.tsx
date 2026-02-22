import React from 'react';
import Link from 'next/link';
import { Pill, ShieldCheck, Bell } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-lg">
            <Pill className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            MediCare
          </h1>
          <p className="text-slate-500 text-lg">
            Peace of mind for caretakers and patients.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Link href="/sign_up" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-md text-center">
            Create Account
          </Link>
          
          <Link href="/login" className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold py-4 rounded-2xl transition-all text-center">
            Sign In
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}