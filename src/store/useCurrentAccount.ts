import { Account } from '@prisma/client';
import { create } from 'zustand';

type ChangeSelectedAccount = {
  selectedAccount: Partial<Account> | null;
  setSelectedAccount: (account: Partial<Account>) => void;
};

export const useSelectedAccount = create<ChangeSelectedAccount | null>(
  (set) => ({
    selectedAccount: null,
    setSelectedAccount: (account) => set({ selectedAccount: account }),
  })
);
