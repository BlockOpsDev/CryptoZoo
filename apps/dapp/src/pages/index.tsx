import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>CryptoZoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="font-chakra text-center text-4xl">
        <strong>Welcome to the ZOO</strong>
      </h1>
    </>
  );
}
