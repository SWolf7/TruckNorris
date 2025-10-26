import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import stylesShared from "../styles";

export default function AddScreen({ navigation }) {
  return (
    <View style={stylesShared.container}>
      <Text style={stylesShared.title}>Add New User</Text>
      <AddMenuButton title="Add Admin" onPress={() => navigation.navigate("AddAdmin")} />
      <AddMenuButton title="Add Driver" onPress={() => navigation.navigate("AddDriver")} />
      <AddMenuButton title="Add Organization" onPress={() => navigation.navigate("AddOrg")} />
      <AddMenuButton title="Add Sponsor User" onPress={() => navigation.navigate("AddSponsor")} />
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
  menuButton: { backgroundColor: "#ff0000", padding: 15, borderRadius: 8, marginVertical: 5, width: "80%", alignItems: "center" },
  menuButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
