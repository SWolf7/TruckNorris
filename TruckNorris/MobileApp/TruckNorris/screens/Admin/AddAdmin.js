import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { API } from "../../globalState";
import stylesShared from "../styles";

export default function AddAdminScreen() {
  const [adminEmail, setAdminEmail] = useState("");

  /** Handles API submission */
  const handleAddAdmin = async () => {
    if (!adminEmail.trim()) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      const apiUrl = `${API}/api/submit-AdminApp`;
      console.log("Submitting to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail.trim() }),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (!response.ok) throw new Error(data.message || "Failed to submit admin request.");

      Alert.alert("Success", "Admin request submitted successfully!");
      setAdminEmail(""); // Clear input field after success
    } catch (error) {
      console.error("Error submitting admin request:", error);
      Alert.alert("Error", error.message || "Submission failed. Try again.");
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Add Admin</Text>
      <TextInput
        style={stylesShared.input}
        placeholder="Enter Admin Email"
        placeholderTextColor="#aaa"
        value={adminEmail}
        onChangeText={setAdminEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddAdmin}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Styles for Consistency */
const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#ff0000", // Matches dashboard button
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
