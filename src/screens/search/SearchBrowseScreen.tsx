import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, HelpCircle, ShieldAlert, Heart, RefreshCw } from 'lucide-react-native';
import { RootStackScreenProps } from '@/types/navigation';
import { searchApi, DiseaseResult } from '@/api';

export default function SearchBrowseScreen({ navigation }: RootStackScreenProps<'SearchBrowse'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanationSheet, setShowExplanationSheet] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiseaseResult[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseResult | null>(null);

  const popularSearches = ['공복 혈당', '총콜레스테롤', '혈압', 'BMI', '간 수치'];

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
              {popularSearches.map((term, idx) => (
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
                <View key={idx} style={{ gap: SPACING.md, marginBottom: SPACING.md }}>
                  {/* Main Result Card */}
                  <Card style={styles.resultCard}>
                    <Text style={[styles.resultCategory, { color: COLORS.primary }]}>건강 사전</Text>
                    <Text style={[styles.resultTitle, { color: theme.text }]}>{disease.name}이란?</Text>
                    <Text style={[styles.resultBody, { color: theme.textMuted }]}>
                      {disease.description}
                    </Text>
                    {disease.symptoms && disease.symptoms.length > 0 && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 4 }}>주요 증상:</Text>
                        <Text style={{ fontSize: 13, color: theme.textMuted }}>
                          {disease.symptoms.join(', ')}
                        </Text>
                      </View>
                    )}
                  </Card>

                  {/* My Stats Card */}
                  <Card style={styles.myStatsCard} padding={SPACING.md} radius={20}>
                    <View style={styles.statsLeft}>
                      <Text style={[styles.statsLabel, { color: theme.textMuted }]}>내 {disease.name} 최근 기록</Text>
                      <Text style={[styles.statsValue, { color: theme.text }]}>
                        {disease.name.includes('콜레스테롤') ? '232 mg/dL (주의)' : '126 mg/dL (주의)'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.statsLinkBtn, { backgroundColor: COLORS.primaryLight }]}
                      onPress={() => navigation.navigate('HealthReport')}
                    >
                      <Text style={[styles.statsLinkText, { color: COLORS.primaryDark }]}>최근 분석 보기</Text>
                    </TouchableOpacity>
                  </Card>

                  {/* Explanation Sheet Trigger Card */}
                  <TouchableOpacity
                    style={[styles.explanCard, { backgroundColor: COLORS.primaryDark }]}
                    onPress={() => {
                      setSelectedDisease(disease);
                      setShowExplanationSheet(true);
                    }}
                  >
                    <View style={styles.explanLeft}>
                      <HelpCircle color="#ffffff" size={24} />
                      <View>
                        <Text style={styles.explanTitle}>수치 쉽게 풀어주기</Text>
                        <Text style={styles.explanDesc}>어려운 의학 용어와 검사 결과를 쉽게 이해해 보아요.</Text>
                      </View>
                    </View>
                    <Text style={{ color: '#ffffff', fontSize: 18 }}>➔</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Explanation Sheet (Interpretation Bottom Sheet Modal) */}
      <Modal
        visible={showExplanationSheet && selectedDisease !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExplanationSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Heart color={COLORS.error} size={20} fill={COLORS.error + '30'} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedDisease?.name} 쉽게 이해하기</Text>
              </View>
              <TouchableOpacity onPress={() => setShowExplanationSheet(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>닫기</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.explanBody, { backgroundColor: theme.background }]}>
              <Text style={[styles.explanValueTitle, { color: theme.text }]}>
                {selectedDisease?.name.includes('콜레스테롤') ? '232 mg/dL' : '126 mg/dL'}
              </Text>
              <View style={[styles.explanStatusBadge, { backgroundColor: COLORS.warning + '15' }]}>
                <Text style={[styles.explanStatusText, { color: COLORS.warning }]}>주의 단계</Text>
              </View>

              <Text style={[styles.explanParagraph, { color: theme.text }]}>
                {selectedDisease?.description}
              </Text>

              <View style={styles.dosDontsRow}>
                <View style={[styles.boxCard, { backgroundColor: COLORS.primaryLight + '40', borderColor: COLORS.primary }]}>
                  <Text style={[styles.boxHeader, { color: COLORS.primaryDark }]}>👍 이렇게 해요</Text>
                  <Text style={[styles.boxText, { color: theme.text }]}>
                    {selectedDisease?.name.includes('콜레스테롤')
                      ? `- 식이섬유 풍부한 채소 섭취\n- 하루 30분 유산소 운동`
                      : `- 식후 가벼운 산책\n- 설탕/단 음료 줄이기`}
                  </Text>
                </View>

                <View style={[styles.boxCard, { backgroundColor: COLORS.error + '05', borderColor: COLORS.error }]}>
                  <Text style={[styles.boxHeader, { color: COLORS.error }]}>👎 이건 피해요</Text>
                  <Text style={[styles.boxText, { color: theme.text }]}>
                    {selectedDisease?.name.includes('콜레스테롤')
                      ? `- 튀김류 등 고포화지방 식단\n- 늦은 시간 야식`
                      : `- 단 액상과당 음료\n- 기름진 인스턴트 식품`}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.sheetActionBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => {
                setShowExplanationSheet(false);
                Alert.alert('미션 등록', '이 지표를 개선하기 위한 맞춤 추천 미션이 추가되었습니다!');
              }}
            >
              <Text style={styles.sheetActionText}>맞춤 미션 받기</Text>
            </TouchableOpacity>
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
  header: {
    paddingHorizontal: SPACING.md,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    padding: 0,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  initialState: {
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    paddingLeft: SPACING.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsState: {
    gap: SPACING.md,
  },
  resultCard: {
    gap: SPACING.sm,
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  resultBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  myStatsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLeft: {
    gap: 2,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  statsLinkBtn: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  explanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
  },
  explanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  explanTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  explanDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
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
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  explanBody: {
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  explanValueTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  explanStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  explanStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  explanParagraph: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  dosDontsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    width: '100%',
  },
  boxCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.sm,
    gap: 4,
  },
  boxHeader: {
    fontSize: 12,
    fontWeight: '700',
  },
  boxText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },
  sheetActionBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
