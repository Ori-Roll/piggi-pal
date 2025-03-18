import { Flex, PinInput } from '@mantine/core';
import { useEventListener, useFocusTrap, useMergedRef } from '@mantine/hooks';
import { defaultColors } from '@/utils/colors';
import { useEffect, useRef, useState } from 'react';

type PinCodeInputProps = {
  onPinComplete: (pin: string) => void;
  isPending: boolean;
  error?: boolean;
};

function PinCodeInput(props: PinCodeInputProps) {
  const { onPinComplete, isPending, error } = props;

  const [pin, setPin] = useState('');
  const focusTrapRef = useFocusTrap();

  const handleOnComplete = (pin: string) => {
    onPinComplete(pin);
  };
  console.log('error', error);
  console.log('isPending', isPending);

  useEffect(() => {
    if (error) {
      setPin('');
    }
  }, [error]);

  return (
    <Flex direction="row" justify="center" align="center" gap={30}>
      <PinInput
        ref={focusTrapRef}
        value={pin}
        onChange={setPin}
        size="md"
        inputMode="numeric"
        onComplete={handleOnComplete}
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
  );
}

export default PinCodeInput;
