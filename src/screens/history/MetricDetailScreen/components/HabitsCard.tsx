import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { COLORS } from '@/constants/theme';
import { Check } from 'lucide-react-native';
import { styles } from '../MetricDetailScreen.styles';

interface HabitsCardProps {
  habits: string[];
  completedHabits: string[];
  onToggleHabit: (habit: string) => void;
  theme: { text: string };
}

export const HabitsCard: React.FC<HabitsCardProps> = ({
  habits,
  completedHabits,
  onToggleHabit,
  theme,
}) => {
  return (
    <Card style={styles.glassCard}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>맞춤 추천 습관</Text>
      <View style={styles.habitsList}>
        {habits.map((habit, idx) => {
          const isDone = completedHabits.includes(habit);
          return (
            <TouchableOpacity
              key={idx}
              style={styles.habitRow}
              activeOpacity={0.8}
              onPress={() => onToggleHabit(habit)}
            >
              <View style={[styles.checkbox, isDone && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
                {isDone && <Check color="#ffffff" size={14} />}
              </View>
              <Text style={[styles.habitName, { color: theme.text }]}>{habit}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
};

export default HabitsCard;
