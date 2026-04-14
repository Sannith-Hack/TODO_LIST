import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoadingScreen from './src/screens/LoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import SkillTreeScreen from './src/screens/SkillTreeScreen';
import { COLORS } from './src/utils/theme';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'SkillTree'>('Home');

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {currentScreen === 'Home' ? (
        <HomeScreen onOpenStats={() => setCurrentScreen('SkillTree')} />
      ) : (
        <SkillTreeScreen onBack={() => setCurrentScreen('Home')} />
      )}
    </>
  );
};

export default App;
