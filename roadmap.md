# Roadmap for React Native (Expo) Mobile App

This document provides a thorough breakdown of how to create a Shabbat times mobile application using React Native with Expo. The app aims to replicate the logic and UI/UX found in our existing web application (described in the original “Shabbat Zman Web” roadmap), but adapted for mobile devices.

---

## 1. Overview

• The mobile app will display (in the following order):
  - The city and state of the times (from the user's location or manually entered)
  - The date of the upcoming Shabbat (or current Shabbat if today is friday/saturday)
  - A manual location input field, with search button (search button has purple gradient background)
  - The current hebrew date in hebrew (from hebcal API),
  – 4 Shabbat times (candle lighting, netz hachama, Shabbat ends,Rabeinu Tam) based on the user’s location.  
  – A Hebrew date (hebcal API). 
  - The upcoming or current shabbats parsha/holiday (hebcal API) 
  – Basic astrological data (e.g., sunsets needed for calculations).  
• The core logic and data flow will mirror the web version’s approach, relying on:
  – Geolocation for automatic user location detection.  
  – A Weather API (like WeatherAPI.com), accessed via fetch calls (not Axios). The API only provides 3 days of forecast data, however it provides unlimited astronomy data.  
  – The same Shabbat times calculations used in the web app.  

We want this app to look and feel like the web version, using similar color schemes, fonts, and component arrangements. The web version has a purple and black gradient background, with a glass morphism "pill" effect on the 4 Shabbat times. Each time is a pill with a slightshadow. Each time/pill has a corresponding icon.

candles.avif for candle lighting/shabbat start
siddur.avif for Netz Hachama
wine.avif for Shabbat end
clove.avif for Rabeinu Tam

## 2. Technology and Libraries

Below is a high-level view of the React Native + Expo toolset you’ll need. Some of these are part of Expo by default, while others may require installation:

1. **Expo CLI**  
   – Bundling, development server, debugging, and easy building for iOS/Android.  
   – Provides developer tools (e.g., Expo Go app for previewing).

2. **React Navigation**  
   – This is a SINGLE PAGE APP. (We might have a single-screen approach if replicating the simple layout, but navigation is typically recommended for expansions.)

3. **Expo Location** (or alternative geolocation approach)  
   – For retrieving the user’s latitude/longitude to feed our Shabbat and weather calculations.  
   – Some permission handling may be needed on mobile devices.
   - if geolocation api is available for mobile, use it.

4. **Fetch API**  
   – We will use the built-in global fetch (similar to our existing fetchData utility on the web).  
   – No Axios usage in this project.

5. **Styling Solutions**  
   – We could use:
     a) **React Native StyleSheet** or  
     b) **Tailwind CSS–inspired library** (e.g., “twrnc” or “nativewind”) to replicate the tailwind-like classes.  
   – The goal is to mimic the web design and the linear gradient backgrounds, modern fonts, etc.

6. **React Native Gesture Handler, Reanimated**  
   – For advanced animations (similar to framer-motion on the web). We want this to add subtle animations to the UI, including bulge on tap for the search button/pills and a subtle fade in for the Shabbat times.

7. **react-native-dotenv** or inline environment keys (optional)  
   – If environment variables (API keys) need to be handled separately. In Expo, they can also be placed in app.json/app.config.js or simply in the code if it’s a public key.

Weather API: https://www.weatherapi.com/
API Key: a693943efa754abb860163744241803


Hebcal API: https://www.hebcal.com/
No API key needed.
---

## 3. Base Logic

The core logic from the web version should be retained in the mobile app:

1. **Fetching the User’s Location**  
   – Immediately on app launch, we attempt to get the lat/long from the device.  
   – If permission is denied, prompt the user to enter location manually (city name, etc.).  

2. **Weather Data Fetching**  
   – We use the same WeatherAPI.com (or similar) calls to get forecast data for Friday and Saturday, or at least 3 days.  
   – The forecast payload must contain astronomy (sunrise, sunset) data for all relevant days.  
   – We rely on the same approach: calling /astronomy.json or /forecast.json with “days=3” or more.

3. **Shabbat Time Calculations**  
   – The web logic for determining:
     • Which day is the upcoming Friday (or if it’s currently Friday/Saturday).  
     • Candle lighting time: sunset minus 18 minutes on Friday.  
     • Shabbat end time: Saturday’s sunset plus 40 minutes.  
     • Rabeinu Tam: Saturday’s sunset plus 72 minutes.  
     • Netz Hachama: Saturday’s sunrise (if relevant).
   – Output these times with an AM/PM format, just as on the web.

4. **Manual Location Input**  
   – Similar to the web app’s location search, you can add an input field that suggests city names or simply takes the user’s typed location.  
   – Convert that location to lat/long or pass it to the Weather API’s search endpoint.  

5. **Hebrew Date** (Optional)  
   – If we replicate the Hebcal call from the web, it will be a simple fetch to “https://www.hebcal.com/converter?cfg=json&...” for the current Gregorian date to get the Hebrew date.  
   – The logic for celebrating holiday names, etc., remains unchanged.

---

## 4. Project Structure

Below is a basic folder structure for the Expo project. You can adapt it as needed:

```plaintext
shabbat-zman-mobile/
├── App.js                # Entry point for the Expo React Native app
├── app.config.js         # Expo config if needed
├── package.json
├── .gitignore
├── assets/               # Local fonts, images, etc.
├── utils/
│   ├── fetchData.js      # Reuse logic from web's fetchData but adapted to React Native if needed
│   └── timeHelpers.js    # Convert to AM/PM, remove leading zero, etc.
├── components/
│   ├── ShabbatTimes.jsx  # Supply props for candle lighting, netz, end times, etc.
│   ├── LocationSearch.jsx (or .js)
│   ├── HebrewDate.jsx
│   └── ...
├── hooks/
│   ├── useGeolocation.js  # Using Expo Location or react-native community packages
│   └── useWeatherApi.js   # Similar to the web logic
└── screens/              # If using multiple screens and React Navigation
    ├── HomeScreen.jsx
    └── ...
```

### Notable Points:
• **App.js**:  
  – Set up the main view, theming, safe area, and pass data to child components.  
• **hooks/useGeolocation.js**:  
  – Use `expo-location` for requesting permissions and retrieving lat/long.  
• **hooks/useWeatherApi.js**:  
  – Accept the user’s lat/long or string location.  
  – Calls the Weather API for the next 3 days or specifically the upcoming Friday/Saturday.  
• **components/ShabbatTimes.jsx**:  
  – Similar logic for computing times.  
• **utils/fetchData.js**:  
  – Thin wrapper around fetch with error handling.  
  – Return `[data, error]` similarly to the web version.

---

## 5. Detailed Setup Steps

1. **Initialize Project**  
   – Install the Expo CLI:  
     ```bash
     npm install --global expo-cli
     ```  
   – Create a new project:  
     ```bash
     expo init ExpoShabbatZman
     ```
   – Choose a blank template or minimal TypeScript template (if TypeScript is desired).

2. **Add Needed Dependencies**  
   – For location:  
     ```bash
     npx expo install expo-location
     ```
   – For React Navigation (optional but recommended if multiple screens):  
     ```bash
     npm install @react-navigation/native
     npm install @react-navigation/stack
     npx expo install react-native-gesture-handler react-native-reanimated
     ```
   – For styling:  
     – If you want to mimic Tailwind syntax:  
       ```bash
       npm install nativewind
       npx expo install tailwindcss
       ```  
       (Then configure “nativewind.config.js” similarly to tailwind.config.js.)

3. **Permissions**  
   – For iOS and Android, location requests require adding permission fields to `app.json` or `app.config.js`.  
   – Example for iOS in `app.json`:
     ```json
     {
       "expo": {
         ...
         "ios": {
           "infoPlist": {
             "NSLocationWhenInUseUsageDescription": "We need your location to show accurate Shabbat times."
           }
         }
       }
     }
     ```
   – For Android, configure the `android.permission.ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION`.

4. **Implement useGeolocation Hook**  
   – Similar to the web’s `useGeolocation.js`, but use `Location.requestForegroundPermissionsAsync()` and `Location.getCurrentPositionAsync()` from Expo’s location module.

5. **Implement useWeatherApi Hook**  
   – Duplicate the web logic:  
     • Figure out “upcoming Friday” date.  
     • Build URLs for `https://api.weatherapi.com/v1/forecast.json` with `days=3` or astronomy calls.  
     • Combine results.  
     • Store in state as `weatherData` plus error/loading flags.

6. **Create Single App Layout**  
   – If it’s a single-screen experience (like the web), you can do the entire UI in `App.js` or a single “HomeScreen” component.  
   – Mirror the layout:  
     • A heading for location.  
     • A location input to override geolocation.  
     • A “ShabbatTimes” component listing candle lighting, netz, etc.  
     • Possibly a “HebrewDate” component floating near the top or bottom.

7. **Styling**  
   – Use linear gradients with `expo-linear-gradient` or “react-native-linear-gradient.”  
   – Attempt to replicate the color transitions, fonts, and layout spacing from the web’s tailwind approach.  
   – If you’re using a Tailwind-like library (`nativewind` or `twrnc`), replicate your utility classes (e.g., `bg-gradient-to-r`, etc.) as close as possible.

8. **Animation**  
   – For small animations (fade-in, scale on press), you can rely on React Native’s built-in Animated or on react-native-reanimated if you want more complex transitions.  
   – Replicating framer-motion exactly is tricky in React Native, but you can approximate the transitions.

9. **Testing**  
   – Run on physical devices or simulators via `expo start`.  
   – iOS: use Xcode simulator or Expo Go app on iPhone.  
   – Android: use Android Studio emulator or Expo Go on Android phone.

10. **Deployment**  
   – Build an APK or AAB (Android) or .ipa (iOS) with `expo build`.  
   – Submit to stores (Google Play, Apple App Store) or share via TestFlight.  

---

## 6. APIs and Keys


• **Hebcal** (optional)  
  – Called for Hebrew date conversions: `https://www.hebcal.com/converter?cfg=json&gy=...`.  

• **Location**  
  – Using Expo Location or React Native’s built-in approach.  
  – No separate server is needed.  


---

## 7. Summary

By following this roadmap, you can build a faithful React Native (Expo) mobile version of our Shabbat Times web app at 
https://www.ShabbatZman.com. The main requirement is to mirror the existing UI and logic, making only the necessary adjustments for React Native’s environment (handling mobile permissions, styles, and navigation). Keep the fetch-based data retrieval and Shabbat calculations consistent with the web approach.

Feel free to improve, refine, and add small mobile-focused enhancements (we will need a push notification on thursday night for candle lighting times). The foundation, however, should stay the same as our established web logic—fetch location, query the weather and astronomy endpoints, compute times, and display them in a modern, visually appealing style.

The font we will be using is Urbanist-VariableFont_wght.ttf. It can be found in the assets/fonts folder.

All images/icons can be found in the assets/images folder.

Important:
Key functionality in the project, highlighting how everything fits together:

• Automatic Location Detection:
  – On initial load, the application attempts to retrieve the user’s geographic location via the browser Geolocation API.  
  – If geolocation is granted, it automatically fetches latitude and longitude.  
  – If geolocation is denied, a manual location search input is displayed.

• Manual Location Entry With Autocomplete Suggestions:
  – The LocationSearch component allows users to type a city or ZIP code.  
  – The app fetches suggestions in real-time from the Weather API (e.g., WeatherAPI’s /search.json); suggestions appear in a dropdown.  
  – On selecting a suggestion or pressing Search, the submitted location is used for fetching Shabbat times.

Example snippet from react web app version showing how suggestions are handled (no line numbers):
```javascript:shabbat-zman/src/components/LocationSearch.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LocationSearch = ({ onLocationSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery) {
        setSuggestions([]);
        return;
      }
      try {
        const API_KEY = 'a693943efa754abb860163744241803';
        const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // ...
};

export default LocationSearch;
```

• Fetching Weather and Astronomy Data:
  – The useWeatherApi hook calls WeatherAPI’s /forecast.json for the upcoming days.  
  – It also fetches astronomy data for specific dates (e.g., Friday and Saturday) in order to get sunset/sunrise times.  
  – Data is combined into a single object (forecastData) that is used across the UI.

• Shabbat Times Computation:
  – For upcoming or current Shabbat, the code identifies Friday’s date and calculates times for: candle-lighting (“Candle Lighting”), Shabbat end (“Shabbat Ends”), Netz Hachama (sunrise), and Rabeinu Tam.  
  – Candle lighting is offset from sunset by -18 minutes (on Friday).  
  – Shabbat end time is offset by +40 minutes from Saturday’s sunset. Rabeinu Tam is +72 minutes from Saturday’s sunset.

Example calculation from react web app version:
```javascript:shabbat-zman/src/components/ShabbatTimes.jsx
const calculateAdjustedTime = (timeStr, offsetMinutes) => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  const dateObj = new Date();
  dateObj.setHours(period === 'PM' ? hours + 12 : hours);
  dateObj.setMinutes(minutes + offsetMinutes);

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
```

• Displaying Current or Next Shabbat Times:
  – If it’s already Friday, day-of Shabbat times are used.  
  – If it’s Saturday, the system uses “yesterday” as Friday.  
  – Otherwise, it automatically calculates the next upcoming Friday and Saturday.

• Regular Reset Every Sunday at Midnight:
  – The application is meant to automatically refresh its Shabbat data once the new week comes in (Sunday, 12:00 AM).  

• Hebrew Date and Holiday Detection:
  – The HebrewDate component fetches data from Hebcal’s converter API to display the date in Hebrew.  
  – It also shows any current Jewish holiday or event.

• Error Handling:
  – If location fails, a descriptive error message is shown and the user is prompted to enter a manual location.  
  – If the Weather API fails, the app warns the user accordingly.



