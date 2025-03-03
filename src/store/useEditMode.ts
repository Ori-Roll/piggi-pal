import { create } from 'zustand';

type EditMode = {
  edit: boolean;
  setFalse: () => void;
  setTrue: () => void;
  toggle: () => void;
};

export const useEditMode = create<EditMode>((set) => ({
  edit: false,
  setFalse: () => set({ edit: false }),
  setTrue: () => set({ edit: true }),
  toggle: () => set((state) => ({ edit: !state.edit })),
}));
