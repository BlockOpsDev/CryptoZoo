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

Run all Apps/Packages locally

- Hardhat node @ http://localhost:8545
- Storybook component library @ http://localhost:6006
- Next.js app @ http://localhost:3000 with hot reaload

```shell
yarn dev
```

Lint all Apps and Packages

```shell
yarn lint
```

Build all Apps and Packages

```shell
yarn build
```

Purge build files from all Apps and Packages

```shell
yarn clean
```

Create New Components

```shell
yarn component <name>
```

Workspace Scripts

```shell
yarn workspace @cryptozoo/ui storybook
```

# Utilities

Various frameworks/libraries/utilities used throughout the monorepo.

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [Storybook](https://storybook.js.org/) for UI
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Hardhat](https://hardhat.org/) for solidity development
