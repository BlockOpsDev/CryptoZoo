import '../dist/styles.css';

import * as NextImage from "next/image";


// Next Image Fixing
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});


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
        value: '#080b14',
      },
      {
        name: 'light',
        value: '#f1f5f9',
      },
    ],
  },
};

export const globalTypes = {
  darkMode: true,
};
