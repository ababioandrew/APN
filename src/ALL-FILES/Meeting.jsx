// src/pages/Meeting.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import Footer from '../components/Footer';
import ShareMeetingInvite from '../components/ShareMeetingInvite';
import './Home.css';

export default function Meeting() {
  const [meetingUrl, setMeetingUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // <-- Initialize navigate

  // This function starts the meeting
  const startMeeting = () => {
    setIsLoading(true);
    
    // Using a static room URL for MiroTalk
    const roomName = 'answered-prayer-network';
    const mirotalkUrl = `https://sfu.mirotalk.com/${roomName}`;
    
    setTimeout(() => {
      setMeetingUrl(mirotalkUrl);
      setIsLoading(false);
    }, 500);
  };

  // --- NEW FUNCTION: Handle Ending Meeting ---
  const handleEndMeeting = () => {
    // 1. Remove the iframe (this disconnects the user from the call)
    setMeetingUrl(null);
    
    // 2. Redirect the user back to the Home page
    navigate('/');
  };

  return (
    <div className="home" style={{ padding: '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', flex: 1, width: '100%' }}>
        
        {/* Hero Content */}
        <p className="section-eyebrow">Live Video Conference</p>
        <h1 style={{ color: '#0F172A', marginBottom: '10px' }}>Answered Prayer Network Meeting Room</h1>
        <p style={{ color: '#64748B', marginBottom: '30px', fontSize: '1.1rem' }}>
          Click the button below to enter the live meeting. Share the invite link with others so they can join.
        </p>

        {/* If meetingUrl is not set, show the Start Button */}
        {!meetingUrl && (
          <div style={{ marginTop: '40px' }}>
            <button
              onClick={startMeeting}
              disabled={isLoading}
              style={{
                padding: '16px 32px',
                background: '#C49A3A',
                color: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(196, 154, 58, 0.3)',
                transition: 'transform 0.2s ease',
              }}
            >
              {isLoading ? 'Connecting...' : '🎥 Start / Join Meeting'}
            </button>
          </div>
        )}

        {/* If meetingUrl is set, show the Iframe and Share Buttons */}
        {meetingUrl && (
          <div style={{ marginTop: '30px' }}>
            
            <div style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              background: '#000',
              height: '70vh' 
            }}>
              <iframe
                allow="camera; microphone; speaker-selection; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay; picture-in-picture; screen-wake-lock"
                src={meetingUrl}
                style={{ width: '100%', height: '100%', border: 0 }}
                title="MiroTalk Video Conference"
              />
            </div>

            {/* Share Buttons */}
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ color: '#0F172A', marginBottom: '10px' }}>Invite Others to This Meeting</h3>
              <ShareMeetingInvite meetingUrl={meetingUrl} />
            </div>

            {/* End Meeting Button */}
             <div style={{ marginTop: '40px' }}>
            <Link to="/" style={{ color: '#C49A3A', fontWeight: 'bold', textDecoration: 'none' }}>
              &larr; Back to Home
            </Link>
          </div>
          </div>
        )}

        {/* Only show "Back to Home" link if meeting isn't active to avoid accidental clicks */}
        {!meetingUrl && (
          <div style={{ marginTop: '40px' }}>
            <Link to="/" style={{ color: '#C49A3A', fontWeight: 'bold', textDecoration: 'none' }}>
              &larr; Back to Home
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}