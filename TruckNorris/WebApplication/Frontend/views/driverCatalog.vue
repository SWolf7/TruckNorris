<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

const availableFilters = ref([]);
const selectedFilter = ref("");
const results = ref([]);
const loading = ref(false);
const error = ref(null);
const cart = ref([]);
const cartVisible = ref(false);
const checkoutVisible = ref(false);
const points = ref(0);
const purchaseError = ref("");

const conversionRate = ref(100); // Default fallback

const orgName = localStorage.getItem("activeOrg");
const email = localStorage.getItem("email");
const sponsorEmail = "Ice@testing.com"; // Hardcoded sponsor email

onMounted(async () => {
  if (!orgName || !email) return;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/org-filters`, {
      params: { name: orgName }
    });

    availableFilters.value = response.data.filters;
    if (availableFilters.value.length > 0) {
      selectedFilter.value = availableFilters.value[0];
    }

    await fetchPoints();
    await fetchConversionRate();
  } catch (err) {
    console.error("Failed to load data", err);
    error.value = "Could not load data.";
  }
});

const fetchPoints = async () => {
  try {
    const pointsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/driverInfoGet/${email}`);
    points.value = pointsResponse.data[0].points_total;
  } catch (err) {
    console.error("Failed to fetch points", err);
  }
};

const fetchConversionRate = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversion-rate/${orgName}`);
    conversionRate.value = response.data.rate;
  } catch (err) {
    console.error("Failed to fetch conversion rate", err);
    toast.error("Could not load conversion rate. Using default of 100");
    conversionRate.value = 100;
  }
};

const updatePoints = async (newPoints, reason = "Catalog Purchase") => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/drivers/${email}/points`, {
      sponsor_email: sponsorEmail,
      points_change_reason: reason,
      point_change_type: 3,
      points_change: newPoints
    });
    await fetchPoints();
  } catch (err) {
    console.error("Failed to update points", err);
  }
};

const addToCart = (item) => {
  const existingItem = cart.value.find(cartItem => cartItem.trackId === item.trackId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({ ...item, quantity: 1 });
  }
};

const toggleCart = () => {
  cartVisible.value = !cartVisible.value;
};

const toggleCheckout = () => {
  checkoutVisible.value = !checkoutVisible.value;
};

const calculateTotal = () => {
  return cart.value.reduce((total, item) => total + (item.trackPrice * item.quantity * conversionRate.value), 0);
};

const confirmPurchase = async () => {
  const total = calculateTotal();
  const remaining = points.value - total;

  if (remaining < 0) {
    purchaseError.value = "Not enough points to complete purchase.";
    return;
  }

  const orderPayload = {
    email,
    order_date: new Date().toISOString(),
    total,
    organization: orgName,
    items: cart.value.map(item => ({
      trackName: item.trackName,
      artistName: item.artistName,
      quantity: item.quantity,
      email
    }))
  };

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderPayload);
    await updatePoints(-total, "Catalog Purchase");
    cart.value = [];
    checkoutVisible.value = false;
    toast.success("Purchase complete!");
  } catch (err) {
    console.error("Failed to confirm purchase:", err);
    toast.error("Something went wrong during checkout.");
  }
};

const closeCheckout = () => {
  checkoutVisible.value = false;
  cartVisible.value = true;
};

const removeFromCart = (trackId) => {
  const itemIndex = cart.value.findIndex(item => item.trackId === trackId);
  if (itemIndex !== -1) {
    const item = cart.value[itemIndex];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.value.splice(itemIndex, 1);
    }
  }
};

const searchItunes = async () => {
  if (!selectedFilter.value) return;

  loading.value = true;
  error.value = null;

  try {
    const baseUrl = "https://itunes.apple.com/search";
    const query = `term=${encodeURIComponent(selectedFilter.value)}&media=music&limit=20&country=US`;
    const url = `${baseUrl}?${query}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    results.value = data.results;
  } catch (err) {
    error.value = "Error fetching data";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="points-display">
      Points: {{ points }}
    </div>
    <div class="cart-icon" @click="toggleCart">
      🛒 {{ cart.reduce((acc, item) => acc + item.quantity, 0) }}
      <div v-if="cartVisible" class="cart-popup">
        <h4>Shopping Cart</h4>
        <ul>
          <li v-for="(item, index) in cart" :key="index" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
  <div style="flex: 1; text-align: left;">
    <div>{{ item.trackName }}</div>
    <div style="font-size: 0.85em; color: #aaa;">{{ item.artistName }}</div>
  </div>
  <div style="display: flex; align-items: center; gap: 4px;">
    <button @click.stop="removeFromCart(item.trackId)">−</button>
    <span>{{ item.quantity }}</span>
    <button @click.stop="addToCart(item)">+</button>
  </div>
  <span style="min-width: 70px; text-align: right;">{{ (item.trackPrice * item.quantity * conversionRate).toFixed(0) }} Points
  </span>
</li>
        </ul>
        <hr />
        <p>Total: {{ calculateTotal() }} Points</p>
        <button @click="toggleCheckout">Checkout</button>
      </div>
      <div v-if="checkoutVisible" class="checkout-popup">
        <h4>Checkout</h4>
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            {{ item.trackName }} - {{ item.artistName }}
            <button @click="removeFromCart(item.trackId)">-</button>
            {{ item.quantity }}
            <button @click="addToCart(item)">+</button>
            - {{ (item.trackPrice * item.quantity * conversionRate).toFixed(0) }} Points
          </li>
        </ul>
        <hr />
        <p>Current Points: {{ points }}</p>
        <p>Points to Spend: {{ calculateTotal() }}</p>
        <p>Remaining Points: {{ points - calculateTotal() }}</p>
        <p v-if="purchaseError" style="color: red;">{{ purchaseError }}</p>
        <button @click="confirmPurchase">Confirm</button>
        <button @click="closeCheckout">Cancel</button>
      </div>
    </div>
    <h2>iTunes Search</h2>
    <div v-if="availableFilters.length">
      <label for="filter">Choose a catalog filter:</label>
      <select v-model="selectedFilter" id="filter">
          <option v-for="filter in availableFilters" :key="filter" :value="filter">
          {{ filter }}
          </option>
      </select>
      <button class="primary button" @click="searchItunes">Search</button>
    </div>
    <p v-else>Loading available filters...</p>
    <router-link to="/driver" custom v-slot="{ navigate }">
      <button class="primary button" @click="navigate"><- Back To Dashboard</button>
    </router-link>

    <p v-if="loading">Loading...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="results.length" class="grid-container">
      <div v-for="item in results" :key="item.trackId" class="grid-item">
        <img :src="item.artworkUrl100" alt="Album Art" />
        <p>{{ item.trackName }} - {{ item.artistName }}</p>
        <p v-if="item.trackPrice !== undefined">{{ (item.trackPrice * conversionRate).toFixed(0) }} Points
        </p>
        <audio controls :src="item.previewUrl" class="audio-player"></audio>
        <button @click="addToCart(item)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  max-width: 800px;
  margin: auto;
}

.points-display {
  position: fixed;
  top: 10px;
  left: 20px;
  background-color: #444;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 18px;
}

.cart-icon {
  position: fixed;
  top: 10px;
  right: 20px;
  background-color: #444;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 18px;
  cursor: pointer;
}

.cart-popup {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #333;
  color: white;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.checkout-popup {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #444;
  color: white;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

button {
  padding: 8px 12px;
  cursor: pointer;
  margin-top: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
}

.grid-item {
  background: #232121;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  color: grey;
}

.audio-player {
  width: 100%;
  margin: 8px 0;
}
</style>
