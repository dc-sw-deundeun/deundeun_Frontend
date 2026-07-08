import { COLORS } from '@/constants/theme';

export const mapStatusToKorean = (status?: string | null): '정상' | '경계' | '주의' => {
  if (!status) return '정상';
  const s = status.toUpperCase();
  if (s === 'DANGER' || s === 'ERROR' || s === 'RISK' || s === '주의' || s === '위험') return '주의';
  if (s === 'WARNING' || s === 'BORDERLINE' || s === 'CAUTION' || s === '경계') return '경계';
  return '정상';
};

export const getStatusColor = (status: '정상' | '경계' | '주의') => {
  if (status === '정상') return COLORS.success;
  if (status === '경계') return COLORS.warning;
  return COLORS.error;
};

// 서버가 내려주는 range_bar.segments[].color("green"/"yellow"/"red")를 테마 색상으로 변환
export const segmentColorToHex = (color?: string | null): string => {
  switch (color) {
    case 'green':
      return COLORS.success;
    case 'yellow':
      return COLORS.warning;
    case 'red':
      return COLORS.error;
    default:
      return COLORS.success;
  }
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '날짜 없음';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length >= 2) {
    return `${parts[0]}년 ${parseInt(parts[1])}월`;
  }
  return dateStr;
};
