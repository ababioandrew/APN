import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./MembersDashboard.css";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  fullName: "",
  gender: "",
  location: "",
  dateOfBirth: "",
  dateOfEntry: "",
  contacts: "",
  remarks: "",
};

// Simplified fetch - proxy will handle the routing
const fetchJSON = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        `Expected JSON but received ${contentType}. Status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || data?.message || `Request failed (${response.status})`
      );
    }

    return data;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Cannot connect to the backend server. Please ensure the server is running with "npm run server"'
      );
    }
    throw error;
  }
};

const MembersDashboard = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [enquiry, setEnquiry] = useState("");
  const [sendingEnquiry, setSendingEnquiry] = useState(false);

  // ==========================================
  // GET /api/health
  // ==========================================

  const checkHealth = async () => {
    setLoadingHealth(true);

    try {
      const result = await fetchJSON("/health");
      setBackendStatus(result);
    } catch (error) {
      setBackendStatus({
        success: false,
        message: "Backend is not reachable",
        error: error.message,
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  // ==========================================
  // GET /api/members
  // ==========================================

  const fetchMembers = async () => {
    setLoadingMembers(true);

    try {
      const result = await fetchJSON("/members");

      const normalizedMembers = (result.members || []).map((member) => ({
        ...member,
        fullName: member.fullName ?? member.fullname,
        dateOfBirth: member.dateOfBirth ?? member.dateofbirth,
        dateOfEntry: member.dateOfEntry ?? member.dateofentry,
        createdAt: member.createdAt ?? member.createdat,
        updatedAt: member.updatedAt ?? member.updatedat,
      }));

      setMembers(normalizedMembers);
    } catch (error) {
      console.error("GET members error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Members",
        text: error.message,
        confirmButtonColor: "#04732d",
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    checkHealth();
    fetchMembers();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEdit = (member) => {
    setSelectedMember(member);

    setFormData({
      fullName: member.fullName || "",
      gender: member.gender || "",
      location: member.location || "",
      dateOfBirth: member.dateOfBirth
        ? String(member.dateOfBirth).substring(0, 10)
        : "",
      dateOfEntry: member.dateOfEntry
        ? String(member.dateOfEntry).substring(0, 10)
        : "",
      contacts: member.contacts || "",
      remarks: member.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setSelectedMember(null);
    setFormData(initialFormData);
  };

  // ==========================================
  // PUT /api/members/:id
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedMember) {
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.gender ||
      !formData.dateOfEntry
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Full name, gender and date of entry are required.",
        confirmButtonColor: "#04732d",
      });

      return;
    }

    setSaving(true);

    const payload = {
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      location: formData.location.trim(),
      dateOfBirth: formData.dateOfBirth,
      dateOfEntry: formData.dateOfEntry,
      contacts: formData.contacts.trim(),
      remarks: formData.remarks.trim(),
    };

    try {
      const result = await fetchJSON(`/members/${selectedMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: "success",
        title: "Member Updated",
        text: result.message || "Member updated successfully!",
        confirmButtonColor: "#04732d",
      });

      setSelectedMember(null);
      setFormData(initialFormData);

      await fetchMembers();
    } catch (error) {
      console.error("PUT member error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE /api/members/:id
  // ==========================================

  const handleDelete = async (id) => {
    const member = members.find(
      (item) => item.id === id
    );

    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete Member?",
      text: member
        ? `Are you sure you want to delete ${member.fullName}?`
        : "Are you sure you want to delete this member?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) {
      return;
    }
    setDeletingId(id);

    try {
      const result = await fetchJSON(`/members/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: result.message || "Member deleted successfully!",
        confirmButtonColor: "#04732d",
      });

      setMembers((prev) =>
        prev.filter((member) => member.id !== id)
      );

      if (selectedMember?.id === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("DELETE member error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // POST /api/send-enquiry
  // ==========================================
  const handleSendEnquiry = async (e) => {
    e.preventDefault();

    if (!enquiry.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Message Required",
        text: "Please enter an enquiry message.",
        confirmButtonColor: "#04732d",
      });
      return;
    }
    setSendingEnquiry(true);

    try {
      const result = await fetchJSON("/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: enquiry.trim(),
        }),
      });

      const whatsappNumber = "233548099730";
      const whatsappMessage = encodeURIComponent(
        result.whatsappCaption || `🔔 NEW CHURCH WEBSITE ENQUIRY\n\n${enquiry.trim()}\n\n📍 Source: Church Website`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      
      Swal.fire({
        icon: "success",
        title: "Enquiry Sent",
        text: "The enquiry was sent by email and WhatsApp has been opened with the message ready to send.",
        confirmButtonColor: "#04732d",
      });

      setEnquiry("");
    } catch (error) {
      console.error("Send enquiry error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setSendingEnquiry(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const value = String(date).substring(0, 10);
    return value;
  };

  return (
    <div className="members-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Members Management</h1>
          <p>View, update and manage church members.</p>
        </div>
        <button
          className="refresh-btn"
          onClick={() => {
            checkHealth();
            fetchMembers();
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <section className="dashboard-card health-card">
        <div className="section-heading">
          <h2>Backend & Database Status</h2>
        </div>

        {loadingHealth ? (
          <div className="status-loading">Checking backend...</div>
        ) : backendStatus?.success ? (
          <div className="health-success">
            <span className="status-dot"></span>
            <div>
              <strong>Backend Online</strong>
              <p>{backendStatus.message}</p>
              {backendStatus.database && (
                <small>Database: {backendStatus.database}</small>
              )}
            </div>
          </div>
        ) : (
          <div className="health-error">
            <span className="status-dot"></span>
            <div>
              <strong>Backend Offline</strong>
              <p>{backendStatus?.message || "Unable to connect to backend."}</p>
            </div>
          </div>
        )}
      </section>

      {selectedMember && (
        <section className="dashboard-card edit-card">
          <div className="section-heading">
            <div>
              <h2>Edit Member</h2>
              <p>Member ID: {selectedMember.id}</p>
            </div>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>

          <form className="member-edit-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label>Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date Of Entry</label>
              <input
                type="date"
                name="dateOfEntry"
                value={formData.dateOfEntry}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Contacts</label>
              <input
                type="tel"
                name="contacts"
                value={formData.contacts}
                onChange={handleChange}
                placeholder="Enter contact"
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Member"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="dashboard-card members-card">
        <div className="section-heading">
          <div>
            <h2>Members</h2>
            <p>
              Total Members: <strong>{members.length}</strong>
            </p>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={() => navigate("/FullDetails")}
          >
            Add Member
          </button>
        </div>

        {loadingMembers ? (
          <div className="table-message">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="table-message">No members found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Location</th>
                  <th>Date Of Birth</th>
                  <th>Date Of Entry</th>
                  <th>Contacts</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td className="member-name">{member.fullName || "-"}</td>
                    <td>{member.gender || "-"}</td>
                    <td>{member.location || "-"}</td>
                    <td>{formatDate(member.dateOfBirth)}</td>
                    <td>{formatDate(member.dateOfEntry)}</td>
                    <td>{member.contacts || "-"}</td>
                    <td className="remarks-cell">{member.remarks || "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(member.id)}
                          disabled={deletingId === member.id}
                        >
                          {deletingId === member.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-card enquiry-card">
        <div className="section-heading">
          <div>
            <h2>Send Enquiry</h2>
            <p>Share your candid opinion of ideas to improve church growth.</p>
          </div>
        </div>
        <form onSubmit={handleSendEnquiry}>
          <div className="form-group">
            <label htmlFor="enquiry">Message</label>
            <textarea
              id="enquiry"
              value={enquiry}
              onChange={(e) => setEnquiry(e.target.value)}
              placeholder="Enter your enquiry..."
              rows="5"
            />
          </div>
          <button
            type="submit"
            className="send-btn"
            disabled={sendingEnquiry}
          >
            {sendingEnquiry ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default MembersDashboard;