import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaVideo } from 'react-icons/fa';

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

import apnImage1 from '../assets/images/apnImage1.png';
import apnImage2 from '../assets/images/apnImage2.png';
import apnImage3 from '../assets/images/apnImage3.png';
import apnImage4 from '../assets/images/apnImage4.png';
import apnImage5 from '../assets/images/apnImage5.png';
import apnImage6 from '../assets/images/apnImage6.png';
import apnImage7 from '../assets/images/apnImage7.png';
import apnImage8 from '../assets/images/apnImage8.png';
import apnImage9 from '../assets/images/apnImage9.png';
import apnImage10 from '../assets/images/apnImage10.png';
import apnImage11 from '../assets/images/apnImage11.png';
import apnImage12 from '../assets/images/apnImage12.png';
import apnImage13 from '../assets/images/apnImage13.png';
import apnImage14 from '../assets/images/apnImage14.png';
import apnImage15 from '../assets/images/apnImage15.png';
import apnImage16 from '../assets/images/apnImage16.png';

const cmArr = [
  commercialVid1, commercialVid2, commercialVid3, commercialVid4, 
  commercialVid5, commercialVid6, commercialVid7,
];

const marqueeMessages = [
  '✨ Special Event This Sunday • Youth Fellowship • Community Outreach • Join Us! ✨',
  '✨ Answered Prayer Network • A place Where destinies are restored and rearranged. • Pray Until the soul cracks ✨',
  '✨ Online Midnight Prayer Session • Pray until something happens ✨',
];

const localVideos = [
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=JE3rARGfSyg',
    embedUrl: 'https://www.youtube.com/embed/JE3rARGfSyg',
    isYouTube: true,
    title: '27th Oct 2026 - DEALING WITH DEMONIC RESISTANCE',
    alt: 'Commanding Your Week',
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE',
    embedUrl: 'https://www.youtube.com/embed/NSGc6wJgTRE',
    title: '18th Oct 2026',
    alt: 'Commanding Your Week',
    isYouTube: true,
  }
];

const localAudios = [
  {
    type: 'audio',
    src: 'https://drive.google.com/uc?export=download&id=1EGX3FlCHioPseLBaQKpamUhdgx_HFjWq',
    title: 'Sunday Midnight Prayers',
    alt: 'Sunday Midnight Prayers',
    fileName: 'SundayMidnight.mp3',
    local: true,
  },
  {
    type: 'audio',
    src: 'https://drive.google.com/uc?export=download&id=1zzQ9jl6iz45lHBqRmDUbjvgO1lWh9Rp1',
    title: 'Why many are not doers of the word Part 1_Pastor Enoch',
    alt: 'Why many are not doers of the word Part 1_Pastor Enoch',
    fileName: 'Why many.mp3',
    local: true,
  },
  // ... (Rest of your audio list remains intact here)
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1UD0blLELH72wfrYPr9b1NlmntOZ04z9H', title: 'Violating the laws of God through ignorance_Pastor Enoch', alt: 'Violating the laws of God through ignorance_Pastor Enoch', fileName: 'Violating the laws of God through ignorance_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12Gpj9Sn1xJxoH4s2hxgPBQjfUCGZS81r', title: 'The shiloh cry_ APN', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BH9Bs18hPEMTl0W2S5ZjlwZQ7E-n5ZRg', title: 'When God moves Little by little_Pastor Enoch', alt: 'When God moves Little by little_Pastor Enoch', fileName: 'When God moves Little by little_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1uE2oBQY5D6l-tP_3Bp4kGMrS2IrBNmVT', title: 'September Prayers They Continued 1st session_Pastor Enoch', alt: 'September Prayers They Continued 1st session_Pastor Enoch', fileName: 'September Prayers They Continued 1st session_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=13Lxt_LThco1FgTuQHt9e-zr3a-oACL6O', title: 'Thursday prayer session', alt: 'Thursday prayer session', fileName: 'Thursday prayer session.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Ba0yYcPPscsOA4dRim3NEbEUUW-89rsu', title: 'The Shiloh Cry_Pastor Enoch', alt: 'The Shiloh Cry_Pastor Enoch', fileName: 'The Shiloh Cry_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1oTckX9bZeW8_xrlOm2dc64WJ8kSwjfcJ', title: 'Waiting on God_Dealing with Impatience_Pastor Enoch', alt: 'Waiting on God_Dealing with Impatience_Pastor Enoch', fileName: 'Waiting on God_Dealing with Impatience_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1I5jPqrKei0Dpcd71nTM5rPnx5c_gUYxh', title: 'Thursday Midnight Prayers_Pastor Enoch', alt: 'Thursday Midnight Prayers_Pastor Enoch', fileName: 'Thursday Midnight Prayers_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_clkK-Uqe_W-nHSCt22HEaK_TVs6zzf6', title: 'Think on these things_Pastor Enoch', alt: 'Think on these things_Pastor Enoch', fileName: 'Think on these things_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1eSZrfxqIn0EQDGPT7diaekx9dbiAH1Rp', title: 'Thursday Prayer Session_Pastor Enoch', alt: 'Thursday Prayer Session_Pastor Enoch', fileName: 'Thursday Prayer Session_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1qy7W1rG-iaov8f5dRPZQ0cRUNPfHCy4O', title: 'Activating the mystery of intervention through alignment_Pastor Enoch', alt: 'Activating the mystery of intervention through alignment_Pastor Enoch', fileName: 'Activating the mystery of intervention through alignment_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The shiloh cry_ Pastor Enoch', alt: 'The shiloh cry_ Pastor Enoch', fileName: 'The shiloh cry Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1-ZPSKzGMwarPXD6imB6WXgJsyMPBlXL2', title: 'preaching from light', alt: 'preaching from light', fileName: 'preaching from light.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1C0abeQIs7MpZNtFBCvgQSB_rtiNToBtK', title: 'The Shiloh Cry', alt: 'The Shiloh Cry', fileName: 'The Shiloh Cry.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1PKeytUT0OEzKzIe_IgpPJEK3s8t4J8CY', title: 'The Shiloh cry_Covenants_Pastor Enoch', alt: 'The Shiloh cry_Covenants_Pastor Enoch', fileName: 'The Shiloh cry Covenants Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1N9RdhgB7YceQ3cD41oX_Qwz_TST3oUoC', title: 'September prayers', alt: 'September prayers', fileName: 'September prayers.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14yXjGDNnrbSXuMUF4_VTvIJlrVKPbtDT', title: 'Prayer charge_Pastor Enoch', alt: 'Prayer charge_Pastor Enoch', fileName: 'Prayer charge_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZFVcpmeLP6IPQsCPHx4TbaV1u5IN-Bnc', title: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch', alt: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch', fileName: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1TOo4BJnL2IOuvYkuDa03KZgmCJlJKtJz', title: 'A call unto prayer_Pastor Enoch', alt: 'A call unto prayer_Pastor Enoch', fileName: 'A call unto prayer_Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1w5_Z-9cYbLcqOFnwL9dOH3uHqVUL-dxu', title: "Don't Give up_Pastor Enoch", alt: "Don't Give up_Pastor Enoch", fileName: "Don't Give up_Pastor Enoch.mp3", local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_lSyahK3uBbd2CSVFkObaMl89gKczNF9', title: 'Non-cognitive modes of communication 2', alt: 'Non-cognitive modes of communication 2', fileName: 'Non-cognitive modes of communication 2.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CPtAlSJYUw1K3h9K0mV5vU3MGcX0wr3K', title: 'Non-cognitive modes of communication', alt: 'Non-cognitive modes of communication', fileName: 'Non-cognitive modes of communication.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=17veJST5Ou92IB2UD0M5xBIHqLjc1WeLd', title: 'Manifesting Prophecies_Waiting on God Pastor Enoch', alt: 'Manifesting Prophecies_Waiting on God Pastor Enoch', fileName: 'Manifesting Prophecies Waiting on God Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CYUb03Fq2LizaBw9uHdH_iuUSW7E129V', title: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', alt: 'Manifesting Prophecies the gift of an eye to see Pastor Enoch', fileName: 'Manifesting Prophecies the gift of an eye to see Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1La0LN9oznYGMlhxOuT2UcK8jBxZUMDWK', title: 'Manifesting Prophecies_the gift of an eye_Pastor Enoch', alt: 'Manifesting Prophecies_the gift of an eye_Pastor Enoch', fileName: 'Manifesting Prophecies the gift of an eye Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1VOBfO9J8TXjPxrC2x-75ygKLtV5KERCG', title: 'APN Midnight Prayers Manifesting Prophecies 2 _Pastor Enoch', alt: 'APN Midnight Prayers Manifesting Prophecies 2 _Pastor Enoch', fileName: 'APN Midnight Prayers Manifesting Prophecies 2 Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1RlLmrAvi6lQ1pBeJeyj-kPAUGfgL5Pqx', title: 'Manifesting Prophecies_being fully persuaded_Pastor Enoch', alt: 'Manifesting Prophecies_being fully persuaded_Pastor Enoch', fileName: 'Manifesting Prophecies being fully persuaded Pastor Enoch.mp3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1UfYVBYMq2Ima6E59x0EHvCB6FCLleLGl', title: 'Hour Of Mercy with Prophetic prayers_Pastor Enoch', alt: 'Hour Of Mercy with Prophetic prayers_Pastor Enoch', fileName: 'Hour Of Mercy with Prophetic prayers_Pastor Enoch.mp3', local: true },
];

const ministries = [
  { icon: APNIcon, title: 'Worship Ministry', desc: 'Join us in worship as we lift our hearts to God through praise, prayer, and the teaching of His Word.' },
  { icon: APNIcon, title: 'Youth Ministry', desc: 'A welcoming environment where young people can grow in faith, build friendships, and discover their purpose in Christ.' },
  { icon: APNIcon, title: 'Prayer Ministry', desc: 'Come together with us in prayer as we seek God, encourage one another, and stand together in faith.' },
  { icon: APNIcon, title: 'Community Ministry', desc: 'Serving our community with compassion, kindness, and practical support while sharing the love of Christ.' },
];

const mediaItems = [
  { type: 'image', src: apnImage1, alt: 'Church Event 1', title: 'Church Event 1' },
  { type: 'image', src: apnImage2, alt: 'Church Event 2', title: 'Church Event 2' },
  { type: 'image', src: apnImage3, alt: 'Church Event 3', title: 'Church Event 3' },
  { type: 'image', src: apnImage4, alt: 'Church Event 4', title: 'Church Event 4' },
  { type: 'image', src: apnImage5, alt: 'Church Event 5', title: 'Church Event 5' },
  { type: 'image', src: apnImage6, alt: 'Church Event 6', title: 'Church Event 6' },
  { type: 'image', src: apnImage7, alt: 'Church Event 7', title: 'Church Event 7' },
  { type: 'image', src: apnImage8, alt: 'Church Event 8', title: 'Church Event 8' },
  { type: 'image', src: apnImage9, alt: 'Church Event 9', title: 'Church Event 9' },
  { type: 'image', src: apnImage10, alt: 'Church Event 10', title: 'Church Event 10' },
  { type: 'image', src: apnImage11, alt: 'Church Event 11', title: 'Church Event 11' },
  { type: 'image', src: apnImage12, alt: 'Church Event 12', title: 'Church Event 12' },
  { type: 'image', src: apnImage13, alt: 'Church Event 13', title: 'Church Event 13' },
  { type: 'image', src: apnImage14, alt: 'Church Event 14', title: 'Church Event 14' },
  { type: 'image', src: apnImage15, alt: 'Church Event 15', title: 'Church Event 15' },
  { type: 'image', src: apnImage16, alt: 'Church Event 16', title: 'Church Event 16' },

  {
    type: 'video',
    src: 'https://youtube.com/shorts/dbqnn792Y7M',
    embedUrl: 'https://www.youtube.com/embed/dbqnn792Y7M',
    isYouTube: true,
    alt: 'Sunday Sermon',
    title: 'Sunday Sermon',
  },
  {
    type: 'video',
    src: 'https://youtube.com/shorts/A7usTs1ds5k',
    embedUrl: 'https://www.youtube.com/embed/A7usTs1ds5k',
    isYouTube: true,
    alt: 'Commanding your week',
    title: 'Commanding your week',
  },
  {
    type: 'video',
    src: 'https://youtube.com/shorts/mbcNqd7bJGs',
    embedUrl: 'https://www.youtube.com/embed/mbcNqd7bJGs',
    isYouTube: true,
    alt: 'Community Outreach',
    title: 'Community Outreach',
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=Z5QRcyom9bw',
    embedUrl: 'https://www.youtube.com/embed/Z5QRcyom9bw',
    isYouTube: true,
    alt: 'Community Outreach',
    title: 'Community Outreach',
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/watch?v=JgWr4jljWXU',
    embedUrl: 'https://www.youtube.com/embed/JgWr4jljWXU',
    isYouTube: true,
    alt: 'Community Outreach',
    title: 'Community Outreach',
  },
  {
    type: 'commandingWeek',
    title: 'Commanding Your Week Videos',
    alt: 'Commanding Your Week Videos',
    videos: [
      {
        type: 'video',
        src: 'https://youtube.com/shorts/A7usTs1ds5k',
        embedUrl: 'https://www.youtube.com/embed/A7usTs1ds5k',
        isYouTube: true,
        title: 'Commanding Your Week',
        alt: 'Commanding Your Week',
      },
      {
        type: 'video',
        src: 'https://youtube.com/shorts/dbqnn792Y7M',
        embedUrl: 'https://www.youtube.com/embed/dbqnn792Y7M',
        isYouTube: true,
        title: 'Commanding Your Week - Part 2',
        alt: 'Commanding Your Week - Part 2',
      },
    ],
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

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState('');
  const [selectedCommandingWeekIndex, setSelectedCommandingWeekIndex] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState('');

  const playableMedia = mediaItems.filter((item) => item.type === 'video' || item.type === 'audio');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Removed videoItems since "Select a video" is gone
  const commandingWeekItem = mediaItems.find((item) => item.type === 'commandingWeek');
  const audioItems = mediaItems.filter((item) => item.type === 'audio');
  const imageItems = mediaItems.filter((item) => item.type === 'image');

  const selectedAudio = selectedAudioIndex !== '' ? audioItems[selectedAudioIndex] : null;
  
  const selectedCommandingWeekVideo =
    selectedCommandingWeekIndex !== '' &&
    commandingWeekItem?.videos?.[selectedCommandingWeekIndex]
      ? commandingWeekItem.videos[selectedCommandingWeekIndex]
      : null;

  // ===================================================
  // COMMERCIAL
  // ===================================================
  const [showCommercial, setShowCommercial] = useState(false);
  const [commercialUrl, setCommercialUrl] = useState(null);
  const commercialVideoRef = useRef(null);
  const commercialTimeoutRef = useRef(null);
  const commercialShowingRef = useRef(false);
  const audioRef = useRef(null);

  // ===================================================
  // RANDOM MARQUEE MESSAGE
  // ===================================================
  const [randomMessage] = useState(() => {
    return marqueeMessages[Math.floor(Math.random() * marqueeMessages.length)];
  });

  const selectedMedia = playableMedia[selectedMediaIndex] || null;

  // =====================================================
  // IMAGE SLIDER
  // =====================================================
  useEffect(() => {
    if (imageItems.length === 0) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [imageItems.length]);

  // =====================================================
  // DOWNLOAD URL FOR AUDIO
  // =====================================================
  const getAudioDownloadUrl = (src) => {
    if (!src) return '';
    if (src.includes('drive.google.com')) {
      if (src.includes('uc?export=download') || src.includes('uc?id=')) {
        return src.replace(/export=download/, 'export=download&confirm=t');
      }
      const fileMatch = src.match(/\/file\/d\/([^/]+)/);
      if (fileMatch) {
        return `https://drive.google.com/uc?export=download&confirm=t&id=${fileMatch[1]}`;
      }
    }
    return src;
  };

  // =====================================================
  // CLOSE COMMERCIAL
  // =====================================================
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
    setShowCommercial(false);
    setCommercialUrl(null);
  };

  // =====================================================
  // START COMMERCIAL
  // =====================================================
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

  // =====================================================
  // COMMERCIAL TRIGGERS
  // =====================================================
  useEffect(() => {
    const triggerTimes = [5000, 10000, 15000];
    const timers = triggerTimes.map((time) => setTimeout(() => startCommercial(), time));

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      if (commercialTimeoutRef.current) clearTimeout(commercialTimeoutRef.current);
    };
  }, []);

  // =====================================================
  // COMMERCIAL VIDEO PLAYBACK
  // =====================================================
  useEffect(() => {
    if (!showCommercial || !commercialUrl || !commercialVideoRef.current) return;

    const video = commercialVideoRef.current;
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn('⚠️ Commercial autoplay with audio was blocked by the browser:', error);
      }
    };
    playVideo();
  }, [showCommercial, commercialUrl]);

  // =====================================================
  // AUTO-PLAY SELECTED AUDIO
  // =====================================================
  useEffect(() => {
    if (!selectedAudio || !audioRef.current) return;

    const audio = audioRef.current;
    audio.currentTime = 0;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.warn('⚠️ Audio autoplay was blocked by the browser:', error);
      }
    };
    playAudio();
  }, [selectedAudio]);

  const handleCommercialEnded = () => closeCommercial();

  // =====================================================
  // SCROLL ANIMATIONS
  // =====================================================
  const [ministriesRef, ministriesVisible] = useInView({ threshold: 0.1 });
  const [welcomeRef, welcomeVisible] = useInView({ threshold: 0.2 });
  const [whyTextRef, whyTextVisible] = useInView({ threshold: 0.2 });
  const [whyImgRef, whyImgVisible] = useInView({ threshold: 0.2 });

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      {/* COMMERCIAL OVERLAY */}
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
            onEnded={handleCommercialEnded}
          />
          <div className="commercial-timer">Advertisement</div>
        </div>
      )}

      <main className="home">
        {/* HERO */}
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
            </div>
          </div>
        </section>

        {/* ADVERTS MARQUEE */}
        <section className="adverts">
          <marquee behavior="scroll" direction="left" scrollamount="6">{randomMessage}</marquee>
        </section>

        <BirthdayCelebrants />

        {/* =================================================
            UPDATED MEDIA SECTION
        ================================================= */}
        <section className="media-section">
          <div className="media-columns">
            
            {/* LEFT COLUMN */}
            <div className="media-column videos">
              
              {/* --- MEDIA PICTURES --- */}
              <div className="media-selector-card" style={{ marginBottom: '24px' }}>
                <h2 className="media-selector-title">Media Pictures</h2>
                <div className="media-control-group">
                  <label htmlFor="picture-select">🖼️ Select a picture</label>
                  <select
                    id="picture-select"
                    value={selectedImageIndex}
                    onChange={(e) => setSelectedImageIndex(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">🎬 Commanding Your Week pictures</option>
                    {imageItems.map((item, index) => (
                      <option value={index} key={index}>{item.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* --- MEDIA PLAYER --- */}
              <div className="media-selector-card">
                <h2 className="media-selector-title">Media Player</h2>

                {/* AUDIO SELECTOR */}
                <div className="media-control-group">
                  <label htmlFor="audio-select">🎵 Select an audio</label>
                  <select
                    id="audio-select"
                    value={selectedAudioIndex}
                    onChange={(e) => setSelectedAudioIndex(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">🎬 Commanding Your Week audios</option>
                    {audioItems.map((item, index) => (
                      <option value={index} key={`${item.fileName || item.src}-${index}`}>{item.title}</option>
                    ))}
                  </select>
                </div>

                {/* SELECTED AUDIO DISPLAY */}
                {selectedAudio && (
                  <div className="selected-audio">
                    <p>{selectedAudio.title}</p>
                    <audio key={selectedAudio.src} ref={audioRef} controls preload="metadata" style={{ width: '100%' }}>
                      <source src={selectedAudio.src} />
                      Your browser does not support audio playback.
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

                {/* COMMANDING WEEK SELECTOR */}
                <div className="media-control-group commanding-week-selector">
                  <label htmlFor="commanding-week-select">🎬 Select Commanding Your Week videos</label>
                  <select
                    id="commanding-week-select"
                    value={selectedCommandingWeekIndex}
                    onChange={(e) => setSelectedCommandingWeekIndex(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">Select Commanding Your Week videos</option>
                    {commandingWeekItem?.videos?.map((video, index) => (
                      <option key={`${video.src}-${index}`} value={index}>{video.title}</option>
                    ))}
                  </select>
                </div>

                {/* SELECTED COMMANDING WEEK VIDEO DISPLAY */}
                {selectedCommandingWeekVideo && (
                  <div className="selected-video" style={{ marginTop: '20px' }}>
                    {selectedCommandingWeekVideo.isYouTube ? (
                      <iframe width="100%" height="315" src={selectedCommandingWeekVideo.embedUrl} title={selectedCommandingWeekVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <video key={selectedCommandingWeekVideo.src} width="100%" controls preload="metadata">
                        <source src={selectedCommandingWeekVideo.src} />
                      </video>
                    )}
                  </div>
                )}

                {/* MEDIA SELECTION HINT */}
                <div className="media-selection-hint">
                  <div className="hint-arrow">↑</div>
                  <div className="hint-icon"><FaVideo /></div>
                  <p>Select a picture or audio or video above</p>
                  <span>Choose from our available media</span>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: IMAGE SLIDER */}
            <div className="media-column images">
              <div className="image-slider">
                {imageItems.length > 0 && (
                  <img
                    src={selectedImageIndex !== '' ? imageItems[selectedImageIndex].src : imageItems[currentIndex >= imageItems.length ? 0 : currentIndex].src}
                    alt={selectedImageIndex !== '' ? imageItems[selectedImageIndex].alt : imageItems[currentIndex >= imageItems.length ? 0 : currentIndex].alt}
                  />
                )}
              </div>
            </div>

          </div>
        </section>

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

          <div className="welcome-cta">
            <Link to="/services" className="btn-gold">Explore Our Ministries</Link>
          </div>
        </section>

        {/* WHY / OUR MISSION */}
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
              <Link to="/about" className="btn-outline-gold" style={{ marginTop: 32, display: 'inline-block' }}>
                Learn More About Answered Prayer Network
              </Link>
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

        {/* STATS */}
        <section className="stats">
          {statsData.map((stat) => (
            <StatItem key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </section>

        {/* CTA */}
        <section className="home-cta">
          <div className="home-cta-inner">
            <p className="section-eyebrow">You Are Welcome</p>
            <h2 className="home-cta-title">Come Worship With Answered Prayer Network</h2>
            <p className="home-cta-desc">
              We would love to welcome you and your family. Come as you are and experience a community built around Christ at Answered Prayer Network.
            </p>
            <div className="home-cta-buttons">
              <Link to="/contact" className="btn-gold">Plan Your Visit</Link>
              <Link to="/services" className="btn-outline-gold">Explore Ministries</Link>
            </div>
          </div>
        </section>

        <Footer />

        {/* CHATBOT */}
        <Link to="/chatbot" className="chatbot-icon" aria-label="Answered Prayer Network Chatbot">
          <FaComments className="chatbot-icon-symbol" />
          <span>Chat With Us</span>
        </Link>

      </main>
    </>
  );
}