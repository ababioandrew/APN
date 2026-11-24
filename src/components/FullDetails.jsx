import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./FullDetails.css";

const JSONBIN_BIN_ID = "6b0615acac6210605aa1f169 ";
const JSONBIN_MASTER_KEY =
  "$2a$10$vHVlIdrYpHuwF/VxfmetyufB6JoAqbipsW/Wi5vn6284P/lTnYQHO";

const API = {
  base: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
  latest: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
};

const today = new Date().toISOString().slice(0, 10);

const initialFormData = {
  fullName: "",
  gender: "",
  location: "",
  dateOfBirth: "",
  dateOfEntry: today,
  contacts: "",
  alternativeContact: "",
  email: "",
  remarks: "",
  maritalStatus: "",
  role: "Member",
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

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? data.message || data.error
        : data;
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
    dateOfEntry: member.dateOfEntry || today,
    contacts: member.contacts || member.phone || "",
    alternativeContact: member.alternativeContact || "",
    email: member.email || "",
    remarks: member.remarks || "",
    maritalStatus: member.maritalStatus || "",
    role: member.role || "Member",
  };
}

const FullDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fullName = formData.fullName.trim();
    const location = formData.location.trim();
    const contacts = formData.contacts.trim();

    if (!fullName) newErrors.fullName = "Full Name is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!location) newErrors.location = "Location is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.dateOfEntry) newErrors.dateOfEntry = "Date of Entry is required";

    if (!contacts) {
      newErrors.contacts = "Contact is required";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(contacts)) {
      newErrors.contacts = "Enter a valid contact number";
    }

    if (
      formData.alternativeContact.trim() &&
      !/^[0-9+\-\s()]{7,20}$/.test(formData.alternativeContact.trim())
    ) {
      newErrors.alternativeContact = "Enter a valid alternative contact number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields correctly.",
        confirmButtonColor: "#142d4e",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await fetchJSON(API.latest);
      const record = data?.record ?? data;

      const existingMembers = Array.isArray(record)
        ? record
        : Array.isArray(record?.members)
        ? record.members
        : [];

      const payload = {
        id: Date.now().toString(),
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        location: formData.location.trim(),
        dateOfBirth: formData.dateOfBirth,
        dateOfEntry: formData.dateOfEntry,
        contacts: formData.contacts.trim(),
        alternativeContact: formData.alternativeContact.trim(),
        email: formData.email.trim(),
        remarks: formData.remarks.trim(),
        maritalStatus: formData.maritalStatus,
        role: formData.role || "Member",
      };

      const updatedMembers = [...existingMembers.map(normalizeMember), payload];

      const dashboardData = {
        members: updatedMembers,
        attendance: Array.isArray(record?.attendance) ? record.attendance : [],
        expenses: Array.isArray(record?.expenses) ? record.expenses : [],
        announcements: Array.isArray(record?.announcements) ? record.announcements : [],
      };

      await fetchJSON(API.base, {
        method: "PUT",
        body: JSON.stringify(dashboardData),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `${payload.fullName} has been registered successfully.`,
        confirmButtonColor: "#142d4e",
        confirmButtonText: "OK",
      });

      setFormData({
        ...initialFormData,
        dateOfEntry: new Date().toISOString().slice(0, 10),
      });
      setErrors({});
    } catch (error) {
      console.error("JSONBin submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Unable to save membership details. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="membership-details-container">
      <div className="membership-details-card">
        
        {/* HEADER */}
        <div className="card-header">
          <h3>Membership Details</h3>
          <button
            className="dashboard-nav-btn"
            onClick={() => navigate("/MembersDashboard")}
            type="button"
          >
            <svg
              className="dashboard-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </button>
        </div>

        {/* MAIN CONTENT - SPLIT LAYOUT */}
        <div className="membership-content">
          
          {/* LEFT PANEL: IMAGE */}
          <div className="membership-image">
            <img
              src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=85"
              alt="Church Congregation"
            />
            <div className="membership-image-overlay">
              <h2>Welcome to the Family</h2>
              <p>
                Register your details below to join our church community. We are
                excited to connect with you and grow together in faith.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: FORM */}
          <div className="membership-form-panel">
            <div className="form-heading">
              <h2>Register Member</h2>
              <p>Please fill out all required fields marked with an asterisk (*).</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              
              {/* FULL NAME (Spans 2 columns) */}
              <div className="form-group span-2">
                <label htmlFor="fullName">Full Name <span>*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={errors.fullName ? "input-error" : ""}
                />
                {errors.fullName && <small className="error-message">{errors.fullName}</small>}
              </div>

              {/* CONTACT */}
              <div className="form-group">
                <label htmlFor="contacts">Contact <span>*</span></label>
                <input
                  type="tel"
                  id="contacts"
                  name="contacts"
                  value={formData.contacts}
                  onChange={handleChange}
                  placeholder="e.g. 0244000000"
                  className={errors.contacts ? "input-error" : ""}
                />
                {errors.contacts && <small className="error-message">{errors.contacts}</small>}
              </div>

              {/* ALTERNATIVE CONTACT */}
              <div className="form-group">
                <label htmlFor="alternativeContact">Alt Contact</label>
                <input
                  type="tel"
                  id="alternativeContact"
                  name="alternativeContact"
                  value={formData.alternativeContact}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={errors.alternativeContact ? "input-error" : ""}
                />
                {errors.alternativeContact && <small className="error-message">{errors.alternativeContact}</small>}
              </div>

              {/* GENDER */}
              <div className="form-group">
                <label htmlFor="gender">Gender <span>*</span></label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "input-error" : ""}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <small className="error-message">{errors.gender}</small>}
              </div>

              {/* MARITAL STATUS */}
              <div className="form-group">
                <label htmlFor="maritalStatus">Marital Status</label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              {/* ROLE */}
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Member">Member</option>
                  <option value="Leader">Leader</option>
                </select>
              </div>

              {/* DATE OF BIRTH */}
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth <span>*</span></label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? "input-error" : ""}
                />
                {errors.dateOfBirth && <small className="error-message">{errors.dateOfBirth}</small>}
              </div>

              {/* DATE OF ENTRY */}
              <div className="form-group">
                <label htmlFor="dateOfEntry">Date of Entry <span>*</span></label>
                <input
                  type="date"
                  id="dateOfEntry"
                  name="dateOfEntry"
                  value={formData.dateOfEntry}
                  onChange={handleChange}
                  className={errors.dateOfEntry ? "input-error" : ""}
                />
                {errors.dateOfEntry && <small className="error-message">{errors.dateOfEntry}</small>}
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <small className="error-message">{errors.email}</small>}
              </div>

              {/* LOCATION (Spans 2 columns) */}
              <div className="form-group span-2">
                <label htmlFor="location">Location <span>*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Tema Community 2"
                  className={errors.location ? "input-error" : ""}
                />
                {errors.location && <small className="error-message">{errors.location}</small>}
              </div>

              {/* REMARKS (Spans 3 columns) */}
              <div className="form-group span-3">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  rows="1"
                />
              </div>

              {/* SUBMIT (Spans 3 columns) */}
              <button type="submit" className="submit-btn span-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Saving...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullDetails;