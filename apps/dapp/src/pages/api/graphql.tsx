import Cors from 'micro-cors';
import { PageConfig } from 'next';
import { ApolloServer } from 'apollo-server-micro';

// @ts-ignore
import typeDefs from '@cryptozoo/graphql/schema.graphql';
import { resolvers } from '@cryptozoo/graphql';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: '/api/graphql' })(req, res);
});
