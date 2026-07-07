import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet as RNStyleSheet } from 'react-native';
import Text from '@/components/Text';
import { CameraView } from 'expo-camera';
import { Camera as CameraIcon, Power, PowerOff } from 'lucide-react-native';
import { styles } from '../CheckupOcrScreen.styles';

interface CameraCaptureViewProps {
  cameraGranted: boolean;
  isCameraActive: boolean;
  cameraRef: React.RefObject<any>;
  scanLineAnim: Animated.Value;
  onToggleCamera: () => void;
  onTakePicture: () => void;
}

export const CameraCaptureView: React.FC<CameraCaptureViewProps> = ({
  cameraGranted,
  isCameraActive,
  cameraRef,
  scanLineAnim,
  onToggleCamera,
  onTakePicture,
}) => {
  return (
    <View style={styles.cameraContainer}>
      {cameraGranted && isCameraActive ? (
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            {/* Camera Toggle Button */}
            <TouchableOpacity style={styles.cameraToggleBtn} onPress={onToggleCamera}>
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
            <TouchableOpacity style={RNStyleSheet.absoluteFill} onPress={onTakePicture} />

            {/* Bottom Auto Scan Text */}
            <View style={styles.autoScanContainer} pointerEvents="none">
              <View style={styles.spinnerCircle} />
              <Text style={styles.autoScanText}>자동으로 읽고 있어요</Text>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <TouchableOpacity style={styles.cameraToggleBtn} onPress={onToggleCamera}>
            <Power color="#ffffff" size={20} />
          </TouchableOpacity>
          <CameraIcon color="#808080" size={40} style={{ marginBottom: 10 }} />
          <Text style={{ color: '#ffffff', fontSize: 14 }}>카메라가 꺼져 있습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default CameraCaptureView;
