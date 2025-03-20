import { useMutation } from '@tanstack/react-query';
import { useForm, zodResolver } from '@mantine/form';
import { NumberInput, TextInput, Space, Loader } from '@mantine/core';
import { z } from 'zod';
import { ChildAccount } from '@prisma/client';
import queryClient from '@/config/queryClient';
import childAccountsService from '@/APIService/childAccounts';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { defaultColors } from '@/utils/colors';

type AddNewChildAccountModalProps = {
  onSubmitCallback: () => Promise<void> | void;
};

//TODO: Clean this up and move validation to validations folder

const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  // allowance: z.object({
  //   title: z.string().min(2, { message: 'Title should have at least 2 letters' }),
  //   actionType: z.literal('ADD'),
  //   interval: z.union([z.literal('daily'), z.literal('weekly'), z.literal('monthly')]),
  //   startsAt: z.string(),
  // }),
  initialBalance: z
    .number()
    .min(0, { message: `Is you're child in debt?` })
    .max(1000, { message: `That's a lot of money!` }),
});

//TODO: This is not a modal, it's a form!

const AddNewChildAccountModal = (props: AddNewChildAccountModalProps) => {
  const { onSubmitCallback } = props;

  const childAccountForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      // periodic: {
      //   title: 'Allowance',
      //   actionType: 'ADD',
      //   interval: 'weekly',
      //   startsAt: nextSunday(new Date()),
      // },
      initialBalance: 0,
    },

    // functions will be used to validate values at corresponding key
    validate: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newAccountData: Partial<ChildAccount>) => {
      await childAccountsService.createChildAccount(newAccountData);
      await onSubmitCallback();
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const childAccountData: Partial<ChildAccount> = {
      kidName: values.name,
      current: values.initialBalance,
    };
    try {
      await mutateAsync(childAccountData);
      queryClient.invalidateQueries({
        queryKey: ['userChildAccounts'],
      });
    } catch (error) {
      console.error('Error adding child account', error);
      alert('Error adding child account');
    }
  };

  return (
    <form onSubmit={childAccountForm.onSubmit(onSubmit)}>
      <TextInput
        label="Name"
        placeholder="Enter your child's name"
        required
        withAsterisk
        disabled={isPending}
        key={childAccountForm.key('name')}
        {...childAccountForm.getInputProps('name')}
      />
      <NumberInput
        label="Initial Balance"
        placeholder="How much money does your child have?"
        required
        withAsterisk
        disabled={isPending}
        key={childAccountForm.key('initialBalance')}
        {...childAccountForm.getInputProps('initialBalance')}
      />
      <Space h="md" />
      <ActionButton
        disabled={isPending}
        type="submit"
        color={defaultColors.primaryColor}
        colorAccent={defaultColors.primaryColor}
        styles={{
          label: {
            justifyContent: 'center',
            width: '100%',
          },
        }}
      >
        {isPending ? <Loader /> : 'Add Child Account'}
      </ActionButton>
    </form>
  );
};

export default AddNewChildAccountModal;
