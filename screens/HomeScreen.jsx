import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import LocationSearch from "../components/LocationSearch";
import ShabbatTimes from "../components/ShabbatTimes";
import HebrewDate from "../components/HebrewDate";
import useGeolocation from "../hooks/useGeolocation";
import useWeatherApi from "../hooks/useWeatherApi";

export default function HomeScreen() {
  const { location, error: locationError } = useGeolocation();
  const { data: weatherData, astronomy, error: weatherError, isLoading } = useWeatherApi({
    latitude: location?.latitude,
    longitude: location?.longitude,
  });

  console.log('Location:', location);
  console.log('Weather Error:', weatherError);
  console.log('Astronomy:', astronomy);

  return (
    <LinearGradient
      colors={["#0a0a0a", "#2a0934"]}
      style={styles.gradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <HebrewDate />
          <LocationSearch />
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <ShabbatTimes weatherData={{ ...weatherData, astronomy }} />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20, // Spacing between components
  },
});

// Placeholder screen for the main Shabbat Times view or any other UI you decide.
// In the future, you might import ShabbatTimes, HebrewDate, etc. and lay them out here.
