import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';

interface BottomTabBarProps {
  currentScreen: 'Home' | 'SkillTree' | 'Testing';
  onNavigate: (screen: 'Home' | 'SkillTree' | 'Testing') => void;
}

const BottomTabBar = ({ currentScreen, onNavigate }: BottomTabBarProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'Home' && styles.activeTab]} 
          onPress={() => onNavigate('Home')}
        >
          <View style={[styles.indicator, currentScreen === 'Home' && styles.activeIndicator]} />
          <Text style={[styles.tabText, currentScreen === 'Home' && styles.activeTabText]}>QUEST LOG</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'SkillTree' && styles.activeTab]} 
          onPress={() => onNavigate('SkillTree')}
        >
          <View style={[styles.indicator, currentScreen === 'SkillTree' && styles.activeIndicator]} />
          <Text style={[styles.tabText, currentScreen === 'SkillTree' && styles.activeTabText]}>STATUS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'Testing' && styles.activeTab]} 
          onPress={() => onNavigate('Testing')}
        >
          <View style={[styles.indicator, currentScreen === 'Testing' && styles.activeIndicator]} />
          <Text style={[styles.tabText, currentScreen === 'Testing' && styles.activeTabText]}>CONSOLE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary + '44',
  },
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary + '11',
  },
  tabText: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  activeTabText: {
    color: COLORS.primary,
    textShadowColor: COLORS.primary,
    textShadowRadius: 10,
  },
  indicator: {
    width: 20,
    height: 2,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glow,
  },
});

export default BottomTabBar;
