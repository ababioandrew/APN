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
import Swal from "sweetalert2";
import AnnouncementBoard from '../components/AnnouncementBoard';
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
import supportContact from '../assets/images/supportContact.jpeg';

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
import apnImage17 from '../assets/images/menthorShip.jpeg';

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

const commandingWeekVideos = [
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pHvM7OhRGJc',
embedUrl: 'https://www.youtube.com/embed/pHvM7OhRGJc',
isYouTube: true,
title: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
alt: 'Answered Prayer Network',
duration: '2:07:09'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=f-XEk3Efw5o',
embedUrl: 'https://www.youtube.com/embed/f-XEk3Efw5o',
isYouTube: true,
title: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
alt: 'Answered Prayer Network',
duration: '2:39:53'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=z57II3LdN7E',
embedUrl: 'https://www.youtube.com/embed/z57II3LdN7E',
isYouTube: true,
title: '7 HOURS PRAYER : OVERTHROWING DEMONIC ALATRS 2',
alt: 'Answered Prayer Network',
duration: '1:51:50'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=QDbO0e68h74',
embedUrl: 'https://www.youtube.com/embed/QDbO0e68h74',
isYouTube: true,
title: 'COMMAND YOUR WEEK SERVICE - 1ST NOVEMBER 2026.',
alt: 'Commanding Your Week',
duration: '4:02:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=JFW4mh1NQ_E',
embedUrl: 'https://www.youtube.com/embed/JFW4mh1NQ_E',
isYouTube: true,
title: 'COMAND YOUR WEEK SUNDAY SERVICE - 25/10/2026',
alt: 'Commanding Your Week',
duration: '3:44:21'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE',
embedUrl: 'https://www.youtube.com/embed/NSGc6wJgTRE',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE. 18TH OCTOBER 2026.',
alt: 'Commanding Your Week',
duration: '49:39:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=SCk2Eduu6Gc',
embedUrl: 'https://www.youtube.com/embed/SCk2Eduu6Gc',
isYouTube: true,
title: 'COMMAND YOUR WEEK :READING THE SPEAKINGS OF AN ALTAR 11TH OCTOBER 2026',
alt: 'Commanding Your Week',
duration: '3:12:40'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=PY2HTpO_-Hk',
embedUrl: 'https://www.youtube.com/embed/PY2HTpO_-Hk',
isYouTube: true,
title: '7 HOURS OF PRAYERS - OVERTHROWING DEMONIC ALTARS.',
alt: 'Answered Prayer Network',
duration: '6:53:31'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=JE3rARGfSyg',
embedUrl: 'https://www.youtube.com/embed/JE3rARGfSyg',
isYouTube: true,
title: 'COMMAND YOUR WEEK - DEALING WITH DEMONIC RESISTANCE-- 27/09/2026',
alt: 'Commanding Your Week',
duration: '4:05:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ChwpcNMsR38',
embedUrl: 'https://www.youtube.com/embed/ChwpcNMsR38',
isYouTube: true,
title: "COMMAND YOUR WEEK - DEALING WITH ALTARS AGAINST GOD'S PLAN FOR YOUR LIFE- 20TH SEPTEMBER 2026",
alt: 'Commanding Your Week',
duration: '3:37:58'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=HevKhedmZPk',
embedUrl: 'https://www.youtube.com/embed/HevKhedmZPk',
isYouTube: true,
title: 'testing',
alt: 'Answered Prayer Network',
duration: '1:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=_Bh0GP82bg0',
embedUrl: 'https://www.youtube.com/embed/_Bh0GP82bg0',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '2:44:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=1T0CZsr49qk',
embedUrl: 'https://www.youtube.com/embed/1T0CZsr49qk',
isYouTube: true,
title: 'COMMAND YOUR WEEK, RECOVERING THE AXE HEAD 13 SEPTEMBER 2026',
alt: 'Commanding Your Week',
duration: '59:29:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GgRtrVpf12s',
embedUrl: 'https://www.youtube.com/embed/GgRtrVpf12s',
isYouTube: true,
title: '7 HOURS PRAYER , OVERTHROWING SATANIC ALTARS',
alt: 'Answered Prayer Network',
duration: '6:26:33'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=BJXJ9HmbvFk',
embedUrl: 'https://www.youtube.com/embed/BJXJ9HmbvFk',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '3:57:26'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3SExAYuq8qw',
embedUrl: 'https://www.youtube.com/embed/3SExAYuq8qw',
isYouTube: true,
title: 'COMMAND YOUR WEEK SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '2:16:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pNeZIvRGyqg',
embedUrl: 'https://www.youtube.com/embed/pNeZIvRGyqg',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE - 23/08/26',
alt: 'Commanding Your Week',
duration: '19:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=_JEHoemPADA',
embedUrl: 'https://www.youtube.com/embed/_JEHoemPADA',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE - 16TH AUGUST 2026.',
alt: 'Commanding Your Week',
duration: '3:34:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=Z0roJRaFmBc',
embedUrl: 'https://www.youtube.com/embed/Z0roJRaFmBc',
isYouTube: true,
title: 'COMMAND YOUR WEEK - WHAT SUBSTANCE DID YOU RECEIVE -9TH AUGUST 2026.',
alt: 'Commanding Your Week',
duration: '4:00:53'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GIQ_0LELhx0',
embedUrl: 'https://www.youtube.com/embed/GIQ_0LELhx0',
isYouTube: true,
title: '7 HOURS PRAYER - DIVINE INTERVENTION.',
alt: 'Answered Prayer Network',
duration: '6:26:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pHl15LnZCME',
embedUrl: 'https://www.youtube.com/embed/pHl15LnZCME',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SATISFY ME EARLY-26TH JULY 2026.',
alt: 'Commanding Your Week',
duration: '3:38:39'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=BIj7IW4Mlh0',
embedUrl: 'https://www.youtube.com/embed/BIj7IW4Mlh0',
isYouTube: true,
title: 'COMMAN YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:23:25'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CXLeNShiqYk',
embedUrl: 'https://www.youtube.com/embed/CXLeNShiqYk',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:37:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2CLrPuvayZQ',
embedUrl: 'https://www.youtube.com/embed/2CLrPuvayZQ',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '3:15:46'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=r6SJ5fFy19g',
embedUrl: 'https://www.youtube.com/embed/r6SJ5fFy19g',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, DAY 70',
alt: 'Answered Prayer Network',
duration: '2:30:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=hpx-Bx87eK4',
embedUrl: 'https://www.youtube.com/embed/hpx-Bx87eK4',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '2:58:28'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=4zFuWtYW01M',
embedUrl: 'https://www.youtube.com/embed/4zFuWtYW01M',
isYouTube: true,
title: '70 DAYS FASTING AND PRAYERS, COMMAND YOUR WEEK SERVICE',
alt: 'Commanding Your Week',
duration: '13:49'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=wEfpmYKD1lU',
embedUrl: 'https://www.youtube.com/embed/wEfpmYKD1lU',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:38:22'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3aYxeaPPfjs',
embedUrl: 'https://www.youtube.com/embed/3aYxeaPPfjs',
isYouTube: true,
title: "'' COMMAND YOUR WEEK '' SUNDAY SERVICE.",
alt: 'Commanding Your Week',
duration: '3:40:38'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VbOYcW1uuy8',
embedUrl: 'https://www.youtube.com/embed/VbOYcW1uuy8',
isYouTube: true,
title: "'' COMMAND YOUR WEEK '' SUNDAY SERVICE.",
alt: 'Commanding Your Week',
duration: '3:37:56'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=5nFotNZwMDU',
embedUrl: 'https://www.youtube.com/embed/5nFotNZwMDU',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '1:01:30'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VqOoVzEwQXw',
embedUrl: 'https://www.youtube.com/embed/VqOoVzEwQXw',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '38:32:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=6-M-Zbym_6M',
embedUrl: 'https://www.youtube.com/embed/6-M-Zbym_6M',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '57:40:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=R7pKJX36mg4',
embedUrl: 'https://www.youtube.com/embed/R7pKJX36mg4',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '16:13'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=92pp1tiLDXM',
embedUrl: 'https://www.youtube.com/embed/92pp1tiLDXM',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '16:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3PG3frsgnEE',
embedUrl: 'https://www.youtube.com/embed/3PG3frsgnEE',
isYouTube: true,
title: 'COMMAND YOUR WEEK - 70 DAYS OF FASTING & PRAYERS.',
alt: 'Commanding Your Week',
duration: '3:19:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=AfoVa0ENtLk',
embedUrl: 'https://www.youtube.com/embed/AfoVa0ENtLk',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '6:22:44'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=NxdGg9h7jcs',
embedUrl: 'https://www.youtube.com/embed/NxdGg9h7jcs',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '2:48:35'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VJMhVmmLSC0',
embedUrl: 'https://www.youtube.com/embed/VJMhVmmLSC0',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '4:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3m_olIfinao',
embedUrl: 'https://www.youtube.com/embed/3m_olIfinao',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:14:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=s-dC2JGD63w',
embedUrl: 'https://www.youtube.com/embed/s-dC2JGD63w',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:41:02'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=QqJTxfdJAEo',
embedUrl: 'https://www.youtube.com/embed/QqJTxfdJAEo',
isYouTube: true,
title: '7 HOURS PRAYER : THE WILL OF GOD',
alt: 'Answered Prayer Network',
duration: '1:06:32'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=dXFsQVzZfvs',
embedUrl: 'https://www.youtube.com/embed/dXFsQVzZfvs',
isYouTube: true,
title: '7 HOURS PRAYER : THE WILL OF GOD',
alt: 'Answered Prayer Network',
duration: '1:57:13'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=XyGhj9o_UsA',
embedUrl: 'https://www.youtube.com/embed/XyGhj9o_UsA',
isYouTube: true,
title: 'COMMAND YOUR WEEK - BREAKTHROUGH SERVICE.',
alt: 'Commanding Your Week',
duration: '3:25:28'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=KG9QdhtYEoU',
embedUrl: 'https://www.youtube.com/embed/KG9QdhtYEoU',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:52:58'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CigoSSrl_VM',
embedUrl: 'https://www.youtube.com/embed/CigoSSrl_VM',
isYouTube: true,
title: 'SCHOOL OF PRAYER : STAYING WITH GOD IN PRAYER',
alt: 'School of Prayer',
duration: '3:20:06'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2Pyfo-Q7d0s',
embedUrl: 'https://www.youtube.com/embed/2Pyfo-Q7d0s',
isYouTube: true,
title: '7 HOURS OF PRAYER',
alt: 'Answered Prayer Network',
duration: '5:27:12'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ceeGjUY2QOM',
embedUrl: 'https://www.youtube.com/embed/ceeGjUY2QOM',
isYouTube: true,
title: 'BREAKTHROUGH SERVICE',
alt: 'Breakthrough Service',
duration: '4:02:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=E_ZKx3Gp9Ss',
embedUrl: 'https://www.youtube.com/embed/E_ZKx3Gp9Ss',
isYouTube: true,
title: 'SPIRITUAL WARFARE',
alt: 'Spiritual Warfare',
duration: '4:21:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=18WEuo_xiW0',
embedUrl: 'https://www.youtube.com/embed/18WEuo_xiW0',
isYouTube: true,
title: 'PRAY WITHOUT CEASING',
alt: 'Prayer Service',
duration: '3:07:43'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3oYRcXbQ82Y',
embedUrl: 'https://www.youtube.com/embed/3oYRcXbQ82Y',
isYouTube: true,
title: 'PRAY WITHOUT CEASING',
alt: 'Prayer Service',
duration: '1:15:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=A7o1qfyU464',
embedUrl: 'https://www.youtube.com/embed/A7o1qfyU464',
isYouTube: true,
title: 'SCHOOL OF PRAYER',
alt: 'School of Prayer',
duration: '4:11:19'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2pRsOcFJeoA',
embedUrl: 'https://www.youtube.com/embed/2pRsOcFJeoA',
isYouTube: true,
title: 'END OF YEAR SERVICE - THANKSGIVING SERVICE',
alt: 'Thanksgiving Service',
duration: '5:07:54'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GifdsfOp2mE',
embedUrl: 'https://www.youtube.com/embed/GifdsfOp2mE',
isYouTube: true,
title: 'THERE SHALL BE A PERFORMANCE',
alt: 'Answered Prayer Network',
duration: '3:24:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=bB-ltQU54LU',
embedUrl: 'https://www.youtube.com/embed/bB-ltQU54LU',
isYouTube: true,
title: 'SCHOOL OF PRAYER',
alt: 'School of Prayer',
duration: '2:57:08'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=DAdTiNSQ7JE',
embedUrl: 'https://www.youtube.com/embed/DAdTiNSQ7JE',
isYouTube: true,
title: '7 hours Prayer',
alt: 'Answered Prayer Network',
duration: '15:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ET90ErCew4E',
embedUrl: 'https://www.youtube.com/embed/ET90ErCew4E',
isYouTube: true,
title: '7 HOURS PRAYERS',
alt: 'Answered Prayer Network',
duration: '1:29:57'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=sHQwqKj3j1s',
embedUrl: 'https://www.youtube.com/embed/sHQwqKj3j1s',
isYouTube: true,
title: 'BREAKTHROUGH SERVICE',
alt: 'Breakthrough Service',
duration: '3:40:20'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=4qGgHFkpLkM',
embedUrl: 'https://www.youtube.com/embed/4qGgHFkpLkM',
isYouTube: true,
title: 'HOW GOD RESTORES MEN',
alt: 'Answered Prayer Network',
duration: '4:19:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CrbRh7bIOVs',
embedUrl: 'https://www.youtube.com/embed/CrbRh7bIOVs',
isYouTube: true,
title: 'PRAYER AND DELIVERANCE SERVICE',
alt: 'Prayer and Deliverance',
duration: '4:38:12'
}
].map(normalizeVideo);

const localVideos = [
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pHvM7OhRGJc',
embedUrl: 'https://www.youtube.com/embed/pHvM7OhRGJc',
isYouTube: true,
title: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
alt: 'Answered Prayer Network',
duration: '2:07:09'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=f-XEk3Efw5o',
embedUrl: 'https://www.youtube.com/embed/f-XEk3Efw5o',
isYouTube: true,
title: '7 HOURS PRAYER: OVERTHROWING DEMONIC ALTARS 2',
alt: 'Answered Prayer Network',
duration: '2:39:53'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=z57II3LdN7E',
embedUrl: 'https://www.youtube.com/embed/z57II3LdN7E',
isYouTube: true,
title: '7 HOURS PRAYER : OVERTHROWING DEMONIC ALATRS 2',
alt: 'Answered Prayer Network',
duration: '1:51:50'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=QDbO0e68h74',
embedUrl: 'https://www.youtube.com/embed/QDbO0e68h74',
isYouTube: true,
title: 'COMMAND YOUR WEEK SERVICE - 1ST NOVEMBER 2026.',
alt: 'Commanding Your Week',
duration: '4:02:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=JFW4mh1NQ_E',
embedUrl: 'https://www.youtube.com/embed/JFW4mh1NQ_E',
isYouTube: true,
title: 'COMAND YOUR WEEK SUNDAY SERVICE - 25/10/2026',
alt: 'Commanding Your Week',
duration: '3:44:21'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE',
embedUrl: 'https://www.youtube.com/embed/NSGc6wJgTRE',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE. 18TH OCTOBER 2026.',
alt: 'Commanding Your Week',
duration: '49:39:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=SCk2Eduu6Gc',
embedUrl: 'https://www.youtube.com/embed/SCk2Eduu6Gc',
isYouTube: true,
title: 'COMMAND YOUR WEEK :READING THE SPEAKINGS OF AN ALTAR 11TH OCTOBER 2026',
alt: 'Commanding Your Week',
duration: '3:12:40'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=PY2HTpO_-Hk',
embedUrl: 'https://www.youtube.com/embed/PY2HTpO_-Hk',
isYouTube: true,
title: '7 HOURS OF PRAYERS - OVERTHROWING DEMONIC ALTARS.',
alt: 'Answered Prayer Network',
duration: '6:53:31'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=JE3rARGfSyg',
embedUrl: 'https://www.youtube.com/embed/JE3rARGfSyg',
isYouTube: true,
title: 'COMMAND YOUR WEEK - DEALING WITH DEMONIC RESISTANCE-- 27/09/2026',
alt: 'Commanding Your Week',
duration: '4:05:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ChwpcNMsR38',
embedUrl: 'https://www.youtube.com/embed/ChwpcNMsR38',
isYouTube: true,
title: "COMMAND YOUR WEEK - DEALING WITH ALTARS AGAINST GOD'S PLAN FOR YOUR LIFE- 20TH SEPTEMBER 2026",
alt: 'Commanding Your Week',
duration: '3:37:58'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=HevKhedmZPk',
embedUrl: 'https://www.youtube.com/embed/HevKhedmZPk',
isYouTube: true,
title: 'testing',
alt: 'Answered Prayer Network',
duration: '1:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=_Bh0GP82bg0',
embedUrl: 'https://www.youtube.com/embed/_Bh0GP82bg0',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '2:44:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=1T0CZsr49qk',
embedUrl: 'https://www.youtube.com/embed/1T0CZsr49qk',
isYouTube: true,
title: 'COMMAND YOUR WEEK, RECOVERING THE AXE HEAD 13 SEPTEMBER 2026',
alt: 'Commanding Your Week',
duration: '59:29:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GgRtrVpf12s',
embedUrl: 'https://www.youtube.com/embed/GgRtrVpf12s',
isYouTube: true,
title: '7 HOURS PRAYER , OVERTHROWING SATANIC ALTARS',
alt: 'Answered Prayer Network',
duration: '6:26:33'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=BJXJ9HmbvFk',
embedUrl: 'https://www.youtube.com/embed/BJXJ9HmbvFk',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '3:57:26'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3SExAYuq8qw',
embedUrl: 'https://www.youtube.com/embed/3SExAYuq8qw',
isYouTube: true,
title: 'COMMAND YOUR WEEK SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '2:16:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pNeZIvRGyqg',
embedUrl: 'https://www.youtube.com/embed/pNeZIvRGyqg',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE - 23/08/26',
alt: 'Commanding Your Week',
duration: '19:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=_JEHoemPADA',
embedUrl: 'https://www.youtube.com/embed/_JEHoemPADA',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE - 16TH AUGUST 2026.',
alt: 'Commanding Your Week',
duration: '3:34:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=Z0roJRaFmBc',
embedUrl: 'https://www.youtube.com/embed/Z0roJRaFmBc',
isYouTube: true,
title: 'COMMAND YOUR WEEK - WHAT SUBSTANCE DID YOU RECEIVE -9TH AUGUST 2026.',
alt: 'Commanding Your Week',
duration: '4:00:53'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GIQ_0LELhx0',
embedUrl: 'https://www.youtube.com/embed/GIQ_0LELhx0',
isYouTube: true,
title: '7 HOURS PRAYER - DIVINE INTERVENTION.',
alt: 'Answered Prayer Network',
duration: '6:26:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=pHl15LnZCME',
embedUrl: 'https://www.youtube.com/embed/pHl15LnZCME',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SATISFY ME EARLY-26TH JULY 2026.',
alt: 'Commanding Your Week',
duration: '3:38:39'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=BIj7IW4Mlh0',
embedUrl: 'https://www.youtube.com/embed/BIj7IW4Mlh0',
isYouTube: true,
title: 'COMMAN YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:23:25'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CXLeNShiqYk',
embedUrl: 'https://www.youtube.com/embed/CXLeNShiqYk',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:37:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2CLrPuvayZQ',
embedUrl: 'https://www.youtube.com/embed/2CLrPuvayZQ',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '3:15:46'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=r6SJ5fFy19g',
embedUrl: 'https://www.youtube.com/embed/r6SJ5fFy19g',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, DAY 70',
alt: 'Answered Prayer Network',
duration: '2:30:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=hpx-Bx87eK4',
embedUrl: 'https://www.youtube.com/embed/hpx-Bx87eK4',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE',
alt: 'Commanding Your Week',
duration: '2:58:28'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=4zFuWtYW01M',
embedUrl: 'https://www.youtube.com/embed/4zFuWtYW01M',
isYouTube: true,
title: '70 DAYS FASTING AND PRAYERS, COMMAND YOUR WEEK SERVICE',
alt: 'Commanding Your Week',
duration: '13:49'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=wEfpmYKD1lU',
embedUrl: 'https://www.youtube.com/embed/wEfpmYKD1lU',
isYouTube: true,
title: 'COMMAND YOUR WEEK - SUNDAY SERVICE.',
alt: 'Commanding Your Week',
duration: '2:38:22'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3aYxeaPPfjs',
embedUrl: 'https://www.youtube.com/embed/3aYxeaPPfjs',
isYouTube: true,
title: "'' COMMAND YOUR WEEK '' SUNDAY SERVICE.",
alt: 'Commanding Your Week',
duration: '3:40:38'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VbOYcW1uuy8',
embedUrl: 'https://www.youtube.com/embed/VbOYcW1uuy8',
isYouTube: true,
title: "'' COMMAND YOUR WEEK '' SUNDAY SERVICE.",
alt: 'Commanding Your Week',
duration: '3:37:56'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=5nFotNZwMDU',
embedUrl: 'https://www.youtube.com/embed/5nFotNZwMDU',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '1:01:30'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VqOoVzEwQXw',
embedUrl: 'https://www.youtube.com/embed/VqOoVzEwQXw',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '38:32:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=6-M-Zbym_6M',
embedUrl: 'https://www.youtube.com/embed/6-M-Zbym_6M',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '57:40:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=R7pKJX36mg4',
embedUrl: 'https://www.youtube.com/embed/R7pKJX36mg4',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '16:13'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=92pp1tiLDXM',
embedUrl: 'https://www.youtube.com/embed/92pp1tiLDXM',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '16:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3PG3frsgnEE',
embedUrl: 'https://www.youtube.com/embed/3PG3frsgnEE',
isYouTube: true,
title: 'COMMAND YOUR WEEK - 70 DAYS OF FASTING & PRAYERS.',
alt: 'Commanding Your Week',
duration: '3:19:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=AfoVa0ENtLk',
embedUrl: 'https://www.youtube.com/embed/AfoVa0ENtLk',
isYouTube: true,
title: '70 DAYS OF FASTING AND PRAYERS, 7 HOURS PRAYER',
alt: 'Answered Prayer Network',
duration: '6:22:44'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=NxdGg9h7jcs',
embedUrl: 'https://www.youtube.com/embed/NxdGg9h7jcs',
isYouTube: true,
title: 'COMMAND YOUR WEEK',
alt: 'Commanding Your Week',
duration: '2:48:35'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=VJMhVmmLSC0',
embedUrl: 'https://www.youtube.com/embed/VJMhVmmLSC0',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '4:16'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3m_olIfinao',
embedUrl: 'https://www.youtube.com/embed/3m_olIfinao',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:14:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=s-dC2JGD63w',
embedUrl: 'https://www.youtube.com/embed/s-dC2JGD63w',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:41:02'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=QqJTxfdJAEo',
embedUrl: 'https://www.youtube.com/embed/QqJTxfdJAEo',
isYouTube: true,
title: '7 HOURS PRAYER : THE WILL OF GOD',
alt: 'Answered Prayer Network',
duration: '1:06:32'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=dXFsQVzZfvs',
embedUrl: 'https://www.youtube.com/embed/dXFsQVzZfvs',
isYouTube: true,
title: '7 HOURS PRAYER : THE WILL OF GOD',
alt: 'Answered Prayer Network',
duration: '1:57:13'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=XyGhj9o_UsA',
embedUrl: 'https://www.youtube.com/embed/XyGhj9o_UsA',
isYouTube: true,
title: 'COMMAND YOUR WEEK - BREAKTHROUGH SERVICE.',
alt: 'Commanding Your Week',
duration: '3:25:28'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=KG9QdhtYEoU',
embedUrl: 'https://www.youtube.com/embed/KG9QdhtYEoU',
isYouTube: true,
title: 'COMMAND YOUR WEEK.',
alt: 'Commanding Your Week',
duration: '3:52:58'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CigoSSrl_VM',
embedUrl: 'https://www.youtube.com/embed/CigoSSrl_VM',
isYouTube: true,
title: 'SCHOOL OF PRAYER : STAYING WITH GOD IN PRAYER',
alt: 'School of Prayer',
duration: '3:20:06'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2Pyfo-Q7d0s',
embedUrl: 'https://www.youtube.com/embed/2Pyfo-Q7d0s',
isYouTube: true,
title: '7 HOURS OF PRAYER',
alt: 'Answered Prayer Network',
duration: '5:27:12'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ceeGjUY2QOM',
embedUrl: 'https://www.youtube.com/embed/ceeGjUY2QOM',
isYouTube: true,
title: 'BREAKTHROUGH SERVICE',
alt: 'Breakthrough Service',
duration: '4:02:59'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=E_ZKx3Gp9Ss',
embedUrl: 'https://www.youtube.com/embed/E_ZKx3Gp9Ss',
isYouTube: true,
title: 'SPIRITUAL WARFARE',
alt: 'Spiritual Warfare',
duration: '4:21:55'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=18WEuo_xiW0',
embedUrl: 'https://www.youtube.com/embed/18WEuo_xiW0',
isYouTube: true,
title: 'PRAY WITHOUT CEASING',
alt: 'Prayer Service',
duration: '3:07:43'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=3oYRcXbQ82Y',
embedUrl: 'https://www.youtube.com/embed/3oYRcXbQ82Y',
isYouTube: true,
title: 'PRAY WITHOUT CEASING',
alt: 'Prayer Service',
duration: '1:15:00'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=A7o1qfyU464',
embedUrl: 'https://www.youtube.com/embed/A7o1qfyU464',
isYouTube: true,
title: 'SCHOOL OF PRAYER',
alt: 'School of Prayer',
duration: '4:11:19'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=2pRsOcFJeoA',
embedUrl: 'https://www.youtube.com/embed/2pRsOcFJeoA',
isYouTube: true,
title: 'END OF YEAR SERVICE - THANKSGIVING SERVICE',
alt: 'Thanksgiving Service',
duration: '5:07:54'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=GifdsfOp2mE',
embedUrl: 'https://www.youtube.com/embed/GifdsfOp2mE',
isYouTube: true,
title: 'THERE SHALL BE A PERFORMANCE',
alt: 'Answered Prayer Network',
duration: '3:24:24'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=bB-ltQU54LU',
embedUrl: 'https://www.youtube.com/embed/bB-ltQU54LU',
isYouTube: true,
title: 'SCHOOL OF PRAYER',
alt: 'School of Prayer',
duration: '2:57:08'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=DAdTiNSQ7JE',
embedUrl: 'https://www.youtube.com/embed/DAdTiNSQ7JE',
isYouTube: true,
title: '7 hours Prayer',
alt: 'Answered Prayer Network',
duration: '15:14'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=ET90ErCew4E',
embedUrl: 'https://www.youtube.com/embed/ET90ErCew4E',
isYouTube: true,
title: '7 HOURS PRAYERS',
alt: 'Answered Prayer Network',
duration: '1:29:57'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=sHQwqKj3j1s',
embedUrl: 'https://www.youtube.com/embed/sHQwqKj3j1s',
isYouTube: true,
title: 'BREAKTHROUGH SERVICE',
alt: 'Breakthrough Service',
duration: '3:40:20'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=4qGgHFkpLkM',
embedUrl: 'https://www.youtube.com/embed/4qGgHFkpLkM',
isYouTube: true,
title: 'HOW GOD RESTORES MEN',
alt: 'Answered Prayer Network',
duration: '4:19:37'
},
{
type: 'video',
src: 'https://www.youtube.com/watch?v=CrbRh7bIOVs',
embedUrl: 'https://www.youtube.com/embed/CrbRh7bIOVs',
isYouTube: true,
title: 'PRAYER AND DELIVERANCE SERVICE',
alt: 'Prayer and Deliverance',
duration: '4:38:12'
}
];

const localAudios = [
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1dIp-bszTMGFEB3y6LNbwWj8IeGD7f2Cp', title: 'Lord teach me your ways', alt: 'Lord teach me your ways', fileName: 'Lord teach me your ways', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1eneFciwAOhkYEujY_eR2GcKvFWPlY1RY', title: 'Lord show me what to do', alt: 'Lord show me what to do', fileName: 'Lord show me what to do', local: true },  
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zYBrCqq7oWnbFfu8th2uSiDOASPj3ozY', title: '1st Partners meeting 2025', alt: '1st Partners meeting 2025', fileName: '1st Partners meeting 2025', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1kDdm_pJkP5LJR2qlXKcBkctOZUYA2NN1', title: 'Court Of Heaven day 2', alt: 'Court Of Heaven day 2', fileName: 'Court Of Heaven day 2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1XDgbawuJlvu-e5TRSSSZx0EoLT-uAgB6', title: 'Look upon me with mercy', alt: 'Look upon me with mercy', fileName: 'Look upon me with mercy', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1s8Kwp49GZG99NuRa9KHXu0RzB64g_r5P', title: 'heighten my Discernment', alt: 'heighten my Discernment', fileName: 'heighten my Discernment', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1duC1koBeulxcec6Fc53cLjcVK11zChft', title: 'Divine Restoration day 2', alt: 'Divine Restoration day 2', fileName: 'Divine Restoration day 2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1__h3ZpqZH9TyancDdc6Lhu8x3a2b4TMC', title: 'Divine Restoration day 1', alt: 'Divine Restoration day 2', fileName: 'Divine Restoration day 2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1-llpkekmqCLd3wW6C_xPgK4v39-To-SH', title: 'Restoration day 2', alt: 'Restoration day 2', fileName: 'Restoration day 2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1epFrY6k5mmd-cGJp8chAgB5CvXSrNnJz', title: 'Restoration day 1', alt: 'Restoration day 1', fileName: 'Restoration day 1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1manoB8udsFJy10UURSdtO73GNbOxGUUT', title: 'Language of supplication unedited', alt: 'Language of supplication unedited', fileName: 'Language of supplication unedited', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zQ_dtkV3usM44fNboqF3LOP5ymkD8j3d', title: '7 hours prayer_the help of God ', alt: '7 hours prayer_the help of God ', fileName: '7 hours prayer_the help of God ', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EDHRjI1v1O1m7Rro1rOSM9wLlHNU6L1Z', title: 'For you glory', alt: 'For you glory', fileName: 'For you glory', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1dY3VHlHivdZ9Rv4Qg_DAVVfeP077RaFU', title: 'first hour mercy meeting 2025', alt: 'first hour mercy meeting 2025', fileName: 'first hour mercy meeting 2025', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nn_y7bXCw1--dhqvKNCc7iG59WZ-vd4B', title: 'Hunger for more', alt: 'Hunger for more', fileName: 'Hunger for more', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CbLdVYdtcOzriQpMaotaskyK_p6H2ZtB', title: 'Conquering the spirit of fear', alt: 'Conquering the spirit of fear', fileName: 'Conquering the spirit of fear', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HXDfJ-BSSoS6rjcRMjhkQN4HZgLoiFFw', title: 'Conquering the spirit of fear Part 2', alt: 'Conquering the spirit of fear Part 2', fileName: 'Conquering the spirit of fear Part 2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1jsojzOIoG7x822_YDzyggFm6w7xuJpzE', title: 'prophetic spy 1', alt: 'prophetic spy 1', fileName: 'prophetic spy 1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1lFoVN16J59Cdu00Udgw0XJ9WquiF1s9h', title: 'How satan fights', alt: 'How satan fights', fileName: 'How satan fights', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EGX3FlCHioPseLBaQKpamUhdgx_HFjWq', title: 'Sunday Midnight Prayers', alt: 'Sunday Midnight Prayers', fileName: 'SundayMidnight', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1QrxZpZjDgbvYQNsTU4SLHLZao7V3xYrt', title: 'Life Is Spiritual ', alt: 'Life Is Spiritual ', fileName: 'Life Is Spiritual ', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12B3ZT8gTJoQiuhnuhgHVK-4HlrxJ2B6c', title: 'Praying your obedience before the judge ', alt: 'Praying your obedience before the judge ', fileName: 'Praying your obedience before the judge _Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Bi7hLjvyyQeMlDwcLld700ccH3j65NwV', title: 'introduction to the court of heaven_Pastor Enoch', alt: 'introduction to the court of heaven_Pastor Enoch', fileName: 'introduction to the court of heaven_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1e6qBQZdqNbfgYlqFeP8iPa7QRJMIChQQ', title: 'Prayer chain day 1 session 1', alt: 'Prayer chain day 1 session 1', fileName: 'Prayer chain day 1 session 1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=102PgCc-qzOeg2gCiNUR6R1MmYXbx6zmm', title: 'Delivance_A Call Unto Alignment_Past Enoch', alt: 'Why many are not doers of the word Part 1_Pastor Enoch', fileName: 'Why many are not doers of the word Part 1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1VEeo7423HFoiIVHf04Fr_8Op0EVLFV2M', title: 'Think on these things2_Pastor Enoch', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1C0abeQIs7MpZNtFBCvgQSB_rtiNToBtK', title: 'The Shiloh cry', alt: 'The Shiloh Cry', fileName: 'The Shiloh Cry', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1VEeo7423HFoiIVHf04Fr_8Op0EVLFV2M', title: 'The shiloh cry2', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The shiloh cry3', alt: 'The shiloh cry_ Pastor Enoch', fileName: 'The shiloh cry_ Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The Shiloh cry_Covenants_Pastor Enoch', alt: 'The Shiloh cry_Covenants_Pastor Enoch', fileName: 'The Shiloh cry_Covenants_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The Shiloh cry4', alt: 'The Shiloh2_Cry_Pastor Enoch', fileName: 'The Shiloh2_Cry_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YJTizAc3nvKzlhRA1JGK5HYwC_O4g2tW', title: 'Think on these things2_Pastor Enoch', alt: 'Think on these things2_Pastor Enoch', fileName: 'The shiloh cry APN', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1RbWHyN3t_36gK0iwr_p5P9Qe0zYODdK_', title: 'Hear this before 2026_Pastor Enoch', alt: 'Hear this before 2026_Pastor Enoch', fileName: 'Hear this before 2026_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CzcLsIS8lu00Qg2y8sk4Aw3u--JnXY0F', title: '1st Shiloh cry meeting 2025_Pastor Enoch_1', alt: '1st Shiloh cry meeting 2025_Pastor Enoch_1', fileName: '1st Shiloh cry meeting 2025_Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CzNMZ0Edq9ln8oil54yrAq8fVQl5OakM', title: 'A call unto prayer_Pastor Enoch_1', alt: 'A call unto prayer_Pastor Enoch_1', fileName: 'A call unto prayer_Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1jxdltrhiNYo3JglQuuYtkXGbnpuYh-Y-', title: 'A call unto prayer1_Pastor Enoch', alt: 'A call unto prayer1_Pastor Enoch', fileName: 'A call unto prayer1_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1IJGN9yeS18PuLMOVWUHW3YIKKD1F5C44', title: 'Accessing higher dimensions of mercy_Pastor Enoch', alt: 'Accessing higher dimensions of mercy_Pastor Enoch', fileName: 'Accessing higher dimensions of mercy_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1D33dh0m4PYq4J0zSNL_bcVbGrWSU_mcf', title: 'Activating the mystery of intervention through alignment_Pastor Enoch_1', alt: 'Activating the mystery of intervention through alignment_Pastor Enoch_1', fileName: 'Activating the mystery of intervention through alignment_Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1L-kQYQAx8ygXrkCOYWDv2wc3YUl_TnfH', title: 'And God wrought special miracles_Pastor Enoch_1', alt: 'And God wrought special miracles_Pastor Enoch_1', fileName: 'And God wrought special miracles_Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Ye81tkXnj5VvCGrsBoKVCM4zT3hQ3Hb5', title: 'APN Midnight Prayers Manifesting Prophecies 2 _Pastor Enoch_1', alt: 'APN Midnight Prayers Manifesting Prophecies 2 _Pastor Enoch_1', fileName: 'APN Midnight Prayers Manifesting Prophecies 2 _Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YWsXUOZqeLXdfTnfm4c6_KMMPVya_jtJ', title: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch_1', alt: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch_1', fileName: 'APN Midnight Prayers Manifesting Prophecies_Pastor Enoch_1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ORt6NpbmunfUlqyGt3yctH1d40iYhfSm', title: 'breaking the yoke of kadeshbarnea_Pastor Enoch', alt: 'breaking the yoke of kadeshbarnea_Pastor Enoch', fileName: 'breaking the yoke of kadeshbarnea_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1fA4ey6kAzqxIGQLM_EFDi-KppIwG70Qm', title: 'Breaking the yoke of kadeshbarnea 2_Pastor Enoch', alt: 'Breaking the yoke of kadeshbarnea 2_Pastor Enoch', fileName: 'Breaking the yoke of kadeshbarnea 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1z3sM2eku78yBEKHnnvWQR4iWaTbz3bdK', title: 'Court of heaven legalities_evil covenants_Pastor Enoch', alt: 'Court of heaven legalities_evil covenants_Pastor Enoch', fileName: 'Court of heaven legalities_evil covenants_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pGQUA-wSy_4-xpwT7HuO6qvt8_ot0QWh', title: 'Court of heaven legalities_unforgiveness_Pastor Enoch', alt: 'Court of heaven legalities_unforgiveness_Pastor Enoch', fileName: 'Court of heaven legalities_unforgiveness_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=11Qp3u2z2Q230BXLwiTb5wQZ2Z65hDVnE', title: 'Court of heaven legalities_wrong motives _Ps Enoch', alt: 'Court of heaven legalities_wrong motives _Ps Enoch', fileName: 'Court of heaven legalities_wrong motives _Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1904YtVfBMqEEJeGBeMICj_Co5FL8hTm1', title: 'Court of heaven_wrong motives Part 2_Pastor Enoch', alt: 'Court of heaven_wrong motives Part 2_Pastor Enoch', fileName: 'Court of heaven_wrong motives Part 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1m4wBuZaa6LGOY58lQZjrcepMMKE79UDe', title: 'Divine speed_the ministry of men_Pastor Enoch', alt: 'Divine speed_the ministry of men_Pastor Enoch', fileName: 'Divine speed_the ministry of men_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZFGkEZB05e-nnBmI6k4iXmcu-KCbacE2', title: 'Lord awake for me_Pastor Enoch', alt: 'Lord awake for me_Pastor Enoch', fileName: 'Lord awake for me_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1DdPfuj4eA5QYMWdlm9HRSisKtmemhE69', title: 'Insight into the court of heaven_Pastor Enoch', alt: 'Insight into the court of heaven_Pastor Enoch', fileName: 'Insight into the court of heaven_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1a1TFVuLRzg5qX6dF8t6vecMhxedDGCxJ', title: 'How to deal with wrong motives_Pastor Enoch', alt: 'How to deal with wrong motives_Pastor Enoch', fileName: 'How to deal with wrong motives_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CYUb03Fq2LizaBw9uHdH_iuUSW7E129V', title: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', alt: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', fileName: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nEyNqnKPl7S1I5ouAfY2AYRHZRe-wJO8', title: 'Sermon-by Pastor Enoch', alt: 'Sermon-by Pastor Enoch', fileName: 'Sermon-by Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZQNwQfBoTJAxpiaFnQF3z9G4MayqtRXx', title: 'Raising Financial Altars_Pastor Enoch', alt: 'Raising Financial Altars_Pastor Enoch', fileName: 'Raising Financial Altars_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1PgFD1cOk2m6vER7BgZcjquK7Lw8fvx-4', title: 'Restore my wasted years_Pastor Enoch', alt: 'Restore my wasted years_Pastor Enoch', fileName: 'Restore my wasted years_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yLkeTfAD-6ZGfgszdrsPcAkw75WIUrN4', title: 'Restoration day 3_Pastor Enoch', alt: 'Restoration day 3_Pastor Enoch', fileName: 'Restoration day 3_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1hnCuKZqWs62pUN4Brs--nE8gyqS7fkO9', title: 'Prayers against witchcraft powers_Pastor Enoch', alt: 'Prayers against witchcraft powers_Pastor Enoch', fileName: 'Prayers against witchcraft powers_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pKyOfLIFriKWudlMBxHU77HdaZ8T6oXS', title: 'The Shiloh cry 24th JAN 2025_Pastor Enoch', alt: 'The Shiloh cry 24th JAN 2025_Pastor Enoch', fileName: 'The Shiloh cry 24th JAN 2025_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EovEmepGwPf0XRHtg3_vKmjvjM7rYoIf', title: 'Staying with God in prayer_Pastor Enoch', alt: 'Staying with God in prayer_Pastor Enoch', fileName: 'Staying with God in prayer_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1IZowWAauiyfhZGiEaN_KFKnOnnacJMrW', title: 'The burden of alignment_Pastor Enoch', alt: 'The burden of alignment_Pastor Enoch', fileName: 'The burden of alignment_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BVfUX6NeUNmh425U3imLh-e3msSaDDJu', title: 'Spiritual Empowerment day 2_Pastor Enoch', alt: 'Spiritual Empowerment day 2_Pastor Enoch', fileName: 'Spiritual Empowerment day 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nZqQ7R4VDqraz2JZ0Ff9Gq-6u9-ugyJ-', title: 'Spiritual Empowerment day 3', alt: 'Spiritual Empowerment day 3', fileName: 'Spiritual Empowerment day 3', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18dRo1yf0OUM9ZeM-wVSBq7bVNIT5Up9Z', title: 'Spiritual Empowerment day 4_The Grace to wait_Pastor Enoch', alt: 'Spiritual Empowerment day 4_The Grace to wait_Pastor Enoch', fileName: 'Spiritual Empowerment day 4_The Grace to wait_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1i1JgI6ao1O87eu1K5dZqH1ys1hSr7kZM', title: 'Spiritual marriage_Pastor Enoch', alt: 'Spiritual marriage_Pastor Enoch', fileName: 'Spiritual marriage_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Mly8jMsZA8PwC3MAtw6otmyHf5fEiqJF', title: 'Satisfy us early _Pastor Enoch', alt: 'Satisfy us early _Pastor Enoch', fileName: 'Satisfy us early _Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1uJstxfGSfIcjeU5i94bigp0rniz9ChtH', title: 'Satisfy us early_Warfare Prayers_Pastor Enoch', alt: 'Satisfy us early_Warfare Prayers_Pastor Enoch', fileName: 'Satisfy us early_Warfare Prayers_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vf0lYbjxD_jn1FbRC9ublf_xdjdNCHyW', title: 'Satisfy us early_warfare prayers_Pastor Enoch_2', alt: 'Satisfy us early_warfare prayers_Pastor Enoch_2', fileName: 'Satisfy us early_warfare prayers_Pastor Enoch_2', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YhG8eDDp7OuOJo1ci-odhzHQSKrTXPiW', title: 'Satisfy us early_delayed prophecies_Pastor Enoch', alt: 'Satisfy us early_delayed prophecies_Pastor Enoch', fileName: 'Satisfy us early_delayed prophecies_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yl8EZLbt9trxg9fi7_eD88WIrBEzAduo', title: 'The grace for speed 2_Pastor Enoch', alt: 'The grace for speed 2_Pastor Enoch', fileName: 'The grace for speed 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1frBIPsowNJUQ42tXPEkX_3C16VINHweL', title: 'The Grace for Speed_Pastor Enoch', alt: 'The Grace for Speed_Pastor Enoch', fileName: 'The Grace for Speed_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZdYzs9sXAIzniM8In2-R_jkVsZgUAsIF', title: 'The fear of God_Pastor Enoch', alt: 'The fear of God_Pastor Enoch', fileName: 'The fear of God_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=182m7gMMUBscQ-y_iycPWV77IY9-Ppybt', title: 'The fear of the Lord_Pastor Enoch', alt: 'The fear of the Lord_Pastor Enoch', fileName: 'The fear of the Lord_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yDQ1K6S7IHNsOy02sgUNpLpy3lAvpq0U', title: 'The dynamics of divine speed_Pastor Enoch', alt: 'The dynamics of divine speed_Pastor Enoch', fileName: 'The dynamics of divine speed_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1TwInAvbjwCO2swLhOS2iJVsBWARPLQLx', title: 'The help of God _Pastor Enoch Annang', alt: 'The help of God _Pastor Enoch Annang', fileName: 'The help of God _Pastor Enoch Annang', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1mLKN7wkp-c_A4vN63G1Kis9zbhvv_IAB', title: 'The language of supplication_understanding the times_Pastor Enoch', alt: 'The language of supplication_understanding the times_Pastor Enoch', fileName: 'The language of supplication_understanding the times_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nuasjX3xgaq4_OHgLUsOPdVt0q8yQBeV', title: 'The ministry of men 2_Ps Enoch', alt: 'The ministry of men 2_Ps Enoch', fileName: 'The ministry of men 2_Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Ybm1jbH3hVHFRQUryB2vOdgrRHK6r5ls', title: 'The ministry of men 3_Ps Enoch', alt: 'The ministry of men 3_Ps Enoch', fileName: 'The ministry of men 3_Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HX1KqmwNWIrLZgEontKlKAVVsfi-lSvT', title: 'The help of God 5 hours', alt: 'The help of God 5 hours', fileName: 'The help of God 5 hours', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1b6c1vaqg0lIJXqu56G6FjrgoJ_2Mo2Rt', title: 'The ministry of men 4_Ps Enoch', alt: 'The ministry of men 4_Ps Enoch', fileName: 'The ministry of men 4_Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16lUeLNcECG1HVp36VzEk5Dg5sDgoe8VB', title: 'The ministry of men 5_Ps Enoch', alt: 'The ministry of men 5_Ps Enoch', fileName: 'The ministry of men 5_Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=121kaSrVzFWApza-HJ3SPRPUFOWcliZoO', title: 'The ministry of men Ps Enoch', alt: 'The ministry of men Ps Enoch', fileName: 'The ministry of men Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=17CQkvSRSZ4gXUA0SCe7uMt73tIIB6iJo', title: 'The need for revelation_Pastor Enoch', alt: 'The need for revelation_Pastor Enoch', fileName: 'The need for revelation_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1KXjZrVakyDUjlht7izfUMIlFHQJ9dnLM', title: 'The organic side of restoration', alt: 'The organic side of restoration', fileName: 'The organic side of restoration', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1WZYDFksEI_OqyL8lHuRAxLgkWBglhb_w', title: 'The word of the Lord for September 2023_Pastor Enoch', alt: 'The word of the Lord for September 2023_Pastor Enoch', fileName: 'The word of the Lord for September 2023_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1GSpW6ErO9wObvwq5xaXTCKONExyF79j1', title: 'There has to be more_Pastor Enoch', alt: 'There has to be more_Pastor Enoch', fileName: 'There has to be more_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zX51STYhN1Tnq0MlY3bwI2fDBLzgcC67', title: 'Think on these things _the mercies of God_Pastor', alt: 'Think on these things _the mercies of God_Pastor', fileName: 'Think on these things _the mercies of God_Pastor', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_-j18t5ZwtjJksl5TrDLia5RjnzMmBiH', title: 'Understanding the will of God Part 2_Pastor Enoch', alt: 'Understanding the will of God Part 2_Pastor Enoch', fileName: 'Understanding the will of God Part 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BEE4gwTWKWNfYOFACfxh-UjxubT1nhFQ', title: 'Understanding the will of God_Pastor Enoch', alt: 'Understanding the will of God_Pastor Enoch', fileName: 'Understanding the will of God_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18nPSwrh4bqMDf1a6hqzWaLtScJUpiqjm', title: 'Unseating the strong man _Day 1 _Pastor Enoch', alt: 'Unseating the strong man _Day 1 _Pastor Enoch', fileName: 'Unseating the strong man _Day 1 _Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14DPpYTaHi747U84i_LI9g0CSmLM_BW-k', title: 'Unseating the strongman_Day 2_Pastor Enoch', alt: 'Unseating the strongman_Day 2_Pastor Enoch', fileName: 'Unseating the strongman_Day 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1qoGA4Fpg7yp9Ns_wGxYe1tpuM5VZl6oC', title: 'Wednesday afternoon restoration unedited', alt: 'Wednesday afternoon restoration unedited', fileName: 'Wednesday afternoon restoration unedited', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1r3UPNvevv-R9bedB665ckyDPXVgmrrap', title: 'What happened to your prophecies_Pastor Enoch', alt: 'What happened to your prophecies_Pastor Enoch', fileName: 'What happened to your prophecies_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1a6u0NzRFC39-FAIT_PMndKMQBWHOA9HV', title: 'What has God told you_Pastor Enoch', alt: 'What has God told you_Pastor Enoch', fileName: 'What has God told you_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZNWVfgaIldTQEDmqJFapoaOfsSGT7qiC', title: 'What you need is a word from God_Pastor Enoch', alt: 'What you need is a word from God_Pastor Enoch', fileName: 'What you need is a word from God_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1s3wFm0BeExX4ZYGOoRfSGmArwHRoehPN', title: 'Who art thou O great mountain_ Pastor Enoch', alt: 'Who art thou O great mountain_ Pastor Enoch', fileName: 'Who art thou O great mountain_ Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=13bi8sNk_W4-avZ2WwzTyD_sV_o32cBTk', title: 'Why is the word of God not working in your life_Pastor Enoch', alt: 'Why is the word of God not working in your life_Pastor Enoch', fileName: 'Why is the word of God not working in your life_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1QDoftf8Fu8lr8DTZW5rvUg9TX_AMb_D4', title: 'Establishing the will of God_Ps Enoch', alt: 'Establishing the will of God_Ps Enoch', fileName: 'Establishing the will of God_Ps Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1SqNR_2LZKKwouVESwind66f2WqsLj3pn', title: 'A charge to declare holy war _Pastor Enoch', alt: 'A charge to declare holy war _Pastor Enoch', fileName: 'A charge to declare holy war _Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vqJrTgxUUyqL13Ys_RbeUsU73SCMbNYq', title: 'An example of how satan uses lagalities against the believer_Pastor Enoch', alt: 'An example of How satan uses lagalities against the believer_Pastor Enoch', fileName: 'An example of How satan uses lagalities against the believer_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18DS0iRFByDvG0Q-tfgwymW5GcPcp2ydJ', title: 'Breaking the spell_Pastor Enoch', alt: 'Breaking the spell_Pastor Enoch', fileName: 'Breaking the spell_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1eEpfMlekOQN-vObk-trBOfMiwz2T2pi8', title: 'How God strengthens our hands_Pastor Enoch', alt: 'How God strengthens our hands_Pastor Enoch', fileName: 'How God strengthens our hands_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1rBKPFc9saT2UDwtiEtfQPNjPfOc-n7zz', title: 'How to interprete accurately the happenings in your life_Pastor Enoch', alt: 'How to interprete accurately the happenings in your life_Pastor Enoch', fileName: 'How to interprete accurately the happenings in your life_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1WnE47UPvmacHdP7RY0GuQqn7hSGgvVbc', title: 'How to interprete the happenings in your life _Part 2_Pastor Enoch', alt: 'How to interprete the happenings in your life _Part 2_Pastor Enoch', fileName: 'How to interprete the happenings in your life _Part 2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BD0wPlhoyb77SGQfpo_zB_vQh5ZiV5_B', title: 'Knowing God experentially_Pastor Enoch', alt: 'Knowing God experentially_Pastor Enoch', fileName: 'Knowing God experentially_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_H8EcDRcE0ixVJTyfUy5U5carBzk9-Fr', title: 'Let the blood speak_Pastor Enoch', alt: 'Let the blood speak_Pastor Enoch', fileName: 'Let the blood speak_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'Manifesting Prophecy_ dealing with discouragement_Pastor Enoch', alt: 'Manifesting Prophecy_ dealing with discouragement_Pastor Enoch', fileName: 'Manifesting Prophecy_ dealing with discouragement_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1AwVqVoLorRoe9zopBSjMD_-zs41cf_kz', title: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', alt: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', fileName: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1GHIx0DQz0fk8COq_dMVNGzY8PKRRMo4p', title: 'The dynamics to manifesting prophecy_ Pastor Enoch', alt: 'The dynamics to manifesting prophecy_ Pastor Enoch', fileName: 'The dynamics to manifesting prophecy_ Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'The Sacrifice of Prayer_Pastor Enoch', alt: 'The Sacrifice of Prayer_Pastor Enoch', fileName: 'The Sacrifice of Prayer_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18LcAa-xetHdRa30q84mQHtiwARS2nEcp', title: 'Waiting on God_Dealing with Impatience_Pastor Enoch', alt: 'Waiting on God_Dealing with Impatience_Pastor Enoch', fileName: 'Waiting on God_Dealing with Impatience_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=19W1zdec_idOt58VcD1JwHED_FG7xEiLF', title: 'Breakthrough Service_Pastor Enoch', alt: 'Breakthrough Service_Pastor Enoch', fileName: 'Breakthrough Service_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1N9RdhgB7YceQ3cD41oX_Qwz_TST3oUoC', title: 'September Prayers', alt: 'September Prayers', fileName: 'September Prayers', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1uE2oBQY5D6l-tP_3Bp4kGMrS2IrBNmVT', title: 'September Prayers They Continued 1st session_Pastor Enoch', alt: 'September Prayers They Continued 1st session_Pastor Enoch', fileName: 'September Prayers They Continued 1st session_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vXDB1IplU6E9kvW6XAr9D4ITqVPukMH8', title: 'Doers of the Word_Pastor Enoch', alt: 'Doers of the Word_Pastor Enoch', fileName: 'Doers of the Word_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1w5_Z-9cYbLcqOFnwL9dOH3uHqVUL-dxu', title: 'Dont Give up_Pastor Enoch', alt: 'Dont Give up_Pastor Enoch', fileName: 'Dont Give up_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16fxpwCa0pqUOGRgASaD3SX_PRZ6ASyRy', title: 'Hour of mercy Manifesting Prophecies_Pastor Enoch', alt: 'Hour of mercy Manifesting Prophecies_Pastor Enoch', fileName: 'Hour of mercy Manifesting Prophecies_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1UClQyaYx0Exn1ePJc9N5_LKkOyWXgLLG', title: 'Hour of mercy with Prophetic prayers_Pastor Enoch', alt: 'Hour of mercy with Prophetic prayers_Pastor Enoch', fileName: 'Hour of mercy with Prophetic prayers_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1v8DzNZ4gSTht7s0t-aAVOjURPANo84DW', title: 'How God strengthens our hands_Pastor Enoch', alt: 'How God strengthens our hands_Pastor Enoch', fileName: 'How God strengthens our hands_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1V8WAanYmRZxeiPWGXv0cR5BKwAuBlthG', title: 'Invoking the confusion of the Lord against your enemies_Pastor Enoch', alt: 'Invoking the confusion of the Lord against your enemies_Pastor Enoch', fileName: 'Invoking the confusion of the Lord against your enemies_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BqgEICnPWeAg6zVtvKySuhteo8HG-ZZj', title: 'Lord you are pleased with me', alt: 'Lord you are pleased with me', fileName: 'Lord you are pleased with me', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1K9fpCULhCEvL9mPup8aiRGrNQn4YzbOI', title: 'Lord perform what you have spoken_Pastor Enoch', alt: 'Lord perform what you have spoken_Pastor Enoch', fileName: 'Lord perform what you have spoken_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16WzFiQbcxLx_4rUvHI5dZTQ-n7r8s3jQ', title: 'Manifesting Prophecies 3_Pastor Enoch', alt: 'Manifesting Prophecies 3_Pastor Enoch', fileName: 'Manifesting Prophecies 3_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1RlLmrAvi6lQ1pBeJeyj-kPAUGfgL5Pqx', title: 'Manifesting Prophecies_being fully persuaded_Pastor Enoch', alt: 'Manifesting Prophecies_being fully persuaded_Pastor Enoch', fileName: 'Manifesting Prophecies_being fully persuaded_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1w7zxMTaNRzPtmymFiJv4YkI26DhenENY', title: 'Manifesting Prophecies_Conquering the spirit of fear_Pastor Enoch', alt: 'Manifesting Prophecies_Conquering the spirit of fear_Pastor Enoch', fileName: 'Manifesting Prophecies_Conquering the spirit of fear_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HSvm0Yhn4pOO_YTy9A9i44rnHwxmDdtl', title: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', alt: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', fileName: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1La0LN9oznYGMlhxOuT2UcK8jBxZUMDWK', title: 'Manifesting Prophecies_the gift of an eye_Pastor', alt: 'Manifesting Prophecies_the gift of an eye_Pastor', fileName: 'Manifesting Prophecies_the gift of an eye_Pastor', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14E3JDtUHcaD_05zDVF82Iak5Gv3-TDV7', title: 'Manifesting Prophecies_Think on these things_ Past Enoch', alt: 'Manifesting Prophecies_Think on these things_ Past Enoch', fileName: 'Manifesting Prophecies_Think on these things_ Past Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=17veJST5Ou92IB2UD0M5xBIHqLjc1WeLd', title: 'Manifesting Prophecies_Waiting on God Pastor Enoch', alt: 'Manifesting Prophecies_Waiting on God Pastor Enoch', fileName: 'Manifesting Prophecies_Waiting on God Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14G2Tx1u5g3FwFLiXzj_LRF60MTzvdxg9', title: 'Manifesting Manifesting the word of the Lord_Pastor Enoch', alt: 'Manifesting Manifesting the word of the Lord_Pastor Enoch', fileName: 'Manifesting Manifesting the word of the Lord_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'Manifesting Prophecy_ dealing with discouragement2_Pastor Enoch', alt: 'Manifesting Prophecy_ dealing with discouragement2_Pastor Enoch', fileName: 'Manifesting Prophecy_ dealing with discouragement2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16w3CoQfj231QXdouL3p3QWInoYr5V4nh', title: 'Men sent by God full message _Pastor Enoch', alt: 'Men sent by God full message _Pastor Enoch', fileName: 'Men sent by God full message _Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1g4QFXLxKI0BomlHMexZnZZPiZFLemhn-', title: 'My prayers for you this month of July_Pastor Enoch', alt: 'My prayers for you this month of July_Pastor Enoch', fileName: 'My prayers for you this month of July_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CPtAlSJYUw1K3h9K0mV5vU3MGcX0wr3K', title: 'Non-cognitive modes of communication 1', alt: 'Non-cognitive modes of communication 1', fileName: 'Non-cognitive modes of communication 1', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12gFUyPhP1ALxvdCIWYjTRpy5MHn9yUCG', title: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', alt: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', fileName: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14yXjGDNnrbSXuMUF4_VTvIJlrVKPbtDT', title: 'Prayer charge_Pastor Enoch', alt: 'Prayer charge_Pastor Enoch', fileName: 'Prayer charge_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1U9SCFL6E8P3ciLFJu-wgGx2fAZpW9eKI', title: 'Prayers against evil marks_Pastor Enoch', alt: 'Prayers against evil marks_Pastor Enoch', fileName: 'Prayers against evil marks_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1xso6yq1Tdhgg7K22EpvnLLkcJK1BWWIH', title: 'Prayers against evil reports_Pastor Enoch', alt: 'Prayers against evil reports_Pastor Enoch', fileName: 'Prayers against evil reports_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1AFgu6M1qYdeMgQpzY8wQDBvsXias3FIa', title: 'Prayers against problem expanders_Pastor Enoch', alt: 'Prayers against problem expanders_Pastor Enoch', fileName: 'Prayers against problem expanders_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YdMS0gH3EoaXcYP-C_XBnhLz2th_Ksxu', title: 'Prayers against spiritual marriage_Pastor Enoch', alt: 'Prayers against spiritual marriage_Pastor Enoch', fileName: 'Prayers against spiritual marriage_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=11UFdO4LIt6pVtCZd0el5xrj1iWdZERo7', title: 'Prayers against spiritual marriage2_Pastor Enoch', alt: 'Prayers against spiritual marriage2_Pastor Enoch', fileName: 'Prayers against spiritual marriage2_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12DVALl52k8Syqd5IsHsM1v5kDqkpeKvb', title: 'Praying the promises of God_Pastor Enoch', alt: 'Praying the promises of God_Pastor Enoch', fileName: 'Praying the promises of God_Pastor Enoch', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1-ZPSKzGMwarPXD6imB6WXgJsyMPBlXL2', title: 'Preaching from light', alt: 'Preaching from light', fileName: 'Preaching from light', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HdPy3-WUJtal3Ung0ULA9jOlPsABI4oH', title: 'Prophecies during 14 days fasting in december 2023', alt: 'Prophecies during 14 days fasting in december 2023', fileName: 'Prophecies during 14 days fasting in december 2023', local: true },
{ type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1C6Bq2NB7T8g3t92lHXUSKHSoGQIxInPA', title: 'Prophecy about the church of pentecost 16 december 2023', alt: 'Prophecy about the church of pentecost 16 december 2023', fileName: 'Prophecy about the church of pentecost 16 december 2023', local: true },
];

const ministries = [
{ icon: APNIcon, title: 'Worship Ministry', desc: 'Join us in worship as we lift our hearts to God through praise, prayer, and the teaching of His Word.' },
{ icon: APNIcon, title: 'Youth Ministry', desc: 'A welcoming environment where young people can grow in faith, build friendships, and discover their purpose in Christ.' },
{ icon: APNIcon, title: 'Prayer Ministry', desc: 'Come together with us in prayer as we seek God, encourage one another, and stand together in faith.' },
{ icon: APNIcon, title: 'Community Ministry', desc: 'Serving our community with compassion, kindness, and practical support while sharing the love of Christ.' },
];

const mediaItems = [
{ type: 'image', src: apnImage1,  alt: 'Church Event 1',  title: 'Church Event 1'  },
{ type: 'image', src: apnImage2,  alt: 'Church Event 2',  title: 'Church Event 2'  },
{ type: 'image', src: apnImage3,  alt: 'Church Event 3',  title: 'Church Event 3'  },
{ type: 'image', src: apnImage4,  alt: 'Church Event 4',  title: 'Church Event 4'  },
{ type: 'image', src: apnImage5,  alt: 'Church Event 5',  title: 'Church Event 5'  },
{ type: 'image', src: apnImage6,  alt: 'Church Event 6',  title: 'Church Event 6'  },
{ type: 'image', src: apnImage7,  alt: 'Church Event 7',  title: 'Church Event 7'  },
{ type: 'image', src: apnImage8,  alt: 'Church Event 8',  title: 'Church Event 8'  },
{ type: 'image', src: apnImage9,  alt: 'Church Event 9',  title: 'Church Event 9'  },
{ type: 'image', src: apnImage10, alt: 'Church Event 10', title: 'Church Event 10' },
{ type: 'image', src: apnImage11, alt: 'Church Event 11', title: 'Church Event 11' },
{ type: 'image', src: apnImage12, alt: 'Church Event 12', title: 'Church Event 12' },
{ type: 'image', src: apnImage13, alt: 'Church Event 13', title: 'Church Event 13' },
{ type: 'image', src: apnImage14, alt: 'Church Event 14', title: 'Church Event 14' },
{ type: 'image', src: apnImage15, alt: 'Church Event 15', title: 'Church Event 15' },
{ type: 'image', src: apnImage16, alt: 'Church Event 16', title: 'Church Event 16' },
{ type: 'image', src: apnImage17, alt: 'Church Event 17', title: 'Church Event 17' },
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
// { icon: '📱', name: 'MTN Mobile Money', number: '+233 541215212', holder: 'Answered Prayer Network' },
// { icon: '📱', name: 'Vodafone Cash', number: '+233 207464426', holder: 'Answered Prayer Network' },
// { icon: '🏦', name: 'Bank Transfer', number: 'GCB • 1234567890', holder: 'Answered Prayer Network' },

{ type: 'image', src: supportContact,  alt: 'Support 1',  title: 'Support 1'  }
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
width: '100%', maxWidth: '760px', boxSizing: 'border-box', minHeight: '46px', padding: '0 14px',
borderRadius: '9px', border: '1.5px solid #CBD5E1', backgroundColor: '#fff',
color: '#0F172A', fontSize: '0.94rem', fontWeight: '500', outline: 'none', transition: 'all 0.2s ease',
});

const singleValueStyle = getStyle('singleValue', { color: '#0F172A' });
const placeholderStyle = getStyle('placeholder', { color: '#888' });

return (
<div className="media-control-group" ref={containerRef} style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
{label && (
<label htmlFor={id} style={{ display: 'block', color: '#1E293B', fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px', letterSpacing: '0.15px', lineHeight: 1.45 }}>
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
padding: '11px 14px', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1.4, fontWeight: 500,
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
function PictureSlider({ images = [], interval = 3000, showDots = true, showArrows = true }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const count = images.length;

  const goTo = (i) => setIndex(count ? ((i % count) + count) % count : 0);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [paused, interval, count]);

  useEffect(() => {
    if (count > 0 && index >= count) setIndex(0);
  }, [count, index]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  if (!count) return null;

  return (
    <div
      className="picture-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Picture slider"
    >
      <div
        className="picture-slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div className="picture-slide" key={img.src || i} aria-hidden={i !== index}>
            <img
              src={img.src}
              alt={img.alt || `Slide ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {count > 1 && showArrows && (
        <>
          <button type="button" className="picture-slider-arrow prev" onClick={prev} aria-label="Previous image">‹</button>
          <button type="button" className="picture-slider-arrow next" onClick={next} aria-label="Next image">›</button>
        </>
      )}

      {count > 1 && showDots && (
        <div className="picture-slider-dots" role="tablist">
          {images.map((_, i) => (
            <button
              type="button"
              key={i}
              role="tab"
              className={`picture-slider-dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-selected={i === index}
            />
          ))}
        </div>
      )}

      {count > 1 && (
        <div className="picture-slider-counter">{index + 1} / {count}</div>
      )}
    </div>
  );
}
export default function Home() {
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedAudioIndex, setSelectedAudioIndex] = useState('');
const [selectedCommandingWeekIndex, setSelectedCommandingWeekIndex] = useState('');
const [selectedSermonVideoIndex, setSelectedSermonVideoIndex] = useState('');

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

const [liveAnnouncements, setLiveAnnouncements] = useState([]);

useEffect(() => {
const fetchLiveAnnouncements = async () => {
try {
const JSONBIN_BIN_ID = process.env.REACT_APP_JSONBIN_BIN_ID || "6b039eeaac6210605a9cee94";
const JSONBIN_MASTER_KEY = process.env.REACT_APP_JSONBIN_MASTER_KEY || "$2a$10$vHVlIdrYpHuwF/VxfmetyufB6JoAqbipsW/Wi5vn6284P/lTnYQHO";

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

/* =========================================================
   SPLIT PICTURE SECTION
   sliderImages = all church pictures EXCEPT menthorShip.jpeg
   ========================================================= */
const sliderImages = imageItems.filter((img) => img.src !== apnImage17);

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

/* Auto-advance the right-side slider every 3 seconds */
useEffect(() => {
if (sliderImages.length <= 1) return undefined;
const interval = setInterval(() => {
setCurrentIndex((prevIndex) =>
prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
);
}, 3000);
return () => clearInterval(interval);
}, [sliderImages.length]);

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

<h4 className="modal-title">Give & Support</h4>
<p className="modal-desc">Your generosity helps us spread the Gospel and serve our community.</p>
<div className="give-number-box">
  <span className="give-label">Send to Mobile Money / WhatsApp</span>
  <strong className="give-number">0541215212 / 0207464426</strong>
</div>
<p className="give-notice">"You can send to 0541215212. Kindly add a reference. God bless you!"</p>

<button
  className="copy-number-btn"
  onClick={() => {
    navigator.clipboard.writeText('0541215212');
    Swal.fire({
      icon: 'success',
      title: 'Copied Successfully!',
      text: 'Phone number copied to clipboard!',
      timer: 3000, 
      timerProgressBar: true,
      showConfirmButton: true, 
      confirmButtonColor: '#17365D'
    });
  }}
>📋 Copy Number
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
Streaming live every Sunday at 3:00 PM GMT
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

{/* ============================================================
    MEDIA SECTION  — SPLIT PICTURE + 3s SLIDER + MEDIA PLAYER
    ============================================================ */}
<section className="media-section">
<div
className="media-columns"
style={{
display: 'flex',
flexDirection: 'column',
width: '100%',
gap: '24px',
}}
>
{/* LEFT-RIGHT SPLIT PICTURE PANEL */}
<div
className="media-column images"
style={{ width: '100%', maxWidth: '100%', flex: '0 0 100%', boxSizing: 'border-box' }}
>
<div className="picture-split">

  {/* LEFT */}
  <div className="picture-split-single">
    <img src={apnImage17} alt="Mentorship" loading="eager" draggable={false} />
  </div>

  {/* RIGHT */}
  <div className="picture-slider">
    <div
      className="picture-slider-track"
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      {sliderImages.map((img, i) => (
        <div className="picture-slide" key={img.src || i}>
          <img src={img.src} alt={img.alt || `Slide ${i + 1}`} draggable={false} />
        </div>
      ))}
    </div>

    {sliderImages.length > 1 && (
      <>
        <button type="button" className="picture-slider-arrow prev"
          onClick={() => setCurrentIndex((i) => (i - 1 + sliderImages.length) % sliderImages.length)}
          aria-label="Previous image">‹</button>
        <button type="button" className="picture-slider-arrow next"
          onClick={() => setCurrentIndex((i) => (i + 1) % sliderImages.length)}
          aria-label="Next image">›</button>
        <div className="picture-slider-counter">
          {currentIndex + 1} / {sliderImages.length}
        </div>
        <div className="picture-slider-dots">
          {sliderImages.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`picture-slider-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </>
    )}
  </div>

</div>
</div>

{/* MEDIA PLAYER (audio + videos) — UNCHANGED */}
<div
className="media-column videos"
style={{ width: '100%', maxWidth: '100%', flex: '0 0 100%', boxSizing: 'border-box' }}
>
{!isSingleImage && (
<div className="media-selector-card" style={{ marginBottom: '24px' }}>
<h2 className="media-selector-title" style={sectionTitleStyle}>Media Pictures</h2>
<div className="media-control-group">
<label
htmlFor="picture-select"
style={{
display: 'block', background: '#F8FAFC', color: '#0F172A',
padding: '10px 14px', borderRadius: '9px', fontWeight: 700,
fontSize: '0.92rem', marginBottom: '8px', letterSpacing: '0.15px',
lineHeight: 1.4, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
border: '2px solid #C49A3A',
}}
>
🖼️ Select a picture
</label>
<select
id="picture-select"
value={currentIndex}
onChange={(e) => setCurrentIndex(Number(e.target.value))}
>
{sliderImages.map((item, index) => (
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
{/* ================================================= */}
{/* GIVING / SUPPORT CONTACT SECTION                  */}
{/* ================================================= */}
<section
  style={{
    width: '100%',
    margin: 0,
    padding: '0 20px 48px',
    background: '#F8FAFC',
    boxSizing: 'border-box',
  }}
>
  {/* Title */}
  <div style={{ textAlign: 'center', padding: '40px 20px 24px' }}>
    <h2 style={{ ...sectionTitleStyle, display: 'inline-block', margin: 0 }}>
      Support the Ministry
    </h2>
  </div>

  {/* Image — wider container */}
  <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
    {givingOptions.map((opt, i) => (
      <div key={i} style={{ width: '100%' }}>
        {opt.type === 'image' ? (
          <img
            src={opt.src}
            alt={opt.alt}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '1700px',
              objectFit: 'cover',
              display: 'block',
              margin: 0,
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)',
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ fontSize: '2rem' }}>{opt.icon}</span>
            <h3>{opt.name}</h3>
            <p>{opt.number}</p>
            <p>{opt.holder}</p>
          </div>
        )}
      </div>
    ))}
    
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
position: 'fixed', bottom: 210, right: 24,
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