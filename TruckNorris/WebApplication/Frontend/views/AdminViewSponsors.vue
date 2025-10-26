<template>
    <div>
        <h2>Sponsor User List</h2>
        
        <label for="status-filter">Filter by Status:</label>
        <select v-model="selectedStatus" @change="fetchSponsors">
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
                    <th>Type</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="spon_user in sponsors" :key="spon_user.email">
                    <td>{{ spon_user.first_name }}</td>
                    <td>{{ spon_user.last_name }}</td>
                    <td>{{ spon_user.email }}</td>
                    <td>{{ spon_user.type }}</td>
                    <td>
                        <select v-model="spon_user.status" @change="updateSponsorStatus(spon_user)">
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
            sponsors: [],
            selectedStatus: '' // Default to show all
        };
    },
    methods: {
        async fetchSponsors() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sponsors`, {
                    params: this.selectedStatus ? { status: this.selectedStatus } : {}
                });
                this.sponsors = response.data;
            } catch (error) {
                console.error("Error fetching sponsors:", error);
            }
        },
        async updateSponsorStatus(spon_user) {
            try {
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/sponsors/${spon_user.email}/status`, {
                    status: spon_user.status
                });
                alert(`Status updated to ${this.getStatusLabel(spon_user.status)}!`);
  
                await this.fetchSponsors();
            } catch (error) {
                console.error("Error updating Sponsor status:", error);
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
        this.fetchSponsors();
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
  