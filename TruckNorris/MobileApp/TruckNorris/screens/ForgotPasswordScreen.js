import React, { useState } from "react";
import stylesShared from "./styles";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { API } from "../globalState"; // Your base URL

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [sq1, setSQ1] = useState("");
  const [pin, setPIN] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    if (!email.trim() || !sq1.trim() || !pin.trim() || !password.trim()) {
      Alert.alert("Missing Info", "All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sq1,
          PIN: pin,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      Alert.alert("Success", "Your password has been reset.");
      navigation.goBack();
    } catch (error) {
      console.error("Reset error:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Reset Password</Text>

      <TextInput
        style={stylesShared.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Security Phrase"
        placeholderTextColor="#aaa"
        value={sq1}
        onChangeText={setSQ1}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="PIN"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={pin}
        onChangeText={setPIN}
        keyboardType="numeric"
      />
      <TextInput
        style={stylesShared.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Confirm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  resetButton: {
    backgroundColor: "#ff0000",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  resetText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backText: { color: "#007bff", textAlign: "center", fontSize: 16 },
});
