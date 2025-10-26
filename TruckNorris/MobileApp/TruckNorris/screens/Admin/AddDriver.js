import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { API } from "../../globalState";
import stylesShared from "../styles";

export default function AddDriverScreen() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pointsTotal, setPointsTotal] = useState("");
  const [status, setStatus] = useState("");

  /** Handles API submission */
  const handleAddDriver = async () => {
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !pointsTotal.trim() || !status.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const apiUrl = `${API}/api/submit-DriverApp`;
      console.log("Submitting to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          password: "Password123!",
          points_total: pointsTotal.trim(),
          status: status.trim(),
        }),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (!response.ok) throw new Error(data.error || "Failed to submit driver application.");

      Alert.alert("Success", "Driver application submitted successfully!");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPointsTotal("");
      setStatus("");
    } catch (error) {
      console.error("Error submitting driver application:", error);
      Alert.alert("Error", error.message || "Submission failed. Try again.");
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Add Driver</Text>
      <TextInput style={stylesShared.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={stylesShared.input} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
      <TextInput style={stylesShared.input} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
      <TextInput style={stylesShared.input} placeholder="Points Total" placeholderTextColor="#aaa" value={pointsTotal} onChangeText={setPointsTotal} keyboardType="numeric" />
      <TextInput style={stylesShared.input} placeholder="Status" placeholderTextColor="#aaa" value={status} onChangeText={setStatus} />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddDriver}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Styles */
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

