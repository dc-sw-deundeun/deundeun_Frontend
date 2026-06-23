import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import Text from '@/components/Text';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, HelpCircle, ShieldAlert, Heart, RefreshCw } from 'lucide-react-native';
import { RootStackScreenProps } from '@/types/navigation';

export default function SearchBrowseScreen({ navigation }: RootStackScreenProps<'SearchBrowse'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanationSheet, setShowExplanationSheet] = useState(false);

  const popularSearches = ['공복 혈당', '총콜레스테롤', '혈압', 'BMI', '간 수치'];

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setShowResult(true);
    }
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    setShowResult(true);
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
            {/* Main Result Card */}
            <View style={[styles.resultCard, { backgroundColor: theme.card, shadowColor: isDarkMode ? '#000000' : '#1C2E21', shadowOpacity: isDarkMode ? 0.3 : 0.04 }]}>
              <Text style={[styles.resultCategory, { color: COLORS.primary }]}>건강 사전</Text>
              <Text style={[styles.resultTitle, { color: theme.text }]}>{query}이란?</Text>
              <Text style={[styles.resultBody, { color: theme.textMuted }]}>
                {query === '총콜레스테롤'
                  ? '혈관 건강을 측정하는 가장 대표적인 지방 성분 수치입니다. 세포막을 구성하고 호르몬을 생성하는 데 중요하지만, 수치가 너무 높으면 동맥경화 등의 원인이 될 수 있습니다.'
                  : `몸에서 일어나는 신진대사 및 혈관/내분비계 장기 수치입니다. 관리 실천(식이섬유 섭취, 운동)을 통해 수치를 안전하게 조절할 수 있습니다.`}
              </Text>
            </View>

            {/* My Stats Card */}
            <View style={[styles.myStatsCard, { backgroundColor: theme.card, shadowColor: isDarkMode ? '#000000' : '#1C2E21', shadowOpacity: isDarkMode ? 0.3 : 0.04 }]}>
              <View style={styles.statsLeft}>
                <Text style={[styles.statsLabel, { color: theme.textMuted }]}>내 {query} 최근 기록</Text>
                <Text style={[styles.statsValue, { color: theme.text }]}>
                  {query === '총콜레스테롤' ? '232 mg/dL (주의)' : '126 mg/dL (주의)'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.statsLinkBtn, { backgroundColor: COLORS.primaryLight }]}
                onPress={() => navigation.navigate('HealthReport')}
              >
                <Text style={[styles.statsLinkText, { color: COLORS.primaryDark }]}>최근 분석 보기</Text>
              </TouchableOpacity>
            </View>

            {/* Explanation Sheet Trigger Card */}
            <TouchableOpacity
              style={[styles.explanCard, { backgroundColor: COLORS.primaryDark }]}
              onPress={() => setShowExplanationSheet(true)}
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
        )}
      </ScrollView>

      {/* Explanation Sheet (Interpretation Bottom Sheet Modal) */}
      <Modal
        visible={showExplanationSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExplanationSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Heart color={COLORS.error} size={20} fill={COLORS.error + '30'} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>{query || '공복 혈당'} 쉽게 이해하기</Text>
              </View>
              <TouchableOpacity onPress={() => setShowExplanationSheet(false)}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>닫기</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.explanBody, { backgroundColor: theme.background }]}>
              <Text style={[styles.explanValueTitle, { color: theme.text }]}>
                {query === '총콜레스테롤' ? '232 mg/dL' : '126 mg/dL'}
              </Text>
              <View style={[styles.explanStatusBadge, { backgroundColor: COLORS.warning + '15' }]}>
                <Text style={[styles.explanStatusText, { color: COLORS.warning }]}>주의 단계</Text>
              </View>

              <Text style={[styles.explanParagraph, { color: theme.text }]}>
                {query === '총콜레스테롤'
                  ? '혈액 내 콜레스테롤 성분이 다소 높은 상태입니다. 지금 당장 심각한 질병이 있는 것은 아니지만, 기름진 식단을 줄이고 하루 30분 유산소 운동을 지속하면 혈액이 깨끗해질 수 있습니다.'
                  : '밥을 먹기 전 혈류 안의 당분 농도가 정상보다 높은 전단계 구간입니다. 지금부터 걷기와 식단을 통해 인슐린 감수성을 개선하면 약을 먹지 않고도 완전히 정상 회복이 가능한 소중한 골든타임입니다.'}
              </Text>

              <View style={styles.dosDontsRow}>
                <View style={[styles.boxCard, { backgroundColor: COLORS.primaryLight + '40', borderColor: COLORS.primary }]}>
                  <Text style={[styles.boxHeader, { color: COLORS.primaryDark }]}>👍 이렇게 해요</Text>
                  <Text style={[styles.boxText, { color: theme.text }]}>
                    - 식후 가벼운 산책{"\n"}- 풍부한 식이섬유 섭취
                  </Text>
                </View>

                <View style={[styles.boxCard, { backgroundColor: COLORS.error + '05', borderColor: COLORS.error }]}>
                  <Text style={[styles.boxHeader, { color: COLORS.error }]}>👎 이건 피해요</Text>
                  <Text style={[styles.boxText, { color: theme.text }]}>
                    - 단 액상과당 음료{"\n"}- 늦은 밤 야식
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
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
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
    padding: SPACING.md,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
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
});
