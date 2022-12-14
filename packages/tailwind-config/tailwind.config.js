module.exports = {
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      tablet: '960px',
      desktop: '1248px',
    },
    colors: {
      'layer--1': '#080b14',
      'layer--2': '#0d1220',
      'layer--3': '#141b2b',
      'layer--4': '#1c2436',
      'layer--5': '#242e41',

      'primary-text': '#ffffff',
      'secondary-text': '#94a3b8',

      'secondary': '#2e394d',

      'primary--light': '#55a6ed',
      'primary': '#0062d4',
      'primary--dark': '#002a7a',

      'success--light': '#2ec03e',
      'success': '#00741a',
      'success--dark': '#002f0f',

      'error--light': '#e4877c',
      'error': '#bb352b',
      'error--dark': '#680300',

      'warn--light': '#c09d43',
      'warn': '#9b5e00',
      'warn--dark': '#512900',
    },
    fontFamily: {
      'chakra': ['Chakra Petch', 'sans-serif']
    }
  },
  darkMode: 'class',
  plugins: ["postcss-import"],
};
