import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { DecoratorFn } from '@storybook/react';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SchemaLink } from '@apollo/client/link/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { mocks } from './mock-data';

// @ts-ignore
import typeDefs from '@cryptozoo/graphql/schema.graphql';

const schema = makeExecutableSchema({ typeDefs });
const mockSchema = addMocksToSchema({
  schema,
  mocks,
});

const client = new ApolloClient({
  // @ts-ignore
  link: new SchemaLink({ schema: mockSchema }),
  cache: new InMemoryCache(),
});

export const apolloContext: DecoratorFn = (Story) => {
  return (
    <ApolloProvider client={client}>
      <Story />
    </ApolloProvider>
  );
};
