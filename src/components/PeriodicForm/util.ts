import { Periodic } from '@prisma/client';
import { UseFormReturnType } from '@mantine/form';
import {
  addDays,
  differenceInDays,
  getDate,
  getMonth,
  isValid,
} from 'date-fns';

import { Interval, ActionType } from '@prisma/client';

type FormType = UseFormReturnType<
  Partial<Periodic>,
  (values: Partial<Periodic>) => Partial<Periodic>
>;

export const intervalOptions = [
  { value: Interval.DAY, label: 'day' },
  { value: Interval.WEEK, label: 'week' },
  { value: Interval.BIWEEK, label: '2 weeks' },
  { value: Interval.MONTH, label: 'month' },
  { value: Interval.YEAR, label: 'year' },
] as const;

export type IntervalValues = (typeof intervalOptions)[number]['value'];

type IntervalToDisabledEndDates = Record<
  IntervalValues,
  (date: Date, startsAt: Date) => boolean
>;

export const intervalToDisabledEndDates: IntervalToDisabledEndDates = {
  [Interval.DAY]: () => false,
  [Interval.WEEK]: (date: Date, startsAt: Date) => {
    return date.getDay() !== startsAt.getDay();
  },
  [Interval.BIWEEK]: (date: Date, startsAt: Date) => {
    const daysDifference = differenceInDays(date, startsAt);
    return !(daysDifference === 14 || daysDifference % 14 === 0);
  },
  [Interval.MONTH]: (date: Date, startsAt: Date) => {
    return date.getDate() !== startsAt.getDate();
  },
  [Interval.YEAR]: (date: Date, startsAt: Date) => {
    return (
      getMonth(date) === getMonth(startsAt) &&
      getDate(date) === getDate(startsAt)
    );
  },
};

export const actionTypeOptions = [
  { value: ActionType.ADD, label: 'Added' },
  { value: ActionType.SUBTRACT, label: 'Subtracted ):' },
  { value: ActionType.ADDRATE, label: 'Be added a rate of' },
] as const;

export const minEndDate = (form: FormType) =>
  !!form?.getValues()?.startsAt &&
  isValid(new Date(form.getValues().startsAt as unknown as string))
    ? { minDate: addDays(form.getValues().startsAt as unknown as string, 1) }
    : {};

export const endDatesDisabled = (date: Date, formValues: Partial<Periodic>) => {
  if (!!formValues?.startsAt) {
    const typeOfInterval = formValues.interval as IntervalValues;
    const startsAt = new Date(formValues.startsAt as unknown as string);
    if (!!typeOfInterval && !!intervalToDisabledEndDates[typeOfInterval]) {
      return intervalToDisabledEndDates[typeOfInterval](date, startsAt);
    }
  }
  return false;
};
