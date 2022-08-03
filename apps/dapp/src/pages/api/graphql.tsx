import Cors from 'micro-cors';
import { PageConfig } from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from '@graphql-tools/schema';
import Moralis from 'moralis/node';

// @ts-ignore
import typeDefs from '@cryptozoo/graphql/schema.graphql';
import { resolvers } from '@cryptozoo/graphql';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();

const server = new ApolloServer({
  schema,
  context: async () => {
    if (!Moralis.isInitialized)
      await Moralis.start({
        serverUrl: process.env.MORALIS_SERVER,
        appId: process.env.MORALIS_APP_ID,
        masterKey: process.env.MORALIS_MASTER_KEY,
      });

    return { Moralis };
  },
});

const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: '/api/graphql' })(req, res);
});
