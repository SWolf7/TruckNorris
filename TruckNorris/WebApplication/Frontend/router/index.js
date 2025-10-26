import { jwtDecode } from "jwt-decode";

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue'; //about us page
import Application from '../views/Application.vue'; //driver application page
import AdminDash from '../views/AdminDashboard.vue'; //Admin Dashboard
import SponsorDash from '../views/SponsorDashboard.vue'; //Sponsor Dashboard
import DriverDash from '../views/DriverDashboard.vue'; //Driver Dashboard
import AdminApp from '../views/AdminApp.vue'; //Page for Admin addition
import CreateOrgApp from '../views/CreateOrgApp.vue'; //Page for creating Organizations
import ViewAppsAdmin from '../views/ViewAppsAdmin.vue'; //Page for Admins to view Driver Applications
import AdminLoginLog from '../views/AdminLoginLog.vue'; //Page for admins to view the login logs
import AdminViewUsers from '../views/AdminViewUsers.vue';//Page to hold the button links to manage the different types of users
import AdminViewDrivers from '../views/AdminViewDrivers.vue';//Page for admins to view and modify drivers
import AdminViewSponsors from '../views/AdminViewSponsors.vue';//Page for admins to view and modify sponsor users
import AdminViewAdmins from '../views/AdminViewAdmins.vue';//Page for Admins to manage Admins
import AdminCreateSponsorUser from '../views/AdminCreateSponsorUser.vue';//Page for admins to create sponsor users
import ViewAppsSponsor from '../views/ViewAppsSponsor.vue'; //Page for Sponsors to view Driver Applications
import ViewFleetSponsor from '../views/ViewFleetSponsor.vue'; //Page for Sponsors to view Driver Applications
import AuthCallback from "../views/AuthCallback.vue";
import AdminCatalog from "../views/AdminCatalog.vue";//admin page to test the catalog atm
import login_create from "../views/Login/login_create.vue";//Page creating an account
import login_decision from "../views/Login/login_decision.vue";//Landing page after homepage to further choose which way to go about accounts (create or sign in)
import login_page from "../views/Login/login_page.vue";//Page to actually sign into an account already created
import SponsorCatalog from "../views/SponsorCatalog.vue"; //Page for sponsors to view the catalog
import driverCatalog from "../views/driverCatalog.vue"; //page for drivers to view the catalog
import PasswordReset from "../views/Login/PasswordReset.vue";//page for resetting the password


const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/application', component: Application},
  { path: '/admin', component: AdminDash, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/sponsor', component: SponsorDash, meta: { requiresAuth: true, role: 'sponsor' }},
  { path: '/driver', component: DriverDash, meta: { requiresAuth: true, role: 'driver' } },
  { path: '/adminApp', component: AdminApp, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/createorgapp', component: CreateOrgApp },
  { path: '/viewappsadmin', component: ViewAppsAdmin, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/adminLoginLog', component: AdminLoginLog, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/adminViewDrivers', component: AdminViewDrivers, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/AdminViewUsers', component: AdminViewUsers, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/AdminViewSponsors', component: AdminViewSponsors, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/AdminViewAdmins', component: AdminViewAdmins, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/viewappssponsor', component: ViewAppsSponsor},
  { path: '/viewfleetsponsor', component: ViewFleetSponsor},
  { path: '/AdminCreateSponsorUser', component: AdminCreateSponsorUser, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/auth-callback', component: AuthCallback},
  { path: '/AdminCatalog', component: AdminCatalog, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/login_create', component: login_create},
  { path: '/login_decision', component: login_decision},
  { path: '/login_page', component: login_page},
  { path: '/SponsorCatalog', component: SponsorCatalog, meta: {requiresAuth: true, role: 'sponsor'}},
  { path: '/driverCatalog', component: driverCatalog, meta: {requiresAuth: true, role: 'driver'}},
  { path: '/passwordReset', component: PasswordReset}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
   // Bypass guard if "imposter" is set to "1"
   if (localStorage.getItem("imposter") === "1") {
    console.log("Imposter mode active — bypassing router guard.");
    return next();
  }

  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth) {
    if (!token) {
      console.log("No token. Redirecting to login.");
      return next("/login_page");
    }

    try {
      const decoded = jwtDecode(token);
      const userType = decoded.userType;
      const exp = decoded.exp;

      console.log("ROUTER GUARD - Decoded token:", decoded);
      console.log("Route requires:", to.meta.role, "| Token has:", userType);

      if (Date.now() >= exp * 1000) {
        console.log("Token expired.");
        localStorage.clear();
        return next("/login_page");
      }

      if (to.meta.role && to.meta.role !== userType) {
        console.log("UserType mismatch. Redirecting to login.");
        localStorage.clear();
        return next("/login_page");
      }

      next();
    } catch (e) {
      console.log("Token invalid. Redirecting to login.");
      localStorage.clear();
      next("/login_page");
    }

  } else {
    next();
  }
});

export default router;
