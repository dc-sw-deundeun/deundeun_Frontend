import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const GlobalModal: React.FC = () => {
  const { modalVisible, modalConfig, hideModal, isDarkMode } = useAppStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  if (!modalConfig) return null;

  const {
    title,
    description,
    icon,
    confirmText = '확인',
    hideCancel = false,
    onCancel,
    onConfirm,
  } = modalConfig;

  const handleCancel = () => {
    if (onCancel) onCancel();
    hideModal();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View 
          style={[
            styles.modalContent, 
            { 
              backgroundColor: theme.background, 
              borderColor: theme.border,
            }
          ]}
        >
          {icon ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {icon}
              <Text style={[styles.modalTitleText, { color: theme.text }]}>{title}</Text>
            </View>
          ) : (
            <Text style={[styles.modalTitleText, { color: theme.text }]}>{title}</Text>
          )}
          <Text style={[styles.modalDescriptionText, { color: theme.textMuted }]}>
            {description}
          </Text>
          <View style={styles.modalActions}>
            {!hideCancel && (
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn, { borderColor: theme.border }]}
                onPress={handleCancel}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>취소</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.modalBtn, styles.confirmBtn]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: 24, 
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalDescriptionText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
    marginTop: SPACING.sm,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default GlobalModal;
