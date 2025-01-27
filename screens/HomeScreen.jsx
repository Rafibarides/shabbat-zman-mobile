import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import LocationSearch from "../components/LocationSearch";
import ShabbatTimes from "../components/ShabbatTimes";
import HebrewDate from "../components/HebrewDate";
import useGeolocation from "../hooks/useGeolocation";
import useWeatherApi from "../hooks/useWeatherApi";
import { getUpcomingShabbatDates } from '../utils/timeHelpers';

export default function HomeScreen() {
  const { location, error: locationError } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const { data: weatherData, astronomy, error: weatherError, isLoading } = useWeatherApi({
    latitude: selectedLocation?.lat || location?.latitude,
    longitude: selectedLocation?.lon || location?.longitude,
    city: selectedLocation?.name,
  });

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  // Get the location display name
  const getLocationDisplay = () => {
    if (selectedLocation) {
      return `${selectedLocation.name}, ${selectedLocation.region}`;
    }
    return weatherData?.location?.name 
      ? `${weatherData.location.name}, ${weatherData.location.region}`
      : 'Loading location...';
  };

  // Get formatted date for the upcoming Friday
  const getFormattedShabbatDate = () => {
    const { friday } = getUpcomingShabbatDates();

    // Safely parse the Friday date at local midday to avoid UTC shifting
    const [year, month, day] = friday.split('-').map(Number);
    const localMidday = new Date(year, month - 1, day, 12);

    return localMidday.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  console.log('Location:', location);
  console.log('Weather Error:', weatherError);
  console.log('Astronomy:', astronomy);

  return (
    <LinearGradient
      colors={[ "#2a0934", "#0a0a0a"]}
      style={styles.gradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text 
                style={styles.title}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >
                Shabbat Times for {getLocationDisplay()}
              </Text>
              <Text style={styles.date}>
                {getFormattedShabbatDate()}
              </Text>
            </View>
            
            <LocationSearch onLocationSelect={handleLocationSelect} />
            <HebrewDate />
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <ShabbatTimes weatherData={{ ...weatherData, astronomy }} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 40,
    paddingTop: 80,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Urbanist',
    width: '100%',
  },
  date: {
    color: '#FFE1FF',
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
});

// Placeholder screen for the main Shabbat Times view or any other UI you decide.
// In the future, you might import ShabbatTimes, HebrewDate, etc. and lay them out here.
