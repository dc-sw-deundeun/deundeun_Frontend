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

// 정적 에셋 로드 require 맵 (해금 연출 및 동물 매핑용)
export const ANIMAL_INACTIVE_IMAGES: Record<string, any> = {
  frog: require('../../assets/animal/frog1.png'),
  chick: require('../../assets/animal/chick1.png'),
  pan: require('../../assets/animal/pan1.png'), // penguin
  dog: require('../../assets/animal/dog1.png'),
  cat: require('../../assets/animal/cat1.png'),
  tig: require('../../assets/animal/tig1.png'), // tiger
  bear: require('../../assets/animal/bear1.png'), // panda
  mon: require('../../assets/animal/mon1.png'), // monkey
};

export const ANIMAL_ACTIVE_IMAGES: Record<string, any> = {
  frog: require('../../assets/animal/frog2.png'),
  chick: require('../../assets/animal/chick2.png'),
  pan: require('../../assets/animal/pan2.png'), // penguin
  dog: require('../../assets/animal/dog2.png'),
  cat: require('../../assets/animal/cat2.png'),
  tig: require('../../assets/animal/tig2.png'), // tiger
  bear: require('../../assets/animal/bear2.png'), // panda
  mon: require('../../assets/animal/mon2.png'), // monkey
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
  return ANIMAL_INACTIVE_IMAGES[assetKey] || require('../../assets/animal/frog1.png');
};
