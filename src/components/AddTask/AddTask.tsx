import { useState } from 'react';
import { Text, useMantineTheme } from '@mantine/core';
import { IconAward } from '@tabler/icons-react';
import ModalsWrapper from '@/components/Modals/ModalWrapper';
import TaskForm from '@/components/TaskForm/TaskForm';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { ChildAccountWithAllData } from '@/types/dataTypes';

type AddTaskProps = {
  selectedChildAccount?: Partial<ChildAccountWithAllData>;
};

const AddTask = (props: AddTaskProps) => {
  const { selectedChildAccount } = props;

  const [modalOpened, setModalOpened] = useState(false);

  const theme = useMantineTheme();

  const toggleModalOpened = () => {
    setModalOpened((prev) => !prev);
  };
  const handleAddTaskSubmit = () => {
    setModalOpened(false);
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
