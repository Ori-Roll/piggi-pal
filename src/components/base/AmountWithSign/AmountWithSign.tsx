import { Flex, Text } from '@mantine/core';
import style from './AmountWithSign.module.css';

type AmountWithSignProps = {
  amount: number;
  currencySign?: string;
};

const AmountWithSign = (props: AmountWithSignProps) => {
  const { amount, currencySign = '$' } = props;

  //TODO: The sign should be a prop, not hardcoded. Or maybe come from a context or config.

  return (
    <Flex align="center" gap={10}>
      <Text className={style.formattedAmountSign}>{currencySign}</Text>
      <Text className={style.formattedAmountNum}>{amount}</Text>
    </Flex>
  );
};

export default AmountWithSign;
