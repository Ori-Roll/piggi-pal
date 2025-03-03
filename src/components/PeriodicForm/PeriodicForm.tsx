import { useForm } from '@mantine/form';
import { Button, NumberInput, Select, Space, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Account, Periodic } from '@prisma/client';
import periodicsService from '@/APIService/periodics';
import {
  actionTypeOptions,
  endDatesDisabled,
  intervalOptions,
  minEndDate,
} from './util';

type periodicFormProps = {
  periodic?: Partial<Periodic>;
  selectedAccount: Partial<Account>;
  onSubmitCallback: (data: Partial<Periodic>) => void;
};

const PeriodicForm = (props: periodicFormProps) => {
  const { periodic, onSubmitCallback, selectedAccount } = props;

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (periodicData: Partial<Periodic>) =>
      periodicsService.createPeriodic(periodicData),
    // When mutate is called:
    onMutate: async (newPeriodic: Partial<Periodic>) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['currentAccount'] });

      // Snapshot the previous value
      const previousAccountData = queryClient.getQueryData(['currentAccount']);

      // Optimistically update to the new value
      queryClient.setQueryData(['currentAccount'], (old: Partial<Account>) => ({
        ...old,
        newPeriodic,
      }));

      // Return a context object with the snapshotted value
      return { previousAccountData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newPeriodicData, context) => {
      queryClient.setQueryData(
        ['currentAccount'],
        context?.previousAccountData
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentAccount'] });
    },
  });

  const handleAddPeriodic = async (periodic: Partial<Periodic>) => {
    await mutateAsync(periodic);
    onSubmitCallback(periodic);
  };

  const initialValues = {
    ...(periodic ? periodic : {}),
    accountId: selectedAccount.id,
    interval: intervalOptions[0].value,
    actionType: actionTypeOptions[0].value,
    title: 'Allowance', //TODO: This is now fixed - think what is it for
    startsAt: new Date(),
  };

  // TODO: Fix this type
  const form = useForm<Partial<Periodic>>({
    initialValues,
  });

  return (
    <form onSubmit={form.onSubmit(handleAddPeriodic)}>
      <TextInput
        label={'Name'}
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <Select
        label="Each"
        placeholder="Pick value"
        data={intervalOptions}
        defaultValue={intervalOptions[0].value}
        {...form.getInputProps('interval')}
      />
      <Select
        label="The account will be"
        placeholder="Pick value"
        data={actionTypeOptions}
        defaultValue={actionTypeOptions[0].value}
        {...form.getInputProps('actionType')}
      />
      <NumberInput
        label={'The amount of'}
        key={form.key('amount')}
        {...form.getInputProps('amount')}
      />
      <DatePickerInput
        label={'This will start on '}
        key={form.key('startsAt')}
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        leftSectionPointerEvents="none"
        minDate={new Date()}
        {...form.getInputProps('startsAt')}
      />
      <DatePickerInput
        label={'and will end on '}
        key={form.key('endsAt')}
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        leftSectionPointerEvents="none"
        {...minEndDate(form)}
        excludeDate={(date: Date) => endDatesDisabled(date, form.getValues())}
        {...form.getInputProps('endsAt')}
      />
      <Space h="20px" />
      <Button w="100%" type="submit">
        Add{' '}
      </Button>
    </form>
  );
};

export default PeriodicForm;
