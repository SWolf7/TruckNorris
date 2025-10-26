import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/homeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

import {
  setUserEmail, 
  setUserRole,
  globalEmail,
  userEmail,
  setGlobalEmail,
} from "./globalState"; 

const Stack = createStackNavigator(); 

// Log Out Function 
const handleLogout = (navigation) => {
  if (globalEmail !== userEmail) {
    console.log("No longer viewing as %s", userEmail);
    setUserEmail(globalEmail);
    navigation.replace("HomeScreen");
  } else {
    setUserEmail("");
    setUserRole("");
    setGlobalEmail(null);
    console.log("Logging out now");
    navigation.replace("LoginScreen");
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ title: "Sign Up",
            headerStyle: {
              backgroundColor: "#333",
            },
            headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
            headerTintColor: "#fff",
           }} 
        />
        <Stack.Screen 
          name="ForgotPasswordScreen" 
          component={ForgotPasswordScreen} 
          options={{ title: "Reset Password",
            headerStyle: {
              backgroundColor: "#333",
            },
            headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: "Truck Norris LLC",
            headerStyle: { backgroundColor: "#333" },
            headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    backgroundColor: "#ff0000",
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
