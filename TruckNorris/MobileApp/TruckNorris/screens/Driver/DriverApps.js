import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API, getUserEmail } from "../../globalState";

export default function DriverApp({ navigation }) {
  const [application, setApplication] = useState({
    first_name: "",
    last_name: "",
    years_driving: "",
    message: "",
    sponsor: "",
    date_of_birth: "",
  });

  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${API}/api/organizations`);
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setApplication({ ...application, [key]: value });
  };

  const submitForm = async () => {
    const payload = {
      ...application,
      email: getUserEmail(), // ✅ Grab email from global state
    };

    console.log("Submitting Form Data:", payload);

    try {
      const response = await fetch(`${API}/api/submit-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Alert.alert("Error", "Submission failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Application</Text>

      <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={application.first_name} onChangeText={(text) => handleInputChange("first_name", text)} />
      <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={application.last_name} onChangeText={(text) => handleInputChange("last_name", text)} />
      <TextInput style={styles.input} placeholder="Years Driving" placeholderTextColor="#aaa" keyboardType="numeric" value={application.years_driving} onChangeText={(text) => handleInputChange("years_driving", text)} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor="#aaa" value={application.date_of_birth} onChangeText={(text) => handleInputChange("date_of_birth", text)} />

      <Text style={styles.label}>Sponsor:</Text>
      <Picker selectedValue={application.sponsor} onValueChange={(value) => handleInputChange("sponsor", value)} style={styles.picker}>
        <Picker.Item label="Select a Sponsor" value="" />
        {sponsors.map((sponsor, index) => (
          <Picker.Item key={sponsor.id || index} label={sponsor.name} value={sponsor.name} />
        ))}
      </Picker>

      <TextInput style={[styles.input, styles.textArea]} placeholder="Message" placeholderTextColor="#aaa" multiline value={application.message} onChangeText={(text) => handleInputChange("message", text)} />

      <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a", justifyContent: "center" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { color: "#ffffff", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  textArea: { height: 100, textAlignVertical: "top" },
  label: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#555',
    color: '#ffffff',
    padding: 2,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10
  },
  submitButton: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, alignItems: "center" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
