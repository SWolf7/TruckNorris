import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl } from "react-native";
import { API } from "../../globalState";

export default function AuditLogsScreen() {
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /** Fetch Login Logs */
  const fetchLoginLogs = async () => {
    try {
      setRefreshing(true); // Show refresh animation
      const response = await fetch(`${API}/api/login-logs`);
      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.message || "Failed to fetch logs");

      setLoginLogs(data.sort((a, b) => b.id - a.id)); // Sort by ID (newest first)
    } catch (error) {
      console.error("Error fetching login logs:", error);
      setLoginLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refresh animation
    }
  };

  /** Fetch logs when component mounts */
  useEffect(() => {
    fetchLoginLogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loadingText}>Fetching login logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.refreshText}>Pull down to refresh</Text>

      {loginLogs.length > 0 ? (
        <FlatList
          data={loginLogs}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchLoginLogs} colors={["#ff0000"]} />
          }
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.logText}>ID: {item.id}</Text>
              <Text style={styles.logText}>Email: {item.email}</Text>
              <Text style={styles.logText}>Time: {new Date(item.login_time).toLocaleString()}</Text>
              <Text style={[styles.status, item.status === "SUCCESS" ? styles.success : styles.failed]}></Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>No login logs found.</Text>
      )}
    </View>
  );
}

// **STYLES**
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  refreshText: { fontSize: 14, color: "gray", textAlign: "center", marginBottom: 5 },
  text: { fontSize: 18, color: "gray", textAlign: "center", marginTop: 20 },
  logItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#333",
  },
  logText: { fontSize: 16, color: "#fff", marginBottom: 3 },
  status: { fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 5, borderRadius: 5 },
  success: { backgroundColor: "#00aa00" },
  failed: { backgroundColor: "#ff0000" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "gray", marginTop: 10 },
});

