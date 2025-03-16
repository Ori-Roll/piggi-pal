import { FormEvent, useEffect, useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  Divider,
  Group,
  Stack,
  Flex,
  Center,
  FlexProps,
  Modal,
  Box,
} from '@mantine/core';

import YourSvg from '@/assets/pigibank_all.svg';
import { useIsMobile } from '@/hooks/configHooks';

import { GoogleButton } from '@/components/base/buttons/AuthButtons';
import Disclaimer from '@/components/base/Disclaimer/Disclaimer';
import { useRouter } from 'next/router';

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
        <Paper w="100%">
          <Title ta="center" order={2} pt={40} pb={20}>
            BananaBank
          </Title>
          <form onSubmit={handleSubmit}>
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

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <GoogleButton />;
            {/* <LoginButton auth={{ name: 'Google', id: 'google' }} /> */}
            {/* <Button variant="default">Facebook</Button> */}
          </Group>
        </Paper>
        <img style={{ height: '620px' }} src={YourSvg} />
      </Flex>
    </Center>
  );
}
