import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    justifyContent: 'space-between',
    minHeight: '85%',
  },
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF6ED',
    borderWidth: 1,
    borderColor: '#F2E3C6',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#B0833C',
    fontWeight: '600',
  },
  form: {
    gap: SPACING.lg,
    flex: 1,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C897B',
    paddingLeft: 4,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    fontWeight: '500',
  },
  flexInput: {
    flex: 1,
  },
  timerInputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  timerInput: {
    width: '100%',
    paddingRight: 55,
  },
  timerText: {
    position: 'absolute',
    right: SPACING.md,
    color: '#D05C4C',
    fontWeight: '700',
    fontSize: 14,
  },
  inlineBtn: {
    height: 52,
    width: 85,
    borderWidth: 1.5,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  inlineBtnSubmit: {
    height: 52,
    width: 68,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineBtnSubmitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  successCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingLeft: 4,
  },
  successCheckText: {
    fontSize: 12,
    color: '#5F8557',
    fontWeight: '700',
  },
  requirementsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: 4,
    paddingLeft: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '700',
  },
  passwordConfirmWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  confirmInput: {
    paddingRight: 40,
  },
  checkIconInInput: {
    position: 'absolute',
    right: SPACING.md,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  // 성공 모달 스타일링
  modalOverlay: {
    flex: 1,
    backgroundColor: '#8FA480', // 시안과 동일한 카키/올리브 톤 전면 배경
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FAF9F5', // 연베이지 톤의 모달 바디 카드
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1C',
    textAlign: 'center',
    marginTop: 8,
  },
  circleCheckWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#D4E2CD',
    backgroundColor: '#FAF9F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  modalDescContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  modalDescIcon: {
    fontSize: 14,
  },
  modalDescText: {
    fontSize: 12,
    color: '#4F6049',
    fontWeight: '700',
  },
  modalSubmitBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#3D4C3A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;
