<template>
    <div class="login-container">
        <h2>Login</h2>

        <label for="email">Email</label>
        <input type="text" v-model="email" placeholder="Enter Email">

        <label for="password">Password</label>
        <input type="password" v-model="password" placeholder="Enter Password">

        <button class="button primary" style="margin-right: 20px;" @click="login">Login</button>

        <router-link to="/passwordReset">
            <button class="button primary">Forgot Password?</button>
        </router-link>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import axios from "axios";
    import { jwtDecode } from "jwt-decode";

    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const login = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                email: email.value,
                password: password.value,
            });

            const { token } = response.data;
            const decoded = jwtDecode(token);

            const userEmail = decoded.email;
            const userType = decoded.userType;

            console.log("Decoded:", decoded);
            console.log("Redirecting to:", userType);


            localStorage.setItem("token", token);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("userType", userType);

            // Redirect user based on their role
            if (userType === "driver") router.push("/driver");
            else if (userType === "sponsor") router.push("/sponsor");
            else if (userType === "admin") router.push("/admin");
            else errorMessage.value = "Unknown user type!";
        } catch (error) {
            errorMessage.value = "Invalid email or password.";
        }
    };
</script>

<style scoped>
    .login-container {
        max-width: 400px;
        margin: auto;
        padding: 20px;
        text-align: center;
    }

        .login-container label,
        .login-container input {
            display: block;
            margin: 10px auto;
            width: 80%;
            text-align: left;
        }

        .login-container input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .login-container button {
            margin-top: 15px;
            padding: 10px 20px;
            cursor: pointer;
        }

    .error {
        color: red;
        margin-top: 10px;
    }

    
</style>
