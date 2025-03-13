import { Flex, Space, Text } from '@mantine/core';
import style from './Current.module.css';
import PigiSvg from '@/assets/pigibank_JustPig.svg';

type CurrentProps<E extends boolean> = {
  current: number;
  sign: string;
  handleChange: E extends true
    ? (e: React.ChangeEvent<HTMLInputElement>) => void
    : undefined;
  edit?: E;
};

const Current = <E extends boolean>(props: CurrentProps<E>) => {
  const { current, sign, handleChange } = props;

  return (
    <Flex align={'end'}>
      {/* <img style={{ height: '100px' }} src={PigiSvg} /> */}
      <Text className={style.currency}>{sign}</Text>
      <Space w={5} />
      <Text onChange={handleChange} className={style.current}>
        {current}
      </Text>
    </Flex>
  );
};

export default Current;
