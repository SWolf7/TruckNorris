<template>
  <div>
      <h2>Driver List</h2>
      
      <label for="status-filter">Filter by Status:</label>
      <select v-model="selectedStatus" @change="fetchDrivers">
          <option value="">All</option>
          <option value="1">Current</option>
          <option value="2">Suspended</option>
          <option value="3">Deactivated</option>
      </select>

      <table>
          <thead>
              <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Years Driving</th>
                  <th>Status</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="driver in drivers" :key="driver.email">
                  <td>{{ driver.first_name }}</td>
                  <td>{{ driver.last_name }}</td>
                  <td>{{ driver.email }}</td>
                  <td>{{ driver.years_driving }}</td>
                  <td>
                      <select v-model="driver.status" @change="updateDriverStatus(driver)">
                          <option value="1">Current</option>
                          <option value="2">Suspended</option>
                          <option value="3">Deactivated</option>
                      </select>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
  <div>
    <router-link to="/admin" custom v-slot="{ navigate }">
        <button class="primary button" @click="navigate">Dashboard</button>
      </router-link>
      <router-link to="/AdminViewUsers" custom v-slot="{ navigate }">
        <button class="primary button" @click="navigate">Change User Type</button>
      </router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
          drivers: [],
          selectedStatus: '' // Default to show all
      };
  },
  methods: {
      async fetchDrivers() {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`, {
                  params: this.selectedStatus ? { status: this.selectedStatus } : {}
              });
              this.drivers = response.data;
          } catch (error) {
              console.error("Error fetching drivers:", error);
          }
      },
      async updateDriverStatus(driver) {
          try {
              await axios.patch(`${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/status`, {
                  status: driver.status
              });
              alert(`Status updated to ${this.getStatusLabel(driver.status)}!`);

              await this.fetchDrivers();
          } catch (error) {
              console.error("Error updating driver status:", error);
              alert("Failed to update status.");
          }
      },
      getStatusLabel(status) {
          const statusMap = {
              1: "Current",
              2: "Suspended",
              3: "Deactivated"
          };
          return statusMap[status] || "Unknown";
      }
  },
  mounted() {
      this.fetchDrivers();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ff0000;
  padding: 8px;
}
th {
  background-color: #222222;
}
select {
  padding: 5px;
}
button {
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
