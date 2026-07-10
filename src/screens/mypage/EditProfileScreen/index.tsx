import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { myApi } from '@/api';
import { styles } from './EditProfileScreen.styles';

export default function EditProfileScreen({ route, navigation }: RootStackScreenProps<'EditProfile'>) {
  const { isDarkMode, showAlert } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const initialNickname = route.params?.nickname || '';
  const email = route.params?.email || '';

  const [nickname, setNickname] = useState(initialNickname);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nickname.trim()) {
      showAlert('알림', '닉네임을 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      await myApi.updateProfile({ nickname: nickname.trim() });
      showAlert('성공', '프로필이 수정되었습니다.', () => {
        navigation.goBack();
      });
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      showAlert('오류', '프로필 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = nickname.trim().length > 0 && nickname.trim() !== initialNickname;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="프로필 수정" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>내 정보 수정</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              든든에서 사용할 닉네임을 변경할 수 있어요.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>이메일</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.disabledBg, 
                    borderColor: theme.border,
                    color: theme.disabledText 
                  }
                ]}
                value={email}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>닉네임</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.card, 
                    borderColor: theme.border,
                    color: theme.text 
                  }
                ]}
                value={nickname}
                onChangeText={setNickname}
                placeholder="새 닉네임 입력"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? COLORS.primary : theme.disabledBg }
            ]}
            disabled={!isFormValid || loading}
            onPress={handleSave}
          >
            {loading ? (
              <ActivityIndicator color={isFormValid ? '#ffffff' : theme.disabledText} />
            ) : (
              <Text style={[
                styles.submitButtonText,
                { color: isFormValid ? '#ffffff' : theme.disabledText }
              ]}>
                저장하기
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
