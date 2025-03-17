import { useState } from 'react';
import { Flex, NumberInput, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChildAccount } from '@prisma/client';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import { useUpdateOnMutationCallback } from '@/hooks/utilHooks';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type TransactionModalProps = {
  submitTitle: string;
  mutationFn: (amount: number) => Promise<void>;
  selectedChildAccount: ChildAccount;
  onSubmitCallback?: (amount: number) => void;
};

const TransactionModal = (props: TransactionModalProps) => {
  const { submitTitle, mutationFn, selectedChildAccount, onSubmitCallback } =
    props;

  //TODO: Maybe change this to form and don't use state
  const [amount, setAmount] = useState(0);

  const calculateNewAmount = (amount: number, currentAmount: number) => {
    return currentAmount + amount;
  };

  const queryClient = useQueryClient();

  const updateChildAccountOnTaskMutation = useUpdateOnMutationCallback(
    ['currentChildAccount', selectedChildAccount.id],
    (newChildAccount: Partial<ChildAccount>) =>
      (old: ChildAccountWithAllData) => {
        return old;
      }
  );

  const { mutateAsync } = useMutation({
    mutationFn: async (amount: number) => {
      onSubmitCallback?.(amount);
      mutationFn(amount);
    },
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

  const onValueChange = (value: string | number) => {
    setAmount(Number(value));
  };

  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="column" gap="1rem">
        <Text>Current amount: {selectedChildAccount.current}</Text>
        <Text>{`New amount: ${selectedChildAccount.current + amount}`}</Text>
      </Flex>
      <NumberInput
        defaultValue={0}
        min={0}
        max={500}
        step={5}
        label="Amount"
        placeholder="Enter amount"
        required
        style={{ width: '100%' }}
        value={amount}
        onChange={onValueChange}
      />
      <ActionButton
        disabled={!amount || amount < 1}
        onClick={() => mutateAsync(amount)}
      >
        {submitTitle}
      </ActionButton>
    </Flex>
  );
};

export default TransactionModal;
