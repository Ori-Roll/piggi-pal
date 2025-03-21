import React, { useState } from 'react';
import { Center, Modal, Flex, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { defaultColors } from '@/utils/colors';
import AddNewChildAccountModal from '@/components/Modals/AddNewChildAccountModal';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type NoChildAccountsProps = {};

function NoChildAccounts(props: NoChildAccountsProps) {
  const [addChildModalOpened, setAddChildModalOpened] = useState(false);

  const queryClient = useQueryClient();

  const onNewAccountCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    setAddChildModalOpened(false);
  };

  return (
    <Center h="30vh">
      <Modal
        withCloseButton={false}
        opened={addChildModalOpened}
        onClose={() => setAddChildModalOpened(false)}
      >
        <Flex direction="column" gap="lg" align="center">
          <Text size="lg" fw={700}>
            Welcome to Piggi-pal!
          </Text>
          <Text size="md" ta="center">
            This is where you can create an account for your child to track his
            allowance, create tasks for him to accomplish and more
          </Text>
          <Text size="md" ta="center">
            Start by creating a new account with an initial balance.
          </Text>
        </Flex>
        <AddNewChildAccountModal onSubmitCallback={onNewAccountCreated} />
      </Modal>
      <Flex direction="column" align="center" gap="lg">
        <Text>No child account yet. Please create one</Text>
        <ActionButton
          size="md"
          onClick={() => setAddChildModalOpened(true)}
          styles={{
            label: {
              justifyContent: 'center',
              color: defaultColors.accentColor,
              width: '100%',
            },
          }}
        >
          Create new account
        </ActionButton>
      </Flex>
    </Center>
  );
}

export default NoChildAccounts;
