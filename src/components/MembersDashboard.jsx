import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./MembersDashboard.css";

// --- DIRECT JSONBIN CONFIGURATION ---
const JSONBIN_BIN_ID = "6af8d362ac6210605a88248b";
const JSONBIN_MASTER_KEY = "$2a$10$Q/2lVH/nwELkpa5V3Sf/dOkGCRhpSl46JcsO.dGv5Q1rg/F7P5VO6";

const API = {
  base: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
  latest: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
};

// --- BACKEND (for SMS only) ---
const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ADMIN_DELETE_PASSWORD = ".apn";

// --------------------------------------------------
// INITIAL APN MEMBERS DATA (Fallback)
// --------------------------------------------------
const APN_INITIAL_DATA = [
  { fullName: "Rich Almor", gender: "Male", location: "Spintex road", dateOfBirth: "2026-11-03", dateOfEntry: "2026-11-03", contacts: "0548099730", email: "honbrewandy@yahoo.com", remarks: "New member", id: "1793707281348", maritalStatus: "", role: "Member" },
  { fullName: "MAVIS KONADU AMPONG", gender: "Female", location: "TESHIE MENSAH SABAH", dateOfBirth: "1990-01-12", dateOfEntry: "2026-11-14", contacts: "0245937191", email: "", remarks: "", maritalStatus: "Married", role: "Member" },
  { fullName: "LETICIA KORKOR ASHIAD-LARYEA", gender: "Female", location: "PLOT No 20 GOLF CITY, GK 0219-6336", dateOfBirth: "1984-07-29", dateOfEntry: "2026-11-14", contacts: "0241021023", email: "", remarks: "", maritalStatus: "Married", role: "Leader" },
];

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

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try { data = JSON.parse(responseText); } catch { data = responseText; }
  }

  if (!response.ok) {
    const message = data && typeof data === "object" ? data.message || data.error : data;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return data;
}

function normalizeMember(member) {
  return {
    id: member.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    fullName: member.fullName || member.name || "",
    gender: member.gender || "",
    location: member.location || "",
    dateOfBirth: member.dateOfBirth || "",
    dateOfEntry: member.dateOfEntry || new Date().toISOString().slice(0, 10),
    contacts: member.contacts || member.phone || "",
    email: member.email || "",
    remarks: member.remarks || "",
    maritalStatus: member.maritalStatus || "",
    role: member.role || "Member",
  };
}

const emptyMember = { 
  fullName: "", gender: "", location: "", dateOfBirth: "", 
  dateOfEntry: new Date().toISOString().slice(0, 10), contacts: "", 
  email: "", remarks: "", maritalStatus: "", role: "" 
};

const emptyExpense = { title: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10), description: "" };
const emptyAnnouncement = { title: "", message: "", date: new Date().toISOString().slice(0, 10) };

export default function MembersDashboard() {
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]); 
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);

  const [memberForm, setMemberForm] = useState(emptyMember);
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [editingMember, setEditingMember] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [currentAttendance, setCurrentAttendance] = useState({});
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [summaryView, setSummaryView] = useState("present"); 

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingSms, setSendingSms] = useState(false); // NEW
  const [backendStatus, setBackendStatus] = useState("Checking...");

  const showAlert = (icon, title, text) => Swal.fire({ icon, title, text, timer: 3000, timerProgressBar: true, showConfirmButton: false });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchJSON(API.latest);
      
      const record = data?.record || data;
      
      setMembers((record?.members || []).map(normalizeMember));
      setAttendanceData(record?.attendance || []);
      setExpenses(record?.expenses || []);
      setAnnouncements(record?.announcements || []);
      
      setBackendStatus("Connected (JSONBin)");
    } catch (error) {
      console.error("Data loading error:", error);
      setBackendStatus("Connection failed");
      setMembers(APN_INITIAL_DATA.map(normalizeMember));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveDashboardData = async (updatedMembers, updatedAttendance, updatedExpenses, updatedAnnouncements) => {
    const payload = {
      members: updatedMembers !== null ? updatedMembers : members,
      attendance: updatedAttendance !== null ? updatedAttendance : attendanceData,
      expenses: updatedExpenses !== null ? updatedExpenses : expenses,
      announcements: updatedAnnouncements !== null ? updatedAnnouncements : announcements,
    };
    
    try {
      await fetchJSON(API.base, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      localStorage.setItem('apn_dashboard_backup', JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error("Failed to save to JSONBin:", error);
      localStorage.setItem('apn_dashboard_backup', JSON.stringify(payload));
      throw error;
    }
  };

  const handleSaveMember = async (event) => {
    event.preventDefault();
    if (!memberForm.fullName.trim()) return showAlert("warning", "Missing Information", "Please enter the member's full name.");

    try {
      setSaving(true);
      let updatedList = editingMember
        ? members.map((m) => m.id === editingMember ? { ...m, ...memberForm } : m)
        : [...members, { ...memberForm, id: Date.now().toString() }];

      await saveDashboardData(updatedList, null, null, null);
      setMembers(updatedList);
      setMemberForm(emptyMember);
      setEditingMember(null);
      showAlert("success", editingMember ? "Member Updated" : "Member Added", "Saved to cloud successfully!");
    } catch (error) {
      showAlert("error", "Save Failed", error.message);
    } finally { setSaving(false); }
  };

  const handleDeleteMember = async (member) => {
    const confirmation = await Swal.fire({ icon: "warning", title: "Delete Member?", html: `Are you sure you want to delete <strong>${member.fullName}</strong>?`, showCancelButton: true, confirmButtonColor: "#d33" });
    if (!confirmation.isConfirmed) return;

    const passwordPrompt = await Swal.fire({
      title: "Admin Password Required", input: "password", showCancelButton: true, confirmButtonColor: "#d33",
      inputValidator: (value) => (!value || !value.trim()) ? "Password cannot be empty." : null,
    });
    if (!passwordPrompt.isConfirmed) return;
    if (passwordPrompt.value !== ADMIN_DELETE_PASSWORD) return Swal.fire({ icon: "error", title: "Incorrect Password", confirmButtonColor: "#d33" });

    try {
      setSaving(true);
      const updatedList = members.filter((m) => m.id !== member.id);
      await saveDashboardData(updatedList, null, null, null);
      setMembers(updatedList);
      showAlert("success", "Member Deleted", "Removed from cloud successfully.");
    } catch (error) { showAlert("error", "Delete Failed", error.message); } finally { setSaving(false); }
  };

  // ⭐ NEW — Delete announcement with .apn password
  const handleDeleteAnnouncement = async (announcement) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete Announcement?",
      html: `Are you sure you want to delete <strong>${announcement.title}</strong>?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });
    if (!confirmation.isConfirmed) return;

    const passwordPrompt = await Swal.fire({
      title: "Admin Password Required",
      input: "password",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      inputValidator: (value) => (!value || !value.trim()) ? "Password cannot be empty." : null,
    });
    if (!passwordPrompt.isConfirmed) return;
    if (passwordPrompt.value !== ADMIN_DELETE_PASSWORD) {
      return Swal.fire({ icon: "error", title: "Incorrect Password", confirmButtonColor: "#d33" });
    }

    try {
      setSaving(true);
      const updatedList = announcements.filter((a) => a.id !== announcement.id);
      await saveDashboardData(null, null, null, updatedList);
      setAnnouncements(updatedList);
      showAlert("success", "Announcement Deleted", "Removed from cloud successfully.");
    } catch (error) {
      showAlert("error", "Delete Failed", error.message);
    } finally {
      setSaving(false);
    }
  };

  // ⭐ NEW — Send SMS to current absentee list (uses backend endpoint)
  const handleSendAbsenteeSMS = async (absentList, dateISO) => {
    if (!absentList || absentList.length === 0) {
      return showAlert("info", "No Absentees", "Everyone is present — nothing to send.");
    }

    const confirmation = await Swal.fire({
      icon: "question",
      title: `Send SMS to ${absentList.length} absent member${absentList.length > 1 ? "s" : ""}?`,
      html: `This will send an SMS to each absentee for <strong>${dateISO}</strong>.`,
      showCancelButton: true,
      confirmButtonColor: "#17365D",
      confirmButtonText: "Yes, send SMS",
    });
    if (!confirmation.isConfirmed) return;

    const passwordPrompt = await Swal.fire({
      title: "Admin Password Required",
      input: "password",
      showCancelButton: true,
      confirmButtonColor: "#17365D",
      inputValidator: (value) => (!value || !value.trim()) ? "Password cannot be empty." : null,
    });
    if (!passwordPrompt.isConfirmed) return;

    try {
      setSendingSms(true);
      const res = await fetch(`${BACKEND_URL}/api/send-absentee-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: passwordPrompt.value,
          date: dateISO,
          absentees: absentList.map((m) => ({
            fullName: m.fullName,
            gender: m.gender,
            maritalStatus: m.maritalStatus,
            contacts: m.contacts,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Server error (${res.status})`);
      }

      Swal.fire({
        icon: data.failed ? "warning" : "success",
        title: data.failed ? "Partially Sent" : "SMS Sent",
        html: `<p><strong>${data.sent}</strong> of <strong>${data.requested}</strong> SMS sent successfully.</p>` +
          (data.failed ? `<p style="color:#b91c1c;">${data.failed} failed — check console for details.</p>` : ""),
      });

      // eslint-disable-next-line no-console
      console.table(data.results);
    } catch (err) {
      showAlert("error", "SMS Failed", err.message);
    } finally {
      setSendingSms(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const existingRecord = attendanceData.find((a) => a.date === selectedDate);
      if (existingRecord) {
        const passwordPrompt = await Swal.fire({
          title: "Update Existing Attendance?", text: `Enter admin password to update ${selectedDate}.`, input: "password", showCancelButton: true, confirmButtonColor: "#3b82f6",
          inputValidator: (value) => (!value || !value.trim()) ? "Password cannot be empty." : null,
        });
        if (!passwordPrompt.isConfirmed) return;
        if (passwordPrompt.value !== ADMIN_DELETE_PASSWORD) return Swal.fire({ icon: "error", title: "Incorrect Password", confirmButtonColor: "#d33" });
      }

      setSaving(true);
      const presentCount = Object.values(currentAttendance).filter(Boolean).length;
      const newRecord = { date: selectedDate, records: currentAttendance, totalPresent: presentCount, totalMembers: members.length };

      let updatedAttendance = attendanceData.filter((a) => a.date !== selectedDate);
      updatedAttendance.push(newRecord);
      updatedAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));

      await saveDashboardData(null, updatedAttendance, null, null);
      setAttendanceData(updatedAttendance);
      showAlert("success", "Attendance Submitted", `Attendance for ${selectedDate} saved successfully!`);
    } catch (error) { showAlert("error", "Submit Failed", error.message); } finally { setSaving(false); }
  };

  const handleSaveAnnouncement = async (event) => {
    event.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) return showAlert("warning", "Missing Info", "Enter title and message.");
    
    try {
      setSaving(true);
      const newAnnouncement = { ...announcementForm, id: Date.now().toString() };
      const updatedList = [newAnnouncement, ...announcements];
      
      await saveDashboardData(null, null, null, updatedList);
      setAnnouncements(updatedList);
      setAnnouncementForm(emptyAnnouncement);
      showAlert("success", "Published", "Announcement submitted.");
    } catch (error) { showAlert("error", "Error", error.message); } finally { setSaving(false); }
  };

  const handleSaveExpense = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const newExpense = { ...expenseForm, id: Date.now().toString(), amount: Number(expenseForm.amount) };
      const updatedList = [newExpense, ...expenses];
      
      await saveDashboardData(null, null, updatedList, null);
      setExpenses(updatedList);
      setExpenseForm(emptyExpense);
      showAlert("success", "Expense Saved", "The expense was submitted.");
    } catch (error) { showAlert("error", "Error", error.message); } finally { setSaving(false); }
  };

  const handleToggleAttendance = (memberId) => {
    setCurrentAttendance((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleLoadAttendance = (date) => {
    setSelectedDate(date);
    const existingRecord = attendanceData.find((a) => a.date === date);
    if (existingRecord) {
      setCurrentAttendance(existingRecord.records || {});
    } else {
      setCurrentAttendance({});
    }
    setAttendanceSearch(""); 
  };

  const handleMarkAll = (status) => {
    const nextRecords = { ...currentAttendance };
    members.forEach((m) => { nextRecords[m.id] = status; });
    setCurrentAttendance(nextRecords);
  };

  const filteredAttendanceMembers = useMemo(() => {
    if (!attendanceSearch.trim()) return members;
    const lowerSearch = attendanceSearch.toLowerCase();
    return members.filter(
      (m) => m.fullName.toLowerCase().includes(lowerSearch) || (m.contacts && m.contacts.includes(lowerSearch))
    );
  }, [members, attendanceSearch]);

  const presentCount = Object.values(currentAttendance).filter(Boolean).length;
  const presentMembersList = members.filter((m) => currentAttendance[m.id]);
  const absentMembersList = members.filter((m) => !currentAttendance[m.id]);

  return (
    <div className="members-dashboard">
      <header className="dashboard-header">
        <div><h1>Church Administration</h1><p>Manage members, attendance, expenses and announcements.</p></div>
        <div className="backend-status">
          <span className={backendStatus.includes("Connected") ? "status-connected" : "status-disconnected"}>● {backendStatus}</span>
          <button type="button" onClick={fetchData}>Refresh</button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        {[["members", "Members"], ["attendance", "Weekly Attendance"], ["attendance_history", "History Details"], ["expenses", "Expenses"], ["announcements", "Announcements"]].map(([key, label]) => (
          <button key={key} type="button" className={activeTab === key ? "active" : ""} onClick={() => { setActiveTab(key); if(key === "attendance_history") setSelectedHistoryRecord(null); }}>
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "members" && (
        <section className="dashboard-section">
          <h2>{editingMember ? "Update Member" : "Register Member"}</h2>
          
          <form onSubmit={handleSaveMember} className="dashboard-form">
            <label>Full Name *</label>
            <input type="text" name="fullName" value={memberForm.fullName} onChange={(e) => setMemberForm({...memberForm, fullName: e.target.value})} required />

            <label>Role (Optional)</label>
            <select name="role" value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}>
              <option value="">Select Role</option>
              <option value="Member">Member</option>
              <option value="Leader">Leader</option>
            </select>

            <label>Gender</label>
            <select name="gender" value={memberForm.gender} onChange={(e) => setMemberForm({...memberForm, gender: e.target.value})}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label>Marital Status</label>
            <select name="maritalStatus" value={memberForm.maritalStatus} onChange={(e) => setMemberForm({...memberForm, maritalStatus: e.target.value})}>
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
            </select>

            <label>Contact Number</label>
            <input type="tel" name="contacts" value={memberForm.contacts} onChange={(e) => setMemberForm({...memberForm, contacts: e.target.value})} />

            <label>Email (Optional)</label>
            <input type="email" name="email" value={memberForm.email} onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} />

            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={memberForm.dateOfBirth} onChange={(e) => setMemberForm({...memberForm, dateOfBirth: e.target.value})} />

            <label>Date of Entry</label>
            <input type="date" name="dateOfEntry" value={memberForm.dateOfEntry} onChange={(e) => setMemberForm({...memberForm, dateOfEntry: e.target.value})} />

            <label>Location</label>
            <input type="text" name="location" value={memberForm.location} onChange={(e) => setMemberForm({...memberForm, location: e.target.value})} />

            <label>Remarks (Optional)</label>
            <textarea name="remarks" value={memberForm.remarks} onChange={(e) => setMemberForm({...memberForm, remarks: e.target.value})} rows="2" style={{ gridColumn: '1 / -1' }}></textarea>

            <div className="form-actions">
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Member"}</button>
              {editingMember && (
                <button type="button" onClick={() => { setEditingMember(null); setMemberForm(emptyMember); }} style={{ background: '#e2e8f0', color: '#0f172a' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: m.role === 'Leader' ? 'bold' : 'normal' }}>
                      {m.fullName} {m.role === 'Leader' && '⭐'}
                    </td>
                    <td>{m.role || '—'}</td>
                    <td>{m.contacts || '—'}</td>
                    <td>{m.email || '—'}</td>
                    <td>{m.location || '—'}</td>
                    <td className="table-actions">
                      <button onClick={() => { setEditingMember(m.id); setMemberForm(m); }}>Edit</button>
                      <button onClick={() => handleDeleteMember(m)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "attendance" && (
        <section className="dashboard-section">
          <h2>Weekly Attendance Checklist</h2>
          <div className="attendance-controls">
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#0f172a' }}>Select Service Date</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="date" value={selectedDate} onChange={(e) => handleLoadAttendance(e.target.value)} />
                <button onClick={() => handleLoadAttendance(new Date().toISOString().slice(0, 10))} style={{ padding: '10px 15px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Reset to Today</button>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
               <button type="button" onClick={() => handleMarkAll(true)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Mark All Present</button>
               <button type="button" onClick={() => handleMarkAll(false)} style={{ padding: '10px 15px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Clear All</button>
            </div>
          </div>

          <div className="attendance-layout">
            <div>
              <input type="text" placeholder="Search member by name or phone..." value={attendanceSearch} onChange={(e) => setAttendanceSearch(e.target.value)} className="attendance-search" />
              <div className="attendance-list-container">
                <table className="dashboard-table attendance-table">
                  <thead><tr><th>Member Name</th><th>Role</th><th>Contact</th><th>Location</th><th style={{ textAlign: 'center' }}>Status</th></tr></thead>
                  <tbody>
                    {filteredAttendanceMembers.map(member => (
                      <tr key={member.id}>
                        <td><div style={{ fontWeight: 600 }}>{member.fullName}</div></td>
                        <td>{member.role === "Leader" ? "⭐ Leader" : (member.role || "Member")}</td>
                        <td>{member.contacts || "—"}</td>
                        <td>{member.location || "—"}</td>
                        <td style={{ textAlign: 'center' }}>
                          <label className={`attendance-checkbox-label ${currentAttendance[member.id] ? 'is-present' : ''}`}>
                            <input type="checkbox" className="attendance-checkbox" checked={!!currentAttendance[member.id]} onChange={() => handleToggleAttendance(member.id)} />
                            <span>{currentAttendance[member.id] ? "Present" : "Absent"}</span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="attendance-summary-panel">
                <h3>Members for Today: {selectedDate}</h3>
                <div className="summary-stats">
                  <div><p>Present</p><h4 className="count-present">{presentCount}</h4></div>
                  <div><p>Absent</p><h4 className="count-absent">{members.length - presentCount}</h4></div>
                  <div><p>Total</p><h4 className="count-total">{members.length}</h4></div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => setSummaryView('present')} style={{ flex: 1, padding: '8px', background: summaryView === 'present' ? '#10b981' : '#e2e8f0', color: summaryView === 'present' ? 'white' : '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Present List</button>
                  <button onClick={() => setSummaryView('absent')} style={{ flex: 1, padding: '8px', background: summaryView === 'absent' ? '#ef4444' : '#e2e8f0', color: summaryView === 'absent' ? 'white' : '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Absent (Follow-up)</button>
                </div>
                <div className="attendance-summary-list">
                  {summaryView === 'present' ? (
                    presentMembersList.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', marginTop: '20px' }}>No members checked in yet.</p> : (
                      <ul>
                        {presentMembersList.map(m => (
                          <li key={m.id}><div style={{ display: 'flex', flexDirection: 'column' }}><span>{m.fullName}</span><span style={{ fontSize: '0.75rem', color: '#64748b' }}>📞 {m.contacts || 'No contact'}</span></div><span>✓</span></li>
                        ))}
                      </ul>
                    )
                  ) : (
                    absentMembersList.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', marginTop: '20px' }}>All members are present!</p> : (
                      <ul>
                        {absentMembersList.map(m => (
                          <li key={m.id}><div style={{ display: 'flex', flexDirection: 'column' }}><span>{m.fullName}</span><span style={{ fontSize: '0.75rem', color: '#64748b' }}>📞 {m.contacts || 'No contact'}</span></div><span style={{ color: '#ef4444' }}>✗</span></li>
                        ))}
                      </ul>
                    )
                  )}
                </div>

                {/* ⭐ NEW — Send SMS button, visible only on Absent view */}
                {summaryView === 'absent' && (
  <button
    type="button"
    className="sms-absentee-btn"
    onClick={() => handleSendAbsenteeSMS(absentMembersList, selectedDate)}
    disabled={sendingSms || absentMembersList.length === 0}
  >
    {sendingSms
      ? "Sending SMS..."
      : `📲 Send SMS to Absentees (${absentMembersList.length})`}
  </button>
                )}
                <button onClick={handleSaveAttendance} disabled={saving} className="submit-attendance-btn">{saving ? "Verifying & Saving..." : "Submit Attendance"}</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "attendance_history" && (
        <section className="dashboard-section">
          <h2>Attendance History</h2>
          
          {!selectedHistoryRecord ? (
            <>
              <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Select a past service date below to view the detailed attendance record, including who was absent for follow-up.</p>
              
              {attendanceData.length === 0 ? (
                <p className="empty-state-box">No attendance records found.</p>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Total Present</th>
                        <th>Total Members</th>
                        <th>Percentage</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 'bold' }}>{record.date}</td>
                          <td style={{ color: '#10b981', fontWeight: 'bold' }}>{record.totalPresent}</td>
                          <td>{record.totalMembers}</td>
                          <td>{Math.round((record.totalPresent / record.totalMembers) * 100)}%</td>
                          <td>
                            <button 
                              className="view-details-btn"
                              onClick={() => setSelectedHistoryRecord(record)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="history-header-card">
                <div>
                  <h3>Service Date: {selectedHistoryRecord.date}</h3>
                  <p>
                    Present: <strong style={{ color: 'var(--success)' }}>{selectedHistoryRecord.totalPresent}</strong> | 
                    Absent: <strong style={{ color: 'var(--danger)' }}>{selectedHistoryRecord.totalMembers - selectedHistoryRecord.totalPresent}</strong> | 
                    Total: <strong>{selectedHistoryRecord.totalMembers}</strong>
                  </p>
                </div>
                <button className="back-btn" onClick={() => setSelectedHistoryRecord(null)}>
                  ← Back to History List
                </button>
              </div>

              <div className="history-grid">
                {/* PRESENT COLUMN */}
                <div>
                  <h4 className="history-list-header present">✅ Present Members ({selectedHistoryRecord.totalPresent})</h4>
                  <div className="dashboard-table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="dashboard-table history-table">
                      <thead><tr><th>Name</th><th>Contact</th></tr></thead>
                      <tbody>
                        {members.filter(m => selectedHistoryRecord.records[m.id]).map(m => (
                          <tr key={m.id}>
                            <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                            <td>{m.contacts || '—'}</td>
                          </tr>
                        ))}
                        {members.filter(m => selectedHistoryRecord.records[m.id]).length === 0 && (
                          <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>No members were present.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ABSENT COLUMN */}
                <div>
                  <h4 className="history-list-header absent">❌ Absent Members ({selectedHistoryRecord.totalMembers - selectedHistoryRecord.totalPresent})</h4>
                  <div className="dashboard-table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="dashboard-table history-table">
                      <thead><tr><th>Name</th><th>Contact (For Follow-up)</th></tr></thead>
                      <tbody>
                        {members.filter(m => !selectedHistoryRecord.records[m.id]).map(m => (
                          <tr key={m.id}>
                            <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                            <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{m.contacts || '—'}</td>
                          </tr>
                        ))}
                        {members.filter(m => !selectedHistoryRecord.records[m.id]).length === 0 && (
                          <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>All members were present!</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ⭐ NEW — SMS button also on history detail */}
              <button
                type="button"
                className="sms-absentee-btn compact"
                onClick={() =>
                  handleSendAbsenteeSMS(
                    members.filter(m => !selectedHistoryRecord.records[m.id]),
                    selectedHistoryRecord.date
                  )
                }
                disabled={
                  sendingSms ||
                  members.filter(m => !selectedHistoryRecord.records[m.id]).length === 0
                }
              >
                {sendingSms ? "Sending SMS..." : "📲 Send SMS to Absentees"}
              </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "announcements" && (
        <section className="dashboard-section">
          <h2>Create Announcement</h2>
          <form onSubmit={handleSaveAnnouncement} className="dashboard-form">
            <input placeholder="Title" value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} required />
            <textarea placeholder="Message" value={announcementForm.message} onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})} required />
            <div className="form-actions">
              <button type="submit" disabled={saving}>{saving ? "Publishing..." : "Publish Announcement"}</button>
            </div>
          </form>

          <h2 style={{ marginTop: '35px' }}>Published Announcements ({announcements.length})</h2>
          {announcements.length === 0 ? (
            <p className="empty-state-box">No announcements published yet.</p>
          ) : (
            <div className="announcement-list">
              {announcements.map((a) => (
                <article className="announcement-card" key={a.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
                    <h3 style={{ margin: 0 }}>{a.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{a.date}</span>

                      {/* ⭐ NEW — Delete button (password protected) */}
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(a)}
                        disabled={saving}
                        style={{
                          background: 'transparent',
                          border: '2px solid #dc2626',
                          color: '#dc2626',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontWeight: 'bold',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p>{a.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}