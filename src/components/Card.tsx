import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  radius?: number;
}

/** Themed bordered container used for grouped content blocks across screens. */
export const Card: React.FC<CardProps> = ({ children, style, padding = 16, radius = 24 }) => {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: radius,
          padding,
          shadowColor: isDarkMode ? '#000000' : '#1C2E21',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkMode ? 0.3 : 0.04,
          shadowRadius: 16,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
