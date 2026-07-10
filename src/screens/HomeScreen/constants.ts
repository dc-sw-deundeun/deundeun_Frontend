// 각 동물의 목장 내 배치 위치 좌표 및 이모지 정의
export const ANIMAL_COORDINATES: Record<string, { posX: number; posY: number; emoji: string }> = {
  frog: { posX: 50, posY: 110, emoji: '🐸' },
  cat: { posX: 260, posY: 90, emoji: '🐱' },
  bear: { posX: 140, posY: 170, emoji: '🐻' },
  chick: { posX: 60, posY: 220, emoji: '🐥' },
  dog: { posX: 260, posY: 200, emoji: '🐶' },
  mon: { posX: 190, posY: 240, emoji: '🐵' },
  pan: { posX: 120, posY: 80, emoji: '🐼' },
  tig: { posX: 180, posY: 130, emoji: '🐯' },
};

import { getMediaImageUrl } from '../../utils/imageUrl';

// 정적 에셋 로드 require 맵 (해금 연출 및 동물 매핑용)
export const ANIMAL_INACTIVE_IMAGES: Record<string, any> = {
  frog: getMediaImageUrl('animal', 'frog_1'),
  chick: getMediaImageUrl('animal', 'chick_1'),
  pan: getMediaImageUrl('animal', 'penguin_1'), // penguin
  dog: getMediaImageUrl('animal', 'dog_1'),
  cat: getMediaImageUrl('animal', 'cat_1'),
  tig: getMediaImageUrl('animal', 'tiger_1'), // tiger
  bear: getMediaImageUrl('animal', 'panda_1'), // panda
  mon: getMediaImageUrl('animal', 'monkey_1'), // monkey
};

export const ANIMAL_ACTIVE_IMAGES: Record<string, any> = {
  frog: getMediaImageUrl('animal', 'frog_2'),
  chick: getMediaImageUrl('animal', 'chick_2'),
  pan: getMediaImageUrl('animal', 'penguin_2'), // penguin
  dog: getMediaImageUrl('animal', 'dog_2'),
  cat: getMediaImageUrl('animal', 'cat_2'),
  tig: getMediaImageUrl('animal', 'tiger_2'), // tiger
  bear: getMediaImageUrl('animal', 'panda_2'), // panda
  mon: getMediaImageUrl('animal', 'monkey_2'), // monkey
};

// 백엔드 동물 코드를 에셋 매핑 키로 변환
export const mapAnimalCodeToAssetKey = (code: string): string => {
  switch (code) {
    case 'penguin':
      return 'pan';
    case 'tiger':
      return 'tig';
    case 'panda':
      return 'bear';
    case 'monkey':
      return 'mon';
    default:
      return code; // 'frog', 'chick', 'dog', 'cat'
  }
};

export const ANIMAL_NAMES: Record<string, string> = {
  frog: '개구리',
  chick: '병아리',
  penguin: '펭귄',
  dog: '강아지',
  cat: '고양이',
  tiger: '호랑이',
  panda: '판다',
  monkey: '원숭이',
};

export const getRevealImage = (code: string) => {
  const assetKey = mapAnimalCodeToAssetKey(code);
  return ANIMAL_INACTIVE_IMAGES[assetKey] || getMediaImageUrl('animal', 'frog_1');
};
