import { useState } from 'react';
import { Button, Flex, Text, useMantineTheme } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useEditMode } from '@/store/useEditMode';
import ModalsWrapper from '@/components/Modals/ModalWrapper';
import PinCodeValidate from './PinCodeValidate';
import PinCodeCreate from './PinCodeCreate';
import { useUserDataState } from '@/hooks/query/user';
import queryClient from '@/config/queryClient';

type LockWithPinProps = {
  onFinished?: () => void;
};

const LockWithPin = (props: LockWithPinProps) => {
  const { onFinished } = props;
  const [modalOpened, setModalOpened] = useState(false);

  const toggleModalOpened = () => {
    setModalOpened((prev) => !prev);
  };

  const setEditMode = useEditMode((state) => state.setTrue);
  const setViewMode = useEditMode((state) => state.setFalse);
  const editMode = useEditMode((state) => state.edit);
  const theme = useMantineTheme();

  const { data: user } = useUserDataState();

  const lockEditMode = () => {
    setViewMode();
  };

  const handleUnlockEditMode = () => {
    toggleModalOpened();
  };

  const handleValidated = () => {
    setEditMode();
    toggleModalOpened();
    onFinished?.();
  };

  const handleCodeCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    handleValidated();
  };

  return (
    <>
      <ModalsWrapper
        title="UNLOCK APP"
        opened={modalOpened}
        onClose={toggleModalOpened}
      >
        {user?.parentLock?.pin ? (
          <PinCodeValidate onValidated={handleValidated} />
        ) : (
          <PinCodeCreate onCreated={handleCodeCreated} />
        )}
      </ModalsWrapper>
      <Button
        size="4.5rem"
        radius="6rem"
        p="1.2rem"
        onClick={editMode ? lockEditMode : handleUnlockEditMode}
      >
        {editMode ? (
          <Flex align="center" gap="0.5rem" p="0 0.5rem 0 0.4rem">
            <IconLock size="2rem" color={theme.colors.gray[1]} />
            <Text>LOCK</Text>
          </Flex>
        ) : (
          <IconLock size="2rem" color={theme.colors.gray[1]} />
        )}
      </Button>
    </>
  );
};

export default LockWithPin;
