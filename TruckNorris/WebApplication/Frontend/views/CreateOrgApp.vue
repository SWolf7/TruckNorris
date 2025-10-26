<template>
    <div class="form-container">
      <!--Input fields for the AdminApp
      !-- label for, id, and AdminApp.*** must match each other.
      !-- placeholder is the text inside the textfields by default.
      !-- v-model is a vue handler for the DOM
      !-- the button to submit runs the "submitForm" after clicking.-->
      <label for="name">Name of Organization (Sponsor):</label>
      <input type="text" id="name" v-model="OrgApp.name" placeholder="Organization Name" />
      <label for="email">Orginization Email:</label>
      <input type="text" id="email" v-model="OrgApp.email" placeholder="Enter Your Email" />
      <label for="type">Type:</label>
      <input type="text" id="type" v-model="OrgApp.type" placeholder="Enter the Type" />
      
      <button @click="submitForm">Submit</button>
  
      <p v-if="submittedData">You submitted: {{ submittedData }}</p>

      <router-link to="/admin" custom v-slot="{ navigate }">
        <button @click="navigate"> <-- Back To Dashboard</button>
      </router-link>
  
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import axios from "axios";
  
  export default {
    setup() {
      // Store multiple fields in a reactive object
      const OrgApp = ref({
        email: "",
        name: "",
        type: "",
      });
  
      const submittedData = ref("");
  
      const submitForm = async () => {
        //debugging log, kept for future tests
        console.log("Submitting Form Data:", OrgApp.value);
  
        //POST using axios to our API Gateway
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/submit-OrgApp`,
            { ...OrgApp.value }, // Ensures reactive values are extracted
            { headers: { "Content-Type": "application/json" } }
          );
          alert(response.data.message);
        } catch (error) {
          console.error("Error submitting OrgApp:", error);
          alert("Submission failed. Try again.");
        }
      };
  
      return {
        OrgApp,
        submittedData,
        submitForm,
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
  input, textarea {
    padding: 5px;
    font-size: 16px;
    width: 100%;
  }
  button {
    padding: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  input[type="date"] {
    background-color: #fff; /* Ensure background is white */
    color: #000; /* Ensure text color is black */
    border: 1px solid #ccc;
    padding: 5px;
    font-size: 16px;
    width: 100%;
  }
  </style>
  