// Simple placeholder component for displaying Shabbat times.
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateAdjustedTime } from '../utils/timeHelpers';

const TimeCard = ({ icon, label, time }) => (
  <LinearGradient
    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
    style={styles.timeCard}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Image 
      source={icon} 
      style={styles.icon}
      resizeMode="contain"
    />
    <View style={styles.timeInfo}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  </LinearGradient>
);

export default function ShabbatTimes({ weatherData }) {
  console.log('ShabbatTimes weatherData:', weatherData);
  
  if (!weatherData) {
    console.log('No weatherData');
    return null;
  }

  const { astronomy } = weatherData;
  console.log('Astronomy data:', astronomy);
  
  if (!astronomy) {
    console.log('No astronomy data');
    return null;
  }

  // Calculate the times
  console.log('Friday sunset:', astronomy.friday?.sunset);
  console.log('Saturday sunrise:', astronomy.saturday?.sunrise);
  console.log('Saturday sunset:', astronomy.saturday?.sunset);

  const candleLighting = calculateAdjustedTime(astronomy.friday.sunset, -18);
  const netzHachama = astronomy.saturday.sunrise;
  const shabbatEnds = calculateAdjustedTime(astronomy.saturday.sunset, 40);
  const rabeinuTam = calculateAdjustedTime(astronomy.saturday.sunset, 72);

  return (
    <View style={styles.container}>
      <TimeCard
        icon={require('../assets/images/candles.avif')}
        label="Candle Lighting"
        time={candleLighting}
      />
      <TimeCard
        icon={require('../assets/images/siddur.avif')}
        label="Netz Hachama"
        time={netzHachama}
      />
      <TimeCard
        icon={require('../assets/images/wine.avif')}
        label="Shabbat Ends"
        time={shabbatEnds}
      />
      <TimeCard
        icon={require('../assets/images/clove.avif')}
        label="Rabeinu Tam"
        time={rabeinuTam}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 25, // Pill shape
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  timeInfo: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Urbanist',
    opacity: 0.8,
  },
  time: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

// Placeholder component for displaying Shabbat times (candle lighting, netz, etc.).
// In the future, you'll pass props for candleLighting, shabbatEnd, etc. 