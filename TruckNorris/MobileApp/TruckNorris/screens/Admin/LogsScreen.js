import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import stylesShared from "../styles";

export default function LogsScreen({ navigation }) {
  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Audit Page</Text>
      <LogsMenuButton title="Driver Application Logs" onPress={() => navigation.navigate("DriverApps")} />
      <LogsMenuButton title="Login Audit Logs" onPress={() => navigation.navigate("AuditLog")} />
      <LogsMenuButton title="Current Conversion Rates" onPress={() => navigation.navigate("ConversionRates")} />
    </View>
  );
}

// Reusable Button Component
const LogsMenuButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  menuButton: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, marginVertical: 5, width: "80%", alignItems: "center" },
  menuButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
