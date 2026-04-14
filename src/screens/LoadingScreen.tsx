import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';

const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    // Finish screen
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.systemNotice}>[SYSTEM NOTICE]</Text>
        <Text style={styles.quote}>
          "THE SYSTEM HAS SELECTED A PLAYER."
        </Text>
        <View style={styles.loadingBarContainer}>
          <Animated.View style={[styles.loadingProgress, { width }, SHADOWS.glow]} />
        </View>
        <Text style={styles.loadingText}>INITIALIZING STATUS WINDOW...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  systemNotice: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 10,
  },
  quote: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 40,
    textShadowColor: COLORS.primary,
    textShadowRadius: 15,
  },
  loadingBarContainer: {
    height: 4,
    backgroundColor: COLORS.secondary,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    color: COLORS.textDim,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default LoadingScreen;
