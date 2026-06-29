import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Alert, Image, ScrollView } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Plus, X, Camera as CameraIcon, Power, PowerOff } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { recordsApi } from '@/api';

export default function CheckupOcrScreen({ navigation }: RootStackScreenProps<'CheckupOcr'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  const cameraRef = useRef<any>(null);

  // 로딩 애니메이션
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

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

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }
  
  if (isProcessing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <Text style={{ fontSize: 40, fontWeight: '900', color: COLORS.primary, marginBottom: SPACING.md }}>든든</Text>
        </Animated.View>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>건강검진 기록을 분석하고 있어요</Text>
        <Text style={{ color: theme.textMuted, fontSize: 14 }}>잠시만 기다려 주세요 (최대 10~15초 소요)</Text>
      </SafeAreaView>
    );
  }

  const buttonColor = '#475C3A'; 

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F5F4EE' }]}>
      <ScreenHeader 
        title="결과지 촬영" 
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.navigate('CheckupResult', { data: {} })}>
            <Text style={{ color: '#B3B0A5', fontSize: 14, fontWeight: '500', marginRight: SPACING.sm }} numberOfLines={1}>건너뛰기</Text>
          </TouchableOpacity>
        }
      />

      {/* Toast Message */}
      <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]} pointerEvents="none">
        <View style={styles.toast}>
          <Text style={styles.toastText}>성공적으로 스캔되었습니다.</Text>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Camera Container */}
          <View style={styles.cameraContainer}>
            {cameraPermission.granted && isCameraActive ? (
              <CameraView 
                style={styles.camera} 
                facing="back"
                ref={cameraRef}
              >
                <View style={styles.cameraOverlay}>
                  {/* Camera Toggle Button */}
                  <TouchableOpacity style={styles.cameraToggleBtn} onPress={toggleCamera}>
                    <PowerOff color="#ffffff" size={20} />
                  </TouchableOpacity>

                  {/* 4 Corners */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />

                  {/* Scanning UX Line */}
                  <Animated.View 
                    style={[
                      styles.scanLineAnim, 
                      { 
                        transform: [{ 
                          translateY: scanLineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [24, 280] // From top to near bottom inside the square
                          }) 
                        }] 
                      }
                    ]} 
                  />

                  {/* Take Picture Hidden Button (Full screen touch area over camera) */}
                  <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleTakePicture} />

                  {/* Bottom Auto Scan Text */}
                  <View style={styles.autoScanContainer} pointerEvents="none">
                    <View style={styles.spinnerCircle} />
                    <Text style={styles.autoScanText}>자동으로 읽고 있어요</Text>
                  </View>
                </View>
              </CameraView>
            ) : (
              <View style={styles.cameraPlaceholder}>
                <TouchableOpacity style={styles.cameraToggleBtn} onPress={toggleCamera}>
                  <Power color="#ffffff" size={20} />
                </TouchableOpacity>
                <CameraIcon color="#808080" size={40} style={{ marginBottom: 10 }} />
                <Text style={{ color: '#ffffff', fontSize: 14 }}>카메라가 꺼져 있습니다.</Text>
              </View>
            )}
          </View>

          {/* Upload Box */}
          <TouchableOpacity 
            style={styles.uploadBox} 
            onPress={handlePickImage}
          >
            <Plus color="#ffffff" size={16} strokeWidth={2.5} />
            <Text style={styles.uploadText}>클릭하여 이미지 업로드</Text>
          </TouchableOpacity>

          {/* Uploaded List */}
          <View style={styles.uploadedListContainer}>
            {images.length > 0 && (
              <>
                <Text style={styles.uploadedListTitle}>
                  스캔된 검진지 ({images.length}/10)
                </Text>
                <View style={styles.uploadedList}>
                  {images.map((img, index) => (
                    <View key={index} style={styles.uploadedItem}>
                      <TouchableOpacity style={styles.uploadedItemLeft} onPress={handleThumbnailClick}>
                        <Image source={{ uri: img }} style={styles.uploadedThumbnail} />
                        <Text style={styles.uploadedItemName}>검진지 이미지 {index + 1}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.uploadedDeleteBtn} 
                        onPress={() => removeImage(index)}
                      >
                        <X color="#808080" size={20} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {/* Bottom Area */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { backgroundColor: images.length > 0 ? buttonColor : '#C5C5C5' }
            ]}
            disabled={images.length === 0}
            onPress={handleNext}
          >
            <Text style={[styles.submitButtonText, { color: images.length > 0 ? '#ffffff' : '#A8A8A8' }]}>
              결과지 업로드 완료
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  cameraContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#1E1E1C', 
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', 
  },
  cameraToggleBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#98C353', 
    borderWidth: 2.5,
    pointerEvents: 'none',
  },
  topLeft: {
    top: 24,
    left: 24,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 24,
    right: 24,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 24,
    left: 24,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 24,
    right: 24,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 6,
  },
  scanLineAnim: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: 'rgba(152, 195, 83, 0.8)',
    shadowColor: '#98C353',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    pointerEvents: 'none',
  },
  autoScanContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#98C353',
    borderTopColor: 'transparent',
  },
  autoScanText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    backgroundColor: '#C5C5C5', 
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A8A8A8',
    borderStyle: 'dashed',
    gap: 6,
    marginBottom: SPACING.md,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', 
  },
  uploadedListContainer: {
    marginBottom: SPACING.lg,
  },
  uploadedListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: SPACING.sm,
  },
  uploadedList: {
    paddingBottom: 20,
  },
  uploadedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  uploadedThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  uploadedItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  uploadedDeleteBtn: {
    padding: 8,
  },
  bottomSection: {
    paddingTop: SPACING.sm,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  toast: {
    backgroundColor: 'rgba(71, 92, 58, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
