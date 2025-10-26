<script setup>
import { ref } from 'vue';

const searchTerm = ref('');
const results = ref([]);
const loading = ref(false);
const error = ref(null);

const searchItunes = async () => {
  if (!searchTerm.value) return;

  loading.value = true;
  error.value = null;

  //build the URL with the API request and call it
  try {
    const baseUrl = "https://itunes.apple.com/search";
    const query = `term=${encodeURIComponent(searchTerm.value)}&media=music&limit=20&country=US`;
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
      <h2>iTunes Search</h2>
      <input v-model="searchTerm" @keyup.enter="searchItunes" placeholder="Search iTunes..." />
      <button class = "primary button" @click="searchItunes">Search</button>

      <router-link to="/admin" custom v-slot="{ navigate }">
        <button class="primary button" @click="navigate"><- Back To Dashboard</button>
      </router-link>
  
      <p v-if="loading">Loading...</p>
      <p v-if="error">{{ error }}</p>
      <!--Div containing the grid container for displaying the search results, this is needed so its not a page a mile long vertically-->
      <div v-if="results.length" class="grid-container">
        <div v-for="item in results" :key="item.trackId" class="grid-item">
          <img :src="item.artworkUrl100" alt="Album Art" />
          <p>{{ item.trackName }} - {{ item.artistName }}</p>
          <p v-if="item.trackPrice !== undefined">
            $ {{ item.trackPrice }} {{ item.currency || 'USD' }}<!--Price loaded from Itunes API, will convert to points later-->
          </p>
          <audio controls :src="item.previewUrl"></audio>
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

input {
  padding: 8px;
  margin: 10px;
  width: 60%;
  background-color: grey;
  color: darkred;
  text-decoration: solid;
}

button {
  padding: 8px 12px;
  cursor: pointer;
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
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  color: grey;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

audio {
  width: 100%;
  margin-top: 25px;
}
</style>