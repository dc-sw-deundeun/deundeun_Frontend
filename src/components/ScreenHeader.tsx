import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { ArrowLeft, Search, Moon, Sun, Bell } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

interface ScreenHeaderProps {
  title?: string;
  /** Provide to render a back arrow on the left. */
  onBack?: () => void;
  /** Custom element rendered on the right side. If omitted, default action buttons are shown. */
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
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (variant === 'section') {
    return (
      <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
        <View style={styles.sectionHeaderLeft} />
        <Text style={[styles.sectionTitle, { color: theme.text }]} numberOfLines={1}>{title}</Text>
        <View style={styles.sectionHeaderRight}>
          {right ? (
            right
          ) : (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => navigation.navigate('SearchBrowse')} style={styles.actionBtn}>
                <Search color={theme.text} size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleDarkMode} style={styles.actionBtn}>
                {isDarkMode ? (
                  <Sun color={theme.text} size={20} />
                ) : (
                  <Moon color={theme.text} size={20} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.actionBtn}>
                <Bell color={theme.text} size={20} />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  sectionHeaderLeft: {
    width: 100,
  },
  sectionHeaderRight: {
    width: 100,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
});

export default ScreenHeader;
