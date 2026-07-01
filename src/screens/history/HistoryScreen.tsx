import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight, Calendar, Upload, PenTool } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { recordsApi } from '@/api';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

const formatDisplayDate = (rawStr?: string) => {
  if (!rawStr) return '날짜 없음';
  const d = rawStr.split('T')[0];
  const parts = d.split('-');
  if (parts.length >= 2) {
    return `${parts[0]}년 ${parseInt(parts[1])}월`;
  }
  return rawStr;
};

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecordSheetVisible, setIsRecordSheetVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecords();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await recordsApi.listCheckups(1, 50);
      if (res.success && res.data) {
        const items = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
            ? res.data.items
            : [];
        const sorted = [...items].sort((a, b) => {
          const ad = a.measured_at || a.created_at || '';
          const bd = b.measured_at || b.created_at || '';
          return bd.localeCompare(ad);
        });
        setRecords(sorted);
      }
    } catch (e) {
      console.warn('검진 기록 목록 조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (record: any) => {
    navigation.navigate('HealthReport', {
      recordId: record.record_id,
    });
  };

  const handleAddRecordSelect = (action: 'camera' | 'manual' | 'gallery') => {
    setIsRecordSheetVisible(false);
    if (action === 'manual') {
      navigation.navigate('EditResults');
    } else {
      navigation.navigate('CheckupOcr');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="검진 기록" variant="section" />
        <View style={styles.scrollContent}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>나의 과거 검진 내역</Text>

          <View style={styles.recordList}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 32 }} />
            ) : records.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: theme.textMuted, fontSize: 15 }}>아직 저장된 검진 내역이 없어요</Text>
              </View>
            ) : (
              records.map((record, index) => {
                const isVerified = record.verification_status === 'VERIFIED';
                const dateText = formatDisplayDate(record.measured_at || record.created_at);
                const seq = records.length - index;

                return (
                  <Card
                    key={record.record_id}
                    style={styles.recordCard}
                    onPress={() => handleCardPress(record)}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.cardInfoLeft}>
                        <Calendar size={18} color={COLORS.primary} style={{ marginRight: 4 }} />
                        <Text style={[styles.cardDate, { color: theme.text }]}>
                          {dateText} <Text style={{ color: theme.textMuted, fontWeight: '500' }}>· {seq}차</Text>
                        </Text>
                      </View>
                      <ChevronRight size={18} color={theme.textMuted} />
                    </View>

                    <Text style={[styles.hospitalText, { color: theme.textMuted }]}>
                      {record.source_type === 'OCR' ? 'OCR 분석 검진표' : '수동 입력 기록'}
                    </Text>

                    {/* Badges row */}
                    <View style={styles.badgesRow}>
                      <View 
                        style={[
                          styles.badge, 
                          { 
                            backgroundColor: (isVerified ? COLORS.success : COLORS.warning) + '15' 
                          }
                        ]}
                      >
                        <Text style={[styles.badgeText, { color: isVerified ? COLORS.success : COLORS.warning }]}>
                          {isVerified ? '검수완료' : '검수대기'}
                        </Text>
                      </View>

                      <View style={[styles.badge, { backgroundColor: COLORS.primary + '12' }]}>
                        <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                          지표 {record.metric_count ?? 0}개
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })
            )}
          </View>
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
          <View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                borderWidth: 1,
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
              }
            ]}
          >
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
                <View style={[styles.actionIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(71,92,58,0.08)' }]}>
                  <Upload color={COLORS.primary} size={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>검진결과 업로드</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    사진을 찍으면 인공지능이 수치를 자동 분석해요.
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.modalDivider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() => handleAddRecordSelect('manual')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(71,92,58,0.08)' }]}>
                  <PenTool color={COLORS.primary} size={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionSheetTitle, { color: theme.text }]}>직접 입력하기</Text>
                  <Text style={[styles.actionSheetDesc, { color: theme.textMuted }]}>
                    수치를 손으로 직접 입력하여 기록할게요.
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
  scrollContainer: {
    paddingBottom: 170, // Leave room for tab bar and floating button
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recordList: {
    gap: SPACING.md,
  },
  recordCard: {},
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
    bottom: 92, // Positioned above the 76px bottom tab bar
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDivider: {
    height: 1,
    width: '100%',
  },
});
