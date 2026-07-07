// Helper to determine value placement on range slider
export interface RangeConfig {
  minVal: number;
  maxVal: number;
  normalMax: number;
  cautionMax: number;
  normalText: string;
  cautionText: string;
  dangerText: string;
}

export const getMetricRangeConfig = (code: string): RangeConfig => {
  switch (code) {
    case 'FastingBloodSugar':
      return {
        minVal: 70,
        maxVal: 160,
        normalMax: 99,
        cautionMax: 125,
        normalText: '안심 ~99',
        cautionText: '경계 100~125',
        dangerText: '위험 126~',
      };
    case 'SystolicBP':
      return {
        minVal: 90,
        maxVal: 180,
        normalMax: 119,
        cautionMax: 139,
        normalText: '안심 ~119',
        cautionText: '경계 120~139',
        dangerText: '위험 140~',
      };
    case 'DiastolicBP':
      return {
        minVal: 50,
        maxVal: 110,
        normalMax: 79,
        cautionMax: 89,
        normalText: '안심 ~79',
        cautionText: '경계 80~89',
        dangerText: '위험 90~',
      };
    case 'TotalCholesterol':
    case 'Cholesterol':
      return {
        minVal: 130,
        maxVal: 280,
        normalMax: 199,
        cautionMax: 239,
        normalText: '안심 ~199',
        cautionText: '경계 200~239',
        dangerText: '위험 240~',
      };
    case 'BMI':
      return {
        minVal: 15,
        maxVal: 35,
        normalMax: 22.9,
        cautionMax: 24.9,
        normalText: '안심 18.5~22.9',
        cautionText: '경계 23~24.9',
        dangerText: '위험 25~',
      };
    default:
      return {
        minVal: 0,
        maxVal: 100,
        normalMax: 40,
        cautionMax: 70,
        normalText: '안심',
        cautionText: '경계',
        dangerText: '주의',
      };
  }
};

export const getDefaultExplanation = (code: string, value: number): string => {
  switch (code) {
    case 'FastingBloodSugar':
      return `${value}mg/dL은 주의 혹은 경계가 필요한 수치입니다. 식후 가벼운 걷기와 잡곡밥, 채소 위주의 식단을 꾸준히 유지해 주세요.`;
    case 'SystolicBP':
    case 'DiastolicBP':
      return `혈압 조절이 필요한 상태입니다. 나트륨 섭취를 줄이고 규칙적인 가벼운 유산소 운동을 실천해 보세요.`;
    case 'TotalCholesterol':
    case 'Cholesterol':
      return `콜레스테롤 조절이 권장됩니다. 포화지방 섭취를 줄이고 오메가-3 등 불포화지방산이 풍부한 식품을 섭취해 보세요.`;
    case 'BMI':
      return `체질량지수(BMI) 개선을 위해 균형 잡힌 식사와 유산소 및 근력 운동 병행이 도움을 줄 수 있습니다.`;
    default:
      return `수치 모니터링 및 생활 습관 관리를 통해 평소 건강을 챙겨보세요.`;
  }
};

export const getDefaultHabits = (code: string): string[] => {
  switch (code) {
    case 'FastingBloodSugar':
      return ['식후 30분 걷기', '잡곡밥 - 채소 먼저 먹기', '단 음료 대신 물 마시기'];
    case 'SystolicBP':
    case 'DiastolicBP':
      return ['음식 싱겁게 먹기', '주 3회 30분 유산소 운동', '스트레스 해소 및 충분한 휴식'];
    default:
      return ['규칙적인 유산소 운동하기', '가공식품 섭취 줄이기', '하루 7시간 이상 숙면 취하기'];
  }
};
