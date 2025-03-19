import { useState } from 'react';
import { Flex, NumberInput, Text } from '@mantine/core';
import { ChildAccount } from '@prisma/client';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import AmountWithSign from '../AmountWithSign/AmountWithSign';
import { defaultColors } from '@/utils/colors';
import chroma from 'chroma-js';

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

  const afterTransactionColor = chroma(defaultColors.primaryColor)
    .desaturate(1)
    .hex();

  return (
    <Flex direction="column" gap="1rem">
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
      <Flex direction="column" align="center" gap="0.4rem">
        <Text c={afterTransactionColor}>{`Balance after transaction: `}</Text>
        <AmountWithSign
          textStyle={{
            fontSize: '2.5rem',
            lineHeight: '2.5rem',
            color: afterTransactionColor,
          }}
          amount={calculateNewAmount(amount, selectedChildAccount.current)}
        />
      </Flex>
    </Flex>
  );
};

export default TransactionModal;
