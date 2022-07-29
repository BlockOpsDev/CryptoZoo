import Cors from 'micro-cors';
import { PageConfig } from 'next';
import { ApolloServer } from 'apollo-server-micro';

import typeDefs from '../../apollo/schema.graphql';
import resolvers from '../../apollo/resolvers';

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
