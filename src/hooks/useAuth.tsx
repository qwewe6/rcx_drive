import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { authService, isUsingMockAuth } from "../services/auth";
import type { ProfileUpdateInput, Session, SignInInput, SignUpInput } from "../types/auth";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  isUsingMockAuth: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authService
      .getSession()
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const unsubscribe = authService.onSessionChange((s) => {
      if (!cancelled) setSession(s);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    await authService.signUp(input);
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    await authService.signIn(input);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  const updateProfile = useCallback(async (input: ProfileUpdateInput) => {
    await authService.updateProfile(input);
  }, []);

  const value = useMemo(
    () => ({ session, loading, isUsingMockAuth, signUp, signIn, signOut, updateProfile }),
    [session, loading, signUp, signIn, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside an <AuthProvider>.");
  }
  return ctx;
}
