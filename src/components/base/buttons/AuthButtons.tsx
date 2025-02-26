import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
        signIn('signout', { callbackUrl: '/' });
      }}
    >
      Logout
    </button>
  );
};

export const GoogleButton = () => {
  return (
    <button
      onClick={() => {
        signIn('google');
      }}
    >
      Sign in with Google
    </button>
  );
};
