import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { useAppStore } from '@/store/useAppStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import Button from '@/components/Button';

export const DetailsScreen: React.FC<RootStackScreenProps<'Details'>> = ({ route, navigation }) => {
  const { itemId, otherParam } = route.params;
  const { isDarkMode } = useAppStore();

  const themeColors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>상세 보기</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.paramRow}>
          <Text style={[styles.label, { color: themeColors.textMuted }]}>아이템 ID:</Text>
          <Text style={[styles.value, { color: themeColors.text }]}>{itemId}</Text>
        </View>
        
        {otherParam && (
          <View style={styles.paramRow}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>전달된 메시지:</Text>
            <Text style={[styles.value, { color: themeColors.text }]}>{otherParam}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            title="뒤로 가기" 
            onPress={() => navigation.goBack()} 
            variant="outline"
            style={styles.button}
          />
          <Button 
            title="처음으로" 
            onPress={() => navigation.popToTop()} 
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
  },
  divider: {
    height: 1.5,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.3,
    marginVertical: SPACING.md,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
  },
  value: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  button: {
    flex: 0.48,
  },
});

export default DetailsScreen;
