import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Home.module.css';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader } from '@mantine/core';
import { userService } from '@/APIService/users';
import childAccountsService from '@/APIService/childAccounts';
import BasicDataLoader from '@/components/BasicDataLoader';
import DashboardLayout from '@/components/Dashboard/Dashboard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const mockCall_users = async () => {
  const response = await userService.getCurrentUser();
  console.log('Got response ', response);
};

const mockCall_childAccounts = async () => {
  const res = await childAccountsService.getUserChildAccounts();
  console.log('Got response ', res.data);
};

let mockChildAccountId: string = 'cm7p3iy3f0001tb4ktvowvjel';

const mockCall_one_childAccount = async () => {
  const res = await childAccountsService.getChildAccount(mockChildAccountId);
  console.log('Got response ', res.data);
};

const mockCall_create_childAccount = async () => {
  const res = await childAccountsService.createChildAccount({
    kidName: 'stringi',
    current: 0,
  });
  console.log('Got response ', res.data);
  mockAccountId = res.data.id;
};

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.data && session.status !== 'loading') {
      router.replace('/auth');
    }
  }, [session.data, session.status, router]);

  if (session.status === 'loading' || !session.data) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>piggi-pal</title>
        <meta name="description" content="Piggi-pal app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <BasicDataLoader>
            <DashboardLayout />
          </BasicDataLoader>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
