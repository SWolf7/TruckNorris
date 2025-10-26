import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API, userEmail } from "../../globalState";

export default function ViewApps() {
  const [driverApplications, setDriverApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("open");
  const [sponsorOrg, setSponsorOrg] = useState("");

  const sponsorEmail = userEmail;

  useEffect(() => {
    fetchSponsorOrganization();
  }, []);

  useEffect(() => {
    if (sponsorOrg) {
      fetchSponsorApplications();
    }
  }, [selectedStatus, sponsorOrg]);

  const fetchSponsorOrganization = async () => {
    try {
      const response = await fetch(`${API}/api/sponsors`);
      const sponsors = await response.json();
      const sponsor = sponsors.find(s => s.email === sponsorEmail);
      if (sponsor?.Organization) {
        setSponsorOrg(sponsor.Organization);
      } else {
        console.warn("No organization found for sponsor.");
      }
    } catch (error) {
      console.error("Error fetching sponsor organization:", error);
    }
  };

  const fetchSponsorApplications = async () => {
    try {
      const response = await fetch(
        `${API}/api/submit-application?sponsor=${encodeURIComponent(sponsorOrg)}&status=${selectedStatus}`
      );
      const data = await response.json();
      setDriverApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const acceptApplication = async (id, email) => {
    if (!email) {
      console.error("Error: Driver email is undefined!");
      return;
    }
    try {
      const response = await fetch(`${API}/api/submit-application/${id}/accept`, {
        method: "PATCH"
      });
      if (response.ok) {
        Alert.alert("Success", `Application ${id} accepted.`);
        fetchSponsorApplications();
      }
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const denyApplication = async (id) => {
    try {
      const response = await fetch(`${API}/api/submit-application/${id}/deny`, {
        method: "PATCH"
      });
      if (response.ok) {
        setDriverApplications(prev => prev.filter(app => app.id !== id));
        Alert.alert("Success", "Application denied.");
      }
    } catch (error) {
      console.error("Error denying application:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Applications</Text>
      <Text style={styles.label}>Viewing applications for: {sponsorOrg}</Text>

      {/* Status Filter */}
      <Text style={styles.label}>Application Status:</Text>
      <Picker style={styles.picker}
        selectedValue={selectedStatus}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
      >
        <Picker.Item label="Open" value="open" />
        <Picker.Item label="Closed" value="closed" />
      </Picker>

      <FlatList
        data={driverApplications}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card} >
            <Text  style={{ color: "#ffffff" }}>ID: {item.id}</Text>
            <Text  style={{ color: "#ffffff" }}>Name: {item.first_name} {item.last_name}</Text>
            <Text  style={{ color: "#ffffff" }}>Email: {item.email}</Text>
            <Text  style={{ color: "#ffffff" }}>Years Driving: {item.years_driving}</Text>
            <Text  style={{ color: "#ffffff" }}>DOB: {new Date(item.date_of_birth).toLocaleDateString()}</Text>
            <Text  style={{ color: "#ffffff" }}>Message: {item.message}</Text>
            <Text  style={{ color: "#ffffff" }}>Created At: {new Date(item.created_at).toLocaleString()}</Text>

            {selectedStatus === "open" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => acceptApplication(item.id, item.email)}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyButton} onPress={() => denyApplication(item.id)}>
                  <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  picker: { width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#555',
    color: '#ffffff',
    padding: 2,
    borderRadius: 8,
    fontSize: 16, marginBottom: 10, dropdownIconColor: "#fff" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  label: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginTop: 10 },
  card: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  acceptButton: { backgroundColor: "#00aa00", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  denyButton: { backgroundColor: "#ff0000", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
