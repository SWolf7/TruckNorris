<template>
    <div >
        <h1>Account Creation</h1>

        <div class="form_container dashboardcontainer">

            <!--Email-->
            <label for="email">Email Address</label>
            <input type="text" id="email" v-model="accountCreate.email" placeholder="Enter your Email" />

            <!--First Name-->
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" v-model="accountCreate.first_name" placeholder="Enter your first name" />

            <!--Last Name-->
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" v-model="accountCreate.last_name" placeholder="Enter your Last Name" />

            <!--Password-->
            <label for="password">Enter your Password</label>
            <input type="password" id="password" v-model="accountCreate.password" placeholder="password" />

            <!--Date Of Birth-->
            <label for="date_of_birth">Date Of Birth</label>
            <input style="color: black" type="date" id="date_of_birth" v-model="accountCreate.date_of_birth" placeholder="DoB" />

            <!--Years Driving-->
            <label for="years_driving">Years Driving</label>
            <input type="text" id="years_driving" v-model="accountCreate.years_driving" palceholder="Time in years" />

            <!--Biography (field called "message" in the DB)-->
            <label for="message">Enter a little about yourself</label>
            <input type="text" id="message" v-model="accountCreate.message" placeholder="About You:" />

            <!--Submit Button-->
            <button @click="submitForm" class="button primary">Create Account</button>
            <p v-if="submittedData">You submitted : {{  submittedData }}</p>
        </div>
    </div>
</template>

<script>
    import { ref } from "vue";
    import axios from "axios";
    import { useToast } from "vue-toastification";

    const toast = useToast();

    export default
        {
            setup() {
                //create a reactive object to store the fields
                const accountCreate = ref
                    ({
                        email: "",
                        first_name: "",
                        last_name: "",
                        password: "",
                        date_of_birth: "",
                        years_driving: "",
                        message: "",
                    });

                const submittedData = ref("");

                const submitForm = async () => {

                    //POST using Axios to our API gateway
                    try {
                        const response = await axios.post
                            (
                                `${import.meta.env.VITE_API_URL}/loginCreate`,
                                { ...accountCreate.value },
                                { headers: { "Content-Type": "application/json" } }
                            );
                        toast.success(response.data.message);
                    } catch (error) {
                        console.error("Error submitting Account Creation Form: ", error);
                        toast.error("Submission failed! Try Again.");
                    }
                };

                return {
                    accountCreate,
                    submittedData,
                    submitForm,
                };
            },
        };
</script>

<style scoped>
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