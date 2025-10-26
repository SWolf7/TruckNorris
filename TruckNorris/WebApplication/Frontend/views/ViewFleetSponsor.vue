<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const driverData = ref([]);
const sponsors = ref([]); // Store all sponsors for dropdown
const selectedSponsor = ref(""); // Track selected sponsor

onMounted(() => {
  fetchDrivers();
  fetchSponsors();
});

// Fetch all drivers
const fetchDrivers = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`)
    .then(response => {
      driverData.value = response.data;
    })
    .catch(error => console.error("Error fetching driver data:", error));
};

// Fetch all sponsor names for the dropdown
const fetchSponsors = () => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`)
    .then(response => {
      sponsors.value = response.data.map(org => org.name);
    })
    .catch(error => console.error("Error fetching sponsor list:", error));
};

// Filter drivers based on selected sponsor
const filterDriversBySponsor = () => {
  if (selectedSponsor.value) {
    driverData.value = driverData.value.filter(driver => 
      driver.sponsor_list && driver.sponsor_list.includes(selectedSponsor.value)
    );
  } else {
    fetchDrivers(); // Reset if no sponsor is selected
  }
};

// Remove driver from fleet by updating sponsor_list
const removeFromFleet = (email) => {
  if (!selectedSponsor.value) {
    alert("Please select a sponsor before removing a driver.");
    return;
  }

  axios.patch(`${import.meta.env.VITE_API_URL}/api/drivers/${email}/remove-sponsor`, {
      sponsor: selectedSponsor.value
    })
    .then(() => {
      alert(`Driver ${email} removed from fleet ${selectedSponsor.value}!`);
      fetchDrivers(); // Refresh driver list after update
    })
    .catch(error => console.error("Error removing driver:", error));
};
</script>

<template>
  <div>
    <h1>Your Fleet!</h1>

    <!-- Sponsor Dropdown -->
    <label for="sponsorFilter">Select Fleet:</label>
    <select v-model="selectedSponsor" @change="filterDriversBySponsor">
      <option value="">All Fleets</option>
      <option v-for="sponsor in sponsors" :key="sponsor" :value="sponsor">
        {{ sponsor }}
      </option>
    </select>

    <!-- Driver Table -->
    <table v-if="driverData.length > 0">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Years Driving</th>
          <th>Date of Birth</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in driverData" :key="driver.email">
          <td>{{ driver.first_name }}</td>
          <td>{{ driver.last_name }}</td>
          <td>{{ driver.email }}</td>
          <td>{{ driver.years_driving }}</td>
          <td>{{ new Date(driver.date_of_birth).toLocaleDateString() }}</td>
          <td> 
            <button @click="removeFromFleet(driver.email)">Remove</button> 
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
</style>