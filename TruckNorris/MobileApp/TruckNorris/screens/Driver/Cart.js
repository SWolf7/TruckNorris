import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Image, StyleSheet, Button, Alert } from "react-native";
import { getCart, clearCart, getUserEmail, getActiveOrg, API } from "../../globalState";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const items = getCart();
      setCartItems(items);

      const total = items.reduce((sum, item) => sum + (item.quantity || 1) * item.pointCost, 0);
      setTotalCost(total);

      fetchUserPoints();
      return () => {};
    }, [])
  );

  const fetchUserPoints = async () => {
    try {
      const email = getUserEmail();
      const org = getActiveOrg();
      const response = await fetch(`${API}/api/driverInfo_get?email=${email}&organization=${encodeURIComponent(org)}`);
      const data = await response.json();

      const points = data[0]?.points_total ?? 0;
      setUserPoints(points);
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.artworkUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.songTitle}>{item.trackName}</Text>
        <Text style={styles.artist}>{item.artistName}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

  const handlePurchase = async () => {
    const email = getUserEmail();
    const organization = getActiveOrg();
    const items = getCart();
    const total = items.reduce((sum, item) => sum + (item.quantity || 1) * item.pointCost, 0);

    if (total > userPoints) {
      Alert.alert("Not enough points", "You do not have enough points for this purchase.");
      return;
    }

    try {
      // Step 1: Get sponsor email
      const sponsorResponse = await fetch(`${API}/api/sponsors?organization=${encodeURIComponent(organization)}`);
      const sponsorData = await sponsorResponse.json();
      const sponsor = sponsorData.find((item) => item.Organization === organization);
      const sponsorEmail = sponsor?.email;
      if (!sponsorEmail) throw new Error("Sponsor email not found");

      // Step 2: Deduct points
      const deductResponse = await fetch(`${API}/api/drivers/${email}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsor_email: sponsorEmail,
          points_change: -total,
          points_change_reason: "iTunes purchase",
          point_change_type: 4,
        }),
      });
      const deductResult = await deductResponse.json();
      if (!deductResponse.ok) throw new Error(deductResult.error || "Point deduction failed");

      // Step 3: Submit order
      const orderPayload = {
        email,
        order_date: new Date().toISOString(),
        total,
        organization,
        items: items.map((item) => ({
          trackName: item.trackName,
          artistName: item.artistName,
          quantity: item.quantity,
          email,
        })),
      };

      const orderResponse = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderResult.error || "Order failed");

      // Success!
      clearCart();
      setCartItems([]);
      setTotalCost(0);
      fetchUserPoints();
      Alert.alert("Success", "Purchase complete!");
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert("Error", error.message || "Failed to complete purchase.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <Text style={styles.pointsText}>Your Points: {userPoints}</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.text}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => `${item.trackName}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <Text style={styles.totalText}>Total: {totalCost} Points</Text>
          <Button title="Purchase Items" color="#ff0000" onPress={handlePurchase} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#1a1a1a", flex: 1, padding: 20 },
  title: { color: "#ff0000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  pointsText: { color: "#ffffff", fontSize: 16, textAlign: "center", marginBottom: 10 },
  text: { fontSize: 18, color: "#ffffff", textAlign: "center", marginTop: 20 },
  totalText: { fontSize: 20, color: "#fff", fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#555",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 15,
  },
  textContainer: {
    flexShrink: 1,
  },
  songTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff" },
  artist: { fontSize: 16, color: "#cccccc", marginTop: 4 },
  quantity: { fontSize: 16, color: "#aaaaaa", marginTop: 4 },
});
