import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import stylesShared from "../styles";

export default function ManageUsersScreen({ navigation }) {
  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Manage Users</Text>
      <UserMenuButton title="Manage Drivers" onPress={() => navigation.navigate("ManageDrivers")} />
      <UserMenuButton title="Manage Sponsors" onPress={() => navigation.navigate("ManageSponsors")} />
      <UserMenuButton title="Manage Admins" onPress={() => navigation.navigate("ManageAdmins")} />
      <Text style={stylesShared.title}>Manage Tickets</Text>
      <UserMenuButton title="Sponsor Tickets" onPress={() => navigation.navigate("SponsorTickets")} />
      <UserMenuButton title="Driver Tickets" onPress={() => navigation.navigate("DriverTickets")} />
    </View>
  );
}

// Reusable Button Component
const UserMenuButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  menuButton: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, marginVertical: 5, width: "80%", alignItems: "center" },
  menuButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
