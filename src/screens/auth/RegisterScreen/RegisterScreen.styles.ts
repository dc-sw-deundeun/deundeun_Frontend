import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
    minHeight: '85%',
  },
  titleContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  form: {
    flex: 1,
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  radioButton: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    width: 100,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    position: 'absolute',
    right: SPACING.md,
    top: 16,
    color: '#E53935',
    fontWeight: '600',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
