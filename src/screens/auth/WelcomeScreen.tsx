import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Animation logic for glowing effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleStart = () => {
    // Navigate to the main tab screen and reset history
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Celebration Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>가입을 축하해요! 🎉</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            이제 든든이와 함께{"\n"}매일의 작은 실천을 시작해요.
          </Text>
        </View>

        {/* Character Card */}
        <View style={styles.characterSection}>
          <Animated.View
            style={[
              styles.characterWrapper,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isDarkMode ? '#1B2E21' : '#E8F5E9',
                borderColor: COLORS.accent,
              },
            ]}
          >
            <Text style={styles.characterEmoji}>🌱</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>내 첫 친구</Text>
            </View>
          </Animated.View>

          <Text style={[styles.characterName, { color: theme.text }]}>든든이</Text>
          <View style={styles.levelRow}>
            <Text style={[styles.levelText, { color: COLORS.primary }]}>Lv 1</Text>
            <View style={[styles.levelBarContainer, { backgroundColor: theme.border }]}>
              <View style={[styles.levelBarFill, { backgroundColor: COLORS.primary }]} />
            </View>
            <Text style={[styles.levelPercent, { color: theme.textMuted }]}>0%</Text>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: COLORS.primary }]}
            onPress={handleStart}
          >
            <Text style={styles.submitButtonText}>든든이와 시작하기</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  characterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  characterWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  characterEmoji: {
    fontSize: 88,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  characterName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    width: 240,
    marginTop: SPACING.xs,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  levelBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelBarFill: {
    width: '10%', // starts at level 1 0%
    height: '100%',
    borderRadius: 4,
  },
  levelPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
