import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { API } from "../../globalState";

export default function ViewConversionRatesScreen() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch(`${API}/Conversion-Rates`);
      if (!response.ok) throw new Error("Failed to fetch conversion rates.");
      const data = await response.json();
      setRates(data);
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
      Alert.alert("Error", "Failed to load conversion rates.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.rateCard}>
      <Text style={styles.orgName}>{item.organization_name}</Text>
      <Text style={styles.rate}>Points Rate: {item.usd_to_points_rate} per $1</Text>
      <Text style={styles.date}>Updated: {new Date(item.updated_at).toLocaleString()}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversion Rates</Text>
      <FlatList
        data={rates}
        keyExtractor={(item, index) => `${item.organization_name}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { color: '#ff0000', fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  rateCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginVertical: 5 },
  orgName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  rate: { color: "#fff", fontSize: 16, marginTop: 5 },
  date: { fontSize: 14, color: "#bbb", marginTop: 5 },
});
