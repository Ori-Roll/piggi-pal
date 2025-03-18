/** These are messages for validation errors */

const messages = {
  name: {
    required: 'Name is required',
    string: 'Name must be a string',
    min: (min: string | number) =>
      `Name must be at least ${min} characters long`,
    max: (max: string | number) => `Name must be at most ${max} characters`,
  },
  description: {
    required: 'Description is required',
    string: 'Description must be a string',
    min: (min: string | number) =>
      `Description must be at least ${min} characters long`,
    max: (max: string | number) =>
      `Description must be at most ${max} characters`,
  },
  times: {
    min: 'Times must be at least 1',
  },
  amount: {
    required: 'Amount is required',
    min: (min: string | number) => `Must be at least ${min} !`,
    max: (max: string | number) => `Must be at most ${max} !`,
  },
};

export default messages;
