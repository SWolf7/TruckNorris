import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { API } from "../../globalState";
import stylesShared from "../styles";

export default function AddOrgScreen() {
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgType, setOrgType] = useState("");

  /** Handles API submission */
  const handleAddOrganization = async () => {
    if (!orgName.trim() || !orgEmail.trim() || !orgType.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const apiUrl = `${API}/api/submit-OrgApp`;
      console.log("Submitting to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName.trim(),
          email: orgEmail.trim(),
          type: orgType.trim(),
        }),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (!response.ok) throw new Error(data.message || "Failed to submit organization request.");

      Alert.alert("Success", "Organization request submitted successfully!");
      setOrgName("");
      setOrgEmail("");
      setOrgType(""); // Clear input fields after success
    } catch (error) {
      console.error("Error submitting organization request:", error);
      Alert.alert("Error", error.message || "Submission failed. Try again.");
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Add Organization</Text>

      <TextInput
        style={stylesShared.input}
        placeholder="Organization Name"
        placeholderTextColor="#aaa"
        value={orgName}
        onChangeText={setOrgName}
      />

      <TextInput
        style={stylesShared.input}
        placeholder="Organization Email"
        placeholderTextColor="#aaa"
        value={orgEmail}
        onChangeText={setOrgEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={stylesShared.input}
        placeholder="Organization Type"
        placeholderTextColor="#aaa"
        value={orgType}
        onChangeText={setOrgType}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddOrganization}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Styles for Consistency */
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    fontSize: 16,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#ff0000", // Matches dashboard button
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
