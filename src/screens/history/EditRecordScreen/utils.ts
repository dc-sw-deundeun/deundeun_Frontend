import { COLORS } from '@/constants/theme';

export const statusColor = (s: string | null | undefined, mutedColor: string) => {
  if (s === 'RISK') return COLORS.error;
  if (s === 'CAUTION') return COLORS.warning;
  if (s === 'NORMAL') return COLORS.success;
  return mutedColor;
};

export const statusLabel = (s?: string | null) => {
  if (s === 'RISK') return '위험';
  if (s === 'CAUTION') return '경계';
  if (s === 'NORMAL') return '정상';
  return '-';
};
