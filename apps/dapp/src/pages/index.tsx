import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>CryptoZoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='text-4xl font-chakra text-center'>
        <strong>Welcome to the ZOO</strong>
      </h1>
    </>
  );
}
