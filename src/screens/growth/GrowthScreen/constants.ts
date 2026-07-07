// 동물 코드와 로컬 이미지 매핑 정의 (사용자 가이드 반영)
export const ANIMAL_IMAGES: Record<string, any> = {
  frog: require('../../../assets/animal/frog1.png'),
  chick: require('../../../assets/animal/chick1.png'),
  pan: require('../../../assets/animal/pan1.png'), // 펭귄
  dog: require('../../../assets/animal/dog1.png'),
  cat: require('../../../assets/animal/cat1.png'),
  tig: require('../../../assets/animal/tig1.png'), // 호랑이
  bear: require('../../../assets/animal/bear1.png'), // 판다
  mon: require('../../../assets/animal/mon1.png'), // 원숭이
};

// 백엔드 동물 코드를 로컬 이미지 매핑 키로 변환
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
