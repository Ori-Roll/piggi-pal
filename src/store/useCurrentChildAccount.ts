import { ChildAccount } from '@prisma/client';
import { create } from 'zustand';

type ChangeSelectedChildAccount = {
  selectedChildAccount: Partial<ChildAccount> | null;
  setSelectedChildAccount: (childAccount: Partial<ChildAccount>) => void;
};

export const useSelectedChildAccount =
  create<ChangeSelectedChildAccount | null>((set) => ({
    selectedChildAccount: null,
    setSelectedChildAccount: (childAccount) =>
      set({ selectedChildAccount: childAccount }),
  }));
