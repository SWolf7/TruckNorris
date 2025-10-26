<template>
    <main class="content">
        <router-link to="/adminViewDrivers" custom v-slot="{ navigate }">
            <button class="primary button" @click="navigate">Manage Drivers</button>
        </router-link> 
        <router-link to="/AdminViewSponsors" custom v-slot="{ navigate }">
            <button class="primary button" @click="navigate">Sponsor Users</button>
        </router-link> 
        <router-link to="/AdminViewAdmins" custom v-slot="{ navigate }">
            <button class="primary button" @click="navigate">Admin Users</button>
        </router-link> 
        <router-link to="/AdminCreateSponsorUser" custom v-slot="{ navigate }">
            <button class="primary button" @click="navigate">Add Sponsor Users</button>
        </router-link> 
        <router-link to="/admin" custom v-slot="{ navigate }">
            <button class="primary button" @click="navigate"><-- Back To Dashboard</button>
        </router-link>
    </main>
</template>