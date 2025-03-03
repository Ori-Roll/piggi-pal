import { create } from 'zustand';

type AddChildAccountModalToggle = {
  modalActive: boolean;
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
};

export const useAddChildAccountModalToggle = create<AddChildAccountModalToggle>(
  (set) => ({
    modalActive: false,
    setFalse: () => set({ modalActive: false }),
    setTrue: () => set({ modalActive: true }),
    toggle: () => set((state) => ({ modalActive: !state.modalActive })),
  })
);
