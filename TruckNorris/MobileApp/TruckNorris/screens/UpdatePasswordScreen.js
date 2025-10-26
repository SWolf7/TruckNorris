import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getUserEmail, API } from "../globalState";

export default function UpdatePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sq1, setSq1] = useState("");
  const [pin, setPin] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    const email = getUserEmail();

    try {
      const response = await fetch(`${API}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sq1,
          PIN: pin,
          password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.error || "Password reset failed.");
      } else {
        Alert.alert("Success", "Your password has been updated.");
        setNewPassword("");
        setConfirmPassword("");
        setSq1("");
        setPin("");
      }
    } catch (error) {
      console.error("Password update error:", error);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Security Phrase"
        placeholderTextColor="#aaa"
        value={sq1}
        onChangeText={setSq1}
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        placeholderTextColor="#aaa"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Update Password" onPress={handleUpdatePassword} color="#ff0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#333",
  },
});
