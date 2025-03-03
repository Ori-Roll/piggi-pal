import style from './NothingHere.module.css';
import { Flex, Text } from '@mantine/core';
import { PropsWithChildren } from 'react';

type NothingHereProps = PropsWithChildren<{}>;

// TODO: Rename something like "NoContentFrame" or "NoContentWrapper"

const NothingHere = (props: NothingHereProps) => {
  const { children } = props;

  return (
    <Flex
      align={'center'}
      justify={'center'}
      className={style.no_periodics_wrapper}
    >
      <Text size="lg">{children} </Text>
    </Flex>
  );
};

export default NothingHere;
