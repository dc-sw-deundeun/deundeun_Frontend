import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { styles } from '../PracticeScreen.styles';
import { DailyMission } from '../types';
import { getMissionIcon } from '@/utils/missionIcon';

interface MissionListCardProps {
  missions: DailyMission[];
  completedCount: number;
  glassCardStyle: any;
  onVerifyPress: (id: number) => void;
  theme: { text: string; textMuted: string };
}

export const MissionListCard: React.FC<MissionListCardProps> = ({
  missions,
  completedCount,
  glassCardStyle,
  onVerifyPress,
  theme,
}) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitleText, { color: theme.text }]}>오늘의 미션</Text>
        <Text style={[styles.sectionProgressText, { color: '#5B744C' }]}>
          {completedCount} / {missions.length} 완료
        </Text>
      </View>

      <View style={styles.missionList}>
        {missions.map((mission) => {
          const accentColor = mission.id === 1 ? '#5B744C' : '#C9852E';
          const lightAccent = mission.id === 1 ? '#EBF2E8' : '#FCF3E6';

          return (
            <View
              key={mission.id}
              style={[styles.missionCard, glassCardStyle]}
            >
              <View style={styles.glassShine} pointerEvents="none" />
              {/* Left accent vertical line */}
              <View style={[styles.cardLeftAccent, { backgroundColor: accentColor }]} />

              <View style={styles.missionCardContent}>
                {/* Icon wrapper */}
                <View style={[styles.missionIconContainer, { backgroundColor: lightAccent }]}>
                  {getMissionIcon(mission.missionType, theme.text, 24)}
                </View>

                {/* Text descriptions */}
                <View style={styles.missionTextGroup}>
                  <Text style={[styles.missionCardTitle, { color: theme.text }]}>
                    {mission.title}
                  </Text>
                  <Text style={[styles.missionCardPoints, { color: theme.textMuted }]}>
                    +{mission.xp} XP
                  </Text>
                </View>

                {/* Action button */}
                {mission.completed ? (
                  <TouchableOpacity 
                    style={[styles.completedBtnBadge, { backgroundColor: '#E4F2E6' }]}
                    onPress={() => onVerifyPress(mission.id)}
                    activeOpacity={0.7}
                  >
                    <Check color="#5B744C" size={14} strokeWidth={3} />
                    <Text style={styles.completedBtnText}>완료</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.verifyButton, { backgroundColor: '#354B33' }]}
                    onPress={() => onVerifyPress(mission.id)}
                  >
                    <Text style={styles.verifyButtonText}>인증하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default MissionListCard;
