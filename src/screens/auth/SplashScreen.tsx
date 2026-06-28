import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { storage } from '@/utils/storage';
import { setAccessToken } from '@/api';

export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const [isCheckingAutoLogin, setIsCheckingAutoLogin] = useState(true);

  useEffect(() => {
    const checkAutoLogin = async () => {
      const token = await storage.getAccessToken();
      if (token) {
        setAccessToken(token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
        });
      } else {
        setIsCheckingAutoLogin(false);
      }
    };
    checkAutoLogin();
  }, [navigation]);

  if (isCheckingAutoLogin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Mock Character / Logo Graphic */}
        <View style={styles.logoContainer}>
          <View style={styles.characterContainer}>
            <Image
              source={require('../../assets/splash_Icon.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>든든</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            어려운 검진 결과를,{"\n"}매일의 작은 실천으로.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    letterSpacing: 2,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
