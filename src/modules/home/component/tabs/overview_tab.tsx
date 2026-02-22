import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle, Bell, CheckCircle2, ChevronRight, Clock } from "lucide-react";

interface OverviewTabProps {
  stats: {
    takenToday: boolean;
    rate: number;
    taken: number;
    missed: number;
    total: number;
  };
  onActionClick:  React.Dispatch<React.SetStateAction<string>>;
}

export default function OverviewTab({ stats, onActionClick }: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Status Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Activity size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">Live Status</h2>
            </div>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">Real-time</span>
          </div>

          <div className={cn(
            "flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all",
            stats.takenToday ? "bg-emerald-50/30 border-emerald-100/50" : "bg-orange-50/30 border-orange-100/50"
          )}>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg">Daily Regimen</h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                <Clock size={16} className="text-slate-400" /> Standard Morning Dose
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className={cn(
                "p-2 rounded-full text-white mb-2 shadow-lg",
                stats.takenToday ? "bg-emerald-500 shadow-emerald-200" : "bg-orange-500 shadow-orange-200 animate-pulse"
              )}>
                {stats.takenToday ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                stats.takenToday ? "text-emerald-600" : "text-orange-600"
              )}>
                {stats.takenToday ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-extrabold text-slate-800 mb-8">Quick Actions</h2>
          <div className="grid gap-4">
            <button 
              onClick={() => onActionClick("notifications")} 
              className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all group w-full"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:text-blue-600">
                  <Bell size={20} />
                </div>
                <span className="font-bold text-slate-700">Update Alert Schedule</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-extrabold text-slate-800">Adherence Insights</h2>
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-emerald-500 rounded-full" />
             <span className="text-xs font-bold text-slate-500">Target: 90%</span>
          </div>
        </div>
        <div className="space-y-10">
          <div>
            <div className="flex justify-between items-end mb-4 px-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Overall Compliance</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{stats.rate}<span className="text-lg text-slate-400">%</span></span>
            </div>
            <Progress value={stats.rate} className="h-4 bg-slate-100 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
             <StatItem value={stats.taken} label="Successful" color="text-emerald-500" />
             <StatItem value={stats.missed} label="Missed" color="text-rose-500" isMiddle />
             <StatItem value={stats.total} label="Logged" color="text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal helper for stats
const StatItem = ({ value, label, color, isMiddle }: any) => (
  <div className={cn("text-center space-y-1", isMiddle && "border-x border-slate-100 px-6")}>
    <p className={cn("text-3xl font-black", color)}>{value}</p>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);