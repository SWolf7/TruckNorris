import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./Profile";
import DriverApp from "./DriverApps";
import ProfileScreen from "./ProfileScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      {/* Hide back arrow on this screen */}
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          title: "Profile",
          headerLeft: () => null,
          gestureEnabled: false 
          
        }}

      />

      <Stack.Screen 
        name="Profile" 
        
        component={Profile} 
        options={{ title: "",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
         }}
      />

      <Stack.Screen 
        name="DriverApp" 
        component={DriverApp} 
        options={{ title: "Apply as Driver",
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          headerTintColor: "#fff",
         }}
      />
    </Stack.Navigator>
  );
}
