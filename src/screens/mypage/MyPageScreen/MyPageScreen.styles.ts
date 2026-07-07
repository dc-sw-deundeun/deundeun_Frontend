import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  menuGroup: {
    gap: SPACING.sm,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: SPACING.xs,
  },
  menuList: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDivider: {
    height: 1,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  toggleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  logoutBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
  deleteAccountBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  deleteAccountText: {
    color: '#8C897B',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  deleteModalContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: SPACING.md,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalDescriptionText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
    marginTop: SPACING.sm,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  confirmBtn: {
    backgroundColor: COLORS.error,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;
