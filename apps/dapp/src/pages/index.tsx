import Head from 'next/head';
import { Layout } from '@cryptozoo/ui';

export default function Home() {
  return (
    <>
      <Head>
        <title>CryptoZoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className="w-screen h-screen bg-layer--1 overflow-scroll">
        <div className="flex gap-4 p-4">
          <div className="flex-none bg-layer--2 w-screen">A</div>
          <div className="flex-none bg-layer--2 w-screen">B</div>
        </div>
      </div> */}

      <Layout
        navItems={[
          { title: 'Home', to: '#', locked: false, iconKey: 'home' },
          { title: 'ZooSwap', to: '#', locked: false, iconKey: 'swap' },
          { title: 'Marketplace', to: '#', locked: true, iconKey: 'store' },
          {
            title: 'Breeding/Hatching',
            to: '#',
            locked: true,
            iconKey: 'heart',
          },
          { title: 'Rewards', to: '#', locked: true, iconKey: 'trophy' },
          { title: 'Games', to: '#', locked: true, iconKey: 'game' },
          { title: 'Links/Resources', to: '#', locked: false, iconKey: 'link' },
          { title: 'Discord', to: '#', locked: false, iconKey: 'discord' },
        ]}
      />

      {/* <Test id="1" /> */}
      {/* <Card userId="1" /> */}
    </>
  );
}
