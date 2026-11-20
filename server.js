// server.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import axios from "axios";
dotenv.config();

const app = express();
const requiredEnv = ["EMAIL_USER", "EMAIL_PASS", "ENQUIRY_EMAIL"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`⚠️  Missing environment variable: ${key}`);
  }
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

let transporter = null;

try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✅ Email transporter configured");
  } else {
    console.warn("⚠️  Email credentials not configured");
  }
} catch (error) {
  console.error("❌ Email configuration error:", error.message);
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ".apn";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

const seedAnnouncements = [
  {
    id: crypto.randomUUID(),
    title: "Sunday Celebration Service",
    message: "Join us this Sunday at 9:00 AM in the Main Sanctuary for a powerful time of worship and the Word.",
    author: "Church Admin",
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Night of Answered Prayers",
    message:
      "Friday 10:00 PM — come with an expectant heart. The altar of answered prayers is open.",
    author: "Church Admin",
    pinned: false,
    createdAt: new Date().toISOString(),
  },
];

const seedMembers = [
  { id: "m-001", title: "Mr",   name: "Kwame Mensah",   phone: "0541215212", gender: "male" },
  { id: "m-002", title: "Mrs",  name: "Akosua Boateng", phone: "0207464426", gender: "female" },
  { id: "m-003", title: "Miss", name: "Adjoa Serwaa",   phone: "0244000111", gender: "female" },
  { id: "m-004", title: "Mr",   name: "Yaw Owusu",      phone: "0555000222", gender: "male" },
  { id: "m-005", title: "Mrs",  name: "Esi Danso",      phone: "0266000333", gender: "female" },
];

const memStore = {
  announcements: seedAnnouncements,
  members: seedMembers,
  attendance: {}
};

const ensureDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
};

const loadFromDisk = () => {
  try {
    if (!ensureDir()) return;
    for (const key of Object.keys(memStore)) {
      const file = path.join(DATA_DIR, `${key}.json`);
      if (fs.existsSync(file)) {
        memStore[key] = JSON.parse(fs.readFileSync(file, "utf8"));
      } else {
        fs.writeFileSync(file, JSON.stringify(memStore[key], null, 2));
      }
    }
  } catch (e) {
    console.warn("⚠️  Disk persistence unavailable, using in-memory store:", e.message);
  }
};

const persist = (key) => {
  try {
    if (!ensureDir()) return;
    fs.writeFileSync(
      path.join(DATA_DIR, `${key}.json`),
      JSON.stringify(memStore[key], null, 2)
    );
  } catch {
  }
};
loadFromDisk();


const pad2 = (n) => String(n).padStart(2, "0");
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

/** "2026-11-17" -> "Tuesday 17 November 2026" */
const formatChurchDate = (isoDate) => {
  const d = isoDate ? new Date(`${isoDate}T00:00:00`) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  const weekday = safe.toLocaleDateString("en-GB", { weekday: "long" });
  const day = safe.getDate();
  const month = safe.toLocaleDateString("en-GB", { month: "long" });
  const year = safe.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
};

const buildAbsenceMessage = (member, isoDate) => {
  const title = member.title || (member.gender === "female" ? "Miss" : "Mr");
  const name = member.name || member.fullName || "Member"; 
  const dateText = formatChurchDate(isoDate);

  const templates = [
    `Greetings ${title} ${name}, This is Answered Prayer Network. We will like to check up on you since you didn't or were not able to come to church on ${dateText}. We wish to see you soon. God richly bless you. #APN.`,
    `Hello ${title} ${name}, we missed you at Answered Prayer Network on ${dateText}! We hope you are doing well. Looking forward to seeing you soon. Stay blessed. #APN.`,
    `Peace be with you ${title} ${name}. Answered Prayer Network noticed your absence on ${dateText}. We are praying for you and hope all is well. See you in the next service! #APN.`,
    `Hi ${title} ${name}, Answered Prayer Network here. We missed your presence at church on ${dateText}. Is everything okay? We are here for you. God bless you. #APN.`,
    `Greetings ${title} ${name}, we missed you on ${dateText} at Answered Prayer Network. "Let us not give up meeting together... but let us encourage one another." (Hebrews 10:25). Hope to see you soon! #APN.`,
    `Greetings ${title} ${name}, this is Answered Prayer Network. We just wanted to check up on you as we missed you in church on ${dateText}. We hope all is well. We look forward to seeing you this week . God richly bless you. #APN`
  ];
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

const normalizePhone = (raw) => {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return digits;
};

async function sendSms({ to, message }) {
  const recipient = normalizePhone(to);
  const token = process.env.SMS_API_TOKEN || process.env.SMS_API_KEY; 
  const senderId = process.env.SMS_SENDER_ID || "APN";
  const endpoint = process.env.SMS_API_URL

  if (!recipient) return { success: false, to, error: "Missing phone number" };
  if (!token) {
    console.log(`\n[SMS:DEV] to=${recipient}\n           ${message}\n`);
    return { success: true, dev: true, to: recipient };
  }

  try {
    const response = await axios.post(
      endpoint,
      { 
        senderId: senderId, 
        contacts: [recipient], 
        message 
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json"
        }
      }
    );

    const data = response.data;

    if (data?.msg?.includes("Insufficient SMS credits") || data?.message?.includes("Insufficient SMS credits")) {
      return { success: false, to: recipient, error: "Insufficient SMS credits please recharge to continue" };
    }

    if (data?.success === false || data?.result?.success === false) {
       return {
         success: false,
         to: recipient,
         error: data?.message || data?.result?.message || "Failed to send SMS"
       };
    }

    return { success: true, status: response.status, to: recipient, data };

  } catch (err) {
    // Axios gives detailed error responses if the API returns a 400/500 status
    console.error("SMS API Error:", err.response?.data || err.message);
    return { 
      success: false, 
      to: recipient, 
      error: err.response?.data?.message || err.message 
    };
  }
}

function requireAdmin(req, res, next) {
  const supplied =
    req.headers["x-admin-password"] ||
    (req.body && req.body.password) ||
    req.query.password;

  if (supplied !== ADMIN_PASSWORD) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid admin password" });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Church site backend running",
    email: !!transporter,
    environment: process.env.VERCEL ? "Vercel" : "Local",
    timestamp: new Date().toISOString(),
  });
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

app.post("/api/send-enquiry", async (req, res) => {
  try {
    const { message, whatsappCaption } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Enquiry message is required.",
      });
    }

    const emailMessage = message.trim();
    const whatsappMessage = whatsappCaption?.trim() || emailMessage;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Answered Prayer Network" <${process.env.EMAIL_USER}>`,
          to: process.env.ENQUIRY_EMAIL,
          subject: "New Church Website Enquiry",
          text: `${emailMessage}\n\nWhatsApp Caption:\n${whatsappMessage}`,
          html: `
            <h2>New Church Website Enquiry</h2>
            <p>${escapeHtml(emailMessage)}</p>
            <hr/>
            <p><strong>WhatsApp Caption:</strong></p>
            <p>${escapeHtml(whatsappMessage)}</p>
          `,
        });
        console.log("✅ Enquiry email sent");
      } catch (emailError) {
        console.error("❌ Email send error:", emailError.message);
      }
    } else {
      console.warn("⚠️  Email not sent - transporter not configured");
    }

    res.json({
      success: true,
      message: "Enquiry sent successfully.",
      whatsappCaption: whatsappMessage,
    });
  } catch (error) {
    console.error("Send enquiry error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send enquiry.",
      error: error.message,
    });
  }
});

app.get("/api/announcements", (_req, res) => {
  const sorted = [...memStore.announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  res.json({ success: true, announcements: sorted });
});

app.post("/api/admin/verify", requireAdmin, (_req, res) => {
  res.json({ success: true, message: "Admin verified" });
});

app.post("/api/announcements", requireAdmin, (req, res) => {
  const { title, message, author, pinned } = req.body || {};
  if (!title?.trim()) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }
  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const announcement = {
    id: crypto.randomUUID(),
    title: title.trim(),
    message: message.trim(),
    author: author || "Church Admin",
    pinned: Boolean(pinned),
    createdAt: new Date().toISOString(),
  };

  memStore.announcements.push(announcement);
  persist("announcements");
  res.status(201).json({ success: true, announcement });
});

app.put("/api/announcements/:id", requireAdmin, (req, res) => {
  const idx = memStore.announcements.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }
  const { title, message, pinned } = req.body || {};
  memStore.announcements[idx] = {
    ...memStore.announcements[idx],
    ...(title !== undefined ? { title: String(title).trim() } : {}),
    ...(message !== undefined ? { message: String(message).trim() } : {}),
    ...(pinned !== undefined ? { pinned: Boolean(pinned) } : {}),
    updatedAt: new Date().toISOString(),
  };
  persist("announcements");
  res.json({ success: true, announcement: memStore.announcements[idx] });
});

app.delete("/api/announcements/:id", requireAdmin, (req, res) => {
  const idx = memStore.announcements.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }
  const [removed] = memStore.announcements.splice(idx, 1);
  persist("announcements");
  res.json({ success: true, message: "Announcement deleted", deleted: removed });
});

app.get("/api/members", (_req, res) => {
  res.json({ success: true, members: memStore.members });
});

app.post("/api/members", requireAdmin, (req, res) => {
  const { name, phone, title, gender } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "name and phone are required" });
  }
  const member = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    title: title || (gender === "female" ? "Miss" : "Mr"),
    gender: gender || "male",
  };
  memStore.members.push(member);
  persist("members");
  res.status(201).json({ success: true, member });
});

app.delete("/api/members/:id", requireAdmin, (req, res) => {
  const idx = memStore.members.findIndex((m) => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Member not found" });
  }
  const [removed] = memStore.members.splice(idx, 1);
  persist("members");
  res.json({ success: true, deleted: removed });
});

app.get("/api/attendance", (req, res) => {
  const date = req.query.date || todayISO();
  res.json({
    success: true,
    date,
    presentIds: memStore.attendance[date] || [],
  });
});

app.put("/api/attendance", requireAdmin, (req, res) => {
  const { date, presentIds } = req.body || {};
  const day = date || todayISO();
  if (!Array.isArray(presentIds)) {
    return res.status(400).json({ success: false, message: "presentIds must be an array" });
  }
  memStore.attendance[day] = [...new Set(presentIds)];
  persist("attendance");
  res.json({ success: true, date: day, presentIds: memStore.attendance[day] });
});

app.get("/api/absentees", (req, res) => {
  const date = req.query.date || todayISO();
  const present = new Set(memStore.attendance[date] || []);
  const absentees = memStore.members.filter((m) => !present.has(m.id));
  res.json({ success: true, date, absentees });
});

app.post("/api/sms/preview", (req, res) => {
  const { date, memberIds } = req.body || {};
  const day = date || todayISO();
  const present = new Set(memStore.attendance[day] || []);
  const pool = Array.isArray(memberIds) && memberIds.length
    ? memStore.members.filter((m) => memberIds.includes(m.id))
    : memStore.members.filter((m) => !present.has(m.id));

  const messages = pool.map((m) => ({
    memberId: m.id,
    name: m.name,
    phone: m.phone,
    title: m.title || (m.gender === "female" ? "Miss" : "Mr"),
    message: buildAbsenceMessage(m, day),
  }));

  res.json({
    success: true,
    date: day,
    dateText: formatChurchDate(day),
    count: messages.length,
    messages,
  });
});

app.post("/api/sms/send-absentees", requireAdmin, async (req, res) => {
  const { date, absentees } = req.body || {};
  const day = date || todayISO();

  if (!absentees || !Array.isArray(absentees) || absentees.length === 0) {
    return res.json({
      success: true, date: day, sent: 0, results: [],
      message: "No absentees provided 🎉",
    });
  }

  const results = [];
  let insufficientCreditsError = null;
  
  for (const member of absentees) {
    // Map Frontend fields (fullName, contacts) to Backend expectations
    const name = member.fullName || member.name || "Member";
    const phone = member.contacts || member.phone || "";
    const title = member.gender === "female" ? "Miss" : "Mr";
    
    const tempMember = { name, title, gender: member.gender };
    const message = buildAbsenceMessage(tempMember, day);
    const result = await sendSms({ to: phone, message });
    
    results.push({
      memberId: member.id || Date.now().toString(),
      name: name,
      phone: phone,
      ...result,
    });

    // Stop sending if we hit an insufficient credits error
    if (result.error === "Insufficient SMS credits please recharge to continue") {
      insufficientCreditsError = result.error;
      break; 
    }

    await new Promise((r) => setTimeout(r, 250)); 
  }

  if (insufficientCreditsError) {
    return res.status(400).json({
      success: false,
      message: insufficientCreditsError
    });
  }

  const sent = results.filter((r) => r.success).length;
  
  res.json({
    success: true,
    date: day,
    dateText: formatChurchDate(day),
    requested: absentees.length,
    sent,
    failed: absentees.length - sent,
    results,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Church site backend on http://localhost:${PORT}`);
  });
}

export default app;