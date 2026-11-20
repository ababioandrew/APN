import React, { useEffect, useState } from "react";
import "./BirthdayCelebrants.css";

const JSONBIN_BIN_ID = process.env.REACT_APP_JSONBIN_BIN_ID || "6af8d362ac6210605a88248b";
const JSONBIN_MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY || "$2a$10$Q/2lVH/nwELkpa5V3Sf/dOkGCRhpSl46JcsO.dGv5Q1rg/F7P5VO6";
const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;
  // Try standard JS Date parsing (handles YYYY-MM-DD)
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Fallback for DD/MM/YYYY or DD-MM-YYYY
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    // Assume DD/MM/YYYY
    d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const BirthdayCelebrants = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);
        let data = null;

        // 1. Fetch directly from JSONBin
        try {
          const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: { "X-Master-Key": JSONBIN_MASTER_KEY }
          });
          if (response.ok) {
            data = await response.json();
          }
        } catch (err) {
          console.warn("JSONBin fetch failed, falling back to local storage.", err);
        }

        // 2. Fallback to LocalStorage (saved by MembersDashboard)
        if (!data) {
          const backup = localStorage.getItem("apn_dashboard_backup");
          if (backup) {
            data = JSON.parse(backup);
          }
        }

        // 3. Parse members
        let members = [];
        if (data) {
          if (data?.record?.members && Array.isArray(data.record.members)) {
            members = data.record.members;
          } else if (Array.isArray(data?.record)) {
            members = data.record;
          } else if (Array.isArray(data?.members)) {
            members = data.members;
          } else if (Array.isArray(data)) {
            members = data;
          }
        }

        processBirthdays(members);
      } catch (error) {
        console.error("Failed to load birthday celebrants:", error);
        setBirthdays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  const processBirthdays = (members) => {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    const currentDay = today.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    setMonth(monthNames[currentMonthIndex]);

    const currentMonthCelebrants = members
      .filter((member) => {
        const birthDate = parseDateSafe(member.dateOfBirth);
        if (!birthDate) return false;
        return birthDate.getMonth() === currentMonthIndex;
      })
      .map((member) => {
        const birthDate = parseDateSafe(member.dateOfBirth);
        const birthDay = birthDate.getDate();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear = 
          today.getMonth() > birthDate.getMonth() || 
          (today.getMonth() === birthDate.getMonth() && currentDay >= birthDay);
          
        if (!hasHadBirthdayThisYear) age--;

        let ageGroup = "Adult";
        if (age < 13) ageGroup = "Child";
        else if (age >= 13 && age < 18) ageGroup = "Youth";

        // Categorize
        let status = "upcoming";
        if (birthDay === currentDay) status = "today";
        else if (birthDay < currentDay) status = "past";

        return {
          ...member,
          birthDay,
          calculatedAge: age > 0 ? age : null,
          ageGroup,
          status
        };
      })
      .sort((a, b) => a.birthDay - b.birthDay);

    setBirthdays(currentMonthCelebrants);
  };

  if (loading) {
    return (
      <section className="birthday-section birthday-loading">
        <div className="birthday-spinner"></div>
        <p>Checking for birthday celebrants...</p>
      </section>
    );
  }

  // Group into Upcoming/Current and Past
  const upcoming = birthdays.filter(b => b.status === "upcoming" || b.status === "today");
  const past = birthdays.filter(b => b.status === "past");

  const formatBirthday = (dateStr) => {
    const d = parseDateSafe(dateStr);
    if (!d) return "";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

  return (
    <>
      <section className="birthday-section">
        <div className="birthday-header">
          <div>
            <span className="birthday-small-title">🎉 CELEBRATION</span>
            <h2>{month} Birthday Celebrants</h2>
            <p>Join us in celebrating our members born this month.</p>
          </div>
          {birthdays.length > 0 && (
            <button className="birthday-preview-button" onClick={() => setShowPreview(true)}>
              👁 Preview All
            </button>
          )}
        </div>

        {birthdays.length === 0 ? (
          <div className="birthday-empty">
            <p>No birthdays found for {month}.</p>
          </div>
        ) : (
          <>
            {/* UPCOMING & TODAY */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 className="birthday-group-title">⏳ Upcoming Birthdays for {month}</h3>
                <div className="birthday-grid">
                  {upcoming.map((member) => (
                    <div className={`birthday-card ${member.status === 'today' ? 'is-today' : ''}`} key={member.id || member.fullName}>
                      <div className="birthday-icon">
                        {member.status === 'today' ? '🎉' : '🎂'}
                      </div>
                      <div className="birthday-info">
                        <h3>
                          {member.fullName}
                          {member.role === "Leader" && <span title="Church Leader" style={{ marginLeft: '6px', fontSize: '1rem' }}>👑</span>}
                        </h3>
                        <p className="birthday-date">
                          🎈 {formatBirthday(member.dateOfBirth)} {member.status === 'today' && <span className="today-badge">Today!</span>}
                        </p>
                        {member.location && <p className="birthday-location">📍 {member.location}</p>}
                        
                        {member.contacts && (
                          <p className="birthday-location" style={{ marginTop: '2px', fontWeight: '600', color: '#10b981' }}>
                            📞 {member.contacts}
                          </p>
                        )}

                        <div className="birthday-badges-row">
                          {member.calculatedAge && <span className="birthday-badge age-badge">Turning {member.calculatedAge}</span>}
                          <span className="birthday-badge">{member.ageGroup}</span>
                          {member.maritalStatus && <span className="birthday-badge">{member.maritalStatus}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAST (ALREADY CELEBRATED) */}
            {past.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h3 className="birthday-group-title past-title">✅ Celebrated This Month {month}</h3>
                <div className="birthday-grid">
                  {past.map((member) => (
                    <div className="birthday-card past-celebration" key={member.id || member.fullName}>
                      <div className="birthday-icon">
                        🎂
                      </div>
                      <div className="birthday-info">
                        <h3>
                          {member.fullName}
                          {member.role === "Leader" && <span style={{ marginLeft: '6px', fontSize: '1rem' }}>👑</span>}
                        </h3>
                        <p className="birthday-date">🎈 {formatBirthday(member.dateOfBirth)}</p>
                        {member.location && <p className="birthday-location">📍 {member.location}</p>}
                        
                        {member.contacts && (
                          <p className="birthday-location" style={{ marginTop: '2px' }}>
                            📞 {member.contacts}
                          </p>
                        )}
                        
                        <div className="birthday-badges-row">
                          <span className="birthday-badge success-badge">Celebrated</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="birthday-modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="birthday-modal" onClick={(event) => event.stopPropagation()}>
            <button className="birthday-close" onClick={() => setShowPreview(false)} aria-label="Close birthday preview">×</button>
            <div className="birthday-modal-icon">🎉</div>
            <h2>{month} Birthday Celebrants</h2>
            <p className="birthday-modal-subtitle">Let's celebrate our wonderful members!</p>

            <div className="birthday-preview-list">
              {birthdays.map((member) => (
                <div className="birthday-preview-item" key={member.id || member.fullName}>
                  <div className="preview-date" style={{ background: member.status === 'today' ? '#e11d48' : member.status === 'past' ? '#94a3b8' : '#C49A3A' }}>
                    {member.birthDay}
                  </div>
                  <div className="preview-details">
                    <h3>
                      {member.fullName}
                      {member.role === "Leader" && <span style={{ marginLeft: '6px', fontSize: '0.9rem' }}>👑</span>}
                    </h3>
                    <p>🎂 {formatBirthday(member.dateOfBirth)}</p>
                    {member.location && <span style={{ display: 'block', marginTop: '4px' }}>📍 {member.location}</span>}
                    {member.contacts && <span style={{ display: 'block', marginTop: '4px', color: '#10b981', fontWeight: 'bold' }}>📞 {member.contacts}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="birthday-modal-footer">🎊 Happy Birthday to all our celebrants!</div>
          </div>
        </div>
      )}
    </>
  );
};

export default BirthdayCelebrants;