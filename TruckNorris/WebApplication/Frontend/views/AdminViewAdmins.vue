<template>
    <div>
        <h2>Admin List</h2>
        
        <label for="status-filter">Filter by Status:</label>
        <select v-model="selectedStatus" @change="fetchAdmins">
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
                <tr v-for="admin in admins" :key="admin.email">
                    <td>{{ admin.first_name }}</td>
                    <td>{{ admin.last_name }}</td>
                    <td>{{ admin.email }}</td>
                    <td>{{ admin.type }}</td>
                    <td>
                        <select v-model="admin.status" @change="updateAdminstatus(admin)">
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
            admins: [],
            selectedStatus: '' // Default to show all
        };
    },
    methods: {
        async fetchAdmins() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admins`, {
                    params: this.selectedStatus ? { status: this.selectedStatus } : {}
                });
                this.admins = response.data;
            } catch (error) {
                console.error("Error fetching admins:", error);
            }
        },
        async updateAdminstatus(admin) {
            try {
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/admins/${admin.email}/status`, {
                    status: admin.status
                });
                alert(`Status updated to ${this.getStatusLabel(admin.status)}!`);
  
                await this.fetchAdmins();
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
        this.fetchAdmins();
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
  