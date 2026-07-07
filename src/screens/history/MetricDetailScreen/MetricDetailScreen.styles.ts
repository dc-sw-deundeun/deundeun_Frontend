import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  valueText: {
    fontSize: 38,
    fontWeight: '900',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sliderContainer: {
    height: 16,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  sliderBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
  },
  barSegment: {
    flex: 1,
    height: '100%',
  },
  sliderDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    marginTop: -4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  rangeTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  chartWrapper: {
    marginTop: SPACING.xs,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelCol: {
    alignItems: 'center',
    width: 50,
  },
  chartValText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  chartDateText: {
    fontSize: 9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  habitsList: {
    gap: SPACING.sm,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(71, 92, 58, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
