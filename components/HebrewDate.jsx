// Simple placeholder component for fetching Hebrew date
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useHebcalApi from '../hooks/useHebcalApi';
import FadeIn from './FadeIn';

export default function HebrewDate() {
  const { hebrewData, error, isLoading } = useHebcalApi();

  console.log('HebrewDate component data:', hebrewData); // Debug log

  if (isLoading) {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  if (error) {
    return <Text style={styles.error}>Failed to load Hebrew date</Text>;
  }

  if (!hebrewData) return null;

  return (
    <FadeIn delay={100}>
      <View style={styles.container}>
        <Text style={styles.hebrewDate}>{hebrewData.hebrew}</Text>
        <View style={styles.eventsContainer}>
          {hebrewData.parsha ? (
            <Text style={styles.parsha}>
              {hebrewData.parsha.hebrew || hebrewData.parsha.title}
            </Text>
          ) : (
            <Text style={styles.parsha}>Loading Parsha...</Text>
          )}
          {hebrewData.holidays.map((holiday, index) => (
            <Text key={holiday.hebrew + index} style={styles.holiday}>
              {holiday.hebrew || holiday.title}
            </Text>
          ))}
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  hebrewDate: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
  eventsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  parsha: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
  holiday: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
}); 