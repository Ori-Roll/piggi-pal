import { Flex, Space, Text } from '@mantine/core';
import style from './AmountWithSign.module.css';

type AmountWithSignProps = {
  amount: number;
  currencySign?: string;
  fontSize?: number;
  color?: string;
  textStyle?: React.CSSProperties;
};

const AmountWithSign = (props: AmountWithSignProps) => {
  const { amount, currencySign = '$', fontSize = 4, color, textStyle } = props;

  //TODO: The sign should be a prop, not hardcoded. Or maybe come from a context or config.

  const fontSizeWithMultiplier = `${fontSize}rem`;

  const defaultFontSizes = {
    fontSize: fontSizeWithMultiplier,
  };

  return (
    <Flex align="center" gap={10}>
      <Flex align={'end'}>
        {/* <img style={{ height: '100px' }} src={PigiSvg} /> */}
        <Text
          className={style.currency}
          c={color}
          style={{ ...defaultFontSizes, ...textStyle }}
        >
          {currencySign}
        </Text>
        <Space w={5} />
        <Text
          c={color}
          className={style.amount}
          style={{ ...defaultFontSizes, ...textStyle }}
        >
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AmountWithSign;
