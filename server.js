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

const app = express();

//=====================================================
// REQUIRED ENVIRONMENT VARIABLES
//=====================================================

const requiredEnv = [
  "DATABASE_URL",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ENQUIRY_EMAIL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    // Don't throw error in production, just log it
    if (process.env.NODE_ENV === 'production') {
      console.warn(`Warning: ${key} is not set`);
    } else {
      throw new Error(`Missing environment variable: ${key}`);
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
// NEON POSTGRESQL
//=====================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

//=====================================================
// CREATE TABLE
//=====================================================

let schemaReady = false;

const createMembersTable = async () => {
  if (schemaReady) return;

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
    schemaReady = true;
    console.log("✅ Members table ready");
  } catch (error) {
    console.error("❌ Error creating members table:", error.message);
    throw error;
  }
};

//=====================================================
// DATABASE INITIALIZATION
//=====================================================

let initialized = false;

async function initialize() {
  if (initialized) return;

  try {
    const client = await pool.connect();
    client.release();
    console.log("✅ Connected to PostgreSQL database");

    await createMembersTable();
    initialized = true;
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    // Don't throw error, let the app start but health check will fail
  }
}

// Initialize immediately but don't block startup
initialize().catch(error => {
  console.error("❌ Initialization failed:", error.message);
});

//=====================================================
// HEALTH CHECK
//=====================================================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Backend and PostgreSQL are working",
      database: "Connected through DATABASE_URL",
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
    const result = await pool.query(`
      SELECT
        id,
        "fullName",
        gender,
        location,
        "dateOfBirth",
        contacts,
        remarks,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, "dateOfBirth"))::INTEGER AS age
      FROM members
      WHERE "dateOfBirth" IS NOT NULL
        AND EXTRACT(MONTH FROM "dateOfBirth") = EXTRACT(MONTH FROM CURRENT_DATE)
      ORDER BY EXTRACT(DAY FROM "dateOfBirth"), "fullName"
    `);

    res.json({
      success: true,
      month: new Date().toLocaleString("en-US", { month: "long" }),
      count: result.rows.length,
      birthdays: result.rows,
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
    const result = await pool.query(`
      SELECT *
      FROM members
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      members: result.rows,
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
    const result = await pool.query(
      `SELECT * FROM members WHERE id=$1`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      member: result.rows[0],
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
    const result = await pool.query(
      `
      INSERT INTO members(
        "fullName",
        gender,
        location,
        "dateOfBirth",
        "dateOfEntry",
        contacts,
        remarks
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
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

    res.status(201).json({
      success: true,
      message: "Membership details saved successfully!",
      member: result.rows[0],
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
    const result = await pool.query(
      `
      UPDATE members
      SET
        "fullName"=$1,
        gender=$2,
        location=$3,
        "dateOfBirth"=$4,
        "dateOfEntry"=$5,
        contacts=$6,
        remarks=$7,
        "updatedAt"=CURRENT_TIMESTAMP
      WHERE id=$8
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
        req.params.id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member updated successfully!",
      member: result.rows[0],
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
    const result = await pool.query(
      `DELETE FROM members WHERE id=$1 RETURNING *`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully!",
      member: result.rows[0],
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

    // Only send email if transporter is configured
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
        // Continue even if email fails - WhatsApp will still work
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

// Only start the server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

//=====================================================
// EXPORT FOR VERCEL
//=====================================================

export default app;

// import express from "express";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import cors from "cors";
// import { Pool } from "pg";

// //=====================================================
// // ENVIRONMENT
// //=====================================================

// dotenv.config();

// //=====================================================
// // APP CONFIGURATION
// //=====================================================

// const app = express();

// //=====================================================
// // REQUIRED ENVIRONMENT VARIABLES
// //=====================================================

// const requiredEnv = [
//   "DATABASE_URL",
//   "EMAIL_USER",
//   "EMAIL_PASS",
//   "ENQUIRY_EMAIL",
// ];

// for (const key of requiredEnv) {
//   if (!process.env[key]) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
// }

// //=====================================================
// // MIDDLEWARE
// //=====================================================

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// //=====================================================
// // EMAIL
// //=====================================================

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// //=====================================================
// // NEON POSTGRESQL
// //=====================================================

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
//   max: 5,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 10000,
// });

// //=====================================================
// // CREATE TABLE
// //=====================================================

// let schemaReady = false;

// const createMembersTable = async () => {
//   if (schemaReady) return;

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS members (
//       id SERIAL PRIMARY KEY,
//       "fullName" VARCHAR(100) NOT NULL,
//       gender VARCHAR(20) NOT NULL,
//       location VARCHAR(100),
//       "dateOfBirth" DATE,
//       "dateOfEntry" DATE NOT NULL,
//       contacts VARCHAR(50),
//       remarks TEXT,
//       "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `);

//   schemaReady = true;
// };

// //=====================================================
// // DATABASE INITIALIZATION
// //=====================================================

// let initialized = false;

// async function initialize() {
//   if (initialized) return;

//   const client = await pool.connect();
//   client.release();

//   await createMembersTable();

//   initialized = true;

//   console.log("✅ Connected to Neon PostgreSQL");
// }

// app.use(async (req, res, next) => {
//   try {
//     await initialize();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// //=====================================================
// // HEALTH CHECK
// //=====================================================

// app.get("/api/health", async (req, res) => {
//   try {
//     await pool.query("SELECT NOW()");

//     res.json({
//       success: true,
//       message: "Backend and PostgreSQL are working",
//       database: "Connected through DATABASE_URL",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // COMMERCIAL
// //=====================================================

// app.get("/api/commercial", (req, res) => {
//   res.json({
//     success: true,
//     enabled: true,
//     videoUrl: "/src/assets/videos/commercial.mp4",
//     duration: 10,
//     triggers: [5, 10, 15],
//   });
// });

// //=====================================================
// // BIRTHDAYS
// //=====================================================

// app.get("/api/members/birthdays", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT
//         id,
//         "fullName",
//         gender,
//         location,
//         "dateOfBirth",
//         contacts,
//         remarks,
//         EXTRACT(YEAR FROM AGE(CURRENT_DATE,"dateOfBirth"))::INTEGER AS age
//       FROM members
//       WHERE "dateOfBirth" IS NOT NULL
//         AND EXTRACT(MONTH FROM "dateOfBirth") = EXTRACT(MONTH FROM CURRENT_DATE)
//       ORDER BY EXTRACT(DAY FROM "dateOfBirth"), "fullName"
//     `);

//     res.json({
//       success: true,
//       month: new Date().toLocaleString("en-US", { month: "long" }),
//       count: result.rows.length,
//       birthdays: result.rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve birthday celebrants",
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // GET MEMBERS
// //=====================================================

// app.get("/api/members", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT *
//       FROM members
//       ORDER BY id DESC
//     `);

//     res.json({
//       success: true,
//       members: result.rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // GET MEMBER
// //=====================================================

// app.get("/api/members/:id", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT * FROM members WHERE id=$1`,
//       [req.params.id]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.json({
//       success: true,
//       member: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // CREATE MEMBER
// //=====================================================

// app.post("/api/members", async (req, res) => {
//   const {
//     fullName,
//     gender,
//     location,
//     dateOfBirth,
//     dateOfEntry,
//     contacts,
//     remarks,
//   } = req.body;

//   if (!fullName || !gender || !dateOfEntry) {
//     return res.status(400).json({
//       success: false,
//       message: "Full name, gender and date of entry are required",
//     });
//   }

//   try {
//     const result = await pool.query(
//       `
//       INSERT INTO members(
//         "fullName",
//         gender,
//         location,
//         "dateOfBirth",
//         "dateOfEntry",
//         contacts,
//         remarks
//       )
//       VALUES($1,$2,$3,$4,$5,$6,$7)
//       RETURNING *
//       `,
//       [
//         fullName.trim(),
//         gender,
//         location?.trim() || null,
//         dateOfBirth || null,
//         dateOfEntry,
//         contacts?.trim() || null,
//         remarks?.trim() || null,
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Membership details saved successfully!",
//       member: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // UPDATE MEMBER
// //=====================================================

// app.put("/api/members/:id", async (req, res) => {
//   const {
//     fullName,
//     gender,
//     location,
//     dateOfBirth,
//     dateOfEntry,
//     contacts,
//     remarks,
//   } = req.body;

//   if (!fullName || !gender || !dateOfEntry) {
//     return res.status(400).json({
//       success: false,
//       message: "Full name, gender and date of entry are required",
//     });
//   }

//   try {
//     const result = await pool.query(
//       `
//       UPDATE members
//       SET
//         "fullName"=$1,
//         gender=$2,
//         location=$3,
//         "dateOfBirth"=$4,
//         "dateOfEntry"=$5,
//         contacts=$6,
//         remarks=$7,
//         "updatedAt"=CURRENT_TIMESTAMP
//       WHERE id=$8
//       RETURNING *
//       `,
//       [
//         fullName.trim(),
//         gender,
//         location?.trim() || null,
//         dateOfBirth || null,
//         dateOfEntry,
//         contacts?.trim() || null,
//         remarks?.trim() || null,
//         req.params.id,
//       ]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Member updated successfully!",
//       member: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // DELETE MEMBER
// //=====================================================

// app.delete("/api/members/:id", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `DELETE FROM members WHERE id=$1 RETURNING *`,
//       [req.params.id]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Member deleted successfully!",
//       member: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // ENQUIRY
// //=====================================================

// const escapeHtml = (value = "") =>
//   String(value)
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");

// app.post("/api/send-enquiry", async (req, res) => {
//   try {
//     const { message, whatsappCaption } = req.body;

//     if (!message?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Enquiry message is required.",
//       });
//     }

//     const emailMessage = message.trim();
//     const whatsappMessage =
//       whatsappCaption?.trim() || emailMessage;

//     await transporter.sendMail({
//       from: `"Answered Prayer Network" <${process.env.EMAIL_USER}>`,
//       to: process.env.ENQUIRY_EMAIL,
//       subject: "New Church Website Enquiry",
//       text: `${emailMessage}\n\nWhatsApp Caption:\n${whatsappMessage}`,
//       html: `
//         <h2>New Church Website Enquiry</h2>
//         <p>${escapeHtml(emailMessage)}</p>
//         <hr/>
//         <p><strong>WhatsApp Caption:</strong></p>
//         <p>${escapeHtml(whatsappMessage)}</p>
//       `,
//     });

//     res.json({
//       success: true,
//       message: "Enquiry sent successfully to email.",
//       whatsappCaption: whatsappMessage,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to send enquiry.",
//       error: error.message,
//     });
//   }
// });

// //=====================================================
// // 404
// //=====================================================

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// //=====================================================
// // ERROR HANDLER
// //=====================================================

// app.use((error, req, res, next) => {
//   console.error(error);

//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     error: error.message,
//   });
// });

// //=====================================================
// // EXPORT FOR VERCEL
// //=====================================================

// export default app;