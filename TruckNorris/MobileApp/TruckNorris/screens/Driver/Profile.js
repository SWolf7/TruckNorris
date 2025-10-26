import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API, userEmail, setActiveOrg } from "../../globalState";

export default function ProfileScreen() {
  const [points, setPoints] = useState(0);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  useEffect(() => {
    fetchPointsAndOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchPointsFromPointsPool(selectedOrg);
    }
  }, [selectedOrg]);

  const fetchPointsAndOrgs = async () => {
    try {
      const response = await fetch(`${API}/api/driverInfoGet/${userEmail}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      if (data && data[0]) {
        setPoints(data[0].points_total || 0);

        const orgList = data[0].sponsor_list?.split(",") || [];
        setOrganizations(orgList);
        if (orgList.length > 0) {
          setSelectedOrg(orgList[0]);
          setActiveOrg(orgList[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching driver info:", error);
      setPoints(0);
      setOrganizations([]);
    }
  };

  const fetchPointsFromPointsPool = async (org) => {
    try {
      const response = await fetch(
        `${API}/api/driverInfo_get?email=${encodeURIComponent(userEmail)}&organization=${encodeURIComponent(org)}`
      );
      if (!response.ok) throw new Error("Failed to fetch PointsPool data");

      const data = await response.json();
      if (data && data[0]) {
        setPoints(data[0].points_total || 0);
      } else {
        setPoints(0);
      }
    } catch (error) {
      console.error("Error fetching from PointsPool:", error);
    }
  };

  const handleOrgChange = (org) => {
    setSelectedOrg(org);
    setActiveOrg(org);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>

      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Welcome, {userEmail}!</Text>

      {organizations.length > 0 ? (
        <>
          <Text style={styles.text}>Select Active Organization:</Text>
          <Picker
            selectedValue={selectedOrg}
            onValueChange={handleOrgChange}
            style={styles.picker}
          >
            {organizations.map((org) => (
              <Picker.Item key={org} label={org} value={org} />
            ))}
          </Picker>
        </>
      ) : (
        <Text style={styles.text}>No Active Organizations</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  title: {
    color: "#ff0000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#555",
    color: "#ffffff",
    padding: 2,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    dropdownIconColor: "#fff",
  },
});
