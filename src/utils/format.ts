/**
 * 숫자를 한국 원화(KRW) 형식 문자열로 포맷팅합니다.
 * @param value 포맷할 숫자
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
};

/**
 * 날짜 객체 또는 문자열을 'YYYY-MM-DD' 형식의 문자열로 포맷팅합니다.
 * @param date 날짜
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
