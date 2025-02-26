import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
// import router from 'next/router';
import {
  GoogleButton,
  LoginButton,
  LogoutButton,
} from '@/components/base/buttons/AuthButtons';
import { useRouter } from 'next/router';

const Home = () => {
  const session = useSession();
  const router = useRouter();
  if (session.data) {
    router.push('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-8 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-end font-mono text-sm lg:flex">
        <div className="flex h-48 w-full items-center justify-between bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:bg-none">
          <div className="px-2"></div>
          {session ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 lg:mb-0">
        NextJs 15 App Router and Auth.js (Next Auth)
      </h1>

      <div className="relative mb-8 flex place-items-center lg:my-0">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/images/icons/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-6">
        <GoogleButton />
        {/*<DiscordButton />
        <Auth0Button /> */}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-3 mt-8 text-center lg:mt-0">
          Changelog
        </h2>
        <ol className="font-mono">
          <li>18-01-2025 - Upgrade to NextJs 15</li>
          <li>29-08-2024 - Add Auth0 Provider</li>
          <li>08-06-2024 - Add login credential on Custom Login</li>
          <li>04-05-2024 - Add database adapter on Custom Login</li>
          <li>06-03-2024 - Update the Landing Page and Custom Login Page</li>
          <li>06-03-2024 - Upgrade NPM Package to Latest Version</li>
        </ol>
      </div>
    </main>
  );
};

export default Home;
