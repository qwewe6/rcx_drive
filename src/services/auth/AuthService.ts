import type { ProfileUpdateInput, Session, SignInInput, SignUpInput } from "../../types/auth";

// Contract both auth implementations (mock + Supabase) satisfy. Screens
// and useAuth() depend only on this interface, never on either concrete
// implementation, so swapping which one is active (see index.ts) doesn't
// touch UI code.
export interface AuthService {
  getSession(): Promise<Session | null>;
  signUp(input: SignUpInput): Promise<Session>;
  signIn(input: SignInInput): Promise<Session>;
  signOut(): Promise<void>;
  updateProfile(input: ProfileUpdateInput): Promise<Session>;
  /** Fires whenever the session changes (sign in/out, profile update). */
  onSessionChange(callback: (session: Session | null) => void): () => void;
}
