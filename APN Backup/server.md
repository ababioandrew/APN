// Local Server.js
//=====================================================

import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";

//=====================================================
// ENVIRONMENT
//=====================================================

dotenv.config();

//=====================================================
// APP CONFIGURATION
//=====================================================

const app= express();

const PORT= Number(process.env.PORT) || 5000;

//=====================================================
// REQUIRED ENVIRONMENT VARIABLES
//=====================================================

// DATABASE_URL is used when deploying to Neon/PostgreSQL
// or when your .env contains a PostgreSQL connection string.
//
// For local PostgreSQL you can alternatively use:
// DB_USER
// DB_HOST
// DB_NAME
// DB_PASS
// DB_PORT

const requiredEnv= [
"EMAIL_USER",
"EMAIL_PASS",
"ENQUIRY_EMAIL",
];

for (const key of requiredEnv) {
if (!process.env[key]) {
console.error(`❌ Missing environment variable: ${key}`);
process.exit(1);
}
}

if (!process.env.DATABASE_URL) {
const localDbVariables= [
"DB_USER",
"DB_HOST",
"DB_NAME",
"DB_PASS",
"DB_PORT",
];

for (const key of localDbVariables) {
if (!process.env[key]) {
console.error(
`❌ Missing database environment variable: ${key}`
);
process.exit(1);
}
}
}

//=====================================================
// MIDDLEWARE
//=====================================================

app.use(
cors({
origin: true,
credentials: true,
})
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

//=====================================================
// EMAIL / SMTP
//=====================================================
//
// IMPORTANT:
// EMAIL_PASS must be a Google App Password,
// NOT your normal Gmail password.
//
// Example:
//
// EMAIL_USER=yourgmail@gmail.com
// EMAIL_PASS=abcdefghijklmnop
// ENQUIRY_EMAIL=yourgmail@gmail.com
//
//=====================================================

const transporter= nodemailer.createTransport({
service: "gmail",

auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

transporter.verify((error, success)=> {
if (error) {
console.error("❌ SMTP configuration error:");
console.error(error.message);
} else {
console.log("✅ SMTP server is ready to send emails.");
}
});

let pool;
if (process.env.DATABASE_URL) {
pool= new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {rejectUnauthorized: false},
});
console.log("🔗 PostgreSQL configured using DATABASE_URL");
}else {
pool= new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASS,
port: Number(process.env.DB_PORT) || 5432,
});

console.log("🔗 PostgreSQL configured using local DB variables");
}

const createMembersTable= async ()=> {
try {
await pool.query(`
CREATE TABLE IF NOT EXISTS members (
id SERIAL PRIMARY KEY,

"fullName" VARCHAR(100) NOT NULL,

gender VARCHAR(20) NOT NULL,

location VARCHAR(100),

"dateOfBirth" DATE,

"dateOfEntry" DATE NOT NULL,

contacts VARCHAR(50),

remarks TEXT,

"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);

console.log("✅ Members table is ready");
} catch (error) {
console.error(
"❌ Failed to create members table:",
error.message
);

throw error;
}
};

//=====================================================
// DATABASE CONNECTION
//=====================================================

const connectDatabase= async ()=> {
try {
const client= await pool.connect();

console.log("✅ Connected to PostgreSQL Database");

client.release();

await createMembersTable();
} catch (error) {
console.error("❌ PostgreSQL connection failed");
console.error(error.message);

throw error;
}
};

//=====================================================
// HEALTH CHECK
//=====================================================

app.get("/api/health", async (req, res)=> {
try {
await pool.query("SELECT NOW()");

res.status(200).json({
success: true,
message: "Backend and PostgreSQL are working",
database:
process.env.DB_NAME ||
"Connected through DATABASE_URL",
});
} catch (error) {
console.error("Health check error:", error);

res.status(500).json({
success: false,
message: "Database connection failed",
error: error.message,
});
}
});

//=====================================================
// COMMERCIAL API
//=====================================================

app.get("/api/commercial", (req, res)=> {
res.status(200).json({
success: true,

enabled: true,

// Configuration only.
// The actual video is imported by Home.jsx.

videoUrl: "/src/assets/videos/commercial.mp4",

duration: 10,

triggers: [
5,
10,
15,
],
});
});

//=====================================================
// GET CURRENT MONTH BIRTHDAY CELEBRANTS
//=====================================================

app.get("/api/members/birthdays", async (req, res)=> {
try {
const result= await pool.query(`
SELECT
id,
"fullName",
gender,
location,
"dateOfBirth",
contacts,
remarks,

EXTRACT(
YEAR FROM AGE(
CURRENT_DATE,
"dateOfBirth"
)
)::INTEGER AS age

FROM members

WHERE
"dateOfBirth" IS NOT NULL

AND EXTRACT(
MONTH FROM "dateOfBirth"
)= EXTRACT(
MONTH FROM CURRENT_DATE
)

ORDER BY
EXTRACT(
DAY FROM "dateOfBirth"
) ASC,

"fullName" ASC
`);

res.status(200).json({
success: true,

month: new Date().toLocaleString(
"en-US",
{
month: "long",
}
),

count: result.rows.length,

birthdays: result.rows,
});
} catch (error) {
console.error(
"GET birthday members error:",
error
);

res.status(500).json({
success: false,

message:
"Failed to retrieve birthday celebrants",

error: error.message,
});
}
});

//=====================================================
// GET ALL MEMBERS
//=====================================================

app.get("/api/members", async (req, res)=> {
try {
const result= await pool.query(`
SELECT *
FROM members
ORDER BY id DESC
`);

res.status(200).json({
success: true,
members: result.rows,
});
} catch (error) {
console.error(
"GET members error:",
error
);

res.status(500).json({
success: false,
error: error.message,
});
}
});

//=====================================================
// GET MEMBER BY ID
//=====================================================

app.get("/api/members/:id", async (req, res)=> {
const { id }= req.params;

try {
const result= await pool.query(
`
SELECT *
FROM members
WHERE id= $1
`,
[id]
);

if (result.rows.length=== 0) {
return res.status(404).json({
success: false,
message: "Member not found",
});
}

res.status(200).json({
success: true,
member: result.rows[0],
});
} catch (error) {
console.error(
"GET member error:",
error
);

res.status(500).json({
success: false,
error: error.message,
});
}
});

//=====================================================
// CREATE MEMBER
//=====================================================

app.post("/api/members", async (req, res)=> {
console.log("\n=================================");
console.log("📥 POST /api/members");
console.log("📦 Received body:", req.body);
console.log("=================================");

const {
fullName,
gender,
location,
dateOfBirth,
dateOfEntry,
contacts,
remarks,
}= req.body;

// ---------------------------------------------------
// VALIDATION
// ---------------------------------------------------

if (!fullName || !gender || !dateOfEntry
){console.log("❌ Required fields missing");
return res.status(400).json({
success: false,
message: "Full name, gender and date of entry are required",
});
}

try {
// -------------------------------------------------
// SHOW CURRENT DATABASE
// -------------------------------------------------

const dbInfo= await pool.query(`SELECT current_database() AS database`);
console.log("🗄️ Current PostgreSQL database:", dbInfo.rows[0].database);
console.log("📝 Inserting into table: members");

const result= await pool.query(
`
INSERT INTO members (
"fullName",
gender,
location,
"dateOfBirth",
"dateOfEntry",
contacts,
remarks
)

VALUES (
$1,
$2,
$3,
$4,
$5,
$6,
$7
)

RETURNING *
`,
[
fullName.trim(),
gender,
location?.trim() || null,
dateOfBirth || null,
dateOfEntry,
contacts?.trim() || null,
remarks?.trim() || null,
]
);

console.log("✅ PostgreSQL INSERT successful");
console.log("✅ Inserted member:", result.rows[0]);
res.status(201).json({
success: true,
message: "Membership details saved successfully!",
member: result.rows[0],
});
}catch(error){
console.error("❌ PostgreSQL INSERT ERROR");
console.error(error);
res.status(500).json({
success: false,

error: error.message,
});
}
});

const escapeHtml= (value= "")=> {
return String(value)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");
};

//=====================================================
// SEND ENQUIRY EMAIL
//=====================================================

app.post("/api/send-enquiry", async (req, res)=> {
try {
const {message, whatsappCaption}= req.body;
if (!message || typeof message !== "string" || !message.trim()){
return res.status(400).json({success: false, message:
"Enquiry message is required."});
}

const emailMessage= message.trim();
const whatsappMessage= typeof whatsappCaption=== "string" && whatsappCaption.trim() ? whatsappCaption.trim() : emailMessage;
const safeEmailMessage= escapeHtml(emailMessage);
const safeWhatsappMessage= escapeHtml(whatsappMessage);

await transporter.sendMail({
from: `"Answered Prayer Network" <${process.env.EMAIL_USER}>`,
to: process.env.ENQUIRY_EMAIL,
subject: "New Church Website Enquiry",
text: `${emailMessage}
WhatsApp Caption:
${whatsappMessage}`,
html: `
<div
style="
font-family: Arial, sans-serif;
line-height: 1.6;
color: #222;
"
>
<h2>
New Church Website Enquiry
</h2>
<p>
${safeEmailMessage}
</p>
<hr />
<p>
<strong>
WhatsApp Caption:
</strong>
</p>
<p>
${safeWhatsappMessage}
</p>
</div>
`,
});
console.log("✅ Enquiry email sent successfully.");
return res.status(200).json({
success: true,
message: "Enquiry sent successfully to email.",
whatsappCaption: whatsappMessage});
} catch (error){console.error("❌ Send enquiry error:",error);
return res.status(500).json({
success: false, message: "Failed to send enquiry.",
error: error.message,
});
}
});

app.put("/api/members/:id", async (req, res)=> {
const { id }= req.params;
const {
fullName,
gender,
location,
dateOfBirth,
dateOfEntry,
contacts,
remarks,
}= req.body;

// ---------------------------------------------------
// VALIDATION
// ---------------------------------------------------

if (
!fullName ||
!gender ||
!dateOfEntry
) {
return res.status(400).json({
success: false,

message:
"Full name, gender and date of entry are required",
});
}

try {
const result= await pool.query(
`
UPDATE members

SET
"fullName"= $1,
gender= $2,
location= $3,
"dateOfBirth"= $4,
"dateOfEntry"= $5,
contacts= $6,
remarks= $7,
"updatedAt"= CURRENT_TIMESTAMP

WHERE id= $8

RETURNING *
`,
[
fullName.trim(),

gender,

location?.trim() || null,

dateOfBirth || null,

dateOfEntry,

contacts?.trim() || null,

remarks?.trim() || null,

id,
]
);

if (result.rows.length=== 0) {
return res.status(404).json({
success: false,

message: "Member not found",
});
}

res.status(200).json({
success: true,

message:
"Member updated successfully!",

member: result.rows[0],
});
} catch (error) {
console.error(
"PUT member error:",
error
);

res.status(500).json({
success: false,

error: error.message,
});
}
});

app.delete("/api/members/:id", async (req, res)=> {
const { id }= req.params;
try {
const result= await pool.query(
`
DELETE FROM members

WHERE id= $1

RETURNING *
`,
[id]
);

if (result.rows.length=== 0) {
return res.status(404).json({
success: false,

message: "Member not found",
});
}

res.status(200).json({
success: true,

message:
"Member deleted successfully!",

member: result.rows[0],
});
} catch (error) {
console.error(
"DELETE member error:",
error
);

res.status(500).json({
success: false,

error: error.message,
});
}
});

app.use((req, res)=> {res.status(404).json({
success: false, message: "Route not found"});
});

app.use((error, req, res, next)=> {
console.error("❌ Global server error:",error);
res.status(500).json({
success: false,
message: "Internal server error",
error: error.message,
});
});

const server= app.listen(PORT,
async ()=> {console.log(`✅ Server running on http://localhost:${PORT}`);
console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
console.log(`🎬 Commercial API: http://localhost:${PORT}/api/commercial`);

try{await connectDatabase();
}catch (error){console.error("❌ Server startup failed:",error.message);
server.close(()=> {process.exit(1)});
}
}
);

server.on("error", (error)=> {
if (error.code=== "EADDRINUSE"){
console.error(`❌ Port ${PORT} is already in use.`);
console.error(`Run: netstat -ano | findstr :${PORT}`);
process.exit(1);
}
console.error("❌ Server error:",error);
});

//=====================================================
// GRACEFUL SHUTDOWN
//=====================================================

const shutdown= async ()=> {
console.log(
"🛑 Shutting down server..."
);

try {
await pool.end();

server.close(()=> {
console.log(
"✅ Server stopped"
);

process.exit(0);
});
} catch (error) {
console.error(
"❌ Shutdown error:",
error
);

process.exit(1);
}
};

process.on(
"SIGINT",
shutdown
);

process.on(
"SIGTERM",
shutdown
);