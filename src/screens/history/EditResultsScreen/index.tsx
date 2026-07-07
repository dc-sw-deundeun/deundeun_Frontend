import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Calendar } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './EditResultsScreen.styles';
import { DatePickerModal } from './components/DatePickerModal';
import { useCalendarPicker } from './hooks/useCalendarPicker';
import { useManualCheckupForm } from './hooks/useManualCheckupForm';

export default function EditResultsScreen({ navigation }: RootStackScreenProps<'EditResults'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
    examDate,
    setExamDate,
    bloodSugar,
    setBloodSugar,
    cholesterol,
    setCholesterol,
    bloodPressure,
    setBloodPressure,
    bmi,
    setBmi,
    isLoading,
    handleSave,
  } = useManualCheckupForm(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'History' } }],
    });
  });

  const {
    showDatePicker,
    setShowDatePicker,
    calYear,
    calMonth,
    selectedDay,
    calDays,
    prevMonth,
    nextMonth,
    handleDaySelect,
  } = useCalendarPicker(setExamDate);

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
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    justifyContent: 'center',
                    paddingHorizontal: SPACING.md,
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>{examDate || '날짜를 선택해 주세요'}</Text>
                  <Calendar size={18} color={theme.textMuted} />
                </View>
              </TouchableOpacity>
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
              style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Check color="#ffffff" size={20} style={{ marginRight: 6 }} />
                  <Text style={styles.primaryBtnText}>저장하기</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DatePicker Calendar Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        calYear={calYear}
        calMonth={calMonth}
        calDays={calDays}
        selectedDay={selectedDay}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onDaySelect={handleDaySelect}
        theme={theme}
      />
    </SafeAreaView>
  );
}
