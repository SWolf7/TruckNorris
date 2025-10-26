<template>
    <div class="dashboard">
        <!-- Sidebar and Main Content Container -->
        <div class="content-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <nav>
                    <h1 style="text-align: left; text-decoration-line: none !important">Truck Norris<br /> <br />Sponsor Dashboard</h1>
                    <ul>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'profile' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('profile')">
                                Profile
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'addUserOrOrg' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('addUserOrOrg')">
                                Add User
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'viewLogsAndUsers' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('viewLogsAndUsers')">
                                View Logs and Users
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'catalog' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('catalog')">
                                Catalog
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
                        <h2>{{ currentSponsor?.first_name }} {{ currentSponsor?.last_name }}</h2>
                        <p v-if="currentSponsor">
                            <!--Name: {{ currentSponsor?.first_name }} {{ currentSponsor?.last_name }} <br />-->
                            Email: {{ currentSponsor?.email }} <br />
                            Organization: {{currentSponsor?.Organization}} <br />
                            Role: Sponsor <br />
                            Last Login: {{ formatDate(lastLogin) }}
                        </p>
                        <p v-else>Loading profile information...</p>
                    </div>
                    
                </div>

                <div class="dashboardcontainer">
                    <h2>Set Custom Conversion Rate</h2>
                    <p>Current Conversion Rate: 1 USD = {{ conversionRate }} Points</p>
                    <input
                    v-model.number="conversionInput"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter points per 1 USD"
                    />
                    <button @click="saveConversionRate">Save Conversion Rate</button>
                </div>
                



                <!-- Add User or Org Tab -->
                <div v-if="activeTab === 'addUserOrOrg'">
                    <div class="dashboardcontainer">
                        <h2>Add User</h2>
                        <form @submit.prevent="addUserOrOrg">
                            <label for="userType">Select Type:</label>
                            <select id="userType" v-model="newEntry.type" required @change="resetForm">
                                <option value="sponsor">Sponsor</option>
                            </select>

                            <!-- Sponsor Fields -->
                            <div v-if="newEntry.type === 'sponsor'">
                                <label for="sponsorEmail">Sponsor Email:</label>
                                <input type="email" id="sponsorEmail" v-model="SponsorApp.email" placeholder="Enter Sponsor Email" required />
                                <label for="sponsorFirstName">First Name:</label>
                                <input type="text" id="sponsorFirstName" v-model="SponsorApp.first_name" placeholder="Enter First Name" required />
                                <label for="sponsorLastName">Last Name:</label>
                                <input type="text" id="sponsorLastName" v-model="SponsorApp.last_name" placeholder="Enter Last Name" required />
                                <input type="hidden" id="sponsorStatus" v-model="SponsorApp.status" />
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>

                <!-- View Logs and Users Tab -->
                <div v-if="activeTab === 'viewLogsAndUsers'">
                    <div class="dashboardcontainer">
                        <h2>View Logs and Users</h2>
                        <div class="sub-nav">
                            <button :class="['button primary', { active: viewSubTab === 'manageDrivers' }]" @click="setViewSubTab('manageDrivers')">Manage Drivers</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'sponsorUsers' }]" @click="setViewSubTab('sponsorUsers')">See Sponsor Users</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'driverApplications' }]" @click="setViewSubTab('driverApplications')">View Driver Applications</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'pointHistory' }]" @click="setViewSubTab('pointHistory')">Point History</button>
                            <button style="margin-left: 20px" class="button primary" @click="showFullSponsorSalesSubtab">Show Full Sales Report</button>
                        </div>
                        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                            <button @click="downloadReport">Download CSV</button>
                        </div>
                    </div>

                    <!-- Manage Drivers Subtab -->
                    <div v-if="viewSubTab === 'manageDrivers'">
                        <div class="dashboardcontainer">
                            <h2>Driver List</h2>

                            <label for="driverStatusFilter">Filter by Status:</label>
                            <select id="driverStatusFilter" v-model="selectedStatus" @change="fetchDrivers">
                                <option value="">All</option>
                                <option value="1">Current</option>
                                <option value="2">Suspended</option>
                                <option value="3">Deactivated</option>
                            </select>

                            <table>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Years Driving</th>
                                        <th>Points</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="driver in drivers" :key="driver.email">
                                        <td>{{ driver.first_name }}</td>
                                        <td>{{ driver.last_name }}</td>
                                        <td>{{ driver.email }}</td>
                                        <td>{{ driver.years_driving }}</td>
                                        <td>{{ driver.points_total }}</td>
                                        <td>
                                            <select v-model="driver.status" @change="updateDriverStatus(driver)">
                                                <option value="1">Current</option>
                                                <option value="2">Suspended</option>
                                                <option value="3">Deactivated</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="actions-dropdown">
                                                <button @click="toggleActionsDropdown(driver.email)" class="dropdown-toggle">
                                                    Actions
                                                </button>
                                                <div v-if="activeDropdown === driver.email" class="dropdown-menu">
                                                    <button @click="openPointsDialog(driver)">Change Points</button>
                                                    <button @click="switchToDriverView(driver)">View As</button>
                                                    <button @click="fetchPointHistoryForDriver(driver)">View Point History</button>
                                                    <button @click="showDriverSalesSubtab(driver.email)">Show Sales Report</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Points Change Modal -->
                            <div v-if="showPointsDialog" class="modal-overlay" id="pointChangeModel">
                                <div class="modal-content">
                                    <h3>Change Points for {{ selectedDriver.first_name }} {{ selectedDriver.last_name }}</h3>
                                    <p>Current Total Points: {{ selectedDriver.points_total }}</p>

                                    <div class="form-group">
                                        <label for="pointsChangeInput">Points Adjustment:</label>
                                        <input type="number"
                                               style="color: white !important"
                                               id="pointsChangeInput"
                                               v-model.number="pointsChange"
                                               :min="-selectedDriver.points_total"
                                               step="1"
                                               @input="validatePointsChange">
                                        <p v-if="pointsChange > 0" class="points-hint">Will add {{ pointsChange }} points</p>
                                        <p v-else-if="pointsChange < 0" class="points-hint">Will subtract {{ Math.abs(pointsChange) }} points</p>
                                    </div>

                                    <div class="form-group">
                                        <label for="changeReasonInput">Reason for Change:</label>
                                        <input type="text"
                                               style="color: white !important"
                                               id="changeReasonInput"
                                               v-model="pointsChangeReason"
                                               placeholder="Enter reason for points change"
                                               required>
                                    </div>

                                    <div class="modal-actions">
                                        <button class="cancel-btn" @click="closePointsDialog">Cancel</button>
                                        <button class="submit-btn"
                                                @click="submitPointsChange">
                                            Submit Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="showDriverPointHistoryDialog" class="modal-overlay">
                                <div class="modal-content" style="width: 60% !important; height: 60% !important">
                                    <h3>Point History for {{ selectedPointHistoryDriver?.first_name }} {{ selectedPointHistoryDriver?.last_name }}</h3>
                                    <p>Email: {{ selectedPointHistoryDriver?.email }}</p>
                                    <p v-if="selectedPointHistoryDriver?.selectedSponsor">Organization: {{ selectedPointHistoryDriver.selectedSponsor }}</p>

                                    <div v-if="loadingDriverPointHistory">Loading point history...</div>
                                    <div v-else>
                                        <table v-if="driverPointHistory.length" class="point-history-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Sponsor</th>
                                                    <th>Points Change</th>
                                                    <th>Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(entry, index) in driverPointHistory" :key="index">
                                                    <td>{{ formatDateTime(entry.timestamp) }}</td>
                                                    <td>{{ entry.organization }}</td>
                                                    <td :class="{ 'positive': entry.points_change > 0, 'negative': entry.points_change < 0 }">
                                                        {{ entry.points_change > 0 ? '+' : '' }}{{ entry.points_change }}
                                                    </td>
                                                    <td>{{ entry.reason }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p v-else>No point history found for this driver.</p>
                                    </div>

                                    <div class="modal-actions">
                                        <button class="cancel-btn" @click="closePointHistoryDialog">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sponsor Users Subtab -->
                    <div v-if="viewSubTab === 'sponsorUsers'">
                        <div class="dashboardcontainer">
                            <h2>Sponsor User List</h2>

                            <label for="sponsorStatusFilter">Filter by Status:</label>
                            <select id="sponsorStatusFilter" v-model="selectedStatus" @change="fetchSponsors">
                                <option value="">All</option>
                                <option value="1">Current</option>
                                <option value="2">Suspended</option>
                                <option value="3">Deactivated</option>
                            </select>

                            <table>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="spon_user in sponsors" :key="spon_user.email">
                                        <td>{{ spon_user.first_name }}</td>
                                        <td>{{ spon_user.last_name }}</td>
                                        <td>{{ spon_user.email }}</td>
                                        <td>{{ spon_user.type }}</td>
                                        <td>{{ spon_user.status }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Driver Sales Report -->
                <div v-if="viewSubTab === 'driverSalesReport'">
                    <h3>Sales Report for {{ selectedDriverEmail }}</h3>

                    <div v-if="displayedReportData.length">
                        <table class="sales-report-table">
                        <thead>
                            <tr>
                            <th>Order Date</th>
                            <th>Track</th>
                            <th>Artist</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(entry, index) in displayedReportData" :key="index">
                            <td>{{ formatDate(entry.order_date) }}</td>
                            <td>{{ entry.trackName }}</td>
                            <td>{{ entry.artistName }}</td>
                            <td>{{ entry.quantity }}</td>
                            <td>${{ entry.total }}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <p v-else>No sales data available for this driver.</p>

                    <button class="button" @click="setViewSubTab('manageDrivers')" style="margin-top: 15px;">
                        ← Back to Manage Drivers
                    </button>
                </div>

                <!-- Full Sponsor Sales Report -->
                <div v-if="viewSubTab === 'fullSponsorReport'">
                    <h3>Full Sales Report for {{ currentSponsor?.Organization }}</h3>

                    <div v-if="displayedReportData.length">
                        <table class="sales-report-table">
                        <thead>
                            <tr>
                            <th>Order Date</th>
                            <th>Driver</th>
                            <th>Track</th>
                            <th>Artist</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(entry, index) in displayedReportData" :key="index">
                            <td>{{ formatDate(entry.order_date) }}</td>
                            <td>{{ entry.driver_email }}</td>
                            <td>{{ entry.trackName }}</td>
                            <td>{{ entry.artistName }}</td>
                            <td>{{ entry.quantity }}</td>
                            <td>${{ entry.total }}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <p v-else>No sales data found for this organization.</p>

                    <button class="button" style="margin-top: 15px" @click="setViewSubTab('manageDrivers')">
                        ← Back to Manage Drivers
                    </button>
                </div>

                    <!-- Driver Applications Subtab -->
                    <div v-if="viewSubTab === 'driverApplications'">
                        <div class="dashboardcontainer">
                            <h2>Driver Applications</h2>

                            <label for="statusSelect">Select Status:</label>
                            <select id="statusSelect" v-model="selectedAppStatus" @change="fetchSponsorApplications">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>

                            <table v-if="driverApplications.length > 0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Years Driving</th>
                                        <th>Date of Birth</th>
                                        <th>Message</th>
                                        <th>Created At</th>
                                        <th v-if="selectedAppStatus === 'open'">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="app in driverApplications" :key="app.id">
                                        <td>{{ app.id }}</td>
                                        <td>{{ app.first_name }}</td>
                                        <td>{{ app.last_name }}</td>
                                        <td>{{ app.email }}</td>
                                        <td>{{ app.years_driving }}</td>
                                        <td>{{ new Date(app.date_of_birth).toLocaleDateString() }}</td>
                                        <td>{{ app.message }}</td>
                                        <td>{{ new Date(app.created_at).toLocaleString() }}</td>
                                        <td v-if="selectedAppStatus === 'open'">
                                            <button @click="acceptApplication(app.id, app.email)">Accept</button>
                                            <button @click="denyApplication(app.id)">Deny</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <p v-if="driverApplications.length === 0">No applications found for the selected criteria.</p>

                        </div>
                    </div>

                    <div v-if="viewSubTab === 'pointHistory'">
                        <div class="dashboardcontainer">
                            <h2>Point History</h2>
                            <div class="filters">
                                <div class="filter-group">
                                    <label for="driver-filter">Filter by Driver:</label>
                                    <select id="driver-filter" v-model="selectedDriverFilter" @change="fetchPointHistory">
                                        <option value="">All Drivers</option>
                                        <option v-for="driver in allDrivers" :key="driver.email" :value="driver.email">
                                            {{ driver.first_name }} {{ driver.last_name }} ({{ driver.email }})
                                        </option>
                                    </select>
                                </div>
                                <!--<div class="filter-group">
                                    <label for="sponsor-filter">Filter by Sponsor:</label>
                                    <select id="sponsor-filter" v-model="selectedSponsorFilter" @change="fetchPointHistory">
                                        <option value="">All Sponsors</option>
                                        <option v-for="sponsor in allSponsors" :key="sponsor" :value="sponsor">
                                            {{ sponsor }}
                                        </option>
                                    </select>
                                </div>-->
                                <div class="filter-group">
                                    <label for="date-from">From:</label>
                                    <input  type="date" id="date-from" v-model="dateFrom" @change="fetchPointHistory" />
                                </div>
                                <div class="filter-group">
                                    <label for="date-to">To:</label>
                                    <input  type="date" id="date-to" v-model="dateTo" @change="fetchPointHistory" />
                                </div>
                                <button @click="resetFilters" class="reset-btn">Reset Filters</button>
                            </div>

                            <div v-if="loadingPointHistory">Loading point history...</div>
                            <div v-else>
                                <div class="summary-stats">
                                    <p>Total Records: {{ pointHistory.length }}</p>
                                    <p>Total Points Added: {{ totalPointsAdded }}</p>
                                    <p>Total Points Deducted: {{ totalPointsDeducted }}</p>
                                </div>

                                <table v-if="pointHistory.length" class="point-history-table">
                                    <thead>
                                        <tr>
                                            <th @click="sortPointHistory('timestamp')">
                                                Date
                                                <span v-if="sortField === 'timestamp'">
                                                    {{ sortOrder === 'asc' ? '(asc)' : '(desc)' }}
                                                </span>
                                            </th>
                                            <th @click="sortPointHistory('driver_email')">
                                                Driver
                                                <span v-if="sortField === 'driver_email'">
                                                    {{ sortOrder === 'asc' ? '(asc)' : '(desc)' }}
                                                </span>
                                            </th>
                                            <th @click="sortPointHistory('organization')">
                                                Sponsor
                                                <span v-if="sortField === 'organization'">
                                                    {{ sortOrder === 'asc' ? '(asc)' : '(desc)' }}
                                                </span>
                                            </th>
                                            <th @click="sortPointHistory('points_change')">
                                                Points Change
                                                <span v-if="sortField === 'points_change'">
                                                    {{ sortOrder === 'asc' ? '(asc)' : '(desc)' }}
                                                </span>
                                            </th>
                                            <th>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(entry, index) in sortedPointHistory" :key="index">
                                            <td>{{ formatDateTime(entry.timestamp) }}</td>
                                            <td>{{ getDriverName(entry.driver_email) }} ({{ entry.driver_email }})</td>
                                            <td>{{ entry.organization }}</td>
                                            <td :class="{ 'positive': entry.points_change > 0, 'negative': entry.points_change < 0 }">
                                                {{ entry.points_change > 0 ? '+' : '' }}{{ entry.points_change }}
                                            </td>
                                            <td>{{ entry.reason }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p v-else>No point history found for the selected filters.</p>

                                <div v-if="pointHistory.length" class="pagination">
                                    <button @click="prevPage">Previous</button>
                                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                                    <button @click="nextPage">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Catalog Tab -->
                <div v-if="activeTab === 'catalog'" class="dashboardcontainer">
                    <h2>iTunes Search</h2>
                    <input v-model="searchKeyword" @keyup.enter="searchFilters" placeholder="Search iTunes..." />
                    <button class="primary button" @click="searchFilters">Search</button>

                    <div v-if="results.length">
                        <h3>Save current keyword as filter:</h3>
                        <button @click="addFilter(searchKeyword)">Add "{{ searchKeyword }}" to Organization Filters</button>
                    </div>

                    <p v-if="loading">Loading...</p>
                    <p v-if="searchError">{{ searchError }}</p>

                    <div v-if="results.length" class="grid-container">
                        <div v-for="item in results" :key="item.trackId" class="grid-item">
                            <img :src="item.artworkUrl100" alt="Album Art" />
                            <p>{{ item.trackName }} - {{ item.artistName }}</p>
                            <p v-if="item.trackPrice !== undefined">
                                $ {{ item.trackPrice }} {{ item.currency || 'USD' }}
                            </p>
                            <audio controls :src="item.previewUrl"></audio>
                        </div>
                    </div>
                </div>

                <!-- Inbox Tab -->
                <div v-if="activeTab === 'inbox'">
                    <h2>Inbox</h2>
                    <p>You have {{ inbox.length }} new messages:</p>
                    <ul>
                        <li v-for="(message, index) in inbox" :key="index">{{ message }}</li>
                    </ul>
                </div>

                <!-- Settings Tab -->
                <div class="dashboardcontainer" v-if="activeTab === 'settings'">
                    <label for="PIN">Change Your PIN:</label>
                    <input type="text" v-model="PIN" placeholder="Enter New PIN">
                    <label for="sq1">Change Your Passphrase:</label>
                    <input type="text" v-model="sq1" placeholder="Enter New Passphrase">

                    <button @click="UpdateInfo">Reset</button>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, reactive } from 'vue';
    import axios from 'axios';
    import { jwtDecode } from "jwt-decode";
    import { useToast } from "vue-toastification";
    import { useRouter } from "vue-router";
    import { downloadCSVFromJSON } from '../exportCSV';

    const toast = useToast();
    const router = useRouter();

    const selectedDriverEmail = ref('');
    const displayedReportData = ref([]);

    const filterDate = reactive({
            start_date: "",
            end_date: ""
        });

    // State declarations
    const viewSubTab = ref('manageDrivers');
    const admins = ref([]);
    const drivers = ref([]);
    const sponsors = ref([]);
    const selectedStatus = ref('');
    const loadingSponsors = ref(false);
    const loadingApplications = ref(false);
    const driverApplications = ref([]);
    const selectedAppStatus = ref('open');
    const selectedSponsor = ref('');
    const organizations = ref([]);
    const showPointsDialog = ref(false);
    const selectedDriver = ref(null);
    const pointsChange = ref(0);
    const pointsChangeType = ref(0);
    const pointsChangeReason = ref('');
    const currentUserEmail = ref('');
    const activeTab = ref('profile');
    const tickets = ref([
        { title: 'Login Issue', status: 'Open' },
        { title: 'Payment Problem', status: 'Closed' },
        { title: 'Feature Request', status: 'Pending' }
    ]);
    const newEntry = ref({ type: 'sponsor' });
    const inbox = ref([
        'New message from Alice',
        'Reminder: Meeting at 3 PM',
        'Your order has been shipped'
    ]);
    const lastLogin = ref(new Date().toISOString());
    const activityLogs = ref([]);
    const loadingLogs = ref(true);
    const loadingUsers = ref(true);
    const sq1 = ref("");
    const PIN = ref("");

    //this will be overwitten on every backend call to hold the last result like a cache.
    //to overwrite this variable it will just be something like: lastFetchedData.value = response.data
    const lastFetchedData = ref([]);

    const downloadReport = () => {
        if (!lastFetchedData.value || lastFetchedData.value.length === 0) {
            toast.warning("No data available to export.");
            return;
        }

        downloadCSVFromJSON(lastFetchedData.value, 'export.csv');
        toast.success("CSV Downlaoded!");
    };

    // Conversion Rate API State
    const conversionRate = ref(100);
    const conversionInput = ref(100);

    const saveConversionRate = async () => {
    if (conversionInput.value <= 0) {
        toast.error("Conversion rate must be greater than 0");
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/conversion-rate`, {
        email: currentUserEmail.value,
        usd_to_points_rate: conversionInput.value
        });

        if (response.status === 200) {
        conversionRate.value = conversionInput.value;
        toast.success("Conversion rate saved successfully!");
        } else {
        toast.error("Unexpected response from server");
        }
    } catch (error) {
        console.error("Failed to save conversion rate:", error);
        toast.error("Error saving conversion rate");
    }
    };

    // iTunes Search related state
    const searchKeyword = ref('');
    const results = ref([]);
    const loading = ref(false);
    const searchError = ref(null);
    const userOrg = ref(null);

    // Initialize current sponsor with defaults
    const currentSponsor = ref({
        first_name: '',
        last_name: '',
        email: '',
        Organization: 'No organization',
        status: 1
    });

    // Initialize SponsorApp with defaults
    const SponsorApp = ref({
        email: '',
        first_name: '',
        last_name: '',
        password: 'Password123!',
        status: 1,
        Organization: 'No organization'
    });

    // Handle token and user email
    //const token = localStorage.getItem("token");
    //if (token) {
    //    try {
    //        const decoded = jwtDecode(token);
    //        currentUserEmail.value = decoded?.email || '';
    //        currentSponsor.value.email = currentUserEmail.value;
    //    } catch (e) {
    //        console.error("Token decode error:", e);
    //        logout();
    //    }
    //}

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

    currentUserEmail.value = email.value;;
    currentSponsor.value.email = email.value;

    // Computed properties
    const isPointsChangeValid = computed(() => {
        if (!selectedDriver.value) return false;
        return pointsChange.value !== 0 &&
            pointsChangeReason.value.trim() !== '' &&
            (selectedDriver.value.points_total + pointsChange.value) >= 0;
    });

    // Methods
    const setActiveTab = (tab) => {
        activeTab.value = tab;
    };

    const logout = () => {
        try {
            const token = localStorage.getItem("token");
            const currentEmail = localStorage.getItem("email");
            const currentRole = localStorage.getItem("userType");

            if (!token) {
                localStorage.clear();
                toast.success("Logged out!");
                router.push("/login_page");
                return;
            }

            const decoded = jwtDecode(token);
            const originalEmail = decoded.email;
            const originalRole = decoded.userType;

            if (currentEmail !== originalEmail || currentRole !== originalRole) {
                localStorage.setItem("email", originalEmail);
                localStorage.setItem("userType", originalRole);
                localStorage.setItem("imposter", 0);
                toast.info("Reverted to original user session");

                switch (originalRole) {
                    case "admin":
                        router.push("/admin");
                        break;
                    case "driver":
                        router.push("/driver");
                        break;
                    case "sponsor":
                        router.push("/sponsor");
                        break;
                    default:
                        router.push("/login_page");
                }
            } else {
                localStorage.clear();
                toast.success("Logged out!");
                router.push("/login_page");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            localStorage.clear();
            router.push("/login_page");
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const openPointsDialog = (driver) => {
        selectedDriver.value = driver;
        pointsChange.value = 0;
        pointsChangeReason.value = '';
        showPointsDialog.value = true;
        pointsChangeType.value = 2;
    };

    const closePointsDialog = () => {
        showPointsDialog.value = false;
    };

    const closeDropdowns = (event) => {
        if (!event.target.closest('.actions-dropdown')) {
            activeDropdown.value = null;
        }
    };

    const validatePointsChange = () => {
        if (selectedDriver.value && currentSponsor.value.Organization) {
            const currentPoints = selectedDriver.value.points_total;

            if (currentPoints + pointsChange.value < 0) {
                pointsChange.value = -currentPoints;
            }
        }
    };

    const submitPointsChange = async () => {
        if (!isPointsChangeValid.value) return;
        if (!selectedDriver.value?.email) {
            toast.error("No driver selected");
            return;
        }
        if (typeof pointsChange.value !== "number") {
            toast.error("Points change must be a number");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/drivers/${selectedDriver.value.email}/points`,
                {
                    sponsor_email: currentUserEmail.value,
                    points_change_reason: pointsChangeReason.value,
                    point_change_type: pointsChangeType.value,
                    points_change: pointsChange.value,
                    Organization: currentSponsor.value.Organization // Fixed spelling and access
                }
            );

            if (response.status === 201) {
                toast.success("Points updated successfully!");
                await fetchDrivers();
                closePointsDialog();
            }
        } catch (error) {
            console.error("Error updating points:", error);
            toast.error(error.response?.data?.error || "Failed to update points");
        }
    };

    const resetForm = () => {
        newEntry.value = { type: newEntry.value.type };
        SponsorApp.value = {
            ...SponsorApp.value, // Maintain organization
            email: '',
            first_name: '',
            last_name: '',
            status: 1
        };
    };

    const addUserOrOrg = async () => {
        if (newEntry.value.type === 'sponsor') {
            try {
                const sponsorData = {
                    email: SponsorApp.value.email,
                    first_name: SponsorApp.value.first_name,
                    last_name: SponsorApp.value.last_name,
                    password: SponsorApp.value.password,
                    status: SponsorApp.value.status,
                    Organization: currentSponsor.value.Organization
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/submit-SponsorApp`,
                    sponsorData,
                    { headers: { "Content-Type": "application/json" } }
                );

                if (response.status === 201) {
                    toast.success(response.data.message);
                    await fetchSponsors();
                } else {
                    toast.error("Sponsor created but with unexpected response");
                }
            } catch (error) {
                console.error("Error submitting SponsorApp:", error);
                if (error.response) {
                    if (error.response.status === 409) {
                        toast.error(`Conflict: ${error.response.data.error}`);
                    } else if (error.response.status === 400) {
                        toast.error(`Validation error: ${error.response.data.error}`);
                    } else {
                        toast.error("Submission failed. Try again.");
                    }
                } else {
                    toast.error("Network error. Please check your connection.");
                }
            }
        }
        resetForm();
    };

    const findCurrentSponsor = async () => {
        if (!currentUserEmail.value) {
            console.warn("No email provided for sponsor lookup");
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        currentUserEmail: currentUserEmail.value // Use the correct param name
                    }
                }
            );

            if (!response.data?.length) {
                console.warn("No sponsor found with email:", currentUserEmail.value);
                currentSponsor.value = {
                    first_name: 'Not',
                    last_name: 'Found',
                    email: currentUserEmail.value,
                    Organization: 'No organization found',
                    status: 'inactive'
                };
                return;
            }

            // Extract the first matching sponsor (if multiple exist)
            const sponsorData = response.data[0];

            currentSponsor.value = {
                first_name: sponsorData.first_name || 'Unknown',
                last_name: sponsorData.last_name || 'Sponsor',
                email: sponsorData.email,
                Organization: sponsorData.Organization || 'No organization specified',
                status: sponsorData.status || 'active' // Default to 'active' if missing
            };

            // Update related reactive values
            SponsorApp.value.Organization = currentSponsor.value.Organization;
            userOrg.value = currentSponsor.value.Organization;

        } catch (error) {
            console.error("Failed to fetch sponsor:", error);
            currentSponsor.value = {
                first_name: 'Error',
                last_name: 'Loading',
                email: currentUserEmail.value,
                Organization: 'Failed to load sponsor data',
                status: 'error'
            };
        }
    };

    const fetchSponsors = async () => {
        try {
            loadingSponsors.value = true;
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                { params: selectedStatus.value ? { status: selectedStatus.value } : {} }
            );

            // Filter by current organization
            allSponsors.value = [...new Set(response.data.map(sponsor => sponsor.Organization))];
            sponsors.value = response.data
                .filter(sponsor => sponsor.Organization === currentSponsor.value.Organization)
                .map(sponsor => ({
                    ...sponsor,
                    status: getStatusLabel(sponsor.status)
                }));

            lastFetchedData.value = sponsors.value;
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to fetch sponsors");
        } finally {
            loadingSponsors.value = false;
        }
    };

    const fetchDrivers = async () => {
        try {
            // First ensure we have the current organization
            if (!currentSponsor.value?.Organization) {
                throw new Error("Current organization not available");
            }

            const currentOrg = currentSponsor.value.Organization.trim();
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers`,
                {
                    params: selectedStatus.value ? { status: selectedStatus.value } : {}
                }
            );

            allDrivers.value = response.data;

            drivers.value = response.data.filter(driver => {
                if (!driver?.sponsor_list) return false;

                // Handle different sponsor_list formats:
                // Case 1: Comma-separated string ("Org1,Org2,Org3")
                if (typeof driver.sponsor_list === 'string') {
                    return driver.sponsor_list.split(',').map(org => org.trim()).includes(currentOrg);
                }
                // Case 2: Array of organizations (if JSON parsed)
                else if (Array.isArray(driver.sponsor_list)) {
                    return driver.sponsor_list.includes(currentOrg);
                }

                return false;
            });

            lastFetchedData.value = drivers.value;

        } catch (error) {
            console.error("Error fetching drivers:", error);
            toast.error(error.response?.data?.message || "Failed to fetch drivers");
        }
    };

    const updateDriverStatus = async (driver) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/status`,
                { status: driver.status }
            );
            toast.success(`Status updated to ${getStatusLabel(driver.status)}!`);
            await fetchDrivers();
        } catch (error) {
            console.error("Error updating driver status:", error);
            toast.error("Failed to update status");
        }
    };

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/organizations`
            );
            organizations.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching organizations:", error);
            toast.error("Failed to fetch organizations");
        }
    };

    const fetchSponsorApplications = async () => {
        if (!currentSponsor.value.Organization) {
            toast.error("No organization assigned");
            return;
        }
        try {
            loadingApplications.value = true;
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/submit-application`,
                {
                    params: {
                        sponsor: currentSponsor.value.Organization,
                        status: selectedAppStatus.value
                    }
                }
            );
            driverApplications.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to fetch applications");
        } finally {
            loadingApplications.value = false;
        }
    };

    const acceptApplication = async (id, email) => {
        if (!email) {
            toast.error("Driver email is missing");
            return;
        }
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/submit-application/${id}/accept`
            );
            toast.success("Application accepted");
            await fetchSponsorApplications();
        } catch (error) {
            console.error("Error accepting application:", error);
            toast.error("Failed to accept application");
        }
    };

    const denyApplication = async (id) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/submit-application/${id}/deny`
            );
            toast.success("Application denied");
            driverApplications.value = driverApplications.value.filter(app => app.id !== id);
        } catch (error) {
            console.error("Error denying application:", error);
            toast.error("Failed to deny application");
        }
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            1: "Current",
            2: "Suspended",
            3: "Deactivated"
        };
        return statusMap[status] || "Unknown";
    };

    const setViewSubTab = (tab) => {
        viewSubTab.value = tab;

        switch (tab) {
            case 'manageDrivers':
                fetchDrivers();
                break;
            case 'sponsorUsers':
                fetchSponsors();
                break;
            case 'driverApplications':
                fetchSponsorApplications();
                break;
            case 'pointHistory':
                fetchPointHistory();
                break;
        }
    };

    // iTunes Search Methods
    const searchFilters = async () => {
        if (!searchKeyword.value) return;

        loading.value = true;
        searchError.value = null;

        try {
            const baseUrl = "https://itunes.apple.com/search";
            const query = `term=${encodeURIComponent(searchKeyword.value)}&media=music&limit=20&country=US`;
            const url = `${baseUrl}?${query}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            results.value = data.results;
        } catch (err) {
            searchError.value = "Error fetching data";
        } finally {
            loading.value = false;
        }
    };

    const addFilter = async (keywordRef) => {
        const keyword = keywordRef.trim();
        if (!keyword) return toast.warning("Keyword is empty.");
        if (!userOrg.value) return toast.error("Organization not loaded.");

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/add-filter`, {
                keyword,
                orgId: userOrg.value,
            });

            toast.success(`Filter "${keyword}" added to ${userOrg.value}`);
        } catch (error) {
            console.error("Error adding filter:", error);
            toast.error("Failed to add filter.");
        }
    };

    const switchToDriverView = async (driver) => {
        if (!driver || !driver.email) {
            toast.error("Invalid driver information");
            return;
        }

        try {
            // Store current user info before switching
            if (!localStorage.getItem("originalEmail")) {
                localStorage.setItem("originalEmail", currentUserEmail.value);
                localStorage.setItem("originalUserType", "sponsor");
            }

            // Set driver info
            localStorage.setItem("email", driver.email);
            localStorage.setItem("userType", "driver");
            localStorage.setItem("imposter", "1");

            toast.success("Switching to Driver View...");
            router.push("/driver");
        } catch (error) {
            console.error("Error switching to driver view:", error);
            if (error.response?.status === 404) {
                toast.error("Driver account not found");
            } else {
                toast.error("Failed to switch to driver view");
            }
        }
    };

    //----------------------------------------------------------------------------------------------------

    const pointHistory = ref([]);
    const driverPointHistory = ref([]);
    const loadingPointHistory = ref(false);
    const loadingDriverPointHistory = ref(false);
    const showDriverPointHistoryDialog = ref(false);
    const selectedPointHistoryDriver = ref(null);
    const activeDropdown = ref(null);
    const selectedDriverFilter = ref('');
    const selectedSponsorFilter = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');

    const sortField = ref('timestamp');
    const sortOrder = ref('desc');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const allDrivers = ref([]);
    const allSponsors = ref([]);

    const toggleActionsDropdown = (driverEmail) => {
        if (activeDropdown.value === driverEmail) {
            activeDropdown.value = null;
        } else {
            activeDropdown.value = driverEmail;
        }
    };

    const fetchPointHistory = async () => {
        loadingPointHistory.value = true;
        try {
            //const sponsorsResponse = await axios.get(
            //    '${import.meta.env.VITE_API_URL}/api/sponsors',
            //    {
            //        params: {
            //            organization: currentSponsor.value.Organization
            //        }
            //    }
            //);

            //const sponsorEmails = sponsorsResponse.data.map(sponsor => sponsor.email);

            //if (sponsorEmails.length === 0) {
            //    toast.warning("No sponsors found for this organization");
            //    return;
            //}

            const params = {};

            if (selectedDriverFilter.value) params.driver_email = selectedDriverFilter.value;
            //if (selectedSponsorFilter.value) params.organization = currentSponsor.value.Organization;
            params.organization = currentSponsor.value.email;
            if (dateFrom.value) params.date_from = dateFrom.value;
            if (dateTo.value) params.date_to = dateTo.value;

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/driverInfoGet/phistory`,
                { params }
            );

            console.log("Point history response:", response.data); // Add this line to check the data

            lastFetchedData.value = response.data;

            pointHistory.value = response.data.map(entry => ({
                timestamp: entry.points_change_time,
                driver_email: entry.driver_email,
                organization: entry.sponsor_email,
                points_change: entry.points_change,
                reason: entry.points_change_reason
            }));

        } catch (error) {
            console.error('Error fetching point history:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    pointHistory.value = [];
                    toast.info(error.response.data.message || 'No point history found');
                } else {
                    toast.error(error.response.data.error || 'Failed to fetch point history');
                }
            } else {
                toast.error('Network error while fetching point history');
            }
        } finally {
            loadingPointHistory.value = false;
        }
    };

    const fetchPointHistoryForDriver = async (driver) => {
        try {
            // Set the driver before making the API call
            selectedPointHistoryDriver.value = driver;
            showDriverPointHistoryDialog.value = true;
            loadingDriverPointHistory.value = true;
            driverPointHistory.value = [];

            if (!driver.email || !currentSponsor.value.Organization) {
                toast.warning("Please select a sponsor for this driver first");
                return;
            }

            // First get the sponsor emails for this organization
            const sponsorsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        organization: currentSponsor.value.Organization
                    }
                }
            );

            const sponsorEmails = sponsorsResponse.data.map(sponsor => sponsor.email);

            if (sponsorEmails.length === 0) {
                toast.warning("No sponsors found for this organization");
                return;
            }

            // Now get point history for these sponsors
            const historyResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/phistory`,
                {
                    params: {
                        sponsors: sponsorEmails.join(',')
                    }
                }
            );

            lastFetchedData.value = historyResponse.data;

            driverPointHistory.value = historyResponse.data.map(entry => ({
                timestamp: entry.points_change_time,
                driver_email: entry.driver_email,
                organization: entry.sponsor_email,
                points_change: entry.points_change,
                reason: entry.points_change_reason
            }));
        } catch (error) {
            console.error("Error fetching point history:", error);
            toast.error("Failed to load point history");
        } finally {
            loadingDriverPointHistory.value = false;
        }
    };

    const closePointHistoryDialog = () => {
        showDriverPointHistoryDialog.value = false;
        selectedPointHistoryDriver.value = null;
    };

    const resetFilters = () => {
        selectedDriverFilter.value = '';
        selectedSponsorFilter.value = '';
        dateFrom.value = '';
        dateTo.value = '';
        currentPage.value = 1;
        fetchPointHistory();
    };

    const totalPages = computed(() => {
        return Math.ceil(pointHistory.value.length / itemsPerPage.value);
    });

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const totalPointsAdded = computed(() => {
        return pointHistory.value
            .filter(entry => entry.points_change > 0)
            .reduce((sum, entry) => sum + entry.points_change, 0);
    });

    const totalPointsDeducted = computed(() => {
        return pointHistory.value
            .filter(entry => entry.points_change < 0)
            .reduce((sum, entry) => sum + entry.points_change, 0);
    });

    const sortedPointHistory = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;

        return [...pointHistory.value]
            .sort((a, b) => {
                let comparison = 0;
                const fieldA = a[sortField.value];
                const fieldB = b[sortField.value];

                if (fieldA > fieldB) comparison = 1;
                else if (fieldA < fieldB) comparison = -1;

                return sortOrder.value === 'asc' ? comparison : -comparison;
            })
            .slice(start, end);
    });

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const sortPointHistory = (field) => {
        if (sortField.value === field) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortField.value = field;
            sortOrder.value = 'asc';
        }
    };

    const getDriverName = (email) => {
        const driver = allDrivers.value.find(d => d.email === email);
        return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
    };

    onMounted(() => {
        document.addEventListener('click', closeDropdowns);
    });

    // Initialization
    onMounted(async () => {
        try {
            // First get current sponsor info
            await findCurrentSponsor();

            // Then load organization-specific data
            await Promise.all([
                fetchSponsors(),       // Will filter by current org
                fetchDrivers(),        // Drivers might need org filtering too
                fetchSponsorApplications(), // Will use current org
                fetchPointHistory()
            ]);
        } catch (error) {
            console.error("Initialization error:", error);
            toast.error("Failed to initialize application");
        }
    });

    // Restore persisted conversion rate on load
    conversionRate.value = localStorage.getItem("usdToPointsRate") || 100;
        conversionInput.value = conversionRate.value;

    const showFullSponsorSalesSubtab = async () => {
            if (!currentSponsor.value?.Organization) {
                toast.error("Sponsor organization is not available.");
                return;
            }

            const orgName = currentSponsor.value.Organization;
            viewSubTab.value = 'fullSponsorReport';

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/all_orders_joined`);
                const allOrders = response.data;

                const start = filterDate.start_date ? new Date(filterDate.start_date) : null;
                const end = filterDate.end_date ? new Date(filterDate.end_date) : null;

                if ((start && !end) || (!start && end)) {
                toast.warning("Please select both a start and end date.");
                return;
                }

                const filtered = allOrders.filter(entry => {
                if (!entry.sponsor_list) return false;

                const matchesOrg = typeof entry.sponsor_list === 'string'
                    ? entry.sponsor_list.split(',').map(o => o.trim()).includes(orgName)
                    : Array.isArray(entry.sponsor_list) && entry.sponsor_list.includes(orgName);

                if (!matchesOrg) return false;

                if (start && end) {
                    const entryDate = new Date(entry.order_date);
                    entryDate.setHours(0, 0, 0, 0);

                    const startTime = new Date(start);
                    startTime.setHours(0, 0, 0, 0);

                    const endTime = new Date(end);
                    endTime.setHours(0, 0, 0, 0);

                    if (entryDate < startTime || entryDate > endTime) return false;
                }

                return true;
                });

                displayedReportData.value = filtered;
                lastFetchedData.value = filtered;

            } catch (err) {
                console.error("Error loading full sponsor report:", err);
                toast.error("Could not load full report.");
            }
        };

        const showDriverSalesSubtab = async (driverEmail) => {
            selectedDriverEmail.value = driverEmail;
            viewSubTab.value = 'driverSalesReport';

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/all_orders_joined`);
                const allOrders = response.data;

                const start = filterDate.start_date ? new Date(filterDate.start_date) : null;
                const end = filterDate.end_date ? new Date(filterDate.end_date) : null;

                if ((start && !end) || (!start && end)) {
                toast.warning("Please select both a start and end date.");
                return;
                }

                const filtered = allOrders.filter(entry => {
                if (entry.driver_email !== driverEmail) return false;

                if (start && end) {
                    const entryDate = new Date(entry.order_date);
                    entryDate.setHours(0, 0, 0, 0);

                    const startTime = new Date(start);
                    startTime.setHours(0, 0, 0, 0);

                    const endTime = new Date(end);
                    endTime.setHours(0, 0, 0, 0);

                    if (entryDate < startTime || entryDate > endTime) return false;
                }

                return true;
                });

                displayedReportData.value = filtered;
                lastFetchedData.value = filtered;

            } catch (err) {
                console.error("Error loading driver sales report:", err);
                toast.error("Could not load report.");
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
        /*        background-color: #2a2b36;
        color: white;*/
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

    .logs-and-users-container {
        display: flex;
        gap: 2rem;
    }

    .logs-container, .users-container {
        flex: 1;
        background: rgba(255, 255, 255, 0.075);
        border-radius: 4px;
        padding: 1em 1.5em;
        margin-bottom: 2em;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        color: white;
    }

    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #3d3e4a;
    }

    th {
        background-color: #1c1d26;
        color: white;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input, select, button, textarea {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #3d3e4a;
        background-color: #1c1d26;
        color: white;
    }

    button {
        background-color: #e44c65;
        color: white;
        cursor: pointer;
        border: none;
    }

    /* Filters styling */
    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1.5rem;
        align-items: flex-end;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        min-width: 200px;
    }

        .filter-group label {
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: white;
        }

        .filter-group input,
        .filter-group select {
            padding: 0.5rem;
            border: 1px solid #3d3e4a;
            border-radius: 4px;
            background-color: #1c1d26;
            color: white;
        }

    .reset-btn {
        padding: 0.5rem 1rem;
        background-color: #1c1d26;
        border: 1px solid #e44c65;
        border-radius: 4px;
        cursor: pointer;
        height: fit-content;
        color: white;
    }

        .reset-btn:hover {
            background-color: #2a2b36;
        }

    /* Point history table specific styling */
    .point-history-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

        .point-history-table th,
        .point-history-table td {
            padding: 0.75rem;
            border: 1px solid #3d3e4a;
            text-align: left;
        }

        .point-history-table th {
            background-color: #1c1d26;
            color: white;
            cursor: pointer;
        }

            .point-history-table th:hover {
                background-color: #2a2b36;
            }

    .positive {
        color: #4CAF50;
        font-weight: bold;
    }

    .negative {
        color: #F44336;
        font-weight: bold;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }

        .pagination button {
            padding: 0.5rem 1rem;
            background-color: #1c1d26;
            border: 1px solid #e44c65;
            border-radius: 4px;
            cursor: pointer;
            color: white;
        }

            .pagination button:hover:not(:disabled) {
                background-color: #2a2b36;
            }

            .pagination button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background-color: #1c1d26;
            }

    .summary-stats {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: rgba(255, 255, 255, 0.075);
        border-radius: 4px;
        color: white;
    }

    /* Actions dropdown styles */
    .actions-dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-toggle {
        background-color: #e44c65;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .dropdown-menu {
        position: absolute;
        right: 0;
        background-color: #2a2b36;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #3d3e4a;
    }

        .dropdown-menu button {
            color: white;
            background-color: #2a2b36;
            padding: 0.5rem 1rem;
            text-decoration: none;
            display: block;
            width: 100%;
            text-align: left;
            border: none;
            border-bottom: 1px solid #3d3e4a;
        }

            .dropdown-menu button:hover {
                background-color: #3d3e4a;
            }

    /* Modal styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(28, 29, 38, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #2a2b36;
        color: white;
        padding: 2rem;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid #e44c65;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: #ffffff;
        }

        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #3d3e4a;
            border-radius: 4px;
            background-color: #1c1d26;
            color: white;
        }

    .points-hint {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: #a1a1a1;
    }

    .modal-actions {
        margin-top: 2rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

        .modal-actions button {
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-weight: bold;
            transition: all 0.2s ease;
        }

    .cancel-btn {
        background-color: transparent;
        border: 1px solid #e44c65;
        color: #e44c65;
    }

        .cancel-btn:hover {
            background-color: rgba(228, 76, 101, 0.1);
        }

    .submit-btn {
        background-color: #e44c65;
        color: white;
        border: none;
    }

        .submit-btn:hover:not(:disabled) {
            background-color: #d43c5c;
        }

        .submit-btn:disabled {
            background-color: #3d3e4a;
            color: #6d6d6d;
            cursor: not-allowed;
        }

    select option:disabled {
        color: #999;
        font-style: italic;
    }

    .scroll-table-container {
        max-height: 400px; /* adjust as needed */
        overflow-y: auto;
        border: 1px solid #444;
        border-radius: 4px;
    }
    input[type="date"] {
        background-color: #4a4949; /* Ensure background is white /
        color: #f7f3f3; / Ensure text color is black */
        border: 1px solid #f10808;
        padding: 5px;
        font-size: 16px;
        width: 25%;
        justify-items: center;
    }
</style>