import 'react-native-reanimated';  // Must come first
import 'react-native-url-polyfill/auto';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, AppRegistry, Platform, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Shabbat Times',
      description: 'Notifications for Shabbat times and candle lighting',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please enable notifications to receive Shabbat time reminders.',
      [{ text: 'OK' }]
    );
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: "d9d74058-3cbb-4fda-8601-9b58ccea66c7" // Your project ID from app.config.js
  })).data;
  
  console.log('Push token:', token);
  return token;
}

function App() {
  // Load the Urbanist font
  const [fontsLoaded] = useFonts({
    'Urbanist': require('./assets/fonts/Urbanist-VariableFont_wght.ttf'),
  });

  // Set up notifications when app starts
  React.useEffect(() => {
    registerForPushNotificationsAsync();

    // Set up notification listener
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Set up response listener for when user taps notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Hide splash screen once fonts are loaded
  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // We'll add the gradient background in HomeScreen
  },
});

// Register the app
AppRegistry.registerComponent('main', () => App);

export default App; 