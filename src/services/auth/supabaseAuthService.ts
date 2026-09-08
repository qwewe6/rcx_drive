import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Profile, ProfileUpdateInput, SignInInput, SignUpInput } from "../../types/auth";
import { AuthError } from "../../types/auth";
import type { AuthService } from "./AuthService";

// Real backend, wired against the schema in
// supabase/migrations/0002_user_profiles.sql. Not active until
// EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are set — see
// index.ts for how the active implementation is chosen, and
// docs/plans/user-data-model.md for why no project is provisioned yet.
//
// This file is unused (and untested end-to-end, since there is nothing
// to point it at) until a Supabase project exists — treat it as
// reviewed-but-unverified until then.

interface ProfileRow {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_lat: number | null;
  home_lng: number | null;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    homeLat: row.home_lat,
    homeLng: row.home_lng,
  };
}

export function createSupabaseAuthService(url: string, anonKey: string): AuthService {
  const client: SupabaseClient = createClient(url, anonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  async function fetchProfile(userId: string): Promise<Profile> {
    const { data, error } = await client.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) {
      throw new AuthError(error?.message ?? "Could not load profile.");
    }
    return toProfile(data as ProfileRow);
  }

  return {
    async getSession() {
      const { data, error } = await client.auth.getSession();
      if (error) throw new AuthError(error.message);
      const authUser = data.session?.user;
      if (!authUser?.email) return null;
      const profile = await fetchProfile(authUser.id);
      return { user: { id: authUser.id, email: authUser.email }, profile };
    },

    async signUp({ email, password, username }: SignUpInput) {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw new AuthError(error.message);
      if (!data.session || !data.user?.email) {
        // Email confirmation is on for the project (Supabase default) —
        // there's no session to attach a profile update to yet.
        throw new AuthError("Account created — check your email to confirm before signing in.");
      }

      // The on_auth_user_created trigger already inserted a starter row
      // (username derived from email); overwrite it with the username the
      // user actually chose.
      const { error: updateError } = await client
        .from("profiles")
        .update({ username: username.trim().toLowerCase() })
        .eq("id", data.user.id);
      if (updateError) throw new AuthError(updateError.message);

      const profile = await fetchProfile(data.user.id);
      return { user: { id: data.user.id, email: data.user.email }, profile };
    },

    async signIn({ email, password }: SignInInput) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new AuthError(error.message);
      if (!data.user?.email) throw new AuthError("Sign-in did not return a user.");
      const profile = await fetchProfile(data.user.id);
      return { user: { id: data.user.id, email: data.user.email }, profile };
    },

    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw new AuthError(error.message);
    },

    async updateProfile(input: ProfileUpdateInput) {
      const { data: sessionData } = await client.auth.getSession();
      const authUser = sessionData.session?.user;
      if (!authUser?.email) throw new AuthError("No signed-in user.");

      const patch: Record<string, unknown> = {};
      if (input.displayName !== undefined) patch.display_name = input.displayName;
      if (input.bio !== undefined) patch.bio = input.bio;
      if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl;
      if (input.homeLat !== undefined) patch.home_lat = input.homeLat;
      if (input.homeLng !== undefined) patch.home_lng = input.homeLng;

      const { error } = await client.from("profiles").update(patch).eq("id", authUser.id);
      if (error) throw new AuthError(error.message);

      const profile = await fetchProfile(authUser.id);
      return { user: { id: authUser.id, email: authUser.email }, profile };
    },

    onSessionChange(callback) {
      const { data } = client.auth.onAuthStateChange((_event, authSession) => {
        const authUser = authSession?.user;
        if (!authUser?.email) {
          callback(null);
          return;
        }
        fetchProfile(authUser.id)
          .then((profile) =>
            callback({ user: { id: authUser.id, email: authUser.email! }, profile }),
          )
          .catch(() => callback(null));
      });
      return () => data.subscription.unsubscribe();
    },
  };
}
