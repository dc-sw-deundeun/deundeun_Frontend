import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  introContainer: {
    paddingVertical: SPACING.xs,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  syncList: {
    gap: SPACING.md,
    flex: 1,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  securityNotice: {
    padding: SPACING.md,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default styles;
