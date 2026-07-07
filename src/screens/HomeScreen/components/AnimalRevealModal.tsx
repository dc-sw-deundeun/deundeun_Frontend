import React from 'react';
import { View, TouchableOpacity, Modal, Animated, Pressable, Image } from 'react-native';
import Text from '@/components/Text';
import { COLORS } from '@/constants/theme';
import { styles } from '../HomeScreen.styles';
import { ANIMAL_NAMES, getRevealImage } from '../constants';

interface AnimalRevealModalProps {
  currentRevealAnimal: string | null;
  revealStep: 'idle' | 'shaking' | 'revealed';
  shakeStyle: any;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  onShakePress: () => void;
  onConfirm: () => void;
  onRequestClose: () => void;
}

export const AnimalRevealModal: React.FC<AnimalRevealModalProps> = ({
  currentRevealAnimal,
  revealStep,
  shakeStyle,
  fadeAnim,
  scaleAnim,
  onShakePress,
  onConfirm,
  onRequestClose,
}) => {
  return (
    <Modal
      visible={currentRevealAnimal !== null}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.revealModalOverlay}>
        <View style={styles.revealModalContainer}>
          {revealStep !== 'revealed' ? (
            <Pressable onPress={onShakePress} style={styles.revealInteractArea}>
              <Animated.View style={[shakeStyle, styles.giftBoxWrapper]}>
                <Image source={require('../../../assets/giftbox.png')} style={styles.giftBoxImage} />
              </Animated.View>
              <Text style={styles.revealInteractText}>
                {revealStep === 'shaking' ? '깨어나는 중...' : '선물이 도착했어요!\n톡! 눌러서 확인해보세요'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.revealSuccessContainer}>
              <Text style={styles.revealSuccessTitle}>새로운 친구 등장!</Text>

              <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], marginVertical: 20 }}>
                <Image
                  source={getRevealImage(currentRevealAnimal!)}
                  style={styles.revealAnimalImage}
                />
              </Animated.View>

              <Text style={styles.revealSuccessText}>
                새로운 친구 {ANIMAL_NAMES[currentRevealAnimal!] || currentRevealAnimal}이 정원에 합류했습니다!
              </Text>

              <TouchableOpacity
                style={[styles.revealConfirmButton, { backgroundColor: COLORS.primary }]}
                onPress={onConfirm}
              >
                <Text style={styles.revealConfirmButtonText}>정원 가기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AnimalRevealModal;
