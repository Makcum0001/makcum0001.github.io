/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(255,0,43)',
        booked: 'rgb(228,0,43)'
      },
    },
  },
  plugins: [],
};
