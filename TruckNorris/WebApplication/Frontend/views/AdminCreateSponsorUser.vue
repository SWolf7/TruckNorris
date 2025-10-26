<template>
    <div class="form-container">
      <!-- Input fields for the AdminApp -->
      <label for="email">Email of Sponsor User:</label>
      <input type="text" id="email" v-model="sponsor.email" placeholder="Email" />
  
      <label for="first_name">First Name:</label>
      <input type="text" id="first_name" v-model="sponsor.first_name" placeholder="First Name" />
  
      <label for="last_name">Last Name:</label>
      <input type="text" id="last_name" v-model="sponsor.last_name" placeholder="Last Name" />
  
      <label for="type">Sponsor Type:</label>
      <select id="type" v-model="sponsor.type">
        <option value="" disabled>Select a Sponsor Type</option>
        <option v-for="type in sponsorTypes" :key="type.id" :value="type.name">
          {{ type.name }}
        </option>
      </select>
  
      <button @click="submitForm">Submit</button>
  
      <p v-if="submittedData">You submitted: {{ submittedData }}</p>
  
      <router-link to="/admin" custom v-slot="{ navigate }">
        <button @click="navigate"> <-- Back To Dashboard</button>
      </router-link>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  export default {
    setup() {
      const sponsor = ref({
        email: "",
        first_name: "",
        last_name: "",
        type: "",
      });
  
      const submittedData = ref("");
      const sponsorTypes = ref([]); // Store sponsor types
  
      // Fetch sponsor types from API
      const fetchSponsorTypes = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
          sponsorTypes.value = response.data; // Assuming API returns an array of sponsor types
        } catch (error) {
          console.error("Error fetching sponsor types:", error);
        }
      };
  
      // Fetch sponsor types when component mounts
      onMounted(fetchSponsorTypes);
  
      const submitForm = async () => {
        console.log("Submitting Form Data:", sponsor.value);
  
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/sponsor/add`,
            { ...sponsor.value },
            { headers: { "Content-Type": "application/json" } }
          );
          alert(response.data.message);
        } catch (error) {
          console.error("Error submitting sponsor:", error);
          alert("Submission failed. Try again.");
        }
      };
  
      return {
        sponsor,
        submittedData,
        submitForm,
        sponsorTypes, // Return sponsorTypes for use in template
      };
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
    gap: 10px;
  }
  input, select {
    padding: 5px;
    font-size: 16px;
    width: 100%;
  }
  button {
    padding: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  