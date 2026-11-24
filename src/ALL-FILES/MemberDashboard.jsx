import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2"; 
import {
  FaUserCheck,
  FaUserTimes,
  FaSms,
  FaSave,
  FaLock,
  FaPaperPlane,
  FaEye,
} from "react-icons/fa";
import { api } from "../services/api";

const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function MemberDashboard() {
  const [date, setDate] = useState(todayISO());
  const [members, setMembers] = useState([]);
  const [presentIds, setPresentIds] = useState([]);
  const [savedPresentIds, setSavedPresentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const [smsPreview, setSmsPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Load members + attendance for the selected date
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setStatus({ type: "", message: "" });
      try {
        const [membersRes, attendanceRes] = await Promise.all([
          api.getMembers(),
          api.getAttendance(date),
        ]);
        if (cancelled) return;
        setMembers(membersRes.members || []);
        const ids = attendanceRes.presentIds || [];
        setPresentIds(ids);
        setSavedPresentIds(ids);
      } catch (err) {
        if (!cancelled) setStatus({ type: "error", message: err.message });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date]);

  const togglePresent = (id) => {
    setPresentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const absentees = useMemo(
    () => members.filter((m) => !presentIds.includes(m.id)),
    [members, presentIds]
  );

  const dirty = useMemo(() => {
    const a = [...presentIds].sort().join(",");
    const b = [...savedPresentIds].sort().join(",");
    return a !== b;
  }, [presentIds, savedPresentIds]);

  const saveAttendance = async () => {
    if (!password) {
      return setStatus({ type: "error", message: "Enter admin password first." });
    }
    setStatus({ type: "", message: "" });
    try {
      await api.saveAttendance(date, presentIds, password);
      setSavedPresentIds(presentIds);
      setStatus({ type: "success", message: "Attendance saved." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const previewSms = async () => {
    setStatus({ type: "", message: "" });
    try {
      const data = await api.previewSms(date);
      setSmsPreview(data);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const sendSms = async () => {
    if (!password) {
      return setStatus({ type: "error", message: "Enter admin password first." });
    }
    setSending(true);
    setStatus({ type: "", message: "" });
    
    try {
      const data = await api.sendSms(date, password);
      setSendResult(data);

      // 1. Check if the backend returned a global error (like Insufficient Credits)
      if (data.message && data.message.includes("Insufficient SMS credits")) {
        Swal.fire({
          icon: "error",
          title: "Insufficient Credits",
          text: data.message,
          confirmButtonColor: "#d33",
        });
        return;
      }

      if (data.failed > 0) {
        const firstFailed = data.results.find((r) => !r.success);
        const errorMessage = firstFailed?.error || "Unknown error";

        Swal.fire({
          icon: "warning",
          title: data.sent === 0 ? "SMS Failed" : "Partially Sent",
          html: `
            <p><strong>${data.sent}</strong> of <strong>${data.requested}</strong> SMS sent.</p>
            <p style="color:#d33; margin-top: 10px;"><strong>Provider Error:</strong> ${errorMessage}</p>
          `,
          confirmButtonColor: "#17365D",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "All messages sent successfully!",
          confirmButtonColor: "#17365D",
        });
      }
      
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      Swal.fire({
        icon: "error",
        title: "SMS Failed",
        text: err.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setSending(false);
    }
  };

  const statusColors = {
    success: { bg: "#DCFCE7", fg: "#166534" },
    error: { bg: "#FEE2E2", fg: "#991B1B" },
    warning: { bg: "#FEF9C3", fg: "#854D0E" },
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <h1
        style={{
          background: "#F8FAFC",
          color: "#0F172A",
          padding: "14px 18px",
          borderRadius: 10,
          fontWeight: 800,
          fontSize: "1.35rem",
          textAlign: "center",
          border: "2px solid #C49A3A",
          letterSpacing: "0.5px",
          marginBottom: 20,
        }}
      >
        <FaUserCheck style={{ marginRight: 10, color: "#C49A3A" }} />
        Member Attendance Dashboard
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.9rem" }}>
            Service date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSmsPreview(null);
              setSendResult(null);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "2px solid #CBD5E1",
              fontSize: "1rem",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.9rem" }}>
            <FaLock style={{ marginRight: 6, color: "#C49A3A" }} />
            Admin password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "2px solid #CBD5E1",
              fontSize: "1rem",
            }}
          />
        </label>
      </div>

      {status.message && (
        <div
          style={{
            background: statusColors[status.type]?.bg || "#F1F5F9",
            color: statusColors[status.type]?.fg || "#0F172A",
            padding: "10px 14px",
            borderRadius: 8,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {status.message}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", color: "#64748B" }}>Loading…</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {/* Attendance list */}
          <section
            style={{
              background: "#FFFFFF",
              border: "2px solid #C49A3A",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#0F172A",
                fontSize: "1.05rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaUserCheck color="#16A34A" /> Present ({presentIds.length}/
              {members.length})
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
              {members.map((m) => {
                const checked = presentIds.includes(m.id);
                return (
                  <li
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 8px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    <input
                      id={`present-${m.id}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePresent(m.id)}
                      style={{ width: 18, height: 18, accentColor: "#16A34A" }}
                    />
                    <label
                      htmlFor={`present-${m.id}`}
                      style={{
                        flex: 1,
                        cursor: "pointer",
                        color: "#0F172A",
                        fontWeight: 600,
                      }}
                    >
                      {m.title} {m.name}{" "}
                      <span style={{ color: "#64748B", fontWeight: 400 }}>
                        • {m.phone}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={saveAttendance}
              disabled={!dirty || !password}
              style={{
                marginTop: 16,
                width: "100%",
                background: dirty && password ? "#C49A3A" : "#E2E8F0",
                color: "#0F172A",
                border: "2px solid #C49A3A",
                padding: "12px 16px",
                borderRadius: 10,
                fontWeight: 800,
                cursor: dirty && password ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FaSave /> {dirty ? "Save attendance" : "Attendance saved"}
            </button>
          </section>

          {/* Absentees + SMS */}
          <section
            style={{
              background: "#FFFFFF",
              border: "2px solid #C49A3A",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#0F172A",
                fontSize: "1.05rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaUserTimes color="#DC2626" /> Absent ({absentees.length})
            </h2>

            {absentees.length === 0 ? (
              <p style={{ color: "#64748B", marginTop: 12 }}>
                Everyone is present 🎉
              </p>
            ) : (
              <ul style={{ paddingLeft: 18, color: "#334155", lineHeight: 1.7 }}>
                {absentees.map((m) => (
                  <li key={m.id}>
                    {m.title} {m.name}{" "}
                    <span style={{ color: "#64748B" }}>• {m.phone}</span>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button
                onClick={previewSms}
                style={{
                  background: "#F1F5F9",
                  color: "#0F172A",
                  border: "2px solid #CBD5E1",
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaEye /> Preview SMS
              </button>
              <button
                onClick={sendSms}
                disabled={sending || !password || absentees.length === 0}
                style={{
                  background: "#17365D",
                  color: "#FFFFFF",
                  border: "2px solid #17365D",
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontWeight: 800,
                  cursor:
                    sending || !password || absentees.length === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    sending || !password || absentees.length === 0 ? 0.6 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaPaperPlane /> {sending ? "Sending…" : "Send SMS to absentees"}
              </button>
            </div>

            {smsPreview && (
              <div
                style={{
                  marginTop: 16,
                  background: "#F8FAFC",
                  border: "1px dashed #C49A3A",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: "0.9rem",
                  color: "#334155",
                  maxHeight: 260,
                  overflowY: "auto",
                }}
              >
                <strong style={{ color: "#0F172A" }}>
                  <FaSms style={{ marginRight: 6 }} />
                  Preview ({smsPreview.count}) — {smsPreview.dateText}
                </strong>
                <ul style={{ paddingLeft: 16, marginTop: 8, lineHeight: 1.55 }}>
                  {smsPreview.messages.map((m) => (
                    <li key={m.memberId} style={{ marginBottom: 8 }}>
                      <strong>
                        {m.title} {m.name}
                      </strong>{" "}
                      <span style={{ color: "#64748B" }}>({m.phone})</span>
                      <br />
                      {m.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sendResult && (
              <div
                style={{
                  marginTop: 16,
                  fontSize: "0.88rem",
                  color: "#334155",
                }}
              >
                <strong>Send result:</strong> {sendResult.sent} sent •{" "}
                {sendResult.failed} failed
                <ul style={{ paddingLeft: 16, marginTop: 6 }}>
                  {sendResult.results.map((r) => (
                    <li key={r.memberId}>
                      {r.name}: {r.success ? "✅" : `❌ ${r.error || "failed"}`}
                      {r.dev ? " (dev log only)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}