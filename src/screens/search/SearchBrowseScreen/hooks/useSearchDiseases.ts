import { useState } from 'react';
import { Alert } from 'react-native';
import { searchApi, DiseaseResult } from '@/api';

// 질환 검색 상태 및 검색 요청을 담당하는 훅
export const useSearchDiseases = () => {
  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiseaseResult[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseResult | null>(null);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      setShowResult(true);
      const res = await searchApi.searchDiseases(searchTerm);
      if (res.success && res.data && res.data.results) {
        setResults(res.data.results);
        if (res.data.results.length > 0) {
          setSelectedDisease(res.data.results[0]);
        } else {
          setSelectedDisease(null);
        }
      } else {
        setResults([]);
        setSelectedDisease(null);
      }
    } catch (error) {
      console.error('질환 검색 중 오류 발생:', error);
      Alert.alert('검색 실패', '검색 과정에서 문제가 발생했습니다.');
      setResults([]);
      setSelectedDisease(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    performSearch(query);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  return {
    query,
    setQuery,
    showResult,
    setShowResult,
    loading,
    results,
    selectedDisease,
    setSelectedDisease,
    handleSearchSubmit,
    handlePopularSearch,
  };
};

export default useSearchDiseases;
