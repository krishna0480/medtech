"use client"
// app/dashboard/page.tsx

import { StatCard } from "../component/card";
import { DASHBOARD_CARDS } from "../constants";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DASHBOARD_CARDS.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
      </div>
    </div>
  );
}