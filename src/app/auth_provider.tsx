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
  const isIntercepting = useRef(false);

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

  // 1. ACTIVITY LISTENERS
  useEffect(() => {
    if (!session) return;
    const activities = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();
    activities.forEach((e) => window.addEventListener(e, handleActivity));
    resetTimer();
    return () => {
      activities.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [session, resetTimer]);

  // 2. AUTH INITIALIZATION & LISTENER (Run Once)
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        const { created_at, last_sign_in_at } = initialSession.user;
        const isNew = created_at && last_sign_in_at && 
                     new Date(last_sign_in_at).getTime() - new Date(created_at).getTime() < 2000;
        
        if (isNew) {
          isIntercepting.current = true;
          await supabase.auth.signOut();
          setSession(null);
          setLoading(false);
          isIntercepting.current = false;
          return;
        }
      }
      setSession(initialSession);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (isIntercepting.current) return; // 🔥 Exit if we are already handling a sign-out

      if (event === "SIGNED_IN" && newSession?.user) {
        const { created_at, last_sign_in_at } = newSession.user;
        const isNewUser = created_at && last_sign_in_at && 
                         new Date(last_sign_in_at).getTime() - new Date(created_at).getTime() < 2000;

        if (isNewUser) {
          isIntercepting.current = true;
          await supabase.auth.signOut();
          setSession(null);
          isIntercepting.current = false;
          return;
        }
      }

      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); 

  // 3. NAVIGATION LOGIC
  useEffect(() => {
    if (loading) return;

    const isPublicPage = pathname === "/login" || pathname === "/sign_up" || pathname === "/";

    if (!session && !isPublicPage) {
      router.replace("/login");
    } else if (session && isPublicPage) {
      router.replace("/dashboard");
    }
  }, [session, pathname, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-bold text-slate-400">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}