import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ScreenHeaderProps {
  title?: string;
  /** Provide to render a back arrow on the left. */
  onBack?: () => void;
  /** Custom element rendered on the right side (e.g. "건너뛰기"). */
  right?: React.ReactNode;
  /**
   * 'nav' = back arrow + centered title, used on stack/detail screens.
   * 'section' = left-aligned bold title, used on tab root screens.
   */
  variant?: 'nav' | 'section';
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  right,
  variant = 'nav',
}) => {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  if (variant === 'section') {
    return (
      <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        {right}
      </View>
    );
  }

  return (
    <View style={styles.navHeader}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.sideSlot}>
          <ArrowLeft color={theme.text} size={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideSlot} />
      )}
      {title ? (
        <Text style={[styles.navTitle, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <View style={styles.sideSlot}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  navHeader: {
    paddingHorizontal: SPACING.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSlot: {
    width: 40,
    alignItems: 'flex-start',
  },
  navTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
});

export default ScreenHeader;
