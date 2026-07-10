import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import ScreenHeader from '@/components/ScreenHeader';
import { styles } from './TermsScreen.styles';
import { AllAgreeRow } from './components/AllAgreeRow';
import { TermsCheckRow } from './components/TermsCheckRow';
import { useTermsAgreement } from './hooks/useTermsAgreement';

export default function TermsScreen({ navigation }: RootStackScreenProps<'Terms'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
    allAgreed,
    termsAgreed,
    privacyAgreed,
    locationAgreed,
    isLoading,
    isNextEnabled,
    toggleAll,
    updateIndividual,
    handleAgree,
  } = useTermsAgreement(navigation);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>약관 동의</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            서비스 이용을 위해 약관에 동의해 주세요.{"\n"}
            필수 약관에 동의하시면 든든을 시작할 수 있어요.
          </Text>
        </View>

        {/* Checklist */}
        <View style={styles.checklistContainer}>
          <AllAgreeRow allAgreed={allAgreed} onPress={toggleAll} theme={theme} />

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Individual items */}
          <TermsCheckRow
            checked={termsAgreed}
            onPress={() => updateIndividual('terms')}
            theme={theme}
            details={'제1조(목적)\n본 약관은 든든 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조(정의)\n1. \'서비스\'란 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 \'회원\'이 이용할 수 있는 든든 및 든든 관련 제반 서비스를 의미합니다.\n2. \'회원\'이란 회사의 \'서비스\'에 접속하여 본 약관에 따라 \'회사\'와 이용계약을 체결하고 \'회사\'가 제공하는 \'서비스\'를 이용하는 고객을 말합니다.'}
            label={
              <>
                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>(필수)</Text> 서비스 이용약관
              </>
            }
          />

          <TermsCheckRow
            checked={privacyAgreed}
            onPress={() => updateIndividual('privacy')}
            theme={theme}
            details={'1. 수집하는 개인정보의 항목\n회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초 회원가입 당시 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다.\n- 필수항목: 이메일 주소, 비밀번호, 이름\n\n2. 개인정보의 수집 및 이용 목적\n가. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산\n나. 회원관리'}
            label={
              <>
                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>(필수)</Text> 개인정보 처리방침
              </>
            }
          />

          <TermsCheckRow
            checked={locationAgreed}
            onPress={() => updateIndividual('location')}
            theme={theme}
            details={'위치기반서비스 이용약관\n\n제 1 조 (목적)\n본 약관은 회사가 제공하는 위치기반서비스와 관련하여 회사와 개인위치정보주체와의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제 2 조 (이용약관의 효력 및 변경)\n본 약관은 이용자가 본 약관에 동의하고 회사가 정한 소정의 절차에 따라 위치기반서비스의 이용자로 등록함으로써 효력이 발생합니다.'}
            label={
              <>
                <Text style={{ color: theme.textMuted }}>(선택)</Text> 위치 정보 이용 동의
              </>
            }
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isNextEnabled && !isLoading ? COLORS.primary : theme.disabledBg }
          ]}
          disabled={!isNextEnabled || isLoading}
          onPress={handleAgree}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={[
              styles.submitButtonText,
              { color: isNextEnabled ? '#ffffff' : theme.disabledText }
            ]}>
              동의하고 시작하기
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
