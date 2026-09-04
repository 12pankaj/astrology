'use client';

import React, { useState, useEffect } from 'react';
import { calculateKundli, calculateDailyPanchang, calculateAshtakootaMatching, calculateDivisionalCharts, calculateVimshottariDasha, D1_D60_EXPLANATIONS, predictMarriageDetails, predictCareerDetails, predictMarriageDetailsDeep, predictCareerDetailsDeep, getDivisionalChartDeepExplanation, generateDetailedPlanetImpacts, detectStelliumsAndYogas, detectVedicDoshasAndRemedies, calculateAshtakavarga, calculateVarshphal, analyzeDetailedCareerByPlanets, PLANET_CAREER_MAPPINGS, ZODIAC_CAREER_MAPPINGS, predictPromotionAndIncrementTiming, calculateNumerologyDetails } from '@vedic-astro/astrology-engine';
import { NorthIndianChart, SouthIndianChart } from '@vedic-astro/ui';
import { KundliData, PanchangData, AshtakootaMatchingResult, DivisionalChart, VimshottariDashaResult } from '@vedic-astro/types';

export default function HomePage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kundli' | 'predictions' | 'numerology' | 'matching' | 'panchang' | 'astrologers' | 'admin'>('dashboard');

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

          {/* Vedic Yogas & Multi-Planet Conjunctions Section */}
          {(() => {
            const yogas = detectStelliumsAndYogas(kundli);
            if (yogas.length === 0) return null;
            return (
              <section className="glass-card" style={{ border: '1px solid #D4AF37' }}>
                <h3 style={{ color: '#FFD700', marginBottom: '14px' }}>✨ Major Vedic Yogas & Multi-Planet Yuti (राजयोग व बहुग्रह युति)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {yogas.map((y, idx) => (
                    <div key={idx} style={{ background: '#090D16', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h4 style={{ color: '#FFD700', fontSize: '0.98rem', margin: 0 }}>{y.name}</h4>
                        <span style={{ background: '#4ADE80', color: '#000', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          House {y.house}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '6px' }}>
                        Planets Involved: <strong style={{ color: '#FFF' }}>{y.planetsInvolved.join(' + ')}</strong>
                      </div>
                      <p style={{ color: '#E2E8F0', fontSize: '0.84rem', lineHeight: 1.4, margin: 0 }}>
                        {y.description}
                      </p>
                    </div>
                  ))}
                </div>
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
          const numResult = calculateNumerologyDetails(dob, searchQuery);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <section className="glass-card" style={{ border: '1px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="badge-gold">Chaldean & Vedic Numerology (अंकशास्त्र)</span>
                    <h2 style={{ fontSize: '1.6rem', color: '#FFD700', marginTop: '6px' }}>
                      🔢 Numerology Report for {dob}
                    </h2>
                    <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginTop: '4px' }}>
                      {numResult.compatibilitySummary}
                    </p>
                  </div>
                  <div style={{ background: '#090D16', padding: '12px 18px', borderRadius: '10px', border: '1px solid #4ADE80' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>📅 Personal Year Number (वर्तमान वर्ष):</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ADE80' }}>
                      Personal Year {numResult.personalYearNumber}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '2px' }}>
                      {numResult.personalYearForecast}
                    </div>
                  </div>
                </div>
              </section>

              {/* 2 Numbers Grid: Mulank & Bhagyank */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Mulank Card */}
                <div className="glass-card" style={{ border: '1px solid #FFD700' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: '#FFD700', fontSize: '1.2rem', margin: 0 }}>
                      {numResult.mulank.planetSymbol} मूलांक {numResult.mulank.number} (Mulank / Driver)
                    </h3>
                    <span style={{ background: '#FFD700', color: '#000', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {numResult.mulank.rulingPlanetHindi} ({numResult.mulank.rulingPlanet})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#FFF', fontWeight: 700, marginBottom: '8px' }}>
                    {numResult.mulank.title}
                  </div>
                  <div style={{ fontSize: '0.83rem', color: '#CBD5E1', marginBottom: '10px' }}>
                    <strong>विशेष गुण:</strong> {numResult.mulank.traitsHindi.join(', ')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.8rem', background: '#090D16', padding: '8px', borderRadius: '6px' }}>
                    <div><span style={{ color: '#94A3B8' }}>🎨 लकी रंग:</span> <span style={{ color: '#4ADE80' }}>{numResult.mulank.luckyColors.join(', ')}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>💎 लकी रत्न:</span> <span style={{ color: '#FFD700' }}>{numResult.mulank.luckyGems.join(', ')}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>📅 लकी तिथियां:</span> <span style={{ color: '#FFF' }}>{numResult.mulank.luckyDates.join(', ')}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>🗓️ लकी दिन:</span> <span style={{ color: '#4ADE80' }}>{numResult.mulank.luckyDays.join(', ')}</span></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.82rem' }}>
                    <strong style={{ color: '#4ADE80' }}>अनुकूल कार्यक्षेत्र (Career):</strong>
                    <ul style={{ paddingLeft: '16px', color: '#CBD5E1', margin: '4px 0 0 0' }}>
                      {numResult.mulank.careerRecommendationsHindi.slice(0, 3).map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bhagyank Card */}
                <div className="glass-card" style={{ border: '1px solid #4ADE80' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: '#4ADE80', fontSize: '1.2rem', margin: 0 }}>
                      {numResult.bhagyank.planetSymbol} भाग्यांक {numResult.bhagyank.number} (Bhagyank / Life Path)
                    </h3>
                    <span style={{ background: '#4ADE80', color: '#000', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {numResult.bhagyank.rulingPlanetHindi} ({numResult.bhagyank.rulingPlanet})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#FFF', fontWeight: 700, marginBottom: '8px' }}>
                    {numResult.bhagyank.title}
                  </div>
                  <div style={{ fontSize: '0.83rem', color: '#CBD5E1', marginBottom: '10px' }}>
                    <strong>विशेष गुण:</strong> {numResult.bhagyank.traitsHindi.join(', ')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.8rem', background: '#090D16', padding: '8px', borderRadius: '6px' }}>
                    <div><span style={{ color: '#94A3B8' }}>🤝 मित्र अंक:</span> <span style={{ color: '#4ADE80' }}>{numResult.bhagyank.compatibleNumbers.join(', ')}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>⚠️ शत्रु अंक:</span> <span style={{ color: '#FF6B6B' }}>{numResult.bhagyank.enemyNumbers.join(', ') || 'कोई नहीं'}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>🎨 लकी रंग:</span> <span style={{ color: '#4ADE80' }}>{numResult.bhagyank.luckyColors.slice(0, 2).join(', ')}</span></div>
                    <div><span style={{ color: '#94A3B8' }}>💎 लकी रत्न:</span> <span style={{ color: '#FFD700' }}>{numResult.bhagyank.luckyGems.join(', ')}</span></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.82rem' }}>
                    <strong style={{ color: '#4ADE80' }}>जीवन पथ व सफलता के क्षेत्र:</strong>
                    <ul style={{ paddingLeft: '16px', color: '#CBD5E1', margin: '4px 0 0 0' }}>
                      {numResult.bhagyank.careerRecommendationsHindi.slice(0, 3).map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Master Numerology Numbers 1 to 9 Reference Grid */}
              <section className="glass-card" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                <h3 style={{ color: '#FFD700', fontSize: '1.1rem', marginBottom: '12px', textAlign: 'center' }}>
                  🌐 Numerology Numbers 1 to 9 Planet & Career Reference Grid (अंक 1 से 9 स्वामी व करियर)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const prof = NUMEROLOGY_PROFILES[n];
                    const isUserNum = n === numResult.mulank.number || n === numResult.bhagyank.number;
                    return (
                      <div key={n} style={{ background: isUserNum ? 'rgba(212,175,55,0.15)' : '#090D16', border: isUserNum ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.9rem' }}>
                            {prof.planetSymbol} अंक {n} ({prof.rulingPlanetHindi})
                          </span>
                          {isUserNum && <span style={{ background: '#4ADE80', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>आपका अंक</span>}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>{prof.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
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
