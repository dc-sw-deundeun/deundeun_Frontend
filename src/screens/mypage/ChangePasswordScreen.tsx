import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Check, AlertCircle } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { setAccessToken } from '@/api/client';
import { RootStackScreenProps } from '@/types/navigation';

export default function ChangePasswordScreen({ navigation }: RootStackScreenProps<'ChangePassword'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 상태 변수
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0); // 초 단위
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 타이머 작동 Effect
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isCodeSent && !isCodeVerified) {
      Alert.alert('인증 시간 초과', '인증 시간이 초과되었습니다. 다시 인증요청을 해주세요.');
      setIsCodeSent(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, isCodeSent, isCodeVerified]);

  // 접속한 유저의 이메일을 초기 기본값으로 자동 완성
  useEffect(() => {
    const fetchMyEmail = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data && res.data.email) {
          setEmail(res.data.email);
        }
      } catch (e) {
        console.error('로그인한 이메일 조회 실패:', e);
      }
    };
    fetchMyEmail();
  }, []);

  // 타이머 포맷팅 (mm:ss)
  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // 1. 인증요청 버튼 클릭 핸들러
  const handleRequestVerify = async () => {
    if (!email) {
      Alert.alert('이메일 입력', '이메일을 먼저 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      await authApi.requestPasswordReset({ email });
      setIsCodeSent(true);
      setIsCodeVerified(false);
      setCode('');
      setTimer(180); // 3분 타이머 시작
      Alert.alert('인증코드 발송', '비밀번호 재설정 인증코드가 발송되었습니다.\n로컬 백엔드 서버 콘솔 창에서 6자리 코드를 확인해 주세요.');
    } catch (error) {
      console.error('인증요청 실패:', error);
      Alert.alert('오류', '인증코드 요청 중 오류가 발생했습니다. 이메일을 다시 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 2. 인증코드 확인 버튼 클릭 핸들러 (로컬 체크 처리)
  // 백엔드 구조상 confirmEmailVerify를 호출해버리면 코드가 소모(verified_at 기록)되어,
  // 이후 confirmPasswordReset 단계에서 같은 코드를 재검증할 때 400 Bad Request가 발생합니다.
  // 따라서 인증번호 자릿수 검증을 로컬에서 우선 성공 처리한 후,
  // 최종 비밀번호 변경 시점에 백엔드에서 원스톱으로 코드를 검증하도록 설계합니다.
  const handleConfirmVerify = () => {
    if (!code || code.length < 6) {
      Alert.alert('인증 실패', '인증번호 6자리를 올바르게 입력해 주세요.');
      return;
    }
    setIsCodeVerified(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // 비밀번호 복잡도 체크
  const isLengthValid = newPassword.length >= 8;
  const isPatternValid =
    /[a-zA-Z]/.test(newPassword) && // 영문 포함
    /[0-9]/.test(newPassword) && // 숫자 포함
    /[^a-zA-Z0-9]/.test(newPassword); // 특수문자 포함

  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  // 전체 폼 제출 가능 상태
  const canSubmit = isCodeVerified && isLengthValid && isPatternValid && isMatchValid;

  // 3. 비밀번호 변경 완료 버튼 클릭 핸들러
  const handleCompleteChange = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await authApi.confirmPasswordReset({
        email,
        code,
        new_password: newPassword,
      });
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      const errorMsg = error?.response?.data?.message || '';
      if (errorMsg.includes('동일한 비밀번호') || String(error).includes('SamePasswordException')) {
        Alert.alert('변경 실패', '기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.');
      } else {
        Alert.alert('인증 실패', '인증번호가 일치하지 않거나 만료되었습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 성공 모달 닫기 -> 토큰을 완전히 만료/클리어하고 로그인 화면으로 리셋 이동
  const handleModalClose = async () => {
    setSuccessModalVisible(false);
    await storage.clearTokens();
    setAccessToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScreenHeader title="비밀번호 변경" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {/* 가이드 배너 */}
            <View style={styles.bannerContainer}>
              <Lock size={18} color="#D09C4A" />
              <Text style={styles.bannerText}>
                안전을 위해 영문·숫자·특수문자를 섞어 8자 이상으로 설정해 주세요.
              </Text>
            </View>

            {/* 입력 폼 */}
            <View style={styles.form}>
              {/* 이메일 입력 그룹 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
                <View style={styles.inlineRow}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.flexInput,
                      { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }
                    ]}
                    placeholder="예: youngsoon@deundeun.kr"
                    placeholderTextColor={theme.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isCodeVerified}
                  />
                  <TouchableOpacity
                    style={[
                      styles.inlineBtn,
                      { borderColor: isCodeVerified ? theme.border : COLORS.primary }
                    ]}
                    onPress={handleRequestVerify}
                    disabled={isCodeVerified || loading}
                  >
                    <Text style={[
                      styles.inlineBtnText,
                      { color: isCodeVerified ? theme.textMuted : '#354B33' }
                    ]}>
                      {isCodeSent ? '재요청' : '인증요청'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 인증번호 입력 그룹 */}
              {isCodeSent && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>인증번호</Text>
                  <View style={styles.inlineRow}>
                    <View style={styles.timerInputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.timerInput,
                          { backgroundColor: theme.card, borderColor: isCodeVerified ? '#8FA480' : theme.border, color: theme.text }
                        ]}
                        placeholder="인증번호 6자리 입력"
                        placeholderTextColor={theme.textMuted}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isCodeVerified}
                      />
                      {!isCodeVerified && timer > 0 && (
                        <Text style={styles.timerText}>{formatTimer(timer)}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inlineBtnSubmit,
                        { backgroundColor: isCodeVerified ? theme.disabledBg : '#3D4C3A' }
                      ]}
                      onPress={handleConfirmVerify}
                      disabled={isCodeVerified || !code || loading}
                    >
                      <Text style={styles.inlineBtnSubmitText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  {isCodeVerified && (
                    <View style={styles.successCheckRow}>
                      <Check size={14} color="#5F8557" />
                      <Text style={styles.successCheckText}>인증되었어요</Text>
                    </View>
                  )}
                </View>
              )}

              {/* 새 비밀번호 입력 그룹 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>새 비밀번호</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }
                  ]}
                  placeholder="새 비밀번호 입력"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={isCodeVerified}
                />
                <View style={styles.requirementsRow}>
                  <View style={styles.requirementItem}>
                    <Check size={14} color={isLengthValid ? '#5F8557' : '#999999'} />
                    <Text style={[styles.requirementText, { color: isLengthValid ? '#5F8557' : '#999999' }]}>
                      8자 이상
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Check size={14} color={isPatternValid ? '#5F8557' : '#999999'} />
                    <Text style={[styles.requirementText, { color: isPatternValid ? '#5F8557' : '#999999' }]}>
                      영문·숫자·특수문자
                    </Text>
                  </View>
                </View>
              </View>

              {/* 새 비밀번호 확인 입력 그룹 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>새 비밀번호 확인</Text>
                <View style={styles.passwordConfirmWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.confirmInput,
                      {
                        backgroundColor: theme.card,
                        borderColor: isMatchValid ? '#8FA480' : theme.border,
                        color: theme.text
                      }
                    ]}
                    placeholder="새 비밀번호 다시 입력"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={isCodeVerified}
                  />
                  {isMatchValid && (
                    <View style={styles.checkIconInInput}>
                      <Check size={18} color="#5F8557" />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* 변경 완료 버튼 */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: canSubmit ? '#3D4C3A' : theme.disabledBg }
            ]}
            disabled={!canSubmit || loading}
            onPress={handleCompleteChange}
          >
            <Text style={[styles.submitButtonText, { color: canSubmit ? '#ffffff' : theme.disabledText }]}>
              비밀번호 변경 완료
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 비밀번호 변경 완료 성공 모달 */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard} padding={SPACING.xl} radius={28}>
            <Text style={styles.modalTitle}>비밀번호가 변경되었습니다.</Text>

            {/* 큰 체크박스 아이콘 */}
            <View style={styles.circleCheckWrapper}>
              <Check size={48} color="#5F8557" />
            </View>

            <View style={styles.modalDescContainer}>
              <Text style={styles.modalDescText}>변경된 비밀번호로 재로그인 바랍니다.</Text>
            </View>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleModalClose}
            >
              <Text style={styles.modalSubmitBtnText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
