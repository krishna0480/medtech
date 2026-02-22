"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { StatCard } from "../component/card";
import { DASHBOARD_CARDS } from "../constants";

// Error Boundary for UI stability (Following your specific sample structure)
class FormErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-50 border-2 border-dashed border-red-100 text-red-600 rounded-[2.5rem] text-center">
          <h3 className="font-black text-lg mb-2">Dashboard Error</h3>
          <p className="text-sm font-medium opacity-80">Failed to render dashboard metrics. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
          Health & Compliance Metrics
        </p>
      </header>
      
      <FormErrorBoundary>
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Calculating Stats...
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {DASHBOARD_CARDS.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        </Suspense>
      </FormErrorBoundary>
    </div>
  );
}