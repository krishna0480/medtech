"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import { NAV_ITEMS } from "../constants";
// import { auth } from "@/src/config/firebase";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/src/config/supabase_client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

 const handleLogout = async () => {
    try {
      // 1. Sign out from Supabase Auth
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // 2. Clear any local storage leftovers just in case
      localStorage.clear();

      // 3. Redirect to login
      router.push("/login");
      router.refresh(); // Forces Next.js to re-evaluate auth status for protected routes
      
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error logging out. Please try again.");
    }
  };
  // Logic extracted so we don't repeat it
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
        Menu
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-slate-100 text-[#0d1b2a] border-l-4 border-[#0d1b2a] rounded-l-none"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <PrimaryButton onClick={handleLogout} className="w-full flex items-center justify-center">
          <LogOut size={18} className="mr-3" />
          Logout
        </PrimaryButton>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBILE HEADER & DRAWER */}
      <header className="lg:hidden flex items-center h-16 px-4 border-b bg-white w-full sticky top-0 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button 
              className="p-2 -ml-2 hover:bg-slate-100 rounded-md outline-none"
              aria-label="Open Menu"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
             <SidebarContent />
          </SheetContent>
        </Sheet>
        
        {/* Optional: Add user avatar or spacer here to keep title centered */}
        <div className="w-10" /> 
      </header>

      {/* 2. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 border-r bg-white h-screen sticky top-0 flex-col shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}