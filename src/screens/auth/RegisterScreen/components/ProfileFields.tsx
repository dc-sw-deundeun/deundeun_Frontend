import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { styles } from '../RegisterScreen.styles';

interface ProfileFieldsProps {
  nickname: string;
  onChangeNickname: (val: string) => void;
  sex: 'MALE' | 'FEMALE' | '';
  onChangeSex: (val: 'MALE' | 'FEMALE') => void;
  theme: { card: string; border: string; text: string; textMuted: string };
}

export const ProfileFields: React.FC<ProfileFieldsProps> = ({
  nickname,
  onChangeNickname,
  sex,
  onChangeSex,
  theme,
}) => {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>닉네임</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="사용하실 닉네임을 입력해 주세요"
          placeholderTextColor={theme.textMuted}
          value={nickname}
          onChangeText={onChangeNickname}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>성별</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              {
                backgroundColor: sex === 'MALE' ? COLORS.primary : theme.card,
                borderColor: sex === 'MALE' ? COLORS.primary : theme.border,
              },
            ]}
            onPress={() => onChangeSex('MALE')}
          >
            <Text
              style={[
                styles.radioText,
                { color: sex === 'MALE' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              남성
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              {
                backgroundColor: sex === 'FEMALE' ? COLORS.primary : theme.card,
                borderColor: sex === 'FEMALE' ? COLORS.primary : theme.border,
              },
            ]}
            onPress={() => onChangeSex('FEMALE')}
          >
            <Text
              style={[
                styles.radioText,
                { color: sex === 'FEMALE' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              여성
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProfileFields;
