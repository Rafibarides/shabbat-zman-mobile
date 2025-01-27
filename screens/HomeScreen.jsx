import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';

import LocationSearch from "../components/LocationSearch";
import ShabbatTimes from "../components/ShabbatTimes";
import HebrewDate from "../components/HebrewDate";
import useGeolocation from "../hooks/useGeolocation";
import useWeatherApi from "../hooks/useWeatherApi";
import { getUpcomingShabbatDates } from '../utils/timeHelpers';

const getShabbatTimesForLocation = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://www.hebcal.com/shabbat?cfg=json&latitude=${latitude}&longitude=${longitude}&geo=pos`
    );
    const data = await response.json();
    return data.items?.find(item => item.category === "candles")?.date || null;
  } catch (error) {
    console.error('Error fetching Shabbat times:', error);
    return null;
  }
};

const scheduleShabbatNotifications = async (shabbatEnd) => {
  // Cancel any existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Get current location permission status
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status === 'granted') {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const candleLightingTime = await getShabbatTimesForLocation(
        location.coords.latitude,
        location.coords.longitude
      );

      if (candleLightingTime) {
        // Schedule Friday 10 AM notification
        const fridayNotification = new Date(candleLightingTime);
        fridayNotification.setHours(10, 0, 0, 0); // Set to 10:00 AM
        
        if (fridayNotification > new Date()) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Shabbat Reminder",
              body: "Don't forget to check what time Shabbat starts!",
              sound: Platform.OS === 'ios' ? 'notification.wav' : 'notification.mp3',
              priority: 'high',
            },
            trigger: {
              date: fridayNotification,
              channelId: 'default',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error scheduling Friday notification:', error);
    }
  }

  // Schedule Shavua Tov notification (1 hour after Shabbat ends)
  const shabbatEndTime = new Date(shabbatEnd);
  const shavuaTovTime = new Date(shabbatEndTime.getTime() + 60 * 60 * 1000); // Add 1 hour
  
  if (shavuaTovTime > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Shavua Tov!",
        body: "Have a wonderful week!",
        sound: Platform.OS === 'ios' ? 'notification.wav' : 'notification.mp3',
        priority: 'high',
      },
      trigger: {
        date: shavuaTovTime,
        channelId: 'default',
      },
    });
  }
};

export default function HomeScreen() {
  const { location, error: locationError } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const { data: weatherData, astronomy, error: weatherError, isLoading } = useWeatherApi({
    latitude: selectedLocation?.lat || location?.latitude,
    longitude: selectedLocation?.lon || location?.longitude,
    city: selectedLocation?.name,
  });

  // Schedule notifications when weather data updates
  useEffect(() => {
    if (weatherData?.shabbat?.havdalah) {
      scheduleShabbatNotifications(weatherData.shabbat.havdalah);
    }
  }, [weatherData]);

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
    const [year, month, day] = friday.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
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
