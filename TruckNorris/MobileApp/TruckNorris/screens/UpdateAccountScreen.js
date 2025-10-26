import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { getUserEmail, getUserRole, API } from "../globalState";

export default function UpdateAccountScreen() {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    years_driving: "",
    message: "",
    sq1: "",
    pin: ""
  });

  useEffect(() => {
    const loadRole = async () => {
      const fetchedRole = await getUserRole();
      setRole(fetchedRole);
    };
    loadRole();
  }, []);

  const handleInputChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleUpdateAccount = async () => {
    try {
      const email = getUserEmail();
      const payload = { email };

      // Add only filled-out fields to the payload
      for (const key in form) {
        if (form[key] !== "") {
          payload[key] = form[key];
        }
      }

      const response = await fetch(`${API}/Updates`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update account");
      }

      Alert.alert("Success", "Your information has been updated.");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Update failed.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Account Info</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={form.first_name}
        onChangeText={(text) => handleInputChange("first_name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={form.last_name}
        onChangeText={(text) => handleInputChange("last_name", text)}
      />

      {role === "driver" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={form.date_of_birth}
            onChangeText={(text) => handleInputChange("date_of_birth", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Years Driving"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={form.years_driving}
            onChangeText={(text) => handleInputChange("years_driving", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#aaa"
            value={form.message}
            onChangeText={(text) => handleInputChange("message", text)}
          />
        </>
      )}

      {/* Shared Fields */}
      <TextInput
        style={styles.input}
        placeholder="Security Question 1 (SQ1)"
        placeholderTextColor="#aaa"
        value={form.sq1}
        onChangeText={(text) => handleInputChange("sq1", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="PIN"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.pin}
        onChangeText={(text) => handleInputChange("pin", text)}
      />

      <Button title="Update Info" onPress={handleUpdateAccount} color="#ff0000" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
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
