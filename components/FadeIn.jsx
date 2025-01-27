import React, { useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withDelay
} from 'react-native-reanimated';

export default function FadeIn({ children, delay = 0 }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
} 