import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

import Footer from '../components/Footer';
import BirthdayCelebrants from '../components/BirthdayCelebrants';

import { useInView, useCountUp } from '../hooks/useInView';
import localVideo1 from '../assets/videos/sermon1.mp4';
import localVideo2 from '../assets/videos/sermon2.mp4';
import audio1 from '../assets/audios/audioSermon1.mp3';
import audio2 from '../assets/audios/audioSermon2.mp3';

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

  '✨ Online Midnight Prayer Session • Pray until something happens ✨',
];

const localVideos = [
  {
    type: 'video',
    src: localVideo1,
    title: 'Sermon 1',
    alt: 'Church Video 1',
    fileName: 'sermon1.mp4',
    local: true,
  },

  {
    type: 'video',
    src: localVideo2,
    title: 'Sermon 2',
    alt: 'Church Video 2',
    fileName: 'sermon2.mp4',
    local: true,
  },

  // {
  //   type: 'video',
  //   src: localVideo3,
  //   title: 'Youth Event',
  //   alt: 'Youth Event',
  //   fileName: 'youth-event.mp4',
  //   local: true,
  // },

  // {
  //   type: 'video',
  //   src: localVideo4,
  //   title: 'Worship',
  //   alt: 'Worship',
  //   fileName: 'worship.mp4',
  //   local: true,
  // }
];

const localAudios = [
  {
    type: 'audio',
    src: audio1,
    title: 'Audio 1',
    alt: 'Church Audio 1',
    fileName: 'audio1.mp3',
    local: true,
  },

  {
    type: 'audio',
    src: audio2,
    title: 'Audio 2',
    alt: 'Church Audio 2',
    fileName: 'audio2.mp3',
    local: true,
  },
];

const ministries = [
  {
    icon: APNIcon,
    title: 'Worship Ministry',
    desc: 'Join us in worship as we lift our hearts to God through praise, prayer, and the teaching of His Word.',
  },

  {
    icon: APNIcon,
    title: 'Youth Ministry',
    desc: 'A welcoming environment where young people can grow in faith, build friendships, and discover their purpose in Christ.',
  },

  {
    icon: APNIcon,
    title: 'Prayer Ministry',
    desc: 'Come together with us in prayer as we seek God, encourage one another, and stand together in faith.',
  },

  {
    icon: APNIcon,
    title: 'Community Ministry',
    desc: 'Serving our community with compassion, kindness, and practical support while sharing the love of Christ.',
  },
];

const mediaItems = [
  {
    type: 'image',
    src: apnImage1,
    alt: 'Church Event 1',
    title: 'Church Event 1',
  },

  {
    type: 'image',
    src: apnImage2,
    alt: 'Church Event 2',
    title: 'Church Event 2',
  },

  {
    type: 'image',
    src: apnImage3,
    alt: 'Church Event 3',
    title: 'Church Event 3',
  },

  {
    type: 'image',
    src: apnImage4,
    alt: 'Church Event 4',
    title: 'Church Event 4',
  },

  {
    type: 'image',
    src: apnImage5,
    alt: 'Church Event 5',
    title: 'Church Event 5',
  },

  {
    type: 'image',
    src: apnImage6,
    alt: 'Church Event 6',
    title: 'Church Event 6',
  },

  {
    type: 'image',
    src: apnImage7,
    alt: 'Church Event 7',
    title: 'Church Event 7',
  },

  {
    type: 'image',
    src: apnImage8,
    alt: 'Church Event 8',
    title: 'Church Event 8',
  },

  {
    type: 'image',
    src: apnImage9,
    alt: 'Church Event 9',
    title: 'Church Event 9',
  },

  {
    type: 'image',
    src: apnImage10,
    alt: 'Church Event 10',
    title: 'Church Event 10',
  },

  {
    type: 'image',
    src: apnImage11,
    alt: 'Church Event 11',
    title: 'Church Event 11',
  },

  {
    type: 'image',
    src: apnImage12,
    alt: 'Church Event 12',
    title: 'Church Event 12',
  },

  {
    type: 'image',
    src: apnImage13,
    alt: 'Church Event 13',
    title: 'Church Event 13',
  },

  {
    type: 'image',
    src: apnImage14,
    alt: 'Church Event 14',
    title: 'Church Event 14',
  },

  {
    type: 'image',
    src: apnImage15,
    alt: 'Church Event 15',
    title: 'Church Event 15',
  },

  {
    type: 'image',
    src: apnImage16,
    alt: 'Church Event 16',
    title: 'Church Event 16',
  },


  // ===================================================
  // YOUTUBE VIDEOS
  // ===================================================

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

// ===================================================
// COMMANDING YOUR WEEK VIDEOS
// ===================================================

{
  type: 'commandingWeek',
  title: 'Commanding Your Week Videos',
  alt: 'Commanding Your Week Videos',

  videos: [
    {
      type: 'video',
      src: 'https://youtube.com/shorts/A7usTs1ds5k',
      embedUrl:
        'https://www.youtube.com/embed/A7usTs1ds5k',
      isYouTube: true,
      title: 'Commanding Your Week',
      alt: 'Commanding Your Week',
    },

    // Add more Commanding Your Week videos here
    {
      type: 'video',
      src: 'https://youtube.com/shorts/dbqnn792Y7M',
      embedUrl:
        'https://www.youtube.com/embed/dbqnn792Y7M',
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
  {
    number: '∞',
    label: 'God’s Grace',
  },

  {
    number: '1',
    label: 'Family In Christ',
  },

  {
    number: '1',
    label: 'Body Of Christ',
  },

  {
    number: '24/7',
    label: 'Prayer & Faith',
  },
];

function StatItem({ number, label }) {
  const [ref, isVisible] = useInView({
    threshold: 0.3,
  });

  const isStatic =
    number === '∞' ||
    number === '24/7';

  const count = useCountUp(
    number,
    1800,
    isVisible && !isStatic
  );

  const displayValue =
    isStatic ? number : count;

  return (
    <div
      className="stat-item"
      ref={ref}
    >

      <span
        className={`stat-number ${
          isVisible ? 'visible' : ''
        }`}
      >
        {displayValue}
      </span>

      <span className="stat-label">
        {label}
      </span>

    </div>
  );
}

export default function Home() {
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedVideoIndex, setSelectedVideoIndex] = useState('');
const [selectedAudioIndex, setSelectedAudioIndex] = useState('');
const playableMedia = mediaItems.filter((item) => item.type === 'video' || item.type === 'audio');
const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
const [selectedCommandingWeekIndex, setSelectedCommandingWeekIndex] = useState('');

const videoItems = mediaItems.filter((item) => item.type === 'video');
const commandingWeekItem = mediaItems.find((item) => item.type === 'commandingWeek');
const audioItems = mediaItems.filter((item) => item.type === 'audio');
const selectedVideo = selectedVideoIndex !== '' ? videoItems[selectedVideoIndex] : null;
const selectedAudio = selectedAudioIndex !== '' ? audioItems[selectedAudioIndex] : null;


  // ===================================================
  // COMMERCIAL
  // ===================================================

  const [showCommercial, setShowCommercial] =
    useState(false);

  const [commercialUrl, setCommercialUrl] =
    useState(null);

  const commercialVideoRef =
    useRef(null);

  const commercialTimeoutRef =
    useRef(null);

  const commercialShowingRef =
    useRef(false);


  // ===================================================
  // RANDOM MARQUEE MESSAGE
  // ===================================================

  const [randomMessage] = useState(() => {
    return marqueeMessages[
      Math.floor(
        Math.random() *
        marqueeMessages.length
      )
    ];
  });


  // =====================================================
  // SELECTED MEDIA
  // =====================================================

  const selectedMedia =
    playableMedia[selectedMediaIndex] ||
    null;


  // =====================================================
  // IMAGE SLIDER
  // =====================================================

  useEffect(() => {

    const images = mediaItems.filter(
      (item) => item.type === 'image'
    );

    if (images.length === 0) {
      return undefined;
    }

    const interval = setInterval(() => {

      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1
          ? 0
          : prevIndex + 1
      );

    }, 5000);

    return () => {
      clearInterval(interval);
    };

  }, []);


  // =====================================================
  // YOUTUBE EMBED URL
  // =====================================================

  const getYouTubeEmbedUrl = (url) => {

    if (!url) {
      return '';
    }

    // YouTube Shorts
    if (url.includes('/shorts/')) {

      const videoId = url
        .split('/shorts/')[1]
        .split('?')[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }


    // Standard YouTube watch URL
    if (url.includes('watch?v=')) {

      const videoId = url
        .split('watch?v=')[1]
        .split('&')[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }


    // Already an embed URL
    if (url.includes('/embed/')) {
      return url;
    }


    return url;
  };


  // =====================================================
  // CLOSE COMMERCIAL
  // =====================================================

  const closeCommercial = () => {

    commercialShowingRef.current =
      false;

    if (commercialTimeoutRef.current) {

      clearTimeout(
        commercialTimeoutRef.current
      );

      commercialTimeoutRef.current =
        null;
    }

    if (commercialVideoRef.current) {

      commercialVideoRef.current.pause();

      commercialVideoRef.current.currentTime =
        0;
    }

    setShowCommercial(false);

    setCommercialUrl(null);
  };


  // =====================================================
  // START COMMERCIAL
  // =====================================================

  const startCommercial = () => {

    if (commercialShowingRef.current) {
      return;
    }

    if (
      !cmArr ||
      cmArr.length === 0
    ) {

      console.warn(
        '⚠️ No commercial videos available'
      );

      return;
    }

    commercialShowingRef.current =
      true;

    const randomIndex =
      Math.floor(
        Math.random() *
        cmArr.length
      );

    const selectedCommercial =
      cmArr[randomIndex];

    console.log(
      `🎬 Playing commercial ${
        randomIndex + 1
      } of ${cmArr.length}`
    );

    console.log(
      '🎬 Commercial URL:',
      selectedCommercial
    );

    setCommercialUrl(
      selectedCommercial
    );

    setShowCommercial(true);

    commercialTimeoutRef.current =
      setTimeout(() => {

        closeCommercial();

      }, 10000);
  };


  // =====================================================
  // COMMERCIAL TRIGGERS
  // =====================================================

  useEffect(() => {

    /*
      Commercial trigger times:

      5 seconds
      10 seconds
      15 seconds

      Each commercial lasts 10 seconds.

      If a commercial is already playing,
      another commercial will NOT overlap it.
    */

    const triggerTimes = [
      5000,
      10000,
      15000,
    ];

    const timers =
      triggerTimes.map((time) => {

        return setTimeout(() => {

          startCommercial();

        }, time);

      });


    return () => {

      timers.forEach((timer) => {

        clearTimeout(timer);

      });


      if (
        commercialTimeoutRef.current
      ) {

        clearTimeout(
          commercialTimeoutRef.current
        );

      }

    };

  }, []);


  // =====================================================
  // COMMERCIAL VIDEO PLAYBACK
  // =====================================================

  useEffect(() => {

    if (
      !showCommercial ||
      !commercialUrl ||
      !commercialVideoRef.current
    ) {
      return;
    }

    const video =
      commercialVideoRef.current;

    video.currentTime = 0;

    // Make sure audio is enabled
    video.muted = false;

    video.volume = 1.0;


    const playVideo = async () => {

      try {

        await video.play();

        console.log(
          '▶️ Commercial started playing'
        );

        console.log(
          '🔊 Commercial audio enabled'
        );

      } catch (error) {

        console.warn(
          '⚠️ Commercial autoplay with audio was blocked by the browser:',
          error
        );

      }

    };


    playVideo();

  }, [
    showCommercial,
    commercialUrl,
  ]);


  // =====================================================
  // COMMERCIAL ENDED
  // =====================================================

  const handleCommercialEnded = () => {

    console.log(
      '⏹️ Commercial finished'
    );

    closeCommercial();
  };


  // =====================================================
  // SCROLL ANIMATIONS
  // =====================================================

  const [
    ministriesRef,
    ministriesVisible,
  ] = useInView({
    threshold: 0.1,
  });


  const [
    welcomeRef,
    welcomeVisible,
  ] = useInView({
    threshold: 0.2,
  });


  const [
    whyTextRef,
    whyTextVisible,
  ] = useInView({
    threshold: 0.2,
  });


  const [
    whyImgRef,
    whyImgVisible,
  ] = useInView({
    threshold: 0.2,
  });


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      {/* =================================================
          COMMERCIAL OVERLAY
      ================================================= */}

      {showCommercial &&
        commercialUrl && (

        <div
          className="commercial-overlay"
          role="dialog"
          aria-label="Advertisement"
        >

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

          <div className="commercial-timer">
            Advertisement
          </div>

        </div>

      )}


      <main className="home">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div className="hero-overlay" />

          <div className="hero-content">

            <p className="section-eyebrow hero-anim-eyebrow">
              Welcome To Answered Prayer Network
            </p>

            <h1 className="hero-title hero-anim-title">

              A Place To Worship
              <br />
              Grow &amp; Belong

            </h1>

            <p className="hero-desc hero-anim-desc">

              We are a community of believers committed
              to following Jesus Christ, growing in faith,
              serving others, and sharing the love of God
              with our community.

            </p>


            <div className="hero-actions">

              <Link
                to="/about"
                className="btn-outline-white hero-anim-btn"
              >
                Discover Answered Prayer Network
              </Link>


              <Link
                to="/contact"
                className="btn-gold hero-anim-btn"
              >
                Plan Your Visit
              </Link>

            </div>

          </div>

        </section>


        {/* =================================================
            ADVERTS MARQUEE
        ================================================= */}

        <section className="adverts">

          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="6"
          >
            {randomMessage}
          </marquee>

        </section>


        {/* =================================================
            BIRTHDAY CELEBRANTS
        ================================================= */}

        <BirthdayCelebrants />


      {/* =================================================
    MEDIA SECTION
================================================= */}

<section className="media-section">

  <div className="media-columns">

    {/* =================================================
        LEFT COLUMN: SELECTED VIDEO + AUDIO
    ================================================= */}

    <div className="media-column videos">

      <div className="media-selector-card">

        <h2 className="media-selector-title">
          Media Player
        </h2>


        {/* =================================================
            VIDEO SELECTOR
        ================================================= */}

        <div className="media-control-group">

          <label htmlFor="video-select">
          🎬 Commanding Your Week
        </label>

          <select
            id="video-select"
            value={selectedVideoIndex}
            onChange={(e) =>
              setSelectedVideoIndex(
                Number(e.target.value)
              )
            }
          >

            <option value="">
            Commanding Your Week Videos
            </option>

            {videoItems.map((item, index) => (
              <option
                value={index}
                key={`${item.fileName || item.src}-${index}`}
              >
                {item.title}
              </option>
            ))}

          </select>

        </div>


        {/* =================================================
            SELECTED VIDEO
        ================================================= */}

        {selectedVideo && (

          <div className="selected-video">

            {selectedVideo.isYouTube ? (

              <iframe
                width="100%"
                height="315"
                src={selectedVideo.embedUrl}
                title={selectedVideo.alt}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            ) : (

              <video
                key={selectedVideo.src}
                width="100%"
                controls
                preload="metadata"
              >
                <source
                  src={selectedVideo.src}
                />

                Your browser does not support
                video playback.
              </video>

            )}

          </div>

        )}


        {/* =================================================
            AUDIO SELECTOR
        ================================================= */}

        <div className="media-control-group">
        <label htmlFor="audio-select">
          🎵 Select Audio
        </label>
          <select
            id="audio-select"
            value={selectedAudioIndex}
            onChange={(e) =>
              setSelectedAudioIndex(
                Number(e.target.value)
              )
            }
          >

            <option value="">
              Select an audio
            </option>

            {audioItems.map((item, index) => (
              <option
                value={index}
                key={`${item.fileName || item.src}-${index}`}
              >
                {item.title}
              </option>
            ))}

          </select>

        </div>

{/* =================================================
    COMMANDING YOUR WEEK VIDEOS
================================================= */}

      <div className="media-control-group commanding-week-selector">
  <label htmlFor="commanding-week-select">
    🎬 Commanding Your Week Videos
  </label>

  <select
    id="commanding-week-select"
    value={selectedCommandingWeekIndex}
    onChange={(e) =>
      setSelectedCommandingWeekIndex(
        e.target.value === ''
          ? ''
          : Number(e.target.value)
      )
    }
  >

    <option value="">
      Select Commanding Your Week Video
    </option>

    {commandingWeekItem?.videos?.map(
      (video, index) => (

        <option
          key={`${video.src}-${index}`}
          value={index}
        >
          {video.title}
        </option>

      )
    )}

  </select>

{/* =================================================
    SELECTED COMMANDING YOUR WEEK VIDEO
================================================= */}

{selectedCommandingWeekIndex !== '' &&
  commandingWeekItem?.videos?.[
    selectedCommandingWeekIndex
  ] && (

    <div className="selected-video commanding-week-video">

      {commandingWeekItem.videos[
        selectedCommandingWeekIndex
      ].isYouTube ? (

        <iframe
          width="100%"
          height="315"
          src={
            commandingWeekItem.videos[
              selectedCommandingWeekIndex
            ].embedUrl
          }
          title={
            commandingWeekItem.videos[
              selectedCommandingWeekIndex
            ].title
          }
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

      ) : (

        <video
          width="100%"
          controls
          preload="metadata"
        >

          <source
            src={
              commandingWeekItem.videos[
                selectedCommandingWeekIndex
              ].src
            }
          />

          Your browser does not support
          video playback.

        </video>

      )}

    </div>

  )}

  {/* =================================================
    MEDIA SELECTION HINT
================================================= */}

<div className="media-selection-hint">

  <div className="hint-arrow">
    ↑
  </div>

  <div className="hint-icon">
    🎬
  </div>

  <p>
    Select a video or audio above
  </p>

  <span>
    Choose from our available media
  </span>

</div>
      </div>

        {/* =================================================
            SELECTED AUDIO
        ================================================= */}

        {selectedAudio && (
          <div className="selected-audio">
            <p>
              {selectedAudio.title}
            </p>
            <audio
              key={selectedAudio.src}
              controls
              preload="metadata"
              style={{
                width: '100%',
              }}
            >
              <source
                src={selectedAudio.src}
              />
              Your browser does not support
              audio playback.

            </audio>

          </div>

        )}

      </div>

    </div>


    {/* =================================================
        RIGHT COLUMN: IMAGE SLIDER
    ================================================= */}

    <div className="media-column images">

      <div className="image-slider">

        {(() => {

          const images =
            mediaItems.filter(
              (item) =>
                item.type === 'image'
            );

          if (images.length === 0) {
            return null;
          }

          const safeIndex =
            currentIndex >= images.length
              ? 0
              : currentIndex;

          return (
            <img
              src={
                images[safeIndex].src
              }
              alt={
                images[safeIndex].alt
              }
            />
          );

        })()}

      </div>

    </div>

  </div>

</section>
        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="welcome">

          <div
            className={`welcome-inner anim-fade-up ${
              welcomeVisible
                ? 'visible'
                : ''
            }`}
            ref={welcomeRef}
          >

            <p
              className="section-eyebrow"
              style={{
                textAlign: 'center',
              }}
            >
              Welcome Home
            </p>


            <h2
              className="section-title"
              style={{
                textAlign: 'center',
              }}
            >
              You Belong Here
            </h2>


            <span className="gold-rule centered" />


            <p className="welcome-desc">

              Whether you are discovering faith for
              the first time, returning to Answered
              Prayer Network, or looking for a church
              family, you are welcome here. We gather
              to worship God, study His Word, pray
              together, build meaningful relationships,
              and serve our community with love.

            </p>

          </div>


          {/* =================================================
              MINISTRIES
          ================================================= */}

          <div
            className="services-grid"
            ref={ministriesRef}
          >

            {ministries.map(
              (ministry, index) => (

                <div
                  className={`service-card anim-fade-up delay-${
                    index + 1
                  } ${
                    ministriesVisible
                      ? 'visible'
                      : ''
                  }`}
                  key={ministry.title}
                >

                  <img
                    src={ministry.icon}
                    alt={`${ministry.title} icon`}
                    className="service-icon"
                  />


                  <h3 className="service-title">
                    {ministry.title}
                  </h3>


                  <p className="service-desc">
                    {ministry.desc}
                  </p>

                </div>

              )
            )}

          </div>


          <div className="welcome-cta">

            <Link
              to="/services"
              className="btn-gold"
            >
              Explore Our Ministries
            </Link>

          </div>

        </section>


        {/* =================================================
            WHY / OUR MISSION
        ================================================= */}

        <section className="why-us">

          <div className="why-inner">


            <div
              className={`why-text anim-slide-left ${
                whyTextVisible
                  ? 'visible'
                  : ''
              }`}
              ref={whyTextRef}
            >

              <p className="section-eyebrow">
                Our Mission
              </p>


              <h2
                className="section-title"
                style={{
                  color: 'var(--white)',
                }}
              >

                Growing Together
                <br />
                In Faith &amp; Love

              </h2>


              <span className="gold-rule" />


              <p className="why-desc">

                Our desire is to create a Christ-centered
                community where people can encounter God,
                grow spiritually, discover their gifts,
                build lasting relationships, and make a
                positive difference in the lives of others.

              </p>


              <Link
                to="/about"
                className="btn-outline-gold"
                style={{
                  marginTop: 32,
                  display: 'inline-block',
                }}
              >
                Learn More About Answered Prayer Network
              </Link>

            </div>


            <div
              className={`why-image anim-slide-right ${
                whyImgVisible
                  ? 'visible'
                  : ''
              }`}
              ref={whyImgRef}
            >

              <img
                src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1000&q=85"
                alt="People worshipping together in church"
              />


              <div className="why-badge">

                <span className="badge-cross">
                  ✝
                </span>


                <span className="badge-label">

                  Faith
                  <br />
                  Hope
                  <br />
                  Love

                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            STATS
        ================================================= */}

        <section className="stats">

          {statsData.map((stat) => (

            <StatItem
              key={stat.label}
              number={stat.number}
              label={stat.label}
            />

          ))}

        </section>


        {/* =================================================
            CTA
        ================================================= */}

        <section className="home-cta">

          <div className="home-cta-inner">

            <p className="section-eyebrow">
              You Are Welcome
            </p>


            <h2 className="home-cta-title">
              Come Worship With Answered Prayer Network
            </h2>


            <p className="home-cta-desc">

              We would love to welcome you and your
              family. Come as you are and experience
              a community built around Christ at
              Answered Prayer Network.

            </p>


            <div className="home-cta-buttons">

              <Link
                to="/contact"
                className="btn-gold"
              >
                Plan Your Visit
              </Link>


              <Link
                to="/services"
                className="btn-outline-gold"
              >
                Explore Ministries
              </Link>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <Footer />


        {/* =================================================
            CHATBOT
        ================================================= */}

        <Link
          to="/chatbot"
          className="chatbot-icon"
          aria-label="Answered Prayer Network Chatbot"
        >

          <FaComments
            className="chatbot-icon-symbol"
          />

          <span>
            Chat With Us
          </span>

        </Link>

      </main>

    </>
  );
}