// components/dashboard/top-nav.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Bell } from "lucide-react";

export function TopNav() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 shrink-0">
      {/* Logo & Brand Section */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#04374E] rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm" />
        </div>
        <h1 className="text-xl font-bold text-[#0d1b2a]">MediCare Companion</h1>
      </div>

      {/* Actions & User Section */}
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-800">John Doe</p>
            <p className="text-xs text-slate-400">Patient</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}