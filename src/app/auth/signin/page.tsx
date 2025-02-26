'use client';

// import { useEffect, useState } from 'react';

// import { getProviders } from 'next-auth/react';

// import Divider from '@/components/Divider';
import Login from '@/components/Login/Login';
// import { ClientSafeProvider } from 'next-auth/lib/client';

// const renderLoginButtons = (
//   providers: Record<string, ClientSafeProvider | null> | null
// ) =>
//   providers
//     ? Object.values(providers)
//         .filter((provider): provider is ClientSafeProvider => provider !== null)
//         .filter(({ id }) => id !== 'hasura-credentials')
//         .map((provider) => <LoginButton auth={provider} key={provider.id} />)
//     : null;

export default function SignIn() {
  //   const [providers, setProviders] = useState<Record<
  //     string,
  //     ClientSafeProvider | null
  //   > | null>(null);

  //   useEffect(() => {
  //     async function fetchProviders() {
  //       const response = await getProviders();
  //       setProviders(response);
  //     }
  //     fetchProviders();
  //   }, []);

  return <Login />;
}
