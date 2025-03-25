import Head from 'next/head';

type MetaProviderProps = {
  children: React.ReactNode;
};

const MetaProvider = (props: MetaProviderProps) => {
  const { children } = props;

  return (
    <>
      <Head key="head-title">
        <title>Piggi Piggi</title>
        <meta property="og:title" content="Piggi Piggi" key="title" />
      </Head>
      {children}
    </>
  );
};

export default MetaProvider;
