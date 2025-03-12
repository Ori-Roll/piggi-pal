import { useForm } from '@mantine/form';
import { Button, NumberInput, Select, Space, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChildAccount, Periodic } from '@prisma/client';
import periodicsService from '@/APIService/periodics';
import {
  actionTypeOptions,
  endDatesDisabled,
  intervalOptions,
  minEndDate,
} from './util';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import { TEMPORARY } from '@/common/consts';
import { useUpdateOnMutationCallback } from '@/hooks/utilHooks';

type periodicFormProps = {
  periodic?: Partial<Periodic>;
  selectedChildAccount: ChildAccountWithAllData;
  onSubmitCallback: (data: Partial<Periodic>) => void;
};

const PeriodicForm = (props: periodicFormProps) => {
  const { periodic, onSubmitCallback, selectedChildAccount } = props;

  const queryClient = useQueryClient();

  const updateChildAccountOnTaskMutation = useUpdateOnMutationCallback(
    ['currentChildAccount', selectedChildAccount.id],
    (newPeriodic: Partial<Periodic>) => (old: ChildAccountWithAllData) => {
      return {
        ...old,
        periodics: [
          ...(old.periodics || []),
          { id: TEMPORARY, ...newPeriodic },
        ],
      };
    }
  );

  const { mutateAsync } = useMutation({
    mutationFn: (periodicData: Partial<Periodic>) =>
      periodicsService.createPeriodic(periodicData),
    onMutate: updateChildAccountOnTaskMutation,
    onError: (err, newPeriodicData, context) => {
      queryClient.setQueryData(
        ['currentChildAccount', selectedChildAccount.id],
        context?.previousQueriesData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const handleAddPeriodic = async (periodic: Partial<Periodic>) => {
    onSubmitCallback(periodic);
    await mutateAsync(periodic);
  };

  const initialValues = {
    ...(periodic ? periodic : {}),
    childAccountId: selectedChildAccount.id,
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
        label="The child's account will be"
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
        Add
      </Button>
    </form>
  );
};

export default PeriodicForm;
