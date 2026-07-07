import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';

// Navigation types
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

import { styles } from './HistoryScreen.styles';
import { RecordCard } from './components/RecordCard';
import { AddRecordSheet } from './components/AddRecordSheet';
import { useHistoryRecords } from './hooks/useHistoryRecords';

type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const { records, isLoading } = useHistoryRecords(navigation);
  const [isRecordSheetVisible, setIsRecordSheetVisible] = useState(false);

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
              records.map((record, index) => (
                <RecordCard
                  key={record.record_id}
                  record={record}
                  seq={records.length - index}
                  onPress={() => handleCardPress(record)}
                  theme={theme}
                />
              ))
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
      <AddRecordSheet
        visible={isRecordSheetVisible}
        onClose={() => setIsRecordSheetVisible(false)}
        onSelect={handleAddRecordSelect}
        isDarkMode={isDarkMode}
        theme={theme}
      />
    </SafeAreaView>
  );
}
