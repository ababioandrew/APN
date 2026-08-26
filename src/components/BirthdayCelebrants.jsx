import React, { useEffect, useState } from "react";
import "./BirthdayCelebrants.css";

const BirthdayCelebrants = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const API_URL = "http://localhost:5000/api/members/birthdays";

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success) {
          setBirthdays(data.birthdays || []);
          setMonth(data.month || "");
        } else {
          setBirthdays([]);
        }
      } catch (error) {
        console.error("Failed to load birthday celebrants:", error);
        setBirthdays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  if (loading) {
    return (
      <section className="birthday-section birthday-loading">
        <div className="birthday-spinner"></div>
        <p>Checking for birthday celebrants...</p>
      </section>
    );
  }

  // Do not display the section when nobody has a birthday
  // in the current month.
  if (birthdays.length === 0) {
    return null;
  }

  const formatBirthday = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="birthday-section">
        <div className="birthday-header">
          <div>
            <span className="birthday-small-title">
              🎉 CELEBRATION
            </span>
            <h2>
              {month} Birthday Celebrants
            </h2>
            <p>
              Join us in celebrating our members born this month.
            </p>
          </div>

          <button
            className="birthday-preview-button"
            onClick={() => setShowPreview(true)}
          >
            👁 Preview
          </button>
        </div>

        <div className="birthday-grid">

          {birthdays.map((member) => (
            <div
              className="birthday-card"
              key={member.id}
            >
              <div className="birthday-icon">
                🎂
              </div>

              <div className="birthday-info">
                <h3>{member.fullName}</h3>

                <p className="birthday-date">
                  🎈 {formatBirthday(member.dateOfBirth)}
                </p>

                {member.location && (
                  <p className="birthday-location">
                    📍 {member.location}
                  </p>
                )}

                {member.age && (
                  <span className="birthday-age">
                    Turning {member.age}
                  </span>
                )}
              </div>
            </div>
          ))}

        </div>
      </section>

      {showPreview && (
        <div
          className="birthday-modal-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="birthday-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              className="birthday-close"
              onClick={() => setShowPreview(false)}
              aria-label="Close birthday preview"
            >
              ×
            </button>

            <div className="birthday-modal-icon">
              🎉
            </div>

            <h2>
              {month} Birthday Celebrants
            </h2>

            <p className="birthday-modal-subtitle">
              Let's celebrate our wonderful members!
            </p>

            <div className="birthday-preview-list">

              {birthdays.map((member) => (
                <div
                  className="birthday-preview-item"
                  key={member.id}
                >
                  <div className="preview-date">
                    {new Date(member.dateOfBirth).getDate()}
                  </div>

                  <div className="preview-details">
                    <h3>{member.fullName}</h3>

                    <p>
                      🎂 {formatBirthday(member.dateOfBirth)}
                    </p>

                    {member.location && (
                      <span>
                        📍 {member.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}

            </div>

            <div className="birthday-modal-footer">
              🎊 Happy Birthday to all our celebrants!
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default BirthdayCelebrants;