import { CardStyle, Periodic } from '@prisma/client';
import { defaultColors } from '@/utils/colors';

export const createPeriodicDataWithNextOccurrence = (
  data: Omit<Periodic, 'id'>
) => {
  const { startsAt, nextOccurrence } = data;

  const newNextOccurrence = nextOccurrence ? nextOccurrence : startsAt;

  return { ...data, nextOccurrence: newNextOccurrence };
};

export const createDefaultCardStyle = (): Omit<CardStyle, 'id' | 'icon'> => {
  return defaultColors;
};
