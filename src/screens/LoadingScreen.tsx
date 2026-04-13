import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/theme';

const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.quote}>
          "Jack of all trades master of none but oftentimes better than the master of one"
        </Text>
        <View style={styles.loadingBar}>
          <View style={styles.loadingProgress} />
        </View>
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
  quote: {
    color: COLORS.primary,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 28,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  loadingBar: {
    height: 2,
    backgroundColor: COLORS.secondary,
    marginTop: 30,
    width: '100%',
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    width: '40%', // We can animate this later if needed
  },
});

export default LoadingScreen;
