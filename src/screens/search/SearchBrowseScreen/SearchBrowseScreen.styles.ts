import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    padding: 0,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  initialState: {
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    paddingLeft: SPACING.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsState: {
    gap: SPACING.md,
  },
  resultCard: {
    gap: SPACING.sm,
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  resultBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  myStatsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLeft: {
    gap: 2,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  statsLinkBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  explanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
  },
  explanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  explanTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  explanDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    fontSize: 16,
    fontWeight: '800',
  },
  explanBody: {
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  explanValueTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  explanStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  explanStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  explanParagraph: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  dosDontsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    width: '100%',
  },
  boxCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.sm,
    gap: 4,
  },
  boxHeader: {
    fontSize: 12,
    fontWeight: '700',
  },
  boxText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },
  sheetActionBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
