import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API, setUserEmail, setUserRole } from "../../globalState";
import { useNavigation } from "@react-navigation/native";

export default function ManageSponsorsScreen() {
  const [sponsors, setSponsors] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Default: Show all
  const navigation = useNavigation();

  useEffect(() => {
    fetchSponsors();
  }, [selectedStatus]);

  /** Fetch Sponsors */
  const fetchSponsors = async () => {
    try {
      const url = selectedStatus
        ? `${API}/api/sponsors?status=${selectedStatus}`
        : `${API}/api/sponsors`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch sponsors.");

      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      Alert.alert("Error", "Failed to load sponsors.");
    }
  };

  /** Update Sponsor Status */
  const updateSponsorStatus = async (sponsor, newStatus) => {
    try {
      const response = await fetch(`${API}/api/sponsors/${sponsor.email}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update sponsor status.");

      Alert.alert("Success", `Status updated to ${getStatusLabel(newStatus)}!`);
      fetchSponsors(); // Refresh list
    } catch (error) {
      console.error("Error updating sponsor status:", error);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  /** Pseudo Login as Sponsor */
  const handleViewAs = (email, role) => {
    setUserEmail(email);
    setUserRole(role);
    console.log('Now viewing as %s', email);
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  }; 

  /** Convert status number to label */
  const getStatusLabel = (status) => {
    const statusMap = { 1: "Current", 2: "Suspended", 3: "Deactivated" };
    return statusMap[status] || "Unknown";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Sponsors</Text>

      {/* Status Filter */}
      <Picker selectedValue={selectedStatus} onValueChange={setSelectedStatus} style={styles.picker}>
        <Picker.Item label="All" value="" />
        <Picker.Item label="Current" value="1" />
        <Picker.Item label="Suspended" value="2" />
        <Picker.Item label="Deactivated" value="3" />
      </Picker>

      {/* Sponsor List */}
      <FlatList
        data={sponsors}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.sponsorCard}>
            <Text style={styles.sponsorText}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.sponsorEmail}>{item.email}</Text>
            <Text style={styles.sponsorType}>Organization: {item.Organization}</Text>

            {/* Status Selector */}
            <Picker
              selectedValue={item.status}
              onValueChange={(newStatus) => updateSponsorStatus(item, newStatus)}
              style={styles.statusPicker}
            >
              <Picker.Item label="Current" value="1" />
              <Picker.Item label="Suspended" value="2" />
              <Picker.Item label="Deactivated" value="3" />
            </Picker>

            {/* View As Button */}
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewAs(item.email)}
            >
              <Text style={styles.viewText}>View As</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: '#ff0000', fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  picker: { width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#555',
    color: '#ffffff',
    padding: 2,
    borderRadius: 8,
    fontSize: 16, marginBottom: 10, dropdownIconColor: "#fff" },
  sponsorCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 5 },
  sponsorText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  sponsorEmail: { color: "#fff", fontSize: 16 },
  sponsorType: { fontSize: 14, color: "#fff", marginBottom: 5 },
  statusPicker: { color: "#fff", height: 50, width: "100%", backgroundColor: "#555", borderRadius: 5 },
  viewButton: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6, alignItems: "center" },
  viewText: { color: "#fff", fontWeight: "bold" },
});
