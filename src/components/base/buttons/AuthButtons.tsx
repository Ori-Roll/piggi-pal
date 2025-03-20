import { signIn, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import {
  ButtonProps,
  Flex,
  PolymorphicComponentProps,
  Text,
} from '@mantine/core';
import { useIsMobile } from '@/hooks/configHooks';

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

const providersMap = Object.freeze({
  google: {
    icon: () => <IconBrandGoogle />,
    title: 'Google',
    providerName: 'google',
  },
  facebook: {
    icon: () => <IconBrandFacebook />,
    title: 'Facebook',
    providerName: 'facebook',
  },
});

type OAuthButtonProps<C extends 'button'> = PolymorphicComponentProps<
  C,
  ButtonProps
> & {
  provider: keyof typeof providersMap;
};

const OAuthButton = <C extends 'button'>(props: OAuthButtonProps<C>) => {
  const { provider, ...restProps } = props;

  const isMobile = useIsMobile();

  if (!provider || !providersMap.hasOwnProperty(provider)) {
    throw new Error('Provider is required for OAuthButton');
  }

  const providerData = providersMap[provider];

  return (
    <ActionButton
      onClick={() => {
        signIn(providerData.providerName);
      }}
      {...restProps}
    >
      <Flex w="100%" gap="0.5rem" align="center" justify="center">
        {providerData.icon()}
        <Text>
          {isMobile ? providerData.title : `Sign in with ${providerData.title}`}
        </Text>
      </Flex>
    </ActionButton>
  );
};

export const FacebookButton = <C extends 'button'>(
  props: Omit<OAuthButtonProps<C>, 'provider'>
) => {
  return <OAuthButton provider="facebook" {...props} />;
};

export const GoogleButton = <C extends 'button'>(
  props: Omit<OAuthButtonProps<C>, 'provider'>
) => {
  return <OAuthButton provider="google" {...props} />;
};
