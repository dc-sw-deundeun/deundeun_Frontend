import { useState } from 'react';
import { Alert } from 'react-native';
import { recordsApi } from '@/api';

// 수동 검진 결과 입력 폼 상태 및 저장을 담당하는 훅
export const useManualCheckupForm = (onSaved: () => void) => {
  // Form States prefilled with wireframe values
  const [examDate, setExamDate] = useState('2023-10-27');
  const [bloodSugar, setBloodSugar] = useState('126');
  const [cholesterol, setCholesterol] = useState('232');
  const [bloodPressure, setBloodPressure] = useState('138/88');
  const [bmi, setBmi] = useState('23.4');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const bpParts = bloodPressure.split('/');
      const systolic = bpParts[0]?.trim() || null;
      const diastolic = bpParts[1]?.trim() || null;

      const metricsList = [];
      if (bloodSugar) {
        metricsList.push({
          metric_code: 'FastingBloodSugar',
          metric_name: '공복혈당',
          value: bloodSugar,
          unit: 'mg/dL',
          is_edited: true,
        });
      }
      if (cholesterol) {
        metricsList.push({
          metric_code: 'TotalCholesterol',
          metric_name: '총콜레스테롤',
          value: cholesterol,
          unit: 'mg/dL',
          is_edited: true,
        });
      }
      if (systolic) {
        metricsList.push({
          metric_code: 'SystolicBP',
          metric_name: '수축기혈압',
          value: systolic,
          unit: 'mmHg',
          is_edited: true,
        });
      }
      if (diastolic) {
        metricsList.push({
          metric_code: 'DiastolicBP',
          metric_name: '이완기혈압',
          value: diastolic,
          unit: 'mmHg',
          is_edited: true,
        });
      }
      if (bmi) {
        metricsList.push({
          metric_code: 'BMI',
          metric_name: 'BMI',
          value: bmi,
          unit: 'kg/m2',
          is_edited: true,
        });
      }

      const res = await recordsApi.createManualCheckup({
        measured_at: examDate ? `${examDate}T00:00:00Z` : null,
        metrics: metricsList,
      });

      setIsLoading(false);

      if (res.success) {
        Alert.alert('기록 저장 완료', '수동 검진 수치 데이터가 안전하게 저장되었습니다!', [
          {
            text: '확인',
            onPress: onSaved,
          },
        ]);
      } else {
        Alert.alert('저장 실패', res.message || '알 수 없는 이유로 저장에 실패했습니다.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Manual Save Error:', error);
      Alert.alert('오류', '검진 기록 저장 중 오류가 발생했습니다.');
    }
  };

  return {
    examDate,
    setExamDate,
    bloodSugar,
    setBloodSugar,
    cholesterol,
    setCholesterol,
    bloodPressure,
    setBloodPressure,
    bmi,
    setBmi,
    isLoading,
    handleSave,
  };
};

export default useManualCheckupForm;
