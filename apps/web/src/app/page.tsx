'use client';

import React, { useState, useEffect } from 'react';
import { calculateKundli, calculateDailyPanchang, calculateAshtakootaMatching, calculateDivisionalCharts, calculateVimshottariDasha, D1_D60_EXPLANATIONS, predictMarriageDetails, predictCareerDetails, predictMarriageDetailsDeep, predictCareerDetailsDeep, getDivisionalChartDeepExplanation, generateDetailedPlanetImpacts, detectStelliumsAndYogas, detectVedicDoshasAndRemedies, calculateAshtakavarga, calculateVarshphal, analyzeDetailedCareerByPlanets, PLANET_CAREER_MAPPINGS, ZODIAC_CAREER_MAPPINGS, predictPromotionAndIncrementTiming, calculateNumerologyDetails, calculateAdvancedNumerology, analyzeVibrationNumber, NUMEROLOGY_PROFILES, detectComprehensiveRajYogas, RajYogaDetail, generateFullKundliReport } from '@vedic-astro/astrology-engine';
import { NorthIndianChart, SouthIndianChart } from '@vedic-astro/ui';
import { KundliData, PanchangData, AshtakootaMatchingResult, DivisionalChart, VimshottariDashaResult } from '@vedic-astro/types';

export default function HomePage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kundli' | 'predictions' | 'numerology' | 'matching' | 'panchang' | 'astrologers' | 'admin' | 'report'>('dashboard');

  // Kundli Input State (Updated default DOB: 2002-02-01, TOB: 06:55)
  const [dob, setDob] = useState('2002-02-01');
  const [tob, setTob] = useState('06:55');
  const [place, setPlace] = useState('Ajmer, Rajasthan, India');
  const [lat, setLat] = useState(26.4499);
  const [lng, setLng] = useState(74.6399);

  // Free OpenStreetMap Nominatim Birthplace Search Autocomplete State
  const [searchQuery, setSearchQuery] = useState('Ajmer, Rajasthan, India');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Active Calculations State
  const [kundli, setKundli] = useState<KundliData>(() => calculateKundli('2002-02-01', '06:55:00', 26.4499, 74.6399));
  const [divisionalCharts, setDivisionalCharts] = useState<DivisionalChart[]>(() => calculateDivisionalCharts(kundli));
  const [dashaResult, setDashaResult] = useState<VimshottariDashaResult>(() => calculateVimshottariDasha(kundli, '2002-02-01'));
  
  const todayIso = new Date().toISOString().split('T')[0];
  const [panchang, setPanchang] = useState<PanchangData>(() => calculateDailyPanchang(todayIso, 26.4499, 74.6399));
  const [userLocationName, setUserLocationName] = useState<string>('Ajmer, Rajasthan');
  const [showAllPlanetsCareer, setShowAllPlanetsCareer] = useState(false);
  const [careerGuideViewMode, setCareerGuideViewMode] = useState<'planets' | 'zodiac'>('planets');
  const [activeChatAstro, setActiveChatAstro] = useState<string | null>(null);
  const [rajYogaCategoryFilter, setRajYogaCategoryFilter] = useState<string>('ALL');
  const [numerologyNameInput, setNumerologyNameInput] = useState<string>('Pankaj Sharma');
  const [vibrationInput, setVibrationInput] = useState<string>('9876543210');
  const [vibrationCategory, setVibrationCategory] = useState<'mobile' | 'vehicle' | 'house' | 'custom'>('mobile');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setReportSuccessMsg(null);
    try {
      const response = await fetch('/api/report/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'PANKAJ DADHICH',
          gender: 'Male',
          dob,
          tob,
          place,
          latitude: lat,
          longitude: lng
        })
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vedic_Kundli_Report_Pankaj_Dadhich.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setReportSuccessMsg('🎉 17-अध्यायी PDF रिपोर्ट सफलतापूर्वक डाउनलोड हो गई है!');
    } catch (err: any) {
      alert('PDF generation error: ' + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenPrintPreview = () => {
    const params = new URLSearchParams({
      name: 'PANKAJ DADHICH',
      gender: 'Male',
      dob,
      tob,
      place,
      lat: lat.toString(),
      lng: lng.toString()
    });
    window.open(`/api/report/html?${params.toString()}`, '_blank');
  };

  // Fetch real user geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setLat(userLat);
          setLng(userLng);
          setUserLocationName(`Live Device Location (${userLat.toFixed(2)}°, ${userLng.toFixed(2)}°)`);
          const realPanchang = calculateDailyPanchang(todayIso, userLat, userLng);
          setPanchang(realPanchang);
        },
        (error) => {
          console.log('Geolocation permission denied/unavailable, using default coordinates', error);
        }
      );
    }
  }, [todayIso]);

  // Free OpenStreetMap Nominatim Geocoding API Search (No Google API Key Cost Required!)
  const handleSearchPlace = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
      const data = await res.json();
      setSearchResults(data || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Free Nominatim location search error', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (item: any) => {
    const selectedLat = parseFloat(item.lat);
    const selectedLng = parseFloat(item.lon);
    const selectedName = item.display_name;

    setLat(selectedLat);
    setLng(selectedLng);
    setPlace(selectedName);
    setSearchQuery(selectedName);
    setShowDropdown(false);

    // Auto recalculate Kundli with selected location
    const formattedTob = tob.length === 5 ? `${tob}:00` : tob;
    const res = calculateKundli(dob, formattedTob, selectedLat, selectedLng);
    setKundli(res);
    setDivisionalCharts(calculateDivisionalCharts(res));
    setDashaResult(calculateVimshottariDasha(res, dob));
  };

  const handleUseLiveLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setLat(userLat);
          setLng(userLng);
          const liveName = `Current Location (${userLat.toFixed(4)}°, ${userLng.toFixed(4)}°)`;
          setPlace(liveName);
          setSearchQuery(liveName);
          setUserLocationName(liveName);
          const realPanchang = calculateDailyPanchang(todayIso, userLat, userLng);
          setPanchang(realPanchang);
          alert(`📍 Live Location Captured: Lat ${userLat.toFixed(4)}, Lng ${userLng.toFixed(4)}. Real Panchang updated!`);
        },
        (err) => {
          alert('Could not access live location. Please allow location permissions in your browser.');
        }
      );
    }
  };

  const [matchResult, setMatchResult] = useState<AshtakootaMatchingResult | null>(null);
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH'>('NORTH');
  const [selectedDivChart, setSelectedDivChart] = useState<string>('D1');

  // Varshphal Target Year State
  const [varshphalYear, setVarshphalYear] = useState<number>(2026);

  // 4-Level Dasha Timeline Explorer State
  const [selectedMahaIdx, setSelectedMahaIdx] = useState<number | null>(0);
  const [selectedAntarIdx, setSelectedAntarIdx] = useState<number | null>(null);
  const [selectedPratIdx, setSelectedPratIdx] = useState<number | null>(null);

  // AI Explanation State
  const [aiLanguage, setAiLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // User Astrological Custom Query & History State
  const [userQueryInput, setUserQueryInput] = useState('');
  const [savedQueriesHistory, setSavedQueriesHistory] = useState<{ question: string; answer: string; timestamp: string }[]>([]);

  const handleAskAstrologyQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQueryInput.trim()) return;

    const q = userQueryInput.trim();
    let generatedAnswer = '';

    if (q.includes('salary') || q.includes('increment') || q.includes('promotion') || q.includes('पदोन्नति') || q.includes('वेतन') || q.includes('हाइक') || q.includes('appraisal')) {
      const promo = predictPromotionAndIncrementTiming(kundli, {
        currentMahadasha: dashaResult.currentMahadasha,
        currentAntardasha: dashaResult.currentAntardasha
      });
      generatedAnswer = `🚀 वेतन वृद्धि व पदोन्नति भविष्यवाणी: पदोन्नति की संभावित अवधि: ${promo.promotionWindow} (संभावना: ${promo.promotionProbability}%)। सैलेरी हाइक अवधि: ${promo.salaryIncrementWindow} (अनुमानित वृद्धि: ${promo.expectedHikePercent})। ज्योतिषीय कारण: ${promo.astrologicalReason}। मुख्य उपाय: ${promo.remedies.join(', ')}`;
    } else if (q.includes('mulank') || q.includes('मूलांक') || q.includes('bhagyank') || q.includes('भाग्यांक') || q.includes('numerology') || q.includes('अंकशास्त्र') || q.includes('lucky number')) {
      const numRes = calculateNumerologyDetails(dob, searchQuery);
      generatedAnswer = `🔢 अंकशास्त्र मार्गदर्शन: आपका मूलांक ${numRes.mulank.number} (${numRes.mulank.rulingPlanetHindi}) और भाग्यांक ${numRes.bhagyank.number} (${numRes.bhagyank.rulingPlanetHindi}) है। लकी रंग: ${numRes.mulank.luckyColors.join(', ')}। लकी रत्न: ${numRes.mulank.luckyGems.join(', ')}। लकी तिथियां: ${numRes.mulank.luckyDates.join(', ')}। अनुकूल कार्यक्षेत्र: ${numRes.mulank.careerRecommendationsHindi.slice(0, 3).join(', ')}`;
    } else if (q.includes('job') || q.includes('नौकरी') || q.includes('career') || q.includes('काम')) {
      const career = predictCareerDetailsDeep(kundli);
      generatedAnswer = `💼 करियर मार्गदर्शन: ${career.sector} (संभावना: ${career.govtProbability}%)। अनुमानित आयु वर्ग: ${career.firstJobAgeWindow}। दिशा: ${career.jobLocationDirection}। उपयुक्त क्षेत्र: ${career.recommendedStreams.join(', ')}। ज्योतिषीय कारण: ${career.astrologicalReason}`;
    } else if (q.includes('vivah') || q.includes('marriage') || q.includes('शादी') || q.includes('विवाह') || q.includes('love') || q.includes('arranged')) {
      const marriage = predictMarriageDetailsDeep(kundli);
      generatedAnswer = `❤️ विवाह मार्गदर्शन: ${marriage.type}। विवाह की संभावित आयु: ${marriage.marriageAgeWindow}। जीवनसाथी की दिशा: ${marriage.spouseDirection}। मध्यस्थता: ${marriage.facilitatedBy}। संतान योग: ${marriage.childrenDetails}। जीवनसाथी का स्वभाव: ${marriage.spouseNature}`;
    } else {
      generatedAnswer = `🔮 आपकी कुंडली (लग्न: ${kundli.lagnaRashi}, चंद्र राशि: ${kundli.moonRashi}) और वर्तमान दशा (${dashaResult.currentMahadasha}-${dashaResult.currentAntardasha}) के अनुसार: आपके 1st/10th/9th भाव की स्थिति अनुकूल है। सकारात्मक परिणाम हेतु सूर्य व गुरु उपासना फलदायी होगी।`;
    }

    const newEntry = {
      question: q,
      answer: generatedAnswer,
      timestamp: new Date().toLocaleTimeString()
    };

    setSavedQueriesHistory((prev) => [newEntry, ...prev]);
    setUserQueryInput('');
  };

  // Dynamic Feature Flags (Admin State)
  const [featureFlags, setFeatureFlags] = useState({
    kundli: true,
    matching: true,
    panchang: true,
    astrologer_chat: true,
    ai_astrologer: true,
    premium_reports: true
  });

  const handleGenerateKundli = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTob = tob.length === 5 ? `${tob}:00` : tob;
    const res = calculateKundli(dob, formattedTob, lat, lng);
    setKundli(res);
    setDivisionalCharts(calculateDivisionalCharts(res));
    setDashaResult(calculateVimshottariDasha(res, dob));
    setAiExplanation(null);
  };

  const handleMatchCalculation = () => {
    const k1 = calculateKundli(dob, '10:30:00', lat, lng);
    const k2 = calculateKundli('2003-05-15', '14:15:00', 19.0760, 72.8777);
    setMatchResult(calculateAshtakootaMatching(k1, k2));
  };

  const generateAiExplanation = () => {
    if (aiLanguage === 'hi') {
      setAiExplanation(
        `आपकी लग्न राशि ${kundli.lagnaRashi} है और आपकी चंद्र राशि ${kundli.moonRashi} है। सूर्य दशम भाव में स्थित है जो आपको नेतृत्व क्षमता और करियर में उच्च सफलता प्रदान करता है। वर्तमान में आप ${dashaResult.currentMahadasha} महादशा में ${dashaResult.currentAntardasha} अंतर्दशा से गुजर रहे हैं।`
      );
    } else if (aiLanguage === 'hinglish') {
      setAiExplanation(
        `Aapka Lagna ${kundli.lagnaRashi} hai aur Moon Sign ${kundli.moonRashi} hai. Sun 10th House me hone se aapko Career me high success aur authority milegi. Abhi aapki ${dashaResult.currentMahadasha} Mahadasha chal rahi hai.`
      );
    } else {
      setAiExplanation(
        `Your Ascendant (Lagna) is ${kundli.lagnaRashi} and your Moon sign is ${kundli.moonRashi}. Sun in the 10th house grants executive leadership and career advancement. You are currently running ${dashaResult.currentMahadasha} Mahadasha with ${dashaResult.currentAntardasha} Antardasha.`
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Primary Sub-Navigation Bar */}
      <div style={{ display: 'flex', gap: '12px', background: '#0E131F', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'report', label: '📜 17-Chapter Kundli Report (PDF)' },
          { id: 'kundli', label: '🔮 Janam Kundli' },
          { id: 'predictions', label: '📖 Life Guidance & Predictions' },
          { id: 'numerology', label: '🔢 Numerology (अंकशास्त्र)' },
          { id: 'matching', label: '❤️ 36 Guna Match' },
          { id: 'panchang', label: '📅 Daily Panchang' },
          { id: 'astrologers', label: '🧙 Astrologer Marketplace' },
          { id: 'admin', label: '⚙️ Admin Panel' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#94A3B8',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <section className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge-gold">Shubh Muhurat & Daily Vedic Guidance</span>
                <button onClick={handleUseLiveLocation} className="btn-gold" style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📍 Use Live Device Location
                </button>
              </div>
              <h1 style={{ fontSize: '2.2rem', marginTop: '10px', background: 'linear-gradient(90deg, #FFFFFF, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Good Morning! 🙏
              </h1>
              <p style={{ color: '#94A3B8', marginTop: '4px' }}>
                Location: <strong style={{ color: '#4ADE80' }}>{userLocationName}</strong> | Month (Masa): <strong style={{ color: '#FFD700' }}>{panchang.masa.name} Masa</strong> | Tithi: <strong style={{ color: '#FFD700' }}>{panchang.tithi.name}</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ background: '#07090E', padding: '12px 18px', borderRadius: '10px', border: '1px solid #D4AF37' }}>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Active Dasha</span>
                <div style={{ fontWeight: 700, color: '#FFD700' }}>{dashaResult.currentMahadasha} - {dashaResult.currentAntardasha}</div>
              </div>
              <div style={{ background: '#07090E', padding: '12px 18px', borderRadius: '10px', border: '1px solid #FF6B6B' }}>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Rahu Kalam</span>
                <div style={{ fontWeight: 700, color: '#FF6B6B' }}>{panchang.muhurats.rahuKalam.start} - {panchang.muhurats.rahuKalam.end}</div>
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ cursor: 'pointer', border: '1px solid #D4AF37', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(14,19,31,0.9) 100%)' }} onClick={() => setActiveTab('report')}>
              <h3 style={{ color: '#FCD34D' }}>📜 17-Chapter PDF Report</h3>
              <p style={{ color: '#E2E8F0', fontSize: '0.85rem', marginTop: '6px' }}>सम्पूर्ण 17 अध्यायी जीवन दर्पण रिपोर्ट डाउनलोड करें (Headless Skia/PDF)</p>
            </div>
            <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('kundli')}>
              <h3 style={{ color: '#FFD700' }}>🔮 View Janam Kundli</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '6px' }}>DOB: {dob} | D1-D60 Charts</p>
            </div>
            <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('numerology')}>
              <h3 style={{ color: '#FFD700' }}>🔢 Numerology Calculator</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '6px' }}>Mulank, Bhagyank & Chaldean Name Report</p>
            </div>
            <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('matching')}>
              <h3 style={{ color: '#FFD700' }}>❤️ 36 Guna Kundli Match</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '6px' }}>Ashtakoota & Manglik Dosha Analysis</p>
            </div>
            <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('panchang')}>
              <h3 style={{ color: '#FFD700' }}>📅 Daily Panchang</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '6px' }}>Tithi, Rahu Kalam & Abhijit Muhurat</p>
            </div>
            <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('astrologers')}>
              <h3 style={{ color: '#FFD700' }}>🧙 Talk to Astrologers</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '6px' }}>Live Instant Chat Consultations</p>
            </div>
          </div>
        </div>
      )}

      {/* 17-CHAPTER KUNDLI REPORT (PDF) TAB */}
      {activeTab === 'report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Banner & Download Bar */}
          <section className="glass-card" style={{ border: '2px solid #D4AF37', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(14,19,31,0.95) 100%)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge-gold">👑 Vedic Astro Golden Standard</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>35+ Page Publication-Grade PDF</span>
                </div>
                <h1 style={{ fontSize: '2rem', margin: '0 0 6px 0', background: 'linear-gradient(90deg, #FFFFFF, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  सम्पूर्ण 17-अध्यायी विस्तृत जन्मपत्री रिपोर्ट (Kundli PDF)
                </h1>
                <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0, maxWidth: '750px' }}>
                  अवकहड़ा चक्र, षोडशवर्ग चार्ट्स (D1-D60), 12 भावफल, जैमिनी चर कारक, विवाह व करियर विश्लेषण, साढ़े साती, राजयोग, महादशा फल एवं संपूर्ण वैदिक उपाय।
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', fontSize: '0.85rem' }}>
                  <span style={{ background: '#07090E', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', color: '#FFD700' }}>
                    जातक: <strong>PANKAJ DADHICH</strong>
                  </span>
                  <span style={{ background: '#07090E', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', color: '#E2E8F0' }}>
                    DOB: <strong>{dob} ({tob})</strong>
                  </span>
                  <span style={{ background: '#07090E', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', color: '#4ADE80' }}>
                    स्थान: <strong>{place}</strong>
                  </span>
                  <span style={{ background: '#07090E', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', color: '#38BDF8' }}>
                    लग्न: <strong>मकर</strong> | राशि: <strong>कन्या</strong> | नक्षत्र: <strong>उत्तराफाल्गुनी (2)</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: isGeneratingPdf ? 'not-allowed' : 'pointer',
                    fontWeight: 800,
                    fontSize: '1rem',
                    background: isGeneratingPdf ? '#475569' : 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #AA7C11 100%)',
                    color: '#000',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isGeneratingPdf ? '⏳ Generating PDF (Headless Engine)...' : '📥 Download Full PDF Report (Skia/PDF)'}
                </button>
                <button
                  onClick={handleOpenPrintPreview}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #D4AF37',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    background: 'transparent',
                    color: '#FFD700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  🖨️ View Full Report in Browser & Print
                </button>
              </div>
            </div>

            {reportSuccessMsg && (
              <div style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10B981', borderRadius: '8px', color: '#6EE7B7', fontWeight: 600, fontSize: '0.9rem' }}>
                {reportSuccessMsg}
              </div>
            )}
          </section>

          {/* Report Interactive Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* 01: Core Kundli Charts */}
            <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#FCD34D', margin: 0 }}>01 प्रमुख कुंडलियां (Core Charts)</h3>
                <span className="badge-gold">D1, चंद्र व D9</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <NorthIndianChart kundli={kundli} width={300} height={300} />
                <div style={{ width: '100%', fontSize: '0.85rem', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B' }}>
                    <span>लग्न (Ascendant):</span>
                    <strong style={{ color: '#FFD700' }}>मकर (Capricorn 10° 25')</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1E293B' }}>
                    <span>चंद्र राशि (Moon Sign):</span>
                    <strong style={{ color: '#38BDF8' }}>कन्या (Virgo)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>नक्षत्र व चरण:</span>
                    <strong style={{ color: '#F8FAFC' }}>उत्तराफाल्गुनी (पाद 2 - सूर्य)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 02: 3 Pillars & Avakahada Chakra */}
            <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#FCD34D', margin: 0 }}>02 अवकहड़ा चक्र एवं तीन आधार स्तंभ</h3>
                <span className="badge-gold">पंचांग व मूल तत्व</span>
              </div>
              <table style={{ width: '100%', fontSize: '0.85rem', color: '#CBD5E1', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>वर्ण (Varna):</td><td style={{ fontWeight: 'bold', color: '#F8FAFC' }}>वैश्य (Vaishya)</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>वश्य (Vashya):</td><td>मानव / द्विपद</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>योनि (Yoni):</td><td>गौ (Cow)</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>गण (Gana):</td><td>मनुष्य (Manushya)</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>नाड़ी (Nadi):</td><td>आदि (Aadi)</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>पाया (Paya):</td><td style={{ color: '#A7F3D0', fontWeight: 'bold' }}>रजत / चाँदी (Silver)</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>नामाक्षर:</td><td style={{ color: '#F59E0B', fontWeight: 'bold' }}>टो / To</td></tr>
                  <tr style={{ borderBottom: '1px solid #1E293B' }}><td style={{ padding: '6px 0', color: '#94A3B8' }}>जन्म योग व करण:</td><td>अतिगण्ड / बव</td></tr>
                  <tr><td style={{ padding: '6px 0', color: '#94A3B8' }}>सूर्य राशि (पाश्चात्य):</td><td>कुंभ (Aquarius)</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: '12px', padding: '10px', background: '#090D16', borderRadius: '8px', fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                💡 <strong>लग्न स्तंभ (मकर):</strong> अदम्य संकल्प शक्ति, यथार्थवादी दृष्टि।<br/>
                💡 <strong>चंद्र स्तंभ (कन्या):</strong> सूक्ष्म विश्लेषणात्मक मेधा, परफेक्शनिस्ट स्वभाव।<br/>
                💡 <strong>नक्षत्र स्तंभ (उत्तराफाल्गुनी):</strong> समाज संरक्षण, नेतृत्व व उदारता।
              </div>
            </div>

            {/* 05 & 06: Love & Career Destiny */}
            <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#FCD34D', margin: 0 }}>05 व 06 विवाह व करियर मार्गदर्शन</h3>
                <span className="badge-gold">दाराकारक व अमात्यकारक</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#FCD34D', fontWeight: 'bold', marginBottom: '4px' }}>❤️ दाराकारक (जीवनसाथी प्रतिनिधि):</div>
                  <p style={{ color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                    जीवनसाथी समझदार, सेवाभावी, आध्यात्मिक सोच रखने वाला और शांत स्वभाव का होगा। विवाह उपरांत आर्थिक स्थिति में निरंतर समृद्धि होगी।
                  </p>
                  <div style={{ color: '#34D399', fontSize: '0.8rem', marginTop: '4px' }}>
                    अनुकूल विवाह काल: <strong>2026 - 2028 (गुरु व शुक्र की अनुकूल अंतरदशा)</strong>
                  </div>
                </div>

                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#38BDF8', fontWeight: 'bold', marginBottom: '4px' }}>💼 अमात्यकारक (करियर दिशा):</div>
                  <p style={{ color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                    बुध व शनि के प्रभाव से तकनीकी (IT/Software), कॉरपोरेट मैनेजमेंट, बैंकिंग/वित्त और डेटा एनालिटिक्स में सर्वोच्च सफलता के योग।
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.78rem' }}>
                    <span style={{ background: '#1E293B', padding: '2px 8px', borderRadius: '4px', color: '#4ADE80' }}>कॉरपोरेट: 88%</span>
                    <span style={{ background: '#1E293B', padding: '2px 8px', borderRadius: '4px', color: '#FCD34D' }}>बिज़नेस: 82%</span>
                    <span style={{ background: '#1E293B', padding: '2px 8px', borderRadius: '4px', color: '#60A5FA' }}>सरकारी: 78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 07 & 10: Chara Karakas, Manglik & Sade Sati */}
            <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#FCD34D', margin: 0 }}>07, 09 व 10 चर कारक, मांगलिक व साढ़े साती</h3>
                <span className="badge-gold">जैमिनी एवं कर्म चक्र</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090D16', borderRadius: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>मांगलिक स्थिति:</span>
                  <strong style={{ color: '#34D399' }}>आंशिक / प्रभावहीन (परिहार प्राप्त)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090D16', borderRadius: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>शनि साढ़े साती:</span>
                  <strong style={{ color: '#38BDF8' }}>वर्तमान में निष्क्रिय (राहत काल)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090D16', borderRadius: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>आगामी साढ़े साती:</span>
                  <strong style={{ color: '#FCD34D' }}>2036 से 2043 (सिंह, कन्या, तुला)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090D16', borderRadius: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>मूलांक व भाग्यांक:</span>
                  <strong style={{ color: '#FFD700' }}>मूलांक 1 (सूर्य) | भाग्यांक 5 (बुध)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090D16', borderRadius: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>सक्रिय विंशोत्तरी दशा:</span>
                  <strong style={{ color: '#FCD34D' }}>शनि महादशा - बुध अंतरदशा</strong>
                </div>
              </div>
            </div>

            {/* 16: Comprehensive Remedies */}
            <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#FCD34D', margin: 0 }}>16 संपूर्ण वैदिक उपाय एवं रत्न/रुद्राक्ष परामर्श</h3>
                <span className="badge-gold">जीवन उत्थान सूत्र</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #D4AF37' }}>
                  <strong style={{ color: '#FCD34D', display: 'block', marginBottom: '4px' }}>📿 पवित्र रुद्राक्ष: 7 मुखी रुद्राक्ष</strong>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '0.82rem' }}>शनिदेव व महालक्ष्मी का आशीर्वाद; आर्थिक स्थिरता, शारीरिक स्फूर्ति व आपदाओं से सुरक्षा।</p>
                </div>
                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                  <strong style={{ color: '#34D399', display: 'block', marginBottom: '4px' }}>💎 भाग्य रत्न: पन्ना (Emerald)</strong>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '0.82rem' }}>बुधवार को कनिष्ठिका उंगली में स्वर्ण/पंचधातु में धारण करें; तीक्ष्ण बुद्धि, धन व व्यापार में वृद्धि।</p>
                </div>
                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #38BDF8' }}>
                  <strong style={{ color: '#38BDF8', display: 'block', marginBottom: '4px' }}>🧘 इष्ट देव: माँ महालक्ष्मी व श्री हरि विष्णु</strong>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '0.82rem' }}>मंत्र: "ॐ श्रीं ह्रीं क्लीं श्री सिद्ध लक्ष्म्यै नमः"; नित्य 108 बार जप सर्व मनोरथ सिद्ध करता है।</p>
                </div>
                <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                  <strong style={{ color: '#F59E0B', display: 'block', marginBottom: '4px' }}>📜 यंत्र: श्री बुध यंत्र एवं श्री शनि यंत्र</strong>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '0.82rem' }}>ईशान कोण में स्थापित कर धूप-दीप व मंत्र जाप द्वारा जागृत रखें।</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* JANAM KUNDLI TAB */}
      {activeTab === 'kundli' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="grid-cols-2">
            {/* Left: Interactive Input Form with Date Picker, Clock Time Picker & Free Nominatim Place Autocomplete */}
            <div className="glass-card">
              <h2 style={{ fontSize: '1.4rem', color: '#FFD700', marginBottom: '16px' }}>✨ Calculate Birth Chart (Janam Kundli)</h2>
              <form onSubmit={handleGenerateKundli} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 1. Date Picker (Default DOB: 2002-02-01) */}
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>📅 Select Date of Birth (DOB)</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#090D16', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}
                  />
                </div>

                {/* 2. Interactive Clock Time Picker */}
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>⏰ Select Time of Birth (TOB - Clock)</label>
                  <input
                    type="time"
                    step="1"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#090D16', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}
                  />
                </div>

                {/* 3. Free Birthplace Search Autocomplete (OpenStreetMap Nominatim) */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>🔍 Search Birth Place (Free World Cities Autocomplete)</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchPlace(e.target.value)}
                    placeholder="Type city name e.g. Ajmer, Jaipur, Delhi..."
                    style={{ width: '100%', padding: '12px', background: '#090D16', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', color: '#FFF', fontSize: '0.95rem' }}
                  />
                  {isSearching && <span style={{ fontSize: '0.8rem', color: '#FFD700', position: 'absolute', right: '12px', top: '38px' }}>Searching...</span>}

                  {/* Nominatim Search Results Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0E131F', border: '1px solid #D4AF37', borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
                      {searchResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectPlace(item)}
                          style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F0' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#1A2333')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#0E131F')}
                        >
                          📍 {item.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resolved Lat/Lng Display */}
                <div style={{ fontSize: '0.8rem', color: '#4ADE80', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)' }}>
                  Selected Coordinates: Latitude {lat.toFixed(4)}°, Longitude {lng.toFixed(4)}°
                </div>

                <button type="submit" className="btn-gold" style={{ marginTop: '4px', padding: '14px', fontSize: '1rem' }}>
                  Generate Verified Kundli for {dob}
                </button>
              </form>
            </div>

            {/* Right: SVG Chart Renderer with D1 to D60 Divisional Charts Dropdown */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                
                {/* D1 to D60 Divisional Chart Selector Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#FFD700', fontWeight: 'bold' }}>Chart:</label>
                  <select
                    value={selectedDivChart}
                    onChange={(e) => setSelectedDivChart(e.target.value)}
                    style={{ padding: '6px 12px', background: '#090D16', border: '1px solid #D4AF37', borderRadius: '6px', color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <option value="D1">D1 - Rashi (Main Chart)</option>
                    <option value="D2">D2 - Hora (Wealth & Family)</option>
                    <option value="D3">D3 - Drekkana (Siblings)</option>
                    <option value="D4">D4 - Chaturthamsha (Assets)</option>
                    <option value="D7">D7 - Saptamsha (Children)</option>
                    <option value="D9">D9 - Navamsha (Spouse & Destiny)</option>
                    <option value="D10">D10 - Dashamsha (Career)</option>
                    <option value="D12">D12 - Dwadashamsha (Parents)</option>
                    <option value="D16">D16 - Shodashamsha (Vehicles)</option>
                    <option value="D20">D20 - Vimshamsha (Spiritual)</option>
                    <option value="D24">D24 - Chaturvimshamsha (Knowledge)</option>
                    <option value="D27">D27 - Bhamsa (Strengths)</option>
                    <option value="D30">D30 - Trimshamsha (Misfortunes)</option>
                    <option value="D40">D40 - Khavedamsha (Auspiciousness)</option>
                    <option value="D45">D45 - Akshavedamsha (Character)</option>
                    <option value="D60">D60 - Shashtiamsha (Past Karma)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setChartStyle('NORTH')} style={{ padding: '4px 10px', borderRadius: '6px', background: chartStyle === 'NORTH' ? '#D4AF37' : '#090D16', color: chartStyle === 'NORTH' ? '#000' : '#FFF', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>North Indian</button>
                  <button onClick={() => setChartStyle('SOUTH')} style={{ padding: '4px 10px', borderRadius: '6px', background: chartStyle === 'SOUTH' ? '#D4AF37' : '#090D16', color: chartStyle === 'SOUTH' ? '#000' : '#FFF', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>South Indian</button>
                </div>
              </div>

              {/* Render Active Divisional Chart (D1, D9, D10, D60) */}
              {chartStyle === 'NORTH' ? (
                <NorthIndianChart
                  kundli={kundli}
                  chartData={divisionalCharts.find((c) => c.chartType === selectedDivChart)}
                  width={340}
                  height={340}
                />
              ) : (
                <SouthIndianChart kundli={kundli} width={340} height={340} />
              )}
            </div>
          </section>

          {/* Planetary Longitudes & House Cusps Table */}
          <section className="glass-card">
            <h3 style={{ color: '#FFD700', marginBottom: '16px' }}>🪐 Planetary Positions & Sidereal Degrees ({dob})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#E2E8F0', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #D4AF37', textAlign: 'left', color: '#FFD700' }}>
                    <th style={{ padding: '10px' }}>Planet</th>
                    <th style={{ padding: '10px' }}>Degree</th>
                    <th style={{ padding: '10px' }}>Rashi</th>
                    <th style={{ padding: '10px' }}>House</th>
                    <th style={{ padding: '10px' }}>Nakshatra</th>
                    <th style={{ padding: '10px' }}>Pada</th>
                    <th style={{ padding: '10px' }}>Dignity</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {kundli.planets.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#FFF' }}>{p.planet} / {p.planetHindi || p.planet}</td>
                      <td style={{ padding: '10px' }}>{p.degreeInSign.toFixed(2)}°</td>
                      <td style={{ padding: '10px', color: '#FFD700' }}>{p.rashiName}</td>
                      <td style={{ padding: '10px' }}>House {p.house}</td>
                      <td style={{ padding: '10px' }}>{p.nakshatraName}</td>
                      <td style={{ padding: '10px' }}>{p.pada}</td>
                      <td style={{ padding: '10px', color: p.dignity === 'Exalted' ? '#4ADE80' : p.dignity === 'Debilitated' ? '#FF6B6B' : '#E2E8F0' }}>{p.dignity}</td>
                      <td style={{ padding: '10px' }}>{p.isRetrograde ? 'Retrograde (R)' : 'Direct'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detailed Graha-by-Graha Impact Section */}
          <section className="glass-card">
            <h3 style={{ color: '#FFD700', marginBottom: '16px' }}>🪐 Detailed Graha Impact & Vedic Guidance (हर ग्रह का विस्तृत प्रभाव)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {generateDetailedPlanetImpacts(kundli).map((pi, idx) => (
                <div key={idx} style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: '#FFD700', fontSize: '1.05rem', margin: 0 }}>{pi.planet}</h4>
                    <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '4px', background: pi.status.includes('Retrograde') ? '#FF6B6B' : '#4ADE80', color: '#000', fontWeight: 700 }}>
                      {pi.status.includes('Retrograde') ? 'वक्री (R)' : 'मार्गी'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>Rashi: <strong style={{ color: '#FFF' }}>{pi.rashi}</strong></span>
                    <span>House: <strong style={{ color: '#FFF' }}>House {pi.house}</strong></span>
                    <span>Nakshatra: <strong style={{ color: '#FFF' }}>{pi.nakshatra}</strong></span>
                    <span>Dignity: <strong style={{ color: pi.dignity === 'Exalted' || pi.dignity === 'Own' ? '#4ADE80' : pi.dignity === 'Debilitated' || pi.dignity === 'Enemy' ? '#FF6B6B' : '#FFF' }}>{pi.dignity}</strong></span>
                  </div>

                  <p style={{ color: '#E2E8F0', fontSize: '0.86rem', lineHeight: 1.5, marginTop: '4px', margin: 0, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #D4AF37' }}>
                    {pi.vedicImpact}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 👑 Comprehensive Raj Yoga & Royal Power Combinations Section */}
          {(() => {
            const allRajYogas = detectComprehensiveRajYogas(kundli);
            const filteredRajYogas = rajYogaCategoryFilter === 'ALL'
              ? allRajYogas
              : allRajYogas.filter((ry) => ry.category.toLowerCase().includes(rajYogaCategoryFilter.toLowerCase()));

            return (
              <section className="glass-card" style={{ border: '2px solid #D4AF37', background: 'radial-gradient(circle at 10% 20%, rgba(212,175,55,0.08) 0%, rgba(9,13,22,0.95) 90%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.6rem' }}>👑</span>
                      <h3 style={{ color: '#FFD700', fontSize: '1.35rem', margin: 0 }}>
                        सम्पूर्ण राजयोग महा-विश्लेषण (Comprehensive Raj Yoga Royal Analyzer)
                      </h3>
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      बृहत्पाराशर होरा शास्त्र के शास्त्रीय सिद्धांतों पर आधारित कुंडली में उपस्थित समस्त राजयोगों का विशद विश्लेषण।
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: '#D4AF37', color: '#000', fontWeight: 800, padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', boxShadow: '0 0 15px rgba(212,175,55,0.4)' }}>
                      ✨ {allRajYogas.length} राजयोग सक्रिय (Active Yogas)
                    </span>
                  </div>
                </div>

                {/* Raj Yoga Category Filters */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
                  {[
                    { id: 'ALL', label: `सभी राजयोग (${allRajYogas.length})` },
                    { id: 'Maha Raj Yoga', label: 'महा राजयोग (Supreme)' },
                    { id: 'Pancha Mahapurusha', label: 'पंच महापुरुष (5 Great)' },
                    { id: 'Kendra-Trikona', label: 'केंद्र-त्रिकोण राजयोग' },
                    { id: 'Vipareeta Raja Yoga', label: 'विपरीत राजयोग' },
                    { id: 'Dhana Raj Yoga', label: 'धन राजयोग' },
                    { id: 'Neechbhanga', label: 'नीचभंग राजयोग' },
                  ].map((cat) => {
                    const count = cat.id === 'ALL' ? allRajYogas.length : allRajYogas.filter((ry) => ry.category.toLowerCase().includes(cat.id.toLowerCase())).length;
                    const isActive = rajYogaCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setRajYogaCategoryFilter(cat.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: isActive ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.12)',
                          background: isActive ? '#D4AF37' : '#0E131F',
                          color: isActive ? '#000' : '#E2E8F0',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        {cat.label} {cat.id !== 'ALL' && `(${count})`}
                      </button>
                    );
                  })}
                </div>

                {/* Raj Yoga Cards Grid */}
                {filteredRajYogas.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', background: '#090D16', borderRadius: '10px' }}>
                    इस श्रेणी में कोई विशिष्ट योग वर्तमान ग्रहों के अंतर्गत नहीं है। कृपया "सभी राजयोग" चुनें।
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {filteredRajYogas.map((ry) => {
                      const isSupreme = ry.intensity.includes('Supreme');
                      return (
                        <div
                          key={ry.id}
                          style={{
                            background: '#090D16',
                            borderRadius: '12px',
                            border: isSupreme ? '1.5px solid #FFD700' : '1px solid rgba(212,175,55,0.35)',
                            boxShadow: isSupreme ? '0 4px 20px rgba(212,175,55,0.15)' : 'none',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px'
                          }}
                        >
                          <div>
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                              <div>
                                <div style={{ color: '#FFD700', fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3 }}>
                                  {ry.hindiName}
                                </div>
                                <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                                  {ry.name}
                                </div>
                              </div>
                              <span
                                style={{
                                  background: isSupreme ? 'linear-gradient(135deg, #FFD700, #D4AF37)' : '#10B981',
                                  color: '#000',
                                  fontWeight: 800,
                                  fontSize: '0.72rem',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {ry.intensity}
                              </span>
                            </div>

                            {/* Meta Badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px', fontSize: '0.75rem' }}>
                              <span style={{ background: 'rgba(212,175,55,0.15)', color: '#FFD700', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)' }}>
                                श्रेणी: {ry.category}
                              </span>
                              <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(74,222,128,0.3)' }}>
                                भाव: {ry.housesInvolved.map((h) => `H${h}`).join(', ')}
                              </span>
                              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#E2E8F0', padding: '2px 8px', borderRadius: '4px' }}>
                                संबंधित ग्रह: {ry.planetsInvolved.join(' + ')}
                              </span>
                            </div>

                            {/* Description */}
                            <p style={{ color: '#CBD5E1', fontSize: '0.84rem', lineHeight: 1.5, margin: 0, marginBottom: '10px' }}>
                              {ry.description}
                            </p>

                            {/* Specific Benefits */}
                            {ry.benefitsHindi && ry.benefitsHindi.length > 0 && (
                              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #FFD700' }}>
                                <div style={{ color: '#FFD700', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
                                  🌟 राजयोग के प्रत्यक्ष फल व आशीर्वाद:
                                </div>
                                <ul style={{ paddingLeft: '16px', color: '#E2E8F0', fontSize: '0.78rem', margin: 0 }}>
                                  {ry.benefitsHindi.map((b, bIdx) => (
                                    <li key={bIdx} style={{ marginBottom: '2px' }}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Footer Activation Timing */}
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.76rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>⏳ फलित काल:</span>
                            <span style={{ color: '#4ADE80', fontWeight: 600 }}>{ry.activationPeriod}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })()}

          {/* Vedic Dosha Analysis & Authentic Remedies Section */}
          {(() => {
            const doshas = detectVedicDoshasAndRemedies(kundli);
            return (
              <section className="glass-card" style={{ border: '1px solid #FF6B6B' }}>
                <h3 style={{ color: '#FF6B6B', marginBottom: '14px' }}>🔥 Vedic Dosha Analysis & Authentic Remedies (कुंडली के प्रमुख दोष व अचूक निवारण)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {doshas.map((d, idx) => (
                    <div key={idx} style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: d.intensity.includes('High') ? '1px solid #FF6B6B' : d.intensity.includes('Moderate') ? '1px solid #FFD700' : '1px solid rgba(74,222,128,0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: d.intensity.includes('High') ? '#FF6B6B' : '#FFD700', fontSize: '1.05rem', margin: 0 }}>{d.name}</h4>
                        <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '4px', background: d.intensity.includes('High') ? '#FF6B6B' : d.intensity.includes('Moderate') ? '#FFD700' : '#4ADE80', color: '#000', fontWeight: 700 }}>
                          {d.intensity}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        Planets Involved: <strong style={{ color: '#FFF' }}>{d.planetsInvolved.join(', ') || 'None'}</strong>
                      </div>

                      <p style={{ color: '#E2E8F0', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
                        {d.description}
                      </p>

                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #4ADE80', marginTop: '4px' }}>
                        <h5 style={{ color: '#4ADE80', fontSize: '0.82rem', marginBottom: '4px', margin: 0 }}>अचूक वैदिक निवारण व उपाय (Remedies):</h5>
                        <ul style={{ paddingLeft: '16px', color: '#E2E8F0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                          {d.remedies.map((rem, rIdx) => (
                            <li key={rIdx} style={{ marginBottom: '2px' }}>{rem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* 📊 Ashtakavarga & Sarvashtakavarga Strength Matrix Section */}
          {(() => {
            const av = calculateAshtakavarga(kundli);
            return (
              <section className="glass-card" style={{ border: '1px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ color: '#FFD700', margin: 0 }}>📊 Ashtakavarga Strength Matrix (अष्टकवर्ग व भिन्नाष्टकवर्ग)</h3>
                  <span style={{ background: '#D4AF37', color: '#000', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                    Total SAV: {av.totalSarvashtakavargaPoints} / 337 Pts
                  </span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '14px' }}>
                  12 भावों और 7 ग्रहों के भिन्नाष्टकवर्ग बिंदु। 28+ अंक वाले भाव अत्यधिक बलवान व लाभप्रद होते हैं।
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#E2E8F0', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #D4AF37', color: '#FFD700', textAlign: 'center' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>House / Rashi</th>
                        {av.houseStrengths.map((hs, idx) => (
                          <th key={idx} style={{ padding: '8px' }}>H{hs.house} ({hs.rashiName.split(' ')[0]})</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {av.bhinnaAshtakavarga.map((bav, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                          <td style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#FFD700' }}>{bav.planet} BAV</td>
                          {bav.pointsPerRashi.map((pts, pIdx) => (
                            <td key={pIdx} style={{ padding: '8px', color: pts >= 4 ? '#4ADE80' : '#FF6B6B' }}>{pts}</td>
                          ))}
                        </tr>
                      ))}
                      <tr style={{ borderTop: '2px solid #D4AF37', textAlign: 'center', fontWeight: 700 }}>
                        <td style={{ padding: '10px', textAlign: 'left', color: '#FFD700' }}>SAV (सर्वाष्टकवर्ग)</td>
                        {av.sarvashtakavarga.map((pts, idx) => (
                          <td key={idx} style={{ padding: '10px', color: pts >= 28 ? '#4ADE80' : pts >= 25 ? '#FFD700' : '#FF6B6B', fontSize: '0.95rem' }}>{pts}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {av.houseStrengths.map((hs, idx) => (
                    <div key={idx} style={{ background: '#090D16', padding: '10px', borderRadius: '6px', border: hs.points >= 28 ? '1px solid #4ADE80' : hs.points >= 25 ? '1px solid #FFD700' : '1px solid #FF6B6B' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFD700', fontWeight: 700, fontSize: '0.85rem' }}>
                        <span>House {hs.house} ({hs.rashiName})</span>
                        <span style={{ color: hs.points >= 28 ? '#4ADE80' : hs.points >= 25 ? '#FFD700' : '#FF6B6B' }}>{hs.points} Pts</span>
                      </div>
                      <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: '4px 0 0 0', lineHeight: 1.3 }}>{hs.guidance}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* 🎂 Varshphal / Solar Return Annual Chart Section */}
          {(() => {
            const birthYr = parseInt(dob.split('-')[0], 10) || 2002;
            const vp = calculateVarshphal(kundli, birthYr, varshphalYear);
            return (
              <section className="glass-card" style={{ border: '1px solid #4ADE80' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ color: '#4ADE80', margin: 0 }}>🎂 Varshphal / Annual Solar Return Chart (वर्षफल - ताजिक)</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Select Target Year:</span>
                    <select
                      value={varshphalYear}
                      onChange={(e) => setVarshphalYear(parseInt(e.target.value, 10))}
                      style={{ padding: '6px 12px', background: '#090D16', border: '1px solid #4ADE80', borderRadius: '6px', color: '#FFF', fontWeight: 700 }}
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                        <option key={yr} value={yr}>Year {yr} (Age {yr - birthYr})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>वर्षेश (Varsha Lord):</span>
                    <div style={{ color: '#4ADE80', fontSize: '1.2rem', fontWeight: 700 }}>{vp.varshaLord}</div>
                  </div>
                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.3)' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>मुन्था स्थान (Muntha House):</span>
                    <div style={{ color: '#FFD700', fontSize: '1.2rem', fontWeight: 700 }}>House {vp.munthaHouse} ({vp.munthaRashi.split(' ')[0]})</div>
                  </div>
                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>आयु (Age in Year):</span>
                    <div style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 700 }}>{vp.ageInYear} Years</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', borderLeft: '3px solid #4ADE80' }}>
                  <div style={{ color: '#FFF', fontSize: '0.88rem' }}><strong style={{ color: '#4ADE80' }}>करियर व कर्मफल:</strong> {vp.annualPredictions.careerOutlook}</div>
                  <div style={{ color: '#FFF', fontSize: '0.88rem' }}><strong style={{ color: '#FFD700' }}>आर्थिक स्थिति:</strong> {vp.annualPredictions.financialOutlook}</div>
                  <div style={{ color: '#FFF', fontSize: '0.88rem' }}><strong style={{ color: '#94A3B8' }}>स्वास्थ्य व सलाह:</strong> {vp.annualPredictions.healthOutlook} | {vp.annualPredictions.keyAdvice}</div>
                </div>
              </section>
            );
          })()}

          {/* ⏳ 4-Level Interactive Vimshottari Dasha Explorer (महादशा → अंतर्दशा → प्रत्यंतर्दशा → सूक्ष्मदशा) */}
          <section className="glass-card">
            <h3 style={{ color: '#FFD700', marginBottom: '12px' }}>⏳ 4-Level Vimshottari Dasha Explorer (महादशा → अंतर्दशा → प्रत्यंतर्दशा → सूक्ष्मदशा)</h3>
            <p style={{ color: '#94A3B8', marginBottom: '16px', fontSize: '0.85rem' }}>
              वर्तमान महादशा: <strong style={{ color: '#FFD700' }}>{dashaResult.currentMahadasha}</strong> | अंतर्दशा: <strong style={{ color: '#FFD700' }}>{dashaResult.currentAntardasha}</strong> | प्रत्यंतर्दशा: <strong style={{ color: '#4ADE80' }}>{dashaResult.currentPratyantardasha}</strong>
            </p>

            {/* Level 1: Mahadashas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {dashaResult.timeline.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => { setSelectedMahaIdx(idx); setSelectedAntarIdx(null); setSelectedPratIdx(null); }}
                  style={{
                    background: '#090D16', padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    border: selectedMahaIdx === idx ? '2px solid #FFD700' : d.planet === dashaResult.currentMahadasha ? '1px solid #4ADE80' : '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: d.planet === dashaResult.currentMahadasha ? '#FFD700' : '#FFF', fontSize: '0.88rem' }}>{d.planet} Mahadasha</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{d.startDate} to {d.endDate}</div>
                </div>
              ))}
            </div>

            {/* Level 2: Antardashas */}
            {selectedMahaIdx !== null && dashaResult.timeline[selectedMahaIdx]?.subPeriods && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', marginBottom: '16px' }}>
                <h4 style={{ color: '#FFD700', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {dashaResult.timeline[selectedMahaIdx].planet} Mahadasha → Antardashas (अंतर्दशाएँ):
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                  {dashaResult.timeline[selectedMahaIdx].subPeriods!.map((antar, aIdx) => (
                    <div
                      key={aIdx}
                      onClick={() => { setSelectedAntarIdx(aIdx); setSelectedPratIdx(null); }}
                      style={{
                        background: '#090D16', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
                        border: selectedAntarIdx === aIdx ? '2px solid #4ADE80' : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#4ADE80', fontSize: '0.82rem' }}>{antar.planet} Antardasha</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{antar.startDate} to {antar.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Level 3: Pratyantardashas */}
            {selectedMahaIdx !== null && selectedAntarIdx !== null && dashaResult.timeline[selectedMahaIdx]?.subPeriods?.[selectedAntarIdx]?.subPeriods && (
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
                <h4 style={{ color: '#4ADE80', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {dashaResult.timeline[selectedMahaIdx].subPeriods![selectedAntarIdx].planet} Antardasha → Pratyantardashas (प्रत्यंतर्दशाएँ):
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {dashaResult.timeline[selectedMahaIdx].subPeriods![selectedAntarIdx].subPeriods!.map((prat, pIdx) => (
                    <div key={pIdx} style={{ background: '#090D16', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.8rem' }}>{prat.planet} Pratyantar</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{prat.startDate} to {prat.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          <div className="grid-cols-2">
            {/* Ultra-Detailed Career Guidance Card */}
            {(() => {
              const career = predictCareerDetailsDeep(kundli);
              const detailedCareer = analyzeDetailedCareerByPlanets(kundli);
              return (
                <div className="glass-card" style={{ border: '1px solid #D4AF37', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#FFD700', fontSize: '1.2rem', margin: 0 }}>💼 Career & Planetary Stream Analysis (करियर व नवग्रह मार्गदर्शन)</h3>
                    <span style={{ background: '#4ADE80', color: '#000', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      Govt Job Prob: {career.govtProbability}%
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>
                    Sector: <span style={{ color: '#FFD700' }}>{career.sector}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#090D16', padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>⏰ प्रथम नौकरी (Timing):</span>
                      <div style={{ color: '#4ADE80', fontWeight: 700 }}>{career.firstJobAgeWindow}</div>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>🧭 कार्य स्थान (Direction):</span>
                      <div style={{ color: '#FFD700', fontWeight: 700 }}>{career.jobLocationDirection}</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '4px' }}>उपयुक्त कार्यक्षेत्र (Recommended Streams):</h4>
                    <ul style={{ paddingLeft: '18px', color: '#4ADE80', fontSize: '0.85rem', margin: 0 }}>
                      {career.recommendedStreams.map((st: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Planetary & Zodiac Sign Influence Details based on Kundli 10th House */}
                  <div style={{ background: 'rgba(212,175,55,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#FFD700', fontWeight: 700, marginBottom: '6px' }}>
                      🪐 मुख्य कारक ग्रह: {detailedCareer.primaryDominantPlanet} | ♈ 10th भाव राशि: {detailedCareer.tenthHouseRashi}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '8px' }}>
                      {detailedCareer.summary}
                    </div>

                    {detailedCareer.zodiacSignFields && (
                      <div style={{ background: '#090D16', padding: '8px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)', marginBottom: '6px', fontSize: '0.8rem' }}>
                        <span style={{ color: '#4ADE80', fontWeight: 700 }}>
                          {detailedCareer.zodiacSignFields.symbol} 10वें भाव की राशि ({detailedCareer.zodiacSignFields.rashiHindi} / {detailedCareer.zodiacSignFields.rashi}) - {detailedCareer.zodiacSignFields.element}:
                        </span>
                        <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '3px' }}>
                          • {detailedCareer.zodiacSignFields.domains.slice(0, 4).join(' • ')}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {detailedCareer.recommendedFields.map((rf: any, idx: number) => (
                        <div key={idx} style={{ background: '#0B0F19', padding: '6px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#4ADE80', fontWeight: 700 }}>{rf.symbol} {rf.planetHindi} ({rf.role}):</span>
                          <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '2px' }}>
                            • {rf.domains.slice(0, 3).join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.83rem', color: '#CBD5E1', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #D4AF37' }}>
                    <strong style={{ color: '#FFD700' }}>ज्योतिषीय कारण (Why):</strong> {career.astrologicalReason}
                  </div>

                  {/* Salary Increment & Promotion Timing Section */}
                  {(() => {
                    const promo = predictPromotionAndIncrementTiming(kundli, {
                      currentMahadasha: dashaResult.currentMahadasha,
                      currentAntardasha: dashaResult.currentAntardasha
                    });
                    return (
                      <div style={{ background: '#090D16', padding: '10px', borderRadius: '8px', border: '1px solid #4ADE80', marginTop: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.9rem' }}>🚀 Salary Increment & Promotion Timing (पदोन्नति व सैलरी वृद्धि)</span>
                          <span style={{ background: '#4ADE80', color: '#000', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                            Prob: {promo.promotionProbability}%
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ background: '#111625', padding: '6px 8px', borderRadius: '6px' }}>
                            <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>🎖️ अनुमानित पदोन्नति (Promotion Window):</span>
                            <div style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.83rem' }}>{promo.promotionWindow}</div>
                          </div>
                          <div style={{ background: '#111625', padding: '6px 8px', borderRadius: '6px' }}>
                            <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>💰 सैलरी वृद्धि (Increment & Hike):</span>
                            <div style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.83rem' }}>{promo.salaryIncrementWindow} ({promo.expectedHikePercent})</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                          <strong style={{ color: '#FFD700' }}>मुख्य गोचर व दशा ट्रिगर:</strong> {promo.keyTransitTriggers.join(' • ')}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Toggle 9-Planet & 12-Zodiac Career Reference Table Button */}
                  <button
                    onClick={() => setShowAllPlanetsCareer(!showAllPlanetsCareer)}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '4px'
                    }}
                  >
                    {showAllPlanetsCareer ? '🔼 करियर संदर्भ तालिका छिपाएं' : '📜 नवग्रह व राशि करियर गाइड (Planets & Zodiac Career Chart)'}
                  </button>

                  {/* 9 Planets & 12 Zodiac Career Reference Modal/Grid */}
                  {showAllPlanetsCareer && (
                    <div style={{ background: '#070A10', border: '1px solid #D4AF37', borderRadius: '8px', padding: '12px', marginTop: '6px' }}>
                      <h4 style={{ color: '#FFD700', fontSize: '0.95rem', margin: '0 0 10px 0', textAlign: 'center' }}>
                        🌌 How Planets Shape Your Career (ग्रहों के अनुसार करियर गाइड)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                        {Object.values(PLANET_CAREER_MAPPINGS).map((item: any, idx: number) => (
                          <div key={idx} style={{ background: '#111625', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.88rem' }}>
                                {idx + 1}. {item.symbol} {item.planetHindi} ({item.planet})
                              </span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: '#CBD5E1', fontSize: '0.8rem' }}>
                              {item.domainsHindi.map((d: string, dIdx: number) => (
                                <li key={dIdx}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Ultra-Detailed Marriage Guidance Card */}
            {(() => {
              const marriage = predictMarriageDetailsDeep(kundli);
              return (
                <div className="glass-card" style={{ border: '1px solid #FF6B6B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#FF6B6B', fontSize: '1.2rem' }}>❤️ Marriage & Relationship Analysis (विवाह भविष्यवाणी)</h3>
                    <span style={{ background: '#FF6B6B', color: '#FFF', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      Confidence: {marriage.confidence}%
                    </span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>
                    Type: <span style={{ color: '#FFD700' }}>{marriage.type}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#090D16', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,107,107,0.3)', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>⏰ विवाह आयु (Timing):</span>
                      <div style={{ color: '#FFD700', fontWeight: 700 }}>{marriage.marriageAgeWindow}</div>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>🧭 ससुराल दिशा (Direction):</span>
                      <div style={{ color: '#4ADE80', fontWeight: 700 }}>{marriage.spouseDirection}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8' }}>🤝 विवाह कौन करवाएगा (Facilitator):</span>
                    <div style={{ color: '#FFD700', fontWeight: 600 }}>{marriage.facilitatedBy}</div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                    <span style={{ color: '#94A3B8' }}>👨‍👩‍👧 कितने बच्चे होंगे (Children - D7):</span>
                    <div style={{ color: '#4ADE80', fontWeight: 600 }}>{marriage.childrenDetails}</div>
                  </div>

                  <div style={{ fontSize: '0.83rem', color: '#CBD5E1', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #FF6B6B' }}>
                    <strong style={{ color: '#FF6B6B' }}>जीवनसाथी स्वभाव व करियर:</strong> {marriage.spouseNature} ({marriage.spouseCareer})
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Interactive Astrological Q&A & Query Saver Box */}
          <section className="glass-card">
            <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>❓ Ask Kundli Questions & Query History (सवाल पूछें)</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '14px' }}>
              अपनी कुंडली के आधार पर कोई भी सवाल पूछें (जैसे: "मेरी सरकारी नौकरी कब लगेगी?", "मेरा विवाह किस उम्र में होगा?"). आपकी क्वेरी सेव होकर रियल-टाइम आंसर देगी!
            </p>
            <form onSubmit={handleAskAstrologyQuestion} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                value={userQueryInput}
                onChange={(e) => setUserQueryInput(e.target.value)}
                placeholder="Type your question e.g. Meri job kab lagegi? / Mera vivah kab hoga?"
                style={{ flex: 1, padding: '12px', background: '#090D16', border: '1px solid #D4AF37', borderRadius: '8px', color: '#FFF', fontSize: '0.95rem' }}
              />
              <button type="submit" className="btn-gold" style={{ padding: '12px 20px' }}>
                Ask Question (उत्तर पाएँ)
              </button>
            </form>

            {/* Saved Queries History */}
            {savedQueriesHistory.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Saved User Queries & Instant Answers (आपकी पूछी गई पूछताछ):</h4>
                {savedQueriesHistory.map((q, idx) => (
                  <div key={idx} style={{ background: '#090D16', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFD700', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>Q: {q.question}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{q.timestamp}</span>
                    </div>
                    <div style={{ color: '#E2E8F0', marginTop: '6px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {q.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AI Explanation Layer */}
          {featureFlags.ai_astrologer && (
            <section className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ color: '#FFD700' }}>🤖 AI Astrologer Chart Insights</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setAiLanguage('hi')} style={{ padding: '4px 8px', borderRadius: '4px', background: aiLanguage === 'hi' ? '#D4AF37' : '#090D16', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Hindi</button>
                  <button onClick={() => setAiLanguage('hinglish')} style={{ padding: '4px 8px', borderRadius: '4px', background: aiLanguage === 'hinglish' ? '#D4AF37' : '#090D16', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Hinglish</button>
                  <button onClick={() => setAiLanguage('en')} style={{ padding: '4px 8px', borderRadius: '4px', background: aiLanguage === 'en' ? '#D4AF37' : '#090D16', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>English</button>
                </div>
              </div>
              <button onClick={generateAiExplanation} className="btn-gold" style={{ width: '100%', marginBottom: '12px' }}>
                Generate Verified AI Interpretation
              </button>
              {aiExplanation && (
                <div style={{ background: '#090D16', padding: '16px', borderRadius: '8px', border: '1px solid #D4AF37', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {aiExplanation}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* NUMEROLOGY TAB */}
      {activeTab === 'numerology' && (
        (() => {
          const numResult = calculateNumerologyDetails(dob, numerologyNameInput);
          const vibrationResult = analyzeVibrationNumber(vibrationInput, numResult.mulank.number, numResult.bhagyank.number);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Header Card & Name Input */}
              <section className="glass-card" style={{ border: '2px solid #D4AF37', background: 'radial-gradient(circle at 10% 20%, rgba(212,175,55,0.08) 0%, rgba(9,13,22,0.95) 90%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.6rem' }}>🔢</span>
                      <h2 style={{ fontSize: '1.5rem', color: '#FFD700', margin: 0 }}>
                        सम्पूर्ण वैदिक व पाश्चात्य अंकशास्त्र (Advanced Numerology & Lo Shu System)
                      </h2>
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      चैल्डियन, पाइथागोरियन व 3x3 लो शू ग्रिड (Lo Shu Grid) पर आधारित महा-अंकशास्त्रीय विश्लेषण।
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0E131F', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>जन्म तिथि (DOB):</span>
                    <strong style={{ color: '#FFD700', fontSize: '1rem' }}>{dob}</strong>
                  </div>
                </div>

                {/* Name Input Bar for Live Namank & Soul Urge calculation */}
                <div style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <label style={{ color: '#FFD700', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✍️ अपना पूरा नाम दर्ज करें (Enter Full Name for Namank & Soul Urge):
                  </label>
                  <input
                    type="text"
                    value={numerologyNameInput}
                    onChange={(e) => setNumerologyNameInput(e.target.value)}
                    placeholder="e.g. Pankaj Sharma"
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '8px 12px',
                      background: '#0E131F',
                      border: '1px solid #D4AF37',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9rem'
                    }}
                  />
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                    (चैल्डियन व पाइथागोरस दोनों पद्धतियों से लाइव विश्लेषण)
                  </span>
                </div>
              </section>

              {/* 6 Core Master Numbers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {/* 1. Mulank (Driver) */}
                <div className="glass-card" style={{ border: '1.5px solid #FFD700', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>मूलांक (Driver / Root)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFD700', margin: '4px 0' }}>
                    {numResult.mulank.number}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.mulank.planetSymbol} {numResult.mulank.rulingPlanetHindi}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>जन्म तिथि से (Day of Birth)</div>
                </div>

                {/* 2. Bhagyank (Conductor) */}
                <div className="glass-card" style={{ border: '1.5px solid #4ADE80', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>भाग्यांक (Conductor / Destiny)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ADE80', margin: '4px 0' }}>
                    {numResult.bhagyank.number}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.bhagyank.planetSymbol} {numResult.bhagyank.rulingPlanetHindi}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>पूर्ण जन्म तिथि योग (Life Path)</div>
                </div>

                {/* 3. Chaldean Namank */}
                <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.4)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>चैल्डियन नामांक (Chaldean)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8', margin: '4px 0' }}>
                    {numResult.namank ? numResult.namank.number : '—'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.namank ? `${numResult.namank.planetSymbol} ${numResult.namank.rulingPlanetHindi}` : 'नाम दर्ज करें'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>प्राचीन वैदिक पद्धति</div>
                </div>

                {/* 4. Pythagorean Namank */}
                <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.4)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>पाइथागोरस नामांक (Expression)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A78BFA', margin: '4px 0' }}>
                    {numResult.pythagoreanNamank || '—'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.pythagoreanNamank ? `${NUMEROLOGY_PROFILES[numResult.pythagoreanNamank]?.rulingPlanetHindi || ''}` : 'नाम दर्ज करें'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>पाश्चात्य अभिव्यक्ति अंक</div>
                </div>

                {/* 5. Soul Urge Number */}
                <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.4)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>आत्म इच्छा अंक (Soul Urge)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F472B6', margin: '4px 0' }}>
                    {numResult.soulUrgeNumber || '—'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.soulUrgeNumber ? `${NUMEROLOGY_PROFILES[numResult.soulUrgeNumber]?.planetSymbol || ''} स्वर योग (Vowels)` : 'नाम दर्ज करें'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>हृदय की आंतरिक अभिलाषा</div>
                </div>

                {/* 6. Personality Number */}
                <div className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.4)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>व्यक्तित्व अंक (Personality)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24', margin: '4px 0' }}>
                    {numResult.personalityNumber || '—'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
                    {numResult.personalityNumber ? `${NUMEROLOGY_PROFILES[numResult.personalityNumber]?.planetSymbol || ''} व्यंजन योग (Consonants)` : 'नाम दर्ज करें'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>बाह्य सामाजिक छवि</div>
                </div>
              </div>

              {/* Driver & Conductor Harmony Matrix Card */}
              <section className="glass-card" style={{ border: '1px solid #D4AF37', background: '#090D16' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤝</span>
                      <h3 style={{ color: '#FFD700', fontSize: '1.15rem', margin: 0 }}>
                        मूलांक व भाग्यांक सामंजस्य विश्लेषण (Driver-Conductor Harmony Matrix)
                      </h3>
                      <span
                        style={{
                          background: numResult.harmony.relation.includes('मित्र') ? '#10B981' : numResult.harmony.relation.includes('शत्रु') ? '#EF4444' : '#F59E0B',
                          color: '#000',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {numResult.harmony.relation}
                      </span>
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, marginBottom: '8px' }}>
                      {numResult.harmony.analysisHindi}
                    </p>
                    <div style={{ color: '#4ADE80', fontSize: '0.82rem', fontWeight: 600 }}>
                      💡 जीवन सलाह: {numResult.harmony.synergyAdviceHindi}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', background: '#0E131F', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>सामंजस्य स्कोर (Harmony Score):</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: numResult.harmony.scorePercentage >= 80 ? '#4ADE80' : numResult.harmony.scorePercentage >= 60 ? '#FFD700' : '#FF6B6B' }}>
                      {numResult.harmony.scorePercentage}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                      {numResult.harmony.scorePercentage >= 80 ? 'अत्यंत उत्तम तालमेल' : 'संतुलन आवश्यक'}
                    </div>
                  </div>
                </div>
              </section>

              {/* 🌐 LO SHU GRID (लो शू ग्रिड - 3x3 Magic Square) & 8 PLANES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* 3x3 Visual Lo Shu Grid */}
                <section className="glass-card" style={{ border: '2px solid #D4AF37', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <h3 style={{ color: '#FFD700', fontSize: '1.2rem', margin: 0 }}>
                          ⛩️ लो शू ग्रिड (3x3 Lo Shu Magic Square)
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                          DOB ({dob}) + मूलांक ({numResult.mulank.number}) + भाग्यांक ({numResult.bhagyank.number})
                        </span>
                      </div>
                      {numResult.goldenRajYogPresent && (
                        <span style={{ background: 'linear-gradient(135deg, #FFD700, #D4AF37)', color: '#000', fontWeight: 800, fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px' }}>
                          ✨ 4-5-6 स्वर्ण राजयोग सक्रिय
                        </span>
                      )}
                    </div>

                    {/* 3x3 Grid Render */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', aspectRatio: '1/1', maxWidth: '340px', margin: '0 auto 16px auto' }}>
                      {numResult.loShuGrid.matrix.flat().map((cell, cIdx) => {
                        if (!cell) return null;
                        const isPresent = cell.count > 0;
                        const isUserBase = cell.number === numResult.mulank.number || cell.number === numResult.bhagyank.number;

                        return (
                          <div
                            key={cIdx}
                            style={{
                              background: isPresent
                                ? isUserBase
                                  ? 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(9,13,22,0.9) 100%)'
                                  : 'rgba(212,175,55,0.12)'
                                : '#07090E',
                              border: isPresent
                                ? isUserBase
                                  ? '2px solid #FFD700'
                                  : '1px solid rgba(212,175,55,0.5)'
                                : '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '8px',
                              boxShadow: isPresent ? '0 0 10px rgba(212,175,55,0.15)' : 'none',
                              position: 'relative'
                            }}
                          >
                            <span style={{ fontSize: '0.68rem', color: '#94A3B8', position: 'absolute', top: 4, left: 6 }}>
                              {cell.direction.split(' ')[0]}
                            </span>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isPresent ? '#FFD700' : '#475569', letterSpacing: '2px' }}>
                              {cell.display}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: isPresent ? '#4ADE80' : '#64748B', marginTop: '2px', textAlign: 'center' }}>
                              {cell.rulingPlanet.split(' ')[0]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: '#07090E', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                    📌 <strong>ग्रिड नियम:</strong> ऊपरी पंक्ति (4-9-2), मध्य पंक्ति (3-5-7), निचली पंक्ति (8-1-6)। सुनहरे अंक जातक की कुंडली में उपस्थित ऊर्जा को दर्शाते हैं।
                  </div>
                </section>

                {/* 8 Lo Shu Planes Analysis */}
                <section className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.35)' }}>
                  <h3 style={{ color: '#FFD700', fontSize: '1.2rem', marginBottom: '12px' }}>
                    🌐 लो शू ग्रिड के 8 तल (8 Planes of Success & Will Power)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                    {numResult.loShuPlanes.map((plane, pIdx) => {
                      const isGolden = plane.numbers.join('-') === '4-5-6';
                      const isSilver = plane.numbers.join('-') === '2-5-8';

                      return (
                        <div
                          key={pIdx}
                          style={{
                            background: '#090D16',
                            border: isGolden && plane.isComplete
                              ? '1.5px solid #FFD700'
                              : isSilver && plane.isComplete
                              ? '1.5px solid #4ADE80'
                              : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            padding: '10px 12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ color: isGolden ? '#FFD700' : isSilver ? '#4ADE80' : '#FFF', fontSize: '0.88rem' }}>
                              {isGolden ? '👑 ' : isSilver ? '🥈 ' : '🔹 '} {plane.hindiName}
                            </strong>
                            <span
                              style={{
                                background: plane.isComplete ? '#10B981' : plane.percentage >= 66 ? '#D97706' : '#1E293B',
                                color: plane.isComplete ? '#000' : '#E2E8F0',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              {plane.isComplete ? '100% पूर्ण (Active)' : `${plane.percentage}% सक्रिय`}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ flex: 1, height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${plane.percentage}%`, height: '100%', background: isGolden ? '#FFD700' : isSilver ? '#4ADE80' : '#38BDF8', transition: 'width 0.3s' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                              उपस्थित: {plane.presentNumbers.join(', ') || 'कोई नहीं'}
                            </span>
                          </div>

                          <p style={{ color: '#CBD5E1', fontSize: '0.78rem', margin: 0, lineHeight: 1.35 }}>
                            {plane.meaningHindi}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* ⚠️ MISSING NUMBERS & AUTHENTIC VEDIC REMEDIES */}
              <section className="glass-card" style={{ border: '1px solid #FF6B6B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ color: '#FF6B6B', fontSize: '1.25rem', margin: 0 }}>
                      ⚠️ अनुपस्थित अंक व अचूक निवारण (Missing Numbers & Authentic Vedic Remedies)
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      लो शू ग्रिड में जो अंक अनुपस्थित हैं, उनके प्रभावों को संतुलित करने के लिए लाल किताब व वैदिक उपाय।
                    </p>
                  </div>
                  <span style={{ background: '#EF4444', color: '#FFF', fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px' }}>
                    {numResult.missingNumbers.length} अंक अनुपस्थित
                  </span>
                </div>

                {numResult.missingNumbers.length === 0 ? (
                  <div style={{ padding: '16px', background: '#090D16', borderRadius: '8px', color: '#4ADE80', textAlign: 'center' }}>
                    🎉 अद्भुत! आपकी जन्म तिथि में कोई भी अंक अनुपस्थित नहीं है। सभी 9 ग्रहों की ऊर्जाएं सक्रिय हैं।
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {numResult.missingNumbers.map((m) => (
                      <div key={m.number} style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,107,107,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#FF6B6B', fontWeight: 800, fontSize: '1rem' }}>
                            अंक {m.number} की कमी ({m.rulingPlanetHindi})
                          </span>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', padding: '2px 6px', borderRadius: '4px' }}>
                            Missing {m.number}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                          <strong>प्रभाव:</strong> {m.missingTraitsHindi}
                        </div>
                        <div style={{ background: '#0E131F', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #4ADE80', marginTop: '4px' }}>
                          <div style={{ color: '#4ADE80', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>
                            अचूक उपाय (Remedies):
                          </div>
                          <ul style={{ paddingLeft: '14px', color: '#E2E8F0', fontSize: '0.75rem', margin: 0 }}>
                            {m.remedies.map((rem, rIdx) => (
                              <li key={rIdx} style={{ marginBottom: '2px' }}>{rem}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 🔁 REPEATED NUMBERS IMPACT */}
              {numResult.repeatedNumbers.length > 0 && (
                <section className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                  <h3 style={{ color: '#FFD700', fontSize: '1.2rem', marginBottom: '12px' }}>
                    🔁 दोहराए गए अंकों का प्रभाव (Repeated Numbers Impact Analysis)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {numResult.repeatedNumbers.map((rep) => (
                      <div key={rep.number} style={{ background: '#090D16', padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ color: '#FFD700', fontSize: '0.9rem' }}>
                            अंक {rep.number} ({rep.count} बार दोहराव)
                          </strong>
                          <span style={{ background: 'rgba(212,175,55,0.15)', color: '#FFD700', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                            {rep.count}x Frequency
                          </span>
                        </div>
                        <p style={{ color: '#CBD5E1', fontSize: '0.8rem', margin: 0, marginBottom: '6px', lineHeight: 1.35 }}>
                          {rep.impactHindi}
                        </p>
                        <div style={{ color: '#4ADE80', fontSize: '0.74rem' }}>
                          💡 <strong>संतुलन उपाय:</strong> {rep.guidanceHindi}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 📱 INTERACTIVE LIVE VIBRATION ANALYZER (Mobile / Vehicle / House / Bank Account) */}
              <section className="glass-card" style={{ border: '2px solid #38BDF8', background: 'radial-gradient(circle at 10% 20%, rgba(56,189,248,0.06) 0%, rgba(9,13,22,0.95) 90%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem' }}>📱</span>
                      <h3 style={{ color: '#38BDF8', fontSize: '1.25rem', margin: 0 }}>
                        मोबाइल, गाड़ी, घर व बैंक खाता अंक परीक्षक (Interactive Vibration Checker)
                      </h3>
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      कोई भी मोबाइल नंबर, वाहन नंबर (जैसे RJ14CV1234) अथवा फ्लैट नंबर दर्ज कर अपने मूलांक व भाग्यांक से अनुकूलता जाँचें।
                    </p>
                  </div>
                </div>

                {/* Input Controls */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {/* Category Buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { id: 'mobile', label: '📞 मोबाइल नंबर' },
                      { id: 'vehicle', label: '🚗 गाड़ी नंबर' },
                      { id: 'house', label: '🏠 फ्लैट/घर' },
                      { id: 'custom', label: '💳 बैंक/अन्य' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setVibrationCategory(btn.id as any);
                          if (btn.id === 'mobile') setVibrationInput('9876543210');
                          else if (btn.id === 'vehicle') setVibrationInput('RJ 14 CV 1234');
                          else if (btn.id === 'house') setVibrationInput('402');
                          else setVibrationInput('5010023456');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: vibrationCategory === btn.id ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                          background: vibrationCategory === btn.id ? '#0284C7' : '#0E131F',
                          color: '#FFF',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={vibrationInput}
                    onChange={(e) => setVibrationInput(e.target.value)}
                    placeholder="Enter number or text e.g. 9829012345 or DL 01 AB 9999"
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '10px 14px',
                      background: '#090D16',
                      border: '1.5px solid #38BDF8',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '1rem',
                      fontWeight: 700
                    }}
                  />
                </div>

                {/* Vibration Result Card */}
                <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{vibrationResult.planetSymbol}</span>
                      <strong style={{ color: '#38BDF8', fontSize: '1.1rem' }}>
                        एकल अंक (Root Number): {vibrationResult.rootNumber} ({vibrationResult.rulingPlanetHindi})
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        (योग: {vibrationResult.compoundSum} ➔ {vibrationResult.rootNumber})
                      </span>
                    </div>

                    <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                      {vibrationResult.verdictHindi}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                      <span style={{ background: 'rgba(212,175,55,0.15)', color: '#FFD700', padding: '2px 8px', borderRadius: '4px' }}>
                        मूलांक ({numResult.mulank.number}) अनुकूलता: {vibrationResult.compatibilityWithMulank}
                      </span>
                      <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '2px 8px', borderRadius: '4px' }}>
                        भाग्यांक ({numResult.bhagyank.number}) अनुकूलता: {vibrationResult.compatibilityWithBhagyank}
                      </span>
                    </div>

                    <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '8px' }}>
                      📌 <strong>सुझाव:</strong> {vibrationResult.recommendation}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', background: '#0E131F', padding: '14px 20px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.4)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>अनुकूलता स्कोर (Score):</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: vibrationResult.overallScore >= 80 ? '#4ADE80' : vibrationResult.overallScore >= 60 ? '#FFD700' : '#FF6B6B' }}>
                      {vibrationResult.overallScore}%
                    </div>
                    <span
                      style={{
                        background: vibrationResult.overallScore >= 80 ? '#10B981' : vibrationResult.overallScore >= 60 ? '#D97706' : '#EF4444',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {vibrationResult.overallScore >= 80 ? 'अत्यंत शुभ' : vibrationResult.overallScore >= 60 ? 'सामान्य' : 'अशुभ'}
                    </span>
                  </div>
                </div>
              </section>

              {/* 📅 PERSONAL TIME CYCLES (Year, Month, Day) */}
              <section className="glass-card" style={{ border: '1px solid #4ADE80' }}>
                <h3 style={{ color: '#4ADE80', fontSize: '1.2rem', marginBottom: '14px' }}>
                  📅 व्यक्तिगत समय चक्र (Personal Year, Month & Day Cycles)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Year */}
                  <div style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>वर्तमान वर्ष चक्र (Personal Year):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ADE80', margin: '4px 0' }}>
                      वर्ष {numResult.timeCycles.personalYear}
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                      {numResult.timeCycles.personalYearTheme}
                    </p>
                  </div>

                  {/* Month */}
                  <div style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>वर्तमान माह चक्र (Personal Month):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8', margin: '4px 0' }}>
                      माह {numResult.timeCycles.personalMonth}
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                      {numResult.timeCycles.personalMonthTheme}
                    </p>
                  </div>

                  {/* Day */}
                  <div style={{ background: '#090D16', padding: '14px', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>आज का दिन चक्र (Personal Day):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFD700', margin: '4px 0' }}>
                      दिन {numResult.timeCycles.personalDay}
                    </div>
                    <p style={{ color: '#CBD5E1', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                      {numResult.timeCycles.personalDayTheme}
                    </p>
                  </div>
                </div>
              </section>

              {/* 🧭 LUCKY COMPASS & VASTU (लकी कम्पास व वास्तु) */}
              <section className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.35)' }}>
                <h3 style={{ color: '#FFD700', fontSize: '1.2rem', marginBottom: '14px' }}>
                  🧭 लकी कम्पास व वास्तु संरेखण (Lucky Compass, Colors, Days & Vastu)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>🌟 शुभ व मित्र अंक (Lucky Numbers):</div>
                    <div style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 700 }}>
                      {numResult.luckyCompass.friendlyNumbers.join(', ')} (मूल: {numResult.mulank.number}, {numResult.bhagyank.number})
                    </div>
                  </div>

                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#FF6B6B', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>⚠️ शत्रु व बचाव योग्य अंक (Avoid Numbers):</div>
                    <div style={{ fontSize: '0.95rem', color: '#FF6B6B', fontWeight: 700 }}>
                      {numResult.luckyCompass.enemyNumbers.join(', ') || 'कोई नहीं'}
                    </div>
                  </div>

                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>🧭 लकी वास्तु दिशाएं (Lucky Directions):</div>
                    <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                      {numResult.luckyCompass.luckyDirections.join(' • ')}
                    </div>
                  </div>

                  <div style={{ background: '#090D16', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>🎨 लकी रंग व रत्न (Colors & Gems):</div>
                    <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                      रंग: {numResult.luckyCompass.luckyColors.slice(0, 3).join(', ')} | रत्न: {numResult.luckyCompass.luckyGemstones.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </section>

              {/* Master 1 to 9 Reference Grid */}
              <section className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                <h3 style={{ color: '#FFD700', fontSize: '1.1rem', marginBottom: '12px', textAlign: 'center' }}>
                  🌐 अंक 1 से 9 स्वामी व करियर संदर्भ तालिका (Universal Numbers 1-9 Grid)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const prof = NUMEROLOGY_PROFILES?.[n];
                    if (!prof) return null;
                    const isUserNum = n === numResult.mulank?.number || n === numResult.bhagyank?.number;
                    return (
                      <div key={n} style={{ background: isUserNum ? 'rgba(212,175,55,0.15)' : '#090D16', border: isUserNum ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.06)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.9rem' }}>
                            {prof.planetSymbol} अंक {n} ({prof.rulingPlanetHindi})
                          </span>
                          {isUserNum && <span style={{ background: '#4ADE80', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>आपका अंक</span>}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '4px' }}>{prof.title}</div>
                        <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                          • {prof.careerRecommendationsHindi.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          );
        })()
      )}

      {/* 36 GUNA MATCHING TAB */}
      {activeTab === 'matching' && (
        <section className="glass-card">
          <h2 style={{ fontSize: '1.4rem', color: '#FFD700', marginBottom: '8px' }}>❤️ 36 Guna Ashtakoota Kundli Matching</h2>
          <p style={{ color: '#94A3B8', marginBottom: '20px' }}>Calculate compatibility score, Manglik Dosha, Nadi & Bhakoot exceptions.</p>

          <button onClick={handleMatchCalculation} className="btn-gold" style={{ marginBottom: '24px' }}>
            Run Ashtakoota Compatibility Check
          </button>

          {matchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '20px', background: '#090D16', borderRadius: '12px', border: '1px solid #D4AF37', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.2rem', color: matchResult.isCompatible ? '#4ADE80' : '#FF6B6B' }}>
                  {matchResult.totalScore} / 36 Gunas
                </h3>
                <p style={{ color: '#E2E8F0', marginTop: '8px' }}>{matchResult.manglikAnalysis.summary}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  matchResult.varna, matchResult.vashya, matchResult.tara, matchResult.yoni,
                  matchResult.grahaMaitri, matchResult.gana, matchResult.bhakoot, matchResult.nadi
                ].map((koot, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{koot.name}</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFD700' }}>{koot.score} / {koot.max}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* DAILY PANCHANG TAB */}
      {activeTab === 'panchang' && (
        <section className="glass-card">
          <h2 style={{ fontSize: '1.4rem', color: '#FFD700', marginBottom: '16px' }}>📅 Daily Location-Based Panchang & Shubh Muhurat</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Hindu Month (Masa)</span>
              <h3 style={{ color: '#FFD700', marginTop: '4px' }}>{panchang.masa.name} Masa</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Purnimanta: {panchang.masa.purnimantaName} | Amanta: {panchang.masa.amantaName}</p>
            </div>
            <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Tithi</span>
              <h3 style={{ color: '#FFD700', marginTop: '4px' }}>{panchang.tithi.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#4ADE80', marginTop: '4px' }}>{panchang.tithi.completionPercent}% Completed</p>
            </div>
            <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Nakshatra</span>
              <h3 style={{ color: '#FFD700', marginTop: '4px' }}>{panchang.nakshatra.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Pada {panchang.nakshatra.pada} | Lord: {panchang.nakshatra.lord}</p>
            </div>
            <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Yoga</span>
              <h3 style={{ color: '#FFD700', marginTop: '4px' }}>{panchang.yoga.name}</h3>
            </div>
            <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Karana</span>
              <h3 style={{ color: '#FFD700', marginTop: '4px' }}>{panchang.karana.name}</h3>
            </div>
          </div>
        </section>
      )}

      {/* ASTROLOGERS MARKETPLACE TAB */}
      {activeTab === 'astrologers' && (
        <section className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#FFD700' }}>🧙 Live Astrologer Marketplace</h2>
            <span className="badge-gold">🟢 2 Astrologers Online</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { id: '1', name: 'Acharya Devraj', exp: '15 Years', rating: '4.95', rate: '₹25/min', spec: 'Vedic, Kundli, Career' },
              { id: '2', name: 'Pandit Ramesh Shastri', exp: '20 Years', rating: '4.98', rate: '₹35/min', spec: 'Matchmaking, Dosha Remedies' },
            ].map((astro) => (
              <div key={astro.id} style={{ background: '#090D16', padding: '20px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#FFF' }}>{astro.name}</h3>
                  <span style={{ color: '#FFD700', fontWeight: 700 }}>★ {astro.rating}</span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Experience: {astro.exp} | {astro.spec}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '1.1rem' }}>{astro.rate}</span>
                  <button onClick={() => setActiveChatAstro(astro.name)} className="btn-gold">Start Instant Chat</button>
                </div>
              </div>
            ))}
          </div>

          {/* Instant Chat Modal */}
          {activeChatAstro && (
            <div style={{ position: 'fixed', bottom: 20, right: 20, width: 340, height: 420, background: '#0E131F', border: '1px solid #D4AF37', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: 8 }}>
                  <strong style={{ color: '#FFD700' }}>Chat with {activeChatAstro}</strong>
                  <button onClick={() => setActiveChatAstro(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#94A3B8' }}>
                  <p style={{ background: '#07090E', padding: 8, borderRadius: 6, marginBottom: 8 }}>Namaste! Main {activeChatAstro} hoon. Aapki Kundli ka kya prashna hai?</p>
                </div>
              </div>
              <input type="text" placeholder="Type your message..." style={{ width: '100%', padding: '10px', background: '#07090E', border: '1px solid #D4AF37', borderRadius: '8px', color: '#FFF' }} />
            </div>
          )}
        </section>
      )}

      {/* ADMIN PANEL TAB */}
      {activeTab === 'admin' && (
        <section className="glass-card">
          <h2 style={{ fontSize: '1.4rem', color: '#FFD700', marginBottom: '16px' }}>⚙️ Admin Feature Flags & App Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {Object.entries(featureFlags).map(([key, enabled]) => (
              <div key={key} style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#FFF', fontWeight: 600, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>
                <button
                  onClick={() => setFeatureFlags((prev) => ({ ...prev, [key]: !enabled }))}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 700, background: enabled ? '#4ADE80' : '#FF6B6B', color: '#000' }}
                >
                  {enabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
