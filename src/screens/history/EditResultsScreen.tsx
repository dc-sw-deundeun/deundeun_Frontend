import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { RootStackScreenProps } from '@/types/navigation';
import { recordsApi } from '@/api';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function EditResultsScreen({ navigation }: RootStackScreenProps<'EditResults'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Form States prefilled with wireframe values
  const [examDate, setExamDate] = useState('2023-10-27');
  const [bloodSugar, setBloodSugar] = useState('126');
  const [cholesterol, setCholesterol] = useState('232');
  const [bloodPressure, setBloodPressure] = useState('138/88');
  const [bmi, setBmi] = useState('23.4');
  const [isLoading, setIsLoading] = useState(false);

  // DatePicker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calYear, setCalYear] = useState(2023);
  const [calMonth, setCalMonth] = useState(9); // October
  const [selectedDay, setSelectedDay] = useState<number | null>(27);

  const getDaysInMonth = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= numberOfDays; i++) {
      days.push(i);
    }
    return days;
  };

  const calDays = getDaysInMonth(calYear, calMonth);
  const today = new Date();

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    setExamDate(`${calYear}-${mStr}-${dStr}`);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const bpParts = bloodPressure.split('/');
      const systolic = bpParts[0]?.trim() || null;
      const diastolic = bpParts[1]?.trim() || null;

      const metricsList = [];
      if (bloodSugar) {
        metricsList.push({
          metric_code: 'FastingBloodSugar',
          metric_name: '공복혈당',
          value: bloodSugar,
          unit: 'mg/dL',
          is_edited: true,
        });
      }
      if (cholesterol) {
        metricsList.push({
          metric_code: 'TotalCholesterol',
          metric_name: '총콜레스테롤',
          value: cholesterol,
          unit: 'mg/dL',
          is_edited: true,
        });
      }
      if (systolic) {
        metricsList.push({
          metric_code: 'SystolicBP',
          metric_name: '수축기혈압',
          value: systolic,
          unit: 'mmHg',
          is_edited: true,
        });
      }
      if (diastolic) {
        metricsList.push({
          metric_code: 'DiastolicBP',
          metric_name: '이완기혈압',
          value: diastolic,
          unit: 'mmHg',
          is_edited: true,
        });
      }
      if (bmi) {
        metricsList.push({
          metric_code: 'BMI',
          metric_name: 'BMI',
          value: bmi,
          unit: 'kg/m2',
          is_edited: true,
        });
      }

      const res = await recordsApi.createManualCheckup({
        measured_at: examDate ? `${examDate}T00:00:00Z` : null,
        metrics: metricsList,
      });

      setIsLoading(false);

      if (res.success) {
        Alert.alert('기록 저장 완료', '수동 검진 수치 데이터가 안전하게 저장되었습니다!', [
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
      } else {
        Alert.alert('저장 실패', res.message || '알 수 없는 이유로 저장에 실패했습니다.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Manual Save Error:', error);
      Alert.alert('오류', '검진 기록 저장 중 오류가 발생했습니다.');
    }
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
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.calOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <Card style={[styles.calCard, { backgroundColor: theme.card }]} radius={24}>
              {/* Month Navigation */}
              <View style={styles.calHeader}>
                <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
                  <ChevronLeft size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.calTitle, { color: theme.text }]}>
                  {calYear}년 {MONTHS[calMonth]}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
                  <ChevronRight size={22} color={theme.text} />
                </TouchableOpacity>
              </View>

              {/* Day Headers */}
              <View style={styles.calDayRow}>
                {DAYS.map((d, i) => (
                  <Text
                    key={d}
                    style={[
                      styles.calDayName,
                      { color: i === 0 ? COLORS.error : i === 6 ? COLORS.primary : theme.textMuted },
                    ]}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Day Grid */}
              <View style={styles.calGrid}>
                {calDays.map((day, i) => {
                  const isSelected = day !== null && day === selectedDay;
                  const isToday =
                    day === today.getDate() &&
                    calMonth === today.getMonth() &&
                    calYear === today.getFullYear();
                  const isSunday = i % 7 === 0;
                  const isSaturday = i % 7 === 6;

                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.calCell,
                        isSelected && { backgroundColor: COLORS.primary },
                        isToday && !isSelected && { borderWidth: 1.5, borderColor: COLORS.primary },
                      ]}
                      onPress={() => day && handleDaySelect(day)}
                      disabled={!day}
                    >
                      {day !== null && (
                        <Text
                          style={[
                            styles.calCellText,
                            {
                              color: isSelected
                                ? '#ffffff'
                                : isSunday
                                  ? COLORS.error
                                  : isSaturday
                                    ? COLORS.primary
                                    : theme.text,
                            },
                          ]}
                        >
                          {day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.calCancelBtn, { borderColor: theme.border }]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={[styles.calCancelText, { color: theme.textMuted }]}>취소</Text>
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
        </TouchableOpacity>
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
    flex: 1, // Stretch full width
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
  // Calendar styles
  calOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  calCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calNavBtn: {
    padding: SPACING.xs,
  },
  calTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  calDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  calDayName: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginVertical: 2,
  },
  calCellText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calCancelBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  calCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
