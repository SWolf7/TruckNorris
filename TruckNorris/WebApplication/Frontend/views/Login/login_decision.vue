<template>
<h1>Login Page</h1>

<router-link to="/login_page" custom v-slot="{ navigate }">
  <button class="primary button" @click="navigate">Sign In</button>
</router-link>
<router-link to="/login_create" custom v-slot="{ navigate }">
  <button class="primary button" @click="navigate">Create Account</button>
</router-link>

</template>

<script setup>

</script>

<style scoped>

</style>