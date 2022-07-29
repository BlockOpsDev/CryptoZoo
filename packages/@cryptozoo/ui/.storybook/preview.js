import '../dist/styles.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#18181B',
      },
      {
        name: 'light',
        value: '#e2e8f0',
      },
    ],
  },
};

export const globalTypes = {
  darkMode: true,
};
