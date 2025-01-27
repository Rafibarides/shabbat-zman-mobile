// Simple placeholder component for displaying Shabbat times.
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { BlurView } from 'expo-blur';
import { calculateAdjustedTime } from "../utils/timeHelpers";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import FadeIn from './FadeIn';

const TimeCard = ({ icon, label, time }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(1.05, { damping: 10 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <BlurView
          intensity={80}
          tint="dark"
          style={styles.timeCard}
        >
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.time}>{time}</Text>
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

export default function ShabbatTimes({ weatherData }) {
  console.log("ShabbatTimes weatherData:", weatherData);

  if (!weatherData) {
    console.log("No weatherData");
    return null;
  }

  const { astronomy } = weatherData;
  console.log("Astronomy data:", astronomy);

  if (!astronomy) {
    console.log("No astronomy data");
    return null;
  }

  // Calculate the times
  console.log("Friday sunset:", astronomy.friday?.sunset);
  console.log("Saturday sunrise:", astronomy.saturday?.sunrise);
  console.log("Saturday sunset:", astronomy.saturday?.sunset);

  const candleLighting = calculateAdjustedTime(astronomy.friday.sunset, -18);
  const netzHachama = calculateAdjustedTime(astronomy.saturday.sunrise, 0);
  const shabbatEnds = calculateAdjustedTime(astronomy.saturday.sunset, 40);
  const rabeinuTam = calculateAdjustedTime(astronomy.saturday.sunset, 72);

  return (
    <FadeIn>
      <View style={styles.container}>
        <FadeIn delay={200}>
          <TimeCard
            icon={require("../assets/images/candles.avif")}
            label="Candle Lighting"
            time={candleLighting}
          />
        </FadeIn>
        <FadeIn delay={400}>
          <TimeCard
            icon={require("../assets/images/siddur.avif")}
            label="Netz Hachama"
            time={netzHachama}
          />
        </FadeIn>
        <FadeIn delay={600}>
          <TimeCard
            icon={require("../assets/images/wine.avif")}
            label="Shabbat Ends"
            time={shabbatEnds}
          />
        </FadeIn>
        <FadeIn delay={800}>
          <TimeCard
            icon={require("../assets/images/clove.avif")}
            label="Rabeinu Tam"
            time={rabeinuTam}
          />
        </FadeIn>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 0,
  },
  timeCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderRadius: 25,
    backgroundColor: "rgba(111, 0, 127, 0.1)",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  label: {
    color: "#FFE1FF",
    fontSize: 20,
    fontFamily: "Urbanist",
    fontWeight: "500",
    flex: 1,
  },
  time: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Urbanist",
    fontWeight: "600",
    marginLeft: "auto",
    paddingLeft: 12,
  },
});
