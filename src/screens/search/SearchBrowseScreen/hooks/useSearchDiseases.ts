import { useState } from 'react';
import { Alert } from 'react-native';
import { searchApi, DiseaseResult } from '@/api';
import { useAppStore } from '@/store/useAppStore';

// 질환 검색 상태 및 검색 요청을 담당하는 훅
export const useSearchDiseases = () => {
  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiseaseResult[]>([]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      setShowResult(true);
      const res = await searchApi.searchDiseases(searchTerm);
      if (res.success && res.data && res.data.results) {
        setResults(res.data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('질환 검색 중 오류 발생:', error);
      useAppStore.getState().showAlert('검색 실패', '검색 과정에서 문제가 발생했습니다.');
      setResults([]);
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
    handleSearchSubmit,
    handlePopularSearch,
  };
};

export default useSearchDiseases;
