<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const driverApplications = ref([]);
const selectedStatus = ref('open'); // Default view: Open applications

onMounted(() => {
  fetchDriverApplications();
});

// Fetch applications based on selected status
const fetchDriverApplications = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/submit-application?status=${selectedStatus.value}`)
    .then(response => {
      driverApplications.value = response.data;
    })
    .catch(error => console.error("Error fetching driver applications:", error));
};

// Close an application (only applicable for open applications)
const closeApplication = (id) => {
  axios.patch(`${import.meta.env.VITE_API_URL}/api/submit-application/${id}/close`, {}, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(() => {
    driverApplications.value = driverApplications.value.filter(app => app.id !== id);
  })
  .catch(error => console.error("Error closing application:", error));
};
</script>



<template>
    <div>
      <h1>Driver Applications</h1>
  
      <!-- Dropdown to Select Open/Closed Applications -->
      <label for="filter">Show:</label>
      <select id="filter" v-model="selectedStatus" @change="fetchDriverApplications">
        <option value="open">Open Applications</option>
        <option value="closed">Closed Applications</option>
      </select>
  
      <!-- Table to Display Applications -->
      <table v-if="driverApplications.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sponsor</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Years Driving</th>
            <th>Date of Birth</th>
            <th>Message</th>
            <th>Created At</th>
            <th v-if="selectedStatus === 'open'">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in driverApplications" :key="app.id">
            <td>{{ app.id }}</td>
            <td>{{ app.sponsor }}</td>
            <td>{{ app.first_name }}</td>
            <td>{{ app.last_name }}</td>
            <td>{{ app.years_driving }}</td>
            <td>{{ new Date(app.date_of_birth).toLocaleDateString() }}</td>
            <td>{{ app.message }}</td>
            <td>{{ new Date(app.created_at).toLocaleString() }}</td>
            <td v-if="selectedStatus === 'open'">
              <button @click="closeApplication(app.id)">Close</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>Loading applications...</p>
  
      <div class="home-button-container">
        <div class="home-button">
          <router-link to="/">← Back to Home</router-link>
        </div>
      </div>
    </div>
  </template>
  

  <style>
  label {
    font-weight: bold;
    margin-right: 10px;
  }
  
  select {
    padding: 5px;
    font-size: 16px;
  }
  
  table {
    width: 80%;
    margin: 20px auto;
    border-collapse: collapse;
  }
  
  th, td {
    border: 2px solid #232222;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #333;
    color: rgb(34, 33, 33);
    text-transform: uppercase;
  }
  
  tr:nth-child(even) {
    background-color: #737070;
  }
  
  h1 {
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
  

