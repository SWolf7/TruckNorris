<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const driverApplications = ref([]);
const selectedStatus = ref('open'); // Default view: Open applications
const selectedSponsor = ref('');
const organizations = ref([]);

onMounted(() => {
  fetchOrganizations();
});

// Fetch list of sponsors from the Organization table
const fetchOrganizations = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`)
    .then(response => {
      organizations.value = response.data;
    })
    .catch(error => console.error("Error fetching organizations:", error));
};

// Fetch applications based on selected sponsor and status
const fetchSponsorApplications = () => {
  if (!selectedSponsor.value) return;
  axios.get(`${import.meta.env.VITE_API_URL}/api/submit-application?sponsor=${selectedSponsor.value}&status=${selectedStatus.value}`)
    .then(response => {
      driverApplications.value = response.data;
    })
    .catch(error => console.error("Error fetching driver applications for sponsor:", error));
};

//Accepts the application and adds the user to the fleet
const acceptApplication = (id, email) => {
  if (!email) {
    console.error("Error: Driver email is undefined!");
    return;
  }

  console.log(`Accepting application ${id} for driver: ${email}`);

  axios.any(`${import.meta.env.VITE_API_URL}/api/submit-application/${id}/accept`)
    .then(() => {
      console.log(`Application ${id} accepted. Fetching driver data...`);
      fetchSponsorApplications();
    })
};

// Deny an application
const denyApplication = (id) => {
  axios.patch(`${import.meta.env.VITE_API_URL}/api/submit-application/` + id + '/deny')
    .then(() => {
      driverApplications.value = driverApplications.value.filter(app => app.id !== id);
    })
    .catch(error => console.error("Error denying application:", error));
};
</script>

<template>
  <div>
    <h1>Driver Applications</h1>

    <!-- Dropdown to select organization-->
    <label for="sponsor-select">Select Organization:</label>
    <select id="sponsor-select" v-model="selectedSponsor" @change="fetchSponsorApplications">
      <option value="" disabled>Select a sponsor</option>
      <option v-for="organization in organizations" :key="organization.id" :value="organization.name">{{ organization.name }}</option>
    </select>

    <!-- Dropdown to select Open/Closed applications-->
    <label for="status-select">Select Status:</label>
    <select id="status-select" v-model="selectedStatus" @change="fetchSponsorApplications">
      <option value="open">Open</option>
      <option value="closed">Closed</option>
    </select>

    <!-- Table to Display Applications -->
    <table v-if="driverApplications.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
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
          <td>{{ app.first_name }}</td>
          <td>{{ app.last_name }}</td>
          <td>{{ app.email }}</td>
          <td>{{ app.years_driving }}</td>
          <td>{{ new Date(app.date_of_birth).toLocaleDateString() }}</td>
          <td>{{ app.message }}</td>
          <td>{{ new Date(app.created_at).toLocaleString() }}</td>
          <td v-if="selectedStatus === 'open'">
            <button @click="acceptApplication(app.id, app.email)">Accept</button>
            <button @click="denyApplication(app.id)">Deny</button>
          </td>
        </tr>
      </tbody>
    </table>
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
  

