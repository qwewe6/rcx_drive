import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  Profile,
  ProfileUpdateInput,
  Session,
  SignInInput,
  SignUpInput,
} from "../../types/auth";
import { AuthError } from "../../types/auth";
import type { AuthService } from "./AuthService";

// Default auth backend until a real Supabase project is provisioned (see
// docs/plans/user-data-model.md — "What this milestone does and doesn't
// do"). Persists to AsyncStorage so a session survives app restarts, but
// this is local-device-only, plaintext-password, single-device storage —
// it is NOT a real auth system and must never be used against real user
// data. supabaseAuthService.ts is the real implementation; index.ts picks
// which one is active.

const SESSION_KEY = "rcxdrive.mock-auth.session";
const USERS_KEY = "rcxdrive.mock-auth.users";

interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  profile: Profile;
}

function generateId(): string {
  return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function readUsers(): Promise<MockUserRecord[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as MockUserRecord[]) : [];
}

async function writeUsers(users: MockUserRecord[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function readSession(): Promise<Session | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

async function writeSession(session: Session | null): Promise<void> {
  if (session) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}

export function createMockAuthService(): AuthService {
  const listeners = new Set<(session: Session | null) => void>();

  const notify = (session: Session | null) => {
    listeners.forEach((cb) => cb(session));
  };

  return {
    async getSession() {
      return readSession();
    },

    async signUp({ email, password, username }: SignUpInput) {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedUsername = username.trim().toLowerCase();

      if (!normalizedEmail || !password || !normalizedUsername) {
        throw new AuthError("Email, password, and username are all required.");
      }
      if (password.length < 8) {
        throw new AuthError("Password must be at least 8 characters.");
      }

      const users = await readUsers();
      if (users.some((u) => u.email === normalizedEmail)) {
        throw new AuthError("An account with that email already exists.");
      }
      if (users.some((u) => u.profile.username === normalizedUsername)) {
        throw new AuthError("That username is already taken.");
      }

      const id = generateId();
      const profile: Profile = {
        id,
        username: normalizedUsername,
        displayName: null,
        avatarUrl: null,
        bio: null,
        homeLat: null,
        homeLng: null,
      };
      const record: MockUserRecord = { id, email: normalizedEmail, password, profile };

      await writeUsers([...users, record]);
      const session: Session = { user: { id, email: normalizedEmail }, profile };
      await writeSession(session);
      notify(session);
      return session;
    },

    async signIn({ email, password }: SignInInput) {
      const normalizedEmail = email.trim().toLowerCase();
      const users = await readUsers();
      const record = users.find((u) => u.email === normalizedEmail);

      if (!record || record.password !== password) {
        throw new AuthError("Invalid email or password.");
      }

      const session: Session = {
        user: { id: record.id, email: record.email },
        profile: record.profile,
      };
      await writeSession(session);
      notify(session);
      return session;
    },

    async signOut() {
      await writeSession(null);
      notify(null);
    },

    async updateProfile(input: ProfileUpdateInput) {
      const session = await readSession();
      if (!session) {
        throw new AuthError("No signed-in user.");
      }

      const updatedProfile: Profile = {
        ...session.profile,
        ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
        ...(input.homeLat !== undefined ? { homeLat: input.homeLat } : {}),
        ...(input.homeLng !== undefined ? { homeLng: input.homeLng } : {}),
      };
      const updatedSession: Session = { ...session, profile: updatedProfile };

      const users = await readUsers();
      const nextUsers = users.map((u) =>
        u.id === session.user.id ? { ...u, profile: updatedProfile } : u,
      );
      await writeUsers(nextUsers);
      await writeSession(updatedSession);
      notify(updatedSession);
      return updatedSession;
    },

    onSessionChange(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
