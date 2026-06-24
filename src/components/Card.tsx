import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  radius?: number;
  onPress?: () => void;
}

/** Themed bordered container used for grouped content blocks across screens with Glassmorphism. Supports pressing. */
export const Card: React.FC<CardProps> = ({ children, style, padding = 16, radius = 24, onPress }) => {
  const { isDarkMode } = useAppStore();

  const glassCardStyle = {
    backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.5)' : 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.75)',
    borderRadius: radius,
    padding,
    shadowColor: isDarkMode ? '#000000' : '#1C2E21',
    shadowOpacity: isDarkMode ? 0.12 : 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    overflow: 'hidden' as const,
  };

  const ContentContainer = onPress ? TouchableOpacity : View;

  return (
    <ContentContainer style={[glassCardStyle, style]} onPress={onPress} activeOpacity={0.85}>
      {/* Diagonal Glass Shine Overlay */}
      <View style={styles.glassShine} pointerEvents="none" />
      {children}
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  glassShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '250%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '25deg' }, { translateX: 20 }, { translateY: -40 }],
  },
});

export default Card;
