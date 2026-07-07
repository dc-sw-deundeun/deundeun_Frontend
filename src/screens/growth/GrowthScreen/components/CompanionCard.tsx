import React from 'react';
import { View, Image } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { PawPrint, Lock } from 'lucide-react-native';
import { AnimalCatalogItem } from '@/api';
import { styles } from '../GrowthScreen.styles';
import { ANIMAL_IMAGES, mapAnimalCodeToAssetKey } from '../constants';

interface CompanionCardProps {
  animal: AnimalCatalogItem;
  animalLevel: number;
  isDarkMode: boolean;
  theme: { text: string; textMuted: string; border: string };
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
  animal,
  animalLevel,
  isDarkMode,
  theme,
}) => {
  const assetKey = mapAnimalCodeToAssetKey(animal.animal_code);
  const imageSource = ANIMAL_IMAGES[assetKey];
  const isUnlocked = animal.is_unlocked;

  return (
    <View
      style={[
        styles.companionCard,
        {
          backgroundColor: isDarkMode ? 'rgba(46, 48, 35, 0.65)' : 'rgba(255, 255, 255, 0.55)',
          borderColor: isUnlocked
            ? (isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.6)')
            : 'rgba(0, 0, 0, 0.02)',
          opacity: isUnlocked ? 1 : 0.55,
        },
      ]}
    >
      {isUnlocked ? (
        <>
          <View style={styles.imageContainer}>
            {imageSource ? (
              <Image source={imageSource} style={styles.companionImage} />
            ) : (
              <PawPrint color={theme.textMuted} size={24} />
            )}
          </View>
          <View style={styles.nameAndLevelColumn}>
            <Text style={[styles.companionName, { color: theme.text }]} numberOfLines={1}>{animal.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={[styles.levelText, { color: COLORS.primaryDark }]}>
                Lv {animalLevel}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Lock color={theme.textMuted} size={38} />
          </View>
          <View style={styles.nameAndLevelColumn}>
            <Text style={[styles.companionName, { color: theme.textMuted }]} numberOfLines={1}>잠김</Text>
            <View style={[styles.levelBadge, { backgroundColor: theme.border }]}>
              <Text style={[styles.levelText, { color: theme.textMuted }]}>Lv --</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CompanionCard;
