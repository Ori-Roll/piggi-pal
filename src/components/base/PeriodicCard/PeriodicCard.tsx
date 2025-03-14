import { PropsWithChildren } from 'react';
import { addDays, endOfDay, formatDistanceToNow } from 'date-fns';
import { Text, Flex } from '@mantine/core';
// import AnimatedShake from '@/components/base/Animated/AnimatedShake';
import AmountWithSign from '@/components/base/AmountWithSign/AmountWithSign';
import style from './PeriodicCard.module.css';
import { defaultColors, getTextColorForBackground } from '@/utils/colors';
import chroma from 'chroma-js';

type PeriodicCardProps = {
  name: string;
  actionName: string;
  currencySign?: string;
  intervalName: string;
  amount: number;
  nextOccurrence?: string | null | Date;
  imageUrl: string;
  componentIndex?: number;
  loading?: boolean;
};

//TODO: This is not a base component, Maybe rename to SomethingElseCard and change it, or move to data

const PeriodicCard = (props: PropsWithChildren<PeriodicCardProps>) => {
  const { name, amount, currencySign, intervalName, nextOccurrence, loading } =
    props;

  const parsedNextOccurrence = nextOccurrence ? new Date(nextOccurrence) : null;

  const readableNextOccurrence = () => {
    if (!parsedNextOccurrence) {
      return '(dot gonna happen)';
    }
    switch (true) {
      case loading:
        return '(loading...)';
      case parsedNextOccurrence < endOfDay(new Date()):
        return '(due today)';
      case endOfDay(addDays(parsedNextOccurrence, 1)) < new Date():
        return '(due tomorrow)';
      default:
        return `(due in ${formatDistanceToNow(parsedNextOccurrence, {
          addSuffix: false,
        })})`;
    }
  };

  const delay = props.componentIndex ? props.componentIndex * 200 : 0;

  const backgroundColor = chroma(defaultColors.primaryColor).desaturate().hex();
  const frontColor = getTextColorForBackground(backgroundColor);

  return (
    <Flex
      align={'center'}
      justify={'flex-start'}
      className={style.card}
      style={{
        opacity: loading ? 0.5 : 1,
        backgroundColor,
      }}
    >
      <div
        className={style.top_icon}
        style={{
          borderColor: backgroundColor,
        }}
      >
        $
      </div>
      {/* <AnimatedShake delay={delay}> */}
      <Flex direction={'column'}>
        <Text className={style.name} c={frontColor}>
          {name}
        </Text>
        <AmountWithSign
          amount={amount}
          currencySign={currencySign}
          fontSize={2.6}
          color={frontColor}
        />
        {/* </AnimatedShake> */}

        <Flex direction="row" align="center" gap="sm">
          <Text size="sm" className={style.nextTimeDescription} c={frontColor}>
            {`${intervalName} ${readableNextOccurrence()}`}
          </Text>
          {/* <Text size="xs" className={style.nextTimeDescription} c={frontColor}>
            {readableNextOccurrence()}
          </Text> */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PeriodicCard;
