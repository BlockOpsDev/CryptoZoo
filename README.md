# CryptoZoo Monorepo

This is the official monorepo of [CryptoZoo](https://cryptozoo.co/) composed with [Turborepo](https://turborepo.org/).

## Apps

- `dapp`: a [Next.js](https://nextjs.org) app with [Tailwind CSS](https://tailwindcss.com/)
- `ethereum`: a [Hardhat](https://hardhat.org/) project

## Packages

- `@cryptozoo` contains CryptoZoo specific packages
  - `ui` is a stub React component library with [Tailwind CSS](https://tailwindcss.com/) connected to [Storybook](https://storybook.js.org/)
- `tailwind-config` contains `tailwind` configurations.
- `eslint-config-custom` contains `eslint` configurations (including `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig` contains `tsconfig.json` configurations used throughout the monorepo

All Apps and Packages are 100% [TypeScript](https://www.typescriptlang.org/).

# Getting Started

```bash
# Launch Hardhat node @ http://localhost:8545
# Launch Storybook component library @ http://localhost:6006
# Launch Next.js app @ http://localhost:3000 with hot reaload
yarn dev
```

```bash
# Lint all Apps and Packages
yarn lint
```

```bash
# Build all Apps and Packages
yarn build
```

```bash
# Purge build/dist files from all Apps and Packages
yarn clean
```

```bash
# Create New Components
yarn component
```

```bash
# To run workspace-specific scripts:
# Launch UI component library Storybook
yarn workspace @cryptozoo/ui storyboook
```

# Utilities

Various frameworks/libraries/utilities used throughout the monorepo.

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [Storybook](https://storybook.js.org/) for UI
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Hardhat](https://hardhat.org/) for solidity development
