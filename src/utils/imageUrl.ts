import { API_CONFIG } from '@/constants/config';

const BASE_URL = API_CONFIG.BASE_URL.replace('http://localhost:8000', 'https://api.deundeun.xyz');
/**
 * 백엔드 Media API의 시스템 이미지 URL을 생성합니다.
 * @param purpose 이미지 목적/분류 (예: 'animal', 'ui')
 * @param assetKey 이미지 고유 키 (예: 'frog_1', 'splash_icon')
 * @returns Image source로 사용할 수 있는 객체 { uri: string }
 */
export const getMediaImageUrl = (purpose: string, assetKey: string) => {
  return { uri: `${BASE_URL}/media/images/by-key/${purpose}/${assetKey}` };
};
