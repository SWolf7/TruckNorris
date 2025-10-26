<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template>

<script>
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

export default {
  async mounted() {
    try {
      console.log("Amplify config loaded:", awsconfig);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/role`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Fake-Token" 
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      console.log("API Response:", data);

      if (!data.role) throw new Error("Role not found");

      let redirectUrl = `https://staging.d19dxmzb7jtiyo.amplifyapp.com/${data.role.toLowerCase()}`;
      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error fetching user role:", error);
      window.location.href = "https://staging.d19dxmzb7jtiyo.amplifyapp.com/driver"; // Default redirect
      window.location.href = "https://staging.d19dxmzb7jtiyo.amplifyapp.com/driver"; // Default redirect
    }
  }
};
</script>
