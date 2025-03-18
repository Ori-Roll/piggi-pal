/** These are messages for validation errors */

const messages = {
  name: {
    required: 'Name your allowance',
    min: (min: string | number) =>
      `Name must be at least ${min} characters long`,
    max: (max: string | number) => `Name must be at most ${max} characters`,
  },
  amount: {
    required: 'Amount is required',
    min: (min: string | number) => `Must be at least ${min} !`,
    max: (max: string | number) => `Must be at most ${max} !`,
  },
  startsAt: {
    required: 'Start date is required',
    min: 'Start date must be in the future',
  },
  endsAt: {
    required: 'End date is required',
    min: 'End date must be after the start date',
    minInFuture: 'End date must be in the future',
  },
};

export default messages;
