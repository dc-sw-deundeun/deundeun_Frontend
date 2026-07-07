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
