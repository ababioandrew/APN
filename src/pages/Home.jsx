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
import apnImage16 from '../assets/images/menthorShip.jpeg';

const churchSearchTheme = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#F8FAFC",
    borderColor: state.isFocused ? "#C49A3A" : "#CBD5E1",
    borderRadius: "10px",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(196, 154, 58, 0.18)"
      : "none",
    "&:hover": {
      borderColor: "#C49A3A",
    },
    color: "#172554",
    transition: "all 0.2s ease",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
    zIndex: 100,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#17365D"
      : state.isFocused
        ? "#F1F5F9"
        : "#FFFFFF",
    color: state.isSelected ? "#FFFFFF" : "#1E293B",
    padding: "12px 16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:active": {
      backgroundColor: "#E2E8F0",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "#172554",
    fontWeight: 500,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#64748B",
    fontWeight: 400,
  }),

  input: (base) => ({
    ...base,
    color: "#172554",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#C49A3A" : "#64748B",
    "&:hover": {
      color: "#17365D",
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#E2E8F0",
  }),
};

const cmArr = [
  commercialVid1, commercialVid2, commercialVid3, commercialVid4,
  commercialVid5, commercialVid6, commercialVid7,
];

const marqueeMessages = [
  '✨ Special Event This Sunday • Youth Fellowship • Community Outreach • Join Us! ✨',
  '✨ Answered Prayer Network • A place Where destinies are restored and rearranged. • Pray Until the soul cracks ✨',
  '✨ 30 Days of Menthorship Through The Word. Listen discover and share. God richly bless you ✨',
];

const localVideos = [
  { type: 'video', src: 'https://www.youtube.com/watch?v=JE3rARGfSyg', embedUrl: 'https://www.youtube.com/embed/JE3rARGfSyg', isYouTube: true, title: '27th Oct 2026 - DEALING WITH DEMONIC RESISTANCE', alt: 'Commanding Your Week' },
  { type: 'video', src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE', embedUrl: 'https://www.youtube.com/embed/NSGc6wJgTRE', title: '18th Oct 2026', alt: 'Commanding Your Week', isYouTube: true }
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
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12B3ZT8gTJoQiuhnuhgHVK-4HlrxJ2B6c', title: 'Praying your obedience before the judge ', alt: 'Praying your obedience before the judge ', fileName: 'Praying your obedience before the judge ', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Bi7hLjvyyQeMlDwcLld700ccH3j65NwV', title: 'introduction to the court of heaven', alt: 'introduction to the court of heaven', fileName: 'introduction to the court of heaven', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1e6qBQZdqNbfgYlqFeP8iPa7QRJMIChQQ', title: 'Prayer chain day 1 session 1', alt: 'Prayer chain day 1 session 1', fileName: 'Prayer chain day 1 session 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=102PgCc-qzOeg2gCiNUR6R1MmYXbx6zmm', title: 'Delivance_A Call Unto Alignment_Past Enoch', alt: 'Why many are not doers of the word Part 1', fileName: 'Why many are not doers of the word Part 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1VEeo7423HFoiIVHf04Fr_8Op0EVLFV2M', title: 'Think on these things2', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1C0abeQIs7MpZNtFBCvgQSB_rtiNToBtK', title: 'The Shiloh cry', alt: 'The Shiloh Cry', fileName: 'The Shiloh Cry', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1VEeo7423HFoiIVHf04Fr_8Op0EVLFV2M', title: 'The shiloh cry2', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The shiloh cry3', alt: 'The shiloh cry_ Pastor Enoch', fileName: 'The shiloh cry_ Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The Shiloh cry_Covenants', alt: 'The Shiloh cry_Covenants', fileName: 'The Shiloh cry_Covenants', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1cbeGYeMqsLmWl_Lu0vLZ6QFo3gM09htg', title: 'The Shiloh cry4', alt: 'The Shiloh2_Cry', fileName: 'The Shiloh2_Cry', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YJTizAc3nvKzlhRA1JGK5HYwC_O4g2tW', title: 'Think on these things2', alt: 'Think on these things2', fileName: 'The shiloh cry APN', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1RbWHyN3t_36gK0iwr_p5P9Qe0zYODdK_', title: 'Hear this before 2026', alt: 'Hear this before 2026', fileName: 'Hear this before 2026', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CzcLsIS8lu00Qg2y8sk4Aw3u--JnXY0F', title: '1st Shiloh cry meeting 2025_1', alt: '1st Shiloh cry meeting 2025_1', fileName: '1st Shiloh cry meeting 2025_1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CzNMZ0Edq9ln8oil54yrAq8fVQl5OakM', title: 'A call unto prayer_1', alt: 'A call unto prayer_1', fileName: 'A call unto prayer_1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1jxdltrhiNYo3JglQuuYtkXGbnpuYh-Y-', title: 'A call unto prayer1', alt: 'A call unto prayer1', fileName: 'A call unto prayer1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1IJGN9yeS18PuLMOVWUHW3YIKKD1F5C44', title: 'Accessing higher dimensions of mercy', alt: 'Accessing higher dimensions of mercy', fileName: 'Accessing higher dimensions of mercy', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1D33dh0m4PYq4J0zSNL_bcVbGrWSU_mcf', title: 'Activating the mystery of intervention through alignment_1', alt: 'Activating the mystery of intervention through alignment_1', fileName: 'Activating the mystery of intervention through alignment_1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1L-kQYQAx8ygXrkCOYWDv2wc3YUl_TnfH', title: 'And God wrought special miracles_1', alt: 'And God wrought special miracles_1', fileName: 'And God wrought special miracles_1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Ye81tkXnj5VvCGrsBoKVCM4zT3hQ3Hb5', title: 'APN Midnight Prayers Manifesting Prophecies 2 _1', alt: 'APN Midnight Prayers Manifesting Prophecies 2 _1', fileName: 'APN Midnight Prayers Manifesting Prophecies 2 _1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YWsXUOZqeLXdfTnfm4c6_KMMPVya_jtJ', title: 'APN Midnight Prayers Manifesting Prophecies_1', alt: 'APN Midnight Prayers Manifesting Prophecies_1', fileName: 'APN Midnight Prayers Manifesting Prophecies_1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ORt6NpbmunfUlqyGt3yctH1d40iYhfSm', title: 'breaking the yoke of kadeshbarnea', alt: 'breaking the yoke of kadeshbarnea', fileName: 'breaking the yoke of kadeshbarnea', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1fA4ey6kAzqxIGQLM_EFDi-KppIwG70Qm', title: 'Breaking the yoke of kadeshbarnea 2', alt: 'Breaking the yoke of kadeshbarnea 2', fileName: 'Breaking the yoke of kadeshbarnea 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1z3sM2eku78yBEKHnnvWQR4iWaTbz3bdK', title: 'Court of heaven legalities_evil covenants', alt: 'Court of heaven legalities_evil covenants', fileName: 'Court of heaven legalities_evil covenants', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pGQUA-wSy_4-xpwT7HuO6qvt8_ot0QWh', title: 'Court of heaven legalities_unforgiveness', alt: 'Court of heaven legalities_unforgiveness', fileName: 'Court of heaven legalities_unforgiveness', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=11Qp3u2z2Q230BXLwiTb5wQZ2Z65hDVnE', title: 'Court of heaven legalities_wrong motives _Ps Enoch', alt: 'Court of heaven legalities_wrong motives _Ps Enoch', fileName: 'Court of heaven legalities_wrong motives _Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1904YtVfBMqEEJeGBeMICj_Co5FL8hTm1', title: 'Court of heaven_wrong motives Part 2', alt: 'Court of heaven_wrong motives Part 2', fileName: 'Court of heaven_wrong motives Part 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1m4wBuZaa6LGOY58lQZjrcepMMKE79UDe', title: 'Divine speed_the ministry of men', alt: 'Divine speed_the ministry of men', fileName: 'Divine speed_the ministry of men', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZFGkEZB05e-nnBmI6k4iXmcu-KCbacE2', title: 'Lord awake for me', alt: 'Lord awake for me', fileName: 'Lord awake for me', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1DdPfuj4eA5QYMWdlm9HRSisKtmemhE69', title: 'Insight into the court of heaven', alt: 'Insight into the court of heaven', fileName: 'Insight into the court of heaven', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1a1TFVuLRzg5qX6dF8t6vecMhxedDGCxJ', title: 'How to deal with wrong motives', alt: 'How to deal with wrong motives', fileName: 'How to deal with wrong motives', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CYUb03Fq2LizaBw9uHdH_iuUSW7E129V', title: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', alt: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', fileName: 'Manifesting Prophecies _the gift of an eye to see Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nEyNqnKPl7S1I5ouAfY2AYRHZRe-wJO8', title: 'Sermon-by Pastor Enoch', alt: 'Sermon-by Pastor Enoch', fileName: 'Sermon-by Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZQNwQfBoTJAxpiaFnQF3z9G4MayqtRXx', title: 'Raising Financial Altars', alt: 'Raising Financial Altars', fileName: 'Raising Financial Altars', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1PgFD1cOk2m6vER7BgZcjquK7Lw8fvx-4', title: 'Restore my wasted years', alt: 'Restore my wasted years', fileName: 'Restore my wasted years', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yLkeTfAD-6ZGfgszdrsPcAkw75WIUrN4', title: 'Restoration day 3', alt: 'Restoration day 3', fileName: 'Restoration day 3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1hnCuKZqWs62pUN4Brs--nE8gyqS7fkO9', title: 'Prayers against witchcraft powers', alt: 'Prayers against witchcraft powers', fileName: 'Prayers against witchcraft powers', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pKyOfLIFriKWudlMBxHU77HdaZ8T6oXS', title: 'The Shiloh cry 24th JAN 2025', alt: 'The Shiloh cry 24th JAN 2025', fileName: 'The Shiloh cry 24th JAN 2025', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EovEmepGwPf0XRHtg3_vKmjvjM7rYoIf', title: 'Staying with God in prayer', alt: 'Staying with God in prayer', fileName: 'Staying with God in prayer', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1IZowWAauiyfhZGiEaN_KFKnOnnacJMrW', title: 'The burden of alignment', alt: 'The burden of alignment', fileName: 'The burden of alignment', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BVfUX6NeUNmh425U3imLh-e3msSaDDJu', title: 'Spiritual Empowerment day 2', alt: 'Spiritual Empowerment day 2', fileName: 'Spiritual Empowerment day 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nZqQ7R4VDqraz2JZ0Ff9Gq-6u9-ugyJ-', title: 'Spiritual Empowerment day 3', alt: 'Spiritual Empowerment day 3', fileName: 'Spiritual Empowerment day 3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18dRo1yf0OUM9ZeM-wVSBq7bVNIT5Up9Z', title: 'Spiritual Empowerment day 4_The Grace to wait', alt: 'Spiritual Empowerment day 4_The Grace to wait', fileName: 'Spiritual Empowerment day 4_The Grace to wait', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1i1JgI6ao1O87eu1K5dZqH1ys1hSr7kZM', title: 'Spiritual marriage', alt: 'Spiritual marriage', fileName: 'Spiritual marriage', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Mly8jMsZA8PwC3MAtw6otmyHf5fEiqJF', title: 'Satisfy us early ', alt: 'Satisfy us early ', fileName: 'Satisfy us early ', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1uJstxfGSfIcjeU5i94bigp0rniz9ChtH', title: 'Satisfy us early_Warfare Prayers', alt: 'Satisfy us early_Warfare Prayers', fileName: 'Satisfy us early_Warfare Prayers', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vf0lYbjxD_jn1FbRC9ublf_xdjdNCHyW', title: 'Satisfy us early_warfare prayers_2', alt: 'Satisfy us early_warfare prayers_2', fileName: 'Satisfy us early_warfare prayers_2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YhG8eDDp7OuOJo1ci-odhzHQSKrTXPiW', title: 'Satisfy us early_delayed prophecies', alt: 'Satisfy us early_delayed prophecies', fileName: 'Satisfy us early_delayed prophecies', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yl8EZLbt9trxg9fi7_eD88WIrBEzAduo', title: 'The grace for speed 2', alt: 'The grace for speed 2', fileName: 'The grace for speed 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1frBIPsowNJUQ42tXPEkX_3C16VINHweL', title: 'The Grace for Speed', alt: 'The Grace for Speed', fileName: 'The Grace for Speed', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZdYzs9sXAIzniM8In2-R_jkVsZgUAsIF', title: 'The fear of God', alt: 'The fear of God', fileName: 'The fear of God', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=182m7gMMUBscQ-y_iycPWV77IY9-Ppybt', title: 'The fear of the Lord', alt: 'The fear of the Lord', fileName: 'The fear of the Lord', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1yDQ1K6S7IHNsOy02sgUNpLpy3lAvpq0U', title: 'The dynamics of divine speed', alt: 'The dynamics of divine speed', fileName: 'The dynamics of divine speed', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1TwInAvbjwCO2swLhOS2iJVsBWARPLQLx', title: 'The help of God  Annang', alt: 'The help of God  Annang', fileName: 'The help of God  Annang', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1mLKN7wkp-c_A4vN63G1Kis9zbhvv_IAB', title: 'The language of supplication_understanding the times', alt: 'The language of supplication_understanding the times', fileName: 'The language of supplication_understanding the times', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nuasjX3xgaq4_OHgLUsOPdVt0q8yQBeV', title: 'The ministry of men 2_Ps Enoch', alt: 'The ministry of men 2_Ps Enoch', fileName: 'The ministry of men 2_Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Ybm1jbH3hVHFRQUryB2vOdgrRHK6r5ls', title: 'The ministry of men 3_Ps Enoch', alt: 'The ministry of men 3_Ps Enoch', fileName: 'The ministry of men 3_Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HX1KqmwNWIrLZgEontKlKAVVsfi-lSvT', title: 'The help of God 5 hours', alt: 'The help of God 5 hours', fileName: 'The help of God 5 hours', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1b6c1vaqg0lIJXqu56G6FjrgoJ_2Mo2Rt', title: 'The ministry of men 4_Ps Enoch', alt: 'The ministry of men 4_Ps Enoch', fileName: 'The ministry of men 4_Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16lUeLNcECG1HVp36VzEk5Dg5sDgoe8VB', title: 'The ministry of men 5_Ps Enoch', alt: 'The ministry of men 5_Ps Enoch', fileName: 'The ministry of men 5_Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=121kaSrVzFWApza-HJ3SPRPUFOWcliZoO', title: 'The ministry of men Ps Enoch', alt: 'The ministry of men Ps Enoch', fileName: 'The ministry of men Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=17CQkvSRSZ4gXUA0SCe7uMt73tIIB6iJo', title: 'The need for revelation', alt: 'The need for revelation', fileName: 'The need for revelation', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1KXjZrVakyDUjlht7izfUMIlFHQJ9dnLM', title: 'The organic side of restoration', alt: 'The organic side of restoration', fileName: 'The organic side of restoration', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1WZYDFksEI_OqyL8lHuRAxLgkWBglhb_w', title: 'The word of the Lord for September 2023', alt: 'The word of the Lord for September 2023', fileName: 'The word of the Lord for September 2023', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1GSpW6ErO9wObvwq5xaXTCKONExyF79j1', title: 'There has to be more', alt: 'There has to be more', fileName: 'There has to be more', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zX51STYhN1Tnq0MlY3bwI2fDBLzgcC67', title: 'Think on these things _the mercies of God_Pastor', alt: 'Think on these things _the mercies of God_Pastor', fileName: 'Think on these things _the mercies of God_Pastor', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_-j18t5ZwtjJksl5TrDLia5RjnzMmBiH', title: 'Understanding the will of God Part 2', alt: 'Understanding the will of God Part 2', fileName: 'Understanding the will of God Part 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BEE4gwTWKWNfYOFACfxh-UjxubT1nhFQ', title: 'Understanding the will of God', alt: 'Understanding the will of God', fileName: 'Understanding the will of God', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18nPSwrh4bqMDf1a6hqzWaLtScJUpiqjm', title: 'Unseating the strong man _Day 1 ', alt: 'Unseating the strong man _Day 1 ', fileName: 'Unseating the strong man _Day 1 ', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14DPpYTaHi747U84i_LI9g0CSmLM_BW-k', title: 'Unseating the strongman_Day 2', alt: 'Unseating the strongman_Day 2', fileName: 'Unseating the strongman_Day 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1qoGA4Fpg7yp9Ns_wGxYe1tpuM5VZl6oC', title: 'Wednesday afternoon restoration unedited', alt: 'Wednesday afternoon restoration unedited', fileName: 'Wednesday afternoon restoration unedited', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1r3UPNvevv-R9bedB665ckyDPXVgmrrap', title: 'What happened to your prophecies', alt: 'What happened to your prophecies', fileName: 'What happened to your prophecies', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1a6u0NzRFC39-FAIT_PMndKMQBWHOA9HV', title: 'What has God told you', alt: 'What has God told you', fileName: 'What has God told you', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1ZNWVfgaIldTQEDmqJFapoaOfsSGT7qiC', title: 'What you need is a word from God', alt: 'What you need is a word from God', fileName: 'What you need is a word from God', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1s3wFm0BeExX4ZYGOoRfSGmArwHRoehPN', title: 'Who art thou O great mountain_ Pastor Enoch', alt: 'Who art thou O great mountain_ Pastor Enoch', fileName: 'Who art thou O great mountain_ Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=13bi8sNk_W4-avZ2WwzTyD_sV_o32cBTk', title: 'Why is the word of God not working in your life', alt: 'Why is the word of God not working in your life', fileName: 'Why is the word of God not working in your life', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1QDoftf8Fu8lr8DTZW5rvUg9TX_AMb_D4', title: 'Establishing the will of God_Ps Enoch', alt: 'Establishing the will of God_Ps Enoch', fileName: 'Establishing the will of God_Ps Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1SqNR_2LZKKwouVESwind66f2WqsLj3pn', title: 'A charge to declare holy war ', alt: 'A charge to declare holy war ', fileName: 'A charge to declare holy war ', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vqJrTgxUUyqL13Ys_RbeUsU73SCMbNYq', title: 'An example of how satan uses lagalities against the believer', alt: 'An example of How satan uses lagalities against the believer', fileName: 'An example of How satan uses lagalities against the believer', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18DS0iRFByDvG0Q-tfgwymW5GcPcp2ydJ', title: 'Breaking the spell', alt: 'Breaking the spell', fileName: 'Breaking the spell', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1eEpfMlekOQN-vObk-trBOfMiwz2T2pi8', title: 'How God strengthens our hands', alt: 'How God strengthens our hands', fileName: 'How God strengthens our hands', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1rBKPFc9saT2UDwtiEtfQPNjPfOc-n7zz', title: 'How to interprete accurately the happenings in your life', alt: 'How to interprete accurately the happenings in your life', fileName: 'How to interprete accurately the happenings in your life', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1WnE47UPvmacHdP7RY0GuQqn7hSGgvVbc', title: 'How to interprete the happenings in your life _Part 2', alt: 'How to interprete the happenings in your life _Part 2', fileName: 'How to interprete the happenings in your life _Part 2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BD0wPlhoyb77SGQfpo_zB_vQh5ZiV5_B', title: 'Knowing God experentially', alt: 'Knowing God experentially', fileName: 'Knowing God experentially', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1_H8EcDRcE0ixVJTyfUy5U5carBzk9-Fr', title: 'Let the blood speak', alt: 'Let the blood speak', fileName: 'Let the blood speak', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'Manifesting Prophecy_ dealing with discouragement', alt: 'Manifesting Prophecy_ dealing with discouragement', fileName: 'Manifesting Prophecy_ dealing with discouragement', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1AwVqVoLorRoe9zopBSjMD_-zs41cf_kz', title: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', alt: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', fileName: 'Receiving feedback in prayer_ the knowing of revelation_Pastor', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1GHIx0DQz0fk8COq_dMVNGzY8PKRRMo4p', title: 'The dynamics to manifesting prophecy_ Pastor Enoch', alt: 'The dynamics to manifesting prophecy_ Pastor Enoch', fileName: 'The dynamics to manifesting prophecy_ Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'The Sacrifice of Prayer', alt: 'The Sacrifice of Prayer', fileName: 'The Sacrifice of Prayer', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18LcAa-xetHdRa30q84mQHtiwARS2nEcp', title: 'Waiting on God_Dealing with Impatience', alt: 'Waiting on God_Dealing with Impatience', fileName: 'Waiting on God_Dealing with Impatience', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=19W1zdec_idOt58VcD1JwHED_FG7xEiLF', title: 'Breakthrough Service', alt: 'Breakthrough Service', fileName: 'Breakthrough Service', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1N9RdhgB7YceQ3cD41oX_Qwz_TST3oUoC', title: 'September Prayers', alt: 'September Prayers', fileName: 'September Prayers', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1uE2oBQY5D6l-tP_3Bp4kGMrS2IrBNmVT', title: 'September Prayers They Continued 1st session', alt: 'September Prayers They Continued 1st session', fileName: 'September Prayers They Continued 1st session', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1vXDB1IplU6E9kvW6XAr9D4ITqVPukMH8', title: 'Doers of the Word', alt: 'Doers of the Word', fileName: 'Doers of the Word', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1w5_Z-9cYbLcqOFnwL9dOH3uHqVUL-dxu', title: 'Dont Give up', alt: 'Dont Give up', fileName: 'Dont Give up', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16fxpwCa0pqUOGRgASaD3SX_PRZ6ASyRy', title: 'Hour of mercy Manifesting Prophecies', alt: 'Hour of mercy Manifesting Prophecies', fileName: 'Hour of mercy Manifesting Prophecies', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1UClQyaYx0Exn1ePJc9N5_LKkOyWXgLLG', title: 'Hour of mercy with Prophetic prayers', alt: 'Hour of mercy with Prophetic prayers', fileName: 'Hour of mercy with Prophetic prayers', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1v8DzNZ4gSTht7s0t-aAVOjURPANo84DW', title: 'How God strengthens our hands', alt: 'How God strengthens our hands', fileName: 'How God strengthens our hands', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1V8WAanYmRZxeiPWGXv0cR5BKwAuBlthG', title: 'Invoking the confusion of the Lord against your enemies', alt: 'Invoking the confusion of the Lord against your enemies', fileName: 'Invoking the confusion of the Lord against your enemies', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1BqgEICnPWeAg6zVtvKySuhteo8HG-ZZj', title: 'Lord you are pleased with me', alt: 'Lord you are pleased with me', fileName: 'Lord you are pleased with me', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1K9fpCULhCEvL9mPup8aiRGrNQn4YzbOI', title: 'Lord perform what you have spoken', alt: 'Lord perform what you have spoken', fileName: 'Lord perform what you have spoken', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16WzFiQbcxLx_4rUvHI5dZTQ-n7r8s3jQ', title: 'Manifesting Prophecies 3', alt: 'Manifesting Prophecies 3', fileName: 'Manifesting Prophecies 3', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1RlLmrAvi6lQ1pBeJeyj-kPAUGfgL5Pqx', title: 'Manifesting Prophecies_being fully persuaded', alt: 'Manifesting Prophecies_being fully persuaded', fileName: 'Manifesting Prophecies_being fully persuaded', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1w7zxMTaNRzPtmymFiJv4YkI26DhenENY', title: 'Manifesting Prophecies_Conquering the spirit of fear', alt: 'Manifesting Prophecies_Conquering the spirit of fear', fileName: 'Manifesting Prophecies_Conquering the spirit of fear', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HSvm0Yhn4pOO_YTy9A9i44rnHwxmDdtl', title: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', alt: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', fileName: 'Manifesting Prophecies_Testimonies_ Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1La0LN9oznYGMlhxOuT2UcK8jBxZUMDWK', title: 'Manifesting Prophecies_the gift of an eye_Pastor', alt: 'Manifesting Prophecies_the gift of an eye_Pastor', fileName: 'Manifesting Prophecies_the gift of an eye_Pastor', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14E3JDtUHcaD_05zDVF82Iak5Gv3-TDV7', title: 'Manifesting Prophecies_Think on these things_ Past Enoch', alt: 'Manifesting Prophecies_Think on these things_ Past Enoch', fileName: 'Manifesting Prophecies_Think on these things_ Past Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=17veJST5Ou92IB2UD0M5xBIHqLjc1WeLd', title: 'Manifesting Prophecies_Waiting on God Pastor Enoch', alt: 'Manifesting Prophecies_Waiting on God Pastor Enoch', fileName: 'Manifesting Prophecies_Waiting on God Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14G2Tx1u5g3FwFLiXzj_LRF60MTzvdxg9', title: 'Manifesting Manifesting the word of the Lord', alt: 'Manifesting Manifesting the word of the Lord', fileName: 'Manifesting Manifesting the word of the Lord', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1pCkHVt6uNVd6KwiiJzlFL1TqSezXmJJ7', title: 'Manifesting Prophecy_ dealing with discouragement2', alt: 'Manifesting Prophecy_ dealing with discouragement2', fileName: 'Manifesting Prophecy_ dealing with discouragement2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=16w3CoQfj231QXdouL3p3QWInoYr5V4nh', title: 'Men sent by God full message ', alt: 'Men sent by God full message ', fileName: 'Men sent by God full message ', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1g4QFXLxKI0BomlHMexZnZZPiZFLemhn-', title: 'My prayers for you this month of July', alt: 'My prayers for you this month of July', fileName: 'My prayers for you this month of July', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CPtAlSJYUw1K3h9K0mV5vU3MGcX0wr3K', title: 'Non-cognitive modes of communication 1', alt: 'Non-cognitive modes of communication 1', fileName: 'Non-cognitive modes of communication 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12gFUyPhP1ALxvdCIWYjTRpy5MHn9yUCG', title: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', alt: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', fileName: 'Patterns of favour_maintaining and building relatonship Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=14yXjGDNnrbSXuMUF4_VTvIJlrVKPbtDT', title: 'Prayer charge', alt: 'Prayer charge', fileName: 'Prayer charge', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1U9SCFL6E8P3ciLFJu-wgGx2fAZpW9eKI', title: 'Prayers against evil marks', alt: 'Prayers against evil marks', fileName: 'Prayers against evil marks', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1xso6yq1Tdhgg7K22EpvnLLkcJK1BWWIH', title: 'Prayers against evil reports', alt: 'Prayers against evil reports', fileName: 'Prayers against evil reports', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1AFgu6M1qYdeMgQpzY8wQDBvsXias3FIa', title: 'Prayers against problem expanders', alt: 'Prayers against problem expanders', fileName: 'Prayers against problem expanders', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1YdMS0gH3EoaXcYP-C_XBnhLz2th_Ksxu', title: 'Prayers against spiritual marriage', alt: 'Prayers against spiritual marriage', fileName: 'Prayers against spiritual marriage', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=11UFdO4LIt6pVtCZd0el5xrj1iWdZERo7', title: 'Prayers against spiritual marriage2', alt: 'Prayers against spiritual marriage2', fileName: 'Prayers against spiritual marriage2', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12DVALl52k8Syqd5IsHsM1v5kDqkpeKvb', title: 'Praying the promises of God', alt: 'Praying the promises of God', fileName: 'Praying the promises of God', local: true },
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
    videos: [
      { type: 'video', src: 'https://youtube.com/shorts/A7usTs1ds5k', embedUrl: 'https://www.youtube.com/embed/A7usTs1ds5k', isYouTube: true, title: 'Commanding Your Week', alt: 'Commanding Your Week' },
      { type: 'video', src: 'https://youtube.com/shorts/dbqnn792Y7M', embedUrl: 'https://www.youtube.com/embed/dbqnn792Y7M', isYouTube: true, title: 'Commanding Your Week - Part 2', alt: 'Commanding Your Week - Part 2' },
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

  // Close on outside click
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

  // Helper to highlight the matching part of the text
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
    if (val === '') {
      onChange('');
    }
  };

  const handleBlur = (e) => {
    if (selectedOption) {
      setQuery(selectedOption.label);
    } else {
      setQuery('');
    }
    setOpen(false);
  };

  // Helper to dynamically apply your styles prop
  const getStyle = (key, base, state = {}) => {
    if (styles[key]) {
      return typeof styles[key] === 'function' ? styles[key](base, state) : { ...base, ...styles[key] };
    }
    return base;
  };

  const controlStyle = getStyle('control', {
    width: '100%', boxSizing: 'border-box', minHeight: '52px', padding: '0 16px',
    borderRadius: '12px', border: '2px solid #ddd', backgroundColor: '#fff',
    color: '#333', fontSize: '1rem', fontWeight: '600', outline: 'none', transition: 'all 0.3s ease',
  });

  const singleValueStyle = getStyle('singleValue', { color: '#333' });
  const placeholderStyle = getStyle('placeholder', { color: '#888' });

  const menuStyle = getStyle('menu', {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
    backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '12px',
    maxHeight: '280px', overflowY: 'auto', margin: 0, padding: '6px 0',
    listStyle: 'none', boxShadow: '0 10px 28px rgba(0,0,0,0.15)',
  });

  const baseOption = {
    padding: '12px 16px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s ease',
  };

  return (
    <div className="media-control-group" ref={containerRef} style={{ position: 'relative' }}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        autoComplete="off"
        style={{
          ...controlStyle,
          color: singleValueStyle.color,
          '--placeholder-color': placeholderStyle.color,
        }}
      />
      {open && (
        <ul style={menuStyle} role="listbox">
          {filteredOptions.length === 0 ? (
            <li style={{ padding: '12px 16px', color: '#888', textAlign: 'center' }}>
              {noResultsText || 'No results found'}
            </li>
          ) : (
            filteredOptions.map((opt) => {
              const optionStyle = getStyle('option', baseOption, { isFocused: opt.value === value });
              
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  style={optionStyle}
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const playableMedia = mediaItems.filter((item) => item.type === 'video' || item.type === 'audio');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

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

  // ===================================================
  // COMMERCIAL
  // ===================================================
  const [showCommercial, setShowCommercial] = useState(false);
  const [commercialUrl, setCommercialUrl] = useState(null);
  const commercialVideoRef = useRef(null);
  const commercialTimeoutRef = useRef(null);
  const commercialShowingRef = useRef(false);
  
  const commercialAudioRef = useRef(null); 
  const audioRef = useRef(null);

  // ===================================================
  // RANDOM MARQUEE MESSAGE
  // ===================================================
  const [randomMessage] = useState(() => {
    return marqueeMessages[Math.floor(Math.random() * marqueeMessages.length)];
  });

  const selectedMedia = playableMedia[selectedMediaIndex] || null;

  // =====================================================
  // FIX: UNLOCK AUDIO AUTOPLAY ON PAGE LOAD
  // =====================================================
  useEffect(() => {
    const unlockAudio = async () => {
      if (commercialAudioRef.current) {
        try {
          commercialAudioRef.current.volume = 0;
          await commercialAudioRef.current.play();
          commercialAudioRef.current.pause();
          commercialAudioRef.current.currentTime = 0;
        } catch (e) {
          console.warn("Browser requires user interaction before audio can play.");
        }
      }
    };
    unlockAudio();
  }, []);
  // =====================================================
  // IMAGE SLIDER
  // =====================================================
  useEffect(() => {
    if (imageItems.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === imageItems.length - 1 ? 0 : prevIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageItems.length]);

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================
  const getDriveFileId = (src) => {
    if (!src) return '';
    const match = src.match(/id=([a-zA-Z0-9_-]+)/) || src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  };

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
  // COMMERCIAL LOGIC
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
    }, 25000);
  };

  useEffect(() => {
    const triggerTimes = [5000, 10000, 15000];
    const timers = triggerTimes.map((time) => setTimeout(() => startCommercial(), time));
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      if (commercialTimeoutRef.current) clearTimeout(commercialTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showCommercial || !commercialUrl) return;

    // Play Video
    if (commercialVideoRef.current) {
      const video = commercialVideoRef.current;
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      video.play().catch((error) => {
        console.warn('⚠️ Commercial video autoplay was blocked:', error);
      });
    }

    // Play Background Audio
    if (commercialAudioRef.current) {
      const audio = commercialAudioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.3; 
      audio.play().catch((error) => {
        console.warn('⚠️ Commercial audio autoplay was blocked:', error);
      });
    }
  }, [showCommercial, commercialUrl]);

  // AUTO-PLAY SELECTED AUDIO
  useEffect(() => {
    if (!selectedAudio || !audioRef.current) return;
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn('⚠️ Audio autoplay was blocked by the browser:', error);
    });
  }, [selectedAudio]);

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
          />
          
          <div className="commercial-timer">Advertisement</div>
        </div>
      )}

      {/* HIDDEN COMMERCIAL AUDIO (Placed here so it loads on page start) */}
      <audio 
        ref={commercialAudioRef} 
        src="/audios/commercial.mp3" 
        preload="auto"
        style={{ display: 'none' }}
      />

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

              {/* --- MEDIA PICTURES DROPDOWN (Only shows if > 1 image) --- */}
              {!isSingleImage && (
                <div className="media-selector-card" style={{ marginBottom: '24px' }}>
                  <h2 className="media-selector-title">Media Pictures</h2>
                  <div className="media-control-group">
                    <label htmlFor="picture-select">🖼️ Select a picture</label>
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

              {/* --- MEDIA PLAYER --- */}
              <div className="media-selector-card">
                <h2 className="media-selector-title">Media Player</h2>

                {/* AUDIO SELECTOR (Searchable) */}
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

                {/* SELECTED AUDIO DISPLAY */}
                {selectedAudio && (
                  <div className="selected-audio">
                    <p>{selectedAudio.title}</p>

                    {/* Iframe Player for Google Drive Audio */}
                    <iframe
                      src={`https://drive.google.com/file/d/${getDriveFileId(selectedAudio.src)}/preview`}
                      width="100%"
                      height="80"
                      allow="autoplay"
                      frameBorder="0"
                      style={{ borderRadius: '8px', marginBottom: '14px' }}
                      title={selectedAudio.title}
                    />

                    {/* Hidden native audio player kept to satisfy your existing autoplay logic */}
                    <audio key={selectedAudio.src} ref={audioRef} preload="metadata" style={{ display: 'none' }}>
                      <source src={selectedAudio.src} />
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

                {/* COMMANDING WEEK SELECTOR (Searchable) */}
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
                  <p>Choose an image, audio, or video from the options above.</p>
                  <span>Choose from our available media</span>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: IMAGE DISPLAY */}
            <div className="media-column images">
              <div className="full-height-slider">
                {imageItems.length > 0 && (
                  <img
                    src={
                      isSingleImage 
                        ? imageItems[0].src 
                        : imageItems[selectedImageIndex]?.src || imageItems[currentIndex].src
                    }
                    alt={
                      isSingleImage 
                        ? imageItems[0].alt 
                        : imageItems[selectedImageIndex]?.alt || imageItems[currentIndex].alt
                    }
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