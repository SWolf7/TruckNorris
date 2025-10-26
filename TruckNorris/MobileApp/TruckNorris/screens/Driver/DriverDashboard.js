import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./ProfileStack";
import Cart from "./Cart";
import Catalog from "../Catalog";
import Settings from "../Settings";
import Inbox from "../Inbox";

const DriverTabs = createBottomTabNavigator();

export default function DriverDashboard() {
  return (
    <DriverTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Profile":
              return <Ionicons name="person-outline" color={color} size={size} />;
            case "Cart":
              return <Ionicons name="cart-outline" color={color} size={size} />;
            case "Catalog":
              return <Ionicons name="book-outline" color={color} size={size} />;
            case "Settings":
              return <Ionicons name="settings-outline" color={color} size={size} />;
            case "Inbox":
              return <Ionicons name="mail-outline" color={color} size={size} />;
            default:
              return null;
          }
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarStyle: { height: 60, paddingBottom: 5 },
      })}
    >
      <DriverTabs.Screen name="Profile" component={Profile} />
      <DriverTabs.Screen name="Cart" component={Cart} />
      <DriverTabs.Screen name="Catalog" component={Catalog} />
      <DriverTabs.Screen name="Inbox" component={Inbox} />
      <DriverTabs.Screen name="Settings" headerShown="false" component={Settings} />
    </DriverTabs.Navigator>
  );
}
