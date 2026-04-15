import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
import LoadingScreen from './src/screens/LoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import SkillTreeScreen from './src/screens/SkillTreeScreen';
import TestingScreen from './src/screens/TestingScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MemoScreen from './src/screens/MemoScreen';
import Sidebar from './src/components/Sidebar';
import { COLORS } from './src/utils/theme';
import { loadStats } from './src/storage/taskStorage';
import { UserStats } from './src/utils/types';
import RegistrationScreen from './src/screens/RegistrationScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo'>('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await loadStats();
      setStats(data);
      if (!data.playerName) {
        setNeedsRegistration(true);
      }
    };
    if (!isLoading) {
      fetchStats();
    }
  }, [isLoading, currentScreen]);

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      </>
    );
  }

  if (needsRegistration) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <RegistrationScreen onComplete={() => setNeedsRegistration(false)} />
      </>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home': return <HomeScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'SkillTree': return <SkillTreeScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'Testing': return <TestingScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'Calendar': return <CalendarScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'Settings': return <SettingsScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'Memo': return <MemoScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
      default: return <HomeScreen onOpenMenu={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen as any)}
        stats={stats}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
