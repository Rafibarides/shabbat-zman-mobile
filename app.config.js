// Placeholder for any custom Expo configuration.
// This can be used for dynamic config if needed.
module.exports = {
  // Example config object
  expo: {
    name: "ShabbatZmanMobile",
    slug: "shabbat-zman-mobile",
    version: "1.0.0",
    plugins: [
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "d9d74058-3cbb-4fda-8601-9b58ccea66c7"
      }
    },
    // Merge in other important config from app.json
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "We need your location to show accurate Shabbat times.",
        UIBackgroundModes: ["audio", "remote-notification"],
        NSUserNotificationUsageDescription: "We need to send you notifications about Shabbat times",
      },
      bundleIdentifier: "com.shabbatzman.mobile",
      notification: {
        sound: true,
        iosDisplayInForeground: true,
        sounds: ["notification.wav"]
      }
    },
    android: {
      "package": "com.shabbatzman.mobile",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION", 
        "ACCESS_FINE_LOCATION",
        "NOTIFICATIONS",
        "SCHEDULE_EXACT_ALARM",  // For precise notification timing
        "POST_NOTIFICATIONS",     // Required for Android 13+
        "NOTIFICATIONS"
      ],
      notification: {
        icon: "./assets/images/adaptive-icon.png",
        color: "#ffffff",
        sounds: ["./assets/sounds/notification.mp3"]
      }
    }
  },
}; 