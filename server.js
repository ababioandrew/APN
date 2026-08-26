import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

//=====================================================
// ENVIRONMENT
//=====================================================

dotenv.config();

//=====================================================
// APP CONFIGURATION
//=====================================================

const app = express();

//=====================================================
// REQUIRED ENVIRONMENT VARIABLES
//=====================================================

const requiredEnv = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ENQUIRY_EMAIL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    if (process.env.NODE_ENV === 'production') {
      console.warn(`Warning: ${key} is not set`);
    } else {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

//=====================================================
// SUPABASE CLIENT
//=====================================================

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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
// EMAIL
//=====================================================

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
    console.warn("⚠️ Email credentials not configured");
  }
} catch (error) {
  console.error("❌ Email configuration error:", error.message);
}

//=====================================================
// HEALTH CHECK
//=====================================================

app.get("/api/health", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: "Backend and Supabase are working",
      database: "Connected to Supabase",
    });
  } catch (error) {
    console.error("Health check error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

//=====================================================
// COMMERCIAL
//=====================================================

app.get("/api/commercial", (req, res) => {
  res.json({
    success: true,
    enabled: true,
    videoUrl: "/src/assets/videos/commercial.mp4",
    duration: 10,
    triggers: [5, 10, 15],
  });
});

//=====================================================
// BIRTHDAYS
//=====================================================

app.get("/api/members/birthdays", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id,
        fullName,
        gender,
        location,
        dateOfBirth,
        contacts,
        remarks,
        age: EXTRACT(YEAR FROM AGE(CURRENT_DATE, dateOfBirth))::INTEGER
      `)
      .not('dateOfBirth', 'is', null)
      .gte('dateOfBirth', new Date(new Date().getFullYear(), 0, 1))
      .lte('dateOfBirth', new Date(new Date().getFullYear(), 11, 31))
      .order('dateOfBirth', { ascending: true });

    if (error) throw error;

    // Filter birthdays for current month
    const currentMonth = new Date().getMonth();
    const birthdays = data.filter(member => {
      if (!member.dateOfBirth) return false;
      const birthMonth = new Date(member.dateOfBirth).getMonth();
      return birthMonth === currentMonth;
    });

    res.json({
      success: true,
      month: new Date().toLocaleString("en-US", { month: "long" }),
      count: birthdays.length,
      birthdays: birthdays,
    });
  } catch (error) {
    console.error("Birthdays error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve birthday celebrants",
      error: error.message,
    });
  }
});

//=====================================================
// GET MEMBERS
//=====================================================

app.get("/api/members", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      members: data || [],
    });
  } catch (error) {
    console.error("GET members error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//=====================================================
// GET MEMBER
//=====================================================

app.get("/api/members/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      member: data,
    });
  } catch (error) {
    console.error("GET member error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//=====================================================
// CREATE MEMBER
//=====================================================

app.post("/api/members", async (req, res) => {
  const {
    fullName,
    gender,
    location,
    dateOfBirth,
    dateOfEntry,
    contacts,
    remarks,
  } = req.body;

  if (!fullName || !gender || !dateOfEntry) {
    return res.status(400).json({
      success: false,
      message: "Full name, gender and date of entry are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          fullName: fullName.trim(),
          gender: gender,
          location: location?.trim() || null,
          dateOfBirth: dateOfBirth || null,
          dateOfEntry: dateOfEntry,
          contacts: contacts?.trim() || null,
          remarks: remarks?.trim() || null,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Membership details saved successfully!",
      member: data,
    });
  } catch (error) {
    console.error("POST member error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//=====================================================
// UPDATE MEMBER
//=====================================================

app.put("/api/members/:id", async (req, res) => {
  const {
    fullName,
    gender,
    location,
    dateOfBirth,
    dateOfEntry,
    contacts,
    remarks,
  } = req.body;

  if (!fullName || !gender || !dateOfEntry) {
    return res.status(400).json({
      success: false,
      message: "Full name, gender and date of entry are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .update({
        fullName: fullName.trim(),
        gender: gender,
        location: location?.trim() || null,
        dateOfBirth: dateOfBirth || null,
        dateOfEntry: dateOfEntry,
        contacts: contacts?.trim() || null,
        remarks: remarks?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Member updated successfully!",
      member: data,
    });
  } catch (error) {
    console.error("PUT member error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//=====================================================
// DELETE MEMBER
//=====================================================

app.delete("/api/members/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Member deleted successfully!",
      member: data,
    });
  } catch (error) {
    console.error("DELETE member error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//=====================================================
// ENQUIRY
//=====================================================

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
      console.warn("⚠️ Email not sent - transporter not configured");
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

//=====================================================
// 404
//=====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//=====================================================
// ERROR HANDLER
//=====================================================

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

//=====================================================
// START SERVER (for local development)
//=====================================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

//=====================================================
// EXPORT FOR VERCEL
//=====================================================

export default app;