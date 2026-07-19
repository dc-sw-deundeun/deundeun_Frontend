import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@/navigation/AppNavigator';
import { useFonts } from 'expo-font';

import { View, Platform, StyleSheet } from 'react-native';

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
    <SafeAreaProvider style={styles.rootContainer}>
      <View style={styles.appContainer}>
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f5f5f5' : '#ffffff',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
});

