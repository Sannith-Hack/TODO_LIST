import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { getColors, SHADOWS } from '../utils/theme';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

const LevelUpModal = ({ level, onClose, theme = 'dark' }: LevelUpModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  const colors = getColors(theme);

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
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }], backgroundColor: colors.surface, borderColor: colors.primary }
      ]}>
        <Text style={[styles.subtitle, { color: colors.primary }]}>SYSTEM NOTIFICATION</Text>
        <Text style={[styles.title, { color: colors.text, textShadowColor: colors.primary }]}>LEVEL UP!</Text>
        <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        <View style={[styles.levelCircle, { borderColor: colors.primary, backgroundColor: colors.background }]}>
          <Text style={[styles.levelText, { color: colors.text }]}>{level}</Text>
        </View>
        <Text style={[styles.message, { color: colors.textDim }]}>You have gained 3 Stat Points.</Text>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={onClose}>
          <Text style={[styles.closeBtnText, { color: colors.background }]}>CONFIRM</Text>
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
    borderWidth: 2,
    padding: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowRadius: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 20,
    opacity: 0.5,
  },
  levelCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 48,
    fontWeight: '900',
  },
  message: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  closeBtn: {
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default LevelUpModal;
