import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API } from "../../globalState";
import stylesShared from "../styles";

export default function AddSponsorScreen({ navigation }) {
  const [sponsor, setSponsor] = useState({
    email: "",
    first_name: "",
    last_name: "",
    Organization: "",
    password: "Password123!"
  });

  const [sponsorTypes, setSponsorTypes] = useState([]); // Sponsor types dropdown options
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch Sponsor Types from API
  useEffect(() => {
    const fetchSponsorTypes = async () => {
      try {
        const response = await fetch(`${API}/api/organizations`); // Using global API variable
        const data = await response.json();
        setSponsorTypes(data); // Assuming API returns an array of sponsor types
      } catch (error) {
        console.error("Error fetching sponsor types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorTypes();
  }, []);

  // Function to Handle Form Submission
  const handleSubmit = async () => {
    console.log("Submitting Form Data:", sponsor);

    try {
      const response = await fetch(`${API}/api/sponsor/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsor),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert("Error", data.message || "Submission failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting sponsor:", error);
      Alert.alert("Error", "Submission failed. Try again.");
    }
  };

  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Add Sponsor</Text>

      {/* Email Input */}
      <TextInput
        style={stylesShared.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={sponsor.email}
        onChangeText={(text) => setSponsor({ ...sponsor, email: text })}
        keyboardType="email-address"
      />

      {/* First Name Input */}
      <TextInput
        style={stylesShared.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={sponsor.first_name}
        onChangeText={(text) => setSponsor({ ...sponsor, first_name: text })}
      />

      {/* Last Name Input */}
      <TextInput
        style={stylesShared.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={sponsor.last_name}
        onChangeText={(text) => setSponsor({ ...sponsor, last_name: text })}
      />

      {/* Sponsor Type Dropdown */}
      {loading ? (
        <Text>Loading Organization Types...</Text>
      ) : (
        <Picker
            selectedValue={sponsor.Organization}
            onValueChange={(value) => setSponsor({ ...sponsor, Organization: value })}
            style={styles.picker}
            >
            <Picker.Item label="Select an Organization" value="" />
            {sponsorTypes.map((Organization, index) => (
                <Picker.Item key={Organization.id || index} label={Organization.name} value={Organization.name} />
            ))}
        </Picker>

      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  picker: { width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#555',
    color: '#ffffff',
    padding: 2,
    borderRadius: 8,
    fontSize: 16, marginBottom: 10, dropdownIconColor: "#fff" },  button: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, marginTop: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backButton: { marginTop: 20 },
  backButtonText: { color: "#ff0000", fontSize: 16 },
});

