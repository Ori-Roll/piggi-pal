import { signIn, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { IconBrandGoogle } from '@tabler/icons-react';
import { Flex, Text } from '@mantine/core';

export const LoginButton = () => {
  return (
    <button
      onClick={() => {
        redirect('/login');
      }}
    >
      Login
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: '/' });
      }}
    >
      Logout
    </button>
  );
};

export const GoogleButton = () => {
  return (
    <ActionButton
      onClick={() => {
        signIn('google');
      }}
    >
      <Flex w="100%" gap="0.5rem">
        <IconBrandGoogle />
        <Text>Sign in with Google</Text>
      </Flex>
    </ActionButton>
  );
};
