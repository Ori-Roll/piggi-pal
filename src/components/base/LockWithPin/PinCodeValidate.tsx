import {
  Space,
  Text,
  Flex,
  PinInput,
  Loader,
  useMantineTheme,
} from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import parentLock from '../../../APIService/parentLock';
import style from './PinCode.module.css';
import { defaultColors } from '@/utils/colors';

type PinCodeValidateProps = {
  onValidated: () => void;
};

const PinCodeValidate = (props: PinCodeValidateProps) => {
  const { onValidated } = props;

  const focusTrapRef = useFocusTrap();

  const { mutateAsync, isPending, isError } = useMutation({
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
      <Flex direction="row" justify="center" align="center" gap={30}>
        <PinInput
          ref={focusTrapRef}
          size="md"
          inputMode="numeric"
          onComplete={handlePinComplete}
          error={isError}
          disabled={isPending}
          radius="50%"
          styles={{
            input: {
              borderColor: defaultColors.primaryColor,
              borderWidth: '0.2rem',
            },
          }}
        />
      </Flex>
      {isPending && <Loader />}
      {isError && <Text c={theme.colors.red[4]}>Invalid pin code!</Text>}

      {/* Change this to use secret question and optionally email */}
      <Space h={30} />
      <Text size="md">If you forgot your pin code, you're f**ed!.</Text>
    </Flex>
  );
};

export default PinCodeValidate;
