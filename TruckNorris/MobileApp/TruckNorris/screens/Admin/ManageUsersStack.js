import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ManageUsersScreen from "./ManageUsersScreen"; // Main landing page for user management
import ManageDrivers from "./ManageDrivers"; // Drivers Management Screen
import ManageSponsors from "./ManageSponsors"; // Sponsors Management Screen
import ManageAdmins from "./ManageAdmins"; // Admins Management Screen
import SponsorTickets from "./SponsorTickets"; // Sponsor Tickets Screen
import DriverTickets from "./DriverTickets"; // Driver Tickets Screen

const Stack = createStackNavigator();

export default function ManageUsersStack() {
  return (
    <Stack.Navigator initialRouteName="ManageUsersScreen">
      {/* User Management Landing Page */}
      <Stack.Screen
        name="ManageUsersScreen"
        component={ManageUsersScreen}
        options={{ headerShown: false
         }}
      />

      {/* Manage Drivers */}
      <Stack.Screen
        name="ManageDrivers"
        component={ManageDrivers}
        options={{ title: "Manage Drivers",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
        }} // Header Shown
      />

      {/* Manage Sponsors */}
      <Stack.Screen
        name="ManageSponsors"
        component={ManageSponsors}
        options={{ title: "Manage Sponsors",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
         }} // Header Shown
      />

      {/* Manage Admins */}
      <Stack.Screen
        name="ManageAdmins"
        component={ManageAdmins}
        options={{ title: "Manage Admins",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
         }} // Header Shown
      />
      {/* Manage Drivers */}
      <Stack.Screen
        name="SponsorTickets"
        component={SponsorTickets}
        options={{ title: "Sponsor Tickets",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
        }} // Header Shown
      />
      {/* Driver Tickets */}
      <Stack.Screen
        name="DriverTickets"
        component={DriverTickets}
        options={{ title: "Driver Tickets",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
        }} // Header Shown
      />
    </Stack.Navigator>
  );
}
