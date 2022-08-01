import Head from 'next/head';
import { Test } from '@cryptozoo/ui';
// import { Card } from '@cryptozoo/ui';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>CryptoZoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Test id="1" />
      {/* <Card.Card userId="1" /> */}
    </div>
  );
}
