// @ts-nocheck

// include styles from the ui package
import '@cryptozoo/ui/styles.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import type { AppProps } from 'next/app';

import { Layout } from '@cryptozoo/ui';

export const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout
        navLinkProps={[
          { title: 'Home', to: '/', locked: false, iconKey: 'home' },
          { title: 'ZooSwap', to: '/swap', locked: false, iconKey: 'swap' },
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
      >
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
