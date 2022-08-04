module.exports = ({ config, mode }) => {
  // GraphQL
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  });

  // Images
  config.module.rules.push({
    test:  /\.(png|jpe?g|gif)$/i,
    exclude: /node_modules/,
    loader: 'file-loader',
  });

  return config;
};
