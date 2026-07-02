"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  firstName: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  firstName: null,
  isLoading: true,
});

function getFirstName(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata as Record<string, string | undefined>;
  const fullName = meta.full_name ?? meta.name ?? "";
  const first = fullName.trim().split(/\s+/)[0];
  if (first) return first;
  return user.email?.split("@")[0] ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hydrateFromCloud = useFavoritesStore((s) => s.hydrateFromCloud);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (data.session?.user.id) {
          await hydrateFromCloud(data.session.user.id);
        }
      } catch (error) {
        console.warn("[auth] init failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setIsLoading(false);
      if (next?.user.id) {
        void hydrateFromCloud(next.user.id);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [hydrateFromCloud]);

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        firstName: getFirstName(user),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getGreeting(firstName: string | null): string {
  if (firstName) return `Привет, ${firstName}!`;
  return "Привет, фотограф! 👋";
}
