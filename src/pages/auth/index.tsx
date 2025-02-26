import { useSession } from 'next-auth/react';
import {
  LoginButton,
  LogoutButton,
} from '@/components/base/buttons/AuthButtons';
import { useRouter } from 'next/router';
import Login from '@/components/Login/Login';

const Home = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (sessionData) {
    router.push('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-8 lg:p-24">
      <h1>Welcome to piggi-pal!</h1>
      <h2>This is your kid&apos;s bank thing!</h2>
      {sessionData ? <LogoutButton /> : <LoginButton />}
      <Login />
      {/*<DiscordButton />
        <Auth0Button /> */}
    </main>
  );
};

export default Home;
