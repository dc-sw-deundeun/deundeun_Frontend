import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { RootStackScreenProps } from '@/types/navigation';
import { recordsApi, MetricResponse } from '@/api';

type EditState = Record<number, string>; // metric_id → edited value

export default function EditRecordScreen({
  navigation,
  route,
}: RootStackScreenProps<'EditRecord'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const { recordId } = route.params;

  const [metrics, setMetrics] = useState<MetricResponse[]>([]);
  const [editState, setEditState] = useState<EditState>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [recordId]);

  const loadMetrics = async () => {
    setIsLoadingData(true);
    try {
      const res = await recordsApi.getCheckup(recordId);
      if (res.success && res.data) {
        const items = res.data.metrics as MetricResponse[];
        setMetrics(items);
        const initial: EditState = {};
        items.forEach(m => {
          initial[m.metric_id] = m.value ?? '';
        });
        setEditState(initial);
      }
    } catch {
      Alert.alert('오류', '지표를 불러오지 못했습니다.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    const changed = metrics
      .filter(m => {
        const edited = editState[m.metric_id]?.trim();
        return edited !== '' && edited !== (m.value ?? '');
      })
      .map(m => ({
        metric_id: m.metric_id,
        value: editState[m.metric_id].trim(),
        unit: m.unit ?? null,
      }));

    if (changed.length === 0) {
      Alert.alert('변경 없음', '수정된 항목이 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await recordsApi.bulkUpdateMetrics(recordId, changed);
      if (res.success) {
        Alert.alert('수정 완료', `${changed.length}개 지표가 업데이트됐습니다.`, [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('오류', '수정에 실패했습니다.');
      }
    } catch {
      Alert.alert('오류', '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const statusColor = (s?: string | null) => {
    if (s === 'RISK') return COLORS.error;
    if (s === 'CAUTION') return COLORS.warning;
    if (s === 'NORMAL') return COLORS.success;
    return theme.textMuted;
  };

  const statusLabel = (s?: string | null) => {
    if (s === 'RISK') return '위험';
    if (s === 'CAUTION') return '경계';
    if (s === 'NORMAL') return '정상';
    return '-';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="검진 지표 수정"
        onBack={() => navigation.goBack()}
        right={
          isSaving ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Save
              size={22}
              color={COLORS.primary}
              onPress={handleSave}
            />
          )
        }
      />

      {isLoadingData ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            지표를 불러오는 중...
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: theme.textMuted }]}>
                수치를 탭해서 직접 수정하세요. 저장하면 분석이 재생성됩니다.
              </Text>
            </View>

            {metrics.length === 0 ? (
              <View style={styles.centered}>
                <Text style={{ color: theme.textMuted }}>수정할 지표가 없습니다.</Text>
              </View>
            ) : (
              <View style={styles.list}>
                {metrics.map(metric => {
                  const sc = statusColor(metric.status);
                  const sl = statusLabel(metric.status);
                  const currentVal = editState[metric.metric_id] ?? '';
                  const isDirty = currentVal.trim() !== (metric.value ?? '');

                  return (
                    <Card key={metric.metric_id} style={styles.metricCard}>
                      {/* 지표명 + 상태 배지 */}
                      <View style={styles.cardHeader}>
                        <Text style={[styles.metricName, { color: theme.text }]}>
                          {metric.metric_name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          {isDirty && (
                            <View style={[styles.dirtyDot, { backgroundColor: COLORS.warning }]} />
                          )}
                          <View style={[styles.statusBadge, { backgroundColor: sc + '18' }]}>
                            <Text style={[styles.statusText, { color: sc }]}>{sl}</Text>
                          </View>
                        </View>
                      </View>

                      {/* 입력 필드 */}
                      <View style={styles.inputRow}>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background,
                              borderColor: isDirty ? COLORS.primary : theme.border,
                              color: theme.text,
                            },
                          ]}
                          value={currentVal}
                          onChangeText={v =>
                            setEditState(prev => ({ ...prev, [metric.metric_id]: v }))
                          }
                          keyboardType="decimal-pad"
                          placeholder={metric.value ?? '-'}
                          placeholderTextColor={theme.textMuted}
                        />
                        {metric.unit && (
                          <View
                            style={[styles.unitBox, { backgroundColor: theme.background }]}
                          >
                            <Text style={[styles.unitText, { color: theme.textMuted }]}>
                              {metric.unit}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* 참고 범위 */}
                      {(metric.reference_min !== null || metric.reference_max !== null) && (
                        <Text style={[styles.refText, { color: theme.textMuted }]}>
                          참고 범위: {metric.reference_min ?? '?'} ~ {metric.reference_max ?? '?'}{' '}
                          {metric.unit ?? ''}
                        </Text>
                      )}
                    </Card>
                  );
                })}
              </View>
            )}

            <Button
              title={isSaving ? '저장 중...' : '수정 사항 저장'}
              onPress={handleSave}
              loading={isSaving}
              style={{ marginTop: SPACING.md }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  loadingText: { fontSize: 14 },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 48 },

  infoBox: {
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  infoText: { fontSize: 13, lineHeight: 20 },

  list: { gap: SPACING.md },
  metricCard: {},

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricName: { fontSize: 15, fontWeight: '700' },
  dirtyDot: { width: 7, height: 7, borderRadius: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  statusText: { fontSize: 11, fontWeight: '700' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 18,
    fontWeight: '700',
  },
  unitBox: {
    height: 48,
    paddingHorizontal: SPACING.sm,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 52,
  },
  unitText: { fontSize: 13, fontWeight: '600' },

  refText: { fontSize: 12, marginTop: 6 },
});
