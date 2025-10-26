import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { API, userEmail } from "../globalState";
import stylesShared from "./styles";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEmail, setActiveEmail] = useState("");
  const [viewMode, setViewMode] = useState("received"); // 'received' or 'sent'
  const [composing, setComposing] = useState(false);

  const [targetEmail, setTargetEmail] = useState("");
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    const emailToUse = userEmail;
    if (!emailToUse) {
      Alert.alert("Error", "No user email set.");
      setLoading(false);
      return;
    }

    setActiveEmail(emailToUse);
    fetchInbox(emailToUse, viewMode);
  }, [viewMode]);

  const fetchInbox = async (email, mode) => {
    setLoading(true);
    try {
      const endpoint = `${API}/api/inbox/${encodeURIComponent(email)}/${mode}`;
      const response = await fetch(endpoint);
      console.log(`📬 Fetching ${mode} messages for:`, email);

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", `Failed to load ${viewMode} messages.`);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    const role = viewMode === "sent" ? "sender" : "target";
    const url = `${API}/api/inbox/${id}/${activeEmail}/${role}/delete`;

    try {
      const response = await fetch(url, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to delete message");

      Alert.alert("Deleted", `Message ${id} has been deleted.`);
      fetchInbox(activeEmail, viewMode); // Refresh
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete message.");
    }
  };

  const sendMessage = async () => {
    if (!targetEmail || !messageBody) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/inbox`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_email: targetEmail,
          sender_email: activeEmail,
          message: messageBody,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      Alert.alert("Success", "Message sent!");
      setComposing(false);
      setTargetEmail("");
      setMessageBody("");

      if (viewMode === "sent") {
        fetchInbox(activeEmail, "sent"); // Refresh sent inbox
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to send message.");
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{new Date(item.date_time).toLocaleString()}</Text>
      <Text style={styles.sender}>
        {viewMode === "sent" ? `To: ${item.target_email}` : `From: ${item.sender_email}`}
      </Text>
      <Text style={styles.message}>{item.message}</Text>
      <TouchableOpacity onPress={() => deleteMessage(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑 Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      <View style={styles.toggleContainer}>
        <Button title="Received" onPress={() => setViewMode("received")} color={viewMode === "received" ? "#ff0000" : "#aaa"} />
        <Button title="Sent" onPress={() => setViewMode("sent")} color={viewMode === "sent" ? "#ff0000" : "#aaa"} />
        <Button title={composing ? "Back to Inbox" : "Compose"} color="#ff0000"onPress={() => setComposing(!composing)} />
      </View>

      {composing ? (
        <View style={styles.composeContainer}>
          <Text style={styles.composeLabel}>To:</Text>
          <TextInput
            style={[styles.input, {color: "#fff"}]}
            placeholder="Enter recipient email"
            placeholderTextColor="#aaa"
            value={targetEmail}
            onChangeText={setTargetEmail}
            autoCapitalize="none"
          />
          <Text style={styles.composeLabel}>Message:</Text>
          <TextInput
            style={[styles.input, styles.textArea, {color: "#fff"}]}
            placeholder="Enter your message"
            placeholderTextColor="#aaa"
            value={messageBody}
            onChangeText={setMessageBody}
            multiline
          />
          <Button title="Send" onPress={sendMessage} color="#ff0000" />
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff0000" />
          <Text style={styles.loadingText}>Loading inbox...</Text>
        </View>
      ) : messages.length > 0 ? (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
        />
      ) : (
        <Text style={styles.emptyText}>No messages in this view.</Text>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", padding: 20 },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  date: { fontSize: 12, color: "#ffffff", marginBottom: 5 },
  sender: { color: "#ffffff",fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  message: { fontSize: 16, color: "#ffffff" },
  deleteButton: { marginTop: 8 },
  deleteText: { color: "#cc0000", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "gray" },
  emptyText: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  composeContainer: {
    marginTop: 20,
  },
  composeLabel: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
