import { useState, useEffect } from 'react';
import { recordsApi } from '@/api';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '@/types/navigation';

type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

// 검진 기록 목록 조회를 담당하는 훅 (화면 포커스 시 재조회)
export const useHistoryRecords = (navigation: HistoryScreenProps['navigation']) => {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return { records, isLoading };
};

export default useHistoryRecords;
