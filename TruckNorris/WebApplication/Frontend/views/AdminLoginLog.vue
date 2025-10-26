<template>
    <!-- Main Content -->
    <main class="content">

  <div class="login-logs-container">
    <h2>Login Logs</h2>
    <div class = "table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>User ID</th>
            <th>Login Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in loginLogs" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.email }}</td>
            <td>{{ log.user_id }}</td>
            <td>{{ formatDate(log.login_time) }}</td>
            <td :class="getStatusClass(log.status)">{{ log.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Back to Dashboard Button -->
    <div class="back-button">
      <router-link to="/admin" custom v-slot="{ navigate }">
        <button class="button primary" @click="navigate">< Back to Dashboard</button>
      </router-link>
    </div>
  </div>
</main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginLogs: [],
    };
  },
  methods: {
    async fetchLoginLogs() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/login-logs`);
        this.loginLogs = response.data.sort((a, b) => b.id - a.id); // Sort by ID in descending order
      } catch (error) {
        console.error('Error fetching login logs:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString(); // Formats the login_time nicely
    },
    getStatusClass(status) {
      return status === 'success' ? 'success' : 'failed';
    },
  },
  created() {
    this.fetchLoginLogs();
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121212;
  color: white;
}

.table-container {
  max-height: 400px; /* Adjust this value as needed */
  overflow-y: auto;
  border: 3px solid #ed0808;
}


.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
}

.nav-links {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
  color: red;
}

.nav-links span {
  color: red;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ddd; /* Placeholder for user icon */
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}
table {
  width: 100%;
  border-collapse: collapse;
  align-items: center;
}

th, td {
  border: 1px solid #ed0808;
  padding: 8px;
}

th {
  background-color: #5d5d5d;
  text-align: left;
}

.success {
  color: green;
  font-weight: bold;
}

.failed {
  color: red;
  font-weight: bold;
}

h2 {
  text-align: center;
}

button {
  background-color: #e44c65;
  color: white;
  align-self: center;
}
</style>