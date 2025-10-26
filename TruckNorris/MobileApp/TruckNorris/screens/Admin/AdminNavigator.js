import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import AddStack from "./AddStack"; // Import the nested navigator
import LogsStack from "./LogsStack"; // Navigator for Logs
import ManageUsersStack from "./ManageUsersStack"; // Import Manage Users Stack
import Settings from "../SettingsStack";
import Catalog from "../Catalog"; // Import Catalog Screen
import Inbox from "../Inbox";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator (Handles Header Visibility)
function AdminTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Manage Users"
      screenOptions={({ route }) => ({
        headerShown: route.name === "Manage Users", // Show header ONLY on Manage Users
        tabBarStyle: {
          backgroundColor: "#1a1a1a"
        },
        tabBarActiveTintColor: "#ff0000",
        tabBarInactiveTintColor: "#888",
      })}
    >
      {/* Add Tab */}
      <Tab.Screen
        name="Add"
        component={AddStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="add-circle-outline" color={color} size={28} />,
          headerShown: false, // Hide header when clicking "Add"
        }}
      />

      {/* Driver Apps & Login Logs */}
      <Tab.Screen
        name="Logs"
        component={LogsStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="document-text-outline" color={color} size={28} />,
          headerShown: false, // Hide header on Logs
        }}
      />

      {/* Inbox */}
      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{
          tabBarIcon: ({ color }) => <Icon name="mail-outline" color={color} size={28} />,
          headerShown: false, // Hide header on Logs
        }}
      />

      {/* Manage Users */}
      <Tab.Screen
        name="Manage Users"
        component={ManageUsersStack} // Uses the Stack Navigator
        options={{
          tabBarIcon: ({ color }) => <Icon name="people-outline" color={color} size={28} />,
          headerShown: false, // Hide Header on Main Nav, Handled in Stack
        }}
      />

      {/* Catalog Tab */}
      <Tab.Screen
        name="Catalog"
        component={Catalog} // Link to Catalog.js
        options={{
          tabBarIcon: ({ color }) => <Icon name="book-outline" color={color} size={28} />,
          headerShown: false, // Hide header on Catalog
        }}
      />

      {/* Settings */}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => <Icon name="settings-outline" color={color} size={28} />,
          headerShown: false, // Hide header on Settings
        }}
      />
    </Tab.Navigator>
  );
}

// Wrap in Stack Navigator to Control Header at a Higher Level
export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ title: "Admin Dashboard", headerShown: false }} // Initially hidden
      />
    </Stack.Navigator>
  );
}
