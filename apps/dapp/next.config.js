module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "cdn.discordapp.com",
      "via.placeholder.com",
      "assets.coingecko.com",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};
