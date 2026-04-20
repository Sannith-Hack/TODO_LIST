import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

const PARTICLE_COUNT = 12;

const Particle = ({ x, y, color, delay }: { x: number, y: number, color: string, delay: number }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    
    translateX.value = withDelay(delay, withTiming(Math.cos(angle) * distance, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    }));
    
    translateY.value = withDelay(delay, withTiming(Math.sin(angle) * distance, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    }));
    
    opacity.value = withDelay(delay, withTiming(0, { duration: 800 }));
    scale.value = withDelay(delay, withTiming(0, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.particle, 
        { left: x, top: y, backgroundColor: color },
        animatedStyle
      ]} 
    />
  );
};

export const ParticleEffect = ({ x, y, color, onComplete }: ParticleProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <Particle 
          key={i} 
          x={x} 
          y={y} 
          color={color} 
          delay={Math.random() * 200}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    zIndex: 3000,
  },
});
