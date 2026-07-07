import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  card: {
    padding: SPACING.lg,
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

export default styles;
