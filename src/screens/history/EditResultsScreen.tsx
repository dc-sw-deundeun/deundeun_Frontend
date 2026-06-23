import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Check } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';

export default function EditResultsScreen({ navigation }: RootStackScreenProps<'EditResults'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Form States prefilled with wireframe values
  const [examDate, setExamDate] = useState('2023-10-27');
  const [bloodSugar, setBloodSugar] = useState('126');
  const [cholesterol, setCholesterol] = useState('232');
  const [bloodPressure, setBloodPressure] = useState('138/88');
  const [bmi, setBmi] = useState('23.4');

  const handleSave = () => {
    // Show mock confirmation
    Alert.alert('기록 저장 완료', '수정된 검진 수치 데이터가 안전하게 저장되었습니다!', [
      {
        text: '확인',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'History' } }],
          });
        },
      },
    ]);
  };

  const handleRetake = () => {
    Alert.alert('카메라 촬영', '카메라를 실행하여 결과지를 촬영하는 가짜 기능 데모입니다.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title="검사 결과 확인 · 수정" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>결과 정보 확인</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              인식된 값을 확인하고, 틀린 값은 눌러서 수정하세요.
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.form}>
            {/* Exam Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>검진일</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                value={examDate}
                onChangeText={setExamDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Blood Sugar */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>공복혈당 (mg/dL)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                value={bloodSugar}
                onChangeText={setBloodSugar}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Cholesterol */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>총콜레스테롤 (mg/dL)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                value={cholesterol}
                onChangeText={setCholesterol}
                keyboardType="numeric"
                placeholder="200"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Blood Pressure */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>혈압 (수축기/이완기 mmHg)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                value={bloodPressure}
                onChangeText={setBloodPressure}
                placeholder="120/80"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* BMI */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>체질량지수 (BMI kg/㎡)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                value={bmi}
                onChangeText={setBmi}
                keyboardType="decimal-pad"
                placeholder="22.5"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: theme.border }]}
              onPress={handleRetake}
            >
              <Camera color={theme.text} size={20} style={{ marginRight: 6 }} />
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>다시 촬영</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleSave}
            >
              <Check color="#ffffff" size={20} style={{ marginRight: 6 }} />
              <Text style={styles.primaryBtnText}>확인하고 저장</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  titleContainer: {
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
  },
  form: {
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  secondaryBtn: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryBtn: {
    flex: 1.5,
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
