import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API } from "../../globalState";
import stylesShared from "../styles";

export default function DriverAppsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("open"); // Default to open applications

  /** Fetch Driver Applications */
  const fetchDriverApplications = async () => {
    
    try {
      let mappedStatus;
      setLoading(true);
      if (statusFilter === "open") {
        mappedStatus = 0; 
      }
      else {
        mappedStatus = 1;
      }
      console.log(mappedStatus);
      const response = await fetch(`${API}/api/submit-application/${mappedStatus}`);
      console.log(`${API}/api/submit-application/?closed=${mappedStatus}`);
      const data = await response.json();
      console.log("Fetched Applications:", data);

      if (!response.ok) throw new Error(data.message || "Failed to fetch applications.");

      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /** Pull to Refresh */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDriverApplications();
  };

  /** Close Application */
  const closeApplication = async (id) => {
    try {
      const response = await fetch(`${API}/api/submit-application/${id}/close`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log(`Closed Application ${id}:`, data);

      if (!response.ok) throw new Error(data.message || "Failed to close application.");

      Alert.alert("Success", `Application ${id} has been marked as closed.`);

      // Refresh applications list
      fetchDriverApplications();
    } catch (error) {
      console.error(`Error closing application ${id}:`, error);
      Alert.alert("Error", `Failed to close application ${id}.`);
    }
  };

  /** Fetch data on mount */
  useEffect(() => {
    fetchDriverApplications();
  }, [statusFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Applications</Text>

      {/* 🔹 Status Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Show:</Text>
        <Picker
          selectedValue={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
          style={styles.picker}
        >
          <Picker.Item label="Open Applications" value="open" />
          <Picker.Item label="Closed Applications" value="closed" />
        </Picker>
      </View>

      {/* 🔹 Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff0000" />
      ) : applications.length === 0 ? (
        <Text style={styles.noDataText}>No applications found.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.appCard }>
              <Text style={styles.appText}><Text style={styles.boldText}>ID:</Text> {item.id}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Sponsor:</Text> {item.sponsor}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>First Name:</Text> {item.first_name}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Last Name:</Text> {item.last_name}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Years Driving:</Text> {item.years_driving}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Date of Birth:</Text> {new Date(item.date_of_birth).toLocaleDateString()}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Message:</Text> {item.message}</Text>
              <Text style={styles.appText}><Text style={styles.boldText}>Created At:</Text> {new Date(item.created_at).toLocaleString()}</Text>

              {/* Show Close Button Only for Open Applications */}
              {statusFilter === "open" && (
                <TouchableOpacity style={styles.closeButton} onPress={() => closeApplication(item.id)}>
                  <Text style={styles.closeButtonText}>Close Application</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

/** Styles for Consistency */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  filterContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15 },
  filterLabel: { color: "#fff", fontSize: 16, fontWeight: "bold", marginRight: 10 },
  picker: { color: "#fff", height: 50, width: 250 },
  noDataText: { fontSize: 18, color: "gray", textAlign: "center", marginTop: 20 },
  appCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  appText: { fontSize: 16, color: "#fff" },
  boldText: { fontWeight: "bold" },
  closeButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

