import { getMediaImageUrl } from '../../../utils/imageUrl';

// 동물 코드와 로컬 이미지 매핑 정의 (사용자 가이드 반영)
export const ANIMAL_IMAGES: Record<string, any> = {
  frog: getMediaImageUrl('animal', 'frog_1'),
  chick: getMediaImageUrl('animal', 'chick_1'),
  pan: getMediaImageUrl('animal', 'penguin_1'), // 펭귄
  dog: getMediaImageUrl('animal', 'dog_1'),
  cat: getMediaImageUrl('animal', 'cat_1'),
  tig: getMediaImageUrl('animal', 'tiger_1'), // 호랑이
  bear: getMediaImageUrl('animal', 'panda_1'), // 판다
  mon: getMediaImageUrl('animal', 'monkey_1'), // 원숭이
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
