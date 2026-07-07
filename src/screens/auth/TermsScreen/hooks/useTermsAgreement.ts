import { useState } from 'react';
import { Alert } from 'react-native';
import { authApi } from '@/api';
import { RootStackScreenProps } from '@/types/navigation';

// 약관 동의 체크 상태 및 제출 로직을 담당하는 훅
export const useTermsAgreement = (navigation: RootStackScreenProps<'Terms'>['navigation']) => {
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

  return {
    allAgreed,
    termsAgreed,
    privacyAgreed,
    locationAgreed,
    isLoading,
    isNextEnabled,
    toggleAll,
    updateIndividual,
    handleAgree,
  };
};

export default useTermsAgreement;
