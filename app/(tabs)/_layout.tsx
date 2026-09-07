import { Tabs } from "expo-router";

// Foundation-only tab skeleton (Milestone 1). Icons, auth-gating, and real
// screen content land with their own milestones (Accounts & Auth, Garage,
// Map & Route/Line Discovery, Social Feed & Kudos).
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="garage" options={{ title: "Garage" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
