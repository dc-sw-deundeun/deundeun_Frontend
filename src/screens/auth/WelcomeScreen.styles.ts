import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  characterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  characterWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  characterEmoji: {
    fontSize: 88,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  characterName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    width: 240,
    marginTop: SPACING.xs,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  levelBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelBarFill: {
    width: '10%', // starts at level 1 0%
    height: '100%',
    borderRadius: 4,
  },
  levelPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
