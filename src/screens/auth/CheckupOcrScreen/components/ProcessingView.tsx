import React from 'react';
import { Animated } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../CheckupOcrScreen.styles';

interface ProcessingViewProps {
  logoScale: Animated.Value;
  logoOpacity: Animated.Value;
  theme: { background: string; text: string; textMuted: string };
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ logoScale, logoOpacity, theme }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
        <Text style={{ fontSize: 40, fontWeight: '900', color: COLORS.primary, marginBottom: SPACING.md }}>든든</Text>
      </Animated.View>
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>건강검진 기록을 분석하고 있어요</Text>
      <Text style={{ color: theme.textMuted, fontSize: 14 }}>잠시만 기다려 주세요 (최대 10~15초 소요)</Text>
    </SafeAreaView>
  );
};

export default ProcessingView;
