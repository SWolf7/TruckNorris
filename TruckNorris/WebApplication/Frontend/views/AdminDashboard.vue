<template>
    <div class="dashboard">
        <!-- Sidebar and Main Content Container -->
        <div class="content-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <nav>
                    <h1 style="text-align: left; text-decoration-line: none !important">Truck Norris<br /><br />Admin Dashboard</h1>
                    <ul>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'profile' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('profile')">
                                Profile
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'tickets' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('tickets')">
                                Tickets
                            </a>
                        </li>
                        <li>
                            <a :class="['button primary', { active: activeTab === 'addUserOrOrg' }]"
                               style="color: white !important; width: 260px !important; text-align: left !important"
                               @click="setActiveTab('addUserOrOrg')">
                                Add User or Org
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
                        <h2>{{ currentAdmin.first_name }} {{ currentAdmin.last_name }}</h2>
                        <p>
                            <!--Name: {{ currentAdmin.first_name }} {{ currentAdmin.last_name }} <br />-->
                            Email: {{ currentUserEmail }} <br />
                            Role: {{ currentAdmin.type }} <br />
                            Last Login: {{ formatDate(lastLogin) }}
                        </p>
                    </div>
                </div>

                <!-- Tickets Tab -->
                <div v-if="activeTab === 'tickets'">
                    <h2>Tickets</h2>
                    <p>Manage support tickets:</p>
                    <ul>
                        <li v-for="(ticket, index) in tickets" :key="index">
                            {{ ticket.title }} - {{ ticket.status }}
                        </li>
                    </ul>
                </div>

                <!-- Add User or Org Tab -->
                <div v-if="activeTab === 'addUserOrOrg'">
                    <div class="dashboardcontainer">
                        <h2>Add User or Org</h2>
                        <form @submit.prevent="addUserOrOrg">
                            <label for="type">Select Type:</label>
                            <select id="type" v-model="newEntry.type" required @change="resetForm">
                                <option value="admin">Admin</option>
                                <option value="driver">Driver</option>
                                <option value="sponsor">Sponsor</option>
                                <option value="organization">Organization</option>
                            </select>

                            <!-- Admin Fields -->
                            <div v-if="newEntry.type === 'admin'">
                                <label for="adminEmail">Admin Email:</label>
                                <input type="email" id="adminEmail" v-model="AdminApp.email" placeholder="Enter Admin Email" required />
                            </div>

                            <!-- Driver Fields -->
                            <div v-if="newEntry.type === 'driver'">
                                <label for="driverFirstName">First Name:</label>
                                <input type="text" id="driverFirstName" v-model="DriverApp.first_name" placeholder="Enter First Name" required />

                                <label for="driverLastName">Last Name:</label>
                                <input type="text" id="driverLastName" v-model="DriverApp.last_name" placeholder="Enter Last Name" required />

                                <label for="driverEmail">Driver Email:</label>
                                <input type="email" id="driverEmail" v-model="DriverApp.email" placeholder="Enter Driver Email" required />

                                <!--<label for="driverPointsTotal">Points Total:</label>
                                <input type="number" style="color: black !important" id="driverPointsTotal" v-model="DriverApp.points_total" placeholder="Enter Points Total" required />-->

                                <label for="driverStatusSelect">Status:</label>
                                <select id="driverStatusSelect" v-model="DriverApp.status" required>
                                    <option value="1">Current</option>
                                    <option value="2">Suspended</option>
                                    <option value="3">Deactivated</option>
                                </select>
                            </div>

                            <!-- Sponsor Fields -->
                            <div v-if="newEntry.type === 'sponsor'">
                                <label for="sponsorType">Sponsor Organization:</label>
                                <select id="sponsorType" v-model="SponsorApp.Organization" required>
                                    <option value="" disabled>Select a Sponsor Organization</option>
                                    <option v-for="type in sponsorTypes" :key="type.id" :value="type.name">
                                        {{ type.name }}
                                    </option>
                                </select>
                                <label for="sponsorEmail">Sponsor Email:</label>
                                <input type="email" id="sponsorEmail" v-model="SponsorApp.email" placeholder="Enter Sponsor Email" required />
                                <label for="sponsorFirstName">First Name:</label>
                                <input type="text" id="sponsorFirstName" v-model="SponsorApp.first_name" placeholder="Enter First Name" required />
                                <label for="sponsorLastName">Last Name:</label>
                                <input type="text" id="sponsorLastName" v-model="SponsorApp.last_name" placeholder="Enter Last Name" required />
                            </div>

                            <!-- Organization Fields -->
                            <div v-if="newEntry.type === 'organization'">
                                <label for="orgName">Organization Name:</label>
                                <input type="text" id="orgName" v-model="OrgApp.name" placeholder="Organization Name" required />
                                <label for="orgEmail">Contact Email:</label>
                                <input type="email" id="orgEmail" v-model="OrgApp.email" placeholder="Enter Organization Email" required />
                                <label for="orgType">Organization Type:</label>
                                <input type="text" id="orgType" v-model="OrgApp.type" placeholder="Enter Organization Type" required />
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
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'adminUsers' }]" @click="setViewSubTab('adminUsers')">See Admin Users</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'viewOrganization' }]" @click="setViewSubTab('viewOrganizations')">See Organizations</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'loginLog' }]" @click="setViewSubTab('loginLog')">View Login Log</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'pointHistory' }]" @click="setViewSubTab('pointHistory')">Point History</button>
                            <button style="margin-left: 20px" :class="['button primary', { active: viewSubTab === 'passwordLog' }]" @click="setViewSubTab('passwordLog')">View Password Log</button>
                            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                                <button @click="downloadReport">Download CSV</button>
                            </div>
                        </div>
                    </div>

                    <!-- Subtab Content -->
                    <div v-if="viewSubTab === 'manageDrivers'">
                        <div class="dashboardcontainer">
                            <h2>Driver List</h2>

                            <label for="status-filter">Filter by Status:</label>
                            <select id="status-filter" v-model="selectedStatus" @change="fetchDrivers">
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
                                        <th>Organization</th>
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
                                            <select v-if="driver.sponsors.length"
                                                    v-model="driver.selectedSponsor"
                                                    @change="onSponsorSelect(driver)">
                                                <option v-for="sponsor in driver.sponsors"
                                                        :key="sponsor"
                                                        :value="sponsor">
                                                    {{ sponsor }}
                                                </option>
                                            </select>
                                            <span v-else>No Sponsor</span>
                                        </td>
                                        <td>
                                            <div class="actions-dropdown">
                                                <button @click="toggleActionsDropdown(driver.email)" class="dropdown-toggle">
                                                    Actions
                                                </button>
                                                <div v-if="activeDropdown === driver.email" class="dropdown-menu">
                                                    <button @click="openPointsDialog(driver)">Change Points</button>
                                                    <button @click="switchToDriverView(driver)">View As</button>
                                                    <button @click="openAddSponsorDialog(driver)">Add Sponsor</button>
                                                    <button v-if="driver.sponsors.length > 0" @click="openRemoveSponsorDialog(driver)">
                                                        Remove Sponsor
                                                    </button>
                                                    <button @click="fetchPointHistoryForDriver(driver)">View Point History</button>
                                                    <button @click="showDriverSalesSubtab(driver.email)">View Sales Report</button>
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
                                    <p>Current Points: {{ selectedDriver.points_total }}</p>

                                    <div class="form-group">
                                        <label for="orgSelect">Organization:</label>
                                        <select id="orgSelect" v-model="selectedOrgForPoints" required>
                                            <option v-for="org in selectedDriver.sponsors" :key="org" :value="org">
                                                {{ org }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="pointsChangeInput">Points Adjustment:</label>
                                        <input type="number"
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

                            <div v-if="showAddSponsorDialog" class="modal-overlay">
                                <div class="modal-content">
                                    <h3>Add Sponsor to {{ selectedDriver.first_name }} {{ selectedDriver.last_name }}</h3>
                                    <p>Email: {{ selectedDriver.email }}</p>

                                    <div class="form-group">
                                        <label for="sponsorSelect">Select Sponsor:</label>
                                        <select id="sponsorSelect" v-model="selectedSponsorToAdd" required>
                                            <option value="" disabled>Select a Sponsor</option>
                                            <option v-for="sponsor in availableSponsors"
                                                    :key="sponsor"
                                                    :value="sponsor">
                                                {{ sponsor }} {{ selectedDriver.sponsors.includes(sponsor) ? '(Already assigned)' : '' }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="modal-actions">
                                        <button class="cancel-btn" @click="closeAddSponsorDialog">Cancel</button>
                                        <button class="submit-btn"
                                                @click="addSponsorToDriver">
                                            Add Sponsor
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="showRemoveSponsorDialog" class="modal-overlay">
                                <div class="modal-content">
                                    <h3>Remove Sponsor from {{ selectedDriver.first_name }} {{ selectedDriver.last_name }}</h3>
                                    <p>Email: {{ selectedDriver.email }}</p>

                                    <div class="form-group">
                                        <label for="removeSponsorSelect">Select Sponsor to Remove:</label>
                                        <select id="removeSponsorSelect" v-model="selectedSponsorToRemove" required>
                                            <option value="" disabled>Select a Sponsor</option>
                                            <option v-for="sponsor in selectedDriver.sponsors"
                                                    :key="sponsor"
                                                    :value="sponsor">
                                                {{ sponsor }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="modal-actions">
                                        <button class="cancel-btn" @click="closeRemoveSponsorDialog">Cancel</button>
                                        <button class="submit-btn"
                                                @click="removeSponsorFromDriver">
                                            Remove Sponsor
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Driver Point History Modal -->
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
                                <div class="filter-group">
                                    <label for="sponsor-filter">Filter by Sponsor:</label>
                                    <select id="sponsor-filter" v-model="selectedSponsorFilter" @change="fetchPointHistory">
                                        <option value="">All Sponsors</option>
                                        <option v-for="sponsor in allSponsors" :key="sponsor" :value="sponsor">
                                            {{ sponsor }}
                                        </option>
                                    </select>
                                </div>
                                <div class="filter-group">
                                    <label for="date-from">From:</label>
                                    <input type="date" id="date-from" v-model="dateFrom" @change="fetchPointHistory" />
                                </div>
                                <div class="filter-group">
                                    <label for="date-to">To:</label>
                                    <input type="date" id="date-to" v-model="dateTo" @change="fetchPointHistory" />
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

                    <div v-if="viewSubTab === 'sponsorUsers'">
                        <div class="dashboardcontainer">
                            <h2>Sponsor User List</h2>

                            <label for="sponsor-status-filter">Filter by Status:</label>
                            <select id="sponsor-status-filter" v-model="selectedStatus" @change="fetchSponsors">
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="spon_user in sponsors" :key="spon_user.email">
                                        <td>{{ spon_user.first_name }}</td>
                                        <td>{{ spon_user.last_name }}</td>
                                        <td>{{ spon_user.email }}</td>
                                        <td>{{ spon_user.type }}</td>
                                        <td>
                                            <select v-model="spon_user.status" @change="updateSponsorStatus(spon_user)">
                                                <option value="1">Current</option>
                                                <option value="2">Suspended</option>
                                                <option value="3">Deactivated</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button @click="switchToSponsorView(spon_user)">View As</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div v-if="viewSubTab === 'adminUsers'">
                        <div class="dashboardcontainer">
                            <h3>Admin Users</h3>

                            <label for="admin-status-filter">Filter by Status:</label>
                            <select id="admin-status-filter" v-model="selectedStatus" @change="fetchAdmins">
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
                                    <tr v-for="admin in admins" :key="admin.email">
                                        <td>{{ admin.first_name }}</td>
                                        <td>{{ admin.last_name }}</td>
                                        <td>{{ admin.email }}</td>
                                        <td>{{ admin.type }}</td>
                                        <td>
                                            <select v-model="admin.status" @change="updateAdminstatus(admin)">
                                                <option value="1">Current</option>
                                                <option value="2">Suspended</option>
                                                <option value="3">Deactivated</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div v-if="viewSubTab === 'loginLog'">
                        <div class="dashboardcontainer">
                            <h3>Login Log</h3>
                            <div v-if="loadingLoginLogs">Loading login logs...</div>
                            <div v-else>
                                <div class="scroll-table-container">
                                    <table v-if="loginLogs.length" class="login-logs-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Timestamp</th>
                                                <th>User Email</th>
                                                <th>Status:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(log, index) in loginLogs" :key="index">
                                                <td>{{ log.id }}</td>
                                                <td>{{ formatDateTime(log.login_time) }}</td>
                                                <td>{{ log.email }}</td>
                                                <td>{{ log.status }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Organization SubTab -->
                    <div v-if="viewSubTab === 'viewOrganizations'">
                        <div class="dashboardcontainer">
                            <h3>Organizations</h3>
                            <table v-if="loginLogs.length" class="login-logs-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(org, index) in organizations" :key="index">
                                        <td>{{ org.name }}</td>
                                        <td>{{ org.email }}</td>
                                        <td>
                                            <button class="button primary" @click="showOrgSalesSubtab(org.name)">Get Sales Report</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else>No login logs found.</p>
                        </div>
                    </div>


<!-- Org Sales Report View -->
                    <div v-if="viewSubTab === 'orgSalesReport'">
                        <h3>Sales Report for {{ selectedOrgName }}</h3>

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
                                <td>{{ formatDateTime(entry.order_date) }}</td>
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

                        <button class="button" style="margin-top: 15px" @click="setViewSubTab('viewOrganizations')">
                            ← Back to Organizations
                        </button>
                        </div>


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
                                <td>{{ formatDateTime(entry.order_date) }}</td>
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

                    <div v-if="viewSubTab === 'passwordLog'">
                        <div class="dashboardcontainer">
                            <h3>Login Log</h3>
                            <div v-if="loadingPasswordLog">Loading Password logs...</div>
                            <div v-else>
                                <div class="scroll-table-container">
                                    <table v-if="passwordLogs.length" class="login-logs-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Timestamp</th>
                                                <th>User Email</th>
                                                <th>Status:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(log, index) in passwordLogs" :key="index">
                                                <td>{{ log.id }}</td>
                                                <td>{{ formatDateTime(log.login_time) }}</td>
                                                <td>{{ log.email }}</td>
                                                <td>{{ log.result }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--<p v-else>No login logs found.</p>-->
                            </div>
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
                <div v-if="activeTab === 'settings'">
                    <div class="dashboardcontainer">
                        <h2>Settings</h2>
                        <p>Update your preferences here.</p>
                        <label for="PIN">Change Your PIN:</label>
                        <input type="text" v-model="PIN" placeholder="Enter New PIN">
                        <label for="sq1">Change Your Passphrase:</label>
                        <input type="text" v-model="sq1" placeholder="Enter New Passphrase">

                        <button @click="UpdateInfo">Reset</button>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, reactive } from 'vue';
    import axios from 'axios';
    import { useToast } from "vue-toastification";
    import { useRouter } from "vue-router";
    import { jwtDecode } from 'jwt-decode';
    import { downloadCSVFromJSON } from '../exportCSV';

    const toast = useToast();
    const router = useRouter();

    const viewSubTab = ref('manageDrivers');
    const admins = ref([]);
    const drivers = ref([]);
    const sponsors = ref([]);
    const selectedStatus = ref('');
    const loadingOrgs = ref(false);
    const loadingLoginLogs = ref(false);
    const loginLogs = ref([]);
    const activeDropdown = ref(null); // Track which dropdown is active

    const driverApplications = ref([]);
    const selectedAppStatus = ref('open');
    const selectedSponsor = ref('');
    const organizations = ref([]);

    // reactive state for settings update
    const sq1 = ref("");
    const PIN = ref("");
    const loadingPasswordLog = ref(false);
    const passwordLogs = ref([]);

    const filterDate = reactive({
        start_date: "",
        end_date: ""
    });


    const selectedDriverEmail = ref('');
    const selectedOrgName = ref('');
    const displayedReportData = ref([]);

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

    const showPointsDialog = ref(false);
    const selectedDriver = ref(null);
    const pointsChange = ref(0);
    const pointsChangeType = ref(0);
    const pointsChangeReason = ref('');
    const currentUserEmail = ref('');

    // Point History Related State
    const pointHistory = ref([]);
    const driverPointHistory = ref([]);
    const loadingPointHistory = ref(false);
    const loadingDriverPointHistory = ref(false);
    const showDriverPointHistoryDialog = ref(false);
    const selectedPointHistoryDriver = ref(null);
    const allDrivers = ref([]);
    const allSponsors = ref([]);

    // Filters
    const selectedDriverFilter = ref('');
    const selectedSponsorFilter = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');

    // Sorting
    const sortField = ref('timestamp');
    const sortOrder = ref('desc');

    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = ref(20);

    const currentAdmin = ref({
        first_name: '',
        last_name: '',
        email: '',
        type: 'Admin',
        status: 1
    });

    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            currentUserEmail.value = decoded?.email || '';
            currentAdmin.value.email = currentUserEmail.value;
        } catch (e) {
            console.error("Token decode error:", e);
            logout();
        }
    }

    // Computed Properties
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

    const totalPages = computed(() => {
        return Math.ceil(pointHistory.value.length / itemsPerPage.value);
    });

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

    const isPointsChangeValid = computed(() => {
        if (!selectedDriver.value || !selectedOrgForPoints.value) return false;
        return pointsChange.value !== 0 &&
            pointsChangeReason.value.trim() !== '' &&
            (selectedDriver.value.points_total + pointsChange.value) >= 0;
    });

    const activeTab = ref('profile');
    const tickets = ref([
        { title: 'Login Issue', status: 'Open' },
        { title: 'Payment Problem', status: 'Closed' },
        { title: 'Feature Request', status: 'Pending' },
    ]);

    const newEntry = ref({
        type: 'sponsor',
    });

    const AdminApp = ref({
        email: '',
    });

    const DriverApp = ref({
        first_name: '',
        last_name: '',
        email: '',
        status: 1,
    });

    const SponsorApp = ref({
        Organization: '',
        email: '',
        first_name: '',
        last_name: '',
        status: 1,
    });

    const OrgApp = ref({
        name: '',
        email: '',
        type: '',
    });

    const inbox = ref([
        'New message from Alice',
        'Reminder: Meeting at 3 PM',
        'Your order has been shipped',
    ]);

    const lastLogin = ref(new Date().toISOString());
    const activityLogs = ref([]);
    const loadingLogs = ref(true);
    const users = ref([]);
    const loadingUsers = ref(true);

    const sponsorTypes = ref([]);

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
    };

    const fetchSponsorTypes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
            sponsorTypes.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching sponsor types:", error);
            toast.error("Failed to fetch sponsor types");
        }
    };

    const resetForm = () => {
        newEntry.value = {
            type: newEntry.value.type,
        };
        AdminApp.value = {
            email: ''
        };
        DriverApp.value = {
            first_name: '',
            last_name: '',
            email: '',
            status: 1,
        };
        SponsorApp.value = {
            Organization: '',
            email: '',
            first_name: '',
            last_name: '',
            status: 1,
        };
        OrgApp.value = {
            name: '',
            email: '',
            type: '',
        };
    };

    const addUserOrOrg = async () => {
        try {
            let response;
            const defaultPassword = 'Password123!';

            switch (newEntry.value.type) {
                case 'admin':
                    response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/submit-AdminApp`,
                        {
                            ...AdminApp.value,
                            password: defaultPassword
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    break;
                case 'driver':
                    response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/submit-DriverApp`,
                        {
                            ...DriverApp.value,
                            password: defaultPassword
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    break;
                case 'sponsor':
                    response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/submit-SponsorApp`,
                        {
                            ...SponsorApp.value,
                            status: SponsorApp.value.status || 1,
                            password: defaultPassword
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    break;
                case 'organization':
                    response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/submit-OrgApp`,
                        { ...OrgApp.value },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    break;
                default:
                    throw new Error("Invalid user type");
            }

            toast.success(response.data.message || "User created successfully!");
            resetForm();
        } catch (error) {
            console.error(`Error submitting ${newEntry.value.type} data:`, error);
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
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

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


    const setViewSubTab = (tab) => {
        viewSubTab.value = tab;

        switch (tab) {
            case 'manageDrivers':
                fetchDrivers();
                break;
            case 'sponsorUsers':
                fetchSponsors();
                break;
            case 'adminUsers':
                fetchAdmins();
                break;
            case 'loginLog':
                fetchLoginLogs();
                break;
            case 'pointHistory':
                fetchPointHistory();
                break;
            case 'passwordLog':
                fetchPasswordLogs();
                break;
        }
    };

    const fetchPasswordLogs = async (email, startDate, endDate) => {
        loadingLoginLogs.value = true;

        try {
            let url = '${import.meta.env.VITE_API_URL}/passwordLog';
            const params = new URLSearchParams();

            if (email) params.append('email', email);
            if (startDate && endDate) {
                params.append('startDate', startDate);
                params.append('endDate', endDate);
            }

            if ([...params].length > 0) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            passwordLogs.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error('Error fetching password logs:', error);
            toast.error('Failed to fetch password logs');
        } finally {
            loadingLoginLogs.value = false;
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admins`, {
                params: selectedStatus.value ? { status: selectedStatus.value } : {}
            });
            admins.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching admins:", error);
            toast.error("Failed to fetch admins");
        }
    };

    const updateAdminstatus = async (admin) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/admins/${admin.email}/status`, {
                status: admin.status
            });
            toast.success(`Status updated to ${getStatusLabel(admin.status)}!`);
            await fetchAdmins();
        } catch (error) {
            console.error("Error updating admin status:", error);
            toast.error("Failed to update status");
        }
    };

    const updateDriverStatus = async (driver) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/status`, {
                status: driver.status
            });
            toast.success(`Status updated to ${getStatusLabel(driver.status)}!`);
            await fetchDrivers();
        } catch (error) {
            console.error("Error updating driver status:", error);
            toast.error("Failed to update status");
        }
    };

    const fetchSponsors = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sponsors`, {
                params: selectedStatus.value ? { status: selectedStatus.value } : {}
            });
            sponsors.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to fetch sponsors");
        }
    };

    const fetchOrganizations = async () => {
        loadingOrgs.value = true;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
            organizations.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error("Error fetching organizations:", error);
            toast.error("Failed to fetch organizations");
        } finally {
            loadingOrgs.value = false;
        }
    };

    const fetchLoginLogs = async () => {
        loadingLoginLogs.value = true;
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/login-logs`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            loginLogs.value = response.data;
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error('Error fetching login logs:', error);
            toast.error('Failed to fetch login logs');
        } finally {
            loadingLoginLogs.value = false;
        }
    };

    const updateSponsorStatus = async (spon_user) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/sponsors/${spon_user.email}/status`, {
                status: spon_user.status
            });
            toast.success(`Status updated to ${getStatusLabel(spon_user.status)}!`);
            await fetchSponsors();
        } catch (error) {
            console.error("Error updating Sponsor status:", error);
            toast.error("Failed to update status");
        }
    };

    const findCurrentAdmin = async () => {
        if (!currentUserEmail.value) {
            toast.error("No email found - please login again");
            logout();
            return;
        }

        try {
            await fetchAdmins();

            const currentAdminData = admins.value.find(
                admin => admin.email === currentUserEmail.value
            );

            if (currentAdminData) {
                currentAdmin.value = {
                    first_name: currentAdminData.first_name || '',
                    last_name: currentAdminData.last_name || '',
                    email: currentAdminData.email,
                    type: 'Admin',
                    status: currentAdminData.status || 1
                };
            } else {
                toast.warning("No admin profile found for your email");
                currentAdmin.value = {
                    first_name: 'New',
                    last_name: 'Admin',
                    email: currentUserEmail.value,
                    type: 'Admin',
                    status: 1
                };
            }
        } catch (error) {
            console.error("Error finding admin:", error);
            toast.error("Failed to load admin profile");
            currentAdmin.value = {
                first_name: 'Error',
                last_name: 'Loading',
                email: currentUserEmail.value,
                type: 'Admin',
                status: 1
            };

            if (error.response?.status === 401) {
                logout();
            }
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

    const switchToDriverView = (driver) => {
        if (!driver || !driver.email) return;

        localStorage.setItem("email", driver.email);
        localStorage.setItem("userType", "driver");
        localStorage.setItem("imposter", 1);

        toast.success("Switched to Driver View!");
        router.push("/driver");
    };

    const switchToSponsorView = (spon_user) => {
        if (!spon_user || !spon_user.email) return;

        localStorage.setItem("email", spon_user.email);
        localStorage.setItem("userType", "sponsor");
        localStorage.setItem("imposter", 1);

        toast.success("Switched to Sponsor View!");
        router.push("/sponsor");
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`, {
                params: selectedStatus.value ? { status: selectedStatus.value } : {}
            });

            lastFetchedData.value = response.data;

            drivers.value = await Promise.all(
                response.data.map(async (driver) => {
                    const sponsorsArray = (driver.sponsor_list || '')
                        .split(',')
                        .map(sponsor => sponsor.trim())
                        .filter(sponsor => sponsor.length > 0);

                    let points = 0;
                    let selectedSponsor = sponsorsArray.length > 0 ? sponsorsArray[0] : '';

                    if (selectedSponsor) {
                        try {
                            const pointsResponse = await axios.get(
                                `${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/points`,
                                {
                                    params: {
                                        organization: selectedSponsor
                                    }
                                }
                            );
                            points = pointsResponse.data?.points || 0;
                        } catch (error) {
                            console.error(`Error fetching points for ${driver.email}:`, error);
                            points = 0;
                        }
                    }

                    return {
                        ...driver,
                        sponsors: sponsorsArray,
                        selectedSponsor: selectedSponsor,
                        points_total: points,
                        sponsor_list: driver.sponsor_list || ''
                    };
                })
            );

            // Update allDrivers for point history filters
            allDrivers.value = drivers.value;

        } catch (error) {
            console.error("Error fetching drivers:", error);
            toast.error("Failed to fetch drivers");
        }
    };

    const onSponsorSelect = async (driver) => {
        try {
            if (!driver?.email || !driver.selectedSponsor) {
                console.error("Invalid driver or sponsor selection");
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers/${driver.email}/points`,
                {
                    params: {
                        organization: driver.selectedSponsor
                    }
                }
            );

            lastFetchedData.value = response.data;

            const driverIndex = drivers.value.findIndex(d => d.email === driver.email);
            if (driverIndex !== -1) {
                drivers.value[driverIndex].points_total = response.data?.points || 0;
            }

            toast.success(`Points updated to ${driver.points_total} for ${driver.selectedSponsor}`);
        } catch (error) {
            console.error("Error updating sponsor and points:", error);
            toast.error(error.response?.data?.error || "Failed to update sponsor and points");
            if (driver) driver.points_total = 0;
        }
    };

    const selectedOrgForPoints = ref('');

    const showAddSponsorDialog = ref(false);
    const selectedSponsorToAdd = ref('');
    const availableSponsors = ref([]);

    const openAddSponsorDialog = async (driver) => {
        selectedDriver.value = driver;
        activeDropdown.value = null; // Close dropdown

        try {
            // Fetch all available sponsors (organizations)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
            availableSponsors.value = response.data.map(org => org.name);
            

            selectedSponsorToAdd.value = '';
            showAddSponsorDialog.value = true;
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to fetch available sponsors");
        }
    };

    const closeAddSponsorDialog = () => {
        showAddSponsorDialog.value = false;
        selectedSponsorToAdd.value = '';
    };

    const addSponsorToDriver = async () => {
        if (!selectedDriver.value || !selectedSponsorToAdd.value) return;

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/drivers/${selectedDriver.value.email}/add-sponsor`,
                { sponsor: selectedSponsorToAdd.value }
            );

            toast.success(response.data.message || "Sponsor added successfully!");
            await fetchDrivers(); // Refresh the driver list
            closeAddSponsorDialog();
        } catch (error) {
            console.error("Error adding sponsor:", error);
            toast.error(error.response?.data?.error || "Failed to add sponsor");
        }
    };

    const showRemoveSponsorDialog = ref(false);
    const selectedSponsorToRemove = ref('');

    const openRemoveSponsorDialog = (driver) => {
        selectedDriver.value = driver;
        selectedSponsorToRemove.value = '';
        showRemoveSponsorDialog.value = true;
        activeDropdown.value = null; // Close dropdown
    };

    const closeRemoveSponsorDialog = () => {
        showRemoveSponsorDialog.value = false;
        selectedSponsorToRemove.value = '';
    };

    const removeSponsorFromDriver = async () => {
        if (!selectedDriver.value || !selectedSponsorToRemove.value) return;

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/drivers/${selectedDriver.value.email}/remove-sponsor`,
                { sponsor: selectedSponsorToRemove.value }
            );

            toast.success(response.data.message || "Sponsor removed successfully!");
            await fetchDrivers(); // Refresh the driver list
            closeRemoveSponsorDialog();
        } catch (error) {
            console.error("Error removing sponsor:", error);
            toast.error(error.response?.data?.error || "Failed to remove sponsor");
        }
    };

    const openPointsDialog = (driver) => {
        selectedDriver.value = driver;
        pointsChange.value = 0;
        pointsChangeReason.value = '';
        selectedOrgForPoints.value = driver.sponsors.length > 0 ? driver.sponsors[0] : '';
        showPointsDialog.value = true;
        pointsChangeType.value = 1;
        activeDropdown.value = null; // Close dropdown when opening points dialog
    };

    const closePointsDialog = () => {
        showPointsDialog.value = false;
    };

    const toggleActionsDropdown = (driverEmail) => {
        if (activeDropdown.value === driverEmail) {
            activeDropdown.value = null;
        } else {
            activeDropdown.value = driverEmail;
        }
    };

    // Close dropdown when clicking outside
    const closeDropdowns = (event) => {
        if (!event.target.closest('.actions-dropdown')) {
            activeDropdown.value = null;
        }
    };

    const validatePointsChange = () => {
        if (selectedDriver.value && selectedOrgForPoints.value) {
            const currentPoints = selectedDriver.value.points_total;

            if (currentPoints + pointsChange.value < 0) {
                pointsChange.value = -currentPoints;
            }
        }
    };

    const submitPointsChange = async () => {
        if (!isPointsChangeValid.value || !selectedOrgForPoints.value) return;
        if (!selectedDriver.value?.email) {
            toast.error("No driver selected");
            return;
        }

        try {
            const pointsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/drivers/${selectedDriver.value.email}/points`,
                {
                    params: {
                        organization: selectedOrgForPoints.value
                    }
                }
            );

            const currentPoints = pointsResponse.data?.points || 0;

            if (currentPoints + pointsChange.value < 0) {
                toast.error(`Cannot reduce points below 0 for ${selectedOrgForPoints.value}`);
                return;
            }

            const sponsorsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        organization: selectedOrgForPoints.value
                    }
                }
            );

            if (!sponsorsResponse.data || sponsorsResponse.data.length === 0) {
                throw new Error("No sponsor found for selected organization");
            }

            const sponsor = sponsorsResponse.data[0];
            const sponsorEmail = sponsor?.email;

            if (!sponsorEmail) {
                throw new Error("Sponsor email not found");
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/drivers/${selectedDriver.value.email}/points`,
                {
                    sponsor_email: sponsorEmail,
                    points_change_reason: pointsChangeReason.value,
                    point_change_type: pointsChangeType.value,
                    points_change: pointsChange.value,
                    organization: selectedOrgForPoints.value
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

    const UpdateInfo = async () => {
        const email = localStorage.getItem("email");

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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin_update`, payload);

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

    // Point History Methods
    const fetchPointHistory = async () => {
        loadingPointHistory.value = true;
        try {
            const params = {};

            if (selectedDriverFilter.value) params.driver_email = selectedDriverFilter.value;
            if (selectedSponsorFilter.value) params.organization = selectedSponsorFilter.value;
            if (dateFrom.value) params.date_from = dateFrom.value;
            if (dateTo.value) params.date_to = dateTo.value;

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/driverInfoGet/phistory`,
                { params }
            );

            lastFetchedData.value = response.data;
            pointHistory.value = response.data.map(entry => ({
                timestamp: entry.points_change_time,
                driver_email: entry.driver_email,
                organization: entry.sponsor_email,
                points_change: entry.points_change,
                reason: entry.reason
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

            if (!driver.email || !driver.selectedSponsor) {
                toast.warning("Please select a sponsor for this driver first");
                return;
            }

            // First get the sponsor emails for this organization
            const sponsorsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/sponsors`,
                {
                    params: {
                        organization: driver.selectedSponsor
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
                reason: entry.reason
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

    const fetchAllSponsors = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/organizations`);
            allSponsors.value = response.data.map(org => org.name);
            lastFetchedData.value = response.data;
        } catch (error) {
            console.error('Error fetching sponsors:', error);
        }
    };

    const getDriverName = (email) => {
        const driver = allDrivers.value.find(d => d.email === email);
        return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
    };

    const sortPointHistory = (field) => {
        if (sortField.value === field) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortField.value = field;
            sortOrder.value = 'asc';
        }
    };

    const resetFilters = () => {
        selectedDriverFilter.value = '';
        selectedSponsorFilter.value = '';
        dateFrom.value = '';
        dateTo.value = '';
        currentPage.value = 1;
        fetchPointHistory();
    };

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

    onMounted(() => {
        document.addEventListener('click', closeDropdowns);
    });

    onMounted(async () => {
        try {
            await findCurrentAdmin();

            await Promise.all([
                fetchDrivers(),
                fetchSponsors(),
                fetchOrganizations(),
                fetchLoginLogs(),
                fetchSponsorTypes(),
                fetchAllSponsors(),

            ]);

            fetchPointHistory();

        } catch (error) {
            console.error("Initialization error:", error);
            toast.error("Failed to load application data");
            if (error.response?.status === 401) {
                router.push('/login');
            }
        }
    });

    const showOrgSalesSubtab = async (orgName) => {
            selectedOrgName.value = orgName;
            viewSubTab.value = 'orgSalesReport';

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
                console.error("Error loading org sales report:", err);
                toast.error("Could not load report.");
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

        const getDriverEmailsForOrg = async (orgName, status = null) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`,{
                    params: status ? { status } : {}
                }
                );

                const driverEmails = response.data
                .filter(driver => {
                    if (!driver?.sponsor_list) return false;

                    if (typeof driver.sponsor_list === 'string') {
                    return driver.sponsor_list
                        .split(',')
                        .map(org => org.trim())
                        .includes(orgName);
                    } else if (Array.isArray(driver.sponsor_list)) {
                    return driver.sponsor_list.includes(orgName);
                    }
                    return false;
                })
                .map(driver => driver.email);

                return driverEmails;
            } catch (error) {
                console.error("Error filtering driver emails by org:", error);
                toast.error("Could not get drivers for organization");
                return [];
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