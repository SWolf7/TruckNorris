// navigation/SettingsStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "./Settings";
import UpdatePasswordScreen from "./UpdatePasswordScreen";
import UpdateAccountScreen from "./UpdateAccountScreen";

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1a1a1a" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "", headerShown: "false" }}
      />
      <Stack.Screen
        name="UpdatePasswordScreen"
        component={UpdatePasswordScreen}
        options={{ title: "Update Password" }}
      />
      <Stack.Screen
        name="UpdateAccountScreen"
        component={UpdateAccountScreen}
        options={{ title: "Update Account Info" }}
      />
    </Stack.Navigator>
  );
}
