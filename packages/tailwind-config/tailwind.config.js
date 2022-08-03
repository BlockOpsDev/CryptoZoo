

module.exports = {
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'layer--1': '#0e1324',
      'layer--2': '#161e31',
      'layer--3': '#212b3f',
      'layer--4': '#2e394d',

      'primary-text': '#ffffff',
      'secondary-text': '#94a3b8',

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
    }
  },
  darkMode: 'class',
  plugins: [],
};
