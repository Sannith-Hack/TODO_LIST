import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const LevelUpModal = ({ level, onClose }: LevelUpModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[
        styles.container, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <Text style={styles.subtitle}>SYSTEM NOTIFICATION</Text>
        <Text style={styles.title}>LEVEL UP!</Text>
        <View style={styles.divider} />
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <Text style={styles.message}>You have gained 5 Stat Points.</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>CONFIRM</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 30,
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: COLORS.primary,
    textShadowRadius: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: 20,
    opacity: 0.5,
  },
  levelCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.background,
    ...SHADOWS.glow,
  },
  levelText: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '900',
  },
  message: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    ...SHADOWS.glow,
  },
  closeBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default LevelUpModal;
