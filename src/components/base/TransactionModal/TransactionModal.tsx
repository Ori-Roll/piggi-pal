import { useState } from 'react';
import { Flex, NumberInput, Text } from '@mantine/core';
import { ChildAccount } from '@prisma/client';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type TransactionModalProps = {
  submitTitle: string;
  updateFn: (amount: number) => Promise<void>;
  selectedChildAccount: ChildAccount;
  onSubmitCallback?: (amount: number) => void;
};

const calculateNewAmount = (amount: number, currentAmount: number) => {
  return currentAmount + amount;
};

const TransactionModal = (props: TransactionModalProps) => {
  const { submitTitle, updateFn, selectedChildAccount, onSubmitCallback } =
    props;

  //TODO: Maybe change this to form and don't use state
  const [amount, setAmount] = useState(0);

  const onSubmit = async (amount: number) => {
    onSubmitCallback?.(amount);
    await updateFn(amount);
  };

  const onValueChange = (value: string | number) => {
    setAmount(Number(value));
  };

  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="column" gap="1rem">
        <Text>Current amount: {selectedChildAccount.current}</Text>
        <Text>{`New amount: ${calculateNewAmount(
          amount,
          selectedChildAccount.current
        )}`}</Text>
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
        onClick={() => onSubmit(amount)}
      >
        {submitTitle}
      </ActionButton>
    </Flex>
  );
};

export default TransactionModal;
