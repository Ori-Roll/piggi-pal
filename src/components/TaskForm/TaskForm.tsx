import { useForm, zodResolver } from '@mantine/form';
import { Button, NumberInput, Space, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChildAccount, Task } from '@prisma/client';
import tasksService from '@/APIService/tasks';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import { TEMPORARY } from '@/common/consts';
import { useUpdateOnMutationCallback } from '@/hooks/utilHooks';
import { createTaskSchema } from '@/validations/tasks';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type TaskFormProps = {
  task?: Partial<Task>;
  onSubmitCallback?: (data: Partial<Task>) => void;
  selectedChildAccount: ChildAccount;
};

const TaskForm = (props: TaskFormProps) => {
  const { task, onSubmitCallback, selectedChildAccount } = props;

  const queryClient = useQueryClient();

  const updateChildAccountOnTaskMutation = useUpdateOnMutationCallback(
    ['currentChildAccount', selectedChildAccount.id],
    (newTask: Partial<Task>) => (old: ChildAccountWithAllData) => {
      return {
        ...old,
        tasks: [...(old.tasks || []), { id: TEMPORARY, ...newTask }],
      };
    }
  );

  const { mutateAsync } = useMutation({
    mutationFn: (taskData: Partial<Task>) => tasksService.createTask(taskData),
    onMutate: updateChildAccountOnTaskMutation,
    onError: (err, newTaskData, context) => {
      queryClient.setQueryData(
        ['currentChildAccount'],
        context?.previousQueriesData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const handleAddTask = async (task: Partial<Task>) => {
    onSubmitCallback?.(task);
    await mutateAsync(task);
  };

  const initialValues: Partial<Task> | null = selectedChildAccount?.id
    ? {
        ...(task ? task : {}),
        title: '',
        amount: 1,
        childAccountId: selectedChildAccount?.id,
        availableAt: new Date(),
        requiredTimes: 1,
      }
    : null;

  const form = useForm<Partial<Task>>({
    ...(initialValues ? { initialValues } : {}),
    validate: zodResolver(createTaskSchema),
  });

  if (!selectedChildAccount) {
    return 'No Child Account selected';
  }

  return (
    <form onSubmit={form.onSubmit(handleAddTask)}>
      <TextInput
        label={'Task name?'}
        key={form.key('title')}
        placeholder='Write something like "Take out the trash"'
        {...form.getInputProps('title')}
      />
      <TextInput
        label={'Description'}
        key={form.key('description')}
        placeholder="Write a short description if needed"
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={'How many times?'}
        key={form.key('requiredTimes')}
        {...form.getInputProps('requiredTimes')}
      />
      <NumberInput
        label={'Amount'}
        key={form.key('amount')}
        placeholder="How much for this extra task?"
        {...form.getInputProps('amount')}
      />
      <Space h="20px" />
      <ActionButton
        w="100%"
        type="submit"
        styles={{
          label: {
            justifyContent: 'center',
            width: '100%',
          },
        }}
      >
        Add task
      </ActionButton>
    </form>
  );
};

export default TaskForm;
