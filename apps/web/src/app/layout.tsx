import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Vedic Astro - High-Precision Jyotish & Astrologer Platform',
  description: 'Enterprise Vedic Astrology Platform providing accurate Kundli, Shodashvarga D1-D60, Vimshottari Dasha, 36 Guna Ashtakoota Matching, Panchang, and Live Astrologer Consultations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7, 9, 14, 0.8)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🕉️</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFD700, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VEDIC ASTRO
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '24px', fontWeight: 600 }}>
            <a href="/" style={{ color: '#FFD700', textDecoration: 'none' }}>Home</a>
            <a href="#kundli" style={{ color: '#94A3B8', textDecoration: 'none' }}>Kundli</a>
            <a href="#panchang" style={{ color: '#94A3B8', textDecoration: 'none' }}>Panchang</a>
            <a href="#matching" style={{ color: '#94A3B8', textDecoration: 'none' }}>36 Guna Match</a>
            <a href="#astrologers" style={{ color: '#94A3B8', textDecoration: 'none' }}>Talk to Astrologer</a>
          </nav>
          <button className="btn-gold">Sign In</button>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
