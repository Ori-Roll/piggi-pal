import { useForm } from '@mantine/form';
import { Button, NumberInput, Space, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@prisma/client';
import tasksService from '@/APIService/tasks';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import { TEMPORARY } from '@/common/consts';

type periodicFormProps = {
  task?: Partial<Task>;
  onSubmitCallback?: (data: Partial<Task>) => void;
  selectedChildAccount: null | Partial<ChildAccountWithAllData>;
};

const PeriodicForm = (props: periodicFormProps) => {
  const { task, onSubmitCallback, selectedChildAccount } = props;

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (taskData: Partial<Task>) => tasksService.createTask(taskData),
    onMutate: async (newTask: Partial<Task>) => {
      await queryClient.cancelQueries({
        queryKey: ['currentChildAccount', selectedChildAccount?.id],
      });
      const previousChildAccountData = queryClient.getQueryData([
        'currentChildAccount',
        selectedChildAccount?.id,
      ]);

      queryClient.setQueryData(
        ['currentChildAccount', selectedChildAccount?.id],
        (old: Partial<ChildAccountWithAllData>) => {
          console.log('old  ', old);
          return {
            ...old,
            tasks: [...(old.tasks || []), { id: TEMPORARY, ...newTask }],
          };
        }
      );

      return { previousChildAccountData };
    },
    onError: (err, newTaskData, context) => {
      queryClient.setQueryData(
        ['currentChildAccount'],
        context?.previousChildAccountData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const handleAddPeriodic = async (task: Partial<Task>) => {
    await mutateAsync(task);
    onSubmitCallback?.(task);
  };

  const initialValues: Partial<Task> | null = selectedChildAccount?.id
    ? {
        ...(task ? task : {}),
        title: '',
        amount: 0,
        childAccountId: selectedChildAccount?.id,
        availableAt: new Date(),
        requiredTimes: 1,
      }
    : null;

  const form = useForm<Partial<Task>>({
    ...(initialValues ? { initialValues } : {}),
  });

  if (!selectedChildAccount) {
    return 'No Child Account selected';
  }

  return (
    <form onSubmit={form.onSubmit(handleAddPeriodic)}>
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
      <Button w="100%" type="submit">
        Add
      </Button>
    </form>
  );
};

export default PeriodicForm;
