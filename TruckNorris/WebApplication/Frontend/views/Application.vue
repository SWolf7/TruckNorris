<template>
    <div class="form-container ">
        <!--Input fields for the Application
        !-- label for, id, and Application.*** must match each other.
        !-- placeholder is the text inside the textfields by default.
        !-- v-model is a vue handler for the DOM
        !-- the button to submit runs the "submitForm" after clicking.-->
        <label for="first_name">First Name:</label>
        <input type="text" id="first_name" v-model="Application.first_name" placeholder="Enter Your First Name" />

        <label for="last_name">Last Name:</label>
        <input type="text" id="last_name" v-model="Application.last_name" placeholder="Enter Last Name" />

        <label for="email">Email:</label>
        <input type="text" id="email" v-model="Application.email" placeholder="Enter Email" />

        <label for="date_of_birth">Date of Birth:</label>
        <input type="date" id="date_of_birth" v-model="Application.date_of_birth" placeholder="MM/DD/YYYY" />

        <label for="sponsor">Sponsor You Wish To Apply Too:</label>
        <!--<input type="text" id="sponsor" v-model="Application.sponsor" placeholder="Enter Desired Sponsor" />-->
        <select id="sponsor" v-model="Application.sponsor">
            <option value="" disabled>Select a Sponsor</option>
            <option v-for="sponsor in sponsors" :key="sponsor.id" :value="sponsor.name">
                {{ sponsor.name }}
            </option>
        </select>

        <label for="years_driving">Years Driving:</label>
        <input type="text" id="years_driving" v-model="Application.years_driving" placeholder="Enter Years Driving Professionally" />

        <label for="message">Enter A Message To Go With Your Application:</label>
        <textarea id="message" v-model="Application.message" placeholder="Enter Your Message" />

        <button @click="submitForm">Submit</button>

        <p v-if="submittedData">You submitted: {{ submittedData }}</p>
    </div>
</template>

<script>
    import { ref, onMounted } from "vue";  // Add onMounted here
    import axios from "axios";
    export default {
        setup() {
            // Store multiple fields in a reactive object
            const Application = ref({
                first_name: "",
                last_name: "",
                years_driving: "",
                message: "",
                sponsor: "",
                date_of_birth: ""
            });

            const submittedData = ref("");
            const sponsors = ref([]); // Store sponsor names

            // Fetch sponsors from API
            const fetchSponsors = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
                    sponsors.value = response.data; // Assuming API returns an array of sponsors
                } catch (error) {
                    console.error("Error fetching sponsors:", error);
                }
            };

            // Fetch sponsors when component mounts
            onMounted(fetchSponsors);

            const submitForm = async () => {
                console.log("Submitting Form Data:", Application.value);
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/submit-application`,
                        { ...Application.value },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    alert(response.data.message);
                } catch (error) {
                    console.error("Error submitting application:", error);
                    alert("Submission failed. Try again.");
                }
            };

            return {
                Application,
                submittedData,
                submitForm,
                sponsors, // Return sponsors for use in template
            };
        },
    };
    /**
    export default {
      setup() {
        // Store multiple fields in a reactive object
        const Application = ref({
          first_name: "",
          last_name: "",
          email: "",
          years_driving: "",
          message: "",
          sponsor: "",
          date_of_birth: ""
        });

        const submittedData = ref("");

        const submitForm = async () => {
          //debugging log, kept for future tests
          console.log("Submitting Form Data:", Application.value);

          //POST using axios to our API Gateway
          try {
            const response = await axios.post(
              "${import.meta.env.VITE_API_URL}/api/submit-application",
              { ...Application.value }, // Ensures reactive values are extracted
              { headers: { "Content-Type": "application/json" } }
            );
            alert(response.data.message);
          } catch (error) {
            console.error("Error submitting application:", error);
            alert("Submission failed. Try again.");
          }
        };

        return {
          Application,
          submittedData,
          submitForm,
        };
      },
    };*/
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
        background-color: #060606; /* Ensure background is white */
        color: #f7f3f3; /* Ensure text color is black */
        border: 1px solid #f10808;
        padding: 5px;
        font-size: 16px;
        width: 100%;
    }

    .dashboardcontainer {
        background: rgba(255, 255, 255, 0.075);
        border-radius: 4px;
        font-size: 0.9em;
        margin: 0 0 2em 0;
        display: block;
        line-height: 1.75em;
        padding: 1em 1.5em;
        overflow-x: auto;
    }
</style>
