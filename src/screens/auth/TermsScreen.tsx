import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { authApi } from '@/api';
import { Alert, ActivityIndicator } from 'react-native';

export default function TermsScreen({ navigation }: RootStackScreenProps<'Terms'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [locationAgreed, setLocationAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAll = () => {
    const nextState = !allAgreed;
    setAllAgreed(nextState);
    setTermsAgreed(nextState);
    setPrivacyAgreed(nextState);
    setLocationAgreed(nextState);
  };

  const updateIndividual = (type: 'terms' | 'privacy' | 'location') => {
    let nextTerms = termsAgreed;
    let nextPrivacy = privacyAgreed;
    let nextLocation = locationAgreed;

    if (type === 'terms') nextTerms = !termsAgreed;
    if (type === 'privacy') nextPrivacy = !privacyAgreed;
    if (type === 'location') nextLocation = !locationAgreed;

    setTermsAgreed(nextTerms);
    setPrivacyAgreed(nextPrivacy);
    setLocationAgreed(nextLocation);

    if (nextTerms && nextPrivacy && nextLocation) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  const isNextEnabled = termsAgreed && privacyAgreed;

  const handleAgree = async () => {
    if (!isNextEnabled) return;
    setIsLoading(true);
    try {
      await authApi.agreePolicies({
        consents: [
          { consent_type: 'TERMS_OF_SERVICE', version: '1.0', agreed: termsAgreed },
          { consent_type: 'PRIVACY', version: '1.0', agreed: privacyAgreed },
          { consent_type: 'HEALTH_DATA', version: '1.0', agreed: locationAgreed }, // API assumes HEALTH_DATA for now or we map it
        ]
      });
      setIsLoading(false);
      // 약관 동의 후 기기 연동 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'DeviceSync' }],
      });
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('오류', '약관 동의 처리에 실패했습니다. 다시 시도해 주세요.');
    }
  };

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
          <TouchableOpacity
            style={[
              styles.allAgreeRow,
              { borderColor: allAgreed ? COLORS.primary : theme.border },
              allAgreed && { backgroundColor: COLORS.primaryLight }
            ]}
            onPress={toggleAll}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: allAgreed ? COLORS.primary : theme.textMuted },
                allAgreed && { backgroundColor: COLORS.primary }
              ]}
            >
              {allAgreed && <Check color="#ffffff" size={16} strokeWidth={3} />}
            </View>
            <Text style={[styles.allAgreeText, { color: allAgreed ? COLORS.primaryDark : theme.text }]}>
              약관에 모두 동의합니다
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Individual items */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => updateIndividual('terms')}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: termsAgreed ? COLORS.primary : theme.textMuted },
                termsAgreed && { backgroundColor: COLORS.primary }
              ]}
            >
              {termsAgreed && <Check color="#ffffff" size={14} strokeWidth={3} />}
            </View>
            <Text style={[styles.checkText, { color: theme.text }]}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>(필수)</Text> 서비스 이용약관
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => updateIndividual('privacy')}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: privacyAgreed ? COLORS.primary : theme.textMuted },
                privacyAgreed && { backgroundColor: COLORS.primary }
              ]}
            >
              {privacyAgreed && <Check color="#ffffff" size={14} strokeWidth={3} />}
            </View>
            <Text style={[styles.checkText, { color: theme.text }]}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>(필수)</Text> 개인정보 처리방침
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => updateIndividual('location')}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: locationAgreed ? COLORS.primary : theme.textMuted },
                locationAgreed && { backgroundColor: COLORS.primary }
              ]}
            >
              {locationAgreed && <Check color="#ffffff" size={14} strokeWidth={3} />}
            </View>
            <Text style={[styles.checkText, { color: theme.text }]}>
              <Text style={{ color: theme.textMuted }}>(선택)</Text> 위치 정보 이용 동의
            </Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  checklistContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  checkText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
