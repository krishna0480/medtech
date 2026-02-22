"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/src/config/supabase_client";
import { useRouter, usePathname } from "next/navigation";
import { Session } from "@supabase/supabase-js";

const SESSION_TIMEOUT = 30 * 60 * 1000;

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login?reason=expired");
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (session) {
      timeoutRef.current = setTimeout(logout, SESSION_TIMEOUT);
    }
  }, [logout, session]);

  // Handle Activity Listeners
  useEffect(() => {
    if (!session) return;

    const activities = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    activities.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer(); // Start timer on mount if session exists

    return () => {
      activities.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [session, resetTimer]);

  // Auth Listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation Logic - Separated to prevent loops
  useEffect(() => {
    if (loading) return;

    const isPublicPage = pathname === "/login" || pathname === "/signup" || pathname == '/';

    if (!session && !isPublicPage) {
      router.replace("/login");
    } else if (session && isPublicPage) {
      router.replace("/dashboard");
    }
  }, [session, pathname, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return <>{children}</>;
}