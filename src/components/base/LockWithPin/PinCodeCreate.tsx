import {
  Space,
  Text,
  Flex,
  Center,
  PinInput,
  Loader,
  useMantineTheme,
} from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import parentLock from '../../../APIService/parentLock';

type PinCodeCreateProps = {
  onCreated: () => void;
};

const PinCodeCreate = (props: PinCodeCreateProps) => {
  const { onCreated } = props;

  const theme = useMantineTheme();

  const focusTrapRef = useFocusTrap();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (pin: string) => {
      const data = await parentLock.createParentLock({ pin: Number(pin) });
      console.log(data);
      onCreated();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePinComplete = async (pin: string) => {
    await mutateAsync(pin);
  };

  return (
    <Flex direction="column" align="center">
      <Text fw={600} size="md">
        Set a new pin code to lock the app.
      </Text>
      <Text size="md">
        After locking your child can use the app as his own without being able
        to change the child&apos;s account.
      </Text>
      <Space h={30} />
      <Center>
        <Flex direction="row" justify="center" align="center" gap={30}>
          <PinInput
            ref={focusTrapRef}
            size="md"
            inputMode="numeric"
            onComplete={handlePinComplete}
            disabled={isPending}
          />
        </Flex>
      </Center>
      <Space h={30} />
      {isPending && <Loader />}
      {isError && <Text c={theme.colors.red[4]}>Invalid pin code!</Text>}
      <Text fw={600} size="md">
        {`Make sure to remember your pin code!`}
      </Text>
    </Flex>
  );
};

export default PinCodeCreate;
