import { useState } from 'react';
import { useMantineTheme, Text } from '@mantine/core';
import ModalsWrapper from '../Modals/ModalWrapper';
import PeriodicForm from '@/components/PeriodicForm/PeriodicForm';
import { Account } from '@prisma/client';
import { IconCalendarDollar as ButtonIcon } from '@tabler/icons-react';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type AddPeriodicProps = { selectedAccount?: null | Partial<Account> };

const AddPeriodic = (props: AddPeriodicProps) => {
  const { selectedAccount } = props;

  const theme = useMantineTheme();

  const [modalOpened, setModalOpened] = useState(false);

  const toggleModalOpened = () => {
    setModalOpened((prev) => !prev);
  };

  const handleAddPeriodicSubmit = () => {
    setModalOpened(false);
  };

  return (
    <>
      <ModalsWrapper
        title="ADD ALLOWANCE"
        opened={modalOpened}
        onClose={toggleModalOpened}
      >
        {selectedAccount && (
          <PeriodicForm
            onSubmitCallback={handleAddPeriodicSubmit}
            selectedAccount={selectedAccount}
          />
        )}
      </ModalsWrapper>
      <ActionButton
        onClick={toggleModalOpened}
        colorAccent={theme.colors.indigo[6]}
        rightSection={<ButtonIcon size="2rem" color={theme.colors.indigo[6]} />}
        disabled={!selectedAccount}
      >
        <Text c={theme.colors.dark[5]}>{`Add Allowance`}</Text>
      </ActionButton>
    </>
  );
};

export default AddPeriodic;
