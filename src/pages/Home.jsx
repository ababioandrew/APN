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
  { type: 'video', src: 'https://www.youtube.com/watch?v=JE3rARGfSyg', embedUrl: 'https://www.youtube.com/embed/JE3rARGfSyg', isYouTube: true, title: '27th Oct 2026 - DEALING WITH DEMONIC RESISTANCE', alt: 'Commanding Your Week' },
  { type: 'video', src: 'https://www.youtube.com/watch?v=NSGc6wJgTRE', embedUrl: 'https://www.youtube.com/embed/NSGc6wJgTRE', title: '18th Oct 2026', alt: 'Commanding Your Week', isYouTube: true }
];

const localAudios = [
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1dIp-bszTMGFEB3y6LNbwWj8IeGD7f2Cp', title: 'Lord teach me your ways_Pastor Enoch', alt: 'Lord teach me your ways_Pastor Enoch', fileName: 'Lord teach me your ways_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1eneFciwAOhkYEujY_eR2GcKvFWPlY1RY', title: 'Lord show me what to do_Pastor Enoch', alt: 'Lord show me what to do_Pastor Enoch', fileName: 'Lord show me what to do_Pastor Enoch', local: true },
  // { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1c-O6Mi42_5XB24TOf-hwN0qjjPstYIrJ', title: 'Preparatory message Mr and Mrs Peprah', alt: 'Preparatory message Mr and Mrs Peprah', fileName: 'Preparatory message Mr and Mrs Peprah', local: true },
  // { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=18FmoRiReKBaAVDcKpuKbHYz9qccSlSNr', title: '2025-01-09 23-35-51', alt: '2025-01-09 23-35-51', fileName: '2025-01-09 23-35-51', local: true },
  // { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1lhpptPHF7F38RRKL2V34t9wXpXZTTqpU', title: '2025-03-14 15-15-18', alt: '2025-03-14 15-15-18', fileName: '2025-03-14 15-15-18', local: true },
  // { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nEyNqnKPl7S1I5ouAfY2AYRHZRe-wJO8', title: 'Sermon-by Pastor Enoch', alt: 'Sermon-by Pastor Enoch', fileName: 'Sermon-by Pastor Enoch', local: true },
  
  
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zYBrCqq7oWnbFfu8th2uSiDOASPj3ozY', title: '1st Partners meeting 2025', alt: '1st Partners meeting 2025', fileName: '1st Partners meeting 2025', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1kDdm_pJkP5LJR2qlXKcBkctOZUYA2NN1', title: 'Court Of Heaven day 2_Pastor Enoch', alt: 'Court Of Heaven day 2_Pastor Enoch', fileName: 'Court Of Heaven day 2_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1XDgbawuJlvu-e5TRSSSZx0EoLT-uAgB6', title: 'Look upon me with mercy_Pastor Enoch', alt: 'Look upon me with mercy_Pastor Enoch', fileName: 'Look upon me with mercy_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1s8Kwp49GZG99NuRa9KHXu0RzB64g_r5P', title: 'heighten my Discernment_Pastor Enoch', alt: 'heighten my Discernment_Pastor Enoch', fileName: 'heighten my Discernment_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1duC1koBeulxcec6Fc53cLjcVK11zChft', title: 'Divine Restoration day 2_Pastor Enoch', alt: 'Divine Restoration day 2_Pastor Enoch', fileName: 'Divine Restoration day 2_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1epFrY6k5mmd-cGJp8chAgB5CvXSrNnJz', title: 'Restoration day 1_Pastor Enoch', alt: 'Restoration day 1_Pastor Enoch', fileName: 'Restoration day 1_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1manoB8udsFJy10UURSdtO73GNbOxGUUT', title: 'Language of supplication unedited_Pastor Enoch', alt: 'Language of supplication unedited_Pastor Enoch', fileName: 'Language of supplication unedited_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1zQ_dtkV3usM44fNboqF3LOP5ymkD8j3d', title: '7 hours prayer_the help of God _Pastor Enoch', alt: '7 hours prayer_the help of God _Pastor Enoch', fileName: '7 hours prayer_the help of God _Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EDHRjI1v1O1m7Rro1rOSM9wLlHNU6L1Z', title: 'For you glory_Pastor Enoch', alt: 'For you glory_Pastor Enoch', fileName: 'For you glory_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1dY3VHlHivdZ9Rv4Qg_DAVVfeP077RaFU', title: 'first hour mercy meeting 2025', alt: 'first hour mercy meeting 2025', fileName: 'first hour mercy meeting 2025', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1nn_y7bXCw1--dhqvKNCc7iG59WZ-vd4B', title: 'Hunger for more_Pastor Enoch', alt: 'Hunger for more_Pastor Enoch', fileName: 'Hunger for more_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1CbLdVYdtcOzriQpMaotaskyK_p6H2ZtB', title: 'Conquering the spirit of fear_Pastor Enoch', alt: 'Conquering the spirit of fear_Pastor Enoch', fileName: 'Conquering the spirit of fear_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1HXDfJ-BSSoS6rjcRMjhkQN4HZgLoiFFw', title: 'Conquering the spirit of fear Part 2_Pastor Enoch', alt: 'Conquering the spirit of fear Part 2_Pastor Enoch', fileName: 'Conquering the spirit of fear Part 2_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1jsojzOIoG7x822_YDzyggFm6w7xuJpzE', title: 'prophetic spy 1', alt: 'prophetic spy 1', fileName: 'prophetic spy 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1lFoVN16J59Cdu00Udgw0XJ9WquiF1s9h', title: 'How satan fights_Pastor Enoch', alt: 'How satan fights_Pastor Enoch', fileName: 'How satan fights_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1EGX3FlCHioPseLBaQKpamUhdgx_HFjWq', title: 'Sunday Midnight Prayers', alt: 'Sunday Midnight Prayers', fileName: 'SundayMidnight', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1QrxZpZjDgbvYQNsTU4SLHLZao7V3xYrt', title: 'Life Is Spiritual _Pastor Enoch', alt: 'Life Is Spiritual _Pastor Enoch', fileName: 'Life Is Spiritual _Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12B3ZT8gTJoQiuhnuhgHVK-4HlrxJ2B6c', title: 'Praying your obedience before the judge _Pastor Enoch', alt: 'Praying your obedience before the judge _Pastor Enoch', fileName: 'Praying your obedience before the judge _Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1Bi7hLjvyyQeMlDwcLld700ccH3j65NwV', title: 'introduction to the court of heaven_Pastor Enoch', alt: 'introduction to the court of heaven_Pastor Enoch', fileName: 'introduction to the court of heaven_Pastor Enoch', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=1e6qBQZdqNbfgYlqFeP8iPa7QRJMIChQQ', title: 'Prayer chain day 1 session 1', alt: 'Prayer chain day 1 session 1', fileName: 'Prayer chain day 1 session 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=102PgCc-qzOeg2gCiNUR6R1MmYXbx6zmm', title: 'Delivance_A Call Unto Alignment_Past Enoch', alt: 'Why many are not doers of the word Part 1_Pastor Enoch', fileName: 'Why many are not doers of the word Part 1', local: true },
  { type: 'audio', src: 'https://drive.google.com/uc?export=download&id=12Gpj9Sn1xJxoH4s2hxgPBQjfUCGZS81r', title: 'The shiloh cry_ APN', alt: 'The shiloh cry_ APN', fileName: 'The shiloh cry APN', local: true },
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
    }, 10000);
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