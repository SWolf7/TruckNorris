import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { API, setUserEmail, setUserRole, userEmail } from "../../globalState";

export default function ViewFleet({ navigation }) {
  const [driverData, setDriverData] = useState([]);
  const [sponsorOrg, setSponsorOrg] = useState("");
  const [pointInputs, setPointInputs] = useState({});

  useEffect(() => {
    fetchSponsorOrganization();
  }, []);

  useEffect(() => {
    if (sponsorOrg) {
      fetchFleetData();
    }
  }, [sponsorOrg]);

  const fetchSponsorOrganization = async () => {
    try {
      const response = await fetch(`${API}/api/sponsors`);
      const sponsors = await response.json();
      const sponsor = sponsors.find(s => s.email === userEmail);
      if (sponsor && sponsor.Organization) {
        setSponsorOrg(sponsor.Organization);
      } else {
        console.warn("No sponsor organization found.");
      }
    } catch (error) {
      console.error("Error fetching sponsor organization:", error);
    }
  };

  const fetchFleetData = async () => {
    try {
      const response = await fetch(`${API}/api/drivers`);
      const data = await response.json();

      const filteredDrivers = data.filter(driver =>
        driver.sponsor_list?.split(",").includes(sponsorOrg)
      );

      const enrichedDrivers = await Promise.all(
        filteredDrivers.map(async (driver) => {
          try {
            const pointsResponse = await fetch(
              `${API}/api/driverInfo_get?email=${driver.email}&organization=${encodeURIComponent(sponsorOrg)}`
            );
            const pointsData = await pointsResponse.json();
            const points = pointsData[0]?.points_total || 0;

            return { ...driver, points };
          } catch (err) {
            console.error(`Error fetching points for ${driver.email}:`, err);
            return { ...driver, points: 0 };
          }
        })
      );

      setDriverData(enrichedDrivers);
    } catch (error) {
      console.error("Error fetching fleet data:", error);
    }
  };

  const handleViewAs = (email, role) => {
    setUserEmail(email);
    setUserRole(role);
    console.log('Now viewing as %s', email);
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  };

  const handleRemoveSponsor = async (email) => {
    try {
      const response = await fetch(`${API}/api/drivers/${email}/remove-sponsor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsor: sponsorOrg }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove sponsor.");
      }

      const result = await response.json();
      Alert.alert("Success", result.message);
      fetchFleetData();
    } catch (error) {
      console.error("Error removing sponsor:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleGivePoints = async (driverEmail, inputValue) => {
    const parsedPoints = parseInt(inputValue, 10);
    if (isNaN(parsedPoints)) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }

    try {
      const payload = {
        driver_email: driverEmail,
        sponsor_email: userEmail,
        points_change_reason: "Manual Adjustment",
        point_change_type: parsedPoints >= 0 ? 3:2,
        points_change: parsedPoints,
      };

      const response = await fetch(`${API}/api/drivers/${driverEmail}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to give points");
      }

      Alert.alert("Success", `Gave ${parsedPoints} points to ${driverEmail}`);
      fetchFleetData();
    } catch (err) {
      console.error("Error giving points:", err);
      Alert.alert("Error", "Unable to give points.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Fleet</Text>

      {driverData.length > 0 ? (
        <FlatList
          data={driverData}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.info}>Name: {item.first_name} {item.last_name}</Text>
              <Text style={styles.info}>Email: {item.email}</Text>
              <Text style={styles.info}>Years Driving: {item.years_driving}</Text>
              <Text style={styles.info}>DOB: {item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString() : "N/A"}</Text>
              <Text style={styles.driverText}>Points: {item.points}</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter points"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={pointInputs[item.email] || ""}
                onChangeText={(text) =>
                  setPointInputs((prev) => ({ ...prev, [item.email]: text }))
                }
              />

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleGivePoints(item.email, pointInputs[item.email])}
              >
                <Text style={styles.buttonText}>Give Points</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewButton} onPress={() => handleViewAs(item.email)}>
                <Text style={styles.buttonText}>View As</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveSponsor(item.email)}>
                <Text style={styles.buttonText}>Remove from Org</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>
          {sponsorOrg ? `No drivers found for ${sponsorOrg}.` : "No drivers found."}
        </Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: {     backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd", },
  info: { color: "#ffffff", fontSize: 16, marginBottom: 5 },
  input: {
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    color: "#ffffff",
    backgroundColor: "#333",
    marginBottom: 10,
    width: "100%",
  },  
  driverText: { color: "#ffffff", fontSize: 16, marginBottom: 5},
  noDataText: { fontSize: 18, fontWeight: "bold", textAlign: "center", color: "red" },
  viewButton: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6, alignItems: "center" },
  removeButton: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
