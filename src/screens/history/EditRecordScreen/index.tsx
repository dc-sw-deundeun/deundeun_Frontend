import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './EditRecordScreen.styles';
import { MetricEditCard } from './components/MetricEditCard';
import { useEditRecord } from './hooks/useEditRecord';

export default function EditRecordScreen({
  navigation,
  route,
}: RootStackScreenProps<'EditRecord'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const { recordId } = route.params;

  const { metrics, editState, setEditState, isLoadingData, isSaving, handleSave } =
    useEditRecord(recordId, () => navigation.goBack());

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
                {metrics.map(metric => (
                  <MetricEditCard
                    key={metric.metric_id}
                    metric={metric}
                    currentVal={editState[metric.metric_id] ?? ''}
                    onChangeValue={(v) =>
                      setEditState(prev => ({ ...prev, [metric.metric_id]: v }))
                    }
                    theme={theme}
                  />
                ))}
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
