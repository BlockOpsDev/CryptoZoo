// @ts-nocheck

// import '../styles/globals.css';
// include styles from the ui package
import '@cryptozoo/ui/styles.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import type { AppProps } from 'next/app';

export const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />;
    </ApolloProvider>
  );
}
