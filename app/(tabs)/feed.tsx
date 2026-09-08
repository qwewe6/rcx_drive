import { StyleSheet, Text, View } from "react-native";

// Placeholder screen - Milestone 1 scaffolding only. Real content is scoped
// to its own milestone/issue (see docs/plans/initial-scaffolding.md).
export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600" },
  subtitle: { marginTop: 8, color: "#666" },
});
