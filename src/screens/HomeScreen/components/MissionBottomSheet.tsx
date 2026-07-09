import React from 'react';
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { Check } from 'lucide-react-native';
import { styles } from '../HomeScreen.styles';
import { Mission } from '../types';
import { getMissionIcon } from '@/utils/missionIcon';

interface MissionBottomSheetProps {
  missions: Mission[];
  completedCount: number;
  isDarkMode: boolean;
  theme: { textDark: string; textMuted: string; border: string };
  glassSheetStyle: any;
  sheetY: Animated.Value;
  panHandlers: any;
  onToggleMission: (id: number) => void;
}

export const MissionBottomSheet: React.FC<MissionBottomSheetProps> = ({
  missions,
  completedCount,
  isDarkMode,
  theme,
  glassSheetStyle,
  sheetY,
  panHandlers,
  onToggleMission,
}) => {
  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        glassSheetStyle,
        {
          transform: [{ translateY: sheetY }],
        },
      ]}
    >
      {/* Drag handle line indicator & Drag Area */}
      <View {...panHandlers} style={styles.sheetHeaderZone}>
        <View style={[styles.dragHandle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]} />
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: isDarkMode ? '#FFFFFF' : theme.textDark }]}>오늘의 미션</Text>
          <Text style={[styles.sheetProgress, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>
            {completedCount}/{missions.length}
          </Text>
        </View>
      </View>

      {/* Mission Rows */}
      <Animated.ScrollView 
        style={[
          styles.missionScroll,
          {
            opacity: sheetY.interpolate({
              inputRange: [0, 270, 350, 460],
              outputRange: [1, 1, 0, 0],
              extrapolate: 'clamp',
            })
          }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        {missions.map((mission) => (
          <TouchableOpacity
            key={mission.id}
            style={[
              styles.missionRow,
              {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.border,
              },
            ]}
            onPress={() => onToggleMission(mission.id)}
            activeOpacity={0.7}
          >
            <View style={styles.missionLeft}>
              {/* Icon wrapper circular background */}
              <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? 'rgba(228, 242, 230, 0.15)' : '#E4F2E6' }]}>
                {getMissionIcon(mission.missionType, isDarkMode ? '#FFFFFF' : theme.textDark, 20)}
              </View>
              <Text
                style={[
                  styles.missionTitleText,
                  { color: isDarkMode ? '#FFFFFF' : theme.textDark },
                  mission.completed && styles.lineThrough,
                ]}
              >
                {mission.title}
              </Text>
            </View>

            <View style={styles.missionRight}>
              <Text style={[styles.pointsText, { color: isDarkMode ? '#A6A59E' : theme.textMuted }]}>
                +{mission.points}
              </Text>

              {/* Checkbox indicator */}
              <View
                style={[
                  styles.checkbox,
                  { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#D3D2CC' },
                  mission.completed && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                ]}
              >
                {mission.completed && <Check color="#ffffff" size={14} strokeWidth={3} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default MissionBottomSheet;
