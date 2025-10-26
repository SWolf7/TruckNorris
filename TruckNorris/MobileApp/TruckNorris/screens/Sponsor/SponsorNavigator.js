import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import SponsorDashboard from "./SponsorDashboard";
import ViewApps from "./ViewApps";
import ViewFleet from "./ViewFleet";
import Catalog from "../Catalog"; 
import SettingsStack from "../SettingsStack"; 
import Inbox from "../Inbox"; 
import Help from "../Help";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Sponsor Dashboard + Screens
function SponsorDashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SponsorDashboard"
        component={SponsorDashboard}
        options={{
          headerShown: false,
          title: "Sponsor Dashboard",
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="ViewApps" component={ViewApps} options={{ 
        title: "View Applications", 
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        headerTintColor: "#fff",
       }} />
      <Stack.Screen name="ViewFleet" component={ViewFleet} options={{ 
        title: "View Fleet", 
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        headerTintColor: "#fff",
        }} />
    </Stack.Navigator>
  );
}

export default function SponsorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ff0000",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Dashboard") {
            return <MaterialIcons name="dashboard" size={size} color={color} />;
          } else if (route.name === "Catalog") {
            return <Ionicons name="book-outline" size={size} color={color} />;
          } else if (route.name === "Help") {
            return <Ionicons name="help-circle-outline" size={size} color={color} />;
          } else if (route.name === "Settings") {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          } else if (route.name === "Inbox") {
            return <Ionicons name="mail-outline" size={size} color={color} />;
          }
        },
        tabBarStyle: {
          backgroundColor: "#1a1a1a"
        },
        tabBarActiveTintColor: "#ff0000",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Dashboard" component={SponsorDashboardStack} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Help" component={Help} />
      <Tab.Screen name="Catalog" component={Catalog} />
      <Tab.Screen name="Settings" headerShown="false" component={SettingsStack} />
    </Tab.Navigator>
  );
}
