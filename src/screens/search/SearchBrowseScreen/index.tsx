import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { styles } from './SearchBrowseScreen.styles';
import { POPULAR_SEARCHES } from './constants';
import { DiseaseResultCard } from './components/DiseaseResultCard';
import { ExplanationSheet } from './components/ExplanationSheet';
import { useSearchDiseases } from './hooks/useSearchDiseases';

export default function SearchBrowseScreen({ navigation }: RootStackScreenProps<'SearchBrowse'>) {
  const { isDarkMode, showAlert } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [showExplanationSheet, setShowExplanationSheet] = useState(false);

  const {
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
  } = useSearchDiseases();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={theme.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={18} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="무엇이 궁금하세요?"
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (text === '') setShowResult(false);
            }}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!showResult ? (
          /* Initial Screen State */
          <View style={styles.initialState}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>자주 찾는 검사 항목</Text>
            <View style={styles.tagsRow}>
              {POPULAR_SEARCHES.map((term, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => handlePopularSearch(term)}
                >
                  <Text style={[styles.tagText, { color: theme.text }]}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Search Results Screen State */
          <View style={styles.resultsState}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : results.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  검색 결과가 없습니다.
                </Text>
              </View>
            ) : (
              results.map((disease, idx) => (
                <DiseaseResultCard
                  key={idx}
                  disease={disease}
                  onNavigateHealthReport={() => navigation.navigate('HealthReport')}
                  onOpenExplanation={() => {
                    setSelectedDisease(disease);
                    setShowExplanationSheet(true);
                  }}
                  theme={theme}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Explanation Sheet (Interpretation Bottom Sheet Modal) */}
      <ExplanationSheet
        visible={showExplanationSheet && selectedDisease !== null}
        disease={selectedDisease}
        onClose={() => setShowExplanationSheet(false)}
        onRequestMission={() => {
          setShowExplanationSheet(false);
          showAlert('미션 등록', '이 지표를 개선하기 위한 맞춤 추천 미션이 추가되었습니다!');
        }}
        theme={theme}
      />
    </SafeAreaView>
  );
}
