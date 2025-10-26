import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { API } from "../../globalState";

export default function DriverTickets() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API}/ticket`);
      const data = await response.json();
      const sponsorTickets = data.tickets.filter(ticket => ticket.type === "sponsor");
      setTickets(sponsorTickets);

    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const resolveTicket = async (id) => {
    try {
      const response = await fetch(`${API}/ticket/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 2 }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", result.message);
        fetchTickets(); // Refresh after resolving
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      Alert.alert("Error", "Could not update ticket.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Ticket #{item.id}</Text>
      <Text style={styles.body}>From: {item.user}</Text>
      <Text style={styles.body}>Submitted: {new Date(item.sub_date).toLocaleString()}</Text>
      <Text style={styles.body}>Message: {item.body}</Text>
      <Text style={styles.status}>
        Status: {item.status === 1 ? "Open" : "Closed"}
      </Text>

      {item.status === 1 && (
        <TouchableOpacity style={styles.button} onPress={() => resolveTicket(item.id)}>
          <Text style={styles.buttonText}>Mark as Resolved</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", padding: 16 },
  card: { backgroundColor: "#333", padding: 15, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18, color: "#ff0000", fontWeight: "bold" },
  body: { color: "#fff", marginBottom: 4 },
  status: { color: "#ccc", marginTop: 8 },
  button: { marginTop: 10, backgroundColor: "#ff0000", padding: 10, borderRadius: 6 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
