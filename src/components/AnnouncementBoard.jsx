// src/components/AnnouncementBoard.jsx
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaBullhorn, FaTrash } from "react-icons/fa";

// --- Same JSONBin credentials used by MembersDashboard ---
const JSONBIN_BIN_ID = "6af8d362ac6210605a88248b";
const JSONBIN_MASTER_KEY = "$2a$10$Q/2lVH/nwELkpa5V3Sf/dOkGCRhpSl46JcsO.dGv5Q1rg/F7P5VO6";
const ADMIN_DELETE_PASSWORD = ".apn";

const API = {
  base: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
  latest: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
};

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "X-Master-Key": JSONBIN_MASTER_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" ? data.message || data.error : data;
    throw new Error(message || `Request failed (${response.status})`);
  }

  return data;
}

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState([]);
  const [fullRecord, setFullRecord] = useState(null);   // keep members/attendance/expenses when we PUT back
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchJSON(API.latest);
      const record = data?.record || data || {};
      setFullRecord(record);
      setAnnouncements(Array.isArray(record.announcements) ? record.announcements : []);
    } catch (err) {
      console.error("Announcement load failed:", err);
      Swal.fire({
        icon: "error",
        title: "Could not load announcements",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (a) => {
    // 1. Confirm
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Announcement?",
      html: `Are you sure you want to delete <strong>${a.title}</strong>?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    // 2. Password
    const pw = await Swal.fire({
      title: "Admin Password Required",
      input: "password",
      inputPlaceholder: "Enter admin password",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
      inputValidator: (v) => (!v || !v.trim()) ? "Password cannot be empty." : null,
    });
    if (!pw.isConfirmed) return;

    if (pw.value !== ADMIN_DELETE_PASSWORD) {
      return Swal.fire({
        icon: "error",
        title: "Incorrect Password",
        confirmButtonColor: "#d33",
      });
    }

    // 3. Save to JSONBin
    try {
      setDeleting(true);
      const updatedList = announcements.filter((x) => x.id !== a.id);
      const payload = { ...(fullRecord || {}), announcements: updatedList };

      await fetchJSON(API.base, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setFullRecord(payload);
      setAnnouncements(updatedList);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Announcement removed.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Delete Failed", text: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section style={{ padding: "30px 16px", textAlign: "center", color: "#64748B" }}>
        Loading announcements…
      </section>
    );
  }

  return (
    <section style={{ padding: "30px 16px", maxWidth: 900, margin: "0 auto" }}>
      <h2
        style={{
          background: "#F8FAFC",
          color: "#0F172A",
          padding: "14px 18px",
          borderRadius: 10,
          fontWeight: 800,
          fontSize: "1.2rem",
          marginBottom: 20,
          textAlign: "center",
          border: "2px solid #C49A3A",
          letterSpacing: "0.5px",
        }}
      >
        <FaBullhorn style={{ marginRight: 10, color: "#C49A3A" }} />
        Church Announcements
      </h2>

      {announcements.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748B" }}>
          No announcements yet.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {announcements.map((a) => (
            <article
              key={a.id}
              style={{
                position: "relative",
                background: "#FFFFFF",
                border: "2px solid #C49A3A",
                borderRadius: 12,
                padding: "18px 18px 14px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#0F172A",
                    fontSize: "1.05rem",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {a.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>
                    {a.date}
                  </span>

                  {/* ⭐ DELETE BUTTON — password protected */}
                  <button
                    type="button"
                    onClick={() => handleDelete(a)}
                    disabled={deleting}
                    style={{
                      background: "#FEE2E2",
                      color: "#B91C1C",
                      border: "1px solid #FCA5A5",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: deleting ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      opacity: deleting ? 0.6 : 1,
                    }}
                    title="Admin delete"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <p style={{ color: "#334155", margin: "8px 0 6px", lineHeight: 1.55 }}>
                {a.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}