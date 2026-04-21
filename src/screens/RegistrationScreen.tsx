import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions, SafeAreaView, Alert, StatusBar } from 'react-native';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { loadStats, saveStats } from '../storage/taskStorage';

interface RegistrationScreenProps {
  onComplete: () => void;
  theme?: 'dark' | 'light';
}

const RegistrationScreen = ({ onComplete, theme = 'dark' }: RegistrationScreenProps) => {
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  const colors = getColors(theme);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (name.trim().length < 2) {
      Alert.alert('SYSTEM ERROR', 'Player name must be at least 2 characters.');
      return;
    }

    const stats = await loadStats();
    const updatedStats = {
      ...stats,
      playerName: name.trim().toUpperCase(),
    };
    await saveStats(updatedStats);
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.primary }]}>SYSTEM AUTHORIZATION</Text>
          <Text style={[styles.title, { color: colors.text }]}>PLAYER REGISTRATION</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textDim }]}>ENTER PLAYER NAME</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.primary, color: colors.text }]}
              placeholder="YOUR NAME"
              placeholderTextColor={colors.textDim}
              value={name}
              onChangeText={setName}
              autoCapitalize="characters"
              autoFocus
            />
            <View style={[styles.inputGlow, { borderColor: colors.primary }]} />
          </View>

          <Text style={[styles.disclaimer, { color: colors.textDim }]}>
            * This name will be recorded in the System's eternal log. Choose wisely.
          </Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleRegister}>
            <Text style={[styles.buttonText, { color: colors.background }]}>AUTHORIZE ACCESS</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textDim }]}>QUEST LOG PROTOCOL v1.0.7</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 50,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: COLORS.primary,
    textShadowRadius: 15,
  },
  form: {
    width: '100%',
  },
  label: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 15,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: 60,
    paddingHorizontal: 20,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  inputGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: COLORS.primary,
    opacity: 0.3,
    ...SHADOWS.glow,
  },
  disclaimer: {
    color: COLORS.textDim,
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textDim,
    fontSize: 8,
    fontWeight: 'bold',
    opacity: 0.5,
  },
});

export default RegistrationScreen;
