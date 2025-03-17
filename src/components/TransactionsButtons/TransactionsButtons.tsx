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
};

type CurrentType = 'deposit' | 'withdraw';

const TransactionsButtons = (props: TransactionsButtonsProps) => {
  const { selectedChildAccount } = props;

  const [editCurrentModalOpened, setEditCurrentModalOpened] =
    useState<CurrentType | null>(null);

  const isMobile = useIsMobile();

  const editCurrentBGColor = defaultColors.primaryColor;
  const editCurrentColor = getTextColorForBackground(editCurrentBGColor);

  const onEditCurrentClick = (type: CurrentType) => {
    setEditCurrentModalOpened(type);
  };

  const depositMutationFn = async (amount: number) => {
    await childAccountsService.updateChildAccount(
      {
        current: selectedChildAccount.current + amount,
      },
      selectedChildAccount.id
    );
  };

  const withdrawMutationFn = async (amount: number) => {
    await childAccountsService.updateChildAccount(
      {
        current: selectedChildAccount.current - amount,
      },
      selectedChildAccount.id
    );
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
        >
          <IconPencilMinus size="1.2rem" color={editCurrentBGColor} />
          <Text size="sm" lh="sm">
            Withdraw
          </Text>
        </ActionButton>
        {/* <ActionButton
          onClick={onEditCurrentClick}
          colorAccent={editCurrentColor}
          style={{
            minHeight: '2rem',
            minWidth: 'fit-content',
          }}
        >
          <Text size="sm">Withdraw</Text>
          <IconPencilMinus size="1.2rem" color={editCurrentBGColor} />
        </ActionButton> */}
      </Flex>
      <ModalsWrapper
        title="Edit Current"
        opened={!!editCurrentModalOpened}
        onClose={() => setEditCurrentModalOpened(null)}
      >
        {editCurrentModalOpened === 'deposit' ? (
          <TransactionModal
            submitTitle="Deposit"
            selectedChildAccount={selectedChildAccount}
            mutationFn={depositMutationFn}
            onSubmitCallback={() => setEditCurrentModalOpened(null)}
          />
        ) : (
          <TransactionModal
            submitTitle="Withdraw"
            selectedChildAccount={selectedChildAccount}
            mutationFn={withdrawMutationFn}
            onSubmitCallback={() => setEditCurrentModalOpened(null)}
          />
        )}
      </ModalsWrapper>
    </>
  );
};

export default TransactionsButtons;
