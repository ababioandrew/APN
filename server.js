// server.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// =====================================================
// REQUIRED ENV VARS
// =====================================================

const requiredEnv = ["EMAIL_USER", "EMAIL_PASS", "ENQUIRY_EMAIL"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`⚠️  Missing environment variable: ${key}`);
  }
}

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

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

// =====================================================
// ADMIN PASSWORD + STORAGE
// =====================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ".apn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

const seedAnnouncements = [
  {
    id: crypto.randomUUID(),
    title: "Sunday Celebration Service",
    message:
      "Join us this Sunday at 9:00 AM in the Main Sanctuary for a powerful time of worship and the Word.",
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

// In-memory source of truth. Best-effort disk persistence so it
// survives restarts locally; on Vercel serverless it silently falls
// back to memory (swap in Vercel KV / Postgres for real persistence).
const memStore = {
  announcements: seedAnnouncements,
  members: seedMembers,
  attendance: {}, // { "YYYY-MM-DD": ["m-001", ...] }
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
    /* memory-only fallback */
  }
};

loadFromDisk();

// =====================================================
// HELPERS — DATES, MESSAGES, SMS
// =====================================================

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
  const dateText = formatChurchDate(isoDate);
  return (
    `Greetings ${title} ${member.name}, This is Answered Prayer Network. ` +
    `We will like to check up on you since you didn't or were not able to ` +
    `come to church on ${dateText}. We wish to see you soon. ` +
    `God richly bless you. #APN.`
  );
};

/** 0541215212 -> 233541215212 (Ghana) */
const normalizePhone = (raw) => {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return digits;
};

/**
 * SMS sender — Arkesel v2 by default (Ghana).
 * Override via env: SMS_API_URL, SMS_API_KEY, SMS_SENDER_ID.
 * Without SMS_API_KEY it just logs to the console (dev mode).
 */
async function sendSms({ to, message }) {
  const recipient = normalizePhone(to);
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER_ID || "APN";
  const endpoint = process.env.SMS_API_URL || "https://sms.arkesel.com/api/v2/sms/send";

  if (!recipient) return { success: false, to, error: "Missing phone number" };

  if (!apiKey) {
    console.log(`\n[SMS:DEV] to=${recipient}\n           ${message}\n`);
    return { success: true, dev: true, to: recipient };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ sender, message, recipients: [recipient] }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, status: res.status, to: recipient, data };
  } catch (err) {
    return { success: false, to: recipient, error: err.message };
  }
}

/** Route guard: x-admin-password header OR body.password OR ?password */
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

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Church site backend running",
    email: !!transporter,
    environment: process.env.VERCEL ? "Vercel" : "Local",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// SEND ENQUIRY EMAIL  (unchanged)
// =====================================================

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

// =====================================================
// ANNOUNCEMENTS
// =====================================================

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

// ⭐ Admin DELETE — password ".apn"
app.delete("/api/announcements/:id", requireAdmin, (req, res) => {
  const idx = memStore.announcements.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }
  const [removed] = memStore.announcements.splice(idx, 1);
  persist("announcements");
  res.json({ success: true, message: "Announcement deleted", deleted: removed });
});

// =====================================================
// MEMBERS
// =====================================================

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

// =====================================================
// ATTENDANCE
// =====================================================

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

// =====================================================
// SMS FOLLOW-UP
// =====================================================

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
  const { date, memberIds } = req.body || {};
  const day = date || todayISO();
  const present = new Set(memStore.attendance[day] || []);
  const pool = Array.isArray(memberIds) && memberIds.length
    ? memStore.members.filter((m) => memberIds.includes(m.id))
    : memStore.members.filter((m) => !present.has(m.id));

  if (!pool.length) {
    return res.json({
      success: true, date: day, sent: 0, results: [],
      message: "Nobody is absent 🎉",
    });
  }

  const results = [];
  for (const member of pool) {
    // eslint-disable-next-line no-await-in-loop
    const result = await sendSms({
      to: member.phone,
      message: buildAbsenceMessage(member, day),
    });
    results.push({
      memberId: member.id,
      name: member.name,
      phone: member.phone,
      ...result,
    });
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 250)); // provider rate-limit friendly
  }

  const sent = results.filter((r) => r.success).length;
  res.json({
    success: true,
    date: day,
    dateText: formatChurchDate(day),
    requested: pool.length,
    sent,
    failed: pool.length - sent,
    results,
  });
});

// =====================================================
// 404 + ERROR HANDLERS
// =====================================================

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

// =====================================================
// LOCAL DEV SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Church site backend on http://localhost:${PORT}`);
  });
}

// =====================================================
// EXPORT FOR VERCEL
// =====================================================

export default app;