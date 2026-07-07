import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  loadingText: { fontSize: 14 },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 48 },

  infoBox: {
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  infoText: { fontSize: 13, lineHeight: 20 },

  list: { gap: SPACING.md },
  metricCard: {},

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricName: { fontSize: 15, fontWeight: '700' },
  dirtyDot: { width: 7, height: 7, borderRadius: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  statusText: { fontSize: 11, fontWeight: '700' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 18,
    fontWeight: '700',
  },
  unitBox: {
    height: 48,
    paddingHorizontal: SPACING.sm,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 52,
  },
  unitText: { fontSize: 13, fontWeight: '600' },

  refText: { fontSize: 12, marginTop: 6 },
});

export default styles;
