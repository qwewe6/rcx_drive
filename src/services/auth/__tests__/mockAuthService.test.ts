import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMockAuthService } from "../mockAuthService";

describe("mockAuthService", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("has no session before sign-up/sign-in", async () => {
    const auth = createMockAuthService();
    expect(await auth.getSession()).toBeNull();
  });

  it("signs up a new user and persists the session", async () => {
    const auth = createMockAuthService();
    const session = await auth.signUp({
      email: "Rider@Example.com",
      password: "trailblazer1",
      username: "Rider",
    });

    expect(session.user.email).toBe("rider@example.com");
    expect(session.profile.username).toBe("rider");
    expect(await auth.getSession()).toEqual(session);
  });

  it("rejects sign-up with a short password", async () => {
    const auth = createMockAuthService();
    await expect(
      auth.signUp({ email: "a@example.com", password: "short", username: "a" }),
    ).rejects.toThrow(/at least 8 characters/);
  });

  it("rejects a duplicate email on sign-up", async () => {
    const auth = createMockAuthService();
    await auth.signUp({ email: "dup@example.com", password: "password1", username: "one" });
    await expect(
      auth.signUp({ email: "dup@example.com", password: "password2", username: "two" }),
    ).rejects.toThrow(/already exists/);
  });

  it("rejects a duplicate username on sign-up", async () => {
    const auth = createMockAuthService();
    await auth.signUp({ email: "first@example.com", password: "password1", username: "crawler" });
    await expect(
      auth.signUp({ email: "second@example.com", password: "password2", username: "crawler" }),
    ).rejects.toThrow(/already taken/);
  });

  it("signs in with correct credentials and rejects wrong ones", async () => {
    const auth = createMockAuthService();
    await auth.signUp({ email: "sign@example.com", password: "password1", username: "signer" });
    await auth.signOut();

    const session = await auth.signIn({ email: "sign@example.com", password: "password1" });
    expect(session.profile.username).toBe("signer");

    await expect(auth.signIn({ email: "sign@example.com", password: "wrong" })).rejects.toThrow(
      /Invalid email or password/,
    );
  });

  it("signs out and clears the session", async () => {
    const auth = createMockAuthService();
    await auth.signUp({ email: "out@example.com", password: "password1", username: "outward" });
    await auth.signOut();
    expect(await auth.getSession()).toBeNull();
  });

  it("updates the profile of the signed-in user", async () => {
    const auth = createMockAuthService();
    await auth.signUp({ email: "edit@example.com", password: "password1", username: "editor" });

    const updated = await auth.updateProfile({
      displayName: "Trail Blazer",
      bio: "Crawls on weekends",
    });
    expect(updated.profile.displayName).toBe("Trail Blazer");
    expect(updated.profile.bio).toBe("Crawls on weekends");

    const session = await auth.getSession();
    expect(session?.profile.displayName).toBe("Trail Blazer");
  });

  it("rejects updateProfile when no one is signed in", async () => {
    const auth = createMockAuthService();
    await expect(auth.updateProfile({ displayName: "Nobody" })).rejects.toThrow(
      /No signed-in user/,
    );
  });

  it("notifies onSessionChange listeners on sign-up and sign-out", async () => {
    const auth = createMockAuthService();
    const seen: (string | null)[] = [];
    const unsubscribe = auth.onSessionChange((session) =>
      seen.push(session?.profile.username ?? null),
    );

    await auth.signUp({ email: "listen@example.com", password: "password1", username: "listener" });
    await auth.signOut();
    unsubscribe();

    expect(seen).toEqual(["listener", null]);
  });
});
