import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Home.module.css';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader } from '@mantine/core';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const mockCallAPI = async () => {
  console.log('API GIT Call');
  const response = await fetch('/api/hello');
  const data = await response.json();
  console.log('API GIT Data', data);
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
          <h1>IT IS ON!</h1>
          <button onClick={mockCallAPI}>CALL API</button>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
