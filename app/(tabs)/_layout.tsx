import { Tabs } from "expo-router";

// Tab skeleton. Auth-gating now lives in the root layout (app/_layout.tsx —
// unauthenticated users never reach this navigator). Icons and real screen
// content for Map/Garage/Feed land with their own milestones.
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
