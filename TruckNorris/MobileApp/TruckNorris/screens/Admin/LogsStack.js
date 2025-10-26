import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LogsScreen from "./LogsScreen";
import DriverApps from "./DriverApp";
import AuditLog from "./AuditLog";
import ConversionRates from "./ConversionRates";

const Stack = createStackNavigator();

export default function LogsStack() {
  return (
    <Stack.Navigator initialRouteName="LogsScreen">
      <Stack.Screen name="LogsScreen" component={LogsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DriverApps" component={DriverApps} options={{ title: "Driver Applications",
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        headerTintColor: "#fff",
       }} />
      <Stack.Screen name="AuditLog" component={AuditLog} options={{ title: "Login Audit Logs",
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        headerTintColor: "#fff",
       }} />
       <Stack.Screen name="ConversionRates" component={ConversionRates} options={{ title: "Organization Conversion Rates",
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        headerTintColor: "#fff",
       }} />
    </Stack.Navigator>
  );
}
