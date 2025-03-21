import { FormEvent, useEffect, useState } from 'react';
import {
  Paper,
  Title,
  Button,
  Flex,
  Center,
  FlexProps,
  Modal,
  Box,
} from '@mantine/core';

import { useIsMobile } from '@/hooks/configHooks';

import {
  GoogleButton,
  FacebookButton,
} from '@/components/base/buttons/AuthButtons';
import Disclaimer from '@/components/base/Disclaimer/Disclaimer';
import { useRouter } from 'next/router';
import YourSvg from '@/assets/pigibank_all.svg';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [disclaimerModalActive, setDisclaimerModalActive] =
    useState<boolean>(false);

  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add login logic here
  };

  const layoutStyle = {
    direction: isMobile ? 'column' : 'row',
    align: 'center',
    w: isMobile ? '100%' : '1000px',
    p: isMobile ? '30px' : '40px',
  } satisfies FlexProps;

  const onDisclaimerRead = () => {
    localStorage?.setItem('disclaimer_read', 'true');
    setDisclaimerModalActive(false);
  };

  useEffect(() => {
    if (localStorage) {
      const read = localStorage?.getItem('disclaimer_read');
      if (!read) setDisclaimerModalActive(true);
    }
  }, []);

  return (
    <Center w="100%">
      <Modal
        opened={disclaimerModalActive}
        onClose={onDisclaimerRead}
        withCloseButton={false}
        size="lg"
        padding={0}
      >
        <Box p="0.5rem" h="80vh" style={{ overflow: 'auto' }}>
          <Disclaimer />
          <br />
          <Flex justify="center" gap="1rem">
            <Button onClick={onDisclaimerRead}>Agree</Button>
            <Button onClick={() => router.push('https://www.google.com')}>
              Disagree
            </Button>
          </Flex>
        </Box>
      </Modal>
      <Flex {...layoutStyle}>
        <Flex
          h={isMobile ? '90vh' : '100vh'}
          w="100%"
          direction="column"
          align="center"
          justify="center"
        >
          <Image height={200} src={YourSvg} alt="piggi-pal" />
          <Title ta="center" order={2} pt={40} pb={20}>
            Piggi pal
          </Title>
          {/* <form onSubmit={handleSubmit}>
            <Stack mt="xl">
              <TextInput
                label="Email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button variant="outline" type="submit" fullWidth mt="xl">
                Sign in
              </Button>
            </Stack>
          </form> 
          <p>Sign in with password temporarily unavailable</p>

          <Divider label="Or continue with" labelPosition="center" my="lg" />*/}

          <Flex
            mb="md"
            mt="md"
            gap="1rem"
            direction={isMobile ? 'column' : 'row'}
            align={isMobile ? 'center' : 'start'}
          >
            <GoogleButton />
            <FacebookButton disabled />
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
}
