import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileStack from "./ProfileStack";
import Cart from "./Cart";
import Catalog from "../Catalog";
import Settings from "../SettingsStack";
import Inbox from "../Inbox";
import Help from "../Help";

const DriverTabs = createBottomTabNavigator();

export default function DriverNavigator() {
  return (
    <DriverTabs.Navigator initialRouteName="ProfileStack"
      screenOptions={({ route }) => ({
        headerShown: route.name === "ProfileStack", // Show header ONLY on Profile Stack
        tabBarStyle: {
          backgroundColor: "#1a1a1a"
        },
        tabBarActiveTintColor: "#ff0000",
        tabBarInactiveTintColor: "#888",
      })}
    >
      {/* Profile Stack should load ProfileHome first */}
      <DriverTabs.Screen 
        name="ProfileStack" 
        component={ProfileStack} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="person-outline" color={color} size={24} />, 
          title: "Profile" ,
          headerShown: false,
          unmountOnBlur: true
        }} 
      />

      <DriverTabs.Screen 
        name="Cart" 
        component={Cart} 
        options={{ tabBarIcon: ({ color }) => <Icon name="cart-outline" color={color} size={24} /> }} 
      />

      <DriverTabs.Screen 
        name="Inbox" 
        component={Inbox} 
        options={{ tabBarIcon: ({ color }) => <Icon name="mail-outline" color={color} size={24} /> }} 
      />

      <DriverTabs.Screen 
        name="Help" 
        component={Help} 
        options={{ tabBarIcon: ({ color }) => <Icon name="help-circle-outline" color={color} size={24} /> }} 
      />

      <DriverTabs.Screen 
        name="Catalog" 
        component={Catalog} 
        options={{ tabBarIcon: ({ color }) => <Icon name="book-outline" color={color} size={24} /> }} 
      />

      <DriverTabs.Screen 
        name="Settings" 
        component={Settings} 
        options={{ headerShown: "false", tabBarIcon: ({ color }) => <Icon name="settings-outline" color={color} size={24} /> }} 
      />
    </DriverTabs.Navigator>
  );
}
