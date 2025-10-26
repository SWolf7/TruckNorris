import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import router from './router'; // Import Vue Router
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Amplify.configure(awsconfig);

const app = createApp(App);
app.use(router); // Activate Vue Router 
app.use(Toast)
app.mount('#app'); 
