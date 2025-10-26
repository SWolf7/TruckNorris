require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express(); 
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//CORS 
app.use(cors({
    origin:
        [
            // dev
            'http://192.168.1.193:3001', // WebApp Frontend
            'http://192.168.1.193:3002', // MobileApp Frontend

            // prod
            'https://trucknorris.wolfystudios.net', // WebApp Frontend
            'https://trucknorris-mobile.wolfystudios.net' // MobileApp Frontend
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//for parsing JSON bodies
app.use(bodyParser.json());

//Database Connection Setup
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 20, // this can be modfiied to fit our needs if the limit is too small
    queueLimit: 0
});

console.log('Using MySQL connection pool');

//About us page API
app.get('/api/about', (req, res) => {
    db.query('SELECT * FROM about', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


app.patch('/api/submit-application/:id/close', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing application ID." });
    }

    const sql = "UPDATE DriverApplications SET closed = TRUE WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error closing application:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Application not found." });
        }
        res.json({ message: `Application ${id} marked as closed.` });
    });
});


//API Route for Driver Applications Submission
app.post('/api/submit-application', (req, res) => {
    const { sponsor, first_name, last_name, email, years_driving, date_of_birth, message } = req.body;

    // Validate input
    if (!sponsor || !first_name || !last_name || !email || !years_driving || !date_of_birth) {
        return res.status(400).json({ error: "All fields except 'message' are required." });
    }

    // SQL Query to insert application data into the database
    const sql = `
    INSERT INTO DriverApplications (sponsor, first_name, last_name, email, years_driving, date_of_birth, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(sql, [sponsor, first_name, last_name, email, years_driving, date_of_birth, message], (err, result) => {
        if (err) {
            console.error("Error inserting application:", err);
            return res.status(500).json({ error: "Failed to save application" });
        }
        res.json({ message: "Application submitted successfully!", id: result.insertId });
    });
});

//API for Adding (Whitelisting) Admins
app.post('/api/submit-AdminApp', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Hash the password with bcrypt before storing
    const saltRounds = 10; // Adjust as needed (higher = more secure but slower)
    const adminHashedPassword = await bcrypt.hash(password, saltRounds);

    // First check if email exists in Driver table
    const checkDriverSql = `SELECT email FROM Driver WHERE email = ?`;
    db.query(checkDriverSql, [email], (err, driverResults) => {
        if (err) {
            console.error("Error checking Driver table:", err);
            return res.status(500).json({ error: "Database error checking Driver table" });
        }

        if (driverResults.length > 0) {
            return res.status(400).json({ error: "Email already exists in Driver table" });
        }

        // If not in Driver, check Sponsor table
        const checkSponsorSql = `SELECT email FROM Sponsor WHERE email = ?`;
        db.query(checkSponsorSql, [email], (err, sponsorResults) => {
            if (err) {
                console.error("Error checking Sponsor table:", err);
                return res.status(500).json({ error: "Database error checking Sponsor table" });
            }

            if (sponsorResults.length > 0) {
                return res.status(400).json({ error: "Email already exists in Sponsor table" });
            }

            // If email doesn't exist in either table, proceed with insertion
            const insertAdminSql = `INSERT INTO Admin (email, password) VALUES (?, ?)`;
            db.query(insertAdminSql, [email, adminHashedPassword], (err, result) => {
                if (err) {
                    console.error("Error inserting Admin Application:", err);
                    return res.status(500).json({
                        error: "Failed to send application",
                        details: err.sqlMessage || err
                    });
                }
                res.json({
                    message: "Admin Application POST successful!",
                    id: result.insertId
                });
            });
        });
    });
});

//API for adding Organizations
app.post('/api/submit-OrgApp', (req, res) => {
    const { name, email, type } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Missing Required Fields!." });
    }

    const sql = `
    INSERT INTO Organization (NAME, EMAIL, TYPE)
    VALUES (?, ?, ?)
  `;

    db.query(sql, [name, email, type], (err, result) => {
        if (err) {
            console.error("Error inserting Organization Application:", err.sqlMessage || err);
            return res.status(500).json({ error: "Failed to send application", details: err.sqlMessage || err });
        }
        res.json({ message: "Organization Added!", id: result.insertId });
    });
});

// API to get conversion rate by organization name
app.get('/Conversion-Rates', (req, res) => {
    const orgName = req.params.name;

    const query = `
        SELECT organization_name, usd_to_points_rate, updated_at
        FROM ConversionRates`;

    db.query(query, [orgName], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({
                message: 'Error fetching conversion rate',
                error: error.message
            }); 
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(results);
    });
});


//API to get the login logs from the DB
app.get('/api/login-logs', (req, res) => {
    db.query('SELECT * FROM LoginLogs ORDER BY id DESC', (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching login logs', error: error.message });
        }
        res.json(results);
    });
});

//API to get the current Drivers with a filter of the status field
app.get('/api/drivers', (req, res) => {
    const { status } = req.query; // Get optional status filter

    let sql = `SELECT date_of_birth, email, first_name, last_name, message, points_total, sponsor_list, status, years_driving FROM Driver`;

    if (status) {
        sql += ` WHERE status = ?`;
    }

    db.query(sql, status ? [status] : [], (err, results) => {
        if (err) {
            console.error("Error fetching drivers:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

app.get("/mobile/userRole", (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const tables = ["Driver", "Sponsor", "Admin"];

  const findUserInTable = (index) => {
    if (index >= tables.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const table = tables[index];
    const sql = `SELECT email FROM ${table} WHERE email = ? LIMIT 1`;

    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("Error fetching user role:", err.sqlMessage || err);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length > 0) {
        // User found: table name is the role
        return res.json({ role: table, table });
      } else {
        // Not found in this table, check next
        findUserInTable(index + 1);
      }
    });
  };

  findUserInTable(0); // Start with first table
});


//API to patch drivers status and change it
app.patch('/api/drivers/:email/status', (req, res) => {
    const { email } = req.params;
    const { status } = req.body;

    if (![1, 2, 3].includes(parseInt(status))) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    const sql = `UPDATE Driver SET status = ? WHERE email = ?`;

    db.query(sql, [status, email], (err, result) => {
        if (err) {
            console.error("Error updating driver status:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Driver not found." });
        }
        res.json({ message: `Driver status updated to ${status}.` });
    });
});



//API to patch sponsor users status and change it
app.patch('/api/sponsors/:email/status', (req, res) => {
    const { email } = req.params;
    const { status } = req.body;

    if (![1, 2, 3].includes(parseInt(status))) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    const sql = `UPDATE Sponsor SET status = ? WHERE email = ?`;

    db.query(sql, [status, email], (err, result) => {
        if (err) {
            console.error("Error updating sponsor user status:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "sponsor user not found." });
        }
        res.json({ message: `sponsor user status updated to ${status}.` });
    });
});

//API to get the current Admins with a filter of the status field
app.get('/api/admins', (req, res) => {
    const { status } = req.query; // Get optional status filter

    let sql = `SELECT email, first_name, last_name, status FROM Admin`;

    if (status) {
        sql += ` WHERE status = ?`;
    }

    db.query(sql, status ? [status] : [], (err, results) => {
        if (err) {
            console.error("Error fetching Admins:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

//API to patch Admins status and change it
app.patch('/api/admins/:email/status', (req, res) => {
    const { email } = req.params;
    const { status } = req.body;

    if (![1, 2, 3].includes(parseInt(status))) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    const sql = `UPDATE Admin SET status = ? WHERE email = ?`;

    db.query(sql, [status, email], (err, result) => {
        if (err) {
            console.error("Error updating Admin status:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin user not found." });
        }
        res.json({ message: `sponsor user status updated to ${status}.` });
    });
});

//API to accept application and send message to aplicants inbox
app.patch('/api/submit-application/:id/accept', (req, res) => {
    const { id } = req.params;

    // Step 1: Retrieve the driver's email and sponsor from DriverApplications
    const getEmailQuery = "SELECT email, sponsor FROM DriverApplications WHERE id = ?";

    db.query(getEmailQuery, [id], (err, result) => {
        if (err) {
            console.error("Error retrieving application:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Application not found." });
        }

        const driverEmail = result[0].email;
        const sponsor = result[0].sponsor;

        // Step 2: Retrieve the sponsor's email from the Sponsor table
        const getSponsorEmailQuery = "SELECT email FROM Organization WHERE name = ?";

        db.query(getSponsorEmailQuery, [sponsor], (err, sponsorResult) => {
            if (err) {
                console.error("Error retrieving sponsor email:", err);
                return res.status(500).json({ error: "Database query failed" });
            }
            if (sponsorResult.length === 0) {
                return res.status(404).json({ error: "Sponsor not found." });
            }

            const sponsorEmail = sponsorResult[0].email;

            // Step 3: Accept and close the application
            const updateAppQuery = "UPDATE DriverApplications SET status = '2', closed = TRUE WHERE id = ?";

            db.query(updateAppQuery, [id], (err, updateResult) => {
                if (err) {
                    console.error("Error updating application status:", err);
                    return res.status(500).json({ error: "Database update failed" });
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({ error: "Application update failed." });
                }

                // Step 4: Fetch current sponsor list from Driver
                const getSponsorListQuery = "SELECT sponsor_list FROM Driver WHERE email = ?";

                db.query(getSponsorListQuery, [driverEmail], (err, driverResult) => {
                    if (err) {
                        console.error("Error retrieving driver sponsor list:", err);
                        return res.status(500).json({ error: "Failed to retrieve sponsor list" });
                    }

                    let sponsorList = driverResult[0]?.sponsor_list ? driverResult[0].sponsor_list.split(',') : [];

                    if (!sponsorList.includes(sponsor)) {
                        sponsorList.push(sponsor);
                    }

                    // Step 5: Update sponsor_list in Driver table
                    const updateDriverQuery = "UPDATE Driver SET sponsor_list = ? WHERE email = ?";
                    db.query(updateDriverQuery, [sponsorList.join(','), driverEmail], (err, driverUpdateResult) => {
                        if (err) {
                            console.error("Error updating driver sponsor list:", err);
                            return res.status(500).json({ error: "Failed to update sponsor list" });
                        }

                        // Step 6: Insert an inbox message for the driver
                        const message = `You have been accepted into: ${sponsor}`;
                        const insertInboxQuery = "INSERT INTO Inbox (date_time, target_email, sender_email, message) VALUES (NOW(), ?, ?, ?)";

                        db.query(insertInboxQuery, [driverEmail, sponsorEmail, message], (inboxErr) => {
                            if (inboxErr) {
                                console.error("Error inserting inbox message:", inboxErr);
                                return res.status(500).json({ error: "Failed to send notification." });
                            }

                            res.json({
                                message: `Application ${id} accepted, driver ${driverEmail} added to sponsor ${sponsor}. Inbox notification sent.`
                            });
                        });
                    });
                });
            });
        });
    });
});

// API to deny an application and notify the driver via inbox
app.patch('/api/submit-application/:id/deny', (req, res) => {
    const { id } = req.params;

    // Step 1: Retrieve the driver's email and sponsor from DriverApplications
    const getEmailQuery = "SELECT email, sponsor FROM DriverApplications WHERE id = ?";

    db.query(getEmailQuery, [id], (err, result) => {
        if (err) {
            console.error("Error retrieving application:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Application not found." });
        }

        const driverEmail = result[0].email;
        const sponsor = result[0].sponsor;

        // Step 2: Retrieve the sponsor's email from the Sponsor table
        const getSponsorEmailQuery = "SELECT email FROM Organization WHERE name = ?";

        db.query(getSponsorEmailQuery, [sponsor], (err, sponsorResult) => {
            if (err) {
                console.error("Error retrieving sponsor email:", err);
                return res.status(500).json({ error: "Database query failed" });
            }
            if (sponsorResult.length === 0) {
                return res.status(404).json({ error: "Sponsor not found." });
            }

            const sponsorEmail = sponsorResult[0].email;

            // Step 3: Deny and close the application
            const updateAppQuery = "UPDATE DriverApplications SET status = 'denied', closed = TRUE WHERE id = ?";

            db.query(updateAppQuery, [id], (err, updateResult) => {
                if (err) {
                    console.error("Error updating application status:", err);
                    return res.status(500).json({ error: "Database update failed" });
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({ error: "Application update failed." });
                }

                // Step 4: Insert an inbox message for the driver
                const message = `Your application to ${sponsor} has been denied.`;
                const insertInboxQuery = "INSERT INTO Inbox (date_time, target_email, sender_email, message) VALUES (NOW(), ?, ?, ?)";

                db.query(insertInboxQuery, [driverEmail, sponsorEmail, message], (inboxErr) => {
                    if (inboxErr) {
                        console.error("Error inserting inbox message:", inboxErr);
                        return res.status(500).json({ error: "Failed to send notification." });
                    }

                    res.json({
                        message: `Application ${id} has been denied and closed. Inbox notification sent to ${driverEmail}.`
                    });
                });
            });
        });
    });
});

//Removes a sponsor from the Drivers sponsors
app.patch('/api/drivers/:email/remove-sponsor', (req, res) => {
    const { email } = req.params;
    const { sponsor } = req.body;

    if (!sponsor) {
        return res.status(400).json({ error: "Sponsor name is required." });
    }

    // Step 1: Fetch the current sponsor list
    const getSponsorListQuery = "SELECT sponsor_list FROM Driver WHERE email = ?";

    db.query(getSponsorListQuery, [email], (err, results) => {
        if (err) {
            console.error("Error retrieving sponsor list:", err);
            return res.status(500).json({ error: "Failed to retrieve sponsor list." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Driver not found." });
        }

        let sponsorList = results[0].sponsor_list ? results[0].sponsor_list.split(',') : [];

        // Step 2: Check if the sponsor exists and remove it
        if (!sponsorList.includes(sponsor)) {
            return res.status(400).json({ error: "Sponsor not found in the driver's list." });
        }

        sponsorList = sponsorList.filter(org => org !== sponsor);
        const updatedSponsorList = sponsorList.join(',');

        // Step 3: Update the driver’s sponsor list
        const updateDriverQuery = "UPDATE Driver SET sponsor_list = ? WHERE email = ?";

        db.query(updateDriverQuery, [updatedSponsorList, email], (err, updateResult) => {
            if (err) {
                console.error("Error updating sponsor list:", err);
                return res.status(500).json({ error: "Failed to update sponsor list." });
            }

            // Step 4: Insert an inbox message notifying the driver
            const message = `You have been removed from: ${sponsor}`;
            const insertInboxQuery = "INSERT INTO Inbox (date_time, target_email, sender_email, message) VALUES (NOW(), ?, 'admin@fleet.com', ?)";

            db.query(insertInboxQuery, [email, message], (inboxErr) => {
                if (inboxErr) {
                    console.error("Error inserting inbox message:", inboxErr);
                    return res.status(500).json({ error: "Failed to send notification." });
                }

                res.json({
                    message: `Driver ${email} removed from ${sponsor}. Inbox notification sent.`,
                    updatedSponsorList
                });
            });
        });
    });
});

app.patch('/api/drivers/:email/add-sponsor', (req, res) => {
    const { email } = req.params;
    const { sponsor } = req.body;

    if (!sponsor) {
        return res.status(400).json({ error: "Sponsor name is required." });
    }

    // Step 1: Fetch the current sponsor list
    const getSponsorListQuery = "SELECT sponsor_list FROM Driver WHERE email = ?";

    db.query(getSponsorListQuery, [email], (err, results) => {
        if (err) {
            console.error("Error retrieving sponsor list:", err);
            return res.status(500).json({ error: "Failed to retrieve sponsor list." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Driver not found." });
        }

        let sponsorList = results[0].sponsor_list ? results[0].sponsor_list.split(',') : [];

        // Step 2: Check if the sponsor already exists
        if (sponsorList.includes(sponsor)) {
            return res.status(400).json({ error: "Sponsor already assigned to the driver." });
        }

        sponsorList.push(sponsor);
        const updatedSponsorList = sponsorList.join(',');

        // Step 3: Update the driver’s sponsor list
        const updateDriverQuery = "UPDATE Driver SET sponsor_list = ? WHERE email = ?";

        db.query(updateDriverQuery, [updatedSponsorList, email], (err, updateResult) => {
            if (err) {
                console.error("Error updating sponsor list:", err);
                return res.status(500).json({ error: "Failed to update sponsor list." });
            }

            // Step 4: Insert an inbox message notifying the driver
            const message = `You have been added to: ${sponsor}`;
            const insertInboxQuery = "INSERT INTO Inbox (date_time, target_email, sender_email, message) VALUES (NOW(), ?, 'admin@fleet.com', ?)";

            db.query(insertInboxQuery, [email, message], (inboxErr) => {
                if (inboxErr) {
                    console.error("Error inserting inbox message:", inboxErr);
                    return res.status(500).json({ error: "Failed to send notification." });
                }

                res.json({
                    message: `Driver ${email} added to ${sponsor}. Inbox notification sent.`,
                    updatedSponsorList
                });
            });
        });
    });
});

//fetch all inbox for a certain email
app.get('/api/inbox/:email', (req, res) => {
    const { email } = req.params;

    const sql = "SELECT date_time, sender_email, message FROM Inbox WHERE target_email = ? ORDER BY date_time DESC";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error fetching inbox messages:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

// Fetch all organizations (sponsors)
app.get('/api/organizations', (req, res) => {
    const sql = "SELECT * FROM Organization"; // Ensure correct table name

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching organizations:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

app.get('/api/driverInfoGet/:email', (req, res) => {
    const { email } = req.params; // Extract email from the URL parameter

    if (!email) {
        return res.status(400).json({ error: "Missing user email." }); // Validate email
    }

    const sql = "SELECT * FROM Driver WHERE email = ?"; // Correct SQL query
    db.query(sql, [email], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message }); // Handle database errors
            return;
        }
        res.json(results); // Return query results
    });
});

//API Route for Admins adding Sponsor Users
app.post('/api/sponsor/add', async (req, res) => {
    const { email, password, first_name, last_name, Organization } = req.body;

    // Validate input
    if (!email || !first_name || !last_name || !password || !Organization) {
        return res.status(400).json({ error: "All fields except 'message' are required." });
    }

    const saltRounds = 10; // Adjust as needed (higher = more secure but slower)
    const sponsorHashedPassword = await bcrypt.hash(password, saltRounds);

    // SQL Query to insert application data into the database
    const sql = `
    INSERT INTO Sponsor (email, first_name, last_name, Organization, password)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [email, first_name, last_name, Organization, sponsorHashedPassword], (err, result) => {
        if (err) {
            console.error("Error Adding Sponsor User:", err);
            return res.status(500).json({ error: "Failed to save User" });
        }
        res.json({ message: "Sponsor Added succesfully", id: result.insertId });
    });
});

// API endpoint to get user info from MySQL
app.post("/getUserByLogin", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            "SELECT email FROM LoginLogs WHERE user_id = ? ORDER BY login_time DESC LIMIT 1",
            [user_id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user: { user_id, email: rows[0].email }, status: "success" });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//API Route for Creating a Driver Account from Sign-In
app.post('/loginCreate', async (req, res) => {
    const { email, first_name, last_name, password, date_of_birth, message, years_driving } = req.body;

    // Hash the password with bcrypt before storing
    const saltRounds = 10; // Adjust as needed (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Validate input
    if (!email || !first_name || !last_name || !date_of_birth || !years_driving || !hashedPassword) {
        return res.status(400).json({ error: "All fields except 'message' are required." });
    }

    // SQL Query to insert application data into the database
    const sql = `
    INSERT INTO Driver (email, password, first_name, last_name, date_of_birth, years_driving, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(sql, [email, hashedPassword, first_name, last_name, date_of_birth, years_driving, message], (err, result) => {
        if (err) {
            console.error("Error inserting Account:", err);
            return res.status(500).json({ error: "Failed to Create the Account" });
        }
        res.json({ message: "Account Created Succesfully!", id: result.insertId });
    });
});

// API Route to verify Login attempts.
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    let userType = null;
    let user = null;

    // Search in Driver table
    db.query("SELECT * FROM Driver WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (results.length > 0) {
            userType = "driver";
            user = results[0];
            return verifyPassword(user, userType, res, password);
        }

        // Search in Sponsor table
        db.query("SELECT * FROM Sponsor WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Database Query Error:", err);
                return res.status(500).json({ error: "Database error occurred." });
            }

            if (results.length > 0) {
                userType = "sponsor";
                user = results[0];
                return verifyPassword(user, userType, res, password);
            }

            // Search in Admin table
            db.query("SELECT * FROM Admin WHERE email = ?", [email], (err, results) => {
                if (err) {
                    console.error("Database Query Error:", err);
                    return res.status(500).json({ error: "Database error occurred." });
                }

                if (results.length > 0) {
                    userType = "admin";
                    user = results[0];
                    return verifyPassword(user, userType, res, password);
                }

                // If no user is found in any table, send a failed login log and return no user found.
                const status = "FAILED";

                const sql = `INSERT INTO LoginLogs (email, status)
                VALUES (?, ?)`;

                db.query(sql, [email, status], (err, results) => {
                    if (err) {
                        console.error("Error inserting into LoginLogs", err);
                    }
                    console.log("Login Log POSTed as FAILED");
                });
                return res.status(404).json({ error: "User not found." });
            });
        });
    });
});

// Helper function to verify password and send response
const verifyPassword = async (user, userType, res, password) => {
    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const status = "FAILED";

            const sql = `INSERT INTO LoginLogs (email, status)
                VALUES (?, ?)`;

            db.query(sql, [user.email, status], (err, results) => {
                if (err) {
                    console.error("Error inserting into LoginLogs", err);
                }
                console.log("Login Log POSTed as FAILED");
            });
            return res.status(401).json({ error: "Invalid email or password." });
        }
 
        // Generate JWT Token
        const token = jwt.sign(
            { email: user.email, userType },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated Token:", token);

        console.log(`Login successful: ${user.email} (User Type: ${userType})`);

        const status = "SUCCESS";

        const sql = `INSERT INTO LoginLogs (email, status)
        VALUES (?, ?)`;

        db.query(sql, [user.email, status], (err, results) => {
            if (err) {
                console.error("Error inserting into LoginLogs", err);
                return res.status(500).json({ error: "Database error" });
            }
            console.log("Login Log POSTed SUCCESSFULLY");
        });

        // Store token in localStorage (Handled on the frontend)
        res.json({ token, userType });

    } catch (error) {
        console.error("Password Verification Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};


// GET /api/get-sponsor-org?email=sponsor@email.com
app.get("/api/get-sponsor-org", (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const sql = "SELECT Organization FROM Sponsor WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error fetching sponsor organization:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Sponsor not found" });
        }

        res.json({ organization: results[0].Organization });
    });
});


app.post("/api/add-filter", (req, res) => {
    const { keyword, orgId } = req.body; // orgId is the org name

    const selectSql = "SELECT filters FROM Organization WHERE name = ?";
    db.query(selectSql, [orgId], (err, results) => {
        if (err) {
            console.error("Error fetching org filters:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Organization not found" });
        }

        let filters = results[0].filters?.split(",") || [];

        if (!filters.includes(keyword)) {
            filters.push(keyword);
            const updatedFilters = filters.join(",");

            const updateSql = "UPDATE Organization SET filters = ? WHERE name = ?";
            db.query(updateSql, [updatedFilters, orgId], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating filters:", updateErr);
                    return res.status(500).json({ error: "Update failed" });
                }

                res.json({ success: true });
            });
        } else {
            res.json({ success: true, message: "Keyword already exists" });
        }
    });
});

// GET /api/org-filters?name=Acme Fleet
app.get("/api/org-filters", (req, res) => {
    const { name } = req.query;

    const sql = "SELECT filters FROM Organization WHERE name = ?";
    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error("Error getting filters:", err);
            return res.status(500).json({ error: "DB error" });
        }

        if (!results.length) {
            return res.status(404).json({ error: "Organization not found" });
        }

        const filterString = results[0].filters || "";
        const filterArray = filterString.split(",").map(f => f.trim()).filter(Boolean);

        res.json({ filters: filterArray });
    });
});

app.get('/api/inbox/:email/received', (req, res) => {
    const { email } = req.params;

    const sql = "SELECT id, date_time, sender_email, message FROM Inbox WHERE target_email = ? ORDER BY date_time DESC";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error fetching inbox messages:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

//Fetch inbox for sent messages based on email
app.get('/api/inbox/:email/sent', (req, res) => {
    const { email } = req.params;

    const sql = "SELECT id, date_time, target_email, message FROM Inbox WHERE sender_email = ? ORDER BY date_time DESC";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error fetching inbox messages:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

// API to delete a message from the Inbox
app.delete('/api/inbox/:id/delete', (req, res) => {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM Inbox WHERE id = ?";

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error("Error deleting message:", err);
            return res.status(500).json({ error: "Failed to delete message." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Message not found." });
        }

        res.json({ message: `Message ${id} successfully deleted.` });
    });
});

//API to send a message to another user (unrestricted)
app.post('/api/inbox', (req, res) => {
    const { target_email, sender_email, message } = req.body;

    const insertQuery = `
    INSERT INTO Inbox (date_time, target_email, sender_email, message)
    VALUES (NOW(), ?, ?, ?)
  `;

    db.query(insertQuery, [target_email, sender_email, message], (err, result) => {
        if (err) {
            console.error("Error inserting message:", err);
            return res.status(500).json({ error: "Failed to send message." });
        }

        res.json({ message: "Message sent successfully." });
    });
});

//app.patch('/api/drivers/:email/message', (req, res) => {
//    const { email } = req.params;
//    const { message } = req.body;

//    //// Validate the message exists and isn't empty
//    //if (!message || typeof message !== 'string' || message.trim() === '') {
//    //    return res.status(400).json({ error: "Message is required and cannot be empty" });
//    //}

//    const sql = `UPDATE Driver SET message = ? WHERE email = ?`;

//    db.query(sql, [message, email], (err, result) => {
//        if (err) {
//            console.error("Error updating driver message:", err);
//            return res.status(500).json({ error: "Database update failed" });
//        }
//        if (result.affectedRows === 0) {
//            return res.status(404).json({ error: "Driver not found." });
//        }
//        res.json({ message: "Driver message updated successfully." });
//    });
//});

app.get('/api/submit-application', (req, res) => {
    const { status, sponsor } = req.query;

    let sql = "SELECT * FROM DriverApplications WHERE sponsor = ?";
    const params = [sponsor];

    if (status === 'open') {
        sql += " AND closed = FALSE";
    } else if (status === 'closed') {
        sql += " AND closed = TRUE";
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching driver applications:", err);
            return res.status(500).json({
                error: "Database query failed",
                details: err.message
            });
        }
        res.json(results);
    });
});

app.post('/api/submit-SponsorApp', (req, res) => {
    // Extract fields from request body with default status = 1
    const { email, first_name, last_name, password = 'Password123!', status = 1, Organization } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["email", "first_name", "last_name", "password"]
        });
    }

    // First check Admin table
    const checkAdminSql = `SELECT email FROM Admin WHERE email = ?`;
    db.query(checkAdminSql, [email], (err, adminResults) => {
        if (err) {
            console.error("Admin table check error:", err);
            return res.status(500).json({
                error: "Database error checking Admin records",
                details: err.sqlMessage
            });
        }

        if (adminResults.length > 0) {
            return res.status(409).json({
                error: "Email already registered as Admin"
            });
        }

        // Then check Driver table
        const checkDriverSql = `SELECT email FROM Driver WHERE email = ?`;
        db.query(checkDriverSql, [email], (err, driverResults) => {
            if (err) {
                console.error("Driver table check error:", err);
                return res.status(500).json({
                    error: "Database error checking Driver records",
                    details: err.sqlMessage
                });
            }

            if (driverResults.length > 0) {
                return res.status(409).json({
                    error: "Email already registered as Driver"
                });
            }

            // Then check Sponsor table
            const checkSponsorSql = `SELECT email FROM Sponsor WHERE email = ?`;
            db.query(checkSponsorSql, [email], (err, sponsorResults) => {
                if (err) {
                    console.error("Sponsor table check error:", err);
                    return res.status(500).json({
                        error: "Database error checking Sponsor records",
                        details: err.sqlMessage
                    });
                }

                if (sponsorResults.length > 0) {
                    return res.status(409).json({
                        error: "Email already registered as Sponsor"
                    });
                }

                // If Organization is provided, verify it exists
                if (Organization) {
                    const checkOrgSql = `SELECT name FROM Organization WHERE name = ?`;
                    db.query(checkOrgSql, [Organization], (err, orgResults) => {
                        if (err) {
                            console.error("Organization check error:", err);
                            return res.status(500).json({
                                error: "Database error checking Organization",
                                details: err.sqlMessage
                            });
                        }

                        if (orgResults.length === 0) {
                            return res.status(404).json({
                                error: "Specified Organization not found"
                            });
                        }

                        createSponsor();
                    });
                } else {
                    createSponsor();
                }

                function createSponsor() {
                    // Hash the password before storing
                    bcrypt.hash(password, 10, (err, hashedPassword) => {
                        if (err) {
                            return res.status(500).json({
                                error: "Failed to hash password",
                                details: err.message
                            });
                        }

                        // Insert new Sponsor
                        const insertSponsorSql = `
              INSERT INTO Sponsor (email, first_name, last_name, password, status, Organization)
              VALUES (?, ?, ?, ?, ?, ?)
            `;

                        db.query(
                            insertSponsorSql,
                            [email, first_name, last_name, hashedPassword, status, Organization || null],
                            (err, result) => {
                                if (err) {
                                    console.error("Sponsor creation error:", err);
                                    return res.status(500).json({
                                        error: "Failed to create Sponsor account",
                                        details: err.sqlMessage
                                    });
                                }

                                res.status(201).json({
                                    message: Organization
                                        ? "Sponsor account created with organization successfully"
                                        : "Sponsor account created successfully",
                                    sponsorId: result.insertId,
                                    status: status,
                                    Organization: Organization || null
                                });
                            }
                        );
                    });
                }
            });
        });
    });
});

//-------------------------------------------------------------------------------------------------------------------
app.patch('/api/drivers/:email/message', (req, res) => {
    const { email } = req.params;
    let { first_name, last_name, date_of_birth, years_driving, message } = req.body;

    // Validate the email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: 0,
            message: "Invalid email format"
        });
    }

    // Prepare the update fields
    const updates = [];
    const values = [];

    if (first_name !== undefined) {
        if (typeof first_name !== 'string' || first_name.trim() === '') {
            return res.status(400).json({ success: 0, message: "First name cannot be empty" });
        }
        updates.push("first_name = ?");
        values.push(first_name.trim());
    }

    if (last_name !== undefined) {
        if (typeof last_name !== 'string' || last_name.trim() === '') {
            return res.status(400).json({ success: 0, message: "Last name cannot be empty" });
        }
        updates.push("last_name = ?");
        values.push(last_name.trim());
    }

    if (date_of_birth !== undefined) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth) || isNaN(new Date(date_of_birth).getTime())) {
            return res.status(400).json({ success: 0, message: "Invalid date format. Use YYYY-MM-DD" });
        }
        updates.push("date_of_birth = ?");
        values.push(date_of_birth);
    }

    if (years_driving !== undefined) {
        const parsedYears = parseInt(years_driving, 10);
        if (isNaN(parsedYears) || parsedYears < 0) {
            return res.status(400).json({ success: 0, message: "Years driving must be a non-negative integer" });
        }
        updates.push("years_driving = ?");
        values.push(parsedYears);
    }

    if (message !== undefined) {
        const cleanedMessage = String(message).trim();
        if (cleanedMessage === "") {
            return res.status(400).json({ success: 0, message: "Message cannot be empty" });
        }
        updates.push("message = ?");
        values.push(cleanedMessage);
    }

    // Ensure there's at least one field to update
    if (updates.length === 0) {
        return res.status(400).json({
            success: 0,
            message: "At least one field must be provided for update"
        });
    }

    values.push(email); // Add email for the WHERE clause
    const sql = `UPDATE Driver SET ${updates.join(", ")} WHERE email = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating driver profile:", err);
            return res.status(500).json({
                success: 0,
                message: "Database update failed"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: 0,
                message: "Driver not found"
            });
        }

        // Fetch updated data to return the exact changes
        db.query("SELECT first_name, last_name, date_of_birth, years_driving, message FROM Driver WHERE email = ?", [email], (err, updatedDriver) => {
            if (err) {
                console.error("Error fetching updated driver profile:", err);
                return res.status(500).json({ success: 0, message: "Failed to retrieve updated data" });
            }

            res.json({
                success: 1,
                message: "Driver profile updated successfully",
                updatedFields: updatedDriver[0]
            });
        });
    });
});

app.get('/api/shipping-address/:email', (req, res) => {
    const { email } = req.params;
    const sanitizedEmail = email?.toString().toLowerCase().trim() || '';

    db.query(
        'SELECT email, streetname, state, zipcode FROM ShippingAddress WHERE email = ?',
        [sanitizedEmail],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: 'Shipping address not found',
                    details: 'No address found for the provided email'
                });
            }

            res.json(results[0]);
        }
    );
});

app.patch('/api/shipping-address/:email', (req, res) => {
    const { email } = req.params;
    const { streetname, state, zipcode } = req.body;

    // Sanitization
    const sanitizedEmail = email?.toString().toLowerCase().trim() || '';
    const sanitizedStreetname = streetname?.toString().trim() || '';
    const sanitizedState = state?.toString().toUpperCase().trim() || '';
    const sanitizedZip = zipcode?.toString().trim() || '';

    // Build dynamic update
    const updates = [];
    const values = [];

    if (streetname !== undefined) {
        updates.push('streetname = ?');
        values.push(sanitizedStreetname);
    }
    if (state !== undefined) {
        updates.push('state = ?');
        values.push(sanitizedState);
    }
    if (zipcode !== undefined) {
        updates.push('zipcode = ?');
        values.push(sanitizedZip);
    }

    if (updates.length === 0) {
        return res.status(400).json({
            error: 'No valid fields provided',
            solution: 'Provide at least one field to update'
        });
    }

    values.push(sanitizedEmail);

    // Execute update
    db.query(
        `UPDATE ShippingAddress SET ${updates.join(', ')} WHERE email = ?`,
        values,
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Address not found',
                    solution: 'Use POST to create new address'
                });
            }

            res.json({
                success: true,
                email: sanitizedEmail,
                updatedFields: updates.map(field => field.split(' ')[0])
            });
        }
    );
});

app.post('/api/shipping-address/:email/new', (req, res) => {
    const { email, streetname, state, zipcode } = req.body;

    // Sanitization
    const sanitizedEmail = email?.toString().toLowerCase().trim() || '';
    const sanitizedStreetname = streetname?.toString().trim() || '';
    const sanitizedState = state?.toString().toUpperCase().trim() || '';
    const sanitizedZip = zipcode?.toString().trim() || '';

    db.query(
        'INSERT INTO ShippingAddress (email, streetname, state, zipcode) VALUES (?, ?, ?, ?)',
        [sanitizedEmail, sanitizedStreetname, sanitizedState, sanitizedZip],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        error: 'Address already exists',
                        solution: 'Use PATCH to update instead'
                    });
                }
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({
                success: true,
                email: sanitizedEmail,
                zipcode: sanitizedZip
            });
        }
    );
});

app.post('/ticket', (req, res) => {
    const { email, userType, problem } = req.body;

    // Validate input
    if (!email || !userType || !problem) {
        return res.status(400).json({ error: "missing input fields!" });
    }

    // SQL Query to insert application data into the database
    const sql = `
    INSERT INTO Tickets (user, type, body)
    VALUES (?, ?, ?)
  `;

    db.query(sql, [email, userType, problem], (err, result) => {
        if (err) {
            console.error("Error Submitting Help Ticket:", err);
            return res.status(500).json({ error: "Failed to Send the Help Ticket" });
        }
        res.json({ message: "Help Ticket Submitted!", id: result.insertId });
    });
});

app.get('/ticket', (req, res) => {
    const sql = `SELECT * FROM Tickets`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching tickets:", err);
            return res.status(500).json({ error: "Failed to retrieve tickets." });
        }

        res.json({ tickets: results });
    });
});


app.patch('/ticket/:id', (req, res) => {
    const ticketId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Missing 'status' field in request body." });
    }

    const sql = `
        UPDATE Tickets
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, ticketId], (err, result) => {
        if (err) {
            console.error("Error updating ticket status:", err);
            return res.status(500).json({ error: "Failed to update the ticket status." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ticket not found." });
        }

        res.json({ message: "Ticket status updated successfully!" });
    });
});

app.get('/api/driverInfo_get', (req, res) => {
    const { email, organization } = req.query;

    // Validate query parameters
    if (!email || !organization) {
        return res.status(400).json({
            error: "Missing required query parameters",
            required: ["email", "organization"]
        });
    }

    const sql = `
        SELECT points_total 
        FROM PointsPool 
        WHERE email = ? AND organization = ?
        LIMIT 1
    `;

    db.query(sql, [email, organization], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({
                error: "Failed to fetch PointsPool data",
                details: err.sqlMessage
            });
        }

        // No entry found
        if (results.length === 0) {
            return res.status(200).json([]);
        }

        // Return the row
        res.status(200).json(results);
    });
});


app.post('/api/drivers/:email/points', (req, res) => {
    const { sponsor_email, points_change_reason, point_change_type, points_change } = req.body;
    const driver_email = req.params.email;

    if (!driver_email || !sponsor_email || !points_change_reason ||
        !point_change_type || points_change === undefined) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["driver_email", "sponsor_email", "points_change_reason",
                "point_change_type", "points_change"]
        });
    }

    if (typeof points_change !== 'number') {
        return res.status(400).json({
            error: "points_change must be a number"
        });
    }

    // Step 1: Insert into PointChanges
    const insertSql = `
        INSERT INTO PointChanges 
            (driver_email, sponsor_email, points_change_reason, point_change_type, points_change)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        insertSql,
        [driver_email, sponsor_email, points_change_reason, point_change_type, points_change],
        (err, result) => {
            if (err) {
                console.error("Point Change error:", err);
                return res.status(500).json({
                    error: "Failed to record point change",
                    details: err.sqlMessage
                });
            }

            // Step 2: Find sponsor’s organization
            const orgSql = `SELECT organization FROM Sponsor WHERE email = ? LIMIT 1`;
            db.query(orgSql, [sponsor_email], (err, orgResult) => {
                if (err) {
                    console.error("Organization lookup error:", err);
                    return res.status(500).json({ error: "Failed to fetch organization" });
                }

                if (orgResult.length === 0) {
                    return res.status(404).json({
                        error: "Sponsor organization not found",
                        sponsor_email
                    });
                }

                const organization = orgResult[0].organization;

                // Step 3: Check if PointsPool entry exists
                const checkSql = `SELECT * FROM PointsPool WHERE email = ? AND organization = ? LIMIT 1`;
                db.query(checkSql, [driver_email, organization], (err, checkResult) => {
                    if (err) {
                        console.error("PointsPool lookup error:", err);
                        return res.status(500).json({ error: "Failed to check PointsPool" });
                    }

                    if (checkResult.length > 0) {
                        // Step 4a: Update existing row
                        const updateSql = `
                            UPDATE PointsPool 
                            SET points_total = points_total + ?
                            WHERE email = ? AND organization = ?
                        `;
                        db.query(updateSql, [points_change, driver_email, organization], (err, updateResult) => {
                            if (err) {
                                console.error("PointsPool update error:", err);
                                return res.status(500).json({ error: "Failed to update PointsPool" });
                            }

                            return res.status(201).json({
                                message: "Point change recorded and PointsPool updated successfully",
                                changeId: result.insertId,
                                organization
                            });
                        });
                    } else {
                        // Step 4b: Insert new row
                        const insertPoolSql = `
                            INSERT INTO PointsPool (email, organization, points_total)
                            VALUES (?, ?, ?)
                        `;
                        db.query(insertPoolSql, [driver_email, organization, points_change], (err, insertResult) => {
                            if (err) {
                                console.error("PointsPool insert error:", err);
                                return res.status(500).json({ error: "Failed to insert PointsPool" });
                            }

                            return res.status(201).json({
                                message: "Point change recorded and new PointsPool entry created",
                                changeId: result.insertId,
                                organization
                            });
                        });
                    }
                });
            });
        }
    );
});


app.get('/api/drivers/:email/points', async (req, res) => {
    try {
        const email = req.params.email; // Matches your table column name
        const { organization } = req.query;

        if (!organization) {
            return res.status(400).json({
                error: "Organization is required"
            });
        }

        const sql = `SELECT * FROM PointsPool 
                     WHERE email = ? AND organization = ?`;

        db.query(sql, [email, organization], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    error: "Failed to fetch points",
                    details: err.sqlMessage
                });
            }

            // Return 0 if no record found, otherwise return the points_total
            const points = results.length > 0 ? results[0].points_total : 0;

            res.status(200).json({
                points: points
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//API to get the current Sponsor users with a filter of the status field
app.get('/api/sponsors', (req, res) => {
    const { status, currentUserEmail, organization } = req.query; // Get optional filters

    // Base query
    let sql = `SELECT email, first_name, last_name, status, Organization FROM Sponsor`;
    let params = [];

    // Apply filters
    if (status && currentUserEmail) {
        // If both status and email are provided, filter by both
        sql += ` WHERE status = ? AND email = ?`;
        params = [status, currentUserEmail];
    } else if (status) {
        // Filter only by status
        sql += ` WHERE status = ?`;
        params = [status];
    } else if (currentUserEmail) {
        // Filter only by email
        sql += ` WHERE email = ?`;
        params = [currentUserEmail];
    }
    else if (organization) {
        sql += status ? ` AND Organization = ?` : ` WHERE Organization = ?`;
        params.push(organization);
    }


    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
                error: "Failed to fetch sponsors",
                details: err.sqlMessage
            });
        }

        res.status(200).json(results);
    });
});

app.post('/driver_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Driver SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Driver not found." });
        }

        return res.status(200).json({ success: 1, message: "Driver info updated successfully." });
    });
});

app.post('/sponsor_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Sponsor SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Sponsor not found." });
        }

        return res.status(200).json({ success: 1, message: "Sponsor info updated successfully." });
    });
});

app.post('/admin_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Admin SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Admin not found." });
        }

        return res.status(200).json({ success: 1, message: "Admin info updated successfully." });
    });
});


app.post('/driver_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Driver SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Driver not found." });
        }

        return res.status(200).json({ success: 1, message: "Driver info updated successfully." });
    });
});

app.post('/sponsor_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Sponsor SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Sponsor not found." });
        }

        return res.status(200).json({ success: 1, message: "Sponsor info updated successfully." });
    });
});

app.post('/admin_update', (req, res) => {
    const { email, sq1, PIN } = req.body;

    if (!email) {
        return res.status(400).json({ success: 0, message: "Email is required." });
    }

    // Build the dynamic query
    const updates = [];
    const values = [];

    if (sq1 !== undefined) {
        updates.push("sq1 = ?");
        values.push(sq1);
    }

    if (PIN !== undefined) {
        updates.push("PIN = ?");
        values.push(PIN);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: 0, message: "No update fields provided." });
    }

    const query = `UPDATE Admin SET ${updates.join(', ')} WHERE email = ?`;
    values.push(email); // Add email at the end for WHERE clause

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Driver update error:", err);
            return res.status(500).json({ success: 0, message: "Database error." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: "Admin not found." });
        }

        return res.status(200).json({ success: 1, message: "Admin info updated successfully." });
    });
});

app.get("/api/org-filters", (req, res) => {
    const { name } = req.query;

    const sql = "SELECT filters FROM Organization WHERE name = ?";
    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error("Error getting filters:", err);
            return res.status(500).json({ error: "DB error" });
        }

        if (!results.length) {
            return res.status(404).json({ error: "Organization not found" });
        }

        const filterString = results[0].filters || "";
        const filterArray = filterString.split(",").map(f => f.trim()).filter(Boolean);

        res.json({ filters: filterArray });
    });
});

app.get('/api/drivers/:email/phistory', async (req, res) => {
    try {
        const driverEmail = req.params.email;
        const { sponsors } = req.query;

        if (!sponsors) {
            return res.status(400).json({
                error: "Sponsors parameter is required"
            });
        }

        const sponsorEmails = sponsors.split(',');

        // Create the correct number of placeholders
        const placeholders = sponsorEmails.map(() => '?').join(',');

        const sql = `SELECT 
                        id,
                        driver_email as email,
                        sponsor_email,
                        points_change_time,
                        points_change_reason,
                        point_change_type,
                        points_change
                    FROM PointChanges 
                    WHERE driver_email = ? AND sponsor_email IN (${placeholders})
                    ORDER BY points_change_time DESC`;

        // Spread the sponsorEmails array into the parameters
        const params = [driverEmail, ...sponsorEmails];

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    error: "Failed to fetch point history",
                    details: err.sqlMessage
                });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get('/api/driverInfoGet/phistory', (req, res) => {
    try {
        const { organization, driver_email } = req.query;

        let sql = "SELECT * FROM PointChanges";
        let params = [];

        // Build WHERE clause based on provided parameters
        const conditions = [];

        if (organization) {
            conditions.push("sponsor_email = ?");
            params.push(organization);
        }

        if (driver_email) {
            conditions.push("driver_email = ?");
            params.push(driver_email);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY points_change_time DESC"; // Default sorting

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    error: "An internal server error occurred.",
                    details: err.sqlMessage
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "No point history found" +
                        (organization ? ` for organization ${organization}` : "") +
                        (driver_email ? ` for driver ${driver_email}` : "")
                });
            }

            res.json(results);
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.post('/api/submit-DriverApp', async (req, res) => {
    // Extract fields from the request body
    const { email, first_name, last_name, status, password } = req.body;

    // Validate input - now includes password check
    if (!email || !first_name || !last_name || !status || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const saltRounds = 10;
    const driverHashedPassword = await bcrypt.hash(password, saltRounds);

    // First check if email exists in Admin table
    const checkAdminSql = `SELECT email FROM Admin WHERE email = ?`;
    db.query(checkAdminSql, [email], (err, adminResults) => {
        if (err) {
            console.error("Error checking Admin table:", err);
            return res.status(500).json({ error: "Database error checking Admin table" });
        }

        if (adminResults.length > 0) {
            return res.status(400).json({ error: "Email already exists in Admin table" });
        }

        // Then check if email exists in Sponsor table
        const checkSponsorSql = `SELECT email FROM Sponsor WHERE email = ?`;
        db.query(checkSponsorSql, [email], (err, sponsorResults) => {
            if (err) {
                console.error("Error checking Sponsor table:", err);
                return res.status(500).json({ error: "Database error checking Sponsor table" });
            }

            if (sponsorResults.length > 0) {
                return res.status(400).json({ error: "Email already exists in Sponsor table" });
            }

            // If email doesn't exist in either, proceed with Driver insertion
            const insertDriverSql = `
                INSERT INTO Driver (email, first_name, last_name, status, password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(insertDriverSql,
                [email, first_name, last_name, status, driverHashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting driver:", err);
                        return res.status(500).json({
                            error: "Failed to add driver",
                            details: err.sqlMessage || err
                        });
                    }
                    res.json({
                        message: "Driver added successfully!",
                        id: result.insertId
                    });
                }
            );
        });
    });
});

app.get('/api/all_orders_joined', (req, res) => {
    const sql = `
      SELECT 
        d.email AS driver_email,
        d.sponsor_list,
        o.order_date,
        o.total,
        i.trackName,
        i.artistName,
        i.quantity
      FROM Driver d
      JOIN Orders o ON d.email = o.email
      JOIN OrderItems i ON o.id = i.order_id
      ORDER BY o.order_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching joined order data:", err);
            return res.status(500).json({ error: "Database query failed." });
        }

        res.json(results);
    });
});

//API for adding Organizations
app.post('/api/login_logs', (req, res) => {
    const { email, status } = req.body;

    const sql = `
    INSERT INTO LoginLogs (EMAIL, STATUS)
    VALUES (?, ?)
  `;

    db.query(sql, [email, status], (err, result) => {
        if (err) {
            console.error("Error inserting Login Log:", err.sqlMessage || err);
            return res.status(500).json({ error: "Failed to send Login Log", details: err.sqlMessage || err });
        }
        res.json({ message: "Login Log Added!" });
    });
});

//API to add an entry into the password logs
app.post('/passwordLog', async (req, res) => {
    const { email, result } = req.body;

    // Validate input
    if (!email || !result) {
        return res.status(400).json({ error: "All Fields Are Required!" });
    }

    // SQL Query to insert application data into the database
    const sql = `
    INSERT INTO PasswordLog (email, result)
    VALUES (?, ?)
  `;

    db.query(sql, [email, result], (err, result) => {
        if (err) {
            console.error("Error inserting Log:", err);
            return res.status(500).json({ error: "Failed to Insert the log" });
        }
        res.json({ message: "Password Change Logged!", id: result.insertId });
    });
});

//API to get the password logs
app.get('/passwordLog', (req, res) => {
    const { email, startDate, endDate } = req.query;

    let sql = 'SELECT * FROM PasswordLog WHERE 1=1'; // Base query
    const params = [];

    // Filter by email if provided
    if (email) {
        sql += ' AND email = ?';
        params.push(email);
    }

    // Filter by date range if both are provided
    if (startDate && endDate) {
        sql += ' AND Date BETWEEN ? AND ?';
        params.push(startDate);
        params.push(endDate);
    }

    // Execute the query
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
//API To Reset Users Password
app.post('/reset', async (req, res) => {
    const { email, sq1, PIN, password } = req.body;

    if (!email || !password || !PIN || !sq1) {
        return res.status(400).json({ success: 0, error: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkAndUpdate = (table) => {
        db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
            if (err) {
                console.error("Database Query Error:", err);
                return res.status(500).json({ success: 0, error: "Database error occurred." });
            }

            if (results.length > 0) {
                const user = results[0];
                const correctPhrase = user.sq1 === sq1;
                const correctPin = user.PIN === PIN;

                if (!correctPhrase && !correctPin) {
                    const sql3 = `
              INSERT INTO PasswordLog (email, result)
              VALUES (?, ?)
            `;

                    db.query(sql3, [email, "FAILED"], (err, result) => {
                        if (err) {
                            console.error("Error inserting Log:", err);
                        }
                    });
                    return res.status(400).json({ success: 0, error: "Information did not match." });
                }

                db.query(
                    `UPDATE ${table} SET password = ? WHERE email = ?`,
                    [hashedPassword, email],
                    (err) => {
                        if (err) {
                            console.error("Password Update Error:", err);
                            return res.status(500).json({ success: 0, error: "Failed to update password." });
                        }

                        //-----------
                        const sql2 = `
              INSERT INTO PasswordLog (email, result)
              VALUES (?, ?)
            `;

                        db.query(sql2, [email, "SUCCESS"], (err, result) => {
                            if (err) {
                                console.error("Error inserting Log:", err);
                            }
                        });
                        //----------
                        return res.status(200).json({ success: 1, message: "Password reset successful." });
                    }
                );
            } else if (table === "Admin") {
                // Last table, and no match — return 404
                return res.status(404).json({ success: 0, error: "User not found." });
            }
        });
    };

    checkAndUpdate("Driver");
    checkAndUpdate("Sponsor");
    checkAndUpdate("Admin");
});



// Start Express server
app.listen(PORT, () => {
    console.log(`Express API running on port ${PORT}`);
});