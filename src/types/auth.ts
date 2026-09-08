// Shared auth/profile types. Kept backend-agnostic on purpose — both
// src/services/auth/mockAuthService.ts (default, no backend configured)
// and src/services/auth/supabaseAuthService.ts implement AuthService
// against these same shapes, so screens never need to know which one is
// active. See docs/plans/user-data-model.md for the schema this mirrors.

export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  homeLat: number | null;
  homeLng: number | null;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface Session {
  user: AuthUser;
  profile: Profile;
}

export interface SignUpInput {
  email: string;
  password: string;
  username: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  homeLat?: number | null;
  homeLng?: number | null;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
