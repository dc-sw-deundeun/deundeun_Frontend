import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { styles } from './WelcomeScreen.styles';

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
