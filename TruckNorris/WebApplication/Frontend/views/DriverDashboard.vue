<template>
    <div class="dashboard">
        <!-- Sidebar and Main Content Container -->
        <div class="content-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <nav>
                    <h1 style="text-align: left; text-decoration-line: none !important">Truck Norris<br /> <br />Driver Dashboard</h1>
                    <ul>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'profile' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('profile')">
                                Profile
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'catalog' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('catalog')">
                                Catalog
                            </a>
                        </li>
                        <!-- <li>
                            <a :class="['button primary', { active: activeTab === 'sponsor' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('sponsor')">
                                Sponsor
                            </a>
                        </li> -->

                        <li>
                            <a :class="['button primary', { active: activeTab === 'orders' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('orders')">
                                Previous Orders
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'inbox' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('inbox')">
                                Inbox
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'settings' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('settings')">
                                Settings
                            </a>
                        </li>
                        <li>
                            <router-link class="button primary"
                                         style="color: white !important; width: 260px !important; text-align: left !important; display: block;"
                                         to="/application">
                                Driver Application
                            </router-link>
                        </li>
                        <li>
                            <a class="button primary"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="logout">
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Profile Tab -->
                <div v-if="activeTab === 'profile'">
                    <div class="dashboardcontainer">
                        <div v-if="driverData.length > 0">
                            <h2>{{ driverData[0].first_name }} {{ driverData[0].last_name }}</h2>
                            <p>
                                Email: {{ driverData[0].email }} <br />
                                Date of Birth: {{ driverData[0].date_of_birth }} <br />
                                Years of Experience: {{ driverData[0].years_driving }} <br />
                                About Me: {{ driverData[0].message }}
                            </p>
                            <button @click="showEditPopup = true" class="edit-info-btn">
                                Edit Profile Information
                            </button>
                        </div>
                        <div v-if="availableOrgs.length" style="margin-bottom: 1em;">
                            <label for="org-select"><strong>Select Organization:</strong></label>
                            <select id="org-select" v-model="selectedOrg" @change="handleOrgChange">
                                <option v-for="org in availableOrgs" :key="org" :value="org">
                                    {{ org }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div v-if="showEditPopup" class="modal-overlay">
                        <div class="modal-content">
                            <h3>Edit Profile Information</h3>

                            <div class="form-group">
                                <label>First Name:</label>
                                <input type="text" v-model="editedDriver.first_name" />
                            </div>

                            <div class="form-group">
                                <label>Last Name:</label>
                                <input type="text" v-model="editedDriver.last_name" />
                            </div>

                            <div class="form-group">
                                <label>Date of Birth:</label>
                                <input type="date"
                                       v-model="editedDriver.date_of_birth"
                                       :max="new Date().toISOString().split('T')[0]" />
                            </div>

                            <div class="form-group">
                                <label>Years of Experience:</label>
                                <input type="number" v-model="editedDriver.years_driving" min="0" />
                            </div>

                            <div class="form-group">
                                <label>About Me:</label>
                                <textarea v-model="editedDriver.message" rows="4"></textarea>
                            </div>

                            <div class="modal-actions">
                                <button @click="saveDriverInfo" class="save-btn">Save Changes</button>
                                <button @click="showEditPopup = false" class="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    </div>

                    <!-- Two Side-by-Side Containers -->
                    <div class="profile-containers">
                        <!-- Driver Points Container -->
                        <div class="profile-container points-container" style="height: 55vh !important">
                            <div v-if="driverData.length > 0">
                                <h3>Driver Points</h3>
                                <p v-if="loadingPoints">Loading points...</p>
                                <p v-else-if="selectedOrg">
                                    {{ driverData[0].points_total }} points with {{ selectedOrg }}
                                </p>
                                <p v-else>
                                    {{ driverData[0].points_total }} points (no organization selected)
                                </p>
                            </div>
                        </div>

                        <!-- Driver Point History Container -->
                        <div class="profile-container point-history-container">
                            <h3>Recent Point History</h3>
                            <div v-if="loading">Loading point history...</div>
                            <div v-else class="point-history-scroll">
                                <table v-if="filteredPointHistory.length" class="point-history-table">
                                    <thead>
                                        <tr>
                                            <th>Sponsor</th>
                                            <th>Change Time</th>
                                            <th>Change Amount</th>
                                            <th>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(history, index) in filteredPointHistory" :key="index">
                                            <td>{{ history.sponsor_email }}</td>
                                            <td>{{ formatDate(history.points_change_time) }}</td>
                                            <td>{{ history.points_change }}</td>
                                            <td>{{ history.points_change_reason }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p v-else>No point history found for this driver.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Catalog Tab -->
                <div v-if="activeTab === 'catalog'">
                    <ul class="catalog-actions">
                        <li>
                            <router-link to="/driverCatalog"
                                         class="button primary"
                                         style="color: white !important; width: 260px !important; text-align: left !important">
                                Go to the Catalog
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Sponsor Tab -->
                <div v-if="activeTab === 'sponsor'">
                    <h2>Sponsor</h2>
                    <p>Thank you to our sponsors:</p>
                    <ul class="sponsor-list">
                        <li v-for="(sponsor, index) in sponsors" :key="index">{{ sponsor }}</li>
                    </ul>
                </div>
                

                <!-- Inbox Tab -->
                <div v-if="activeTab === 'inbox'" class="dashboardcontainer">
                    <h2>Inbox</h2>

                    <!-- Compose Button -->
                    <button @click="showComposeContainer = true" class="button primary" style="margin-bottom: 10px;">
                        Compose
                    </button>

                    <!-- Compose Container -->
                    <div v-if="showComposeContainer" class="compose-container">
                        <h3>Compose Message</h3>

                        <label>
                            To:
                            <input type="email" v-model="composeTo" placeholder="Enter recipient's email" />
                        </label>

                        <label>
                            Message:
                            <textarea v-model="composeMessage" placeholder="Write your message here..."></textarea>
                        </label>

                        <div class="compose-actions">
                            <button @click="showComposeContainer = false" class="button primary">Cancel</button>
                            <button @click="sendMessage" class="button primary">Send</button>
                        </div>
                    </div>

                    <!-- Inbox View (only show if not composing) -->
                    <div v-else>
                        <!-- Received/Sent Toggle Buttons -->
                        <div style="margin-bottom: 10px;">
                            <div class="button primary" style="margin-right: 10px">
                                <button @click="currentView = 'received'"
                                        :class="{ active: currentView === 'received' }">
                                    Received Messages
                                </button>
                            </div>
                            <div class="button primary">
                                <button @click="currentView = 'sent'"
                                        :class="{ active: currentView === 'sent' }">
                                    Sent Messages
                                </button>
                            </div>
                        </div>

                        <!-- Received Table -->
                        <div v-if="currentView === 'received'">
                            <p>You have {{ receivedMessages.length }} received messages:</p>
                            <table v-if="receivedMessages.length" class="message-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Sender</th>
                                        <th>Message</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(msg, index) in receivedMessages" :key="msg.id">
                                        <td>{{ formatDate(msg.date_time) }}</td>
                                        <td>{{ msg.sender_email }}</td>
                                        <td>{{ msg.message }}</td>
                                        <td>
                                            <button @click="deleteMessage(msg.id, 'received')" class="button primary">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else>No received messages found.</p>
                        </div>

                        <!-- Sent Table -->
                        <div v-else-if="currentView === 'sent'">
                            <p>You have {{ sentMessages.length }} sent messages:</p>
                            <table v-if="sentMessages.length" class="message-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Receiver</th>
                                        <th>Message</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(msg, index) in sentMessages" :key="msg.id">
                                        <td>{{ formatDate(msg.date_time) }}</td>
                                        <td>{{ msg.target_email }}</td>
                                        <td>{{ msg.message }}</td>
                                        <td>
                                            <button @click="deleteMessage(msg.id, 'sent')" class="button primary">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else>No sent messages found.</p>
                        </div>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div v-if="activeTab === 'settings'" class="dashboardcontainer">
                    <div>
                        <h2>Settings</h2>

                        <!-- Shipping Address Section -->
                        <div class="address-section">
                            <h3>Shipping Address</h3>

                            <div v-if="loadingAddress" class="loading-message">
                                Loading address...
                            </div>

                            <div v-else-if="shippingAddress" class="address-display">
                                <p><strong>Street:</strong> {{ shippingAddress.streetname }}</p>
                                <p><strong>State:</strong> {{ shippingAddress.state }}</p>
                                <p><strong>Zip Code:</strong> {{ shippingAddress.zipcode }}</p>
                                <button @click="showAddressForm = true" class="button primary">
                                    Edit Address
                                </button>
                            </div>

                            <div v-else class="no-address">
                                <p>No address found. Do you want to add one?</p>
                                <button @click="showAddressForm = true" class="button primary">
                                    Add Shipping Address
                                </button>
                            </div>

                            <!-- Address Form (shown when adding/editing) -->
                            <div v-if="showAddressForm" class="address-form">
                                <h4>{{ shippingAddress ? 'Edit' : 'Add' }} Shipping Address</h4>

                                <div class="form-group">
                                    <label>Street Address:</label>
                                    <input type="text" v-model="addressForm.streetname" />
                                </div>

                                <div class="form-group">
                                    <label>State:</label>
                                    <select v-model="addressForm.state">
                                        <option value="">Select State</option>
                                        <option v-for="state in usStates" :value="state.abbr">{{ state.name }} ({{ state.abbr }})</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>Zip Code:</label>
                                    <input type="number" v-model="addressForm.zipcode" />
                                </div>

                                <div class="form-actions">
                                    <button @click="saveAddress" class="button primary">Save Address</button>
                                    <button @click="showAddressForm = false" class="button primary">Cancel</button>
                                </div>
                            </div>
                        </div>

                        <!-- Existing Settings -->
                        <div class="security-settings">
                            <h3>Security Settings</h3>
                            <label for="PIN">Change Your PIN:</label>
                            <input type="text" v-model="PIN" placeholder="Enter New PIN">
                            <label for="sq1">Change Your Passphrase:</label>
                            <input type="text" v-model="sq1" placeholder="Enter New Passphrase">
                        </div>
                    </div>
                    <button @click="UpdateInfo" class="button primary">Save Settings</button>
                </div>

                <!-- Orders Tab -->
                <div v-if="activeTab === 'orders'">
                    <h2>Previous Orders</h2>

                    <label for="filter-date"><strong>Filter by Date:</strong></label>
                    <input type="date" id="filter-date" v-model="filterDate" />

                    <label for="filter-org"><strong>Filter by Organization:</strong></label>
                    <select id="filter-org" v-model="filterOrg">
                    <option value="">All</option>
                    <option
                        v-for="(org, idx) in uniqueOrganizations"
                        :key="idx"
                        :value="org"
                    >
                        {{ org }}
                    </option>
                    </select>

                    <div v-if="filteredOrders.length === 0">
                        <p>No orders found.</p>
                    </div>
                        <div v-else>
                            <div v-for="(order, index) in filteredOrders" :key="index" class="profile-container">
                                <h3>Order Date: {{ formatDate(order.order_date) }}</h3>
                                <p><strong>Total Points:</strong> {{ order.total }}</p>
                                <p><strong>Organization:</strong> {{ order.organization || 'N/A' }}</p>
                                <ul>
                                <li v-for="(item, idx) in order.items" :key="idx">
                                    {{ item.trackName }} by {{ item.artistName }} (Qty: {{ item.quantity }})
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import axios from 'axios';
    import { jwtDecode } from "jwt-decode";
    import { useToast } from "vue-toastification";
    import { useRouter } from "vue-router";

    const toast = useToast();
    const router = useRouter();

    const conversionRate = ref(100);

    // Get current user email from token
    const email = ref("");
    const isImposter = localStorage.getItem("imposter") === "1";

    if (isImposter) {
        email.value = localStorage.getItem("email") || "";
    } else {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                email.value = decoded.email;
                console.log("Decoded email:", email.value);
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }

    const currentDriver = ref({
        first_name: '',
        last_name: '',
        email: email.value,
        sponsor_list: '',
        points_total: 0,
        date_of_birth: '1111-11-11',
        years_driving: 0,
        message: '',
        type: 'Driver',
        status: 1
    });

    const orders = ref([]);
    const filterDate = ref('');

    const filterOrg = ref("");

    const uniqueOrganizations = computed(() => {
    const orgs = new Set();
    orders.value.forEach(order => {
        if (order.organization) orgs.add(order.organization);
    });
    return Array.from(orgs);
    });

    const sortedOrders = computed(() => {
        return [...orders.value].sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    });

    const filteredOrders = computed(() => {
    return sortedOrders.value.filter(order => {
        const matchesDate = !filterDate.value || (
            new Date(order.order_date).toLocaleDateString('en-CA') === filterDate.value
            );
        const matchesOrg = !filterOrg.value || order.organization === filterOrg.value;
        return matchesDate && matchesOrg;
    });
    });


    const fetchPreviousOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${currentUserEmail.value}`);
            orders.value = res.data;
        } catch (error) {
            console.error("Failed to fetch previous orders:", error);
        }
    };
/*
    watch(activeTab, (newTab) => {
        if (newTab === 'orders') {
            fetchPreviousOrders();
        }
    });*/

    // Message editing state
    const editingMessage = ref(false);
    const editedMessage = ref('');

    // Organization selection
    const selectedOrg = ref("");
    const availableOrgs = ref([]);

    // reactive state for settings update
    const sq1 = ref("");
    const PIN = ref("");

    // Reactive state for driver data
    const driverData = ref([]);

    // Reactive state for the active tab
    const activeTab = ref('profile');
    const setActiveTab = (tab) => {
        activeTab.value = tab;
    };

    // Point history
    const pointHistory = ref([]);
    const loading = ref(true);

    // Catalog variables
    const availableFilters = ref([]);
    const selectedFilter = ref("");
    const results = ref([]);
    const catalogLoading = ref(false);
    const error = ref(null);
    const cart = ref([]);
    const cartVisible = ref(false);
    const checkoutVisible = ref(false);
    const points = ref(0);
    const purchaseError = ref("");
    const orgName = localStorage.getItem("activeOrg");

    

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Message editing functions
    const toggleMessageEdit = () => {
        if (editingMessage.value) {
            saveMessage();
        } else {
            editedMessage.value = driverData.value[0]?.message || '';
            editingMessage.value = true;
        }
    };

    const saveMessage = async () => {
        if (!editingMessage.value) return;

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/drivers/${email.value}/message`,
                { message: editedMessage.value }
            );

            if (driverData.value.length > 0) {
                driverData.value[0].message = editedMessage.value;
            }
            toast.success("Message updated successfully");
        } catch (error) {
            console.error("Error updating message:", error);
            toast.error("Failed to update message");
        } finally {
            editingMessage.value = false;
        }
    };

    // Watch for driverData changes and extract sponsor list
    watch(driverData, () => {
        if (driverData.value.length && driverData.value[0].sponsor_list) {
            availableOrgs.value = driverData.value[0].sponsor_list.split(",").map(o => o.trim());
            selectedOrg.value = localStorage.getItem("activeOrg") || availableOrgs.value[0] || "";
        }
    });

    const UpdateInfo = async () => {
        const currentEmail = email.value;

        if (!email) {
            toast.error("User not signed in.");
            return;
        }

        const payload = { email };

        if (sq1.value) payload.sq1 = sq1.value;
        if (PIN.value) payload.PIN = PIN.value;

        if (!payload.sq1 && !payload.PIN) {
            toast.error("Please enter at least one field to update.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/driver_update`, payload);

            if (response.data.success === 1) {
                toast.success(response.data.message);
                sq1.value = "";
                PIN.value = "";
            } else {
                toast.error(response.data.message || "Failed to update info.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Server error during update.");
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.clear();
        toast.success("Logged out!");
        router.push("/login_page");
    };

    // Mock data
    const catalog = ref(['Product A', 'Product B', 'Product C']);
    const sponsors = ref(['Sponsor X', 'Sponsor Y', 'Sponsor Z']);

    // Inbox variables
    const showComposeContainer = ref(false);
    const composeTo = ref('');
    const composeMessage = ref('');
    const currentView = ref('received');
    const receivedMessages = ref([]);
    const sentMessages = ref([]);

    // Message functions
    const deleteMessage = async (id, view) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/inbox/${id}/delete`);

            // Refresh the correct list
            const refreshEndpoint = view === 'received' ? 'received' : 'sent';
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/inbox/${email.value}/${refreshEndpoint}`
            );

            if (view === 'received') {
                receivedMessages.value = response.data;
            } else {
                sentMessages.value = response.data;
            }
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Failed to delete message");
        }
    };

    const sendMessage = async () => {
        if (!composeTo.value || !composeMessage.value) {
            toast.error("Please fill in both the recipient and the message");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/inbox`, {
                target_email: composeTo.value,
                sender_email: email.value,
                message: composeMessage.value
            });

            // Reset form
            composeTo.value = '';
            composeMessage.value = '';
            showComposeContainer.value = false;

            // Refresh sent messages
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/inbox/${email.value}/sent`
            );
            sentMessages.value = response.data;
            toast.success("Message sent successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    // Catalog functions
    const addToCart = (item) => {
        const existingItem = cart.value.find(cartItem => cartItem.trackId === item.trackId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.value.push({ ...item, quantity: 1 });
        }
    };

    const toggleCart = () => {
        cartVisible.value = !cartVisible.value;
    };

    const toggleCheckout = () => {
        checkoutVisible.value = !checkoutVisible.value;
    };

    const calculateTotal = () => {
        return cart.value.reduce((total, item) => total + (item.trackPrice * item.quantity * conversionRate.value), 0);
    };

    const confirmPurchase = async () => {
  const total = calculateTotal();
  const remaining = points.value - total;

  if (remaining < 0) {
    purchaseError.value = "Not enough points to complete purchase.";
    return;
  }

  const orderPayload = {
    email: email.value,
    order_date: new Date().toISOString(),
    total,
    organization: orgName,
    items: cart.value.map(item => ({
      trackName: item.trackName,
      artistName: item.artistName,
      quantity: item.quantity,
      email: email.value
    }))
  };

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderPayload);
    await updatePoints(-total, "Catalog Purchase");
    cart.value = [];
    checkoutVisible.value = false;
    toast.success("Purchase complete!");
  } catch (err) {
    console.error("Failed to confirm purchase:", err);
    toast.error("Something went wrong during checkout.");
  }
};


    const closeCheckout = () => {
        checkoutVisible.value = false;
        purchaseError.value = "";
    };

    const searchItunes = async () => {
        if (!selectedFilter.value) return;

        catalogLoading.value = true;
        error.value = null; 

        try {
            const baseUrl = "https://itunes.apple.com/search";
            const query = `term=${encodeURIComponent(selectedFilter.value)}&media=music&limit=20&country=US`;
            const url = `${baseUrl}?${query}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            results.value = data.results;

            
        } catch (err) {
            error.value = "Error fetching data";
        } finally {
            catalogLoading.value = false;
        }
    };

    const loadingPoints = ref(false);

    const showEditPopup = ref(false);
    const editedDriver = ref({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        years_driving: 0,
        message: ''
    });

    // Add this new method
    const saveDriverInfo = async () => {
        try {
            if (driverData.value.length > 0) {
                const response = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/api/drivers/${email.value}/message`,
                    {
                        first_name: editedDriver.value.first_name,
                        last_name: editedDriver.value.last_name,
                        date_of_birth: editedDriver.value.date_of_birth,
                        years_driving: editedDriver.value.years_driving,
                        message: editedDriver.value.message
                    }
                );

                // Update local data
                driverData.value[0].first_name = editedDriver.value.first_name;
                driverData.value[0].last_name = editedDriver.value.last_name;
                driverData.value[0].date_of_birth = editedDriver.value.date_of_birth;
                driverData.value[0].years_driving = editedDriver.value.years_driving;
                driverData.value[0].message = editedDriver.value.message;

                toast.success("Profile updated successfully");
                showEditPopup.value = false;
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const fetchSponsors = async () => {
        try {
            // First get the current selected organization from localStorage
            const currentOrg = localStorage.getItem("activeOrg") || "";

            // Fetch sponsors with optional organization filter
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
                        ...(currentOrg ? { organization: currentOrg } : {})
                    }
                }
            );

            // Filter sponsors by organization if one is selected
            sponsors.value = currentOrg
                ? response.data.filter(sponsor => sponsor.Organization === currentOrg)
                : response.data;

        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to fetch sponsors");
        }
    };

    const fetchPointHistoryForOrg = async (org) => {
        try {
            if (!email.value || !org) return;

            alert(org);

            // First get the sponsor emails for this organization
            const sponsorsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        organization: org
                    }
                }
            );

            const sponsorEmails = sponsorsResponse.data.map(sponsor => sponsor.email);

            if (sponsorEmails.length === 0) {
                pointHistory.value = [];
                return;
            }

            // Now get point history for these sponsors
            const historyResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers/${email.value}/phistory`,
                {
                    params: {
                        sponsors: sponsorEmails.join(',')
                    }
                }
            );

            pointHistory.value = historyResponse.data || [];
        } catch (error) {
            console.error("Error fetching point history:", error);
            toast.error("Failed to load point history");
            pointHistory.value = [];
        }
    };

    const handleOrgChange = async () => {
        loadingPoints.value = true;
        try {
            // Clear existing data
            results.value = [];
            cart.value = [];
            cartVisible.value = false;
            checkoutVisible.value = false;

            if (!email.value || !selectedOrg.value) return;

            // Fetch all new data for the org
            await Promise.all([
                updatePointsForOrg(selectedOrg.value),
                fetchPointHistoryForOrg(selectedOrg.value),
                fetchCatalogFilters(selectedOrg.value) // Add this line to fetch new filters
            ]);

            localStorage.setItem("activeOrg", selectedOrg.value);
            toast.success(`Organization switched to ${selectedOrg.value}`);
        } catch (error) {
            console.error("Error switching organization:", error);
            toast.error("Failed to switch organization");
        } finally {
            loadingPoints.value = false;
        }
    };

    onMounted(async () => {
        if (!email.value) {
            toast.error("No user email found");
            loading.value = false;
            return;
        }

        try {
            loading.value = true;

            // Load all data in parallel
            const [driverResponse, inboxResponses] = await Promise.all([
                // Driver info
                axios.get(`${import.meta.env.VITE_API_URL}/api/driverInfoGet/${email.value}`),
                // Inbox messages
                Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/inbox/${email.value}/received`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/inbox/${email.value}/sent`)
                ]).catch(() => [[], []])
            ]);

            // Process driver data
            driverData.value = driverResponse.data.length > 0 ? driverResponse.data : [];
            points.value = driverData.value.length > 0 ? driverData.value[0].points_total : 0;

            if (driverData.value.length > 0) {
                editedDriver.value = {
                    first_name: driverData.value[0].first_name,
                    last_name: driverData.value[0].last_name,
                    date_of_birth: driverData.value[0].date_of_birth,
                    years_driving: driverData.value[0].years_driving,
                    message: driverData.value[0].message
                };
            }

            // Process inbox data
            receivedMessages.value = inboxResponses[0].data || [];
            sentMessages.value = inboxResponses[1].data || [];

            // Initialize organizations and points
            if (driverData.value.length && driverData.value[0].sponsor_list) {
                availableOrgs.value = driverData.value[0].sponsor_list.split(",").map(o => o.trim());
                selectedOrg.value = localStorage.getItem("activeOrg") || availableOrgs.value[0] || "";

                if (selectedOrg.value) {
                    // Fetch all data for the selected organization
                    await Promise.all([
                        updatePointsForOrg(selectedOrg.value),
                        fetchPointHistoryForOrg(selectedOrg.value),
                        fetchCatalogFilters(selectedOrg.value) // Fetch filters for the selected org
                    ]);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load some data. Please refresh.");
        } finally {
            loading.value = false;
        }

        await fetchConversionRate();
    });

    const fetchConversionRate = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversion-rate/${orgName}`);
    conversionRate.value = response.data.rate;
  } catch (err) {
    console.error("Failed to fetch conversion rate", err);
    toast.error("Could not load conversion rate. Using default of 100");
    conversionRate.value = 100;
  }
};

    // Helper function to update points for an organization
    const updatePointsForOrg = async (org) => {
        loadingPoints.value = true;
        try {
            if (!email.value || !org) return;

            // Use the new endpoint to get points
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers/${email.value}/points`,
                {
                    params: {
                        organization: org
                    }
                }
            );

            // Update driver's points display
            if (driverData.value.length > 0) {
                driverData.value[0].points_total = response.data.points;
                points.value = response.data.points;
            }

        } catch (error) {
            console.error("Error calculating points:", error);
            if (driverData.value.length > 0) {
                driverData.value[0].points_total = 0;
                points.value = 0;
            }
        } finally {
            loadingPoints.value = false;
        }
    };

    // Watch for organization changes
    watch(selectedOrg, (newOrg) => {
        if (newOrg) {
            localStorage.setItem("activeOrg", newOrg);
            updatePointsForOrg(newOrg);
        }
    });

    // Computed property for filtered point history
    const filteredPointHistory = computed(() => {
        if (!pointHistory.value || !email.value) return [];

        return pointHistory.value
            .filter(entry => entry.email === email.value)
            .sort((a, b) => new Date(b.points_change_time) - new Date(a.points_change_time));
    });

    const shippingAddress = ref(null);
    const loadingAddress = ref(false);
    const showAddressForm = ref(false);
    const addressForm = ref({
        streetname: '',
        state: '',
        zipcode: ''
    });

    // US States for dropdown
    const usStates = ref([
        { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' }, { abbr: 'AZ', name: 'Arizona' },
        { abbr: 'AR', name: 'Arkansas' }, { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
        { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DE', name: 'Delaware' }, { abbr: 'FL', name: 'Florida' },
        { abbr: 'GA', name: 'Georgia' }, { abbr: 'HI', name: 'Hawaii' }, { abbr: 'ID', name: 'Idaho' },
        { abbr: 'IL', name: 'Illinois' }, { abbr: 'IN', name: 'Indiana' }, { abbr: 'IA', name: 'Iowa' },
        { abbr: 'KS', name: 'Kansas' }, { abbr: 'KY', name: 'Kentucky' }, { abbr: 'LA', name: 'Louisiana' },
        { abbr: 'ME', name: 'Maine' }, { abbr: 'MD', name: 'Maryland' }, { abbr: 'MA', name: 'Massachusetts' },
        { abbr: 'MI', name: 'Michigan' }, { abbr: 'MN', name: 'Minnesota' }, { abbr: 'MS', name: 'Mississippi' },
        { abbr: 'MO', name: 'Missouri' }, { abbr: 'MT', name: 'Montana' }, { abbr: 'NE', name: 'Nebraska' },
        { abbr: 'NV', name: 'Nevada' }, { abbr: 'NH', name: 'New Hampshire' }, { abbr: 'NJ', name: 'New Jersey' },
        { abbr: 'NM', name: 'New Mexico' }, { abbr: 'NY', name: 'New York' }, { abbr: 'NC', name: 'North Carolina' },
        { abbr: 'ND', name: 'North Dakota' }, { abbr: 'OH', name: 'Ohio' }, { abbr: 'OK', name: 'Oklahoma' },
        { abbr: 'OR', name: 'Oregon' }, { abbr: 'PA', name: 'Pennsylvania' }, { abbr: 'RI', name: 'Rhode Island' },
        { abbr: 'SC', name: 'South Carolina' }, { abbr: 'SD', name: 'South Dakota' }, { abbr: 'TN', name: 'Tennessee' },
        { abbr: 'TX', name: 'Texas' }, { abbr: 'UT', name: 'Utah' }, { abbr: 'VT', name: 'Vermont' },
        { abbr: 'VA', name: 'Virginia' }, { abbr: 'WA', name: 'Washington' }, { abbr: 'WV', name: 'West Virginia' },
        { abbr: 'WI', name: 'Wisconsin' }, { abbr: 'WY', name: 'Wyoming' }
    ]);

    const fetchShippingAddress = async () => {
        try {
            loadingAddress.value = true;
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/shipping-address/${email.value}`
            );

            // Handle the response based on your backend
            if (response.data && !response.data.error) {
                shippingAddress.value = response.data;
                // Pre-fill form if editing existing address
                addressForm.value = {
                    streetname: shippingAddress.value.streetname,
                    state: shippingAddress.value.state,
                    zipcode: shippingAddress.value.zipcode
                };
            } else {
                shippingAddress.value = null;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                shippingAddress.value = null;
            } else {
                console.error("Error fetching shipping address:", error);
                toast.error("Failed to load shipping address");
            }
        } finally {
            loadingAddress.value = false;
        }
    };

    const saveAddress = async () => {
        try {
            // Frontend validation
            if (!addressForm.value.streetname?.trim()) {
                toast.error("Street address is required");
                return;
            }
            if (!addressForm.value.state) {
                toast.error("Please select a state");
                return;
            }
            if (!addressForm.value.zipcode) {
                toast.error("Zip code is required");
                return;
            }

            const state = addressForm.value.state.toUpperCase().trim();
            if (state.length !== 2) {
                toast.error("State must be 2 characters (e.g., CA, NY)");
                return;
            }

            const zipStr = addressForm.value.zipcode.toString().trim();
            if (!/^\d{5}(-\d{4})?$/.test(zipStr)) {
                toast.error("Zip code must be 5 digits (e.g., 90210) or 9 digits (e.g., 90210-1234)");
                return;
            }

            // Prepare data
            const addressData = {
                email: email.value,
                streetname: addressForm.value.streetname.trim(),
                state: state,
                zipcode: zipStr
            };

            console.log("Sending data:", addressData); // Debug log

            let response;
            const isUpdate = !!shippingAddress.value;

            if (isUpdate) {
                // PATCH request for update
                response = await axios.patch(
                    `${import.meta.env.VITE_API_URL}/api/shipping-address/${email.value}`,
                    addressData
                );
                console.log("PATCH response:", response.data); // Debug log
            } else {
                // POST request for create
                response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/shipping-address/${email.value}/new`,
                    addressData  // Removed email from URL for POST
                );
                console.log("POST response:", response.data); // Debug log
            }

            // Verify the response contains actual success
            if (!response.data.success) {
                throw new Error("Backend reported unsuccessful operation");
            }

            // Handle success
            toast.success(isUpdate
                ? "Address updated successfully!"
                : "Address created successfully!");

            showAddressForm.value = false;
            await fetchShippingAddress(); // Force refresh from server

        } catch (error) {
            console.error("Save address error:", error);
            console.error("Error details:", error.response?.data); // Additional debug info

            if (error.response) {
                if (error.response.status === 409) {
                    toast.error("Address already exists. Please use the edit form.");
                } else if (error.response.data?.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Failed to save address. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        }
    };

    // Call fetchShippingAddress when the component mounts or when email changes
    onMounted(async () => {
        if (email.value) {
            await fetchShippingAddress();
        }
    });

    watch(email, async (newEmail) => {
        if (newEmail) {
            await fetchShippingAddress();
        }
    });

    const fetchCatalogFilters = async (org) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/org-filters`,
                { params: { name: org } }
            );
            availableFilters.value = response.data.filters || [];
            if (availableFilters.value.length > 0) {
                selectedFilter.value = availableFilters.value[0];
            }
        } catch (error) {
            console.error("Error fetching filters:", error);
            availableFilters.value = [];
        }
    };
</script>

<style scoped>
    .dashboard {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content-container {
        display: flex;
        flex: 1;
    }

    .sidebar {
        width: 300px;
        background-color: #e44c65;
        padding: 1rem;
        text-align: left;
    }

        .sidebar nav ul {
            list-style: none;
            padding: 0;
        }

            .sidebar nav ul li {
                margin: 1rem 0;
            }

                .sidebar nav ul li a {
                    color: white;
                    text-decoration: none;
                    cursor: pointer;
                    display: block;
                    padding: 0.5rem;
                    transition: background-color 0.3s ease;
                }

                    .sidebar nav ul li a.active {
                        background-color: #1c1d26;
                    }

    .main-content {
        flex: 1;
        padding: 1rem;
    }

        .main-content ul {
            list-style-type: disc;
            padding-left: 20px;
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

    .profile-containers {
        display: flex;
        gap: 1rem;
    }

    .profile-container {
        flex: 1;
        background: rgba(255, 255, 255, 0.075);
        border-radius: 4px;
        padding: 1em 1.5em;
        margin-bottom: 2em;
    }

        .profile-container h3 {
            margin-top: 0;
        }

    .points-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

        .points-container p {
            font-size: 2em;
            margin: 0;
        }

    /* Point History Scrollable Container */
    .point-history-container {
        display: flex;
        flex-direction: column;
        height: 55vh;
    }

    .point-history-scroll {
        overflow-y: auto;
        flex-grow: 1;
        max-height: calc(55vh - 40px);
    }

    .point-history-table {
        width: 100%;
        border-collapse: collapse;
    }

        .point-history-table th,
        .point-history-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #444;
        }

        .point-history-table th {
            position: sticky;
            top: 0;
            background-color: #2c2e3a;
            z-index: 1;
        }

        .point-history-table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

    /* Message Editing Styles */
    .edit-message-btn {
        margin-left: 10px;
        padding: 2px 8px;
        background-color: #e44c65;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8em;
    }

    .message-edit-input {
        width: 60%;
        padding: 4px 8px;
        background-color: #2c2e3a;
        color: white;
        border: 1px solid #444;
        border-radius: 4px;
    }

    /* Compose Container Styles */
    .compose-container {
        background: rgba(255, 255, 255, 0.075);
        color: white;
        border-radius: 4px;
        padding: 1em 1.5em;
        margin-bottom: 20px;
        font-size: 0.9em;
        line-height: 1.75em;
    }

        .compose-container label {
            display: block;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
            color: white;
        }

        .compose-container input,
        .compose-container textarea {
            width: 100%;
            padding: 10px;
            font-size: 1rem;
            border-radius: 4px;
            border: none;
            background-color: #2c2e3a;
            color: white;
            box-sizing: border-box;
            margin-bottom: 15px;
        }

            .compose-container input::placeholder,
            .compose-container textarea::placeholder {
                color: #aaa;
            }

    .compose-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    /* Message Table Styles */
    .message-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1em;
    }

        .message-table th,
        .message-table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #444;
        }

        .message-table th {
            background-color: #2c2e3a;
        }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: #2c2e3a; /* Changed from semi-transparent to solid dark */
        color: white;
        border-radius: 4px;
        padding: 1.5em;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* Darker shadow for better contrast */
        border: 1px solid #444; /* Added border for definition */
    }

        .modal-content h3 {
            margin-top: 0;
            color: white;
            border-bottom: 1px solid #444;
            padding-bottom: 0.5em;
        }

        .modal-content .form-group {
            margin-bottom: 15px;
        }

            .modal-content .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .modal-content .form-group input[type="text"],
            .modal-content .form-group input[type="date"],
            .modal-content .form-group input[type="number"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                color: white;
                background-color: #333;
            }

            .modal-content .form-group textarea {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                color: white;
                background-color: #333;
            }

    .form-group {
        margin-bottom: 1.5em;
    }

        .form-group label {
            display: block;
            margin-bottom: 0.5em;
            font-weight: bold;
            color: white;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            background-color: #1c1d26; /* Darker background for inputs */
            color: white;
            border: 1px solid #444;
            border-radius: 4px;
            font-size: 1rem;
        }

            .form-group input[type="date"] {
                padding: 8px;
            }

            .form-group input[type="number"] {
                padding: 10px;
            }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

    /* Rest of your existing styles remain exactly the same */
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 1.5em;
    }

    .save-btn {
        background-color: #e44c65;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

        .save-btn:hover {
            background-color: #d43c55;
        }

    .cancel-btn {
        background-color: #444;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

        .cancel-btn:hover {
            background-color: #555;
        }

    .edit-info-btn {
        background-color: #e44c65;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1em;
        font-size: 0.9em;
        transition: background-color 0.3s ease;
    }

        .edit-info-btn:hover {
            background-color: #d43c55;
        }

    /* Catalog Styles */
    .catalog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 10px;
        left: 320px; /* Adjust based on your sidebar width */
        right: 20px;
        z-index: 100;
    }

    .points-display {
        background-color: #444;
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 18px;
    }

    .cart-icon {
        background-color: #444;
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 18px;
        cursor: pointer;
        position: relative;
    }

    .cart-popup {
        position: absolute;
        top: 35px;
        right: 0;
        background-color: #333;
        color: white;
        border-radius: 8px;
        padding: 10px;
        width: 300px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 101;
    }

    .checkout-popup {
        position: absolute;
        top: 35px;
        right: 0;
        background-color: #444;
        color: white;
        border-radius: 8px;
        padding: 10px;
        width: 300px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 101;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .grid-item {
        background: #232121;
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        color: grey;
    }

    .audio-player {
        width: 100%;
        margin: 8px 0;
    }
    input[type="date"] {
        color: white;
        background-color: #1c1d26;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
    select {
        padding: 5px;
        background-color: #1c1d26;
        color: white;
        border-radius: 4px;
        margin-bottom: 10px;
    }
</style>