import { create } from 'zustand';

interface InterestStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useInterestStore = create<InterestStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
