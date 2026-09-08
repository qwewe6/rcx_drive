import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

import { AuthProvider, useAuth } from "../src/hooks/useAuth";

// Redirects between the (auth) and (tabs) route groups based on session
// state. Runs inside AuthProvider so useAuth() is available; separated
// from RootLayout because useAuth() can't be called above its own
// provider.
function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)/feed");
    }
  }, [session, loading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
