import { Grid } from '@mantine/core';
// import { Carousel } from '@mantine/carousel';
import { Account, Periodic } from '@prisma/client';
import { useIsMobile } from '@/hooks/configHooks';
import PeriodicCard from '@/components/base/PeriodicCard/PeriodicCard';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import style from './PeriodicsSection.module.css';

type PeriodicsSectionProps = {
  account: Account;
};
//TODO: Move all these somewhere else
const actionTypeToMessageMap = {
  ADD: ' more',
  SUBTRACT: ' less',
  ADDRATE: '% more',
};

const intervalToMessageMap = {
  DAY: 'Every day',
  WEEK: 'Every week',
  BIWEEK: 'Every two weeks',
  MONTH: 'Every month',
  YEAR: 'Yearly',
};

const PeriodicsSection = (props: PeriodicsSectionProps) => {
  const {
    account: { periodics },
  } = props;

  const isMobile = useIsMobile();

  if (periodics.length === 0) {
    return (
      <NothingHere>
        You have no allowance or any other repeating action yet
      </NothingHere>
    );
  }

  return (
    <>
      {isMobile ? (
        // <Carousel align="start" loop>
        periodics.map((periodic: Periodic) => (
          // <Carousel.Slide className={style.cardWrapper} key={periodic.id}>
          <PeriodicCardItem key={periodic.id} periodic={periodic} />
          // </Carousel.Slide>
        ))
      ) : (
        // </Carousel>
        // <Flex p="0" m="0" align="flex-start" justify="flex-start" gap="lg">
        <Grid>
          {periodics.map((periodic: Periodic) => (
            <Grid.Col span={isMobile ? 12 : 4} key={periodic.id}>
              <PeriodicCardItem key={periodic.id} periodic={periodic} />
            </Grid.Col>
          ))}
        </Grid>

        // </Flex>
      )}
    </>
  );
};

type PeriodicCardItemProps = {
  periodic: Periodic;
};

const PeriodicCardItem = (props: PeriodicCardItemProps) => {
  const { periodic } = props;

  return (
    <PeriodicCard
      key={periodic.id}
      name={periodic.name}
      amount={periodic.amount}
      actionName={actionTypeToMessageMap[periodic.actionType]}
      currencySign={'$'}
      intervalName={intervalToMessageMap[periodic.interval]}
      nextOccurrence={periodic.nextOccurrence}
      imageUrl="https://source.unsplash.com/random"
    />
  );
};

export default PeriodicsSection;
