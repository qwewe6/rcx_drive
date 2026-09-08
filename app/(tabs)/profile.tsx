import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../../src/hooks/useAuth";

// Milestone 2 (Accounts & Auth), issue #7: view/edit basic profile info.
export default function ProfileScreen() {
  const { session, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(session?.profile.displayName ?? "");
  const [bio, setBio] = useState(session?.profile.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!session) {
    // Root layout redirects unauthenticated users to (auth)/login before
    // this can render in practice; this guards the brief window while
    // that redirect is in flight.
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const { profile, user } = session;

  const startEditing = () => {
    setDisplayName(profile.displayName ?? "");
    setBio(profile.bio ?? "");
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setError(null);
    setEditing(false);
  };

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() || null, bio: bio.trim() || null });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>
          {(profile.displayName ?? profile.username).charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.username}>@{profile.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {!editing ? (
        <>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display name</Text>
            <Text style={styles.fieldValue}>{profile.displayName || "Not set"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <Text style={styles.fieldValue}>{profile.bio || "Not set"}</Text>
          </View>

          <Pressable style={styles.button} onPress={startEditing} testID="profile-edit">
            <Text style={styles.buttonText}>Edit profile</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display name"
              testID="profile-display-name"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell other crawlers about yourself"
              multiline
              testID="profile-bio"
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.row}>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={cancelEditing}
              disabled={saving}
            >
              <Text style={styles.buttonSecondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, saving && styles.buttonDisabled]}
              onPress={save}
              disabled={saving}
              testID="profile-save"
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </Pressable>
          </View>
        </>
      )}

      <Pressable style={styles.signOut} onPress={() => signOut()} testID="profile-sign-out">
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 24, gap: 4 },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarInitial: { color: "#fff", fontSize: 28, fontWeight: "700" },
  username: { fontSize: 18, fontWeight: "600" },
  email: { fontSize: 13, color: "#666", marginBottom: 16 },
  field: { width: "100%", marginTop: 12 },
  fieldLabel: { fontSize: 12, color: "#888", textTransform: "uppercase" },
  fieldValue: { fontSize: 16, marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  bioInput: { minHeight: 80, textAlignVertical: "top" },
  error: { color: "#c0392b", fontSize: 14, marginTop: 12 },
  row: { flexDirection: "row", gap: 12, marginTop: 20, width: "100%" },
  button: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
    flex: 1,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  buttonSecondary: { backgroundColor: "#eee", marginTop: 0 },
  buttonSecondaryText: { color: "#1a1a1a", fontWeight: "600", fontSize: 16 },
  signOut: { marginTop: 24, padding: 8 },
  signOutText: { color: "#c0392b", fontSize: 15 },
});
