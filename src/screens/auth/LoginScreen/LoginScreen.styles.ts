import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

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
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: SPACING.md,
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
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default styles;
