import { ChildAccountWithAllData } from '@/types/dataTypes';
import { create } from 'zustand';

type ChangeSelectedChildAccount = {
  selectedChildAccount: Partial<ChildAccountWithAllData> | null;
  setSelectedChildAccount: (
    childAccount: Partial<ChildAccountWithAllData>
  ) => void;
};

export const useSelectedChildAccount =
  create<ChangeSelectedChildAccount | null>((set) => ({
    selectedChildAccount: null,
    setSelectedChildAccount: (childAccount) =>
      set({ selectedChildAccount: childAccount }),
  }));
