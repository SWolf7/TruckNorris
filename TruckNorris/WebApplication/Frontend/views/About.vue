<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const aboutData = ref([]);

onMounted(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/about`)
    .then(response => {
      aboutData.value = response.data;
    })
    .catch(error => console.error("Error fetching about data:", error));
});
</script>


<template>
  <div>
    <h1>About Us</h1>

    <div v-if="aboutData.length > 0">
      <div v-for="item in aboutData" :key="item.version_number" class="about-section">
        <h2>{{ item.product_name }}</h2>
        <p><strong>Description:</strong> {{ item.product_description }}</p>
        <p><strong>Team Members:</strong> {{ item.names }}</p>
        <p>
            <strong>Version:</strong> {{ item.version_number }}
            <strong>   -   Release Date:</strong> {{ new Date(item.release_date).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <p v-else>Loading data...</p>
  </div>

  <div class="home-button-container">
    <div class="home-button">
      <router-link to="/"> Back to Home</router-link>
    </div>
  </div>
</template>

<style>
.about-section 
{
  padding: 15px;
  margin-left: 25%;
  margin-right: 25%;
  border-radius: 10px;
  background: #090909;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-style: double;
  border-color: red;
  border-width: 5px;
  text-align: center;
}

h1 
{
    text-align: center;
    padding-top: 5%;
    font-weight: bold;
    text-decoration: underline;
    text-transform: capitalize;
    font-size: xx-large;
}

.home-button {
  display: inline-block;
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: white; 
  text-align: center;  
  margin: 20px auto;
}

.home-button a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.home-button-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  width: 100%; 
  margin-top: 20px;
}
</style>

