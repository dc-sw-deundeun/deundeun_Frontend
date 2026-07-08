import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet as RNStyleSheet } from 'react-native';
import Text from '@/components/Text';
import { CameraView } from 'expo-camera';
import { Camera as CameraIcon, Power, PowerOff, Image as ImageIcon } from 'lucide-react-native';
import { styles } from '../CheckupOcrScreen.styles';

interface CameraCaptureViewProps {
  cameraGranted: boolean;
  isCameraActive: boolean;
  cameraRef: React.RefObject<any>;
  scanLineAnim: Animated.Value;
  onToggleCamera: () => void;
  onTakePicture: () => void;
  onPickImage: () => void;
}

export const CameraCaptureView: React.FC<CameraCaptureViewProps> = ({
  cameraGranted,
  isCameraActive,
  cameraRef,
  scanLineAnim,
  onToggleCamera,
  onTakePicture,
  onPickImage,
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

            {/* Bottom Controls */}
            <View style={styles.bottomControlsContainer}>
              {/* Album Button */}
              <TouchableOpacity style={styles.albumBtn} onPress={onPickImage}>
                <ImageIcon color="#ffffff" size={28} />
                <Text style={styles.albumText}>앨범</Text>
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity style={styles.captureBtn} onPress={onTakePicture}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
              
              {/* Empty placeholder to center the capture button properly */}
              <View style={styles.albumBtn} />
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <CameraIcon color="#808080" size={40} style={{ marginBottom: 10 }} />
          <Text style={{ color: '#ffffff', fontSize: 14 }}>카메라가 꺼져 있습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default CameraCaptureView;
