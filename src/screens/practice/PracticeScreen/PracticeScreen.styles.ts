import { StyleSheet } from 'react-native';
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
    borderRadius: 24,
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: '#C9852E',
    fontSize: 12,
    fontWeight: '800',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayCell: {
    alignItems: 'center',
    gap: 6,
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekDateSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionProgressText: {
    fontSize: 13,
    fontWeight: '800',
  },
  missionList: {
    gap: 12,
  },
  missionCard: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
    height: 80,
  },
  cardLeftAccent: {
    width: 6,
    height: '100%',
  },
  missionCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  missionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionTextGroup: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  missionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  missionCardPoints: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifyButton: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  completedBtnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
  },
  completedBtnText: {
    color: '#5B744C',
    fontSize: 13,
    fontWeight: '800',
  },
  achievementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  achievementPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  monthSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthArrow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  monthArrowText: {
    fontSize: 12,
    fontWeight: '800',
  },
  calendarMonthText: {
    fontSize: 14,
    fontWeight: '800',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDayLabelCell: {
    width: '14.28%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  calendarCellEmpty: {
    width: '14.28%',
    height: 44,
  },
  calendarCellWrapper: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFilled: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleEmpty: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarCellTextWhite: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  calendarCellTextGreen: {
    fontSize: 12,
    fontWeight: '800',
  },
  calendarCellTextDefault: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerFoxContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foxDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9852E',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalInnerContainer: {
    width: '100%',
    gap: 8,
  },
  modalOptionsCard: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitleText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  modalIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalOptionDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    width: '100%',
  },
  modalCancelCard: {
    height: 54,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalCancelText: {
    color: '#B3463B',
    fontSize: 16,
    fontWeight: '800',
  },
  inlineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inlineMissionList: {
    width: '100%',
  },
  dayDetailMissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayDetailMissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayDetailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dayDetailBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  glassShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '250%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '25deg' }, { translateX: 20 }, { translateY: -40 }],
  },
});

export default styles;
