import { useState } from 'react';
import { Flex, Text } from '@mantine/core';
import { IconPencilPlus, IconPencilMinus } from '@tabler/icons-react';
import { defaultColors, getTextColorForBackground } from '@/utils/colors';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import ModalsWrapper from '@/components/Modals/ModalWrapper';
import { useIsMobile } from '@/hooks/configHooks';
import style from './TransactionsButtons.module.css';
import TransactionModal from '../base/TransactionModal/TransactionModal';
import { ChildAccount } from '@prisma/client';
import childAccountsService from '@/APIService/childAccounts';

type TransactionsButtonsProps = {
  selectedChildAccount: ChildAccount;
  childAccountMutationFn: (childAccountData: Partial<ChildAccount>) => void;
  disabled?: boolean;
};

type CurrentType = 'deposit' | 'withdraw';

const TransactionsButtons = (props: TransactionsButtonsProps) => {
  const { selectedChildAccount, childAccountMutationFn, disabled } = props;

  const [editCurrentModalOpened, setEditCurrentModalOpened] =
    useState<CurrentType | null>(null);

  const isMobile = useIsMobile();

  const editCurrentBGColor = defaultColors.primaryColor;
  const editCurrentColor = getTextColorForBackground(editCurrentBGColor);

  const onEditCurrentClick = (type: CurrentType) => {
    setEditCurrentModalOpened(type);
  };

  const depositMutationFn = async (amount: number) => {
    childAccountMutationFn({
      current: selectedChildAccount.current + amount,
    });
  };

  const withdrawMutationFn = async (amount: number) => {
    childAccountMutationFn({
      current: selectedChildAccount.current - amount,
    });
  };

  return (
    <>
      <Flex
        direction="row"
        gap="1.2rem"
        style={{
          alignSelf: 'end',
        }}
        w={isMobile ? '100%' : 'unset'}
      >
        <ActionButton
          onClick={() => onEditCurrentClick('deposit')}
          style={{
            display: 'flex',
            gap: '0.5rem',
            minWidth: 'fit-content',
            minHeight: '1rem',
            width: '100%',
          }}
          size="sm"
          disabled={disabled}
        >
          <IconPencilPlus size="1.2rem" color={editCurrentBGColor} />
          <Text size="sm" lh="sm">
            Deposit
          </Text>
        </ActionButton>
        <ActionButton
          onClick={() => onEditCurrentClick('withdraw')}
          style={{
            display: 'flex',
            gap: '0.5rem',
            minWidth: 'fit-content',
            minHeight: '1rem',
            width: '100%',
          }}
          size="sm"
          disabled={disabled}
        >
          <IconPencilMinus size="1.2rem" color={editCurrentBGColor} />
          <Text size="sm" lh="sm">
            Withdraw
          </Text>
        </ActionButton>
      </Flex>
      <ModalsWrapper
        title={editCurrentModalOpened === 'deposit' ? 'Deposit' : 'Withdraw'}
        opened={!!editCurrentModalOpened}
        onClose={() => setEditCurrentModalOpened(null)}
      >
        {editCurrentModalOpened === 'deposit' ? (
          <TransactionModal
            submitTitle="Deposit"
            selectedChildAccount={selectedChildAccount}
            updateFn={depositMutationFn}
            onSubmitCallback={() => setEditCurrentModalOpened(null)}
          />
        ) : (
          <TransactionModal
            submitTitle="Withdraw"
            selectedChildAccount={selectedChildAccount}
            updateFn={withdrawMutationFn}
            onSubmitCallback={() => setEditCurrentModalOpened(null)}
          />
        )}
      </ModalsWrapper>
    </>
  );
};

export default TransactionsButtons;
