import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { API, getUserEmail, getUserRole } from "../globalState";

export default function Help() {
  const [problem, setProblem] = useState("");

  const handleSubmit = async () => {
    const email = getUserEmail();
    const userType = getUserRole();

    if (!problem.trim()) {
      Alert.alert("Error", "Please enter a description of your issue.");
      return;
    }

    try {
      const response = await fetch(`${API}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType, problem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit help ticket.");
      }

      Alert.alert("Success", "Your help ticket has been submitted!");
      setProblem(""); // clear input
    } catch (error) {
      console.error("Error submitting ticket:", error);
      Alert.alert("Error", "There was an issue submitting your ticket.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.subtitle}>Submit a ticket and we'll get back to you.</Text>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={6}
        placeholder="Describe your issue here..."
        placeholderTextColor="#aaa"
        value={problem}
        onChangeText={setProblem}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a1a", padding: 20, justifyContent: "center" },
    title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    subtitle: { color: "#fff", textAlign: "center", marginBottom: 20 },
    input: {
      backgroundColor: "#333",
      color: "#fff",
      borderColor: "#fff",
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      textAlignVertical: "top",
      marginBottom: 15,
    },
    button: { backgroundColor: "#ff0000", padding: 12, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  });
  