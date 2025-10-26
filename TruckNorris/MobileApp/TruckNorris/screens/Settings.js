import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Update Password Security"
          fontWeight="bold"
          onPress={() => navigation.navigate("UpdatePasswordScreen")}
          color="#ff0000"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Update Account"
          fontWeight="bold"
          onPress={() => navigation.navigate("UpdateAccountScreen")}
          color="#ff0000"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff0000",
    marginBottom: 20
  },
  buttonContainer: {
    marginVertical: 10,
    width: "100%"
  }
});
