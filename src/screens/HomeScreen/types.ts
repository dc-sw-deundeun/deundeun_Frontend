export interface Mission {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  emoji: string;
}

export interface AnimalCharacter {
  id: string;
  animalCode: string;
  emoji: string;
  level: number | null; // null means no level tag displayed
  posX: number;
  posY: number;
}

export interface GardenAnimalProps {
  gardenLayout: { width: number; height: number };
  initialX: number;
  initialY: number;
  animalCode: string;
}
