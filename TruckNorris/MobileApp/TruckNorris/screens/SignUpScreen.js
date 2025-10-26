import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import stylesShared from "./styles";
import { setUserEmail, setUserRole, API } from "../globalState";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [yearsDriving, setYearsDriving] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const parsedDOB = new Date(dateOfBirth);
    if (isNaN(parsedDOB)) {
      Alert.alert("Error", "Invalid Date of Birth. Please use YYYY-MM-DD format.");
      return;
    }

    try {
      const response = await fetch(`${API}/loginCreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
          date_of_birth: parsedDOB.toISOString().split("T")[0],
          years_driving: yearsDriving,
        }),
      });

      if (!response.ok) throw new Error("Failed to create driver account");

      const result = await response.json();
      console.log(result);
      if (result) {
        Alert.alert("Success", "Account created! Please log in with your credentials.");
        navigation.replace("LoginScreen");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Truck Norris</Text>
      <Text style={stylesShared.subtitle}>Create an account</Text>

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
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <TextInput
        style={stylesShared.input}
        placeholder="Years of Driving"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={yearsDriving.toString()}
        onChangeText={(text) => setYearsDriving(text)}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.backButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  signupButton: { 
    backgroundColor: "#ff0000", 
    padding: 14, 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center",
    marginBottom: 10
  },
  signupButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  backButton: { 
    marginTop: 10,
    padding: 14, 
    alignItems: "center" 
  },
  backButtonText: { 
    color: "#007bff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});
