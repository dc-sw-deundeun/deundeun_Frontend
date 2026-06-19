import { create } from 'zustand';

interface AppState {
  count: number;
  isDarkMode: boolean;
  increment: () => void;
  decrement: () => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  isDarkMode: false,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  reset: () => set({ count: 0 }),
}));

export default useAppStore;
