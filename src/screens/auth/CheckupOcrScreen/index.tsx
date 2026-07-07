import React from 'react';
import { View, TouchableOpacity, Animated, ScrollView } from 'react-native';
import Text from '@/components/Text';
import { RootStackScreenProps } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { Plus } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { onboardingApi } from '@/api';
import { styles } from './CheckupOcrScreen.styles';
import { CameraCaptureView } from './components/CameraCaptureView';
import { UploadedImageList } from './components/UploadedImageList';
import { ProcessingView } from './components/ProcessingView';
import { useOcrCapture } from './hooks/useOcrCapture';
import { useScanAnimations } from './hooks/useScanAnimations';

export default function CheckupOcrScreen({ navigation }: RootStackScreenProps<'CheckupOcr'>) {
  const { isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const {
    cameraPermission,
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
  } = useOcrCapture(navigation);

  const { logoScale, logoOpacity, scanLineAnim, toastOpacity } = useScanAnimations(
    isProcessing,
    isCameraActive,
    showToast,
    setShowToast
  );

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (isProcessing) {
    return <ProcessingView logoScale={logoScale} logoOpacity={logoOpacity} theme={theme} />;
  }

  const buttonColor = '#475C3A';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F5F4EE' }]}>
      <ScreenHeader
        title="결과지 촬영"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={async () => {
            setIsProcessing(true);
            try {
              await onboardingApi.completeOnboarding();
            } catch (e) {
              console.warn('Complete Onboarding Error:', e);
            } finally {
              setIsProcessing(false);
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            }
          }}>
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
          <CameraCaptureView
            cameraGranted={!!cameraPermission.granted}
            isCameraActive={isCameraActive}
            cameraRef={cameraRef}
            scanLineAnim={scanLineAnim}
            onToggleCamera={toggleCamera}
            onTakePicture={handleTakePicture}
          />

          {/* Upload Box */}
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handlePickImage}
          >
            <Plus color="#ffffff" size={16} strokeWidth={2.5} />
            <Text style={styles.uploadText}>클릭하여 이미지 업로드</Text>
          </TouchableOpacity>

          {/* Uploaded List */}
          <UploadedImageList
            images={images}
            onThumbnailPress={handleThumbnailClick}
            onRemove={removeImage}
          />
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
