import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import {
  getUserRole,
  userEmail,
  API,
  getActiveOrg,
  addToCart
} from "../globalState";

export default function Catalog() {
  const [role, setRole] = useState(null);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [pointModifier, setPointModifier] = useState(100); // default 100

  // Get current timestamp in mm:ss
  const formatTime = (ms) => {
    if (ms === undefined) return "0:00";
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const loadUserData = async () => {
      const fetchedRole = await getUserRole();
      setRole(fetchedRole);

      if (fetchedRole === "driver") {
        const orgName = getActiveOrg();
        if (orgName) {
          fetchOrgFilters(orgName);
        }
      }
    };

    loadUserData();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      const interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPlaybackStatus(status);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [sound]);

  const fetchOrgFilters = async (orgName) => {
    try {
      const res = await fetch(`${API}/api/org-filters?name=${orgName}`);
      const data = await res.json();
      setFilters(data.filters || []);
      setSelectedFilter(data.filters[0] || "");
    } catch (err) {
      console.error("Failed to fetch filters for", orgName, err);
    }
  };

  const fetchModifier = async () => {
    const orgName = getActiveOrg();
    if (!orgName) return;
  
    try {
      const response = await fetch(`${API}/conversion-rate/${encodeURIComponent(orgName)}`);
      const data = await response.json();
      console.log(data.rate);
      setPointModifier(data.rate || 100); // fallback if not set
    } catch (err) {
      console.error("Failed to fetch points modifier", err);
    }
  };
  
  useEffect(() => {
    const orgName = getActiveOrg();
    if (orgName) fetchModifier(orgName);
  }, []);

  const searchItunes = async () => {
    const keyword = searchTerm.trim();
    if (!keyword) return;

    setLoading(true);
    setError(null);
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
        keyword
      )}&media=music&limit=20&country=US`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const playPreview = async (item) => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && playingTrackId === item.trackId) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        return;
      }
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: item.previewUrl,
    });
    setSound(newSound);
    setPlayingTrackId(item.trackId);
    setPlaybackStatus(await newSound.getStatusAsync());
    await newSound.playAsync();
  };

  const addToCatalog = async (trackName) => {
    const orgName = getActiveOrg();
    if (!orgName) {
      Alert.alert("Error", "No active organization set.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/add-filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: trackName, orgId: orgName }),
      });

      if (!res.ok) throw new Error("Failed to add to catalog");
      Alert.alert("Success", `${trackName} added to your catalog.`);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
        <Text style={styles.title}>iTunes Catalog</Text>
        {(
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Search iTunes..."
              placeholderTextColor="#888"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={searchItunes}
            />
            <Button title="Search" onPress={searchItunes} color="#ff0000" />
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="white" />}
        {error && <Text style={styles.error}>{error}</Text>}

        <FlatList
          data={results}
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={({ item }) => {
            const isPlaying = item.trackId === playingTrackId && playbackStatus?.isPlaying;
            const position = playbackStatus?.positionMillis || 0;
            const duration = playbackStatus?.durationMillis || 1;

            return (
              <View style={styles.resultCard}>
                <Image source={{ uri: item.artworkUrl100 }} style={styles.image} />
                <Text style={styles.trackName}>
                  {item.trackName} - {item.artistName}
                </Text>
                {item.trackPrice !== undefined && (
                  <Text style={styles.price}>
                    {Math.round(item.trackPrice * pointModifier)} Points
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    addToCart({
                      trackName: item.trackName,
                      artistName: item.artistName,
                      artworkUrl: item.artworkUrl100,
                      price: item.trackPrice,
                      modifier: pointModifier
                    });
                    Alert.alert("Added", `${item.trackName} added to cart!`);
                  }}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <Ionicons name="cart-outline" size={28} color="white" />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => playPreview(item)} style={{ marginTop: 5 }}>
                  <Ionicons
                    name={isPlaying ? "pause-circle" : "play-circle"}
                    size={40}
                    color="darkred"
                  />
                </TouchableOpacity>

                {item.trackId === playingTrackId && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={{ color: "white", marginBottom: 4 }}>
                      {formatTime(position)} / {formatTime(duration)}
                    </Text>
                    <View style={{ backgroundColor: "#666", height: 4, borderRadius: 2 }}>
                      <View
                        style={{
                          backgroundColor: "red",
                          height: 4,
                          width: `${(position / duration) * 100}%`,
                          borderRadius: 2,
                        }}
                      />
                    </View>
                  </View>
                )}

                {role === "sponsor" && (
                  <Button
                    title="Add to Catalog"
                    onPress={() => addToCatalog(item.trackName)}
                    color="#007bff"
                  />
                )}
              </View>
            );
          }}
        />
      </View>
    </Pressable>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1a1a1a" },
  title: { fontSize: 20, fontWeight: "bold", color: "#ff0000", textAlign: "center", marginBottom: 10 },
  subtitle: { color: "white", marginBottom: 5 },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#555",
    marginRight: 10,
  },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  picker: { backgroundColor: "#333", color: "#fff", marginBottom: 10 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  resultCard: {
    backgroundColor: "#232121",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  trackName: { color: "white", fontWeight: "bold" },
  price: { color: "#bbb" },
});
