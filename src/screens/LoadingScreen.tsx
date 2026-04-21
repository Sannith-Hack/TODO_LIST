import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';

const LoadingScreen = ({ onFinish, theme = 'dark' }: { onFinish: () => void, theme?: 'dark' | 'light' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const colors = getColors(theme);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={[styles.systemNotice, { color: colors.primary }]}>[SYSTEM NOTICE]</Text>
        <Text style={[styles.quote, { color: colors.text, textShadowColor: colors.primary }]}>
          "THE SYSTEM HAS SELECTED A PLAYER."
        </Text>
        <View style={[styles.loadingBarContainer, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Animated.View style={[styles.loadingProgress, { width, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.loadingText, { color: colors.textDim }]}>INITIALIZING STATUS WINDOW...</Text>
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
