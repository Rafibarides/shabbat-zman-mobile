import 'react-native-url-polyfill/auto';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, AppRegistry } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './screens/HomeScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function App() {
  // Load the Urbanist font
  const [fontsLoaded] = useFonts({
    'Urbanist': require('./assets/fonts/Urbanist-VariableFont_wght.ttf'),
  });

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