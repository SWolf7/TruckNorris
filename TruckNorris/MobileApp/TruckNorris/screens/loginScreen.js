import React, { useState } from "react";
import stylesShared from "./styles";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { signIn } from "../authService";
import {
  setUserEmail,
  setGlobalEmail,
  globalEmail,
} from "../globalState";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await signIn(email, password);
      if (result) {
        setUserEmail(email);
        if (globalEmail === null) {
          setGlobalEmail(email);
        }
        navigation.replace("HomeScreen");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Truck Norris</Text>
      <Text style={stylesShared.subtitle}>Login to your account</Text>

      <TextInput
        style={stylesShared.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={stylesShared.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  forgotText: {
    color: "#007bff",
    fontSize: 16,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#ff0000",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#ff0000",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
