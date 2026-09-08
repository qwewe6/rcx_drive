import { createMockAuthService } from "./mockAuthService";
import { createSupabaseAuthService } from "./supabaseAuthService";
import type { AuthService } from "./AuthService";

export type { AuthService } from "./AuthService";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Whichever backend is active, screens and useAuth() see the same
// AuthService shape (src/services/auth/AuthService.ts) — so wiring up a
// real Supabase project later is just setting these two env vars (see
// .env.example), not a code change.
export const authService: AuthService =
  supabaseUrl && supabaseAnonKey
    ? createSupabaseAuthService(supabaseUrl, supabaseAnonKey)
    : createMockAuthService();

export const isUsingMockAuth = !(supabaseUrl && supabaseAnonKey);
