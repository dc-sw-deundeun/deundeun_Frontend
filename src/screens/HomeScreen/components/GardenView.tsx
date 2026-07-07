import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { styles } from '../HomeScreen.styles';
import { AnimalCharacter } from '../types';
import { GardenAnimal } from './GardenAnimal';

interface GardenViewProps {
  characters: AnimalCharacter[];
  gardenLayout: { width: number; height: number };
  onLayout: (width: number, height: number) => void;
}

export const GardenView: React.FC<GardenViewProps> = ({ characters, gardenLayout, onLayout }) => {
  return (
    <View
      style={styles.gardenArea}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        onLayout(width, height);
      }}
    >
      {/* Scattered mushrooms */}
      <Text style={[styles.mushroomDeco, { top: 50, left: 40 }]}>🍄</Text>
      <Text style={[styles.mushroomDeco, { top: 40, left: 220 }]}>🍄</Text>

      {/* Floating Animals */}
      {characters.map((char) => (
        <View
          key={char.id}
          style={[
            styles.animalNode,
            {
              left: char.posX,
              top: char.posY,
            },
          ]}
        >
          <View style={styles.emojiWrapper}>
            <GardenAnimal
              gardenLayout={gardenLayout}
              initialX={char.posX}
              initialY={char.posY}
              animalCode={char.animalCode}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default GardenView;
