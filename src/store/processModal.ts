import { create } from 'zustand';

interface ProcessModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useProcessModal = create<ProcessModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
