import { create } from 'zustand';
import React from 'react';

interface ModalConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  hideCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AppState {
  count: number;
  isDarkMode: boolean;
  modalVisible: boolean;
  modalConfig: ModalConfig | null;
  increment: () => void;
  decrement: () => void;
  toggleDarkMode: () => void;
  reset: () => void;
  showAlert: (title: string, description: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, description: string, onConfirm: () => void, onCancel?: () => void) => void;
  hideModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  isDarkMode: false,
  modalVisible: false,
  modalConfig: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  reset: () => set({ count: 0 }),
  showAlert: (title, description, onConfirm) => set({
    modalVisible: true,
    modalConfig: { title, description, hideCancel: true, onConfirm },
  }),
  showConfirm: (title, description, onConfirm, onCancel) => set({
    modalVisible: true,
    modalConfig: { title, description, hideCancel: false, onConfirm, onCancel },
  }),
  hideModal: () => set({ modalVisible: false }),
}));

export default useAppStore;
