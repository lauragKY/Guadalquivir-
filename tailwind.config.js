/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sipresas: {
          primary: '#1e5a8e',
          secondary: '#2874b5',
          light: '#4a9fd8',
          lighter: '#a4c8e1',
          lightest: '#e8f2f9',
          dark: '#0d3859',
          darker: '#082841',
        },
        aqua: {
          dark: '#0e7490',
          DEFAULT: '#06b6d4',
          medium: '#22d3ee',
          light: '#67e8f9',
          lighter: '#cffafe',
        },
        institutional: {
          blue: '#1e5a8e',
          lightblue: '#4a9fd8',
          gray: '#6b7280',
          lightgray: '#e5e7eb',
          darkgray: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
