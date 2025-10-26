<template>
<div class = "password_container">
    <label for = "email">Email of Account:</label>
    <input type = "text" v-model="email" placeholder="Enter Email">

    <label for = "sq1">Enter Passphrase:</label>
    <input type = "text" v-model="sq1" placeholder="Enter Passphrase">

    <label for = "PIN">Enter the Accounts PIN Numbers:</label>
    <input type = "text" v-model="PIN" placeholder="Enter PIN">

    <label for = "password">Enter the new Password</label>
    <input type = "text" v-model="password" placeholder="Enter New Password">

    <button @click="passwordReset">Reset</button>
</div>
</template>

<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import axios from "axios";
    import { useToast } from "vue-toastification";

    const email = ref("");
    const password = ref("");
    const sq1 = ref("");
    const PIN = ref("");
    const router = useRouter();
    const toast = useToast();


    const passwordReset = async () => {
        // Password validation regex
        const passwordValid = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

        if (!passwordValid) {
        toast.error("Password must be at least 8 characters long, contain at least 1 number and 1 special character.");
        return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset`, {
                email: email.value,
                sq1: sq1.value,
                PIN: PIN.value,
                password: password.value,
      });

            console.log(response.data);
            if(response.data.success === 1) {
                toast.success("Password Reset!");
                router.push("/login_page");
            }
            else toast.error("Failed to Reset Password!");
        } catch (error) {
            //toast.error("Failed to Reset Password!");
    }
    };
</script>

<style scoped>

</style>