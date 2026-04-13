import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoadingScreen from './src/screens/LoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import { COLORS } from './src/utils/theme';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {isLoading ? (
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <HomeScreen />
      )}
    </>
  );
};

export default App;
