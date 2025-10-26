import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API, setUserEmail, setUserRole } from "../../globalState";
import { useNavigation } from "@react-navigation/native";

export default function ManageDriversScreen() {
  const [drivers, setDrivers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Default: Show all
  const navigation = useNavigation();

  useEffect(() => {
    fetchDrivers();
  }, [selectedStatus]);

  /** Fetch Drivers */
  const fetchDrivers = async () => {
    try {
      const url = selectedStatus
        ? `${API}/api/drivers?status=${selectedStatus}`
        : `${API}/api/drivers`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch drivers.");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      Alert.alert("Error", "Failed to load drivers.");
    }
  };

  /** Update Driver Status */
  const updateDriverStatus = async (driver, newStatus) => {
    try {
      const response = await fetch(`${API}/api/drivers/${driver.email}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update driver status.");
      Alert.alert("Success", `Status updated to ${getStatusLabel(newStatus)}!`);
      fetchDrivers(); // Refresh list
    } catch (error) {
      console.error("Error updating driver status:", error);
      Alert.alert("Error", "Failed to update driver status.");
    }
  };

  /** Pseudo Login */
  const handleViewAs = (email, role) => {
    setUserEmail(email);
    setUserRole(role);
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
    console.log('Now viewing as %s', email);

  };
  
  /** Convert status number to label */
  const getStatusLabel = (status) => {
    const statusMap = { 1: "Current", 2: "Suspended", 3: "Deactivated" };
    return statusMap[status] || "Unknown";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Drivers</Text>

      {/* Status Filter */}
      <Picker selectedValue={selectedStatus} onValueChange={setSelectedStatus} style={styles.picker}>
        <Picker.Item label="All" value="" />
        <Picker.Item label="Current" value="1" />
        <Picker.Item label="Suspended" value="2" />
        <Picker.Item label="Deactivated" value="3" />
      </Picker>

      {/* Driver List */}
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => {        
          return (
            <View style={styles.driverCard}>
              <Text style={styles.driverText}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.driverEmail}>{item.email}</Text>
              <Text style={styles.driverYears}>Years Driving: {item.years_driving}</Text>
              <Text style={styles.driverMessage}>{item.message}</Text>
        
              <Picker
                selectedValue={item.status}
                onValueChange={(newStatus) => updateDriverStatus(item, newStatus)}
                style={styles.statusPicker}
              >
                <Picker.Item label="Current" value="1" />
                <Picker.Item label="Suspended" value="2" />
                <Picker.Item label="Deactivated" value="3" />
              </Picker>
        
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewAs(item.email)}
              >
                <Text style={styles.viewText}>View As</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        
      />
    </View>
  );
}

// Styles
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
  driverCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 5 },
  driverText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  driverEmail: { color: "#fff", fontSize: 16 },
  driverYears: { fontSize: 14, color: "#fff", marginBottom: 5 },
  driverMessage: { fontSize: 14, color: "#fff", marginBottom: 5 },
  statusPicker: { color: "#fff", height: 50, width: "100%", backgroundColor: "#555", borderRadius: 5 },
  viewButton: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6, alignItems: "center" },
  viewText: { color: "#fff", fontWeight: "bold" },
});
