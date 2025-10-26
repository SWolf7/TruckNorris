import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AddScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AddMenuButton title="Go To Profile" onPress={() => navigation.navigate("Profile")} />
      <AddMenuButton title="Go To Application" onPress={() => navigation.navigate("DriverApp")} />
    </View>
  );
}

// Reusable Button Component
const AddMenuButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: { backgroundColor: "#1a1a1a", flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  menuButton: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, marginVertical: 5, width: "80%", alignItems: "center" },
  menuButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});
