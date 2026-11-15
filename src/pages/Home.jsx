import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaComments,
  FaVideo,
  FaWhatsapp,
  FaPaperclip,
  FaTimes,
  FaDonate,
  FaPrayingHands,
  FaBible,
  FaTimesCircle,
  FaBullhorn,
} from 'react-icons/fa';

import Footer from '../components/Footer';
import BirthdayCelebrants from '../components/BirthdayCelebrants'; 

import { useInView, useCountUp } from '../hooks/useInView';
import localVideo1 from '../assets/videos/sermon1.mp4';
import localVideo2 from '../assets/videos/sermon2.mp4';

import './Home.css';

import commercialVid1 from '../assets/videos/commercial.mp4';
import commercialVid2 from '../assets/videos/commercial.mp4';
import commercialVid3 from '../assets/videos/commercial.mp4';
import commercialVid4 from '../assets/videos/commercial.mp4';
import commercialVid5 from '../assets/videos/commercial.mp4';
import commercialVid6 from '../assets/videos/commercial.mp4';
import commercialVid7 from '../assets/videos/commercial.mp4';

import APNIcon from '../icons/APN.png';
import apnImage16 from '../assets/images/menthorShip.jpeg';

/* ============ YOUTUBE / PLAYLIST HELPERS ============ */

const parseYouTubeUrl = (url) => {
  if (!url) return { embedUrl: '', isYouTube: false, isPlaylist: false };
  const trimmed = url.trim();

  if (trimmed.includes('/embed/')) {
    return {
      embedUrl: trimmed,
      isYouTube: true,
      isPlaylist: trimmed.includes('/embed/videoseries'),
    };
  }

  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const isPlaylistPage =
    /\/playlist(\?|$)/.test(trimmed) || (listMatch && !trimmed.includes('watch'));

  if (isPlaylistPage && listMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${listMatch[1]}`,
      isYouTube: true,
      isPlaylist: true,
    };
  }

  const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (vMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${vMatch[1]}`,
      isYouTube: true,
      isPlaylist: false,
    };
  }

  const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}`,
      isYouTube: true,
      isPlaylist: false,
    };
  }

  const beMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (beMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${beMatch[1]}`,
      isYouTube: true,
      isPlaylist: false,
    };
  }

  return { embedUrl: '', isYouTube: false, isPlaylist: false };
};

const normalizeVideo = (item) => {
  const base =
    typeof item === 'string' ? { title: item, alt: item, src: item } : { ...item };
  const url = base.src || base.url || '';
  const parsed = parseYouTubeUrl(url);

  return {
    type: 'video',
    ...base,
    src: url,
    embedUrl: base.embedUrl || parsed.embedUrl,
    isYouTube: base.isYouTube !== undefined ? base.isYouTube : parsed.isYouTube,
    isPlaylist: base.isPlaylist !== undefined ? base.isPlaylist : parsed.isPlaylist,
    title: base.title || base.name || 'Untitled Video',
    alt: base.alt || base.title || 'Video',
  };
};

/* ============ SHARED STYLES ============ */

const titleBarStyle = {
  background: '#F8FAFC',
  color: '#0F172A',
  padding: '14px 18px',
  borderRadius: '10px',
  fontWeight: 800,
  fontSize: '1.05rem',
  marginBottom: '14px',
  lineHeight: 1.4,
  letterSpacing: '0.3px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  border: '2px solid #C49A3A',
};

const sectionTitleStyle = {
  background: '#F8FAFC',
  color: '#0F172A',
  padding: '14px 18px',
  borderRadius: '10px',
  fontWeight: 800,
  fontSize: '1.2rem',
  marginBottom: '20px',
  textAlign: 'center',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  border: '2px solid #C49A3A',
};

const churchSearchTheme = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#F8FAFC',
    borderColor: state.isFocused ? '#C49A3A' : '#CBD5E1',
    borderRadius: '10px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(196, 154, 58, 0.18)' : 'none',
    '&:hover': { borderColor: '#C49A3A' },
    color: '#0F172A',
    transition: 'all 0.2s ease',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#FFFFFF',
    border: '2px solid #C49A3A',
    borderRadius: '0 0 10px 10px',
    maxHeight: '340px',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#C49A3A' : state.isFocused ? '#F1F5F9' : '#FFFFFF',
    color: '#0F172A',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: 1.4,
    fontWeight: 600,
    borderBottom: '1px solid #E2E8F0',
    '&:active': { backgroundColor: '#C49A3A', color: '#0F172A' },
  }),
  singleValue: (base) => ({ ...base, color: '#0F172A', fontWeight: 600 }),
  placeholder: (base) => ({ ...base, color: '#64748B', fontWeight: 400 }),
  input: (base) => ({ ...base, color: '#0F172A' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#C49A3A' : '#64748B',
    '&:hover': { color: '#17365D' },
  }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: '#E2E8F0' }),
};

const cmArr = [
  commercialVid1,
  commercialVid2,
  commercialVid3,
  commercialVid4,
  commercialVid5,
  commercialVid6,
  commercialVid7,
];

const marqueeMessages = [
  '✨ Special Event This Sunday • Youth Fellowship • Community Outreach • Join Us! ✨',
  '✨ Answered Prayer Network • A place Where destinies are restored and rearranged. • Pray Until the soul cracks ✨',
  '✨ 30 Days of Menthorship Through The Word. Listen discover and share. God richly bless you ✨',
];

const upcomingEvents = [
  { id: 1, title: 'Commanding Your Week', date: 'Every Sunday', time: '3:00 PM', location: 'Main Sanctuary' },
  { id: 2, title: 'Sunday Celebration Service', date: 'Nov 5, 2026', time: '9:00 AM', location: 'Main Sanctuary' },
  { id: 3, title: 'Night of Answered Prayers', date: 'Nov 20, 2026', time: '10:00 PM', location: 'Main Sanctuary' },
];

const dailyVerses = [
  { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', reference: 'Jeremiah 29:11' },
  { text: 'I can do all things through Christ who strengthens me.', reference: 'Philippians 4:13' },
  { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1' },
  { text: 'Trust in the Lord with all your heart and lean not on your own understanding.', reference: 'Proverbs 3:5' },
  { text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', reference: 'Joshua 1:9' },
];

const initialPrayers = [
  { id: 1, name: 'Anonymous', request: "Please pray for my family's health and provision.", prayers: 24 },
  { id: 2, name: 'Sarah M.', request: 'Praying for a breakthrough in my career and peace of mind.', prayers: 18 },
  { id: 3, name: 'Anonymous', request: 'Agreeing with me for my healing and restoration.', prayers: 32 },
];

const localVideos = [
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=pHvM7OhRGJc',
    title: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
    channel: 'ANSWERED PRAYER NETWORK-GH',
    duration: '2:07:09',
    alt: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
  },
  {
    title: '27th Oct 2026 - DEALING WITH DEMONIC RESISTANCE',
    src: 'https://www.youtube.com/watch?v=JE3rARGfSyg',
    alt: 'Commanding Your Week',
  },
  {
    title: '18th Oct 2026',
    src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE',
    alt: 'Commanding Your Week',
  },
].map(normalizeVideo);

const commandingWeekVideos = [
  {
    title: 'Commanding Your Week',
    src: 'https://youtube.com/shorts/A7usTs1ds5k',
    alt: 'Commanding Your Week',
  },
  {
    title: 'Commanding Your Week - Part 2',
    src: 'https://youtube.com/shorts/dbqnn792Y7M',
    alt: 'Commanding Your Week - Part 2',
  },
  {
    title: 'Commanding Your Week — Playlist 1',
    src: 'https://youtube.com/playlist?list=PLrGWT1KtmLdsamSespChS7POtRlZ1xp62&si=-D07ej-PIR4MnNXr',
    alt: 'Commanding Your Week Playlist 1',
  },
  {
    title: 'Commanding Your Week — Playlist 2',
    src: 'https://youtube.com/playlist?list=PLrGWT1KtmLdsc8gWpuSsKWQVu3XCfYpFM&si=mNcxwp0ObBb0YJb-',
    alt: 'Commanding Your Week Playlist 2',
  },
  {
    title: 'Commanding Your Week — Playlist 3',
    src: 'https://youtube.com/playlist?list=PLrGWT1KtmLduCDS3bpThvD8sQT8yLUde_&si=-ih68tkrnmAU7JAv',
    alt: 'Commanding Your Week Playlist 3',
  },
].map(normalizeVideo);

const localAudios = [
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1dIp-bszTMGFEB3y6LNbwWj8IeGD7f2Cp', title: '🎓 Lord teach me your ways', alt: 'Lord teach me your ways', fileName: 'Lord teach me your ways', local: true },
  // ... Keep all your other audios here ...
];

const ministries = [
  { icon: APNIcon, title: 'Worship Ministry', desc: 'Join us in worship as we lift our hearts to God through praise, prayer, and the teaching of His Word.' },
  { icon: APNIcon, title: 'Youth Ministry', desc: 'A welcoming environment where young people can grow in faith, build friendships, and discover their purpose in Christ.' },
  { icon: APNIcon, title: 'Prayer Ministry', desc: 'Come together with us in prayer as we seek God, encourage one another, and stand together in faith.' },
  { icon: APNIcon, title: 'Community Ministry', desc: 'Serving our community with compassion, kindness, and practical support while sharing the love of Christ.' },
];

const mediaItems = [
  { type: 'image', src: apnImage16, alt: 'Church Event 16', title: 'Church Event 16' },
  { type: 'video', src: 'https://youtube.com/shorts/dbqnn792Y7M', embedUrl: 'https://www.youtube.com/embed/dbqnn792Y7M', isYouTube: true, alt: 'Sunday Sermon', title: 'Sunday Sermon' },
  { type: 'video', src: 'https://youtube.com/shorts/A7usTs1ds5k', embedUrl: 'https://www.youtube.com/embed/A7usTs1ds5k', isYouTube: true, alt: 'Commanding your week', title: 'Commanding your week' },
  { type: 'video', src: 'https://youtube.com/shorts/mbcNqd7bJGs', embedUrl: 'https://www.youtube.com/embed/mbcNqd7bJGs', isYouTube: true, alt: 'Community Outreach', title: 'Community Outreach' },
  { type: 'video', src: 'https://www.youtube.com/watch?v=Z5QRcyom9bw', embedUrl: 'https://www.youtube.com/embed/Z5QRcyom9bw', isYouTube: true, alt: 'Community Outreach', title: 'Community Outreach' },
  { type: 'video', src: 'https://www.youtube.com/watch?v=JgWr4jljWXU', embedUrl: 'https://www.youtube.com/embed/JgWr4jljWXU', isYouTube: true, alt: 'Community Outreach', title: 'Community Outreach' },
  {
    type: 'commandingWeek',
    title: 'Commanding Your Week Videos',
    alt: 'Commanding Your Week Videos',
    videos: commandingWeekVideos,
  },
  ...localVideos,
  ...localAudios,
];

const statsData = [
  { number: '∞', label: 'God’s Grace' },
  { number: '1', label: 'Family In Christ' },
  { number: '1', label: 'Body Of Christ' },
  { number: '24/7', label: 'Prayer & Faith' },
];

const versesOfTheDay = [
  { text: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'Trust in the LORD with all your heart, and lean not on your own understanding.', ref: 'Proverbs 3:5' },
  { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
  { text: 'The joy of the LORD is your strength.', ref: 'Nehemiah 8:10' },
  { text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.', ref: 'Jeremiah 29:11' },
  { text: 'But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles.', ref: 'Isaiah 40:31' },
  { text: 'The LORD is my light and my salvation; whom shall I fear?', ref: 'Psalm 27:1' },
  { text: 'Cast all your anxiety on him because he cares for you.', ref: '1 Peter 5:7' },
  { text: 'Delight yourself in the LORD, and he will give you the desires of your heart.', ref: 'Psalm 37:4' },
  { text: 'The name of the LORD is a strong tower; the righteous man runs into it and is safe.', ref: 'Proverbs 18:10' },
  { text: 'If God is for us, who can be against us?', ref: 'Romans 8:31' },
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', ref: 'Philippians 4:6' },
  { text: 'Your word is a lamp for my feet, a light on my path.', ref: 'Psalm 119:105' },
  { text: 'And we know that in all things God works for the good of those who love him.', ref: 'Romans 8:28' },
];

const testimonials = [
  { name: 'Sister Akosua', role: 'Member since 2020', quote: 'I came broken, but God used APN to restore my marriage and give me peace that surpasses understanding.' },
  { name: 'Brother Kwame', role: 'Youth Leader', quote: 'The youth ministry here gave me a purpose and a family that prays with me through every season of life.' },
  { name: 'Mama Adjoa', role: 'Prayer Warrior', quote: 'When I joined the midnight prayer chain, my son\'s health turned around within weeks. God is faithful!' },
];

const givingOptions = [
  { icon: '📱', name: 'MTN Mobile Money', number: '+233 541215212', holder: 'Answered Prayer Network' },
  { icon: '📱', name: 'Vodafone Cash', number: '+233 207464426', holder: 'Answered Prayer Network' },
  { icon: '🏦', name: 'Bank Transfer', number: 'GCB • 1234567890', holder: 'Answered Prayer Network' },
];

const leadershipTeam = [
  { name: 'Pastor Enoch', role: 'Senior Pastor', img: apnImage16, bio: 'A shepherd with a passion for prayer, the prophetic, and seeing destinies restored.' },
  { name: 'Elder Emma', role: 'Associate Pastor', img: apnImage16, bio: 'Overseeing youth, worship, and discipleship across the ministry.' },
  { name: 'Deacon Amos', role: 'Prayer Director', img: apnImage16, bio: 'Guiding the midnight prayer chain and intercession teams.' },
];

const smallGroups = [
  { icon: '⚔️', name: 'Men of Valor', when: 'Saturdays 7PM', where: 'Main Sanctuary' },
  { icon: '🌸', name: 'Women of Grace', when: 'Wednesdays 6PM', where: 'Fellowship Hall' },
  { icon: '🔥', name: 'Youth Fire', when: 'Fridays 5PM', where: 'Youth Center' },
  { icon: '💍', name: 'Couples in Christ', when: 'Sundays 4PM', where: 'Room 204' },
];

const visitFaqs = [
  { q: 'What should I wear?', a: 'Come as you are — casual, traditional, or formal. God cares about your heart, not your outfit.' },
  { q: 'Where do I park?', a: 'Free parking is available on-site with attendants to guide you.' },
  { q: 'What about my kids?', a: 'We have safe, age-appropriate children and youth classes during every service.' },
  { q: 'How long is the service?', a: 'About 2 hours of worship, prayer, and the Word.' },
];

/* ============ COMPONENTS ============ */

function SearchableSelect({ id, label, value, onChange, options, placeholder, noResultsText, styles = {} }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setQuery('');
    } else if (selectedOption) {
      setQuery(selectedOption.label);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const filteredOptions =
    normalizedQuery === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedQuery));

  const highlightMatch = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const handleSelect = (opt) => {
    onChange(opt.value);
    setQuery(opt.label);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (val === '') onChange('');
  };

  const handleFocus = () => {
    setOpen(true);
    if (selectedOption) setQuery('');
  };

  const handleBlur = () => {
    if (selectedOption) setQuery(selectedOption.label);
    else setQuery('');
    setOpen(false);
  };

  const getStyle = (key, base, state = {}) => {
    if (styles[key]) {
      return typeof styles[key] === 'function' ? styles[key](base, state) : { ...base, ...styles[key] };
    }
    return base;
  };

  const controlStyle = getStyle('control', {
    width: '100%', boxSizing: 'border-box', minHeight: '52px', padding: '0 16px',
    borderRadius: '12px', border: '2px solid #ddd', backgroundColor: '#fff',
    color: '#0F172A', fontSize: '1rem', fontWeight: '600', outline: 'none', transition: 'all 0.3s ease',
  });

  const singleValueStyle = getStyle('singleValue', { color: '#0F172A' });
  const placeholderStyle = getStyle('placeholder', { color: '#888' });

  return (
    <div className="media-control-group" ref={containerRef} style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', color: '#0F172A', fontWeight: 800, fontSize: '1rem', marginBottom: '10px', letterSpacing: '0.3px', lineHeight: 1.4 }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleInputChange}
        onClick={handleFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        style={{ ...controlStyle, color: singleValueStyle.color, '--placeholder-color': placeholderStyle.color }}
      />
      {open && (
        <ul style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100, backgroundColor: '#FFFFFF', border: '2px solid #C49A3A', borderRadius: '10px', maxHeight: '320px', overflowY: 'auto', margin: 0, padding: '0', listStyle: 'none', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)', marginTop: '0px' }} role="listbox" onMouseDown={(e) => e.preventDefault()}>
          {filteredOptions.length === 0 ? (
            <li style={{ padding: '16px', color: '#64748B', textAlign: 'center', fontWeight: 600 }}>
              {noResultsText || 'No results found'}
            </li>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                  style={{
                    padding: '14px 16px', cursor: 'pointer', fontSize: '0.95rem', lineHeight: 1.4, fontWeight: 600,
                    whiteSpace: 'normal', wordBreak: 'break-word',
                    backgroundColor: isSelected ? '#C49A3A' : '#FFFFFF', color: '#0F172A',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  {highlightMatch(opt.label, query)}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

function VideoEmbed({ video }) {
  if (!video) return null;
  return (
    <div className="selected-video" style={{ marginTop: '20px' }}>
      <div style={titleBarStyle}>{video.title}</div>
      {video.isYouTube ? (
        <iframe
          width="100%"
          height="315"
          src={video.embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video key={video.src} width="100%" controls preload="metadata">
          <source src={video.src} />
        </video>
      )}
    </div>
  );
}

function StatItem({ number, label }) {
  const [ref, isVisible] = useInView({ threshold: 0.3 });
  const isStatic = number === '∞' || number === '24/7';
  const count = useCountUp(number, 1800, isVisible && !isStatic);
  const displayValue = isStatic ? number : count;

  return (
    <div className="stat-item" ref={ref}>
      <span className={`stat-number ${isVisible ? 'visible' : ''}`}>{displayValue}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Countdown({ target }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
      {Object.entries(t).map(([k, v]) => (
        <div key={k} style={{ textAlign: 'center', minWidth: 72, padding: '12px 8px', background: 'rgba(196,154,58,0.12)', borderRadius: 10, border: '1px solid rgba(196,154,58,0.35)' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#C49A3A', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{k.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[idx];
  return (
    <section style={{ padding: '70px 20px', background: '#17365D', color: '#fff' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <p className="section-eyebrow" style={{ color: '#C49A3A' }}>Testimonies</p>
        <h2 style={{ fontSize: '2rem', color: '#fff', margin: '10px 0 30px', fontFamily: "'Playfair Display', serif" }}>Lives Changed by Grace</h2>
        <div style={{ fontSize: 60, color: '#C49A3A', lineHeight: 0.5, marginBottom: 10 }}>“</div>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, fontStyle: 'italic', margin: '0 0 20px', minHeight: 90 }}>{t.quote}</p>
        <p style={{ fontWeight: 700, color: '#C49A3A', margin: 0 }}>{t.name}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', margin: '4px 0 24px' }}>{t.role}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Testimony ${i + 1}`}
              style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === idx ? '#C49A3A' : 'rgba(255,255,255,.3)', padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerseOfDay() {
  const todayIndex = new Date().getDate() % versesOfTheDay.length;
  const v = versesOfTheDay[todayIndex];
  return (
    <section style={{ padding: '50px 20px', background: 'linear-gradient(135deg,#fffdf7,#f8f5ed)', textAlign: 'center' }}>
      <p className="section-eyebrow">Verse of the Day</p>
      <blockquote style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#0F172A', maxWidth: 700, margin: '20px auto', fontFamily: "'Playfair Display', serif", lineHeight: 1.5 }}>
        “{v.text}”
      </blockquote>
      <p style={{ color: '#C49A3A', fontWeight: 800, letterSpacing: 1, margin: 0 }}>— {v.ref}</p>
    </section>
  );
}

function FirstVisitFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: '70px 20px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="section-eyebrow">First Time?</p>
          <h2 style={{ color: '#0F172A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>What to Expect</h2>
          <span className="gold-rule centered" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visitFaqs.map((f, i) => (
            <div key={f.q} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)}
                style={{ width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', textAlign: 'left', fontWeight: 700, fontSize: '1rem', color: '#0F172A', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {f.q}
                <span style={{ color: '#C49A3A', fontSize: 20 }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 16px', color: '#64748B', lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ MAIN HOME COMPONENT ============ */

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState('');
  const [selectedCommandingWeekIndex, setSelectedCommandingWeekIndex] = useState('');
  const [selectedSermonVideoIndex, setSelectedSermonVideoIndex] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [showGiveModal, setShowGiveModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', guests: 1 });
  const [verseOfTheDay] = useState(
    () => dailyVerses[Math.floor(Math.random() * dailyVerses.length)]
  );

  const [prayerForm, setPrayerForm] = useState({ name: '', email: '', message: '' });
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [prayerWall, setPrayerWall] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('apn_prayers') || 'null');
      if (saved && saved.length) return saved;
      return initialPrayers.map((p) => ({
        id: p.id,
        name: p.name,
        text: p.request,
        request: p.request,
        prayedFor: p.prayers || 0,
        date: new Date().toISOString(),
      }));
    } catch {
      return initialPrayers.map((p) => ({
        id: p.id,
        name: p.name,
        text: p.request,
        request: p.request,
        prayedFor: p.prayers || 0,
        date: new Date().toISOString(),
      }));
    }
  });
  const [prayedFor, setPrayedFor] = useState(() => {
    try { return JSON.parse(localStorage.getItem('apn_prayed') || '{}'); } catch { return {}; }
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [showTop, setShowTop] = useState(false);

  const [liveAnnouncements, setLiveAnnouncements] = useState([]); // <-- NEW STATE

  // Fetch Announcements on Mount (DIRECT JSONBIN CONNECTION)
  useEffect(() => {
    const fetchLiveAnnouncements = async () => {
      try {
        const JSONBIN_BIN_ID = process.env.REACT_APP_JSONBIN_BIN_ID || "6af8d362ac6210605a88248b";
        const JSONBIN_MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY || "$2a$10$Q/2lVH/nwELkpa5V3Sf/dOkGCRhpSl46JcsO.dGv5Q1rg/F7P5VO6";

        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { "X-Master-Key": JSONBIN_MASTER_KEY }
        });
        
        if (response.ok) {
          const data = await response.json();
          const announcementsList = data?.record?.announcements || [];
          announcementsList.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLiveAnnouncements(announcementsList.slice(0, 3)); 
          return;
        }
      } catch (err) {
        console.warn("Could not fetch live announcements from JSONBin.", err);
      }

      try {
        const backup = JSON.parse(localStorage.getItem('apn_dashboard_backup') || '{}');
        if (backup.announcements && Array.isArray(backup.announcements)) {
          const sorted = [...backup.announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
          setLiveAnnouncements(sorted.slice(0, 3));
        }
      } catch (e) {
        console.error("Fallback local storage failed", e);
      }
    };

    fetchLiveAnnouncements();
  }, []);

  const playableMedia = mediaItems.filter((item) => item.type === 'video' || item.type === 'audio');
  const [selectedMediaIndex] = useState(0);

  const commandingWeekItem = mediaItems.find((item) => item.type === 'commandingWeek');
  const audioItems = mediaItems.filter((item) => item.type === 'audio');
  const imageItems = mediaItems.filter((item) => item.type === 'image');

  const isSingleImage = imageItems.length === 1;

  const selectedAudio = selectedAudioIndex !== '' ? audioItems[selectedAudioIndex] : null;

  const selectedCommandingWeekVideo =
    selectedCommandingWeekIndex !== '' &&
      commandingWeekItem?.videos?.[selectedCommandingWeekIndex]
      ? commandingWeekItem.videos[selectedCommandingWeekIndex]
      : null;

  const selectedSermonVideo =
    selectedSermonVideoIndex !== '' && localVideos[selectedSermonVideoIndex]
      ? localVideos[selectedSermonVideoIndex]
      : null;

  const [showCommercial, setShowCommercial] = useState(false);
  const [commercialUrl, setCommercialUrl] = useState(null);
  const commercialVideoRef = useRef(null);
  const commercialTimeoutRef = useRef(null);
  const commercialShowingRef = useRef(false);

  const commercialAudioRef = useRef(null);
  const audioRef = useRef(null);

  const [randomMessage] = useState(() => {
    return marqueeMessages[Math.floor(Math.random() * marqueeMessages.length)];
  });

  const selectedMedia = playableMedia[selectedMediaIndex] || null;

  const nextService = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7;
    next.setDate(now.getDate() + daysUntilSunday);
    next.setHours(9, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 7);
    return next;
  }, []);

  useEffect(() => {
    const unlockAudio = async () => {
      if (commercialAudioRef.current) {
        try {
          commercialAudioRef.current.volume = 0;
          await commercialAudioRef.current.play();
          commercialAudioRef.current.pause();
          commercialAudioRef.current.currentTime = 0;
        } catch {
          console.warn('Browser requires user interaction before audio can play.');
        }
      }
    };
    unlockAudio();
  }, []);

  useEffect(() => {
    if (imageItems.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === imageItems.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [imageItems.length]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getDriveFileId = (src) => {
    if (!src) return '';
    const match = src.match(/id=([a-zA-Z0-9_-]+)/) || src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  };

  const getAudioDownloadUrl = (src) => {
    if (!src) return '';
    if (src.includes('drive.google.com')) {
      const id = getDriveFileId(src);
      if (id) {
        return `https://drive.google.com/uc?export=download&confirm=t&id=${id}`;
      }
    }
    return src;
  };

  const closeCommercial = () => {
    commercialShowingRef.current = false;
    if (commercialTimeoutRef.current) {
      clearTimeout(commercialTimeoutRef.current);
      commercialTimeoutRef.current = null;
    }
    if (commercialVideoRef.current) {
      commercialVideoRef.current.pause();
      commercialVideoRef.current.currentTime = 0;
    }
    if (commercialAudioRef.current) {
      commercialAudioRef.current.pause();
      commercialAudioRef.current.currentTime = 0;
    }
    setShowCommercial(false);
    setCommercialUrl(null);
  };

  const startCommercial = () => {
    if (commercialShowingRef.current || !cmArr || cmArr.length === 0) return;
    commercialShowingRef.current = true;
    const randomIndex = Math.floor(Math.random() * cmArr.length);
    setCommercialUrl(cmArr[randomIndex]);
    setShowCommercial(true);
    commercialTimeoutRef.current = setTimeout(() => {
      closeCommercial();
    }, 10000);
  };

  useEffect(() => {
    const timer = setTimeout(() => startCommercial(), 5000);
    return () => {
      clearTimeout(timer);
      if (commercialTimeoutRef.current) clearTimeout(commercialTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showCommercial || !commercialUrl) return;
    if (commercialVideoRef.current) {
      const video = commercialVideoRef.current;
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      video.play().catch((error) => {
        console.warn('⚠️ Commercial video autoplay was blocked:', error);
      });
    }
    if (commercialAudioRef.current) {
      const audio = commercialAudioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.3;
      audio.play().catch((error) => {
        console.warn('⚠️ Commercial audio autoplay was blocked:', error);
      });
    }
  }, [showCommercial, commercialUrl]);

  useEffect(() => {
    if (!selectedAudio || !audioRef.current) return;
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn('⚠️ Audio autoplay was blocked by the browser:', error);
    });
  }, [selectedAudio]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };
  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    if (!prayerForm.message.trim()) return;
    setPrayerStatus('submitting');

    const entry = {
      id: Date.now(),
      name: prayerForm.name.trim() || 'Anonymous',
      text: prayerForm.message.trim(),
      request: prayerForm.message.trim(),
      prayedFor: 0,
      date: new Date().toISOString(),
    };
    const newWall = [entry, ...prayerWall].slice(0, 20);
    setPrayerWall(newWall);
    try { localStorage.setItem('apn_prayers', JSON.stringify(newWall)); } catch {}

    const message =
      `*New Prayer Request*\n\n` +
      `*Name:* ${entry.name}\n` +
      `*Email:* ${prayerForm.email || 'Not provided'}\n\n` +
      `*Prayer Request:*\n${entry.text}`;

    if (selectedFiles.length > 0) {
      if (navigator.canShare && navigator.canShare({ files: selectedFiles })) {
        try {
          await navigator.share({ title: 'Prayer Request', text: message, files: selectedFiles });
        } catch (error) {
          console.log('Share failed or was cancelled', error);
        }
      } else {
        alert(
          "Your device or browser does not support attaching files directly via web links. The prayer text will be sent to WhatsApp, but you will need to manually attach the files once WhatsApp opens."
        );
      }
    }

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '23351215212';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setPrayerStatus('success');
    setPrayerForm({ name: '', email: '', message: '' });
    setSelectedFiles([]);
    setTimeout(() => setPrayerStatus(null), 6000);
  };

  const handlePrayedFor = (id) => {
    if (prayedFor[id]) return;
    const newPrayed = { ...prayedFor, [id]: true };
    setPrayedFor(newPrayed);
    try { localStorage.setItem('apn_prayed', JSON.stringify(newPrayed)); } catch {}
    const newWall = prayerWall.map((p) =>
      p.id === id ? { ...p, prayedFor: (p.prayedFor || 0) + 1, prayers: (p.prayers || 0) + 1 } : p
    );
    setPrayerWall(newWall);
    try { localStorage.setItem('apn_prayers', JSON.stringify(newWall)); } catch {}
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    alert(
      `✅ Seat reserved for ${rsvpData.name} (${rsvpData.guests} guest(s)) for "${selectedEvent?.title}". We will email you at ${rsvpData.email}.`
    );
    setShowRsvpModal(false);
    setRsvpData({ name: '', email: '', guests: 1 });
    setSelectedEvent(null);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus(null), 5000);
  };

  const [ministriesRef, ministriesVisible] = useInView({ threshold: 0.1 });
  const [welcomeRef, welcomeVisible] = useInView({ threshold: 0.2 });
  const [whyTextRef, whyTextVisible] = useInView({ threshold: 0.2 });
  const [whyImgRef, whyImgVisible] = useInView({ threshold: 0.2 });

  return (
    <>
      {showGiveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowGiveModal(false)}>
              <FaTimesCircle />
            </button>
            <h2 className="modal-title">Give & Support</h2>
            <p className="modal-desc">
              Your generosity helps us spread the Gospel and serve our community.
            </p>

            <div className="give-number-box">
              <span className="give-label">Send to Mobile Money / WhatsApp:</span>
              <strong className="give-number">233 54 121 5212</strong>
            </div>

            <p className="give-notice">
              "You can send to 233 54 121 5212. Kindly add a reference. God bless you!"
            </p>

            <button
              className="copy-number-btn"
              onClick={() => {
                navigator.clipboard.writeText('233541215212');
                alert('Phone number copied to clipboard!');
              }}
            >
              📋 Copy Number
            </button>
          </div>
        </div>
      )}

      {showRsvpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowRsvpModal(false)}>
              <FaTimesCircle />
            </button>
            <h2 className="modal-title">Reserve Your Seat</h2>
            <h3 className="modal-subtitle">{selectedEvent?.title}</h3>
            <p className="modal-desc">
              📅 {selectedEvent?.date} | ⏰ {selectedEvent?.time}
            </p>
            <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
              <input
                type="text"
                placeholder="Your Full Name"
                required
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email Address"
                required
                value={rsvpData.email}
                onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
              />
              <input
                type="number"
                min="1"
                placeholder="Number of Guests"
                required
                value={rsvpData.guests}
                onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
              />
              <button type="submit" className="rsvp-submit-btn">
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {showCommercial && commercialUrl && (
        <div className="commercial-overlay" role="dialog" aria-label="Advertisement">
          <video
            ref={commercialVideoRef}
            className="commercial-video"
            src={commercialUrl}
            autoPlay
            playsInline
            preload="auto"
            controls={false}
          />
          <div className="commercial-timer">Advertisement</div>
          <button
            onClick={closeCommercial}
            aria-label="Skip advertisement"
            style={{
              position: 'absolute', bottom: 20, right: 20,
              padding: '10px 18px',
              background: 'rgba(0,0,0,0.7)', color: '#fff',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: 8, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', zIndex: 1000000,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C49A3A'; e.currentTarget.style.borderColor = '#C49A3A'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
          >
            Skip Ad ✕
          </button>
        </div>
      )}

      <audio
        ref={commercialAudioRef}
        src="/audios/commercial.mp3"
        preload="auto"
        style={{ display: 'none' }}
      />

      <main className="home">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="section-eyebrow hero-anim-eyebrow">Welcome To Answered Prayer Network</p>
            <h1 className="hero-title hero-anim-title">
              A Place To Worship<br />Grow &amp; Belong
            </h1>
            <p className="hero-desc hero-anim-desc">
              We are a community of believers committed to following Jesus Christ, growing in faith, serving others, and sharing the love of God with our community.
            </p>
            <div className="hero-actions">
              <Link to="/about" className="btn-outline-white hero-anim-btn">Discover Answered Prayer Network</Link>
              <Link to="/contact" className="btn-gold hero-anim-btn">Plan Your Visit</Link>
              <Link to="/meeting" className="btn-gold hero-anim-btn">🎥 Join Live Meeting</Link>
            </div>
          </div>
        </section>

        <section className="adverts">
          <marquee behavior="scroll" direction="left" scrollamount="6">{randomMessage}</marquee>
        </section>

        <BirthdayCelebrants />

        {/* LIVE ANNOUNCEMENTS SECTION */}
        {liveAnnouncements.length > 0 && (
          <section className="home-announcements-section">
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <p className="section-eyebrow" style={{ color: '#C49A3A' }}>
                  <FaBullhorn style={{ marginRight: '8px' }} /> Notice Board
                </p>
                <h2 style={{ color: '#0F172A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>
                  Church Announcements
                </h2>
                <span className="gold-rule centered" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {liveAnnouncements.map((item, index) => (
                  <div key={item.id || index} className="public-announcement-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <div style={{ background: '#FFF7ED', color: '#C49A3A', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaBullhorn size={18} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '1px' }}>
                        {item.date || 'Recent'}
                      </span>
                    </div>
                    <h3 style={{ color: '#0F172A', fontSize: '1.2rem', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LIVE STREAM + COUNTDOWN */}
        <section style={{ padding: '70px 20px', background: 'linear-gradient(135deg,#0F172A,#17365D)', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-eyebrow" style={{ color: '#C49A3A' }}>Join Us Live</p>
            <h2 style={{ fontSize: '2rem', margin: '10px 0', color: '#fff', fontFamily: "'Playfair Display', serif" }}>
              Next Sunday Service
            </h2>
            <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: 10 }}>
              Streaming live every Sunday at 9:00 AM GMT
            </p>
            <Countdown target={nextService} />
            <div style={{ marginTop: 30 }}>
              <a
                href="https://www.youtube.com/@YourChannel/live"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  background: '#C49A3A',
                  color: '#0F172A',
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(196,154,58,0.35)',
                  transition: 'transform .2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ▶ Watch Live on YouTube
              </a>
            </div>
          </div>
        </section>

        <VerseOfDay />

        {/* MEDIA SECTION */}
        <section className="media-section">
          <div className="media-columns">
            <div className="media-column videos">
              {!isSingleImage && (
                <div className="media-selector-card" style={{ marginBottom: '24px' }}>
                  <h2 className="media-selector-title" style={sectionTitleStyle}>Media Pictures</h2>
                  <div className="media-control-group">
                    <label
                      htmlFor="picture-select"
                      style={{
                        display: 'block', background: '#F8FAFC', color: '#0F172A',
                        padding: '12px 16px', borderRadius: '10px', fontWeight: 800,
                        fontSize: '1rem', marginBottom: '10px', letterSpacing: '0.3px',
                        lineHeight: 1.4, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                        border: '2px solid #C49A3A',
                      }}
                    >
                      🖼️ Select a picture
                    </label>
                    <select
                      id="picture-select"
                      value={selectedImageIndex}
                      onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
                    >
                      {imageItems.map((item, index) => (
                        <option value={index} key={index}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="media-selector-card">
                <h2 className="media-selector-title" style={sectionTitleStyle}>Media Player</h2>

                <SearchableSelect
                  id="audio-select"
                  label="🎶 30 Days of Mentorship. Listen & Grow in the Word"
                  value={selectedAudioIndex}
                  onChange={setSelectedAudioIndex}
                  options={audioItems.map((item, index) => ({ value: index, label: item.title }))}
                  placeholder="Type to search audios..."
                  noResultsText="No audios found"
                  styles={churchSearchTheme}
                />

                {selectedAudio && (
                  <div className="selected-audio">
                    <p style={titleBarStyle}>{selectedAudio.title}</p>
                    <audio
                      key={`${selectedAudio.title}-${selectedAudioIndex}`}
                      ref={audioRef}
                      controls
                      style={{ width: '100%', marginBottom: '14px', borderRadius: '8px' }}
                    >
                      <source src={getAudioDownloadUrl(selectedAudio.src)} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <a
                      href={getAudioDownloadUrl(selectedAudio.src)}
                      download={selectedAudio.fileName || `${selectedAudio.title}.mp3`}
                      style={{
                        display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 14, padding: '14px 18px',
                        background: '#c9a84c', color: '#111c35', borderRadius: 8, textAlign: 'center', textDecoration: 'none',
                        fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.3px', cursor: 'pointer', border: '2px solid #c9a84c',
                        position: 'relative', zIndex: 10, visibility: 'visible', opacity: 1, height: 'auto', minHeight: 48, lineHeight: 1.4,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#111c35'; e.currentTarget.style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#111c35'; }}
                      onClick={(e) => {
                        if (selectedAudio.src.includes('drive.google.com')) {
                          e.preventDefault();
                          window.open(getAudioDownloadUrl(selectedAudio.src), '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      ⬇️ Download &ldquo;{selectedAudio.title}&rdquo;
                    </a>
                  </div>
                )}

                <div style={{ margin: '30px 0', borderTop: '1px solid #eee' }}></div>

                <SearchableSelect
                  id="commanding-week-select"
                  label="🎬 Select Commanding Your Week videos"
                  value={selectedCommandingWeekIndex}
                  onChange={setSelectedCommandingWeekIndex}
                  options={(commandingWeekItem?.videos || []).map((video, index) => ({ value: index, label: video.title }))}
                  placeholder="Type to search videos..."
                  noResultsText="No videos found"
                  styles={churchSearchTheme}
                />

                <VideoEmbed video={selectedCommandingWeekVideo} />

                <div style={{ margin: '30px 0', borderTop: '1px solid #eee' }}></div>

                <SearchableSelect
                  id="sermon-video-select"
                  label="📖 Select Sermon Videos"
                  value={selectedSermonVideoIndex}
                  onChange={setSelectedSermonVideoIndex}
                  options={localVideos.map((video, index) => ({ value: index, label: video.title }))}
                  placeholder="Type to search sermon videos..."
                  noResultsText="No videos found"
                  styles={churchSearchTheme}
                />

                <VideoEmbed video={selectedSermonVideo} />

                <div className="media-selection-hint">
                  <div className="hint-arrow">↑</div>
                  <div className="hint-icon"><FaVideo /></div>
                  <p>Choose an image, audio, or video from the options above.</p>
                  <span>Choose from our available media</span>
                </div>
              </div>
            </div>

            <div className="media-column images">
              <div className="full-height-slider">
                {imageItems.length > 0 && (
                  <img
                    src={isSingleImage ? imageItems[0].src : imageItems[selectedImageIndex]?.src || imageItems[currentIndex].src}
                    alt={isSingleImage ? imageItems[0].alt : imageItems[selectedImageIndex]?.alt || imageItems[currentIndex].alt}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section className="events-section" style={{ padding: '60px 20px', backgroundColor: '#F8FAFC' }}>
          <div className="events-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>Mark Your Calendar</p>
            <h2 className="section-title" style={{ textAlign: 'center', color: '#0F172A' }}>Upcoming Events</h2>
            <span className="gold-rule centered" />
            <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
              {upcomingEvents.map((event) => (
                <div key={event.id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#C49A3A', fontSize: '1.2rem', marginBottom: '10px' }}>{event.title}</h3>
                  <p style={{ color: '#64748B', marginBottom: '5px' }}>📅 {event.date}</p>
                  <p style={{ color: '#64748B', marginBottom: '5px' }}>⏰ {event.time}</p>
                  <p style={{ color: '#64748B', marginBottom: '20px' }}>📍 {event.location}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setSelectedEvent(event); setShowRsvpModal(true); }}
                      style={{ padding: '10px 20px', background: '#0F172A', color: '#fff', borderRadius: '6px', border: 'none', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      RSVP / Learn More
                    </button>
                    <Link
                      to="/meeting"
                      style={{ padding: '10px 20px', background: '#C49A3A', color: '#0F172A', borderRadius: '6px', textDecoration: 'none', fontWeight: 700 }}
                    >
                      🎥 Join Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRAYER REQUEST SECTION */}
        <section className="prayer-request-section" style={{ padding: '60px 20px', background: '#17365D', color: '#fff' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#C49A3A' }}>Need Prayer?</h2>
              <p style={{ marginBottom: '0', fontSize: '1.05rem' }}>
                Our intercessory team is ready to stand in agreement with you. Submit your request below.
              </p>
            </div>

            <form onSubmit={handlePrayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: 40 }}>
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={prayerForm.name}
                onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                style={{ padding: '14px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
              />
              <input
                type="email"
                placeholder="Your Email (Optional)"
                value={prayerForm.email}
                onChange={(e) => setPrayerForm({ ...prayerForm, email: e.target.value })}
                style={{ padding: '14px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
              />
              <textarea
                placeholder="Type your prayer request here..."
                rows="4"
                required
                value={prayerForm.message}
                onChange={(e) => setPrayerForm({ ...prayerForm, message: e.target.value })}
                style={{ padding: '14px', borderRadius: '8px', border: 'none', fontSize: '1rem', resize: 'vertical' }}
              ></textarea>

              <div style={{ textAlign: 'left' }}>
                <label
                  htmlFor="file-upload"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', background: 'rgba(255,255,255,0.1)',
                    border: '1px dashed rgba(255,255,255,0.4)', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  }}
                >
                  <FaPaperclip /> Attach Files (Images, Audio, Video, PDF)
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.08)', padding: '8px 12px',
                          borderRadius: 6, fontSize: 13,
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          📎 {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            background: 'transparent', border: 'none', color: '#fca5a5',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                          }}
                          aria-label={`Remove ${file.name}`}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={prayerStatus === 'submitting'}
                style={{
                  padding: '16px', background: '#C49A3A', color: '#0F172A',
                  border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold',
                  cursor: prayerStatus === 'submitting' ? 'wait' : 'pointer',
                  opacity: prayerStatus === 'submitting' ? 0.7 : 1,
                  transition: '0.3s',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <FaWhatsapp size={20} />
                {prayerStatus === 'submitting' ? '⏳ Submitting...' : 'Submit Prayer Request'}
              </button>

              {prayerStatus === 'success' && (
                <p style={{ color: '#22c55e', fontWeight: 700, textAlign: 'center', margin: 0 }}>
                  ✅ Prayer submitted! Our team will be praying for you.
                </p>
              )}
              {prayerStatus === 'error' && (
                <p style={{ color: '#f87171', fontWeight: 700, textAlign: 'center', margin: 0 }}>
                  ⚠️ Something went wrong. Please try again.
                </p>
              )}
            </form>

            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: 15, fontSize: '1.05rem' }}>Prefer to pray with us live?</p>
              <Link
                to="/meeting"
                style={{
                  display: 'inline-block', padding: '12px 24px',
                  background: '#C49A3A', color: '#0F172A',
                  borderRadius: 8, fontWeight: 700, textDecoration: 'none',
                }}
              >
                🎥 Join Live Prayer Meeting
              </Link>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRAYER WALL */}
        {prayerWall.length > 0 && (
          <section className="prayer-wall-section" style={{ padding: '60px 20px', background: '#F8FAFC' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <p className="section-eyebrow" style={{ textAlign: 'center' }}>Community</p>
              <h2 className="section-title" style={{ textAlign: 'center', color: '#0F172A' }}>Interactive Prayer Wall</h2>
              <span className="gold-rule centered" />
              <p style={{ textAlign: 'center', color: '#64748B', marginBottom: 30, maxWidth: 620, margin: '0 auto 30px' }}>
                Stand in agreement with others. Click "I Prayed For This" to show support.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                {prayerWall.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(196,154,58,0.35)',
                      borderRadius: 12,
                      padding: 18,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <FaPrayingHands style={{ color: '#C49A3A' }} />
                      <strong style={{ color: '#0F172A' }}>{p.name}</strong>
                    </div>
                    <p style={{ margin: '0 0 14px', lineHeight: 1.6, fontSize: '0.95rem', color: '#334155' }}>
                      “{p.text || p.request}”
                    </p>
                    <button
                      onClick={() => handlePrayedFor(p.id)}
                      disabled={prayedFor[p.id]}
                      style={{
                        width: '100%', padding: '8px 12px',
                        background: prayedFor[p.id] ? 'rgba(34,197,94,0.15)' : '#C49A3A',
                        color: prayedFor[p.id] ? '#16a34a' : '#0F172A',
                        border: prayedFor[p.id] ? '1px solid #22c55e' : 'none',
                        borderRadius: 6, fontWeight: 700, fontSize: 13,
                        cursor: prayedFor[p.id] ? 'default' : 'pointer',
                      }}
                    >
                      {prayedFor[p.id]
                        ? `✓ You Prayed (${p.prayedFor || p.prayers || 0})`
                        : `🙏 I Prayed For This (${p.prayedFor || p.prayers || 0})`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <TestimonialsCarousel />

        {/* WELCOME */}
        <section className="welcome">
          <div className={`welcome-inner anim-fade-up ${welcomeVisible ? 'visible' : ''}`} ref={welcomeRef}>
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>Welcome Home</p>
            <h2 className="section-title" style={{ textAlign: 'center' }}>You Belong Here</h2>
            <span className="gold-rule centered" />
            <p className="welcome-desc">
              Whether you are discovering faith for the first time, returning to Answered Prayer Network, or looking for a church family, you are welcome here. We gather to worship God, study His Word, pray together, build meaningful relationships, and serve our community with love.
            </p>
          </div>

          <div className="services-grid" ref={ministriesRef}>
            {ministries.map((ministry, index) => (
              <div className={`service-card anim-fade-up delay-${index + 1} ${ministriesVisible ? 'visible' : ''}`} key={ministry.title}>
                <img src={ministry.icon} alt={`${ministry.title} icon`} className="service-icon" />
                <h3 className="service-title">{ministry.title}</h3>
                <p className="service-desc">{ministry.desc}</p>
              </div>
            ))}
          </div>

          <div className="welcome-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/services" className="btn-gold">Explore Our Ministries</Link>
            <Link to="/meeting" className="btn-outline-gold">🎥 Join Live Meeting</Link>
          </div>
        </section>

        {/* WHY US */}
        <section className="why-us">
          <div className="why-inner">
            <div className={`why-text anim-slide-left ${whyTextVisible ? 'visible' : ''}`} ref={whyTextRef}>
              <p className="section-eyebrow">Our Mission</p>
              <h2 className="section-title" style={{ color: 'var(--white)' }}>
                Growing Together<br />In Faith &amp; Love
              </h2>
              <span className="gold-rule" />
              <p className="why-desc">
                Our desire is to create a Christ-centered community where people can encounter God, grow spiritually, discover their gifts, build lasting relationships, and make a positive difference in the lives of others.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
                <Link to="/about" className="btn-outline-gold">
                  Learn More About Answered Prayer Network
                </Link>
                <Link to="/meeting" className="btn-gold">🎥 Join Live Meeting</Link>
              </div>
            </div>

            <div className={`why-image anim-slide-right ${whyImgVisible ? 'visible' : ''}`} ref={whyImgRef}>
              <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1000&q=85" alt="People worshipping together in church" />
              <div className="why-badge">
                <span className="badge-cross">✝</span>
                <span className="badge-label">Faith<br />Hope<br />Love</span>
              </div>
            </div>
          </div>
        </section>

        {/* SMALL GROUPS - ENHANCED */}
        <section className="connect-groups-section">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p className="section-eyebrow">Find Your People</p>
              <h2 style={{ color: '#0F172A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>
                Connect Groups
              </h2>
              <span className="gold-rule centered" />
              <p style={{ color: '#64748B', maxWidth: 600, margin: '20px auto 0' }}>
                Deep discipleship happens in small groups. Find a group that fits your season of life.
              </p>
            </div>
            <div className="connect-groups-grid">
              {smallGroups.map((g) => (
                <div key={g.name} className="connect-group-card">
                  <div className="connect-group-icon">{g.icon}</div>
                  <h3 className="connect-group-name">{g.name}</h3>
                  <p className="connect-group-detail">🕒 <strong>{g.when}</strong></p>
                  <p className="connect-group-detail">📍 {g.where}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section style={{ padding: '70px 20px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p className="section-eyebrow">Our Team</p>
              <h2 style={{ color: '#0F172A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>
                Meet Our Leaders
              </h2>
              <span className="gold-rule centered" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
              {leadershipTeam.map((l) => (
                <div key={l.name} style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <img
                    src={l.img}
                    alt={l.name}
                    style={{
                      width: 110, height: 110, borderRadius: '50%',
                      objectFit: 'cover', border: '3px solid #C49A3A',
                      margin: '0 auto 14px', display: 'block',
                    }}
                  />
                  <h3 style={{ color: '#0F172A', fontSize: '1.15rem', marginBottom: 4 }}>{l.name}</h3>
                  <p style={{ color: '#C49A3A', fontWeight: 700, fontSize: 13, margin: '0 0 10px', letterSpacing: 1, textTransform: 'uppercase' }}>
                    {l.role}
                  </p>
                  <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{l.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          {statsData.map((stat) => (
            <StatItem key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </section>

        {/* HOME CTA */}
        <section className="home-cta">
          <div className="home-cta-inner">
            <p className="section-eyebrow">You Are Welcome</p>
            <h2 className="home-cta-title">Come Worship With Answered Prayer Network</h2>
            <p className="home-cta-desc">
              We would love to welcome you and your family. Come as you are and experience a community built around Christ at Answered Prayer Network.
            </p>
            <div className="home-cta-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/contact" className="btn-gold">Plan Your Visit</Link>
              <Link to="/services" className="btn-outline-gold">Explore Ministries</Link>
              <Link to="/meeting" className="btn-gold">🎥 Join Live Meeting</Link>
            </div>
          </div>
        </section>

        {/* ONLINE GIVING */}
        <section style={{ padding: '70px 20px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p className="section-eyebrow">Give With Joy</p>
              <h2 style={{ color: '#0F172A', fontSize: '2rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>
                Support the Ministry
              </h2>
              <span className="gold-rule centered" />
              <p style={{ color: '#64748B', maxWidth: 600, margin: '20px auto 0' }}>
                Your giving fuels the Gospel, outreach, and answered prayers across our community.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
              {givingOptions.map((g) => (
                <div key={g.name} style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 34, marginBottom: 8 }}>{g.icon}</div>
                  <h3 style={{ color: '#0F172A', fontSize: '1.05rem', marginBottom: 8 }}>{g.name}</h3>
                  <p style={{ color: '#C49A3A', fontWeight: 800, margin: 0, fontSize: '1rem' }}>{g.number}</p>
                  <p style={{ color: '#64748B', fontSize: 12, margin: '4px 0 0' }}>{g.holder}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: 13, marginTop: 30 }}>
              Every gift, big or small, advances the Kingdom. Thank you for your generosity. 💛
            </p>
          </div>
        </section>

        <FirstVisitFAQ />

        {/* NEWSLETTER */}
        <section style={{ padding: '70px 20px', background: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="section-eyebrow">Stay Connected</p>
            <h2 style={{ color: '#0F172A', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", margin: '10px 0' }}>
              Get Weekly Updates
            </h2>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Receive announcements, devotionals, and prayer points by email or WhatsApp.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1, minWidth: 220, padding: 14,
                  borderRadius: 8, border: '2px solid #E2E8F0',
                  fontSize: '1rem', outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 24px', background: '#C49A3A',
                  color: '#0F172A', borderRadius: 8, border: 'none',
                  fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
                }}
              >
                Subscribe
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>
                ✅ Subscribed! Watch your inbox.
              </p>
            )}
            <a
              href="https://wa.me/233XXXXXXXXX?text=Subscribe%20me%20to%20APN%20updates"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block', marginTop: 16,
                color: '#25D366', fontWeight: 700, textDecoration: 'none',
              }}
            >
              💬 Or join our WhatsApp broadcast →
            </a>
          </div>
        </section>

        {/* SERVICE TIMES & LOCATION */}
        <section style={{ background: '#C49A3A', padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p className="section-eyebrow" style={{ color: '#0F172A' }}>Visit Us</p>
              <h2 style={{ color: '#0F172A', fontSize: '2.5rem', margin: '10px 0' }}>Service Times & Location</h2>
              <span className="gold-rule centered" style={{ background: '#0F172A' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div style={{ color: '#0F172A' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⛪</span> Sunday Service
                  </h3>
                  <p style={{ fontSize: '1.1rem', margin: 0, paddingLeft: '35px' }}>9:00 AM & 11:00 AM</p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📖</span> Midweek Bible Study
                  </h3>
                  <p style={{ fontSize: '1.1rem', margin: 0, paddingLeft: '35px' }}>Wednesdays • 6:00 PM</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📍</span> Our Location
                  </h3>
                  <p style={{ fontSize: '1.1rem', margin: 0, paddingLeft: '35px' }}>
                    Fort Greene Hotel - Spintex Hills, Accra, Ghana
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 15, marginLeft: '35px' }}>
                    <a
                      href="https://maps.google.com/?q=Fort+Greene+Hotel+-+Spintex+Hills,+Accra,+Ghana"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px', background: '#0F172A', color: '#fff',
                        textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold',
                      }}
                    >
                      Get Directions
                    </a>
                    <Link
                      to="/meeting"
                      style={{
                        padding: '10px 20px', background: '#0F172A', color: '#fff',
                        textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold',
                      }}
                    >
                      🎥 Join Live Meeting
                    </Link>
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Fort+Greene+Hotel+-+Spintex+Hills,+Accra,+Ghana&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Church Location Map"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VERSE OF THE DAY WIDGET */}
        <section
          style={{
            padding: '60px 20px',
            background: 'linear-gradient(135deg,#0F172A,#17365D)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <FaBible style={{ fontSize: 42, color: '#C49A3A', marginBottom: 18 }} />
            <p
              style={{
                fontSize: '1.3rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                margin: '0 0 16px',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              "{verseOfTheDay.text}"
            </p>
            <p style={{ color: '#C49A3A', fontWeight: 800, letterSpacing: 1, margin: 0 }}>
              — {verseOfTheDay.reference}
            </p>
          </div>
        </section>

        <Footer />

        {/* FLOATING BUTTONS - Correctly Stacked */}
        <button
          className="give-icon"
          onClick={() => setShowGiveModal(true)}
          aria-label="Give Online"
        >
          <FaDonate className="give-icon-symbol" />
          <span>Give</span>
        </button>

        <Link
          to="/chatbot"
          className="chatbot-icon"
          aria-label="Answered Prayer Network Chatbot"
        >
          <FaComments className="chatbot-icon-symbol" />
          <span>Chat</span>
        </Link>

        <Link
          to="/meeting"
          className="meeting-icon"
          aria-label="Join Live Meeting"
        >
          <FaVideo className="meeting-icon-symbol" />
          <span>Live</span>
        </Link>

        {/* BACK-TO-TOP */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            style={{
              position: 'fixed', bottom: 210, right: 24, /* Adjusted to stack properly above Give */
              width: 44, height: 44, borderRadius: '50%',
              background: '#0F172A', color: '#fff',
              border: '2px solid #C49A3A', cursor: 'pointer',
              fontSize: 20, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              zIndex: 9999, transition: 'all .2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C49A3A'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0F172A'; e.currentTarget.style.color = '#fff'; }}
          >
            ↑
          </button>
        )}
      </main>
    </>
  );
}