import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { ClipboardList } from 'lucide-react-native';
import { styles } from '../HealthReportScreen.styles';
import { HABIT_RECOMMENDATIONS } from '../constants';

interface HabitRecommendationsProps {
  addedMissions: string[];
  onAddMission: (habit: string) => void;
  theme: { text: string };
}

export const HabitRecommendations: React.FC<HabitRecommendationsProps> = ({
  addedMissions,
  onAddMission,
  theme,
}) => {
  return (
    <View style={styles.habitsGroup}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>의사가 추천하는 맞춤 습관</Text>

      {HABIT_RECOMMENDATIONS.map((habit, idx) => (
        <Card key={idx} style={styles.habitCard} padding={SPACING.md} radius={20}>
          <View style={styles.habitLeft}>
            <ClipboardList color={COLORS.primary} size={20} />
            <Text style={[styles.habitText, { color: theme.text }]}>{habit}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.addHabitBtn,
              {
                backgroundColor: addedMissions.includes(habit)
                  ? COLORS.primaryLight
                  : COLORS.primary,
              },
            ]}
            onPress={() => onAddMission(habit)}
            disabled={addedMissions.includes(habit)}
          >
            <Text
              style={[
                styles.addHabitBtnText,
                {
                  color: addedMissions.includes(habit)
                    ? COLORS.primaryDark
                    : '#ffffff',
                },
              ]}
            >
              {addedMissions.includes(habit) ? '추가됨' : '미션 받기'}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

export default HabitRecommendations;
