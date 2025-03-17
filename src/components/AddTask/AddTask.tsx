import { useState } from 'react';
import { Text, useMantineTheme } from '@mantine/core';
import { IconAward } from '@tabler/icons-react';
import ModalsWrapper from '@/components/Modals/ModalWrapper';
import TaskForm from '@/components/TaskForm/TaskForm';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { ChildAccount } from '@prisma/client';

type AddTaskProps = {
  selectedChildAccount?: ChildAccount;
  onSubmitCallback?: () => void;
};

const AddTask = (props: AddTaskProps) => {
  const { selectedChildAccount, onSubmitCallback } = props;

  const [modalOpened, setModalOpened] = useState(false);

  const theme = useMantineTheme();

  const toggleModalOpened = () => {
    setModalOpened((prev) => !prev);
  };
  const handleAddTaskSubmit = () => {
    setModalOpened(false);
    onSubmitCallback?.();
  };

  return (
    <>
      <ModalsWrapper
        title="ADD BONUS TASK"
        opened={modalOpened}
        onClose={toggleModalOpened}
      >
        {selectedChildAccount && (
          <TaskForm
            selectedChildAccount={selectedChildAccount}
            onSubmitCallback={handleAddTaskSubmit}
          />
        )}
      </ModalsWrapper>
      <ActionButton
        onClick={toggleModalOpened}
        colorAccent={theme.colors.orange[4]}
        rightSection={<IconAward size="2rem" color={theme.colors.orange[4]} />}
        disabled={!selectedChildAccount}
      >
        <Text c={theme.colors.dark[5]}>Add Bonus task</Text>
      </ActionButton>
    </>
  );
};

export default AddTask;
