import { create } from 'zustand';

type AddAccountModalToggle = {
  modalActive: boolean;
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
};

export const useAddAccountModalToggle = create<AddAccountModalToggle>(
  (set) => ({
    modalActive: false,
    setFalse: () => set({ modalActive: false }),
    setTrue: () => set({ modalActive: true }),
    toggle: () => set((state) => ({ modalActive: !state.modalActive })),
  })
);
