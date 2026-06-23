import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@/navigation/AppNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'NanumSquareRound-Light': require('./src/assets/fonts/NanumSquareRoundL.ttf'),
    'NanumSquareRound-Regular': require('./src/assets/fonts/NanumSquareRoundR.ttf'),
    'NanumSquareRound-Bold': require('./src/assets/fonts/NanumSquareRoundB.ttf'),
    'NanumSquareRound-ExtraBold': require('./src/assets/fonts/NanumSquareRoundEB.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

