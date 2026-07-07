import React from 'react';
import { BellRing, Sparkles, AlertCircle, UserCheck } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('growth') || t.includes('level') || t.includes('character')) {
    return <Sparkles size={18} color="#EF6C00" />;
  }
  if (t.includes('mission') || t.includes('assign')) {
    return <BellRing size={18} color={COLORS.primary} />;
  }
  if (t.includes('trend') || t.includes('analysis')) {
    return <AlertCircle size={18} color={COLORS.success} />;
  }
  return <UserCheck size={18} color="#1565C0" />;
};

export const getIconBg = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('growth') || t.includes('level') || t.includes('character')) return '#FFF3E0';
  if (t.includes('mission') || t.includes('assign')) return '#E8F5E9';
  if (t.includes('trend') || t.includes('analysis')) return '#E8F5E9';
  return '#E3F2FD';
};

export const parseSection = (dateStr: string): '오늘' | '이전' => {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return '오늘';
    }
  } catch (e) {
    // parsing fallback
  }
  return '이전';
};

export const formatDisplayTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
  } catch (e) {
    return dateStr;
  }
};
