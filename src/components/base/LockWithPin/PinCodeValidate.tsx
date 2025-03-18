import { Space, Text, Flex, Loader, useMantineTheme } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import parentLock from '../../../APIService/parentLock';
import PinCodeInput from './PinCodeInput';
import style from './PinCode.module.css';

type PinCodeValidateProps = {
  onValidated: () => void;
};

const PinCodeValidate = (props: PinCodeValidateProps) => {
  const { onValidated } = props;

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (pin: string) => {
      const data = await parentLock.validate(pin);
      // TODO: Fix this hack
      //@ts-expect-error - this is a hack - change this!
      if (data.error) {
        return;
      }
      onValidated();
    },
    onError: (error) => {
      console.log('THIS IS error');
      console.error(error);
    },
  });

  const handlePinComplete = async (pin: string) => {
    await mutateAsync(pin);
  };

  const theme = useMantineTheme();

  return (
    <Flex direction="column" align="center">
      <Text size="md">
        Make sure you re-lock after you finish editing your child&apos;s
        account.
      </Text>
      <Space h={30} />
      <PinCodeInput
        onPinComplete={handlePinComplete}
        isPending={isPending}
        error={isError}
      />
      <Space h={30} />
      {isPending && <Loader />}
      {isError && <Text c={theme.colors.red[4]}>Invalid pin code!</Text>}

      {/* Change this to use secret question and optionally email */}
      <Space h={30} />
      <Text size="md">If you forgot your pin code, you're f**ed!.</Text>
    </Flex>
  );
};

export default PinCodeValidate;
