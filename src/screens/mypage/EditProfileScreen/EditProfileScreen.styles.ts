import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  titleContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
  },
  formContainer: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    paddingLeft: 4,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    fontWeight: '500',
  },
  footerContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;
