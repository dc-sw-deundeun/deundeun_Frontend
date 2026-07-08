import { RangeBar, RangeBarSegment } from '@/api';

interface SegmentDef {
  label: string;
  from: number;
  to: number;
  color: string;
}

interface FallbackConfig {
  min: number;
  max: number;
  segments: SegmentDef[];
}

// 백엔드가 range_bar를 내려주지 않는 표준 검진 항목을 위한 국가검진 참고치 기반 예비 그래프 설정
// (성별에 따라 기준이 달라지는 항목은 앱이 현재 기본값으로 사용 중인 남성 기준을 사용)
const FALLBACK_CONFIG: Record<string, FallbackConfig> = {
  BMI: {
    min: 10,
    max: 40,
    segments: [
      { label: '경계 <18.5', from: 10, to: 18.4, color: 'yellow' },
      { label: '정상 18.5~24.9', from: 18.5, to: 24.9, color: 'green' },
      { label: '경계 25~29.9', from: 25, to: 29.9, color: 'yellow' },
      { label: '위험 30~', from: 30, to: 40, color: 'red' },
    ],
  },
  WAIST: {
    min: 50,
    max: 130,
    segments: [
      { label: '정상 <90', from: 50, to: 89, color: 'green' },
      { label: '위험 90~', from: 90, to: 130, color: 'red' },
    ],
  },
  BloodPressure: {
    min: 80,
    max: 180,
    segments: [
      { label: '정상 <120', from: 80, to: 119, color: 'green' },
      { label: '경계 120~139', from: 120, to: 139, color: 'yellow' },
      { label: '위험 140~', from: 140, to: 180, color: 'red' },
    ],
  },
  BP_SYS: {
    min: 80,
    max: 180,
    segments: [
      { label: '정상 <120', from: 80, to: 119, color: 'green' },
      { label: '경계 120~139', from: 120, to: 139, color: 'yellow' },
      { label: '위험 140~', from: 140, to: 180, color: 'red' },
    ],
  },
  BP_DIA: {
    min: 50,
    max: 120,
    segments: [
      { label: '정상 <80', from: 50, to: 79, color: 'green' },
      { label: '경계 80~89', from: 80, to: 89, color: 'yellow' },
      { label: '위험 90~', from: 90, to: 120, color: 'red' },
    ],
  },
  FPG: {
    min: 70,
    max: 200,
    segments: [
      { label: '정상 <100', from: 70, to: 99, color: 'green' },
      { label: '경계 100~125', from: 100, to: 125, color: 'yellow' },
      { label: '위험 126~', from: 126, to: 200, color: 'red' },
    ],
  },
  TC: {
    min: 100,
    max: 300,
    segments: [
      { label: '정상 <200', from: 100, to: 199, color: 'green' },
      { label: '경계 200~239', from: 200, to: 239, color: 'yellow' },
      { label: '위험 240~', from: 240, to: 300, color: 'red' },
    ],
  },
  HDL: {
    min: 20,
    max: 100,
    segments: [
      { label: '위험 <40', from: 20, to: 39, color: 'red' },
      { label: '경계 40~59', from: 40, to: 59, color: 'yellow' },
      { label: '정상 60~', from: 60, to: 100, color: 'green' },
    ],
  },
  TG: {
    min: 50,
    max: 300,
    segments: [
      { label: '정상 <150', from: 50, to: 149, color: 'green' },
      { label: '경계 150~199', from: 150, to: 199, color: 'yellow' },
      { label: '위험 200~', from: 200, to: 300, color: 'red' },
    ],
  },
  LDL: {
    min: 50,
    max: 250,
    segments: [
      { label: '정상 <130', from: 50, to: 129, color: 'green' },
      { label: '경계 130~159', from: 130, to: 159, color: 'yellow' },
      { label: '위험 160~', from: 160, to: 250, color: 'red' },
    ],
  },
  CREATININE: {
    min: 0.3,
    max: 3,
    segments: [
      { label: '정상 ~1.5', from: 0.3, to: 1.5, color: 'green' },
      { label: '위험 1.5~', from: 1.5, to: 3, color: 'red' },
    ],
  },
  EGFR: {
    min: 15,
    max: 120,
    segments: [
      { label: '위험 <45', from: 15, to: 44, color: 'red' },
      { label: '경계 45~59', from: 45, to: 59, color: 'yellow' },
      { label: '정상 60~', from: 60, to: 120, color: 'green' },
    ],
  },
  AST: {
    min: 0,
    max: 100,
    segments: [
      { label: '정상 ~40', from: 0, to: 40, color: 'green' },
      { label: '위험 40~', from: 40, to: 100, color: 'red' },
    ],
  },
  ALT: {
    min: 0,
    max: 100,
    segments: [
      { label: '정상 ~35', from: 0, to: 35, color: 'green' },
      { label: '위험 35~', from: 35, to: 100, color: 'red' },
    ],
  },
  GGT: {
    min: 0,
    max: 150,
    segments: [
      { label: '정상 ~63', from: 0, to: 63, color: 'green' },
      { label: '위험 63~', from: 63, to: 150, color: 'red' },
    ],
  },
  PHQ9: {
    min: 0,
    max: 27,
    segments: [
      { label: '정상 0~4', from: 0, to: 4, color: 'green' },
      { label: '경계 5~9', from: 5, to: 9, color: 'yellow' },
      { label: '위험 10~', from: 10, to: 27, color: 'red' },
    ],
  },
};

/**
 * 서버 응답의 range_bar가 없을 때(아직 미구현이거나 코드 매핑 누락 등) 표준 검진 참고치로
 * 클라이언트에서 대체 그래프를 계산한다. 참고치가 없는 코드는 null을 반환해 그래프 없이 표시된다.
 */
export const getFallbackRangeBar = (code: string, value: number | null | undefined): RangeBar | null => {
  const config = FALLBACK_CONFIG[code];
  if (!config || value == null || Number.isNaN(value)) return null;

  const { min, max, segments } = config;
  const clamped = Math.min(Math.max(value, min), max);
  const marker_percent = ((clamped - min) / (max - min)) * 100;

  const active =
    segments.find(seg => value >= seg.from && value <= seg.to) ??
    (value < segments[0].from ? segments[0] : segments[segments.length - 1]);

  const segSpan = active.to - active.from;
  const posInSegment = segSpan > 0 ? ((clamped - active.from) / segSpan) * 100 : 100;

  const rangeBarSegments: RangeBarSegment[] = segments.map(seg => ({
    label: seg.label,
    from_value: seg.from,
    to_value: seg.to,
    color: seg.color,
  }));

  return {
    min,
    max,
    marker: value,
    marker_percent: Math.min(Math.max(marker_percent, 0), 100),
    segments: rangeBarSegments,
    active_segment: {
      label: active.label,
      from_value: active.from,
      to_value: active.to,
      color: active.color,
      marker_percent: Math.min(Math.max(posInSegment, 0), 100),
    },
  };
};

export default getFallbackRangeBar;
