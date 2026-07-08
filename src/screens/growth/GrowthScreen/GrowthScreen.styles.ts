import { StyleSheet, Platform } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    padding: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressRatio: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressHelpText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1.5,
    marginVertical: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  statInfo: {
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
  },
  companionsSection: {
    gap: SPACING.md,
  },
  companionsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  companionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  companionCard: {
    width: '30.5%',
    aspectRatio: 0.72,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companionImage: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
    ...Platform.select({
      web: {
        imageRendering: 'auto',
      },
    }) as any,
  },
  nameAndLevelColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  companionName: {
    fontSize: 15,
    fontWeight: '700',
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  imageOverlayContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
