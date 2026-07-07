import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { User, Lock, Link, ChevronRight } from 'lucide-react-native';
import { styles } from '../MyPageScreen.styles';

interface AccountMenuCardProps {
  onChangePassword: () => void;
  onConnectedApps: () => void;
  theme: { text: string; textMuted: string; border: string };
}

export const AccountMenuCard: React.FC<AccountMenuCardProps> = ({
  onChangePassword,
  onConnectedApps,
  theme,
}) => {
  return (
    <Card style={styles.menuList} padding={0}>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <User size={18} color={theme.text} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>내 정보</Text>
        </View>
        <ChevronRight size={18} color={theme.textMuted} />
      </TouchableOpacity>

      <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

      <TouchableOpacity
        style={styles.menuItem}
        onPress={onChangePassword}
      >
        <View style={styles.menuItemLeft}>
          <Lock size={18} color={theme.text} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>비밀번호 변경</Text>
        </View>
        <ChevronRight size={18} color={theme.textMuted} />
      </TouchableOpacity>

      <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />

      <TouchableOpacity
        style={styles.menuItem}
        onPress={onConnectedApps}
      >
        <View style={styles.menuItemLeft}>
          <Link size={18} color={theme.text} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>연동 앱 관리</Text>
        </View>
        <ChevronRight size={18} color={theme.textMuted} />
      </TouchableOpacity>
    </Card>
  );
};

export default AccountMenuCard;
