import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight, Calendar } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface ExamRecord {
  id: number;
  date: string;
  count: string;
  hospital: string;
  bloodSugar: number;
  bloodSugarStatus: '정상' | '경계' | '주의';
  bloodPressure: string;
  bloodPressureStatus: '정상' | '경계' | '주의';
  cholesterol: number;
  bmi: number;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [records, setRecords] = useState<ExamRecord[]>([
    {
      id: 1,
      date: '2023년 10월',
      count: '1차',
      hospital: '든든내과의원',
      bloodSugar: 126,
      bloodSugarStatus: '주의',
      bloodPressure: '138/88',
      bloodPressureStatus: '경계',
      cholesterol: 232,
      bmi: 23.4,
    },
    {
      id: 2,
      date: '2022년 09월',
      count: '1차',
      hospital: '한빛검진센터',
      bloodSugar: 118,
      bloodSugarStatus: '경계',
      bloodPressure: '120/80',
      bloodPressureStatus: '정상',
      cholesterol: 198,
      bmi: 23.4,
    },
    {
      id: 3,
      date: '2021년 08월',
      count: '1차',
      hospital: '든든내과의원',
      bloodSugar: 98,
      bloodSugarStatus: '정상',
      bloodPressure: '115/75',
      bloodPressureStatus: '정상',
      cholesterol: 185,
      bmi: 22.8,
    },
  ]);

  const [isRecordSheetVisible, setIsRecordSheetVisible] = useState(false);

  const getStatusColor = (status: '정상' | '경계' | '주의') => {
    if (status === '정상') return COLORS.success;
    if (status === '경계') return COLORS.warning;
    return COLORS.error;
  };

  const handleCardPress = (record: ExamRecord) => {
    navigation.navigate('HealthReport', {
      date: record.date,
      bloodSugar: record.bloodSugar,
      bloodPressure: record.bloodPressure,
      cholesterol: record.cholesterol,
      bmi: record.bmi,
    });
  };

  const handleAddRecordSelect = (action: 'camera' | 'manual' | 'gallery') => {
    setIsRecordSheetVisible(false);
    if (action === 'manual') {
      navigation.navigate('EditResults');
    } else {
      Alert.alert('검진 결과지 등록', '데모 앱으로, 확인 완료 시 수동 입력 화면으로 전환됩니다.');
      navigation.navigate('EditResults');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScreenHeader title="검진 기록" variant="section" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>나의 과거 검진 내역</Text>

        <View style={styles.recordList}>
          {records.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={[styles.recordCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => handleCardPress(record)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardInfoLeft}>
                  <Calendar size={18} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.cardDate, { color: theme.text }]}>
                    {record.date} <Text style={{ color: theme.textMuted }}>· {record.count}</Text>
                  </Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>

              <Text style={[styles.hospitalText, { color: theme.textMuted }]}>
                {record.hospital}
              </Text>

              {/* Badges row */}
              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: getStatusColor(record.bloodSugarStatus) + '15' }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(record.bloodSugarStatus) }]}>
                    공복혈당 {record.bloodSugar} · {record.bloodSugarStatus}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: getStatusColor(record.bloodPressureStatus) + '15' }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(record.bloodPressureStatus) }]}>
                    혈압 {record.bloodPressure} · {record.bloodPressureStatus}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.floatingBtn, { backgroundColor: COLORS.primary }]}
        onPress={() => setIsRecordSheetVisible(true)}
      >
        <Plus color="#ffffff" size={24} />
      </TouchableOpacity>

      {/* Record Addition Action Sheet */}
      <Modal
        visible={isRecordSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRecordSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>무엇을 추가할까요?</Text>
              <TouchableOpacity onPress={() => setIsRecordSheetVisible(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>취소</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionSheetList}>
              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('camera')}
              >
                <Text style={styles.actionSheetEmoji}>📸</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>검진 결과지 촬영</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    사진을 찍으면 인공지능이 수치를 자동 분석해요.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('manual')}
              >
                <Text style={styles.actionSheetEmoji}>✍️</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>직접 입력하기</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    수치를 손으로 직접 입력하여 기록할게요.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('gallery')}
              >
                <Text style={styles.actionSheetEmoji}>🖼️</Text>
                <View>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>이미지 불러오기</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    기기 갤러리에 저장된 결과지 사진을 불러옵니다.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingBottom: 100, // Leave room for floating button
    gap: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recordList: {
    gap: SPACING.md,
  },
  recordCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '800',
  },
  hospitalText: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SPACING.md,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  actionSheetList: {
    gap: SPACING.md,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  actionSheetEmoji: {
    fontSize: 28,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionSheetDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
