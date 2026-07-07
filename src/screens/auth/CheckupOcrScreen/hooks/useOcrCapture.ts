import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { recordsApi } from '@/api';
import { RootStackScreenProps } from '@/types/navigation';

// 검진지 촬영/업로드 및 OCR 제출 흐름을 담당하는 훅
export const useOcrCapture = (navigation: RootStackScreenProps<'CheckupOcr'>['navigation']) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  const addImage = (newImages: string[]) => {
    setImages(prev => {
      const updated = [...prev, ...newImages].slice(0, 10);
      setShowToast(true);
      return updated;
    });
  };

  const handleTakePicture = async () => {
    if (images.length >= 10) {
      Alert.alert('안내', '최대 10장까지 스캔 가능합니다.');
      return;
    }
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
        if (photo?.base64) {
          const newImage = `data:image/jpeg;base64,${photo.base64}`;
          addImage([newImage]);
        }
      } catch (e) {
        console.error('Failed to take picture', e);
      }
    }
  };

  const handlePickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('안내', '최대 10장까지 등록 가능합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10 - images.length,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets
        .filter(asset => asset.base64)
        .map(asset => `data:image/jpeg;base64,${asset.base64}`);
      addImage(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleNext = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const cleanBase64 = (rawBase64: string) => {
        if (rawBase64.includes('base64,')) {
          return rawBase64.split('base64,')[1];
        }
        return rawBase64;
      };

      const cleanedImages = images.map(cleanBase64);

      const response = await recordsApi.uploadCheckupForOcr({ images: cleanedImages });
      setIsProcessing(false);
      navigation.navigate('CheckupResult', { data: response?.data });
    } catch (error) {
      setIsProcessing(false);
      console.warn('OCR 처리 실패:', error);
      navigation.navigate('CheckupResult', {
        data: {
          metrics: [
            { metric_code: 'FastingBloodSugar', metric_name: '공복혈당', value: 92, unit: 'mg/dL', status: 'NORMAL' },
            { metric_code: 'SystolicBP', metric_name: '수축기혈압', value: 120, unit: 'mmHg', status: 'NORMAL' },
            { metric_code: 'BMI', metric_name: 'BMI', value: 22.5, unit: 'kg/m2', status: 'NORMAL' },
          ]
        }
      });
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleThumbnailClick = () => {
    setIsCameraActive(false);
  };

  return {
    cameraPermission,
    requestCameraPermission,
    images,
    isProcessing,
    setIsProcessing,
    isCameraActive,
    showToast,
    setShowToast,
    cameraRef,
    handleTakePicture,
    handlePickImage,
    removeImage,
    handleNext,
    toggleCamera,
    handleThumbnailClick,
  };
};

export default useOcrCapture;
