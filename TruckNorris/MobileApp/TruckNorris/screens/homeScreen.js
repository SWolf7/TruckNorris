import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import DriverDashboard from "./Driver/DriverNavigator";
import AdminNavigator from "./Admin/AdminNavigator";
import SponsorNavigator from "./Sponsor/SponsorNavigator";
import {
  fetchUserRole,
  getUserEmail,
  getUserRole,
  setUserEmail,
  setUserRole,
} from "../globalState";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [forceRerender, setForceRerender] = useState(false); // trigger rerenders manually

  useEffect(() => {
    const loadUserInfo = async () => {
      const email = getUserEmail();
      if (!email) {
        console.warn("No user email. Redirecting to login...");
        navigation.replace("LoginScreen");
        return;
      }

      const role = await fetchUserRole(email);
      setUserRole(role);
      setLoading(false);
    };

    loadUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {getUserRole() === "driver" && <DriverDashboard />}
      {getUserRole() === "sponsor" && <SponsorNavigator />}
      {getUserRole() === "admin" && <AdminNavigator />}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});
