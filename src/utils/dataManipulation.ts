import { CardStyle, Periodic } from '@prisma/client';

export const createPeriodicDataWithNextOccurrence = (
  data: Omit<Periodic, 'id'>
) => {
  const { startsAt, nextOccurrence } = data;

  const newNextOccurrence = nextOccurrence ? nextOccurrence : startsAt;

  return { ...data, nextOccurrence: newNextOccurrence };
};

export const createDefaultCardStyle = (): Omit<CardStyle, 'id' | 'icon'> => {
  return {
    primaryColor: '#289ffa',
    secondaryColor: '#3b6fff',
    accentColor: '#ffb43b',
  };
};
