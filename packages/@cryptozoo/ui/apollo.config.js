module.exports = {
  client: {
    tagName: 'gql',
    includes: ['./src/components/**/*.tsx'],
    service: {
      name: 'CryptoZoo Graph',
      localSchemaFile: '../graphql/schema.graphql',
    },
  },
};
