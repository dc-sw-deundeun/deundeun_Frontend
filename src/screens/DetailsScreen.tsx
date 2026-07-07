import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { RootStackScreenProps } from '@/types/navigation';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants/theme';
import Button from '@/components/Button';
import { styles } from './DetailsScreen.styles';

export const DetailsScreen: React.FC<RootStackScreenProps<'Details'>> = ({ route, navigation }) => {
  const { itemId, otherParam } = route.params;
  const { isDarkMode } = useAppStore();

  const themeColors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Card style={styles.card} radius={16}>
        <Text style={[styles.title, { color: themeColors.text }]}>상세 보기</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.paramRow}>
          <Text style={[styles.label, { color: themeColors.textMuted }]}>아이템 ID:</Text>
          <Text style={[styles.value, { color: themeColors.text }]}>{itemId}</Text>
        </View>
        
        {otherParam && (
          <View style={styles.paramRow}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>전달된 메시지:</Text>
            <Text style={[styles.value, { color: themeColors.text }]}>{otherParam}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            title="뒤로 가기" 
            onPress={() => navigation.goBack()} 
            variant="outline"
            style={styles.button}
          />
          <Button 
            title="처음으로" 
            onPress={() => navigation.popToTop()} 
            variant="primary"
            style={styles.button}
          />
        </View>
      </Card>
    </View>
  );
};

export default DetailsScreen;
