import { StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  checklistContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  checkText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
