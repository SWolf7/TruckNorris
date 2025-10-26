import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import stylesShared from "../styles";

export default function SponsorDashboard({ navigation }) {
  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Sponsor Dashboard</Text>
      <SponsorMenuButton title="View Applications" onPress={() => navigation.navigate("ViewApps")} />
      <SponsorMenuButton title="View Fleet" onPress={() => navigation.navigate("ViewFleet")} />
    </View>
  );
}

// Reusable Button Component
const SponsorMenuButton = ({ title, onPress }) => (
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
