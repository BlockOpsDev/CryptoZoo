# CryptoZoo Monorepo

This is an official repo of [CryptoZoo](https://cryptozoo.co/)

### Apps and Packages

- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) connected to [Storybook](https://storybook.js.org/)
- `dapp`: a [Next.js](https://nextjs.org) app with [Tailwind CSS](https://tailwindcss.com/)
- `ethereum`: a [Hardhat](https://hardhat.org/) project

- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Getting Started

Lint all Apps and Packages run

```shell
yarn lint
```

Build component library and launch Next.js at http://localhost:3000 with hot reaload

```shell
yarn dev
```

Launch UI component library Storybook

```shell
yarn storyboard
```

Create New Components

```shell
yarn component <name>
```

### Utilities

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [Storybook](https://storybook.js.org/) for UI
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Hardhat](https://hardhat.org/) for solidity development
