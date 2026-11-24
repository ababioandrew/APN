// src/components/ShareMeetingInvite.jsx
import React from 'react';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function ShareMeetingInvite({ meetingUrl }) {
  const shareMessage = `Join our live meeting: ${meetingUrl}`;
  
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const emailShareUrl = `mailto:?subject=Join our Live Meeting&body=${encodeURIComponent(shareMessage)}`;

  return (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', backgroundColor: '#25D366', color: '#fff',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
        }}
      >
        <FaWhatsapp size={20} /> Share on WhatsApp
      </a>

      <a
        href={emailShareUrl}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', backgroundColor: '#EA4335', color: '#fff',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
        }}
      >
        <FaEnvelope size={20} /> Share via Email
      </a>
    </div>
  );
}