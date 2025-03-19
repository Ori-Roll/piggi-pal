import { Periodic } from '@prisma/client';
import PeriodicCard from '@/components/base/PeriodicCard/PeriodicCard';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import { ChildAccountWithPeriodics } from '@/types/dataTypes';
import CardsGrid from '@/components/base/CardsGrid/CardsGrid';
import { TEMPORARY } from '@/common/consts';
import { useEditMode } from '@/store/useEditMode';
// import style from './PeriodicsSection.module.css';

type PeriodicsSectionProps = {
  childAccount: ChildAccountWithPeriodics;
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
    childAccount: { periodics },
  } = props;

  const editMode = useEditMode((state) => state.edit);

  if (periodics.length === 0) {
    return (
      <NothingHere>
        {editMode
          ? `Your child does not have an allowance or any other repeating actions yet`
          : `You have no allowance or any other repeating action yet`}
      </NothingHere>
    );
  }

  return (
    <CardsGrid
      emptyMessage={
        periodics.length === 0
          ? 'You have no allowance or any other repeating action yet'
          : undefined
      }
    >
      {periodics.map((periodic: Periodic) => (
        <PeriodicCardItem key={periodic.id} periodic={periodic} />
      ))}
    </CardsGrid>
  );
};

type PeriodicCardItemProps = {
  periodic: Periodic;
};

const PeriodicCardItem = (props: PeriodicCardItemProps) => {
  const { periodic } = props;

  if (!periodic || !periodic.amount) {
    return null;
  }

  return (
    <PeriodicCard
      key={periodic.id}
      name={periodic.name}
      amount={periodic.amount}
      actionName={actionTypeToMessageMap[periodic.actionType]}
      currencySign={'$'}
      intervalName={intervalToMessageMap[periodic.interval]}
      nextOccurrence={periodic.nextOccurrence ? periodic.nextOccurrence : null}
      loading={periodic.id === TEMPORARY}
      imageUrl="https://source.unsplash.com/random"
    />
  );
};

export default PeriodicsSection;
