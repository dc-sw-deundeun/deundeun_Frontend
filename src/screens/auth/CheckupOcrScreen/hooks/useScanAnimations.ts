import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// OCR 촬영 화면의 로고 펄스 / 스캔 라인 / 토스트 애니메이션을 담당하는 훅
export const useScanAnimations = (
  isProcessing: boolean,
  isCameraActive: boolean,
  showToast: boolean,
  setShowToast: (v: boolean) => void
) => {
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(logoScale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(logoOpacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
          Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      logoScale.setValue(1);
      logoOpacity.setValue(1);
    }
  }, [isProcessing]);

  // 스캔 라인 애니메이션
  useEffect(() => {
    if (isCameraActive && !isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0);
    }
  }, [isCameraActive, isProcessing]);

  // 토스트 메시지
  useEffect(() => {
    if (showToast) {
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setShowToast(false));
    }
  }, [showToast]);

  return { logoScale, logoOpacity, scanLineAnim, toastOpacity };
};

export default useScanAnimations;
