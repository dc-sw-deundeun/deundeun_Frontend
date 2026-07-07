import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/Text';
import { Check } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { styles } from '../DeviceSyncScreen.styles';

interface SyncSourceCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  isConnectingThis: boolean;
  isAnyConnecting: boolean;
  isSynced: boolean;
  isAnySynced: boolean;
  onPress: () => void;
  theme: { card: string; text: string; textMuted: string; border: string };
}

// 기기 연동 옵션 1건(삼성 헬스 / 애플 건강 / 구글 피트니스 공통 렌더링)
export const SyncSourceCard: React.FC<SyncSourceCardProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  isConnectingThis,
  isAnyConnecting,
  isSynced,
  isAnySynced,
  onPress,
  theme,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.syncCard,
        {
          backgroundColor: theme.card,
          borderColor: isSynced ? COLORS.primary : theme.border,
          opacity: isAnySynced && !isSynced ? 0.4 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isAnyConnecting || (isAnySynced && !isSynced)}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>{icon}</View>
        <View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        {isConnectingThis ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : isSynced ? (
          <View style={[styles.checkCircle, { backgroundColor: COLORS.primary }]}>
            <Check color="#ffffff" size={14} strokeWidth={3} />
          </View>
        ) : (
          <Text style={[styles.syncLinkText, { color: COLORS.primary }]}>연동하기</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SyncSourceCard;
