import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddScreen from "./AddScreen";
import AddAdmin from "./AddAdmin";
import AddDriver from "./AddDriver";
import AddOrg from "./AddOrg";
import AddSponsor from "./AddSponsor";

const Stack = createStackNavigator();

export default function AddStack() {
  return (
    <Stack.Navigator initialRouteName="AddScreen">
      <Stack.Screen name="AddScreen" component={AddScreen} options={{ headerShown: false,
                headerStyle: {
                  backgroundColor: "#333",
                },
                headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
                headerTintColor: "#fff",
       }} />
      <Stack.Screen name="AddAdmin" component={AddAdmin} options={{ title: "Add Admin",
                headerStyle: {
                  backgroundColor: "#333",
                },
                headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
                headerTintColor: "#fff",
       }} />
      <Stack.Screen name="AddDriver" component={AddDriver} options={{ title: "Add Driver",
                headerStyle: {
                  backgroundColor: "#333",
                },
                headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
                headerTintColor: "#fff",
       }} />
      <Stack.Screen name="AddOrg" component={AddOrg} options={{ title: "Add Organization",
                headerStyle: {
                  backgroundColor: "#333",
                },
                headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
                headerTintColor: "#fff",
       }} />
      <Stack.Screen name="AddSponsor" component={AddSponsor} options={{ title: "Add Sponsor User",
                headerStyle: {
                  backgroundColor: "#333",
                },
                headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
                headerTintColor: "#fff",
       }} />
    </Stack.Navigator>
  );
}
