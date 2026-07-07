export const formatDisplayDate = (rawStr?: string) => {
  if (!rawStr) return '날짜 없음';
  const d = rawStr.split('T')[0];
  const parts = d.split('-');
  if (parts.length >= 2) {
    return `${parts[0]}년 ${parseInt(parts[1])}월`;
  }
  return rawStr;
};
