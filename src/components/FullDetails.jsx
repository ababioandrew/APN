import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./FullDetails.css";

const initialFormData = {
  fullName: "",
  gender: "",
  location: "",
  dateOfBirth: "",
  dateOfEntry: "",
  contacts: "",
  remarks: "",
};

const FullDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const location = formData.location.trim();
    const contacts = formData.contacts.trim();
    const remarks = formData.remarks.trim();

    if (!fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!location) {
      newErrors.location = "Location is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }

    if (!formData.dateOfEntry) {
      newErrors.dateOfEntry = "Date of Entry is required";
    }

    if (!contacts) {
      newErrors.contacts = "Contact is required";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(contacts)) {
      newErrors.contacts = "Enter a valid contact number";
    }

    if (!remarks) {
      newErrors.remarks = "Remarks are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=================================");
    console.log("📤 FORM SUBMISSION STARTED");
    console.log("=================================");

    if (!validateForm()) {
      console.warn("❌ Form validation failed");

      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields correctly.",
        confirmButtonColor: "#04732d",
      });

      return;
    }

    setLoading(true);

    const payload = {
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      location: formData.location.trim(),
      dateOfBirth: formData.dateOfBirth,
      dateOfEntry: formData.dateOfEntry,
      contacts: formData.contacts.trim(),
      remarks: formData.remarks.trim(),
    };

    console.log("📤 API REQUEST");
    console.log("URL:", "/api/members");
    console.log("METHOD:", "POST");
    console.log("BODY:", payload);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 RESPONSE STATUS:", response.status);
      console.log("📥 RESPONSE OK:", response.ok);
      console.log(
        "📥 RESPONSE CONTENT-TYPE:",
        response.headers.get("content-type")
      );

      const result = await response.json();

      console.log("📥 RESPONSE BODY:", result);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      console.log("✅ MEMBER SAVED SUCCESSFULLY");
      console.log("✅ SAVED MEMBER:", result.member);

      Swal.fire({
        icon: "success",
        title: "Submission Successful!",
        text:
          result.message ||
          "Membership details saved successfully!",
        confirmButtonColor: "#04732d",
        confirmButtonText: "OK",
      });

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("=================================");
      console.error("❌ SUBMISSION ERROR");
      console.error("=================================");
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);

      console.log("📤 FORM SUBMISSION FINISHED");
      console.log("=================================");
    }
  };

  return (
    <div className="membership-details-container">
      <div className="membership-details-card">
        <div className="card-header">
          <h3>Membership Details</h3>
          <button 
            className="dashboard-nav-btn"
            onClick={() => navigate("/MembersDashboard")}
            type="button"
          >
            <svg className="dashboard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Dashboard</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span>*</span>
            </label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={errors.fullName ? "input-error" : ""}
            />

            {errors.fullName && (
              <small className="error-message">
                {errors.fullName}
              </small>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender">
              Gender <span>*</span>
            </label>

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

            {errors.gender && (
              <small className="error-message">
                {errors.gender}
              </small>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">
              Location <span>*</span>
            </label>

            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className={errors.location ? "input-error" : ""}
            />

            {errors.location && (
              <small className="error-message">
                {errors.location}
              </small>
            )}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">
              Date Of Birth <span>*</span>
            </label>

            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={errors.dateOfBirth ? "input-error" : ""}
            />

            {errors.dateOfBirth && (
              <small className="error-message">
                {errors.dateOfBirth}
              </small>
            )}
          </div>

          {/* Date of Entry */}
          <div className="form-group">
            <label htmlFor="dateOfEntry">
              Date of Entry <span>*</span>
            </label>

            <input
              type="date"
              id="dateOfEntry"
              name="dateOfEntry"
              value={formData.dateOfEntry}
              onChange={handleChange}
              className={errors.dateOfEntry ? "input-error" : ""}
            />

            {errors.dateOfEntry && (
              <small className="error-message">
                {errors.dateOfEntry}
              </small>
            )}
          </div>

          {/* Contacts */}
          <div className="form-group">
            <label htmlFor="contacts">
              Contacts <span>*</span>
            </label>

            <input
              type="tel"
              id="contacts"
              name="contacts"
              value={formData.contacts}
              onChange={handleChange}
              placeholder="Enter contact number"
              className={errors.contacts ? "input-error" : ""}
            />

            {errors.contacts && (
              <small className="error-message">
                {errors.contacts}
              </small>
            )}
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label htmlFor="remarks">
              Remarks <span>*</span>
            </label>

            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              rows="4"
              className={errors.remarks ? "input-error" : ""}
            />

            {errors.remarks && (
              <small className="error-message">
                {errors.remarks}
              </small>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default FullDetails;