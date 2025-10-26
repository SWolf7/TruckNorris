import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API } from "../../globalState";

export default function ManageAdminsScreen() {
  const [admins, setAdmins] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // Default: Show all

  useEffect(() => {
    fetchAdmins();
  }, [selectedStatus]);

  /** Fetch Admins */
  const fetchAdmins = async () => {
    try {
      const url = selectedStatus ? `${API}/api/admins?status=${selectedStatus}` : `${API}/api/admins`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch admins.");

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      Alert.alert("Error", "Failed to load admins.");
    }
  };

  /** Update Admin Status */
  const updateAdminStatus = async (admin, newStatus) => {
    try {
      const response = await fetch(`${API}/api/admins/${admin.email}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update admin status.");

      Alert.alert("Success", `Status updated to ${getStatusLabel(newStatus)}!`);
      fetchAdmins(); // Refresh list
    } catch (error) {
      console.error("Error updating admin status:", error);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  /** Convert status number to label */
  const getStatusLabel = (status) => {
    const statusMap = { 1: "Current", 2: "Suspended", 3: "Deactivated" };
    return statusMap[status] || "Unknown";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Admins</Text>

      {/* Status Filter */}
      <Picker selectedValue={selectedStatus} onValueChange={setSelectedStatus} style={styles.picker}>
        <Picker.Item label="All" value="" />
        <Picker.Item label="Current" value="1" />
        <Picker.Item label="Suspended" value="2" />
        <Picker.Item label="Deactivated" value="3" />
      </Picker>

      {/* Admin List */}
      <FlatList
        data={admins}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.adminCard}>
            <Text style={styles.adminText}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.adminEmail}>{item.email}</Text>
            <Text style={styles.adminType}>Type: {item.type}</Text>

            {/* Status Selector */}
            <Picker
              selectedValue={item.status}
              onValueChange={(newStatus) => updateAdminStatus(item, newStatus)}
              style={styles.statusPicker}
            >
              <Picker.Item label="Current" value="1" />
              <Picker.Item label="Suspended" value="2" />
              <Picker.Item label="Deactivated" value="3" />
            </Picker>
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
  adminCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 5 },
  adminText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  adminEmail: { color: "#fff", fontSize: 16 },
  adminType: { fontSize: 14, color: "#fff", marginBottom: 5 },
  statusPicker: { color: "#fff", height: 50, width: "100%", backgroundColor: "#555", borderRadius: 5 },
  viewButton: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6, alignItems: "center" },
  viewText: { color: "#fff", fontWeight: "bold" },
});

