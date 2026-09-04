import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { calculateKundli, calculateDailyPanchang } from '@vedic-astro/astrology-engine';

export default function App() {
  const todayIso = new Date().toISOString().split('T')[0];
  const [panchang] = useState(() => calculateDailyPanchang(todayIso, 28.6139, 77.2090));
  const [kundli] = useState(() => calculateKundli('1990-01-15', '10:30:00', 28.6139, 77.2090));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🕉️ VEDIC ASTRO MOBILE</Text>
          <Text style={styles.headerSub}>High-Precision Sidereal Jyotish Engine</Text>
        </View>

        {/* Today's Panchang Widget */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 TODAY'S PANCHANG</Text>
          <Text style={styles.cardText}>Tithi: <Text style={styles.goldText}>{panchang.tithi.name}</Text></Text>
          <Text style={styles.cardText}>Nakshatra: <Text style={styles.goldText}>{panchang.nakshatra.name} (Pada {panchang.nakshatra.pada})</Text></Text>
          <Text style={styles.cardText}>Rahu Kalam: <Text style={styles.redText}>{panchang.muhurats.rahuKalam.start} - {panchang.muhurats.rahuKalam.end}</Text></Text>
        </View>

        {/* Kundli Summary Widget */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ KUNDLI SUMMARY</Text>
          <Text style={styles.cardText}>Lagna: <Text style={styles.goldText}>{kundli.lagnaRashi} ({kundli.lagnaDegree.toFixed(2)}°)</Text></Text>
          <Text style={styles.cardText}>Moon Rashi: <Text style={styles.goldText}>{kundli.moonRashi}</Text></Text>
          <Text style={styles.cardText}>Nakshatra: <Text style={styles.goldText}>{kundli.moonNakshatra}</Text></Text>
          <Text style={styles.cardText}>Ayanamsha: <Text style={styles.goldText}>{kundli.ayanamsha} ({kundli.ayanamshaDegree.toFixed(2)}°)</Text></Text>
        </View>

        {/* Astrologers Quick Action */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🧙 Talk to Verified Astrologers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07090E',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#0E131F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  cardText: {
    color: '#E2E8F0',
    fontSize: 14,
    marginBottom: 6,
  },
  goldText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  redText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
